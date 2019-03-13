/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import app from '../index';
import { article1, user2 } from './helpers/dummyData';

chai.use(chaiHttp);
const { expect } = chai;


describe('ARTICLES', () => {
  let token;

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
          const { status, body: { message, success } } = res;
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
