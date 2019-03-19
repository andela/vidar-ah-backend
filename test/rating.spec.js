/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import { validUser4, validUser3 } from './helpers/userDummyData';
import { article1, fakeArticleId } from './helpers/articleDummyData';
import ratings from './helpers/ratingDummyData';

chai.use(chaiHttp);
const { expect } = chai;

describe('RATING', () => {
  let userToken1;
  let userToken2;

  before(async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(validUser4);
    const {
      status,
      body: { message, success, token }
    } = res;
    expect(status).to.be.equal(201);
    expect(success).to.be.equal(true);
    expect(message).to.be.equal('You have signed up successfully.');
    userToken1 = token;
    const res2 = await chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(validUser3);
    const {
      status: status2,
      body: { message: message2, success: success2, token: token2 }
    } = res2;
    expect(status2).to.be.equal(201);
    expect(success2).to.be.equal(true);
    expect(message2).to.be.equal('You have signed up successfully.');
    userToken2 = token2;
  });

  describe('Verification', () => {
    it('should not rate an article if user is not verified.', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/rate/articleId')
        .set('authorization', userToken1)
        .send({ rating: ratings[1] })
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(403);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('User has not been verified.');
          done();
        });
    });
  });

  describe('Authentication', () => {
    it('should not rate an article if user is not authenticated.', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/rate/articleId')
        .set('authorization', 'some fake token')
        .send({ rating: ratings[1] })
        .end((err, res) => {
          const { status, body: { success, errors } } = res;
          expect(status).to.be.equal(401);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Your session has expired, please login again to continue');
          done();
        });
    });

    it('should not allow if authentication token is not sent', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/rate/articleId')
        .send({ rating: ratings[1] })
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(401);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Unauthorized! You are required to be logged in to perform this operation.');
          done(err);
        });
    });
  });

  describe('Article Rating', () => {
    let newArticle;
    before(async () => {
      await updateVerifiedStatus(validUser4.email);
      await updateVerifiedStatus(validUser3.email);
      const res = await chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', userToken1)
        .send(article1);
      const { status, body: { message, success, article } } = res;
      expect(status).to.be.equal(201);
      expect(success).to.be.equal(true);
      expect(message).to.be.equal('New article created successfully');
      newArticle = article;
    });

    it('should not rate article if it belong to same user.', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/rate/${newArticle.id}`)
        .set('authorization', userToken1)
        .send({ rating: ratings[0] })
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(403);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Permission denied, user cannot rate their own article');
          done(err);
        });
    });

    it('should rate article if it exist.', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/rate/${newArticle.id}`)
        .set('authorization', userToken2)
        .send({ rating: ratings[0] })
        .end((err, res) => {
          const { status, body: { message, success } } = res;
          expect(status).to.be.equal(200);
          expect(success).to.be.equal(true);
          expect(message).to.be.equal(`Article has been rated as ${ratings[0]}`);
          done(err);
        });
    });

    it('should not rate article if it does not exist.', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/rate/${fakeArticleId}`)
        .set('authorization', userToken2)
        .send({ rating: ratings[0] })
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(404);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('This article does not exist');
          done(err);
        });
    });

    it('should update article rating if already rated.', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/rate/${newArticle.id}`)
        .set('authorization', userToken2)
        .send({ rating: ratings[2] })
        .end((err, res) => {
          const { status, body: { message, success } } = res;
          expect(status).to.be.equal(201);
          expect(success).to.be.equal(true);
          expect(message).to.be.equal(`Article rating has been updated as ${ratings[2]}`);
          done(err);
        });
    });

    it('should not rate article if rating is not sent.', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/rate/${newArticle.id}`)
        .set('authorization', userToken2)
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Please provide a rating for this article.');
          done(err);
        });
    });

    it('should not rate article if articleId is not valid.', (done) => {
      chai
        .request(app)
        .post('/api/v1/articles/rate/838fd1e974ee6')
        .set('authorization', userToken2)
        .send({ rating: ratings[0] })
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Please provide a valid id for the article');
          done(err);
        });
    });

    it('should not rate article if rating not numeric.', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/rate/${newArticle.id}`)
        .set('authorization', userToken2)
        .send({ rating: ratings[6] })
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Rating should be a number.');
          done(err);
        });
    });

    it('should not rate article if rating is not in the range 1 - 5.', (done) => {
      chai
        .request(app)
        .post(`/api/v1/articles/rate/${newArticle.id}`)
        .set('authorization', userToken2)
        .send({ rating: ratings[5] })
        .end((err, res) => {
          const { status, body: { errors, success } } = res;
          expect(status).to.be.equal(422);
          expect(success).to.be.equal(false);
          expect(errors[0]).to.be.equal('Ratings should have values ranging from 1 to 5.');
          done(err);
        });
    });
  });
});
