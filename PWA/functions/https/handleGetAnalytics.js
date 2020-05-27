const moment = require('moment');
const cors = require('cors')({
  origin: true,
});
// const {
//   resolve
// } = require('path');
// const fs = require('fs');
// const {
//   inspect
// } = require('util');
const {
  httpResponseCodes,
  httpRequestMethods,
  isUserValid,
  FORBIDDEN_TEXT,
  ISO8601_DATE_FORMAT
} = require('../utilities');
const validateQuery = async query => {
  const {
    uid,
    viewId,
    startDate,
    endDate,
    alias,
    expression
  } = query;
  let errorMessages = [];
  if (!uid) {
    errorMessages.push(`'uid' is a required parameter.`);
  } else if (!(await isUserValid(uid))) {
    errorMessages.push(`'uid' is not a valid user.`);
  }
  if (!viewId) {
    errorMessages.push(`'viewId' is a required parameter.`);
  }
  if (!startDate) {
    errorMessages.push(`'startDate' is a required parameter.`);
  } else if (!moment(startDate, ISO8601_DATE_FORMAT, true).isValid()) {
    errorMessages.push(`'startDate' must be a valid date in the following format: (${ISO8601_DATE_FORMAT}).`);
  }
  if (!endDate) {
    errorMessages.push(`'endDate' is a required parameter.`);
  } else if (!moment(endDate, ISO8601_DATE_FORMAT, true).isValid()) {
    errorMessages.push(`'endDate' must be a valid date in the following format: (${ISO8601_DATE_FORMAT}).`);
  }
  if (!alias) {
    errorMessages.push(`'alias' is a required parameter.`);
  }
  if (!expression) {
    errorMessages.push(`'expression' is a required parameter.`);
  }
  return errorMessages.join('\n');
};
const handleGetAnalytics = async (req, res) => {
  // console.log(`req: ${inspect(req, {depth: 1})}`);
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== httpRequestMethods.GET) {
    console.log(`httpResponseCode: ${httpResponseCodes.Forbidden}, errorMessage: ${FORBIDDEN_TEXT}`);
    return res.status(httpResponseCodes.Forbidden).send(FORBIDDEN_TEXT);
  }
 // console.log(`req.query: ${JSON.stringify(req.query, null, 2)}`);
  let errorMessage = await validateQuery(req.query);
  if (errorMessage) {
    //console.log(`httpResponseCode: ${httpResponseCodes.BadRequest}, errorMessage: ${errorMessage}`);
    return res.status(httpResponseCodes.BadRequest).send(errorMessage);
  }
  const {
    viewId,
    startDate,
    endDate,
    alias,
    expression
  } = req.query;
  // const resolvedGoogleApplicationCredentials = resolve(googleApplicationCredentials);
  // const googleApplicationCredentialsFile = JSON.parse(fs.readFileSync(resolvedGoogleApplicationCredentials, 'utf8'));
  return cors(req, res, async () => {
    try {
      const functions = require('firebase-functions');
      const {
        jsonObjectPropertiesToUppercase
      } = require('../utilities');
      const envcmd = jsonObjectPropertiesToUppercase(functions.config && functions.config().envcmd
        ? functions.config().envcmd
        : {});
      const config = Object.assign(process.env, envcmd);
      //console.log(`config: ${JSON.stringify(JSON.stringify(config, null, 2))}`);
      const {
        google
      } = require('googleapis');
      const auth = new google.auth.GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/analytics.readonly'
        // projectId: googleApplicationCredentialsFile.project_id,
        // credentials: googleApplicationCredentialsFile
      });
      // console.log(`auth: ${JSON.stringify(auth, null, 2)}`);
      const authClient = await auth.getClient();
      // console.log(`authClient: ${JSON.stringify(authClient, null, 2)}`);
      // const projectId = await auth.getProjectId();
      // console.log(`projectId: ${projectId}`);
      const analyticsreporting = google.analyticsreporting({
        version: 'v4',
        auth: authClient //.key
      });
      // console.log(`analyticsreporting: ${JSON.stringify(analyticsreporting, null, 2)}`);

      // authClient.authorize((err, response) => {
      //   console.log(`err: ${JSON.stringify(err, null, 2)}, response: ${JSON.stringify(response, null, 2)}`);
      // });

      // try {
      //   console.log(`typeof authClient.authorize: ${typeof authClient.authorize}`);
      //   const authAuthorize = await authClient.authorize();
      //   console.log(`authAuthorize: ${JSON.stringify(authAuthorize, null, 2)}`);
      // } catch (error) {
      //   console.log(`authAuthorize.error: ${JSON.stringify(error, null, 2)}`);
      // } finally {
      //   console.log(`authClient.authorize.finalised`);
      // }

      const batchGetParameters = {
        requestBody: {
          reportRequests: [
            {
              viewId: viewId,
              dateRanges: [
                {
                  startDate: startDate,
                  endDate: endDate,
                }
              ],
              metrics: [
                {
                  alias: alias,
                  expression: expression,
                },
                {
                  alias: 'Sessions',
                  expression: 'ga:sessions'
                },
                {
                  alias: 'Bounce Rate',
                  expression: 'ga:bounceRate',
                  formattingType: 'PERCENT'
                },
                {
                  alias: 'Session Duration',
                  expression: 'ga:sessionDuration',
                  formattingType: 'TIME'
                }
              ],
              hideTotals: true,
              dimensions: [
                {
                  name: "ga:sessionDurationBucket",
                  histogramBuckets: [
                    "3",
                    "60",
                    "180",
                    "360",
                    "600"
                  ]
                }
              ],
              orderBys: [
                {
                  fieldName: "ga:sessionDurationBucket",
                  orderType: "HISTOGRAM_BUCKET"
                }
              ]
            },
          ],
        }
      };
      // console.log(`typeof analyticsreporting.reports.batchGet: ${typeof analyticsreporting.reports.batchGet}`);
      const batchGetResponse = await analyticsreporting.reports.batchGet(batchGetParameters);
      //console.log(`handleGetAnalytics.batchGetResponse: ${JSON.stringify(batchGetResponse, null, 2)}`);
      return res.status(httpResponseCodes.OK).send(batchGetResponse.data);
    } catch (error) {
      //console.log(`handleGetAnalytics.batchGetResponse Error: httpResponseCode: ${httpResponseCodes.BadRequest}, error.message: ${error.message}`);
      return res.status(httpResponseCodes.BadRequest).send(error.message);
    }
  });
};

exports.handleGetAnalytics = handleGetAnalytics;