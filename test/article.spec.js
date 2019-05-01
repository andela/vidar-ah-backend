/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import path from 'path';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import app from '../index';
import { article1, user2 } from './helpers/dummyData';
import { article2 } from './helpers/articleDummyData';
import { myUser } from './helpers/userDummyData';
import articleController from '../controllers/articles';

const {
  createArticle, dislikeArticle, likeArticle, getAllReactions
} = articleController;

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

let userToken;
let userToken2;
let token;
let articleSlug;
let articleSlug2;
let articleSlug3;
let reaction;

describe('ARTICLES', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(user2)
      .end((err, res) => {
        if (!err) {
          token = res.body.token;
        }
        done();
      });
  });

  describe('Create an article by an authenticated user but not verified', () => {
    it('should not create article if user is not verified.', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', token)
        .send(article1)
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(403);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('User has not been verified.');
          done(err);
        });
    });
  });

  describe('Create an article by an authenticated and verified user', () => {
    before(async () => { await updateVerifiedStatus(user2.email); });

    it('should create a new article.', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', token)
        .send(article1);
      const { status, body: { message, success, article: { slug } } } = res;
      articleSlug = slug;
      expect(status).to.be.equal(201);
      expect(success).to.be.equal(true);
      expect(message).to.be.equal('New article created successfully');
    });

    it('should return a server error.', async () => {
      const req = {
        user: { id: 3 },
        params: {
          slug: articleSlug,
        },
        body: {
          ...article1,
        }
      };
      const res = {
        status() {},
        json() {}
      };

      sinon.stub(res, 'status').returnsThis(500);
      await createArticle(req, res);
      expect(res.status).to.have.been.calledOnceWith(500);
    });

    it('should create a new article with image.', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', token)
        .attach('image', path.join(__dirname, 'assets', 'testImage.jpg'))
        .type('form')
        .field(article1);
      const { status, body: { message, success, article } } = res;
      expect(article.images).to.be.an('Array');
      expect(article.images[0]).to.be.a('String');
      expect(status).to.be.equal(201);
      expect(success).to.be.equal(true);
      expect(message).to.be.equal('New article created successfully');
    });

    it('should return an error when a wrong file format is uploaded.', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', token)
        .attach('image', path.join(__dirname, 'assets', 'testfile.wav'))
        .type('form')
        .field(article1);
      const { body: { success, error } } = res;
      expect(success).to.be.equal(false);
      expect(error).to.be.a('Array');
    });

    it('should not create if title is not set.', (done) => {
      article1.title = undefined;
      chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', token)
        .send(article1)
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors).to.be.an('Array');
          expect(errors[0]).to.be.equal('Article should have a title.');
          done(err);
        });
    });

    it('should not create if description is not set.', (done) => {
      article1.description = undefined;
      chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', token)
        .send(article1)
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors).to.be.an('Array');
          expect(errors[0]).to.be.equal('Article should have a title.');
          expect(errors[1]).to.be.equal('Title should be at least 6 characters long.');
          expect(errors[2]).to.be.equal('Article should have a description.');
          expect(errors[3]).to.be.equal('Description should be at least 6 characters long.');
          done(err);
        });
    });

    it('should not create if body is not set.', (done) => {
      article1.body = undefined;
      chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', token)
        .send(article1)
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors).to.be.an('Array');
          expect(errors[0]).to.be.equal('Article should have a title.');
          expect(errors[1]).to.be.equal('Title should be at least 6 characters long.');
          expect(errors[2]).to.be.equal('Article should have a description.');
          expect(errors[3]).to.be.equal('Description should be at least 6 characters long.');
          expect(errors[4]).to.be.equal('Article should have a body.');
          expect(errors[5]).to.be.equal('Article should have a body with at least 6 characters.');
          done(err);
        });
    });
  });

  describe('Create an article by an unauthenticated user', () => {
    it('should report unauthorised to access endpoint.', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles')
        .send(article1)
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(401);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Unauthorized! You are required to be logged in to perform this operation.');
          done(err);
        });
    });
  });

  describe('Create an article by an unauthenticated user with an invalid token', () => {
    it('should not report an invalid token.', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', 'asdfghjkl')
        .send(article1)
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(401);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Your session has expired, please login again to continue');
          done(err);
        });
    });
  });

  describe('Search for articles without term keyword in the request query', () => {
    it('should return an error', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/search')
        .end((err, res) => {
          const { status, body: { success, errors } } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors).to.be.an('Array');
          expect(errors[0]).to.be.equals('Please provide a valid search term.');
          done(err);
        });
    });
  });

  describe('Search for articles with just a term keyword in the request query', () => {
    it('should return an array of results.', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/search?term=This')
        .end((err, res) => {
          const { status, body: { success, results } } = res;
          expect(status).to.be.equal(200);
          expect(success).to.be.equal(true);
          expect(results.rows).to.be.an('Array');
          done(err);
        });
    });
  });

  describe('Search for articles with a term keyword and an author filter', () => {
    it('should return an array of results', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/search?term=This&author=flippingg')
        .end((err, res) => {
          const { status, body: { success, results } } = res;
          expect(status).to.be.equal(200);
          expect(success).to.be.equal(true);
          expect(results.rows).to.be.an('Array');
          done(err);
        });
    });
  });

  describe('Search for articles with a term keyword and a date range filter', () => {
    it('should return an array of results', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/search?term=This&startDate=2018-10-10&endDate=2020-10-10')
        .end((err, res) => {
          const { status, body: { success, results } } = res;
          expect(status).to.be.equal(200);
          expect(success).to.be.equal(true);
          expect(results.rows).to.be.an('Array');
          done(err);
        });
    });
  });

  describe('Search for articles with a term keyword and a tags filter', () => {
    it('should return an array of results', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/search?term=This&tags=art')
        .end((err, res) => {
          const { status, body: { success, results } } = res;
          expect(status).to.be.equal(200);
          expect(success).to.be.equal(true);
          expect(results.rows).to.be.an('Array');
          done(err);
        });
    });
  });

  describe('Get an article by a wrong slug', () => {
    it('should return a 404 error', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/eirubefhdkjcsdc')
        .end((err, res) => {
          const { status, body: { success, errors } } = res;
          expect(status).to.be.equal(404);
          expect(success).to.be.equal(false);
          expect(errors).to.be.an('Array');
          expect(errors[0]).to.equal('Article not found.');
          done(err);
        });
    });
  });
});

