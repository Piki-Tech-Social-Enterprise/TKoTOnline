/**
 @google-cloud/storage allows you to get images from Firebase Storage.
 fs-extra, which wraps the Node.js default fs module and exposes its functions with promises.
 sharp, an amazing and high performances image manipulation library for Node.js
 */
const admin = require('firebase-admin');
const {
  StorageBucketHelper,
  isNullOrEmpty,
  isBoolean
} = require('../utilities');
const sharp = require('sharp');
const fs = require('fs');
const handleResizeImage = async (objectMetadata, overwriteExisting = true, deleteOnly = false) => {
  const storageBucketHelper = new StorageBucketHelper(objectMetadata);
  const {
    isValid,
    filePath,
    fileName,
    tmpFilePath,
    getImgPathAndBucketImgName,
    cleanUp
  } = storageBucketHelper;
  if (!isValid()) {
    console.log(`Image '${filePath}' is invalid.`);
    return null;
  }
  const downloadOptions = {
    destination: tmpFilePath
  };
  if (admin.apps.length === 0) {
    admin.initializeApp();
  }
  const db = admin.database();
  const dbCorrelationsRef = db.ref('/correlations/');
  const getCorrelationId = async filePath => {
    const filePathAsLowercase = (filePath || '').toLowerCase();
    const dbCorrelationsSnapshot = await dbCorrelationsRef
      .orderByChild('filePath')
      .equalTo(filePathAsLowercase)
      .once('value');
    const dbCorrelations = await dbCorrelationsSnapshot.val();
    const dbCorrelationKeys = Object.keys(dbCorrelations || {});
    const correlationId = dbCorrelationKeys.length
      ? dbCorrelationKeys[0]
      : undefined;
    return correlationId;
  };
  const generateCorrelationId = async filePath => {
    const filePathAsLowercase = (filePath || '').toLowerCase();
    const newDbCorrelationRef = await dbCorrelationsRef.push();
    const correlationId = await newDbCorrelationRef.getKey();
    const now = new Date();
    await newDbCorrelationRef.set({
      correlationId,
      created: now.toString(),
      filePath: filePathAsLowercase
    });
    return correlationId;
  };
  const deleteCorrelationId = async correlationId => {
    const dbCorrelationRef = db.ref(`/correlations/${correlationId}`);
    if (dbCorrelationRef) {
      await dbCorrelationRef.remove();
    }
  };
  const storage = admin.storage();
  const bucket = storage
    .bucket(objectMetadata.bucket);
  await bucket
    .file(filePath)
    .download(downloadOptions);
  if (fs.existsSync(tmpFilePath)) {
    let correlationId = await getCorrelationId(tmpFilePath);
    if (correlationId) {
      console.log(`Image '${filePath}' has already been processed. correlationId: '${correlationId}'`);
      return null;
    }
    correlationId = await generateCorrelationId(tmpFilePath);
    console.log(`resizeImage: correlationId '${correlationId}' generated...`);
    const imageFile = sharp(tmpFilePath);
    const metaData = await imageFile.metadata();
    const currentSize = metaData.width;
    const sizes = [150, 400, 768, NaN];
    console.log(`resizeImage: Generating ${sizes.length} resized images for ${fileName} - image width of '${currentSize}'...`);
    console.log(`resizeImage.overwriteExisting: ${overwriteExisting}`);
    console.log(`resizeImage.deleteOnly: ${deleteOnly}`);
    const uploadPromises = sizes.map(async size => {
      const {
        imgPath,
        bucketImgName
      } = getImgPathAndBucketImgName(size, 'webp');
      const uploadOptions = {
        destination: bucketImgName
      };
      const imgFile = bucket.file(imgPath);
      if (!imgFile) {
        return null;
      }
      const imgExists = await imgFile
        .exists()
        .then(data =>
          isBoolean(data[0], true)
        )
        .catch(error => {
          console.log(`resizeImage.exists.error: ${JSON.stringify(error, null, 2)}`);
          return null;
        });
      console.log(`resizeImage.imgExists: ${imgExists}`);
      if (imgExists) {
        console.log(`resizeImage.overwriteExisting: ${overwriteExisting}`);
        if (!overwriteExisting) {
          return null;
        }
        await imgFile.delete();
        console.log(`resizeImage.deleteOnly: ${deleteOnly}`);
        if (deleteOnly) {
          return null;
        }
      }
      console.log(`resizeImage: Generating... ${bucketImgName}`);
      await imageFile
        .resize({
          width: size || currentSize
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
    await deleteCorrelationId(correlationId);
    console.log(`resizeImage: correlationId '${correlationId}' deleted`);
  }
  await cleanUp();
  console.log('resizeImage: Completed.');
  return null;
};

exports.handleResizeImage = handleResizeImage;
