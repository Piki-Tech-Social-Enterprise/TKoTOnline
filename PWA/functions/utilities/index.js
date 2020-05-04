const assert = require('assert');
const httpResponseCodes = {
  OK: 200,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404
};
const httpRequestMethods = {
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  CONNECT: 'CONNECT',
  OPTIONS: 'OPTIONS',
  TRACE: 'TRACE',
  PATCH: 'PATCH'
};
const generateRequest = (headers, method, query, body) => {
  const request = {
    headers: headers || { origins: true },
    method: method || httpRequestMethods.GET,
    query: query || {},
    body: body || {}
  };
  // console.log(`generateRequest: ${JSON.stringify(request)}`);
  return request;
};
const generateResponse = (expectedHttpResponseCode, expectedTextToSend) => {
  const response = {
    header: (key, value) => { },
    setHeader: (key, value) => { },
    getHeader: (value) => { },
    status: httpResponseCode => {
      assert.equal(httpResponseCode, expectedHttpResponseCode);
      return {
        send: textToSend => {
          if (typeof expectedTextToSend === 'string') {
            console.log(`textToSend: ${textToSend}, expectedTextToSend: ${expectedTextToSend}`);
            assert.equal(textToSend, expectedTextToSend);
          } else {
            const {
              startsWith,
              includes,
              endsWith
            } = expectedTextToSend;
            textToSend = typeof textToSend === 'string'
              ? textToSend
              : JSON.stringify(textToSend);
            console.log(`textToSend: ${textToSend}, expectedTextToSend: ${JSON.stringify(expectedTextToSend, null, 2)}`);
            if (startsWith) {
              assert.ok(textToSend.startsWith(startsWith), `'${textToSend}' does not start with '${startsWith}'`);
            }
            if (includes) {
              assert.ok(textToSend.includes(includes), `'${textToSend}' does not include '${includes}'`);
            }
            if (endsWith) {
              assert.ok(textToSend.endsWith(endsWith), `'${textToSend}' does not end with '${endsWith}'`);
            }
          }
        }
      };
    }
  };
  // console.log(`generateResponse: ${JSON.stringify(response)}`);
  return response;
};
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
const googleApplicationCredentials = process.env.REACT_APP_GAC;
const {
  handleIsUserValid
} = require('./handleIsUserValid');
const FORBIDDEN_TEXT = 'Forbidden!';
const DATE_MOMENT_FORMAT = 'DD/MM/YYYY';
const TIME_MOMENT_FORMAT = 'HH:mm:ss';
const DATE_TIME_MOMENT_FORMAT = `${DATE_MOMENT_FORMAT} ${TIME_MOMENT_FORMAT}`;
const ISO8601_DATE_FORMAT = 'YYYY-MM-DD';
const isEmptyObject = object => !object || (Object.entries(object).length === 0 && object.constructor === Object);
const objectToArray = (object, mapCallback, removeEmptyItems = true) => Object.keys(object).map(mapCallback).filter(item => !removeEmptyItems || !isEmptyObject(item));
const arrayToObject = (array, keyField) => Object.assign({}, ...array.map(item => ({ [item[keyField]]: item })));
const {
  StorageBucketHelper
} = require('./StorageBucketHelper');

exports.assert = assert;
exports.httpResponseCodes = httpResponseCodes;
exports.httpRequestMethods = httpRequestMethods;
exports.generateRequest = generateRequest;
exports.generateResponse = generateResponse;
exports.firebaseConfig = firebaseConfig;
exports.googleApplicationCredentials = googleApplicationCredentials;
exports.isUserValid = handleIsUserValid;
exports.FORBIDDEN_TEXT = FORBIDDEN_TEXT;
exports.DATE_MOMENT_FORMAT = DATE_MOMENT_FORMAT;
exports.TIME_MOMENT_FORMAT = TIME_MOMENT_FORMAT;
exports.DATE_TIME_MOMENT_FORMAT = DATE_TIME_MOMENT_FORMAT;
exports.ISO8601_DATE_FORMAT = ISO8601_DATE_FORMAT;
exports.isEmptyObject = isEmptyObject;
exports.objectToArray = objectToArray;
exports.arrayToObject = arrayToObject;
exports.StorageBucketHelper = StorageBucketHelper;
