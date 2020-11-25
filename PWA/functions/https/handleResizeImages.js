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
  isBoolean,
  isUserValid,
  StorageBucketHelper
} = require('../utilities');
const validateParameters = async (data, context) => {
  let errorMessages = [];
  if (!data || !context) {
    errorMessages.push(`'data' and 'context' are required parameters.`);
  } else {
    const {
      overwriteExisting,
      deleteOnly
    } = data;
    if (!isBoolean(overwriteExisting)) {
      errorMessages.push(`'overwriteExisting' is a required parameter.`);
    }
    if (!isBoolean(deleteOnly)) {
      errorMessages.push(`'deleteOnly' is a required parameter.`);
    }
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
      const {
        overwriteExisting,
        deleteOnly
      } = data;
      const files = await getFiles({
        prefix: 'images/'
      });
      const originalFiles = files.filter(file => {
        const storageBucketHelper = new StorageBucketHelper(file.metadata);
        const fileIsValid = storageBucketHelper.isValid();
        return fileIsValid;
      });
      console.log(`Processing ${originalFiles.length} files...`);
      await Promise.all(originalFiles.map(async file => {
        const imageResized = await handleResizeImage(file.metadata, overwriteExisting, deleteOnly);
        console.log(`Processed '${file.metadata.name}' file.`);
        return imageResized;
      }));
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
