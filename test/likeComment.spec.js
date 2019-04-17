// Require the dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import { validLikeCommentUser, wrongLikeCommentUser } from './helpers/userDummyData';
import { article3 } from './helpers/articleDummyData';

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

// Keep Token
let userToken = [];
let userToken2 = [];
let articleSlug = [];
let commentId = [];

describe('Make a request to signup with valid details', () => {
  it('returns successfully signed up message', (done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(validLikeCommentUser)
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
describe('Make a request to signup another user with valid details', () => {
  it('returns successfully signed up message', (done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(wrongLikeCommentUser)
      .end((err, res) => {
        const {
          status,
          body: { message, success, token }
        } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('You have signed up successfully.');
        userToken2 = token;
        done(err);
      });
  });
});

describe('Create an article by an authenticated and verified user', () => {
  before(async () => { await updateVerifiedStatus(validLikeCommentUser.email); });
  it('Should create a new article.', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('authorization', userToken)
      .send(article3)
      .end((err, res) => {
        const { status, body: { message, success, article } } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('New article created successfully');
        articleSlug = article.slug;
        done(err);
      });
  });
});
describe('Post a comment', () => {
  before(() => updateVerifiedStatus(validLikeCommentUser.email));
  it('returns successfully post comment', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${articleSlug}/comments`)
      .set('x-access-token', userToken)
      .send({ comment: 'I am a boy' })
      .end((err, res) => {
        const {
          status,
          body: { success, comment }
        } = res;
        expect(status).to.be.equal(205);
        expect(success).to.be.equal(true);
        commentId = comment.id;
        done(err);
      });
  });
});
describe('Like a comment', () => {
  it('returns user not verified', (done) => {
    chai
      .request(app)
      .post(`/api/v1/comments/${commentId}/like`)
      .set('x-access-token', userToken2)
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
describe('Like a comment', () => {
  before(() => updateVerifiedStatus(validLikeCommentUser.email));
  it('returns comment not found', (done) => {
    chai
      .request(app)
      .post(`/api/v1/comments/${commentId + 30}/like`)
      .set('x-access-token', userToken)
      .end((err, res) => {
        const {
          status,
          body: { success }
        } = res;
        expect(status).to.be.equal(404);
        expect(success).to.be.equal(false);
        done(err);
      });
  });
});
describe('Like a comment', () => {
  before(() => updateVerifiedStatus(validLikeCommentUser.email));
  it('returns comment liked successfully', (done) => {
    chai
      .request(app)
      .post(`/api/v1/comments/${commentId}/like`)
      .set('x-access-token', userToken)
      .end((err, res) => {
        const {
          status,
          body: { success, message }
        } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('Comment liked successfully');
        done(err);
      });
  });
});

describe('Unlike a comment', () => {
  before(() => updateVerifiedStatus(validLikeCommentUser.email));
  it('returns comment unliked successfully', async () => {
    const res = await chai
      .request(app)
      .post(`/api/v1/comments/${commentId}/like`)
      .set('x-access-token', userToken);
    const {
      status,
      body: { success, message }
    } = res;
    expect(status).to.be.equal(201);
    expect(success).to.be.equal(true);
    expect(message).to.be.equal('Comment unliked successfully');
  });
});
