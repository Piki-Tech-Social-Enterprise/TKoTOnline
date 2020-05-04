const moment = require('moment');
const {
  httpResponseCodes,
  httpRequestMethods,
  generateRequest,
  generateResponse,
  firebaseConfig,
  googleApplicationCredentials,
  FORBIDDEN_TEXT,
  ISO8601_DATE_FORMAT
} = require('../../utilities');
const test = require('firebase-functions-test')(firebaseConfig, googleApplicationCredentials);
// console.log(`INIT - process.env.FIREBASE_CONFIG: ${process.env.FIREBASE_CONFIG}, process.env.GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
const {
  handleGetAnalytics
} = require('../../https');
const userId = 'xqHlH4QKJFeMibQKHOWPwUrxLOm1';
const viewId = '215256322';
const today = moment().format(ISO8601_DATE_FORMAT);
const sevenDaysAgo = moment(today).add(-6, 'd').format(ISO8601_DATE_FORMAT);
// const today = 'today';
// const sevenDaysAgo = '7daysAgo';
const alias = 'Users';
const expression = 'ga:users';

describe('Cloud Function: handleGetAnalytics', () => {
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
      if (httpRequestMethod !== httpRequestMethods.GET) {
        const req = generateRequest(null, httpRequestMethod);
        await handleGetAnalytics(req, res);
      }
    }));
  });
  it('should return "Bad Request: no parameters"', async () => {
    const req = generateRequest(null, httpRequestMethods.GET);
    const res = generateResponse(httpResponseCodes.BadRequest, {
      includes: 'is a required parameter'
    });
    await handleGetAnalytics(req, res);
  });
  it('should return "Bad Request: NULL parameters"', async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: null,
      viewId: null,
      startDate: null,
      endDate: null,
      alias: null,
      expression: null
    });
    const res = generateResponse(httpResponseCodes.BadRequest, {
      includes: 'is a required parameter'
    });
    await handleGetAnalytics(req, res);
  });
  it(`should return "Bad Request: 'uid' is a required parameter"`, async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: null,
      viewId: viewId,
      startDate: sevenDaysAgo,
      endDate: today,
      alias: alias,
      expression: expression
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'uid' is a required parameter.`);
    await handleGetAnalytics(req, res);
  });
  it(`should return "Bad Request: 'uid' is not a valid user"`, async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: 'x',
      viewId: viewId,
      startDate: sevenDaysAgo,
      endDate: today,
      alias: alias,
      expression: expression
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'uid' is not a valid user.`);
    await handleGetAnalytics(req, res);
  });
  it(`should return "Bad Request: 'viewId' is a required parameter"`, async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: userId,
      viewId: null,
      startDate: sevenDaysAgo,
      endDate: today,
      alias: alias,
      expression: expression
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'viewId' is a required parameter.`);
    await handleGetAnalytics(req, res);
  });
  it(`should return "Bad Request: 'startDate' is a required parameter"`, async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: userId,
      viewId: viewId,
      startDate: null,
      endDate: today,
      alias: alias,
      expression: expression
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'startDate' is a required parameter.`);
    await handleGetAnalytics(req, res);
  });
  it(`should return "Bad Request: 'startDate' must be a valid date in the following format: (${ISO8601_DATE_FORMAT})"`, async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: userId,
      viewId: viewId,
      startDate: 'x',
      endDate: today,
      alias: alias,
      expression: expression
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'startDate' must be a valid date in the following format: (${ISO8601_DATE_FORMAT}).`);
    await handleGetAnalytics(req, res);
  });
  it(`should return "Bad Request: 'startDate' must be a valid date in the following format: (${ISO8601_DATE_FORMAT})"`, async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: userId,
      viewId: viewId,
      startDate: '18-10-2019',
      endDate: today,
      alias: alias,
      expression: expression
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'startDate' must be a valid date in the following format: (${ISO8601_DATE_FORMAT}).`);
    await handleGetAnalytics(req, res);
  });
  it(`should return "Bad Request: 'endDate' is a required parameter"`, async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: userId,
      viewId: viewId,
      startDate: sevenDaysAgo,
      endDate: null,
      alias: alias,
      expression: expression
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'endDate' is a required parameter.`);
    await handleGetAnalytics(req, res);
  });
  it(`should return "Bad Request: 'endDate' must be a valid date in the following format: (${ISO8601_DATE_FORMAT})"`, async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: userId,
      viewId: viewId,
      startDate: sevenDaysAgo,
      endDate: 'x',
      alias: alias,
      expression: expression
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'endDate' must be a valid date in the following format: (${ISO8601_DATE_FORMAT}).`);
    await handleGetAnalytics(req, res);
  });
  it(`should return "Bad Request: 'endDate' must be a valid date in the following format: (${ISO8601_DATE_FORMAT})"`, async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: userId,
      viewId: viewId,
      startDate: sevenDaysAgo,
      endDate: '18-10-2019',
      alias: alias,
      expression: expression
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'endDate' must be a valid date in the following format: (${ISO8601_DATE_FORMAT}).`);
    await handleGetAnalytics(req, res);
  });
  it(`should return "Bad Request: 'alias' is a required parameter"`, async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: userId,
      viewId: viewId,
      startDate: sevenDaysAgo,
      endDate: today,
      alias: null,
      expression: expression
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'alias' is a required parameter.`);
    await handleGetAnalytics(req, res);
  });
  it(`should return "Bad Request: 'expression' is a required parameter"`, async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: userId,
      viewId: viewId,
      startDate: sevenDaysAgo,
      endDate: today,
      alias: alias,
      expression: null
    });
    const res = generateResponse(httpResponseCodes.BadRequest, `'expression' is a required parameter.`);
    await handleGetAnalytics(req, res);
  });
  it('should return "Actual report data"', async () => {
    const req = generateRequest(null, httpRequestMethods.GET, {
      uid: userId,
      viewId: viewId,
      startDate: sevenDaysAgo,
      endDate: today,
      alias: alias,
      expression: expression
    });
    const res = generateResponse(200, {
      startsWith: '{"reports":'
    });
    await handleGetAnalytics(req, res);
  });
});
