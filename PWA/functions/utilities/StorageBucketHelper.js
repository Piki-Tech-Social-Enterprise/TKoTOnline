const {
  tmpdir
} = require('os');
const {
  dirname,
  join
} = require('path');
const fs = require('fs-extra');
const resizedFileNamePrefix = '@s_';

class StorageBucketHelper {
  constructor(objectMetadata) {
    this.objectMetadata = objectMetadata;
    this.filePath = this.objectMetadata.name;
    this.fileName = this.filePath
      .split('/')
      .pop();
    this.folderName = this.fileName
      .split('.')
      .slice(0, -1)
      .join('.');
    this.bucketDir = dirname(this.filePath);
    this.workingDir = join(tmpdir(), this.folderName);
    this.fileNameExt = this.fileName
      .split('.')
      .pop();
    this.tmpFilePath = join(this.workingDir, `source.${this.fileNameExt}`);
    this.imgName = this.fileName
      .replace(`.${this.fileNameExt}`, '');
    this.isValid = this.handleIsValid
      .bind(this);
    this.getImgPathAndBucketImgName = this.handleGetImgPathAndBucketImgName
      .bind(this);
    this.cleanUp = this.handleCleanUp
      .bind(this);
    return this;
  }
  handleIsValid(validContentType = 'image', excludedContentType = 'image/webp') {
    const includesResizedFileNamePrefix = this.fileName.includes(resizedFileNamePrefix);
    const {
      contentType
    } = this.objectMetadata;
    const startsWithValidContentType = contentType.startsWith(validContentType);
    const isExcludedContentType = contentType.toLowerCase() === excludedContentType;
    const isValid = !includesResizedFileNamePrefix && startsWithValidContentType && !isExcludedContentType;
    if (isValid && !fs.existsSync(this.workingDir)) {
      fs.mkdirSync(this.workingDir);
    }
    return isValid;
  }
  handleGetImgPathAndBucketImgName(size = NaN, fileNameExtOverride = '') {
    const newImgName = `${this.imgName}${!isNaN(size) ? `${resizedFileNamePrefix}${size}` : ''}.${fileNameExtOverride || this.fileNameExt}`;
    return {
      imgPath: join(this.workingDir, newImgName),
      bucketImgName: `${this.bucketDir}/${newImgName}`
    };
  }
  async handleCleanUp() {
    await fs.remove(this.workingDir);
    return true;
  }
}

exports.StorageBucketHelper = StorageBucketHelper;