describe('/PUT articles slug', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/user/login')
      .send(user2)
      .end((err, res) => {
        if (!err) {
          userToken = res.body.token;
        }
        done();
      });
  });


  it('should update an article', (done) => {
    chai
      .request(app)
      .put(`/api/v1/articles/${articleSlug}`)
      .set('authorization', userToken)
      .send(article2)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success').equal(true);
        expect(res.body).to.have.property('message').equal('Article updated successfully');
        done(err);
      });
  });

  it('should return an error if the article is not found', (done) => {
    chai
      .request(app)
      .put('/api/v1/articles/eab6fbb6-aeda-4e1b-b4be-3582f51a6d30')
      .set('authorization', userToken)
      .send(article2)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('success').equal(false);
        expect(res.body.errors).to.be.an('Array');
        expect(res.body.errors[0]).to.be.equal('Article not found');
        done(err);
      });
  });
});

describe('/PUT articles slug', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(myUser)
      .end((err, res) => {
        userToken2 = res.body.token;
        done();
      });
  });

  before(async () => { await updateVerifiedStatus(myUser.email); });
  it('should return an error if the user is not the owner of the article', async () => {
    const res = await chai
      .request(app)
      .put(`/api/v1/articles/${articleSlug}`)
      .set('authorization', userToken2)
      .send(article2);
    expect(res).to.have.status(403);
    expect(res.body).to.have.property('success').equal(false);
    expect(res.body.errors).to.be.an('Array');
    expect(res.body.errors[0]).to.be.equal('You are unauthorized to perform this action');
  });
});

