import dotenv from 'dotenv';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { validStatUser } from './helpers/userDummyData';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import { statArticle } from './helpers/dummyData';
import userController from '../controllers/user';

const { getReadingStats } = userController;

dotenv.config();

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

let userToken;
let articleSlug;

describe('Make a request to signup with valid details', () => {
  it('Returns a successful message', (done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(validStatUser)
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

describe('Create an article by an authenticated and verified user', () => {
  before(async () => { await updateVerifiedStatus(validStatUser.email); });
  it('should create a new article.', async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/articles')
      .set('authorization', userToken)
      .send(statArticle);
    const { status, body: { message, success, article: { slug } } } = res;
    articleSlug = slug;
    expect(status).to.be.equal(201);
    expect(success).to.be.equal(true);
    expect(message).to.be.equal('New article created successfully');
  });
});

describe('View an article', () => {
  it('should return an array of results', async () => {
    const res = await chai
      .request(app)
      .get(`/api/v1/articles/${articleSlug}`)
      .set('x-access-token', userToken);
    const { status, body: { success, article } } = res;
    expect(status).to.be.equal(200);
    expect(success).to.be.equal(true);
    expect(article).to.be.an('object');
    expect(article).to.haveOwnProperty('id');
    expect(article).to.haveOwnProperty('slug');
    expect(article).to.haveOwnProperty('title');
    expect(article).to.haveOwnProperty('body');
    expect(article).to.haveOwnProperty('description');
    expect(article).to.haveOwnProperty('author');
  });
});

describe('View an article', () => {
  it('should return a number', async () => {
    const res = await chai
      .request(app)
      .get('/api/v1/user/readingstats')
      .set('x-access-token', userToken);
    const { status, body: { success, numberOfArticlesRead } } = res;
    expect(status).to.be.equal(200);
    expect(success).to.be.equal(true);
    expect(numberOfArticlesRead).to.be.a('number');
    expect(numberOfArticlesRead).to.be.equal(1);
  });

  it('should return a server error', async () => {
    const req = {
      user: { id: null },
    };
    const res = {
      status() {},
      json() {}
    };
    sinon.stub(res, 'status').returnsThis(500);
    await getReadingStats(req, res);
    expect(res.status).to.have.been.calledOnceWith(500);
  });
});
