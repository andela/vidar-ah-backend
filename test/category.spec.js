import chai from 'chai';
import chaiHttp from 'chai-http';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import app from '../index';
import {
  validCategory,
  invalidCategoryTooShort,
  invalidCategoryDuplicate,
} from './helpers/categoryDummyData';

import { newUser2 } from './helpers/userDummyData';

chai.use(chaiHttp);
const { expect } = chai;


describe('CREATE CATEGORY', () => {
  let userToken;

  before((done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(newUser2)
      .end((err, res) => {
        if (!err) {
          const { body } = res;
          userToken = body.token;
        }
        done();
      });
  });

  describe('Make a request without a token', () => {
    it('It should return a 401 unauthorized error', (done) => {
      chai
        .request(app)
        .post('/api/v1/category')
        .send(validCategory)
        .end((err, res) => {
          const { status, body: { success, errors } } = res;
          expect(status).to.be.equal(401);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Unauthorized! You are required to be logged in to perform this operation.');
          done(err);
        });
    });
  });

  describe('Make a request without verifying your account', () => {
    it('should return an error status 403', (done) => {
      chai
        .request(app)
        .post('/api/v1/category')
        .set('authorization', userToken)
        .send(validCategory)
        .end((err, res) => {
          const {
            status,
            body: { success, errors }
          } = res;
          expect(status).to.be.equal(403);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('User has not been verified.');
          done(err);
        });
    });
  });

  describe('Make a request with valid and verified credentials', () => {
    before(() => { updateVerifiedStatus(newUser2.email); });
    it('should return a success message with status 201', (done) => {
      chai
        .request(app)
        .post('/api/v1/category')
        .set('authorization', userToken)
        .send(validCategory)
        .end((err, res) => {
          const {
            status,
            body: { success, message, categoryName }
          } = res;
          expect(status).to.be.equal(201);
          expect(success).to.be.equal(true);
          expect(message).to.be.equal('Category successfully added.');
          expect(categoryName).to.be.equal(validCategory.category.toLowerCase());
          done(err);
        });
    });
  });

  describe('Make a request with duplicate category', () => {
    before(() => { updateVerifiedStatus(newUser2.email); });
    it('should return a 409 error message', (done) => {
      chai
        .request(app)
        .post('/api/v1/category')
        .set('authorization', userToken)
        .send(invalidCategoryDuplicate)
        .end((err, res) => {
          const {
            status,
            body: { success, errors }
          } = res;
          expect(status).to.be.equal(409);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('The specified category already exists');
          done(err);
        });
    });
  });

  describe('Make a request with category name less than 3 letters', () => {
    before(() => { updateVerifiedStatus(newUser2.email); });
    it('should return a 422 error message', (done) => {
      chai
        .request(app)
        .post('/api/v1/category')
        .set('authorization', userToken)
        .send(invalidCategoryTooShort)
        .end((err, res) => {
          const {
            status,
            body: { success, errors }
          } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Category must be at least 3 characters long and no more than 30.');
          done(err);
        });
    });
  });
  describe('Make a request with category not specified', () => {
    before(() => { updateVerifiedStatus(newUser2.email); });
    it('should return a 422 error message', (done) => {
      chai
        .request(app)
        .post('/api/v1/category')
        .set('authorization', userToken)
        .end((err, res) => {
          const {
            status,
            body: { success, errors }
          } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('No category provided. Please provide a category.');
          done(err);
        });
    });
  });
});
