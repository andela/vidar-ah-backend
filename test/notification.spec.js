import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import app from '../index';
import { notification, User } from '../models';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';

import {
  author, author2, reader, article, article2
} from './helpers/notificationsData';

let authorToken;
let author2Token;
let readerToken;
let articleSlug;
let article2Slug;

chai.use(sinonChai);
const { expect } = chai;
chai.use(chaiHttp);
chai.use(sinonChai);

before(async () => {
  sinon.stub(notification, 'create').returns(undefined);
  const newAuthor = await chai.request(app).post('/api/v1/user/signup').send(author);
  const newAuthor2 = await chai.request(app).post('/api/v1/user/signup').send(author2);
  const newReader = await chai.request(app).post('/api/v1/user/signup').send(reader);
  await updateVerifiedStatus(reader.email);
  await updateVerifiedStatus(author.email);
  await updateVerifiedStatus(author2.email);

  authorToken = newAuthor.body.token;
  author2Token = newAuthor2.body.token;
  readerToken = newReader.body.token;
  author.id = newAuthor.body.user.id;
  author2.id = newAuthor2.body.user.id;
  const newArticle = await chai.request(app).post('/api/v1/articles').set('authorization', authorToken).send(article);
  const newArticle2 = await chai.request(app).post('/api/v1/articles').set('authorization', author2Token).send(article2);
  articleSlug = newArticle.body.article.slug;
  article2Slug = newArticle2.body.article.slug;
  article.id = newArticle.body.article.id;
  article2.id = newArticle2.body.article.id;
  const newComment = await chai.request(app).post(`/api/v1/articles/${articleSlug}/comments`).set('authorization', readerToken).send('greate article');
  article.comment = newComment.body.comment;
  const newComment2 = await chai.request(app).post(`/api/v1/articles/${article2Slug}/comments`).set('authorization', readerToken).send('good job');
  article2.comment = newComment2.body.comment;
});

after(() => sinon.restore());

describe('Test an author with notification choice set to none', () => {
  it('should not receive notifications for new follow', async () => {
    const res = await chai.request(app).post('/api/v1/follow').set('authorization', readerToken).send({ id: author2.id });
    const { status, body: { success, message } } = res;
    expect(status).to.be.equal(201);
    expect(success).to.be.equal(true);
    expect(message).to.be.equal('User followed successfully.');
  });

  it('should not receive notifications for new comments', async () => {
    const res = await chai.request(app).post(`/api/v1/articles/${article2Slug}/comments`).set('authorization', readerToken).send({ comment: 'new comment' });
    const { status, body: { success, message, comment } } = res;
    expect(status).to.be.equal(205);
    expect(success).to.be.equal(true);
    expect(message).to.be.equal('New article comment created successfully');
    expect(comment).to.be.an('object');
  });

  it('should not receive notifications for new Likes', async () => {
    const res = await chai.request(app).post('/api/v1/like_article').set('authorization', readerToken).send({ slug: article2Slug });
    const { status, body: { success, message } } = res;
    expect(status).to.be.equal(201);
    expect(success).to.be.equal(true);
    expect(message).to.be.equal('You have liked this article');
  });
  it('should not receive notifications for updated ratings', async () => {
    const res = await chai.request(app).post(`/api/v1/articles/rate/${article2.id}`).set('authorization', readerToken).send({ rating: 4 });
    const { status, body: { success, message, articleRating } } = res;
    expect(status).to.be.equal(200);
    expect(success).to.be.equal(true);
    expect(message).to.be.equal('Article has been rated as 4');
    expect(articleRating).to.be.an('object');
  });
});

describe('Get all notifications for a given user', () => {
  it('should return all notifications', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/notifications')
      .set('authorization', authorToken);
    const {
      status,
      body: { success, message: msg, notifications }
    } = res;
    expect(status).to.be.equal(200);
    expect(success).to.be.equal(true);
    expect(msg).to.be.equal('All notifications successfully fetched');
    expect(notifications).to.be.an('Array');
  });

  it('should return status 500 for internal server error', async () => {
    sinon.stub(notification, 'findAll').returns(Promise.reject(new Error('dummy error')));
    const res = await chai
      .request(app)
      .get('/api/v1/notifications')
      .set('authorization', authorToken);
    const {
      status, body: {
        success,
        errors: [msg]
      }
    } = res;
    expect(status).to.be.equal(500);
    expect(success).to.be.equal(false);
    expect(msg).to.be.equal('dummy error');
  });
});

describe('Make a request to change your notification options', () => {
  it('should return a success message with status 200', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/notifications')
      .set('x-access-token', authorToken)
      .send({ notificationChoice: 'email only' });
    const {
      status, body: {
        success, message: msg, choice
      }
    } = res;
    expect(status).to.be.equal(200);
    expect(success).to.be.equal(true);
    expect(msg).to.be.equal('Your notification choice has been set');
    expect(choice).to.be.equal('emailOnly');
  });

  it('should return a success message with status 200 when choice is set to both', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/notifications')
      .set('x-access-token', authorToken)
      .send({ notificationChoice: 'both' });
    const {
      status, body: {
        success, message: msg, choice
      }
    } = res;
    expect(status).to.be.equal(200);
    expect(success).to.be.equal(true);
    expect(msg).to.be.equal('Your notification choice has been set');
    expect(choice).to.be.equal('both');
  });

  it('should return a success message with status 200 when choice is set to none', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/notifications')
      .set('x-access-token', authorToken)
      .send({ notificationChoice: 'none' });
    const {
      status, body: {
        success, message: msg, choice
      }
    } = res;
    expect(status).to.be.equal(200);
    expect(success).to.be.equal(true);
    expect(msg).to.be.equal('Your notification choice has been set');
    expect(choice).to.be.equal('none');
  });

  it('should return a 400 error response for invalid notificationChoice', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/notifications')
      .set('x-access-token', authorToken)
      .send({ notificationChoice: 'invalid option' });
    const {
      status, body: {
        success, errors
      }
    } = res;
    expect(status).to.be.equal(400);
    expect(success).to.be.equal(false);
    expect(errors).to.be.an('Array');
    expect(errors[0]).to.be.equal('Invalid notification choice, allowed values are email only, app only, both, or none');
  });

  it('should return a 400 error response for absent notificationChoice', async () => {
    const res = await chai
      .request(app)
      .patch('/api/v1/notifications')
      .set('x-access-token', authorToken)
      .send({});
    const {
      status, body: {
        success, errors
      }
    } = res;
    expect(status).to.be.equal(400);
    expect(success).to.be.equal(false);
    expect(errors).to.be.an('Array');
    expect(errors[0]).to.be.equal('Please provide a valid notificationChoice, e.g notificationChoice: email only');
  });

  it('should return a 500 error for database failure', async () => {
    sinon.stub(User, 'update').returns(Promise.reject(new Error('dummy error')));
    const res = await chai
      .request(app)
      .patch('/api/v1/notifications')
      .set('x-access-token', authorToken)
      .send({ notificationChoice: 'app only' });
    const {
      status, body: {
        success, errors
      }
    } = res;
    expect(status).to.be.equal(500);
    expect(success).to.be.equal(false);
    expect(errors).to.be.an('Array');
    expect(errors[0]).to.be.equal('dummy error');
  });
});
