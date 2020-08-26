/**
 @google-cloud/storage allows you to get images from Firebase Storage.
 fs-extra, which wraps the Node.js default fs module and exposes its functions with promises.
 sharp, an amazing and high performances image manipulation library for Node.js
 */
const admin = require('firebase-admin');
const {
  StorageBucketHelper
} = require('../utilities');
const sharp = require('sharp');
const fs = require('fs');
const handleResizeImage = async objectMetadata => {
  const storageBucketHelper = new StorageBucketHelper(objectMetadata);
  const {
    filePath,
    fileName,
    isValid,
    tmpFilePath,
    getImgPathAndBucketImgName,
    cleanUp
  } = storageBucketHelper;
  const downloadOptions = {
    destination: tmpFilePath
  };
  // const functions = require('firebase-functions');
  // const {
  //   jsonObjectPropertiesToUppercase
  // } = require('../utilities');
  // const envcmd = jsonObjectPropertiesToUppercase(functions.config && functions.config().envcmd
  //   ? functions.config().envcmd
  //   : {});
  // const config = Object.assign(process.env, envcmd);
  // console.log(`config: ${JSON.stringify(config, null, 2)}`);
  if (admin.apps.length === 0) {
    admin.initializeApp();
  }
  const storage = admin.storage();
  // console.log(`require.resolve('@google-cloud/storage'): ${require.resolve('@google-cloud/storage')}`);
  // const storage = new require('@google-cloud/storage').Storage();
  const bucket = storage
    .bucket(objectMetadata.bucket);
  if (!isValid()) {
    return false;
  }
  await bucket
    .file(filePath)
    .download(downloadOptions);
  if (fs.existsSync(tmpFilePath)) {
    const imageFile = sharp(tmpFilePath);
    const metaData = await imageFile
      .metadata();
    const currentSize = metaData.width;
    const sizes = [150];
    if (currentSize <= 100) {
      throw new Error(`Image width of '${currentSize}' is too small.`);
    }
    if (currentSize <= 150) {
      return false;
    }
    if (currentSize > 400) {
      sizes.push(400);
    }
    console.log(`resizeImage: Generating ${sizes.length} resized images for ${fileName}...`);
    const uploadPromises = sizes.map(async size => {
      const {
        imgPath,
        bucketImgName
      } = getImgPathAndBucketImgName(size);
      const uploadOptions = {
        destination: bucketImgName
      };
      await imageFile
        .resize({
          width: size
        })
        .toFile(imgPath);
      console.log(`resizeImage: Generated ${bucketImgName}`);
      return await bucket
        .upload(imgPath, uploadOptions);
    });
    await Promise
      .all(uploadPromises);
  }
  console.log('resizeImage: Completed.');
  return await cleanUp();
};

exports.handleResizeImage = handleResizeImage;
