const functions = require('firebase-functions');
const {
  handleCreateVolunteer
} = require('./handleCreateVolunteer');
const {
  handleCreateContact
} = require('./handleCreateContact');

exports.handleCreateVolunteer = functions
  .database
  .ref('/volunteers/{vid}')
  .onCreate(handleCreateVolunteer);
exports.handleCreateContact = functions
  .database
  .ref('/contacts/{cid}')
  .onCreate(handleCreateContact);
