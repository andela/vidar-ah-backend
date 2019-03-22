import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import { validStatUser } from './helpers/userDummyData';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import { statArticle } from './helpers/dummyData';

dotenv.config();

chai.use(chaiHttp);
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
  before(() => { updateVerifiedStatus(validStatUser.email); });
  it('should create a new article.', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('authorization', userToken)
      .send(statArticle)
      .end((err, res) => {
        const { status, body: { message, success, article: { slug } } } = res;
        articleSlug = slug;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('New article created successfully');
        done(err);
      });
  });
});

describe('View an article', () => {
  it('Should should return an array of results', (done) => {
    chai
      .request(app)
      .get(`/api/v1/articles/${articleSlug}`)
      .set('x-access-token', userToken)
      .end((err, res) => {
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
        done(err);
      });
  });
});

describe('Get reading stats', () => {
  it('should return a number', (done) => {
    chai
      .request(app)
      .get('/api/v1/user/readingstats')
      .set('x-access-token', userToken)
      .end((err, res) => {
        const { status, body: { success, message } } = res;
        expect(status).to.be.equal(200);
        expect(success).to.be.equal(true);
        expect(message).to.be.a('number');
        expect(message).to.be.equal(1);
        done(err);
      });
  });
});
