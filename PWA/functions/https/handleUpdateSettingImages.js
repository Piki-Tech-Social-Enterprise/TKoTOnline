const functions = require('firebase-functions');
const admin = require('firebase-admin');
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const database = admin.database();
const {
  handleWriteSetting
} = require('../database/handleWriteSetting');
const {
  isUserValid
} = require('../utilities');
const validateParameters = async (data, context) => {
  let errorMessages = [];
  if (!data || !context) {
    errorMessages.push(`'data' and 'context' are required parameters.`);
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
        errorMessages.push(`uid '${uid}' is not a valid user.`);
      }
    }
  }
  return errorMessages.join('\n');
};
const handleUpdateSettingImages = async (data, context, source = 'handleUpdateSettingImages') => {
  let imagesResized = false;
  let errorMessage = '';
  try {
    errorMessage = await validateParameters(data, context);
    if (!errorMessage) {
      const dbSettingsRef = await database.ref('settings/')
        .orderByChild('active')
        .equalTo(true)
        .limitToFirst(1)
        .once('value');
      const dbSettings = await dbSettingsRef.val();
      const dbSettingsAsArray = Object.keys(dbSettings).map(key =>
        dbSettings[key]
      );
      const dbSetting = dbSettingsAsArray[0];
      const snap = await database.ref(`settings/${dbSetting.sid}`).once('value');
      await handleWriteSetting(snap, context);
      imagesResized = true;
    }
  } catch (error) {
    errorMessage = error.message;
  }
  if (errorMessage) {
    console.log(`${source}.errorMessage: ${errorMessage}`);
    throw new functions.https.HttpsError(`${source}-error`, errorMessage);
  }
  console.log(`Images resized successfully.`);
  return imagesResized;
};

exports.handleUpdateSettingImages = handleUpdateSettingImages;
