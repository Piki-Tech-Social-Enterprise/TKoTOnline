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
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const jsonObjectPropertiesToUppercase = jsonObject => {
  const revisedJsonObject = {};
  Object.keys(jsonObject).map(key => (
    revisedJsonObject[key.toUpperCase()] = jsonObject[key]
  ));
  return revisedJsonObject;
};
const envcmd = jsonObjectPropertiesToUppercase(functions.config && functions.config().envcmd
  ? functions.config().envcmd
  : {});
const config = Object.assign(process.env, envcmd);
// console.log(`config: ${JSON.stringify(JSON.stringify(config, null, 2))}`);
const firebaseConfig = {
  apiKey: config.REACT_APP_FIREBASE_API_KEY,
  authDomain: config.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: config.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: config.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: config.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.REACT_APP_FIREBASE_APP_ID,
  measurementId: config.REACT_APP_FIREBASE_MEASUREMENT_ID
};
const googleApplicationCredentials = config.REACT_APP_GAC;
const getDbUserValue = async uid => {
  // console.log(`BEFORE admin.initializeApp() - config.FIREBASE_CONFIG: ${JSON.stringify(JSON.parse(config.FIREBASE_CONFIG), null, 2)}`);
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(config.REACT_APP_GAC),
      databaseURL: config.REACT_APP_FIREBASE_DATABASE_URL
    });
  }
  // console.log(`getDbUserValue - config.FIREBASE_CONFIG: ${JSON.stringify(JSON.parse(config.FIREBASE_CONFIG), null, 2)}`);
  const snapshot = await admin.database().ref(`users/${uid}`).once('value');
  const dbUser = await snapshot.val();
  return dbUser;
};
const systemAdminRole = 'systemAdminRole';
const adminRole = 'adminRole';
const basicRole = 'basicRole';
const handleIsUserValid = async uid => {
  const dbUser = await getDbUserValue(uid);
  const isUserValid = dbUser &&
    dbUser.active &&
    (Boolean(dbUser.roles[systemAdminRole]) ||
      Boolean(dbUser.roles[adminRole]) ||
      Boolean(dbUser.roles[basicRole]));
  console.log(`dbUser: ${JSON.stringify(dbUser, null, 2)},\nisUserValid: ${isUserValid}`);
  return isUserValid;
};
const FORBIDDEN_TEXT = 'Forbidden!';
const DATE_MOMENT_FORMAT = 'DD/MM/YYYY';
const TIME_MOMENT_FORMAT = 'HH:mm:ss';
const DATE_TIME_MOMENT_FORMAT = `${DATE_MOMENT_FORMAT} ${TIME_MOMENT_FORMAT}`;
const ISO8601_DATE_FORMAT = 'YYYY-MM-DD';
const JS_DATE_TIME_FORMAT = 'ddd MMM DD YYYY HH:mm:ss';
const isEmptyObject = object => !object || (Object.entries(object).length === 0 && object.constructor === Object);
const objectToArray = (object, mapCallback, removeEmptyItems = true) => Object.keys(object).map(mapCallback).filter(item => !removeEmptyItems || !isEmptyObject(item));
const arrayToObject = (array, keyField) => Object.assign({}, ...array.map(item => ({ [item[keyField]]: item })));
const {
  StorageBucketHelper
} = require('./StorageBucketHelper');
const isBoolean = value => value && (typeof value === 'boolean' || value.toString().toLowerCase() === 'true' || value.toString().toLowerCase() === 'false');

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
exports.JS_DATE_TIME_FORMAT = JS_DATE_TIME_FORMAT;
exports.isEmptyObject = isEmptyObject;
exports.objectToArray = objectToArray;
exports.arrayToObject = arrayToObject;
exports.StorageBucketHelper = StorageBucketHelper;
exports.jsonObjectPropertiesToUppercase = jsonObjectPropertiesToUppercase;
exports.isBoolean = isBoolean;
