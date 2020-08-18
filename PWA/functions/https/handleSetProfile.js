const functions = require('firebase-functions');
const {
  UserHelper
} = require('../utilities/UserHelper');
const {
  isUserValid
} = require('../utilities');
// const {
//   stringify
// } = require('flatted');
const validateParameters = async (data, context) => {
  let errorMessages = [];
  if (!data || !context) {
    errorMessages.push(`'data' and 'context' are required parameters.`);
  } else {
    const {
      authUser
    } = data;
    if (!authUser) {
      errorMessages.push(`'authUser' is a required parameter.`);
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
const handleSetProfile = async (data, context, source = 'handleSetProfile') => {
  let profileCreated = false;
  let errorMessage = '';
  try {
    // console.log(`${source}.parameters: ${stringify({
    //   data,
    //   context
    // }, null, 2)}`);
    errorMessage = await validateParameters(data, context);
    if (!errorMessage) {
      const {
        authUser
      } = data;
      const userHelper = new UserHelper();
      profileCreated = await userHelper.createUser(authUser);
    }
  } catch (error) {
    errorMessage = error.message;
  }
  if (errorMessage) {
    console.log(`${source}.errorMessage: ${errorMessage}`);
    throw new functions.https.HttpsError(`${source}-error`, errorMessage);
  }
  return profileCreated;
};

exports.handleSetProfile = handleSetProfile;
