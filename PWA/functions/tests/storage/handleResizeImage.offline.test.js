const chai = require('chai');
const {
  assert
} = chai;
const sinon = require('sinon');
const sinonChai = require("sinon-chai");
const admin = require('firebase-admin');
const test = require('firebase-functions-test')();
const {
  handleResizeImage
} = require('../../storage');
const IMAGE_WIDTH_TOO_SMALL = 'Image width of \'80\' is too small.';
const imageWidthTooSmallObjectMetadata = {
  bucket: 'tkot-online-dev.appspot.com',
  name: 'functions/tests/storage/images/users/xqHlH4QKJFeMibQKHOWPwUrxLOm1/JohnShortland-80x80.png',
  contentType: 'image/png'
};
const successfulObjectMetadata = {
  bucket: 'tkot-online-dev.appspot.com',
  name: 'functions/tests/storage/images/users/xqHlH4QKJFeMibQKHOWPwUrxLOm1/JohnShortland-450x450.png',
  contentType: 'image/png'
};
const {
  resolve
} = require('path');
const fs = require('fs');

chai.should();
chai.use(sinonChai);

describe('Cloud Function: handleResizeImage.offline', () => {
  let callCounter = 0;
  let currentObjectMetadata;
  let size = 0;
  let adminInitializeAppStub;
  let adminStorageStub;
  let wrappedHandleResizeImage;
  before(() => {
    adminInitializeAppStub = sinon.stub(admin, 'initializeApp');
  })
  beforeEach(() => {
    switch (++callCounter) {
      case 2:
        currentObjectMetadata = successfulObjectMetadata;
        size = 400;
        break;
      case 1:
      default:
        currentObjectMetadata = imageWidthTooSmallObjectMetadata;
        size = 80;
        break;
    }
    console.log(`callCounter: ${callCounter}, size: ${size}, currentObjectMetadata: ${JSON.stringify(currentObjectMetadata, null, 2)}`);
    adminStorageStub = sinon.stub(admin, 'storage').get(() =>
      () => ({
        bucket: bucketName => ({
          name: bucketName,
          file: fileName => ({
            name: fileName,
            download: options => {
              const {
                destination
              } = options;
              const fullFileNamePath = resolve(fileName);
              if (fs.existsSync(fullFileNamePath)) {
                fs.copyFileSync(fullFileNamePath, destination);
              }
            }
          }),
          upload: () => {}
        })
      })
    );
    wrappedHandleResizeImage = test.wrap(handleResizeImage);
  });
  after(() => {
    adminInitializeAppStub.restore();
    test.cleanup();
  });
  it(`should return "${IMAGE_WIDTH_TOO_SMALL}"`, async () => {
    try {
      const objectMetadata = test.storage.makeObjectMetadata(imageWidthTooSmallObjectMetadata);
      await wrappedHandleResizeImage(objectMetadata);
    } catch (error) {
      console.log(`should return "${IMAGE_WIDTH_TOO_SMALL}": ${error.message}`);
      assert.equal(error.message, IMAGE_WIDTH_TOO_SMALL)
    }
  });
  it('should return "Successful"', async () => {
    try {
      const objectMetadata = test.storage.makeObjectMetadata(successfulObjectMetadata);
      await wrappedHandleResizeImage(objectMetadata);
    } catch (error) {
      console.log(`should return "Successful": ${error.message}`);
    }
  });
});
