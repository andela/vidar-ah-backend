/* eslint-disable no-unused-expressions */
import chai from 'chai';
import nock from 'nock';
import index from '../index';


const { expect } = chai;


nock('https://www.google.com/')
  .filteringPath(() => '/api/v1/auth/google')
  .get('/api/v1/auth/google')
  .reply(200, 'Welcome to Author Haven', {
  });

nock('https://www.facebook.com/')
  .filteringPath(() => '/api/v1/auth/facebook')
  .get('/api/v1/auth/facebook')
  .reply(200, 'Welcome to Author Haven');

describe('google strategy', () => {
  it('should call the google route', async () => {
    const response = await chai.request(index).get('/api/v1/auth/google');
    // eslint-disable-next-line no-unused-expressions
    expect(response.body).to.be.empty;
  });
});


describe('facebook strategy', () => {
  it('should call the facebook route', async () => {
    const response = await chai.request(index).get('/api/v1/auth/facebook');
    expect(response).to.have.status(200);
  });
});