describe('/GET articles', () => {
  describe('Get an article by its slug', () => {
    it('should return the article', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${articleSlug}`)
        .set('authorization', token)
        .end((err, res) => {
          const {
            status, body: {
              success,
              article,
              likeCount,
              dislikeCount,
              userReaction
            }
          } = res;
          expect(status).to.be.equal(200);
          expect(success).to.be.equal(true);
          expect(article).to.be.an('object');
          expect(article).to.haveOwnProperty('id');
          expect(article).to.haveOwnProperty('slug');
          expect(article).to.haveOwnProperty('title');
          expect(article).to.haveOwnProperty('body');
          expect(article).to.haveOwnProperty('description');
          expect(article).to.haveOwnProperty('author');
          expect(likeCount).to.be.equal(0);
          expect(dislikeCount).to.be.equal(0);
          expect(userReaction).to.be.equal(null);
          done(err);
        });
    });
    it('should return the article if user is not logged in', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${articleSlug}`)
        .end((err, res) => {
          const {
            status, body: {
              success,
              article,
              likeCount,
              dislikeCount,
            }
          } = res;
          expect(status).to.be.equal(200);
          expect(success).to.be.equal(true);
          expect(article).to.be.an('object');
          expect(article).to.haveOwnProperty('id');
          expect(article).to.haveOwnProperty('slug');
          expect(article).to.haveOwnProperty('title');
          expect(article).to.haveOwnProperty('body');
          expect(article).to.haveOwnProperty('description');
          expect(article).to.haveOwnProperty('author');
          expect(likeCount).to.be.equal(0);
          expect(dislikeCount).to.be.equal(0);
          done(err);
        });
    });
  });
  it('should return pagination metadata', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles?offset=0&limit=10')
      .end((err, res) => {
        const {
          body: {
            results: {
              rows,
              count
            },
            totalPages,
            currentPage
          },
        } = res;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success').equal(true);
        expect(rows).to.be.an('array');
        expect(totalPages).to.be.a('number');
        expect(currentPage).to.be.a('number');
        expect(count).to.be.a('number');
        done(err);
      });
  });

  it('should return articles based on passed query params', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles/order?type=latest')
      .end((err, res) => {
        const {
          body: {
            articles,
            message
          },
        } = res;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success').equal(true);
        expect(message).to.be.equals('Articles returned successfully.');
        expect(articles).to.be.an('array');
        done(err);
      });
  });

  it('should return articles based on passed query params', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles/order?type=comments')
      .end((err, res) => {
        const {
          body: {
            articles,
            message
          },
        } = res;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success').equal(true);
        expect(articles).to.be.an('array');
        expect(message).to.be.equals('Articles returned successfully.');
        done(err);
      });
  });

  it('should return articles based on passed query params', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles/order?type=ratings')
      .end((err, res) => {
        const {
          body: {
            articles
          },
        } = res;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success').equal(true);
        expect(articles).to.be.an('array');
        done(err);
      });
  });

  it('should return an error if there is no order type', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles/order')
      .end((err, res) => {
        const {
          body: {
            errors
          },
        } = res;
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('success').equal(false);
        expect(errors).to.be.an('array');
        expect(errors[0]).to.be.equals('Please provide a type of order to get.');
        done(err);
      });
  });

  it('should return an error if order type is invalid', (done) => {
    chai
      .request(app)
      .get('/api/v1/articles/order?type=erwdcsx')
      .end((err, res) => {
        const {
          body: {
            errors
          },
        } = res;
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('success').equal(false);
        expect(errors).to.be.an('array');
        expect(errors[0]).to.be.equals('Order type should either be latest, ratings or comments');
        done(err);
      });
  });
});

describe('/DELETE articles slug', () => {
  it('should return an error if the user is not the owner of the article', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${articleSlug}`)
      .set('authorization', userToken2)
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body).to.have.property('success').equal(false);
        expect(res.body.errors[0]).to.be.equal('You are unauthorized to perform this action');
        done(err);
      });
  });

  it('should delete an article', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${articleSlug}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success').equal(true);
        expect(res.body).to.have.property('message').equal('Article deleted successfully');
        done(err);
      });
  });

  it('should return a server error.', async () => {
    const req = {
      user: {
        id: null
      },
      params: {
        slug: null
      },
      body: {
        slug: null
      }
    };
    const res = {
      status() {},
      json() {}
    };

    sinon.stub(res, 'status').returnsThis(500);
    await likeArticle(req, res);
    expect(res.status).to.have.been.calledOnceWith(500);
  });

  it('should return an error if the article is not found', (done) => {
    chai
      .request(app)
      .delete('/api/v1/articles/eab6fbb6-aeda-4e1b-b4be-3582f51a6d30')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('success').equal(false);
        expect(res.body.errors[0]).to.be.equal('Article not found');
        done(err);
      });
  });
});


describe('/POST articles like', () => {
  it('should create an article', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('authorization', userToken)
      .send(article2)
      .end((err, res) => {
        articleSlug2 = res.body.article.slug;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('success').equal(true);
        expect(res.body).to.have.property('message').equal('New article created successfully');
        done(err);
      });
  });

  it('should return a server error.', async () => {
    const req = {
      user: {
        id: null
      },
      params: {
        slug: null
      },
      body: {
        slug: null
      }
    };
    const res = {
      status() {},
      json() {}
    };

    sinon.stub(res, 'status').returnsThis(500);
    await likeArticle(req, res);
    expect(res.status).to.have.been.calledOnceWith(500);
  });

  it('should create another article', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('authorization', userToken)
      .send(article2)
      .end((err, res) => {
        articleSlug3 = res.body.article.slug;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('success').equal(true);
        expect(res.body).to.have.property('message').equal('New article created successfully');
        done(err);
      });
  });

  it('should return an error if the article is not found', (done) => {
    chai
      .request(app)
      .post('/api/v1/like_article')
      .set('authorization', userToken2)
      .send({ slug: 'article-writingd-b4nfgik' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('success').equal(false);
        expect(res.body.errors[0]).to.be.equal('Article not found');
        done(err);
      });
  });

  it('should create an article like reaction', (done) => {
    chai
      .request(app)
      .post('/api/v1/like_article')
      .set('authorization', userToken2)
      .send({ slug: articleSlug2 })
      .end((err, res) => {
        reaction = res.body.reaction;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('success').equal(true);
        expect(res.body).to.have.property('message').equal('You have liked this article');
        done(err);
      });
  });

  it('should create an article like reaction', (done) => {
    chai
      .request(app)
      .post('/api/v1/like_article')
      .set('authorization', userToken2)
      .send({ slug: articleSlug3 })
      .end((err, res) => {
        reaction = res.body.reaction;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('success').equal(true);
        expect(res.body).to.have.property('message').equal('You have liked this article');
        done(err);
      });
  });

  it('should unlike an article reaction if the article has been liked', (done) => {
    chai
      .request(app)
      .post('/api/v1/like_article')
      .set('authorization', userToken2)
      .send({ slug: articleSlug2 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success').equal(true);
        expect(res.body).to.have.property('message').equal('You have unliked this article');
        done(err);
      });
  });
});

describe('Get a liked article by its slug', () => {
  it('should return the article', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${articleSlug3}`)
      .set('authorization', userToken2)
      .end((err, res) => {
        const {
          status, body: {
            success,
            article,
            likeCount,
            dislikeCount,
            userReaction
          }
        } = res;
        expect(status).to.be.equal(200);
        expect(success).to.be.equal(true);
        expect(article).to.be.an('object');
        expect(article).to.haveOwnProperty('id');
        expect(article).to.haveOwnProperty('slug');
        expect(article).to.haveOwnProperty('title');
        expect(article).to.haveOwnProperty('body');
        expect(article).to.haveOwnProperty('description');
        expect(article).to.haveOwnProperty('author');
        expect(likeCount).to.be.equal(1);
        expect(dislikeCount).to.be.equal(0);
        expect(userReaction).to.be.equal('like');
        done(err);
      });
  });
});

