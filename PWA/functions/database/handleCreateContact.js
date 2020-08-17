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
// console.log(`config: ${JSON.stringify(JSON.stringify(config, null, 2))}`);
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const firebaseDb = admin.database();
const {
  REACT_APP_PWA_EMAIL
} = config;
const getDbSettingsValues = async () => {
  const existingDbSettings = firebaseDb.ref('settings');
  const dbSettingRef = await existingDbSettings
    .once('value');
  const dbSettings = await dbSettingRef.val();
  return dbSettings && Object.entries(dbSettings)[0][1];
};
const nodemailer = require('nodemailer');
const handleCreateContact = async (snap, context) => {
  const smtpTransortOptions = {
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  };
  let mailOptions = null;
  try {
    console.log(`handleCreateContact.parameters: ${JSON.stringify({
      snap,
      context
    }, null, 2)}`);
    const dbSettingsValues = await getDbSettingsValues();
    const {
      gmailEmail,
      gmailPassword
    } = dbSettingsValues;
    if (gmailEmail && gmailPassword) {
      smtpTransortOptions.auth.user = gmailEmail;
      smtpTransortOptions.auth.pass = gmailPassword;
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
      const mailTransport = nodemailer.createTransport(smtpTransortOptions);
      mailOptions = {
        from: `"TKoT Online" <${gmailEmail}>`,
        to: REACT_APP_PWA_EMAIL,
        subject: subject,
        text: message
      };
      await mailTransport.sendMail(mailOptions);
    }
  } catch (error) {
    console.error(`Handle Create Contact Error: ${error}`);
  } finally {
    console.log(`handleCreateContact.mailOptions: ${JSON.stringify({ mailOptions, smtpTransortOptions }, null, 2)}`);
  }
  return null;
};

exports.handleCreateContact = handleCreateContact;
