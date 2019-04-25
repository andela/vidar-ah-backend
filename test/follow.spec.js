import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import app from '../index';
import { validFollowUser, validFollowUser2 } from './helpers/userDummyData';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import getId from './helpers/userDetails';
import followController from '../controllers/follow';

const { getUserFollowers, getUserFollowings } = followController;

dotenv.config();

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

let userToken = [];
let userId2 = [];

describe('Make a request to signup with valid details', () => {
  it('Returns a successful message', (done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(validFollowUser)
      .end((err, res) => {
        const { status, body: { message, success, token } } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('You have signed up successfully.');
        userToken = token;
        done(err);
      });
  });
});

describe('Make a request to signup with valid details again', () => {
  it('Returns a successful message', (done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(validFollowUser2)
      .end((err, res) => {
        const { status, body: { message, success } } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('You have signed up successfully.');
        done(err);
      });
  });
});

describe('Make a request to follow a non existing user', () => {
  before(() => updateVerifiedStatus(validFollowUser.email));
  it('Returns an error message.', (done) => {
    chai
      .request(app)
      .post('/api/v1/follow')
      .set('x-access-token', userToken)
      .send({ id: 1111 })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(404);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('User does not exist or is not verified.');
        done(err);
      });
  });
});

describe('Make a request to follow a non verified user', () => {
  it('Returns an error message.', async () => {
    userId2 = await getId(validFollowUser2.email);
    const url = '/api/v1/follow/';
    chai
      .request(app)
      .post(url)
      .set('x-access-token', userToken)
      .send({ id: userId2 })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(404);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('User does not exist or is not verified.');
      });
  });
});

describe('Make a request to follow self', () => {
  it('Returns an error message.', async () => {
    const userId = await getId(validFollowUser.email);
    const url = '/api/v1/follow/';
    chai
      .request(app)
      .post(url)
      .set('x-access-token', userToken)
      .send({ id: userId })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(403);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('You cannot follow or unfollow yourself.');
      });
  });
});

describe('Make a request to unfollow another user not currently being followed', () => {
  before(() => updateVerifiedStatus(validFollowUser2.email));
  it('Returns an error message.', (done) => {
    const url = '/api/v1/unfollow/';
    chai
      .request(app)
      .post(url)
      .set('x-access-token', userToken)
      .send({ id: userId2 })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(403);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('You cannot unfollow a user you are not following.');
        done(err);
      });
  });
});

describe('Make a valid request to follow another user', () => {
  it('Returns a success message.', (done) => {
    const url = '/api/v1/follow/';
    chai
      .request(app)
      .post(url)
      .set('x-access-token', userToken)
      .send({ id: userId2 })
      .end((err, res) => {
        const { status, body: { message, success } } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('User followed successfully.');
        done(err);
      });
  });
});

describe('Make a request to follow another user again', () => {
  it('Returns an error message.', (done) => {
    const url = '/api/v1/follow/';
    chai
      .request(app)
      .post(url)
      .set('x-access-token', userToken)
      .send({ id: userId2 })
      .end((err, res) => {
        const { status, body: { errors, success } } = res;
        expect(status).to.be.equal(403);
        expect(success).to.be.equal(false);
        expect(errors).to.be.an('Array');
        expect(errors[0]).to.be.equal('You cannot follow a user twice.');
        done(err);
      });
  });
});

describe('Make a valid request to unfollow another user', () => {
  it('Returns a success message.', (done) => {
    const url = '/api/v1/unfollow/';
    chai
      .request(app)
      .post(url)
      .set('x-access-token', userToken)
      .send({ id: userId2 })
      .end((err, res) => {
        const { status, body: { message, success } } = res;
        expect(status).to.be.equal(200);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('User unfollowed successfully.');
        done(err);
      });
  });
});

describe("Make a request to get a user's followers and followings", () => {
  it('should return the user followers with a success message.', (done) => {
    const url = '/api/v1/user/followers';
    chai
      .request(app)
      .get(url)
      .set('Authorization', userToken)
      .end((err, res) => {
        const {
          status, body: {
            message, success, followers,
          }
        } = res;
        expect(status).to.be.equal(200);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal("Successfully gotten user's followers");
        expect(followers).to.be.instanceOf(Array);
        done(err);
      });
  });

  it('should return the user followers with a success message.', (done) => {
    const url = '/api/v1/user/followings';
    chai
      .request(app)
      .get(url)
      .set('Authorization', userToken)
      .end((err, res) => {
        const {
          status, body: {
            message, success, followings
          }
        } = res;
        expect(status).to.be.equal(200);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal("Successfully gotten user's followings");
        expect(followings).to.be.instanceOf(Array);
        done(err);
      });
  });

  it('should return a server error.', async () => {
    const req = {
      user: { id: null }
    };
    const res = {
      status() {},
      json() {}
    };

    sinon.stub(res, 'status').returnsThis(500);
    await getUserFollowers(req, res);
    expect(res.status).to.have.been.calledOnceWith(500);
  });

  it('should return a server error.', async () => {
    const req = {
      user: { id: null }
    };
    const res = {
      status() {},
      json() {}
    };

    sinon.stub(res, 'status').returnsThis(500);
    await getUserFollowings(req, res);
    expect(res.status).to.have.been.calledOnceWith(500);
  });
});

describe('Test follow feature helper function', () => {
  it('should return a number', async () => {
    const id = await getId(validFollowUser2.email);
    expect(id).to.be.a('number');
  });
});
