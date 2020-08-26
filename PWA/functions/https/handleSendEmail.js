const cors = require('cors')({
  origin: true,
});
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const {
  EmailHelper
} = require('../utilities/EmailHelper');
const {
  jsonObjectPropertiesToUppercase,
  httpResponseCodes,
  httpRequestMethods,
  isUserValid,
  FORBIDDEN_TEXT
} = require('../utilities');
const envcmd = jsonObjectPropertiesToUppercase(functions.config && functions.config().envcmd
  ? functions.config().envcmd
  : {});
const config = Object.assign(process.env, envcmd);
// console.log(`config: ${JSON.stringify(config, null, 2)}`);
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const validateParameters = async (data, context) => {
  let errorMessages = [];
  if (!data || !context) {
    errorMessages.push(`'data' and 'context' are required parameters.`);
  } else {
    const {
      mailOptions,
      ignoreAuth
    } = data;
    if (!mailOptions) {
      errorMessages.push(`'mailOptions' is a required parameter.`);
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
const handleSendEmail = async (data, context, source = 'handleSendEmail') => {
  let emailSent = false;
  let errorMessage = '';
  try {
    // console.log(`${source}.parameters: ${JSON.stringify({
    //   data,
    //   // context
    // }, null, 2)}`);
    errorMessage = await validateParameters(data, context);
    if (!errorMessage) {
      const {
        mailOptions,
        authUser,
        authPass
      } = data;
      const emailHelper = new EmailHelper();
      emailSent = await emailHelper.sendEmail({
        mailOptions,
        authUser,
        authPass
      });
    }
  } catch (error) {
    errorMessage = error.message;
  }
  if (errorMessage) {
    console.log(`${source}.errorMessage: ${errorMessage}`);
    throw new functions.https.HttpsError(`${source}-error`, errorMessage);
  }
  return emailSent;
};
const handleSendEmailAlt = async (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== httpRequestMethods.POST) {
    console.log(`httpResponseCode: ${httpResponseCodes.Forbidden}, errorMessage: ${FORBIDDEN_TEXT}`);
    return res.status(httpResponseCodes.Forbidden).send(FORBIDDEN_TEXT);
  }
  console.log(`req: ${JSON.stringify(req, null, 2)}`);
  const {
    data,
    context
  } = req;
  let errorMessage = await validateParameters(data, context);
  if (errorMessage) {
    console.log(`httpResponseCode: ${httpResponseCodes.BadRequest}, errorMessage: ${errorMessage}`);
    return res.status(httpResponseCodes.BadRequest).send(errorMessage);
  }
  return cors(req, res, async () => {
    try {
      const {
        data,
        context
      } = req;
      const emailSent = await handleSendEmail(data, context, 'handleSendEmailAlt');
      return res.status(httpResponseCodes.OK).send({
        success: emailSent,
        message: `Email sent.`
      });
    } catch (error) {
      console.log(`handleSendEmailAlt Error: httpResponseCode: ${httpResponseCodes.BadRequest}, error.message: ${error.message}`);
      return res.status(httpResponseCodes.BadRequest).send(error.message);
    }
  });
};

exports.handleSendEmail = handleSendEmail;
exports.handleSendEmailAlt = handleSendEmailAlt;
