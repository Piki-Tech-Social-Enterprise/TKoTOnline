const {
  httpResponseCodes,
  httpRequestMethods,
  generateRequest,
  generateResponse,
  firebaseConfig,
  googleApplicationCredentials,
  FORBIDDEN_TEXT
} = require('../../utilities');
const test = require('firebase-functions-test')(firebaseConfig, googleApplicationCredentials);
// console.log(`INIT - process.env.FIREBASE_CONFIG: ${process.env.FIREBASE_CONFIG}, process.env.GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
const {
  handleUpdateProfile
} = require('../../https');
const userId = 'xqHlH4QKJFeMibQKHOWPwUrxLOm1';

describe('Cloud Function: handleUpdateProfile', () => {
  before(() => {
    process.env.FIREBASE_CONFIG = JSON.stringify(firebaseConfig);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = googleApplicationCredentials;
    // console.log(`BEFORE - process.env.FIREBASE_CONFIG: ${process.env.FIREBASE_CONFIG}, process.env.GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
  });
  after(() => {
    test.cleanup();
  });
  it(`should return "${FORBIDDEN_TEXT}"`, async () => {
    const res = generateResponse(httpResponseCodes.Forbidden, FORBIDDEN_TEXT);
    await Promise.all(Object.keys(httpRequestMethods).map(async httpRequestMethod => {
      if (httpRequestMethod !== httpRequestMethods.PUT) {
        const req = generateRequest(null, httpRequestMethod);
        await handleUpdateProfile(req, res);
      }
    }));
  });
  it('should return "Bad Request: no parameters"', async () => {
    const req = generateRequest(null, httpRequestMethods.PUT);
    const res = generateResponse(httpResponseCodes.BadRequest, {
      includes: 'is a required parameter'
    });
    await handleUpdateProfile(req, res);
  });
  it('should return "Bad Request: NULL parameters"', async () => {
    const req = generateRequest(null, httpRequestMethods.PUT, null, {
      uid: null,
      dbUser: null
    });
    const res = generateResponse(httpResponseCodes.BadRequest, {
      includes: 'is a required parameter'
    });
    await handleUpdateProfile(req, res);
  });
  it(`should return "Bad Request: 'uid' is a required parameter"`, async () => {
    const req = generateRequest(null, httpRequestMethods.PUT, null, {
      uid: null,
      dbUser: null
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'uid' is a required parameter.`);
    await handleUpdateProfile(req, res);
  });
  it(`should return "Bad Request: 'uid' is not a valid user"`, async () => {
    const req = generateRequest(null, httpRequestMethods.PUT, null, {
      uid: 'x',
      dbUser: {
        uid: 'x'
      }
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'uid' is not a valid user.`);
    await handleUpdateProfile(req, res);
  });
  it(`should return "Bad Request: 'dbUser' is a required parameter"`, async () => {
    const req = generateRequest(null, httpRequestMethods.PUT, null, {
      uid: userId,
      dbUser: null
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'dbUser' is a required parameter.`);
    await handleUpdateProfile(req, res);
  });
  it(`should return "Bad Request: 'dbUser.uid' is not a valid user"`, async () => {
    const req = generateRequest(null, httpRequestMethods.PUT, null, {
      uid: userId,
      dbUser: {
        uid: null
      }
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'dbUser.uid' is not a valid user.`);
    await handleUpdateProfile(req, res);
  });
  it(`should return "Bad Request: 'dbUser.uid' is not a valid user"`, async () => {
    const req = generateRequest(null, httpRequestMethods.PUT, null, {
      uid: userId,
      dbUser: {
        uid: 'x'
      }
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'dbUser.uid' is not a valid user.`);
    await handleUpdateProfile(req, res);
  });
  it(`should return "Actual User Record"`, async () => {
    const req = generateRequest(null, httpRequestMethods.PUT, null, {
      uid: userId,
      dbUser: {
        disabled: false,
        displayName: 'John Shortland',
        email: 'John.Shortland@PikiTech.co.nz',
        emailVerified: true,
        // password: '',
        phoneNumber: null,
        photoURL: '/images/users/xqHlH4QKJFeMibQKHOWPwUrxLOm1/JohnShortland-450x450.png',
        uid: userId
      }
    });
    const res = generateResponse(httpResponseCodes.OK, {
      includes: userId
    });
    await handleUpdateProfile(req, res);
  });
});
