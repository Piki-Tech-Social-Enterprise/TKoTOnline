// const functions = require('firebase-functions');
// const {
//   jsonObjectPropertiesToUppercase
// } = require('./index');
// const envcmd = jsonObjectPropertiesToUppercase(functions.config && functions.config().envcmd
//   ? functions.config().envcmd
//   : {});
// const config = Object.assign(process.env, envcmd);
const admin = require('firebase-admin');
const firebaseDb = admin.database();
const getDbSettingsValues = async () => {
  const existingDbSettings = firebaseDb.ref('settings');
  const dbSettingRef = await existingDbSettings
    .once('value');
  const dbSettings = await dbSettingRef.val();
  return dbSettings && Object.entries(dbSettings)[0][1];
};
const nodemailer = require('nodemailer');
const smtpTransortOptions = {
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  }
};

class EmailHelper {
  constructor() {
    // console.log(`config: ${JSON.stringify(config, null, 2)}`);
    // console.log(`admin.apps.length: ${admin.apps.length}`);
    if (admin.apps.length === 0) {
      admin.initializeApp();
    // } else {
    //   console.log(`admin.apps[0]: ${JSON.stringify({
    //     name: admin.apps[0].name,
    //     options: admin.apps[0].options
    //   }, null, 2)}`);
    }
    this.sendEmail = this.handleSendEmail
      .bind(this);
    return this;
  }

  async handleSendEmail(sendEmailOptions) {
    const {
      mailOptions
    } = sendEmailOptions;
    let authUser = sendEmailOptions.authUser;
    let authPass = sendEmailOptions.authPass;
    if (!authUser && !authPass) {
      const dbSettingsValues = await getDbSettingsValues();
      authUser = dbSettingsValues.gmailEmail;
      authPass = dbSettingsValues.gmailPassword;
    }
    if (authUser && authPass) {
      smtpTransortOptions.auth.user = authUser;
      smtpTransortOptions.auth.pass = authPass;
      console.log(`handleSendEmail.mailOptions: ${JSON.stringify({ mailOptions, smtpTransortOptions }, null, 2)}`);
      const mailTransport = nodemailer.createTransport(smtpTransortOptions);
      await mailTransport.sendMail(mailOptions);
      return true;
    }
    return false;
  }
}

exports.EmailHelper = EmailHelper;
