const cors = require('cors')({
  origin: true,
});
const {
  httpResponseCodes,
  httpRequestMethods,
  isUserValid,
  FORBIDDEN_TEXT
} = require('../utilities');
const validateQuery = async query => {
  const {
    uid
  } = query;
  let errorMessages = [];
  if (!uid) {
    errorMessages.push(`'uid' is a required parameter.`);
  } else if (!(await isUserValid(uid))) {
    errorMessages.push(`'uid' is not a valid user.`);
  }
  return errorMessages.join('\n');
};
const handleGetAccessTokenFromServiceAccount = async (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== httpRequestMethods.GET) {
    console.log(`httpResponseCode: ${httpResponseCodes.Forbidden}, errorMessage: ${FORBIDDEN_TEXT}`);
    return res.status(httpResponseCodes.Forbidden).send(FORBIDDEN_TEXT);
  }
  console.log(`req.query: ${JSON.stringify(req.query, null, 2)}`);
  let errorMessage = await validateQuery(req.query);
  if (errorMessage) {
    console.log(`httpResponseCode: ${httpResponseCodes.BadRequest}, errorMessage: ${errorMessage}`);
    return res.status(httpResponseCodes.BadRequest).send(errorMessage);
  }
  return cors(req, res, async () => {
    try {
      const functions = require('firebase-functions');
      const {
        jsonObjectPropertiesToUppercase
      } = require('../utilities');
      const envcmd = jsonObjectPropertiesToUppercase(functions.config && functions.config().envcmd
        ? functions.config().envcmd
        : {});
      const config = Object.assign(process.env, envcmd);
      console.log(`config: ${JSON.stringify(JSON.stringify(config, null, 2))}`);
      const {
        google
      } = require('googleapis');
      const auth = new google.auth.GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/analytics.readonly'
      });
      // console.log(`auth: ${JSON.stringify(auth, null, 2)}`);
      const authClient = await auth.getClient();
      // console.log(`authClient: ${JSON.stringify(authClient, null, 2)}`);
      const accessToken = await authClient.getAccessToken();
      console.log(`handleGetAccessTokenFromServiceAccount.accessToken: ${JSON.stringify(accessToken, null, 2)}`);
      return res.status(httpResponseCodes.OK).send(accessToken);
    } catch (error) {
      console.log(`handleGetAccessTokenFromServiceAccount.accessToken Error: httpResponseCode: ${httpResponseCodes.BadRequest}, error.message: ${error.message}`);
      return res.status(httpResponseCodes.BadRequest).send(error.message);
    }
  });
};

exports.handleGetAccessTokenFromServiceAccount = handleGetAccessTokenFromServiceAccount;
