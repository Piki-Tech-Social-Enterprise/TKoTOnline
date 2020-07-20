const cors = require('cors')({
  origin: true,
});
const functions = require('firebase-functions');
const {
  httpResponseCodes,
  httpRequestMethods,
  isUserValid,
  FORBIDDEN_TEXT,
  UserHelper
} = require('../utilities');
const {
  stringify
} = require('flatted');
const validateRequest = async req => {
  const {
    uid: authUserId,
    authUser
  } = req.body;
  let errorMessages = [];
  if (!authUserId) {
    errorMessages.push(`'authUserId' is a required parameter. authUserId: '${authUserId}'`);
  } else if (!authUser) {
    errorMessages.push(`'authUser' is a required parameter.`);
  } else if (!(await isUserValid(authUserId))) {
    errorMessages.push(`'authUserId' is not a valid user.`);
  } else if (!authUser.uid || !(await isUserValid(authUser.uid))) {
    errorMessages.push(`'authUser.uid' is not a valid user.`);
  }
  return errorMessages.join('\n');
};
const validateParameters = async (data, context) => {
  let errorMessages = [];
  // console.log('data: ', data);
  // console.log('context: ', context);
  if (!data || !context) {
    errorMessages.push(`'data' and 'context' are required parameters.`);
  } else {
    const {
      uid
    } = data;
    if (!uid) {
      errorMessages.push(`'uid' is a required parameter.`);
    } else {
      const {
        auth
      } = context;
      if (!auth) {
        if (!ignoreAuth) {
          errorMessages.push('This function must be called while authenticated.');
        }
      } else {
        const {
          uid
        } = auth;
        if (!(await isUserValid(uid))) {
          errorMessages.push(`'uid' is not a valid user.`);
        }
      }
    }
  }
  return errorMessages.join('\n');
};
const handleDeleteProfile = async (data, context, source = 'handleDeleteProfile') => {
  let profileDeleted = false;
  let errorMessage = '';
  try {
    errorMessage = await validateParameters(data, context);
    if (!errorMessage) {
      const {
        uid
      } = data;
      const userHelper = new UserHelper();
      try {
        await userHelper.deleteAuthUser({
          uid
        });
      } catch (error) {
        console.log('userHelper.deleteAuthUser.error: ', error);
      }
      try {
        await userHelper.deleteDbUser(uid);
      } catch (error) {
        console.log('userHelper.deleteDbUser.error: ', error);
      }
    }
  } catch (error) {
    errorMessage = error.message;
  }
  if (errorMessage) {
    console.log(`${source}.errorMessage: ${errorMessage}`);
    throw new functions.https.HttpsError(`${source}-error`, errorMessage);
  }
  return profileDeleted;
};
const handleDeleteProfileAlt = async (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Access-Control-Allow-Methods', 'DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== httpRequestMethods.DELETE) {
    console.log(`httpResponseCode: ${httpResponseCodes.Forbidden}, errorMessage: ${FORBIDDEN_TEXT}, req.method: ${req.method}`);
    return res.status(httpResponseCodes.Forbidden).send(FORBIDDEN_TEXT);
  }
  console.log(`req: ${stringify(req)}`);
  console.log(`req.body: ${JSON.stringify(req.body, null, 2)}`);
  // let errorMessage = await validateRequest(req);
  let errorMessage = await validateParameters(data, context);
  if (errorMessage) {
    console.log(`httpResponseCode: ${httpResponseCodes.BadRequest}, errorMessage: ${errorMessage}`);
    return res.status(httpResponseCodes.BadRequest).send(errorMessage);
  }
  return cors(req, res, async () => {
    try {
      const userHelper = new UserHelper();
      const {
        uid: authUserId,
        authUser
      } = req.body;
      await userHelper.deleteAuthUser(authUser);
      await userHelper.deleteDbUser(authUser.uid);
      return res.status(httpResponseCodes.OK).send({
        success: true,
        message: `'${authUser.uid}' was successfully deleted by '${authUserId}'`
      });
    } catch (error) {
      console.log(`handleDeleteProfile.userRecord Error: httpResponseCode: ${httpResponseCodes.BadRequest}, error.message: ${error.message}`);
      return res.status(httpResponseCodes.BadRequest).send(error.message);
    }
  });
};

exports.handleDeleteProfile = handleDeleteProfile;
exports.handleDeleteProfileAlt = handleDeleteProfileAlt;
