/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import app from '../index';
import { article1, user2 } from './helpers/dummyData';
import { article2 } from './helpers/articleDummyData';
import { myUser } from './helpers/userDummyData';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;
let userToken2;
let token;
let articleSlug;

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

    it('Should create a new article.', async () => {
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
    it('Should should return an error', (done) => {
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
    it('Should should return an array of results.', (done) => {
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
    it('Should should return an array of results', (done) => {
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

  describe('Get an article by its slug', () => {
    it('should return an array of results', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${articleSlug}`)
        .end((err, res) => {
          const { status, body: { success, article } } = res;
          expect(status).to.be.equal(200);
          expect(success).to.be.equal(true);
          expect(article).to.be.an('object');
          expect(article).to.haveOwnProperty('id');
          expect(article).to.haveOwnProperty('slug');
          expect(article).to.haveOwnProperty('title');
          expect(article).to.haveOwnProperty('body');
          expect(article).to.haveOwnProperty('description');
          expect(article).to.haveOwnProperty('author');
          done(err);
        });
    });
  });

  describe('Get an article by a wrong slug', () => {
    it('Should should return a 404 error', (done) => {
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
