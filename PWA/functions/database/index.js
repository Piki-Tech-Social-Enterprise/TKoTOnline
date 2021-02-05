const functions = require('firebase-functions');
const {
  handleCreateVolunteer
} = require('./handleCreateVolunteer');
const {
  handleCreateContact
} = require('./handleCreateContact');
const {
  handleWriteSetting
} = require('./handleWriteSetting');

exports.handleCreateVolunteer = functions
  .database
  .ref('/volunteers/{vid}')
  .onCreate(handleCreateVolunteer);
exports.handleCreateContact = functions
  .database
  .ref('/contacts/{cid}')
  .onCreate(handleCreateContact);
exports.handleWriteSetting = functions
  .database
  .ref('/settings/{sid}')
  .onWrite(handleWriteSetting);
