// Require the dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../index';
import { validUser1 } from './helpers/userDummyData';

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

describe('Make a request to an unidentified route', () => {
  it('returns 404 error', (done) => {
    chai
      .request(app)
      .get('/wrong-url')
      .end((err, res) => {
        const {
          status,
          body: { error }
        } = res;
        expect(status).to.be.equal(404);
        expect(error).to.be.equal('Page not found.');
        done(err);
      });
  });
});

describe('Make a request to signup with valid details', () => {
  it('returns sucessfully signed up.', (done) => {
    chai
      .request(app)
      .post('/api/v1/user')
      .send(validUser1)
      .end((err, res) => {
        const {
          status,
          body: { message, success }
        } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('You have signed up successfully.');
        done(err);
      });
  });
});

describe('Make a request to signup with empty signup fields', () => {
  it('returns an invalid error.', (done) => {
    chai
      .request(app)
      .post('/api/v1/user')
      .end((err, res) => {
        const {
          status,
          body: { errors, success }
        } = res;
        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Please enter a valid email address');
        expect(errors[1]).to.be.equal('Password must be at least 6 characters long.');
        expect(errors[2]).to.be.equal('Name must be alphanumeric characters.');
        expect(errors[3]).to.be.equal(
          'Username is should be alphamumeric, no special characters and spaces.'
        );
        expect(errors[4]).to.be.equal('Username must be at least 5 characters long and not more than 15.');
        done(err);
      });
  });
});

describe('Make a request to signup with an empty username', () => {
  it('returns an invalid error.', (done) => {
    chai
      .request(app)
      .post('/api/v1/user')
      .send({
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        const {
          status,
          body: { errors, success }
        } = res;
        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Username is should be alphamumeric, no special characters and spaces.');
        expect(errors[1]).to.be.equal('Username must be at least 5 characters long and not more than 15.');
        done(err);
      });
  });
});

describe('Make a request to signup with an empty email', () => {
  it('returns an invalid error.', (done) => {
    chai
      .request(app)
      .post('/api/v1/user')
      .send({
        username: faker.internet.userName(),
        name: faker.name.findName(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        const {
          status,
          body: { errors, success }
        } = res;
        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Please enter a valid email address');
        done(err);
      });
  });
});

describe('Make a request to signup with an empty name', () => {
  it('returns an invalid error.', (done) => {
    chai
      .request(app)
      .post('/api/v1/user')
      .send({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      })
      .end((err, res) => {
        const {
          status,
          body: { errors, success }
        } = res;
        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Name must be alphanumeric characters.');
        done(err);
      });
  });
});

describe('Make a request to signup with an empty password', () => {
  it('returns an invalid error.', (done) => {
    chai
      .request(app)
      .post('/api/v1/user')
      .send({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        name: faker.name.findName()
      })
      .end((err, res) => {
        const {
          status,
          body: { errors, success }
        } = res;
        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Password must be at least 6 characters long.');
        done(err);
      });
  });
});

describe('Make a request to signup with existing email', () => {
  it('returns an invalid error.', (done) => {
    chai
      .request(app)
      .post('/api/v1/user')
      .send(validUser1)
      .end((err, res) => {
        const {
          status,
          body: { errors, success }
        } = res;
        expect(status).to.be.equal(409);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Email already exists');
        done(err);
      });
  });
});

describe('Make a request to signup with existing username', () => {
  it('returns an invalid error.', (done) => {
    const { username } = validUser1;
    chai
      .request(app)
      .post('/api/v1/user')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
        username
      })
      .end((err, res) => {
        const {
          status,
          body: { errors, success }
        } = res;
        expect(status).to.be.equal(409);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Username already exists');
        done(err);
      });
  });
});
