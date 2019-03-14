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
let articleId;

describe('ARTICLES', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/user')
      .send(user2)
      .end((err, res) => {
        if (!err) {
          token = res.body.token;
        }
        done();
      });
  });

  describe('Create an article by an authenticated user but not verified', () => {
    it('Should not create article if user is not verified.', (done) => {
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
    before(() => { updateVerifiedStatus(user2.email); });

    it('Should create a new article.', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', token)
        .send(article1)
        .end((err, res) => {
          const { status, body: { message, success, article: { id } } } = res;
          articleId = id;
          expect(status).to.be.equal(201);
          expect(success).to.be.equal(true);
          expect(message).to.be.equal('New article created successfully');
          done(err);
        });
    });

    it('Should not create if title is not set.', (done) => {
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

    it('Should not create if description is not set.', (done) => {
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

    it('Should not create if body is not set.', (done) => {
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
    it('Should report unauthorised to access endpoint.', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles')
        .send(article1)
        .end((err, res) => {
          const { status, body: { message, success } } = res;
          expect(status).to.be.equal(401);
          expect(success).to.be.equal(false);
          expect(message).to.be.equal('Unauthorized! You are required to be logged in to perform this operation.');
          done(err);
        });
    });
  });

  describe('Create an article by an unauthenticated user with an invalid token', () => {
    it('Should not report an invalid token.', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', 'asdfghjkl')
        .send(article1)
        .end((err, res) => {
          const { status, body: { message, success } } = res;
          expect(status).to.be.equal(401);
          expect(success).to.be.equal(false);
          expect(message).to.be.equal('Your session has expired, please login again to continue');
          done(err);
        });
    });
  });
});

describe('/PUT articles id', () => {
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
      .put(`/api/v1/articles/${articleId}`)
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
        expect(res.body).to.have.property('error').equal('Article not found');
        done(err);
      });
  });
});

describe('/PUT articles id', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/user/')
      .send(myUser)
      .end((err, res) => {
        userToken2 = res.body.token;
        done();
      });
  });

  before(() => { updateVerifiedStatus(myUser.email); });
  it('should return an error if the user is not the owner of the article', (done) => {
    chai
      .request(app)
      .put(`/api/v1/articles/${articleId}`)
      .set('authorization', userToken2)
      .send(article2)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('success').equal(false);
        expect(res.body).to.have.property('error').equal('You are unauthorized to perform this action');
        done(err);
      });
  });
});

describe('/DELETE articles id', () => {
  it('should return an error if the user is not the owner of the article', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${articleId}`)
      .set('authorization', userToken2)
      .send(article2)
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('success').equal(false);
        expect(res.body).to.have.property('error').equal('You are unauthorized to perform this action');
        done(err);
      });
  });

  it('should delete an article', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/articles/${articleId}`)
      .set('authorization', userToken)
      .send(article2)
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
      .send(article2)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property('success').equal(false);
        expect(res.body).to.have.property('error').equal('Article not found');
        done(err);
      });
  });
});
