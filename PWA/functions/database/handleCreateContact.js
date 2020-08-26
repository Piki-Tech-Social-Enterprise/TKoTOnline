const admin = require('firebase-admin');
const functions = require('firebase-functions');
const {
  jsonObjectPropertiesToUppercase,
  DATE_TIME_MOMENT_FORMAT,
  JS_DATE_TIME_FORMAT
} = require('../utilities');
const moment = require('moment');
const envcmd = jsonObjectPropertiesToUppercase(functions.config && functions.config().envcmd
  ? functions.config().envcmd
  : {});
const config = Object.assign(process.env, envcmd);
// console.log(`config: ${JSON.stringify(config, null, 2)}`);
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const {
  REACT_APP_PWA_EMAIL
} = config;
const {
  EmailHelper
} = require('../utilities/EmailHelper');
const handleCreateContact = async (snap, context) => {
  let mailOptions = null;
  try {
    console.log(`handleCreateContact.parameters: ${JSON.stringify({
      snap,
      context
    }, null, 2)}`);
    const dbContact = await snap.val();
    const {
      created,
      email,
      firstName,
      lastName,
      message,
      subscribed
    } = dbContact;
    const defaultMessage = 'Sign Up to Newsletter';
    const subject = `${firstName} ${lastName} (${email}) ${subscribed
      ? defaultMessage === message
        ? 'subscribed'
        : 'subscribed and sent a message'
      : 'sent a message'} on ${moment(created, JS_DATE_TIME_FORMAT).format(DATE_TIME_MOMENT_FORMAT)}`;
    mailOptions = {
      from: 'TKoT Online',
      to: REACT_APP_PWA_EMAIL,
      subject: subject,
      text: message
    };
    const emailHelper = new EmailHelper();
    emailHelper.sendEmail({
      mailOptions
    });
  } catch (error) {
    console.error(`Handle Create Contact Error: ${error}`);
  }
  return null;
};

exports.handleCreateContact = handleCreateContact;
