const admin = require('firebase-admin');
const cors = require('cors')({
  origin: true,
});
const {
  httpResponseCodes,
  httpRequestMethods,
  isUserValid,
  FORBIDDEN_TEXT
} = require('../utilities');
const validateRequest = async req => {
  const {
    uid,
    dbUser
  } = req.body;
  let errorMessages = [];
  if (!uid) {
    errorMessages.push(`'uid' is a required parameter.`);
  } else if (!dbUser) {
    errorMessages.push(`'dbUser' is a required parameter.`);
  } else if (!(await isUserValid(uid))) {
    errorMessages.push(`'uid' is not a valid user.`);
  } else if (!dbUser.uid || !(await isUserValid(dbUser.uid))) {
    errorMessages.push(`'dbUser.uid' is not a valid user.`);
  }
  return errorMessages.join('\n');
};
const handleUpdateProfile = async (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Access-Control-Allow-Methods', 'PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== httpRequestMethods.PUT) {
    console.log(`httpResponseCode: ${httpResponseCodes.Forbidden}, errorMessage: ${FORBIDDEN_TEXT}`);
    return res.status(httpResponseCodes.Forbidden).send(FORBIDDEN_TEXT);
  }
  console.log(`req: ${JSON.stringify(req, null, 2)}`);
  let errorMessage = await validateRequest(req);
  if (errorMessage) {
    console.log(`httpResponseCode: ${httpResponseCodes.BadRequest}, errorMessage: ${errorMessage}`);
    return res.status(httpResponseCodes.BadRequest).send(errorMessage);
  }
  return cors(req, res, async () => {
    try {
      console.log(`process.env.GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
      console.log(`process.env.FIREBASE_CONFIG: ${process.env.FIREBASE_CONFIG}`);
      if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(process.env.REACT_APP_GAC),
          databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
        });
      }
      const {
        uid: authUserId,
        dbUser
      } = req.body;
      const {
        disabled,
        displayName,
        email,
        emailVerified,
        password,
        phoneNumber,
        photoURL,
        uid
      } = dbUser;
      const existingUser = await admin.auth().getUser(uid);
      console.log(`existingUser: ${JSON.stringify(existingUser, null, 2)}`);
      const updateRequest = {
        disabled: disabled || existingUser.disabled || false,
        displayName: displayName || existingUser.displayName || null,
        email: email || existingUser.email || null,
        emailVerified: emailVerified || existingUser.emailVerified || false,
        password: password || existingUser.password || null,
        phoneNumber: phoneNumber || existingUser.phoneNumber || null,
        photoURL: photoURL || existingUser.phoneNumber || null
      };
      console.log(`updateRequest: ${JSON.stringify(updateRequest, null, 2)}`);
      const userRecord = await admin.auth().updateUser(uid, updateRequest);
      console.log(`handleUpdateProfile.userRecord: ${JSON.stringify(userRecord, null, 2)}`);
      return res.status(httpResponseCodes.OK).send({
        success: true,
        message: `'${uid}' was successfully updated by '${authUserId}'`
      });
    } catch (error) {
      console.log(`handleUpdateProfile.userRecord Error: httpResponseCode: ${httpResponseCodes.BadRequest}, error.message: ${error.message}`);
      return res.status(httpResponseCodes.BadRequest).send(error.message);
    }
  });
};

exports.handleUpdateProfile = handleUpdateProfile;
