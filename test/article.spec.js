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
  let slug;

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
          const { status, body: { message, success, article } } = res;
          slug = article.slug;
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
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(401);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Unauthorized! You are required to be logged in to perform this operation.');
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
          expect(results).to.be.an('Array');
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
          expect(results).to.be.an('Array');
          done(err);
        });
    });
  });

  describe('Search for articles with a term keyword and a date range filter', () => {
    it('Should should return an array of results', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/search?term=This&startDate=2018-10-10&endDate=2020-10-10')
        .end((err, res) => {
          const { status, body: { success, results } } = res;
          expect(status).to.be.equal(200);
          expect(success).to.be.equal(true);
          expect(results).to.be.an('Array');
          done(err);
        });
    });
  });

  describe('Search for articles with a term keyword and a tags filter', () => {
    it('Should should return an array of results', (done) => {
      chai
        .request(app)
        .get('/api/v1/articles/search?term=This&tags=art')
        .end((err, res) => {
          const { status, body: { success, results } } = res;
          expect(status).to.be.equal(200);
          expect(success).to.be.equal(true);
          expect(results).to.be.an('Array');
          done(err);
        });
    });
  });

  describe('Get an article by its slug', () => {
    it('Should should return an array of results', (done) => {
      chai
        .request(app)
        .get(`/api/v1/articles/${slug}`)
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
