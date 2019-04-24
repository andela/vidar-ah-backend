import chai from 'chai';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';
import app from '../index';
import updateVerifiedStatus from './helpers/updateVerifiedStatus';
import { superAdmin } from './helpers/userDummyData';
import { user, article } from './helpers/reportsDummyData';

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;
let superAdminToken;
let userToken;
let articleSlug;

describe('Testing the reporting feature', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/user/signup')
      .send(user)
      .end((err, res) => {
        if (!err) {
          userToken = res.body.token;
        }
        done();
      });
  });

  before(async () => {
    const res = await chai
      .request(app)
      .post('/api/v1/user/login')
      .send(superAdmin);
    superAdminToken = res.body.token;
  });

  before(async () => {
    await updateVerifiedStatus(user.email);
  });

  describe('Make a request to report an article without a token', () => {
    it('It should return a 401 unauthorized error', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/report')
        .send({ type: 'harrasment', slug: articleSlug });
      const { status, body: { success, errors } } = response;
      expect(status).to.be.eqls(401);
      expect(success).to.be.eqls(false);
      expect(errors[0]).to.be.eqls('Unauthorized! You are required to be logged in to perform this operation.');
    });
  });

  describe('create an article', () => {
    it('should create a new article.', async () => {
      const res = await chai
        .request(app)
        .post('/api/v1/articles')
        .set('authorization', userToken)
        .send(article);
      const { status, body: { message, success, article: { slug } } } = res;
      articleSlug = slug;
      expect(status).to.be.equal(201);
      expect(success).to.be.equal(true);
      expect(message).to.be.equal('New article created successfully');
    });
  });

  describe('Make a request to report an article with a token', () => {
    it('It should return a success message', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/report/')
        .set('x-access-token', userToken)
        .send({ type: 'harrasment', message: 'thats so wrong', slug: articleSlug });
      const { status, body: { success, message } } = response;
      expect(status).to.be.eqls(200);
      expect(success).to.be.eqls(true);
      expect(message).to.be.eqls('Article reported successfully.');
    });
  });

  describe('Make a request to get reports as a super admin', () => {
    it('should return reports with status 200', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/reports')
        .set('x-access-token', superAdminToken);
      const {
        status, body: {
          success, reports
        }
      } = response;
      expect(status).to.be.equal(200);
      expect(success).to.be.equal(true);
      expect(reports).to.be.an('Array');
    });
  });
});
