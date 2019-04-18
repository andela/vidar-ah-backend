// Require the dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import CommentController from '../controllers/comment';
import app from '../index';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import { validCommentUser, wrongCommentUser } from './helpers/userDummyData';
import { validComment } from './helpers/commentDummyData';
import { article2 } from './helpers/articleDummyData';

const { createComment } = CommentController;

// Configure chai
chai.use(chaiHttp);
chai.use(sinonChai);
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
      .post('/api/v1/user/signup')
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
      .post('/api/v1/articles/:slug/comments')
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
        articleSlug = article.slug;
        done(err);
      });
  });
});
describe('Post a comment', () => {
  before(() => updateVerifiedStatus(validCommentUser.email));
  it('returns article not found', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${5}/comments`)
      .set('x-access-token', userToken)
      .send({ comment: 'I am a boy' })
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

describe('Post a comment', () => {
  before(() => updateVerifiedStatus(validCommentUser.email));
  it('returns invalid comment body', (done) => {
    chai
      .request(app)
      .post(`/api/v1/articles/${articleSlug}/comments`)
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

  it('fakes server error getting all cats', async () => {
    const req = {
      user: { id: 3 },
      params: {
        slug: articleSlug,
      },
      body: {
        comment: null
      }
    };
    const res = {
      status() {},
      json() {}
    };

    sinon.stub(res, 'status').returnsThis(500);
    await createComment(req, res);
    expect(res.status).to.have.been.calledOnceWith(500);
  });

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
describe('Get comments', () => {
  before(() => updateVerifiedStatus(validCommentUser.email));
  it('returns all comments associated with an article', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${articleSlug}/comments`)
      .set('x-access-token', userToken)
      .end((err, res) => {
        const {
          status,
          body: { success, comments }
        } = res;
        expect(status).to.be.equal(205);
        expect(success).to.be.equal(true);
        expect(comments).to.be.instanceOf(Array);
        done(err);
      });
  });
});
describe('Edit a comment', () => {
  before(() => updateVerifiedStatus(wrongCommentUser.email));
  it('returns unauthorized access', (done) => {
    chai
      .request(app)
      .patch(`/api/v1/articles/:slug/comments/${commentId}`)
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
      .patch(`/api/v1/articles/:slug/comments/${commentId}`)
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
      .delete(`/api/v1/articles/:slug/comments/${commentId}`)
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
      .delete(`/api/v1/articles/:slug/comments/${commentId}`)
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
