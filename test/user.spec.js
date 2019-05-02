// Require the dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../index';
import { validUser1, user3 } from './helpers/userDummyData';
import getVerificationId from './helpers/getVerificationId';

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;
let userToken;

describe('Make a request to an unidentified route', () => {
  it('returns 404 error', (done) => {
    chai
      .request(app)
      .get('/wrong-url')
      .end((err, res) => {
        const { status, body: { error } } = res;
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
      .post('/api/v1/user/signup')
      .send(validUser1)
      .end((err, res) => {
        const { status, body: { message, success, token } } = res;
        userToken = token;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('You have signed up successfully.');
        done(err);
      });
  });
});

describe('Make a request to signup with valid details', () => {
  it('returns sucessfully signed up.', (done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(user3)
      .end((err, res) => {
        const { status, body: { message, success } } = res;
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
      .post('/api/v1/user/signup')
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Please enter a valid email address');
        expect(errors[1]).to.be.equal('Password must be at least 6 characters long.');
        expect(errors[2]).to.be.equal('Name must be alphanumeric characters.');
        expect(errors[3]).to.be.equal('Username is should be alphamumeric, no special characters and spaces.');
        expect(errors[4]).to.be.equal('Username must be at least 5 characters long and not more than 15.');
        done(err);
      });
  });
});

describe('Make a request to signup with an empty username', () => {
  it('returns an invalid error.', (done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send({
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password(),
      })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
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
      .post('/api/v1/user/signup')
      .send({
        username: faker.internet.userName(),
        name: faker.name.findName(),
        password: faker.internet.password(),
      })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Please enter a valid email address');
        done(err);
      });
  });
});

describe('Make a request to signup with an invalid email', () => {
  it('returns an invalid error.', (done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send({
        username: 'testiguserusername',
        name: 'name',
        password: 'some-password',
        email: 'bademail'
      })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
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
      .post('/api/v1/user/signup')
      .send({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
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
      .post('/api/v1/user/signup')
      .send({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        name: faker.name.findName()
      })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
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
      .post('/api/v1/user/signup')
      .send(validUser1)
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
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
      .post('/api/v1/user/signup')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.findName(),
        username,
      })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(409);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Username already exists');
        done(err);
      });
  });
});

describe('Make a request to verify account', () => {
  let verificationId;
  before(async () => {
    verificationId = await getVerificationId(user3.email);
  });
  it('should successfully verify the users account.', (done) => {
    chai
      .request(app)
      .get(`/api/v1/verify/${verificationId}`)
      .end((err, res) => {
        const { status, body: { message, success } } = res;
        expect(status).to.be.equal(200);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('Account verified successfully.');
        done(err);
      });
  });
});

describe('Make a request to verify account with wrong verificationID', () => {
  it('should successfully verify the users account.', (done) => {
    chai
      .request(app)
      .get('/api/v1/verify/3RDKNCEvjcd')
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(404);
        expect(success).to.be.equal(false);
        expect(errors[0]).to.be.equal('User not found.');
        done(err);
      });
  });
});

describe('Make a request to get the article count of a user', () => {
  it("should return the number count of the user's articles", (done) => {
    chai
      .request(app)
      .get('/api/v1/user/articlescount')
      .set('Authorization', userToken)
      .end((err, res) => {
        const { status, body: { success, articleCount } } = res;
        expect(status).to.be.equal(200);
        expect(success).to.be.equal(true);
        expect(articleCount).to.be.a('number');
        done(err);
      });
  });
});
describe('Make a request with an invalid token', () => {
  it('should return session expired', (done) => {
    const invalidToken = `${userToken}111`;
    chai
      .request(app)
      .get('/api/v1/user/articlescount')
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
