const {
  httpResponseCodes,
  httpRequestMethods,
  generateRequest,
  generateResponse,
  firebaseConfig,
  googleApplicationCredentials,
  FORBIDDEN_TEXT,
  DATE_TIME_MOMENT_FORMAT
} = require('../../utilities');
const test = require('firebase-functions-test')(firebaseConfig, googleApplicationCredentials);
// console.log(`INIT - process.env.FIREBASE_CONFIG: ${process.env.FIREBASE_CONFIG}, process.env.GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
const {
  handleGetServerDateTime
} = require('../../https');
const moment = require('moment');

describe('Cloud Function: handleGetServerDateTime', () => {
  after(() => {
    test.cleanup();
  });
  it(`should return "${FORBIDDEN_TEXT}"`, async () => {
    const res = generateResponse(httpResponseCodes.Forbidden, FORBIDDEN_TEXT);
    return await Promise.all(Object.keys(httpRequestMethods).map(async httpRequestMethod => {
      if (httpRequestMethod !== httpRequestMethods.GET) {
        const req = generateRequest(null, httpRequestMethod);
        await handleGetServerDateTime(req, res);
      }
      return void(0);
    }));
  });
  it('should return "' + moment().format(DATE_TIME_MOMENT_FORMAT) + '" - Query.format', async () => {
    const req = generateRequest(null, httpRequestMethods.GET, { format: DATE_TIME_MOMENT_FORMAT });
    const res = generateResponse(httpResponseCodes.OK, moment().format(DATE_TIME_MOMENT_FORMAT));
    await handleGetServerDateTime(req, res);
  });
  it('should return "' + moment().format(DATE_TIME_MOMENT_FORMAT) + '" - Body.format', async () => {
    const req = generateRequest(null, httpRequestMethods.GET, null, { format: DATE_TIME_MOMENT_FORMAT });
    const res = generateResponse(httpResponseCodes.OK, moment().format(DATE_TIME_MOMENT_FORMAT));
    await handleGetServerDateTime(req, res);
  });
});
