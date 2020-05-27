const admin = require('firebase-admin');
const cors = require('cors')({
  origin: true,
});
const {
  httpResponseCodes,
  httpRequestMethods,
  isUserValid,
  FORBIDDEN_TEXT,
  objectToArray,
  arrayToObject
} = require('../utilities');
const allowedDbObjects = [
  {
    dbObjectName: 'businessProfiles',
    dbObjectIdField: 'bpid',
    dbObjectImageField: 'logo'
  },
  {
    dbObjectName: 'users',
    dbObjectIdField: 'uid',
    dbObjectImageField: 'photoURL'
  }
];
const getAllowedDbObject = dbObject => {
  const allowedDbObjectIndex = allowedDbObjects.findIndex(ado => ado.dbObjectName === dbObject);
  if (allowedDbObjectIndex > -1) {
    return allowedDbObjects[allowedDbObjectIndex];
  }
  return null;
};
const validateQuery = async query => {
  const {
    uid,
    dbObject
  } = query;
  let errorMessages = [];
  if (!uid) {
    errorMessages.push(`'uid' is a required parameter.`);
  } else if (!(await isUserValid(uid))) {
    errorMessages.push(`'uid' is not a valid user.`);
  }
  if (!dbObject) {
    errorMessages.push(`'dbObject' is a required parameter.`);
  } else if (!getAllowedDbObject(dbObject)) {
    errorMessages.push(`'${dbObject}' is not a valid dbObject.`);
  }
  return errorMessages.join('\n');
};
const handleGetDataFromFirebase = async (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== httpRequestMethods.GET) {
    return res.status(httpResponseCodes.Forbidden).send(FORBIDDEN_TEXT);
  }
  console.log(`req.query: ${JSON.stringify(req.query, null, 2)}`);
  let errorMessage = await validateQuery(req.query);
  if (errorMessage) {
    //console.log(`httpResponseCode: ${httpResponseCodes.BadRequest}, errorMessage: ${errorMessage}`);
    return res.status(httpResponseCodes.BadRequest).send(errorMessage);
  }
  const {
    dbObject,
    dbField,
    dbValue,
    includeInactive
  } = req.query;
  const dbValueAsLowerCase = dbValue
    ? dbValue.toLowerCase()
    : '';
  const allowedDbObject = getAllowedDbObject(dbObject);
  const {
    dbObjectIdField,
    dbObjectImageField
  } = allowedDbObject;
  return cors(req, res, async () => {
    let resStatus = httpResponseCodes.OK;
    let resData = {};
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
      if (admin.apps.length === 0) {
        admin.initializeApp();
      }
      const firebaseDb = admin.database();
      const dbObjectRef = firebaseDb.ref(`${dbObject}`);
      const snapshot = !includeInactive
        ? await dbObjectRef
          .orderByChild('active')
          .equalTo(true)
          .once('value')
        : await dbObjectRef
          .orderByChild(dbFieldValue)
          .once('value');
      const dbObjects = await snapshot.val();
      const resultsAsArray = objectToArray(dbObjects, key => {
        const dbObject = dbObjects[key];
        const dbFieldValue = dbObject[dbField];
        const result = {};
        if (dbFieldValue && dbFieldValue.toLowerCase().includes(dbValueAsLowerCase)) {
          result[dbObjectIdField] = key;
          result[dbField] = dbFieldValue;
          result[dbObjectImageField] = dbObject[dbObjectImageField];
          result.active = dbObject.active;
        }
        return result;
      });
      const results = arrayToObject(resultsAsArray, dbObjectIdField);
      const data = {
        results: results
      };
      //console.log(`handleGetDataFromFirebase.data: ${JSON.stringify(data, null, 2)}`);
      resData = data;
    } catch (error) {
      //console.log(`handleGetDataFromFirebase Error: httpResponseCode: ${httpResponseCodes.BadRequest}, error.message: ${error.message}`);
      resStatus = httpResponseCodes.BadRequest;
      resData = error.message;
    }
    return res.status(resStatus).send(resData);
  });
};

exports.handleGetDataFromFirebase = handleGetDataFromFirebase;