describe('/POST articles dislike', () => {
  it('should create an article dislike reaction', (done) => {
    chai
      .request(app)
      .post('/api/v1/dislike_article')
      .set('authorization', userToken2)
      .send({ slug: articleSlug2 })
      .end((err, res) => {
        reaction = res.body.reaction;
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('success').equal(true);
        expect(res.body).to.have.property('message').equal('You have disliked this article');
        done(err);
      });
  });

  it('should remove an article reaction if the article has been disliked', (done) => {
    chai
      .request(app)
      .post('/api/v1/dislike_article')
      .set('authorization', userToken2)
      .send({ slug: articleSlug2 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success').equal(true);
        expect(res.body).to.have.property('message').equal('You have removed the dislike on this article');
        done(err);
      });
  });

  it('should return a server error.', async () => {
    const req = {
      user: {
        id: null
      },
      params: {
        slug: null
      },
      body: {
        slug: null
      }
    };
    const res = {
      status() {},
      json() {}
    };

    sinon.stub(res, 'status').returnsThis(500);
    await dislikeArticle(req, res);
    expect(res.status).to.have.been.calledOnceWith(500);
  });

  it('create an article with a wrong token', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .send(article1)
      .set('authorization', 'eyj.wpiecjwirejncvoeie[spcjoeirnoeirjnoeircerr')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('success').equal(false);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors[0]).equal('Your session has expired, please login again to continue');
        done(err);
      });
  });
});
describe('Make a request with an invalid token', () => {
  it('should return session expired', (done) => {
    const invalidToken = `${userToken2}111`;
    chai
      .request(app)
      .get(`/api/v1/articles/${articleSlug2}`)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        const { status, body: { success, errors } } = res;
        expect(status).to.be.equal(401);
        expect(success).to.be.equal(false);
        expect(errors[0]).to.be.equal('Your session has expired, please login again to continue');
        done(err);
      });
  });
});

describe("Make a request to get all reaction on a user's article", () => {
  it('should return all user reations', (done) => {
    chai
      .request(app)
      .get('/api/v1/user/article_reactions')
      .set('Authorization', userToken2)
      .end((err, res) => {
        const {
          status, body: {
            success, message, likes, dislikes
          }
        } = res;
        expect(status).to.be.equal(200);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('Successfully gotten all reactions on user articles.');
        expect(likes).to.be.a('number');
        expect(dislikes).to.be.a('number');
        done(err);
      });
  });
});
