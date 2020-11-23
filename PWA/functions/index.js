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
  handleDeleteProfile,
  handleIsUnique,
  handleIsUniqueAlt,
  handleImageTransform,
  handleSendEmail,
  handleSendEmailAlt,
  handleResizeImages
} = require('./https');
/*
--- Get Server Date ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/getServerDateTime

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/getServerDateTime
*/
exports.getServerDateTime = handleGetServerDateTime;

/*
--- Get Analytics ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/getAnalytics?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1&viewId=215256322&startDate=2019-10-12&endDate=2019-10-18&alias=Users&expression=ga:users

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/getAnalytics?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1&viewId=215256322&startDate=2019-10-12&endDate=2019-10-18&alias=Users&expression=ga:users
*/
exports.getAnalytics = handleGetAnalytics;

/*
--- Get Access Token From Service Account ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/getAccessTokenFromServiceAccount?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/getAccessTokenFromServiceAccount?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1
*/
exports.getAccessTokenFromServiceAccount = handleGetAccessTokenFromServiceAccount;

/*
--- Get Data From Firebase ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/getDataFromFirebase?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/getDataFromFirebase?uid=xqHlH4QKJFeMibQKHOWPwUrxLOm1
*/
exports.getDataFromFirebase = handleGetDataFromFirebase;

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
exports.setProfile = handleSetProfile;

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
  }
}

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/updateProfile
*/
exports.updateProfile = handleUpdateProfile;

/*
--- Delete Profile ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/deleteProfile
{
  uid: 'xqHlH4QKJFeMibQKHOWPwUrxLOm1',
  dbUser: {
    uid: '-M7eyOltEQhhBJhG-0TL'
  }
}

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/deleteProfile
*/
exports.deleteProfile = handleDeleteProfile;

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
exports.isUnique = handleIsUnique;
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
exports.isUniqueAlt = handleIsUniqueAlt;

/*
--- Image Transform ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/imageTransform/cdn/image/?s=images/iwiMembers/-MBcnZKWJsTMG0Eu4OnE/Kahukuraariki-250x250.png&w=250&h=250&l=1
http://localhost:5000/cdn/image/?s=images/iwiMembers/-MBcnZKWJsTMG0Eu4OnE/Kahukuraariki-250x250.png&w=250&h=250&l=1

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/imageTransform/cdn/image/?s=images/iwiMembers/-MBcnZKWJsTMG0Eu4OnE/Kahukuraariki-250x250.png&w=250&h=250&l=1
https://web-dev.tkot.org.nz/cdn/image/?s=images/iwiMembers/-MBcnZKWJsTMG0Eu4OnE/Kahukuraariki-250x250.png&w=250&h=250&l=1
*/
exports.imageTransform = handleImageTransform;

/*
--- Send Email ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/sendEmail
{
  data: {
    mailOptions: {
      from: '"TKoT Online" <web.portal@tkot.org>',
      to: 'Dev.Ops@PikiTech.co.nz',
      subject: 'Test Email',
      text: 'Test Message'
    },
    authUser: 'web.portal@tkot.org',
    authPass: 'dalfzahbltypocpz',
    ignoreAuth: false
  },
  context: {
    auth: {
      uid: 'xqHlH4QKJFeMibQKHOWPwUrxLOm1'
    }
  }
}

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/sendEmail
*/
exports.sendEmail = handleSendEmail;
/*
--- Send Email Alt ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/sendEmailAlt
{
  data: {
    mailOptions: {
      from: '"TKoT Online" <web.portal@tkot.org>',
      to: 'Dev.Ops@PikiTech.co.nz',
      subject: 'Test Email',
      text: 'Test Message'
    },
    authUser: 'web.portal@tkot.org',
    authPass: 'dalfzahbltypocpz',
    ignoreAuth: false
  },
  context: {
    auth: {
      uid: 'xqHlH4QKJFeMibQKHOWPwUrxLOm1'
    }
  }
}

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/sendEmailAlt
*/
exports.sendEmailAlt = handleSendEmailAlt;

/*
--- Resize Images ---
Usage:
Local
http://localhost:5001/tkot-online-dev/us-central1/resizeImages
{
}

Remote
https://us-central1-tkot-online-dev.cloudfunctions.net/resizeImages
*/
exports.resizeImages = handleResizeImages;

const {
  handleCreateVolunteer,
  handleCreateContact
} = require('./database');
/*
--- Create Volunteer ---
Usage:
createVolunteer(snap, context)
*/
exports.createVolunteer = handleCreateVolunteer;

/*
-- Create Contact ---
Usage: createContact(snap, context)
*/
exports.createContact = handleCreateContact;
