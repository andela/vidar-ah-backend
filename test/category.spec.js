import chai from 'chai';
import chaiHttp from 'chai-http';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import assignRole from './helpers/assignRole';
import app from '../index';
import {
  user,
  validCategory,
  invalidCategoryTooShort,
  invalidCategoryDuplicate,
  validCategoryEdit
} from './helpers/categoryDummyData';

import { User, Category } from '../models';

chai.use(chaiHttp);
const { expect } = chai;
let userToken;
let categoryId;

describe('TESTIN THE CATEGORY FEATURE', () => {
  before(async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(user);
    userToken = res.body.token;
    // .end((err, res) => {
    //   if (!err) {
    //     const { body } = res;
    //     userToken = body.token;
    //   }
    // done();
    // });
  });
  after(async () => {
    await User.truncate({ cascade: false });
    await Category.truncate({ cascade: false });
  });

  describe('CREATE CATEGORY', () => {
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

    describe('Make a request as regular user without admin authorization', () => {
      before((done) => {
        updateVerifiedStatus(user.email);
        assignRole(user.email, 'user');
        done();
      });
      it('It should return a 401 unauthorized error', (done) => {
        chai
          .request(app)
          .post('/api/v1/category')
          .set('authorization', userToken)
          .send(validCategory)
          .end((err, res) => {
            const { status, body: { success, errors } } = res;
            expect(status).to.be.equal(401);
            expect(success).to.be.equal(false);
            expect(errors[0]).to.be.equal('Unauthorized! This operation is reserved for Admin or higher.');
            done(err);
          });
      });
    });

    describe('Make a request with admin credentials', () => {
      before((done) => {
        // updateVerifiedStatus(user.email);
        assignRole(user.email, 'admin');
        done();
      });
      it('should return a success message with status 201', (done) => {
        chai
          .request(app)
          .post('/api/v1/category')
          .set('x-access-token', userToken)
          .send(validCategory)
          .end((err, res) => {
            const {
              status,
              body: {
                success, message, id, categoryName
              }
            } = res;
            categoryId = id;
            expect(status).to.be.equal(201);
            expect(success).to.be.equal(true);
            expect(message).to.be.equal('Category successfully added.');
            expect(categoryName).to.be.equal(validCategory.category.toLowerCase());
            done(err);
          });
      });
    });

    describe('Make a request with duplicate category', () => {
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

    describe('Make a request with invalid/expired token', () => {
      let badToken;
      before((done) => {
        badToken = userToken.concat('a');
        done();
      });
      it('should return a 401 error message', (done) => {
        chai
          .request(app)
          .post('/api/v1/category')
          .set('authorization', badToken)
          .send(validCategory)
          .end((err, res) => {
            const {
              status,
              body: { success, errors }
            } = res;
            expect(status).to.be.equal(401);
            expect(success).to.be.equal(false);
            expect(errors[0]).to.be.equal('Your session has expired, please login again to continue');
            done(err);
          });
      });
    });
  });

  describe('EDIT CATEGORY', () => {
    describe('Make a request with valid admin credentials', () => {
      before((done) => {
        updateVerifiedStatus(user.email);
        assignRole(user.email, 'admin');
        done();
      });
      it('it should return a 200 success message', (done) => {
        chai
          .request(app)
          .patch('/api/v1/category/'.concat(categoryId))
          .set('authorization', userToken)
          .send(validCategoryEdit)
          .end((err, res) => {
            const {
              status,
              body: { success, message }
            } = res;
            expect(status).to.be.equal(200);
            expect(success).to.be.equal(true);
            expect(message).to.be.equal('Category successfully updated');
            done(err);
          });
      });
    });

    describe('Make a request with invalid id', () => {
      it('it should return a 400 error', (done) => {
        chai
          .request(app)
          .patch('/api/v1/category/y'.concat(categoryId))
          .set('authorization', userToken)
          .send(validCategory)
          .end((err, res) => {
            const {
              status,
              body: { success, errors }
            } = res;
            expect(status).to.be.equal(400);
            expect(success).to.be.equal(false);
            expect(errors[0]).to.be.equal('Invalid category id. Category id must be a positive integer.');
            done(err);
          });
      });
    });

    describe('Make a request with non existing id', () => {
      it('it should return a 404 error', (done) => {
        chai
          .request(app)
          .patch('/api/v1/category/100000')
          .set('authorization', userToken)
          .send(validCategory)
          .end((err, res) => {
            const {
              status,
              body: { success, errors }
            } = res;
            expect(status).to.be.equal(404);
            expect(success).to.be.equal(false);
            expect(errors[0]).to.be.equal('No category matches the specified id. Please confirm the category Id and try again.');
            done(err);
          });
      });
    });
  });
});
