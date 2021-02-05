const functions = require('firebase-functions');
const admin = require('firebase-admin');
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const storage = admin.storage();
const bucket = storage.bucket();
const getFilesByUrls = fileUrls => {
  const files = {};
  Object.keys(fileUrls).map(key => {
    const fileUrl = fileUrls[key];
    files[key] = bucket.file(fileUrl.startsWith('/')
      ? fileUrl.substring(1)
      : fileUrl);
    return null;
  });
  return files;
};
const getFiles = async getFilesOptions => {
  const files = await bucket.getFiles(getFilesOptions);
  return files[0];
};
const {
  StorageBucketHelper
} = require('../utilities');
const handleWriteSetting = async (change, context, source = 'handleWriteSetting') => {
  let settingWritten = false;
  let errorMessage = '';
  try {
    // console.log(`handleWriteSetting.parameters: ${JSON.stringify({
    //   change,
    //   // context
    // }, null, 2)}`);
    const {
      after
    } = change;
    if (!after.exists()) {
      return null;
    }
    const dbSetting = await after.val();
    const {
      homePageHeaderImageUrl,
      homePageAboutImageUrl,
      // homePageVideoSourceUrl,
      aboutPageTKoTBackOfficeStructureImageUrl
    } = dbSetting;
    const imagesUrls = {
      homePageHeaderImageUrl,
      homePageAboutImageUrl,
      // homePageVideoSourceUrl,
      aboutPageTKoTBackOfficeStructureImageUrl
    };
    const imageFiles = getFilesByUrls(imagesUrls);
    const staticFiles = await getFiles({
      prefix: 'images/static/'
    });
    const originalStaticFiles = staticFiles.filter(staticFile => {
      const {
        metadata
      } = staticFile;
      const storageBucketHelper = new StorageBucketHelper(metadata);
      const fileIsValid = storageBucketHelper.isValid();
      return fileIsValid;
    });
    await Promise.all(Object.keys(imageFiles).map(async key => {
      const imageFile = imageFiles[key];
      const fileName = key.replace('Url', '');
      const originalStaticFile = originalStaticFiles
        .find(osf =>
          osf.metadata.name.includes(fileName));
      if (originalStaticFile) {
        await imageFile.copy(originalStaticFile);
      } else {
        const metadata = await imageFile.getMetadata();
        const storageBucketHelper = new StorageBucketHelper(metadata[0]);
        const {
          isValid,
          fileNameExt
        } = storageBucketHelper;
        if (isValid()) {
          const staticFileName = `gs://${imageFile.bucket.name}/images/static/${fileName}.${fileNameExt}`;
          await imageFile.copy(staticFileName);
        }
      }
      return null;
    }));
    settingWritten = true;
  } catch (error) {
    errorMessage = error.message;
  }
  if (errorMessage) {
    console.log(`${source}.errorMessage: ${errorMessage}`);
    throw new functions.https.HttpsError(`${source}-error`, errorMessage);
  }
  console.log(`Images resized successfully.`);
  return settingWritten;
};

exports.handleWriteSetting = handleWriteSetting;
