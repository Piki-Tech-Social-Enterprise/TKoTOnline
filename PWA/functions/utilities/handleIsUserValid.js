// const functions = require('firebase-functions');
const admin = require('firebase-admin');
const getDbUserValue = async uid => {
  // console.log(`BEFORE admin.initializeApp() - process.env.FIREBASE_CONFIG: ${JSON.stringify(JSON.parse(process.env.FIREBASE_CONFIG), null, 2)}`);
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.REACT_APP_GAC),
      databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
    });
  }
  // console.log(`getDbUserValue - process.env.FIREBASE_CONFIG: ${JSON.stringify(JSON.parse(process.env.FIREBASE_CONFIG), null, 2)}`);
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

exports.handleIsUserValid = handleIsUserValid;