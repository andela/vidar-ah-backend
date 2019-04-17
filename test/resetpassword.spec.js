// Require the dependencies
import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { User } from '../models';
import { validUser2, invalidUser } from './helpers/userDummyData';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';

dotenv.config();


// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

const getPasswordResetToken = async (email) => {
  const name = await User.findOne({ where: { email } });
  return name.dataValues.passwordResetToken;
};

describe('Make a request to signup with valid details', () => {
  it('Returns a successful message', (done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(validUser2)
      .end((err, res) => {
        const { status, body: { message, success } } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('You have signed up successfully.');
        done(err);
      });
  });
});

describe('Make a request to reset password with valid details', () => {
  before(() => updateVerifiedStatus(validUser2.email));
  it('Returns a success message.', (done) => {
    chai
      .request(app)
      .post('/api/v1/requestpasswordreset')
      .send(validUser2)
      .end((err, res) => {
        const { status, body: { message, success } } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('A link to reset your password has been sent to your mail. Please note that the link is only valid for one hour.');
        done(err);
      });
  });
});

describe('Make a request to reset password with an empty email', () => {
  it('Returns an invalid error.', (done) => {
    chai
      .request(app)
      .post('/api/v1/requestpasswordreset')
      .send({ email: '' })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Email is invalid.');
        done(err);
      });
  });
});

describe('Make a request to reset password with an invalid email', () => {
  it('Returns an invalid error.', (done) => {
    chai
      .request(app)
      .post('/api/v1/requestpasswordreset')
      .send(invalidUser)
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(404);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('User not found.');
        done(err);
      });
  });
});

describe('Make a request to verify password reset token with a valid token and password', () => {
  it('Returns an success message.', async () => {
    const passwordResetToken = await getPasswordResetToken(validUser2.email);
    const url = `/api/v1/resetpassword/${passwordResetToken}`;
    chai
      .request(app)
      .post(url)
      .send({ password: 'abcdef' })
      .end((err, res) => {
        const { status, body: { message, success } } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('Password changed successfully.');
      });
  });
});

describe('Make a request to verify password reset token with a valid token and invalid password', () => {
  it('Returns an success message.', async () => {
    const passwordResetToken = await getPasswordResetToken(validUser2.email);
    const url = `/api/v1/resetpassword/${passwordResetToken}`;
    chai
      .request(app)
      .post(url)
      .send({ password: 'af' })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Password must be at least 6 characters long.');
      });
  });
});

describe('Make a request to verify password reset token with an invalid token and valid password', () => {
  it('Returns an error message.', (done) => {
    chai
      .request(app)
      .post('/api/v1/resetpassword/blabla')
      .send({ password: 'abcdef' })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(404);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('Password reset token not found');
        done(err);
      });
  });
});
