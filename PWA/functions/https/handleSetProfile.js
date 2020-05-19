const cors = require('cors')({
  origin: true,
});
const {
  httpResponseCodes,
  httpRequestMethods,
  isUserValid,
  FORBIDDEN_TEXT,
  UserHelper
} = require('../utilities');
const validateRequest = async req => {
  const {
    uid: authUserId,
    authUser
  } = req.body;
  let errorMessages = [];
  if (!authUserId) {
    errorMessages.push(`'authUserId' is a required parameter.`);
  } else if (!authUser) {
    errorMessages.push(`'authUser' is a required parameter.`);
  } else if (!(await isUserValid(authUserId))) {
    errorMessages.push(`'authUserId' is not a valid user.`);
  } else if (!authUser.uid || !(await isUserValid(authUser.uid))) {
    errorMessages.push(`'authUser.uid' is not a valid user.`);
  }
  return errorMessages.join('\n');
};
const handleSetProfile = async (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== httpRequestMethods.POST) {
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
      const userHelper = new UserHelper();
      const {
        uid: authUserId,
        authUser
      } = req.body;
      const user = await userHelper.createUser(authUser);
      return res.status(httpResponseCodes.OK).send({
        success: true,
        message: `'${user.uid}' was successfully updated by '${authUserId}'`
      });
    } catch (error) {
      console.log(`handleSetProfile.userRecord Error: httpResponseCode: ${httpResponseCodes.BadRequest}, error.message: ${error.message}`);
      return res.status(httpResponseCodes.BadRequest).send(error.message);
    }
  });
};

exports.handleSetProfile = handleSetProfile;
