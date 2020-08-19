const cors = require('cors')({
  origin: true,
});
const {
  httpResponseCodes,
  httpRequestMethods,
  FORBIDDEN_TEXT,
  getFirebaseStorageURL
} = require('../utilities');
const sharp = require('sharp');
const https = require('https');
const validateQuery = async query => {
  const {
    s: source
  } = query;
  let errorMessages = [];
  if (!source) {
    errorMessages.push(`'s' is a required parameter.`);
  }
  return errorMessages.join('\n');
};
const isUrlAllowed = (url, allowedPrefix = '/cdn/image/') => url && url.startsWith(allowedPrefix);
const handleImageTransform = async (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== httpRequestMethods.GET) {
    console.log(`httpResponseCode: ${httpResponseCodes.Forbidden}, errorMessage: ${FORBIDDEN_TEXT}`);
    return res.status(httpResponseCodes.Forbidden).send(FORBIDDEN_TEXT);
  }
  if (!isUrlAllowed(req.url)) {
    const errorMessage = `'${req.url}' is not allowed`;
    console.log(`httpResponseCode: ${httpResponseCodes.Forbidden}, errorMessage: ${errorMessage}`);
    return res.status(httpResponseCodes.Forbidden).send(errorMessage);
  }
  console.log(`req.query: ${JSON.stringify(req.query, null, 2)}`);
  let errorMessage = await validateQuery(req.query);
  if (errorMessage) {
    console.log(`httpResponseCode: ${httpResponseCodes.BadRequest}, errorMessage: ${errorMessage}`);
    return res.status(httpResponseCodes.BadRequest).send(errorMessage);
  }
  return cors(req, res, async () => {
    try {
      // imageTransform/?s=images/iwiMembers/-MBcnZKWJsTMG0Eu4OnE/Kahukuraariki-250x250.png&w=250h=250&l=1
      const {
        s: source,
        w: width,
        h: height,
        l: lossless
      } = req.query;
      const acceptHeader = req.header('Accept');
      const webpAccepted = Boolean(acceptHeader) && acceptHeader.indexOf('image/webp') !== -1;
      const transform = sharp()
        .resize(
          width ? Number(width) : undefined,
          height ? Number(height) : undefined,
          {
            fit: 'cover'
          }
        )
        .webp({
          force: webpAccepted,
          lossless: lossless === 1
        });
      const cacheMaxAge = 5 * 60;
      const responsePipe = res
        .set('Cache-Control', `public, max-age=${cacheMaxAge}`)
        .set('Vary', 'Accept');
      const sourceUrl = getFirebaseStorageURL(process.env.GCLOUD_PROJECT, source);
      console.log('sourceUrl: ', sourceUrl);
      return https.get(sourceUrl, res => res.pipe(transform).pipe(responsePipe));
    } catch (error) {
      console.log(`handleImageTransform Error: httpResponseCode: ${httpResponseCodes.BadRequest}, error.message: ${error.message}`);
      return res.status(httpResponseCodes.BadRequest).send(error.message);
    }
  });
};

exports.handleImageTransform = handleImageTransform;
