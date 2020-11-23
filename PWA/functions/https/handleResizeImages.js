const functions = require('firebase-functions');
const admin = require('firebase-admin');
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const storage = admin.storage();
const {
  handleResizeImage
} = require('../storage/handleResizeImage');
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
const getFiles = async () => {
  const files = await storage
    .bucket()
    .getFiles();
  return files[0];
};
const handleResizeImages = async (data, context, source = 'handleResizeImages') => {
  let imagesResized = false;
  let errorMessage = '';
  try {
    errorMessage = await validateParameters(data, context);
    if (!errorMessage) {
      const files = await getFiles({
        prefix: 'images/'
      });
      console.log(`Processing ${files.length} files...`);
      await Promise.all(files.map(async file =>
        await handleResizeImage(file.metadata)
      ));
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

exports.handleResizeImages = handleResizeImages;
