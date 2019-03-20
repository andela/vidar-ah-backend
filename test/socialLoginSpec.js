/* eslint-disable no-unused-expressions */
import chai from 'chai';
import nock from 'nock';
import index from '../index';
import { googleSocial, facebookSocial, twitterSocial } from '../auth/passport';


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

nock('https://www.twitter.com/')
  .filteringPath(() => '/api/v1/auth/twitter')
  .get('/api/v1/auth/twitter')
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
    // eslint-disable-next-line no-unused-expressions
    expect(response.body).to.be.empty;
  });
});


describe('twitter strategy', () => {
  it('should call the twitter route', async () => {
    const response = await chai.request(index).get('/api/v1/auth/twitter');
    // eslint-disable-next-line no-unused-expressions
    expect(response.body).to.be.empty;
  });
});

describe('google social login', () => {
  describe('authenticate callback', () => {
    const callBack = {
      accessToken: '2b$10$ASa5foN/msFInktnwH2slOZYL',
      refreshToken: '5O582QlPXS',
      profile: {
        id: 7,
        emails: [{ value: 'flippingg2234@gmail.com' }]
      },
    };
    it('should authenticate social login', async () => {
      const googleUserInfo = googleSocial(
        callBack.accessToken,
        callBack.refreshToken,
        callBack.profile
      );
      expect(googleUserInfo).to.be.empty;
      expect(typeof (googleUserInfo)).to.equal('object');
      expect(callBack.accessToken).to.be.a('string');
      expect(callBack.profile).to.an('object');
    });
  });
});


describe('facebook social login', () => {
  describe('authenticate callback', () => {
    const callBack = {
      accessToken: '2b$10$ASa5foN/msFInktnwH2slOZYL',
      refreshToken: '5O582QlPXS',
      profile: {
        id: 9,
        emails: [{ value: 'flippingg2234@gmail.com' }]
      },
    };
    it('should authenticate social login', async () => {
      const facebookUserInfo = facebookSocial(
        callBack.accessToken,
        callBack.refreshToken,
        callBack.profile
      );
      expect(facebookUserInfo).to.be.empty;
      expect(typeof (facebookUserInfo)).to.equal('object');
      expect(callBack.accessToken).to.be.a('string');
      expect(callBack.profile).to.an('object');
    });
  });
});


describe('twitter social login', () => {
  describe('authenticate callback', () => {
    const callBack = {
      accessToken: '2b$10$ASa5foN/msFInktnwH2slOZYL',
      refreshToken: '5O582QlPXS',
      profile: {
        id: 9,
        emails: [{ value: 'flippingg2234@gmail.com' }]
      },
    };
    it('should authenticate social login', async () => {
      const twitterUserInfo = twitterSocial(
        callBack.accessToken,
        callBack.refreshToken,
        callBack.profile
      );
      expect(twitterUserInfo).to.be.empty;
      expect(typeof (twitterUserInfo)).to.equal('object');
      expect(callBack.accessToken).to.be.a('string');
      expect(callBack.profile).to.an('object');
    });
  });
});

describe('google social login', () => {
  describe('authenticate callback', () => {
    const callBack = {
      accessToken: '2b$10$ASa5foN/msFInktnwH2slOZYL',
      refreshToken: '5O582QlPXS',
      profile: {
        id: 7,
        emails: [{ value: 'flippingg2234@gmail.com' }]
      },
    };
    it('should authenticate social login', async () => {
      const googleUserInfo = googleSocial(
        callBack.accessToken,
        callBack.refreshToken,
        callBack.profile
      );
      expect(googleUserInfo).to.be.empty;
      expect(typeof (googleUserInfo)).to.equal('object');
      expect(callBack.accessToken).to.be.a('string');
      expect(callBack.profile).to.an('object');
    });
  });
});


describe('facebook social login', () => {
  describe('authenticate callback', () => {
    const callBack = {
      accessToken: '2b$10$ASa5foN/msFInktnwH2slOZYL',
      refreshToken: '5O582QlPXS',
      profile: {
        id: 9,
        emails: [{ value: 'flippingg2234@gmail.com' }]
      },
    };
    it('should authenticate social login', async () => {
      const facebookUserInfo = facebookSocial(
        callBack.accessToken,
        callBack.refreshToken,
        callBack.profile
      );
      expect(facebookUserInfo).to.be.empty;
      expect(typeof (facebookUserInfo)).to.equal('object');
      expect(callBack.accessToken).to.be.a('string');
      expect(callBack.profile).to.an('object');
    });
  });
});
