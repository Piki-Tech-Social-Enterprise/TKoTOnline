const functions = require('firebase-functions');
const {
  handleGetServerDateTime
} = require('./handleGetServerDateTime');
const {
  handleGetAnalytics
} = require('./handleGetAnalytics');
const {
  handleGetAccessTokenFromServiceAccount
} = require('./handleGetAccessTokenFromServiceAccount');
const {
  handleGetDataFromFirebase
} = require('./handleGetDataFromFirebase');
const {
  handleUpdateProfile
} = require('./handleUpdateProfile');
const {
  handleSetProfile
} = require('./handleSetProfile');

exports.handleGetServerDateTime = functions
  .https
  .onRequest(handleGetServerDateTime);
exports.handleGetAnalytics = functions
  .https
  .onRequest(handleGetAnalytics);
exports.handleGetAccessTokenFromServiceAccount = functions
  .https
  .onRequest(handleGetAccessTokenFromServiceAccount);
exports.handleGetDataFromFirebase = functions
  .https
  .onRequest(handleGetDataFromFirebase);
exports.handleUpdateProfile = functions
  .https
  .onRequest(handleUpdateProfile);
exports.handleSetProfile = functions
  .https
  .onRequest(handleSetProfile);