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
const {
  handleDeleteProfile
} = require('./handleDeleteProfile');
const {
  handleIsUnique,
  handleIsUniqueAlt
} = require('./handleIsUnique');
const {
  handleImageTransform
} = require('./handleImageTransform');
const {
  handleSendEmail,
  handleSendEmailAlt
} = require('./handleSendEmail');
const {
  handleResizeImages
} = require('./handleResizeImages');
const {
  handleDbFunctions
} = require('./handleDbFunctions');
const {
  handleUpdateSettingImages
} = require('./handleUpdateSettingImages');

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
  .onCall(handleUpdateProfile);
exports.handleSetProfile = functions
  .https
  .onCall(handleSetProfile);
exports.handleDeleteProfile = functions
  .https
  .onCall(handleDeleteProfile);
exports.handleIsUnique = functions
  .https
  .onCall(handleIsUnique);
exports.handleIsUniqueAlt = functions
  .https
  .onRequest(handleIsUniqueAlt);
exports.handleImageTransform = functions
  .https
  .onRequest(handleImageTransform);
exports.handleSendEmail = functions
  .https
  .onCall(handleSendEmail);
exports.handleSendEmailAlt = functions
  .https
  .onRequest(handleSendEmailAlt);
exports.handleResizeImages = functions
  .https
  .onCall(handleResizeImages);
exports.handleDbFunctions = functions
  .https
  .onRequest(handleDbFunctions);
exports.handleUpdateSettingImages = functions
  .https
  .onCall(handleUpdateSettingImages);
