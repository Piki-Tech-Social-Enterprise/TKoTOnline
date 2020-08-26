const cors = require('cors')({
  origin: true,
});
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const {
  jsonObjectPropertiesToUppercase,
  httpResponseCodes,
  httpRequestMethods,
  isUserValid,
  FORBIDDEN_TEXT
} = require('../utilities');
const envcmd = jsonObjectPropertiesToUppercase(functions.config && functions.config().envcmd
  ? functions.config().envcmd
  : {});
const config = Object.assign(process.env, envcmd);
// console.log(`config: ${JSON.stringify(config, null, 2)}`);
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const firebaseDb = admin.database();
const allowedDbObjects = [
  {
    allowedDbObjectName: 'users',
    allowedDbObjectFieldNames: [
      'email'
    ]
  },
  {
    allowedDbObjectName: 'volunteers',
    allowedDbObjectFieldNames: [
      'email'
    ]
  }
];
const getAllowedDbObject = (dbObjectName, dbObjectFieldName) => {
  const allowedDbObjectIndex = allowedDbObjects.findIndex(ado =>
    ado.allowedDbObjectName === dbObjectName &&
    ado.allowedDbObjectFieldNames.includes(dbObjectFieldName));
  if (allowedDbObjectIndex > -1) {
    return allowedDbObjects[allowedDbObjectIndex];
  }
  return null;
};
const validateParameters = async (data, context) => {
  let errorMessages = [];
  if (!data || !context) {
    errorMessages.push(`'data' and 'context' are required parameters.`);
  } else {
    const {
      dbObjectName,
      dbObjectFieldName,
      ignoreAuth
    } = data;
    if (!dbObjectName) {
      errorMessages.push(`'dbObjectName' is a required parameter.`);
    } else if (!getAllowedDbObject(dbObjectName, dbObjectFieldName)) {
      errorMessages.push(`'${dbObjectName}.${dbObjectFieldName}' is not an Allowed Db Object & Field.`);
    } else {
      const {
        auth
      } = context;
      if (!auth) {
        if (!ignoreAuth) {
          errorMessages.push('This function must be called while authenticated.');
        }
      } else {
        const {
          uid
        } = auth;
        if (!(await isUserValid(uid))) {
          errorMessages.push(`'uid' is not a valid user.`);
        }
      }
    }
  }
  return errorMessages.join('\n');
};
const handleIsUnique = async (data, context, source = 'handleIsUnique') => {
  let isUnique = false;
  let errorMessage = '';
  try {
    // console.log(`${source}.parameters: ${JSON.stringify({
    //   data,
    //   // context
    // }, null, 2)}`);
    errorMessage = await validateParameters(data, context);
    if (!errorMessage) {
      const {
        dbObjectName,
        dbObjectFieldName,
        dbObjectFieldValue
      } = data;
      const dbObjectFieldValueAsLowerCase = (dbObjectFieldValue || '').toLowerCase();
      const dbObjectRef = firebaseDb.ref(`${dbObjectName}`);
      const snapshot = await dbObjectRef
        .orderByChild('active')
        .equalTo(true)
        .once('value');
      const dbObjects = await snapshot.val();
      // console.log(`dbObjects: ${JSON.stringify(dbObjects, null, 2)}`);
      if (Object.keys(dbObjects).findIndex(key =>
        (dbObjects[key][dbObjectFieldName] || '').toString().toLowerCase() === dbObjectFieldValueAsLowerCase
      ) === -1) {
        isUnique = true;
      }
    }
  } catch (error) {
    errorMessage = error.message;
  }
  if (errorMessage) {
    console.log(`${source}.errorMessage: ${errorMessage}`);
    throw new functions.https.HttpsError(`${source}-error`, errorMessage);
  }
  return isUnique;
};
const handleIsUniqueAlt = async (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== httpRequestMethods.POST) {
    console.log(`httpResponseCode: ${httpResponseCodes.Forbidden}, errorMessage: ${FORBIDDEN_TEXT}`);
    return res.status(httpResponseCodes.Forbidden).send(FORBIDDEN_TEXT);
  }
  console.log(`req: ${JSON.stringify(req, null, 2)}`);
  const {
    data,
    context
  } = req;
  let errorMessage = await validateParameters(data, context);
  if (errorMessage) {
    console.log(`httpResponseCode: ${httpResponseCodes.BadRequest}, errorMessage: ${errorMessage}`);
    return res.status(httpResponseCodes.BadRequest).send(errorMessage);
  }
  return cors(req, res, async () => {
    try {
      const {
        data,
        context
      } = req;
      const isUnique = await handleIsUnique(data, context, 'handleIsUniqueAlt');
      const {
        dbObjectName,
        dbObjectFieldName,
        dbObjectFieldValue
      } = data;
      return res.status(httpResponseCodes.OK).send({
        success: isUnique,
        message: `'${dbObjectName}.${dbObjectFieldName} '${dbObjectFieldValue}' is ${isUnique ? '' : 'not'} unqiue.`
      });
    } catch (error) {
      console.log(`handleSetProfile.userRecord Error: httpResponseCode: ${httpResponseCodes.BadRequest}, error.message: ${error.message}`);
      return res.status(httpResponseCodes.BadRequest).send(error.message);
    }
  });
};

exports.handleIsUnique = handleIsUnique;
exports.handleIsUniqueAlt = handleIsUniqueAlt;
