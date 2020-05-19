const functions = require('firebase-functions');
const {
  handleCreateVolunteer
} = require('./handleCreateVolunteer');

exports.handleCreateVolunteer = functions
  .database
  .ref('/volunteers/{vid}')
  .onCreate(handleCreateVolunteer);
