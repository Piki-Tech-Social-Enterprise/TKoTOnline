const assert = require('assert');
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
const googleApplicationCredentials = process.env.REACT_APP_GAC;
const test = require('firebase-functions-test')(firebaseConfig, googleApplicationCredentials);
// console.log(`INIT - process.env.FIREBASE_CONFIG: ${process.env.FIREBASE_CONFIG}, process.env.GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
const {
  handleResizeImage
} = require('../../storage');
const IMAGE_WIDTH_TOO_SMALL = 'Image width of \'80\' is too small.';

describe('Cloud Function: handleResizeImage.online', () => {
  let wrappedHandleResizeImage;
  before(() => {
    process.env.FIREBASE_CONFIG = JSON.stringify(firebaseConfig);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = googleApplicationCredentials;
    // console.log(`BEFORE - process.env.FIREBASE_CONFIG: ${process.env.FIREBASE_CONFIG}, process.env.GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
    wrappedHandleResizeImage = test.wrap(handleResizeImage);
  });
  after(() => {
    test.cleanup();
  });
  it(`should return "${IMAGE_WIDTH_TOO_SMALL}"`, async () => {
    const objectMetadata = test.storage.makeObjectMetadata({
      bucket: 'tkot-online-dev.appspot.com',
      name: 'images/users/xqHlH4QKJFeMibQKHOWPwUrxLOm1/JohnShortland-80x80.png',
      contentType: 'image/png'
    });
    try {
      await wrappedHandleResizeImage(objectMetadata);
    } catch (error) {
      assert.equal(error.message, IMAGE_WIDTH_TOO_SMALL)
    }
  });
  it('should return "Successful"', async () => {
    const objectMetadata = test.storage.makeObjectMetadata({
      bucket: 'tkot-online-dev.appspot.com',
      name: 'images/users/xqHlH4QKJFeMibQKHOWPwUrxLOm1/JohnShortland-450x450.png',
      contentType: 'image/png'
    });
    await wrappedHandleResizeImage(objectMetadata);
  });
});