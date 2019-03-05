// Require the dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../index';

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

const newUser = {
  email: 'testing123559@gmail.com',
  password: 'testing',
  name: 'testing testing',
  username: 'testing123559',
};

const validUser = {
  email: 'testing123559@gmail.com',
  password: 'testing',
};

describe('User login authentication: ', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/user')
      .send(newUser)
      .end((err) => {
        done(err);
      });
  });

  describe('Make a request with valid credentials', () => {
    it('Returns a success message with status 200', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .send(validUser)
        .end((err, res) => {
          const { status, body: { success, message } } = res;
          expect(status).to.be.equal(200);
          expect(success).to.be.equal(true);
          expect(message).to.be.equal('Welcome testing123559');
          done(err);
        });
    });
  });

  describe('Make a request without email and password', () => {
    it('Returns 422 error', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .end((err, res) => {
          const { status, body: { success, errors } } = res;
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
    it('Returns an error message with status 422', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .send({ password: faker.internet.password() })
        .end((err, res) => {
          const { status, body: { success, errors } } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Please provide a valid email.');
          done(err);
        });
    });
  });

  describe('Make a request without password', () => {
    it('Returns an error message with status 422', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .send({ email: faker.internet.email() })
        .end((err, res) => {
          const { status, body: { success, errors } } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Please provide a valid password.');
          done(err);
        });
    });
  });

  describe('Make a request with invalid email', () => {
    it('Returns an error message with status 404', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .send({
          email: 'nonexistinguser@gmail.com',
          password: 'testing'
        })
        .end((err, res) => {
          const { status, body: { success, errors } } = res;
          expect(status).to.be.equal(404);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Invalid credentials');
          done(err);
        });
    });
  });

  describe('Make a request with invalid password', () => {
    it('Returns an error message with status 401', (done) => {
      chai
        .request(app)
        .post('/api/v1/user/login')
        .send({
          email: 'testing123559@gmail.com',
          password: 'incorrectPassword'
        })
        .end((err, res) => {
          const { status, body: { success, errors } } = res;
          expect(status).to.be.equal(401);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Invalid credentials');
          done(err);
        });
    });
  });
});
