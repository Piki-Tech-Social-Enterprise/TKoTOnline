const {
  handleResizeImage
} = require('./storage');
/*
--- Resize Image ---
Usage:
resizeImage({bucket: 'tkot-online-dev.appspot.com', name: '/images/users/xqHlH4QKJFeMibQKHOWPwUrxLOm1/JohnShortland-80x80.png', contentType: 'image/png'})
resizeImage({bucket: 'tkot-online-dev.appspot.com', name: '/images/users/xqHlH4QKJFeMibQKHOWPwUrxLOm1/JohnShortland-450x450.png', contentType: 'image/png'})
*/
exports.resizeImage = handleResizeImage;

const {
  handleGetServerDateTime,
  handleGetAnalytics,
  handleGetAccessTokenFromServiceAccount,
  handleGetDataFromFirebase,
  handleSetProfile,
  handleUpdateProfile,
  handleIsUnique,
  handleIsUniqueAlt,
  getCampaigns
} = require('./https');
/*
--- Get Server Date ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/getServerDateTime

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/getServerDateTime
*/
//exports.getServerDateTime = handleGetServerDateTime;
/*
--- Get Analytics ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/getAnalytics?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1&viewId=215256322&startDate=2019-10-12&endDate=2019-10-18&alias=Users&expression=ga:users

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/getAnalytics?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1&viewId=215256322&startDate=2019-10-12&endDate=2019-10-18&alias=Users&expression=ga:users
*/
//exports.getAnalytics = handleGetAnalytics;
/*
--- Get Access Token From Service Account ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/getAccessTokenFromServiceAccount?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/getAccessTokenFromServiceAccount?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1
*/
//exports.getAccessTokenFromServiceAccount = handleGetAccessTokenFromServiceAccount;
/*
--- Get Data ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/getDataFromFirebase?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/getDataFromFirebase?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1
*/
//exports.getDataFromFirebase = handleGetDataFromFirebase;
/*
--- Set Profile ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/setProfile
{
  uid: 'xqHlH4QKJFeMibQKHOWPwUrxLOm1',
  dbUser: {
    disabled: false,
    displayName: 'John Shortland',
    email: 'John.Shortland@PikiTech.co.nz',
    emailVerified: true,
    password: 'P@$$w0rd',
    phoneNumber: null,
    photoURL: '/images/users/xqHlH4QKJFeMibQKHOWPwUrxLOm1/JohnShortland-450x450.png',
  }
}

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/setProfile
*/
//exports.setProfile = handleSetProfile;
/*
--- Update Profile ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/updateProfile
{
  uid: 'xqHlH4QKJFeMibQKHOWPwUrxLOm1',
  dbUser: {
    disabled: false,
    displayName: 'John Shortland',
    email: 'John.Shortland@PikiTech.co.nz',
    emailVerified: true,
    password: 'P@$$w0rd',
    phoneNumber: null,
    photoURL: '/images/users/xqHlH4QKJFeMibQKHOWPwUrxLOm1/JohnShortland-450x450.png',
    uid: 'xqHlH4QKJFeMibQKHOWPwUrxLOm1'
  }
}

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/updateProfile
*/
//exports.updateProfile = handleUpdateProfile;
/*
--- Is Unique ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/isUnique
{
  data: {
    dbObjectName: 'volunteers',
    dbObjectFieldName: 'email',
    dbObjectFieldValue: email
  },
  context: {
    auth: {
      uid: 'xqHlH4QKJFeMibQKHOWPwUrxLOm1'
    }
  }
}

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/isUnique
*/
//exports.isUnique = handleIsUnique;
/*
--- Is Unique Alt ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/isUniqueAlt
{
  data: {
    dbObjectName: 'volunteers',
    dbObjectFieldName: 'email',
    dbObjectFieldValue: email
  },
  context: {
    auth: {
      uid: 'xqHlH4QKJFeMibQKHOWPwUrxLOm1'
    }
  }
}

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/isUniqueAlt
*/
//exports.isUniqueAlt = handleIsUniqueAlt;

const {
  handleCreateVolunteer
} = require('./database');
/*
--- Create Volunteer ---
Usage:
createVolunteer(snap, context)
*/
//exports.createVolunteer = handleCreateVolunteer;

exports.getCampaigns = getCampaigns;
