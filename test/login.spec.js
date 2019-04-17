// Require the dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../index';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import { newUser, validLoginUser, superAdmin } from './helpers/userDummyData';

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

describe('User login authentication: ', () => {
  before(async () => {
    await chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(newUser);
  });

  describe('Make a request with unverified email', () => {
    it('should return an error status 403', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .send(validLoginUser)
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

  describe('Make a request with valid credentials', () => {
    before(async () => {
      await updateVerifiedStatus(validLoginUser.email);
    });
    it('should return a success message with status 200', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/user/login')
        .send(validLoginUser);
      const {
        status,
        body: { success, message }
      } = res;
      expect(status).to.be.equal(200);
      expect(success).to.be.equal(true);
      expect(message).to.be.equal('Welcome testing123559');
    });
  });

  describe('Make a request without email and password', () => {
    it('should return 422 error', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .end((err, res) => {
          const {
            status,
            body: { success, errors }
          } = res;
          expect(status).to.be.equal(422);
          expect(errors).to.be.an('Array');
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Please provide a valid email.');
          expect(errors[1]).to.be.equal('Please provide a valid password.');
          done(err);
        });
    });
  });

  describe('Make a request without email', () => {
    it('should return an error message with status 422', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .send({ password: faker.internet.password() })
        .end((err, res) => {
          const {
            status,
            body: { success, errors }
          } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Please provide a valid email.');
          done(err);
        });
    });
  });

  describe('Make a request without password', () => {
    it('should return an error message with status 422', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .send({ email: faker.internet.email() })
        .end((err, res) => {
          const {
            status,
            body: { success, errors }
          } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Please provide a valid password.');
          done(err);
        });
    });
  });

  describe('Make a request with invalid email', () => {
    it('should return an error message with status 404', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .send({
          email: 'nonexistinguser@gmail.com',
          password: 'testing'
        })
        .end((err, res) => {
          const {
            status,
            body: { success, errors }
          } = res;
          expect(status).to.be.equal(404);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('User not found.');
          done(err);
        });
    });
  });

  describe('Make a request with invalid password', () => {
    before(() => {
      updateVerifiedStatus(validLoginUser.email);
    });
    it('should return an error message with status 401', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .send({
          email: 'testing123559@gmail.com',
          password: 'incorrectPassword'
        })
        .end((err, res) => {
          const {
            status,
            body: { success, errors }
          } = res;
          expect(status).to.be.equal(401);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Password is incorrect. * Forgotten your password?');
          done(err);
        });
    });
  });

  describe('Make a request to login with super admin credentials', () => {
    it('should return a success message with status 200', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/user/login')
        .send(superAdmin);
      const {
        status,
        body: { success, message }
      } = res;
      expect(res.body).be.an('object').which.has.keys(['success', 'message', 'token', 'user']);
      expect(status).to.be.equal(200);
      expect(success).to.be.equal(true);
      expect(message).to.be.equal(`Welcome ${superAdmin.username}`);
    });
  });
});
