const functions = require('firebase-functions');
const runtimeOptions = {
  memory: '2GB',
  timeoutSeconds: 120
};
const {
  handleResizeImage
} = require('./handleResizeImage');

exports.handleResizeImage = functions
  .runWith(runtimeOptions)
  .storage
  .object()
  .onFinalize(handleResizeImage);
