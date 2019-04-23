// Require the dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import path from 'path';
import app from '../index';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import { validUser, profileDetails } from './helpers/userDummyData';
import profileController from '../controllers/profile';

const { updateProfileImage } = profileController;

// Configure chai
chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

// Keep Token
let userToken = [];

describe('Make a request to signup with valid details', () => {
  it('returns successfully signed up message', (done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(validUser)
      .end((err, res) => {
        const {
          status,
          body: { message, success, token }
        } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('You have signed up successfully.');
        userToken = token;
        done(err);
      });
  });
});

describe('View default profile details', () => {
  it('returns unauthorised access, user not verified', (done) => {
    chai
      .request(app)
      .get('/api/v1/userprofile')
      .set('x-access-token', userToken)
      .end((err, res) => {
        const {
          status,
          body: { success }
        } = res;
        expect(status).to.be.equal(403);
        expect(success).to.be.equal(false);
        done(err);
      });
  });
});

describe('Update profile details', () => {
  it('returns unauthorised access, user not verified', (done) => {
    chai
      .request(app)
      .patch('/api/v1/userprofile')
      .set('x-access-token', userToken)
      .send(profileDetails)
      .end((err, res) => {
        const {
          status,
          body: { success }
        } = res;
        expect(status).to.be.equal(403);
        expect(success).to.be.equal(false);
        done(err);
      });
  });
});

describe('View default profile details', () => {
  before(() => updateVerifiedStatus(validUser.email));
  it('returns default profile details', (done) => {
    chai
      .request(app)
      .get('/api/v1/userprofile')
      .set('x-access-token', userToken)
      .end((err, res) => {
        const {
          status,
          body: { success, body }
        } = res;
        expect(status).to.be.equal(200);
        expect(success).to.be.equal(true);
        expect(body).to.be.a('Object');
        expect(body.username).to.have.string('JamesBond');
        expect(body.email).to.have.string('jamesbondxxc@gmail.com');
        expect(body.name).to.have.string('James');
        done(err);
      });
  });
});

describe('Update profile details', () => {
  before(() => updateVerifiedStatus(validUser.email));
  it('returns successfully profile details', (done) => {
    chai
      .request(app)
      .patch('/api/v1/userprofile')
      .set('x-access-token', userToken)
      .send(profileDetails)
      .end((err, res) => {
        const {
          status,
          body: { success, body }
        } = res;
        expect(status).to.be.equal(202);
        expect(success).to.be.equal(true);
        expect(body).to.be.a('Object');
        expect(body.username).to.have.string('JamesBond');
        expect(body.email).to.have.string('jamesbondxxc@gmail.com');
        expect(body.name).to.have.string('NewFirstName');
        expect(body.bio).to.have.string('basketball');
        done(err);
      });
  });

  it('should update a user profile image', (done) => {
    chai
      .request(app)
      .patch('/api/v1/userprofile/image')
      .set('authorization', userToken)
      .attach('image', path.join(__dirname, 'assets', 'testImage.jpg'))
      .type('form')
      .end((err, res) => {
        const { status, body: { success, result, message } } = res;
        expect(status).to.be.equal(202);
        expect(result.image).to.be.a('String');
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('Profile image successfully updated');
        done(err);
      });
  });

  it('should not update a user profile image if image is not sent', (done) => {
    chai
      .request(app)
      .patch('/api/v1/userprofile/image')
      .set('authorization', userToken)
      .type('form')
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        expect(errors[0]).to.be.equal('An image file should be uploaded to complete this request');
        done(err);
      });
  });


  it('should return a server error.', async () => {
    const req = {
      user: {
        id: 1
      },
      body: {
        images: [null]
      }
    };
    const res = {
      status() {},
      json() {}
    };

    sinon.stub(res, 'status').returnsThis(500);
    await updateProfileImage(req, res);
    expect(res.status).to.have.been.calledOnceWith(500);
  });
});

describe('View updated profile details', () => {
  before(() => updateVerifiedStatus(validUser.email));
  it('returns updated profile details', (done) => {
    chai
      .request(app)
      .get('/api/v1/userprofile')
      .set('x-access-token', userToken)
      .end((err, res) => {
        const {
          status,
          body: { success, body }
        } = res;
        expect(status).to.be.equal(200);
        expect(success).to.be.equal(true);
        expect(body).to.be.a('Object');
        expect(body.username).to.have.string('JamesBond');
        expect(body.email).to.have.string('jamesbondxxc@gmail.com');
        expect(body.name).to.have.string('NewFirstName');
        expect(body.bio).to.have.string('basketball');
        done(err);
      });
  });
});
