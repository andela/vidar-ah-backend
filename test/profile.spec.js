// Require the dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

// Keep Token
let userToken = [];

const validUser = {
  username: 'JamesBond',
  email: 'jamesbondxxc@gmail.com',
  name: 'James Bond',
  password: '1234567'
};

const profileDetails = {
  firstname: 'NewFirstName',
  lastname: 'NewLastName',
  bio: 'I love playing basketball'
};

describe('Make a request to signup with valid details', () => {
  it('Returns successfully signed up message', (done) => {
    chai
      .request(app)
      .post('/api/v1/user')
      .send(validUser)
      .end((err, res) => {
        const {
          status,
          body: { message, success, token }
        } = res;
        expect(status).to.be.equal(201);
        expect(success).to.be.equal(true);
        expect(message).to.be.equal('You have signed up successfully.');
        done(err);
        userToken = token;
      });
  });
});

describe('View default profile details', () => {
  it('Returns default profile details', (done) => {
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
  it('Returns successfully profile details', (done) => {
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
        expect(status).to.be.equal(205);
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

describe('View updated profile details', () => {
  it('Returns updated profile details', (done) => {
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
