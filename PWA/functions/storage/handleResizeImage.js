/**
 @google-cloud/storage allows you to get images from Firebase Storage.
 fs-extra, which wraps the Node.js default fs module and exposes its functions with promises.
 sharp, an amazing and high performances image manipulation library for Node.js
 */
const admin = require('firebase-admin');
const {
  StorageBucketHelper,
  isNullOrEmpty
} = require('../utilities');
const sharp = require('sharp');
const fs = require('fs');
const handleResizeImage = async (objectMetadata, overwriteExisting = true, deleteOnly = false) => {
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
  if (admin.apps.length === 0) {
    admin.initializeApp();
  }
  const storage = admin.storage();
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
    const metaData = await imageFile.metadata();
    const currentSize = metaData.width;
    if (currentSize <= 100) {
      throw new Error(`Image '${filePath}' with a width of '${currentSize}' is too small.`);
    }
    const sizes = [150, 400, 768, NaN];
    // if (currentSize <= 150) {
    //   return false;
    // }
    // if (currentSize > 400) {
    //   sizes.push(400);
    // }
    // if (currentSize > 768) {
    //   sizes.push(768);
    // }
    console.log(`resizeImage: Generating ${sizes.length} resized images for ${fileName} - image width of '${currentSize}'...`);
    const uploadPromises = sizes.map(async size => {
      const {
        imgPath,
        bucketImgName
      } = getImgPathAndBucketImgName(size, 'webp');
      const uploadOptions = {
        destination: bucketImgName
      };
      // console.log(`resizeImage.calling: imgFile = bucket.file(imgPath);`);
      const imgFile = bucket.file(imgPath);
      if (!imgFile) {
        return null;
      }
      const imgExists = await imgFile
        .exists()
        .then(data =>
          Boolean(data[0])
        )
        .catch(error => {
          console.log(`resizeImage.exists.error: ${JSON.stringify(error, null, 2)}`);
          return false;
        });
      if (imgExists) {
        if (!overwriteExisting) {
          return null;
        }
        await imgFile.delete();
        if (deleteOnly) {
          return null;
        }
      }
      console.log(`resizeImage: Generateing... ${bucketImgName}`);
      await imageFile
        .resize({
          width: size
        })
        .webp({
          force: true,
          lossless: true
        })
        .toFile(imgPath);
      console.log(`resizeImage: Generated ${bucketImgName}`);
      return await bucket
        .upload(imgPath, uploadOptions);
    });
    await Promise
      .all(uploadPromises
        .filter(up =>
          !isNullOrEmpty(up)
        )
      );
  }
  console.log('resizeImage: Completed.');
  return await cleanUp();
};

exports.handleResizeImage = handleResizeImage;
