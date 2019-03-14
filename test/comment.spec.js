// Require the dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import { validCommentUser, wrongCommentUser } from './helpers/userDummyData';
import { validComment } from './helpers/commentDummyData';
import { article2 } from './helpers/articleDummyData';

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

// Keep Token
let userToken = [];
let userToken2 = [];
let articleId = [];
let commentId = [];

describe('Make a request to signup with valid details', () => {
  it('returns successfully signed up message', (done) => {
    chai
      .request(app)
      .post('/api/v1/user')
      .send(validCommentUser)
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
      .post('/api/v1/user')
      .send(wrongCommentUser)
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
describe('Post a comment', () => {
  it('returns unauthorised access, user not verified', (done) => {
    chai
      .request(app)
      .post('/api/v1/comment/:id')
      .set('x-access-token', userToken)
      .send(validComment)
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
describe('Create an article by an authenticated and verified user', () => {
  before(() => { updateVerifiedStatus(validCommentUser.email); });
  it('Should create a new article.', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('authorization', userToken)
      .send(article2)
      .end((err, res) => {
        const { status, body: { message, success, article } } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('New article created successfully');
        articleId = article.id;
        done(err);
      });
  });
});
describe('Post a comment', () => {
  before(() => updateVerifiedStatus(validCommentUser.email));
  it('returns article not found', (done) => {
    chai
      .request(app)
      .post(`/api/v1/comment/${5}`)
      .set('x-access-token', userToken)
      .send({ comment: 'I am a boy' })
      .end((err, res) => {
        const {
          status,
          body: { success }
        } = res;
        expect(status).to.be.equal(500);
        expect(success).to.be.equal(false);
        done(err);
      });
  });
});

describe('Post a comment', () => {
  before(() => updateVerifiedStatus(validCommentUser.email));
  it('returns invalid comment body', (done) => {
    chai
      .request(app)
      .post(`/api/v1/comment/${articleId}`)
      .set('x-access-token', userToken)
      .send({ comment: '' })
      .end((err, res) => {
        const {
          status,
          body: { success }
        } = res;
        expect(status).to.be.equal(422);
        expect(success).to.be.equal(false);
        done(err);
      });
  });
});
describe('Post a comment', () => {
  before(() => updateVerifiedStatus(validCommentUser.email));
  it('returns successfully post comment', (done) => {
    chai
      .request(app)
      .post(`/api/v1/comment/${articleId}`)
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
describe('Edit a comment', () => {
  before(() => updateVerifiedStatus(wrongCommentUser.email));
  it('returns unauthorized access', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/comment/${commentId}`)
      .set('x-access-token', userToken2)
      .send({ comment: 'I am a girl now' })
      .end((err, res) => {
        const {
          status,
          body: { success }
        } = res;
        expect(status).to.be.equal(401);
        expect(success).to.be.equal(false);
        done(err);
      });
  });
});
describe('Edit a comment', () => {
  before(() => updateVerifiedStatus(validCommentUser.email));
  it('returns successfully edit comment', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/comment/${commentId}`)
      .set('x-access-token', userToken)
      .send({ comment: 'I am a girl now' })
      .end((err, res) => {
        const {
          status,
          body: { success }
        } = res;
        expect(status).to.be.equal(205);
        expect(success).to.be.equal(true);
        done(err);
      });
  });
});
describe('Delete a comment', () => {
  before(() => updateVerifiedStatus(wrongCommentUser.email));
  it('returns unauthorized access', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/comment/${commentId}`)
      .set('x-access-token', userToken2)
      .end((err, res) => {
        const {
          status,
          body: { success }
        } = res;
        expect(status).to.be.equal(401);
        expect(success).to.be.equal(false);
        done(err);
      });
  });
});
describe('Delete a comment', () => {
  before(() => updateVerifiedStatus(validCommentUser.email));
  it('returns comment successfully deleted', (done) => {
    chai
      .request(app)
      .delete(`/api/v1/comment/${commentId}`)
      .set('x-access-token', userToken)
      .end((err, res) => {
        const {
          status,
          body: { success }
        } = res;
        expect(status).to.be.equal(205);
        expect(success).to.be.equal(true);
        done(err);
      });
  });
});
