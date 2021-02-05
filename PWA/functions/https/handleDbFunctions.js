const admin = require('firebase-admin');
const cors = require('cors')({
  origin: true,
});
const {
  httpResponseCodes,
  httpRequestMethods,
  FORBIDDEN_TEXT,
  isBoolean,
  refactorObject,
  isNullOrEmpty
} = require('../utilities');
const dbFunctionNames = {
  getDbItemsAsArray: 'getDbItemsAsArray',
  getDbItemValue: 'getDbItemValue',
  getMultipleDbItemsAsArrays: 'getMultipleDbItemsAsArrays',
  saveDbItem: 'saveDbItem'
};
const dbTables = {
  contacts: {
    name: 'contacts',
    primaryKeyName: 'cid',
    objectSingularName: 'Contact'
  },
  covidList: {
    name: 'covidList',
    primaryKeyName: 'cvid',
    objectSingularName: 'Covid'
  },
  economicDevelopments: {
    name: 'economicDevelopments',
    primaryKeyName: 'edid',
    objectSingularName: 'Economic Development'
  },
  events: {
    name: 'events',
    primaryKeyName: 'eid',
    objectSingularName: 'Event'
  },
  facebookLinks: {
    name: 'facebookLinks',
    primaryKeyName: 'fid',
    objectSingularName: 'Facebook Link'
  },
  iwiMembers: {
    name: 'iwiMembers',
    primaryKeyName: 'imid',
    objectSingularName: 'Iwi Member'
  },
  newsFeeds: {
    name: 'newsFeeds',
    primaryKeyName: 'nfid',
    objectSingularName: 'News Feed'
  },
  projects: {
    name: 'projects',
    primaryKeyName: 'pid',
    objectSingularName: 'Project'
  },
  resources: {
    name: 'resources',
    primaryKeyName: 'rid',
    objectSingularName: 'Resource'
  },
  settings: {
    name: 'settings',
    primaryKeyName: 'sid',
    objectSingularName: 'Setting'
  }
};
const validateQuery = query => {
  const {
    dbFunctionName,
    dbTableName
  } = query;
  let errorMessages = [];
  if (!dbFunctionName) {
    errorMessages.push(`'dbFunctionName' is a required parameter.`);
  } else if (!Object.keys(dbFunctionNames).includes(dbFunctionName)) {
    errorMessages.push(`'${dbFunctionName}' is not a valid DB Function Name.`);
  }
  if (!dbTableName) {
    errorMessages.push(`'dbTableName' is a required parameter.`);
  } else if (!Object.keys(dbTables).includes(dbTableName)) {
    errorMessages.push(`'${dbTableName}' is not a valid DB Table Name.`);
  }
  return errorMessages.join('\n');
};
const handleDbFunctions = async (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== httpRequestMethods.GET && req.method !== httpRequestMethods.POST && req.method !== httpRequestMethods.OPTIONS) {
    return res.status(httpResponseCodes.Forbidden).send(FORBIDDEN_TEXT);
  }
  return cors(req, res, async () => {
    console.log(`req.query: ${JSON.stringify(req.query, null, 2)}`);
    let errorMessage = validateQuery(req.query);
    if (errorMessage) {
      console.log(`httpResponseCode: ${httpResponseCodes.BadRequest}, errorMessage: ${errorMessage}`);
      return res.status(httpResponseCodes.BadRequest).send(errorMessage);
    }
    const {
      dbFunctionName,
      dbTableName,
      includeInactive: includeInactiveAsString,
      childName,
      childValue: childValueAsString,
      topLimit: topLimitAsString,
      dbItemId,
      fieldNames: fieldNamesAsStringOrArray
    } = req.query;
    const includeInactive = isBoolean(includeInactiveAsString, true);
    const childValue = isBoolean(childValueAsString)
      ? childValueAsString.toLowerCase() === 'true'
      : childValueAsString;
    const topLimit = Number(topLimitAsString);
    const fieldNames = Array.isArray(fieldNamesAsStringOrArray)
      ? fieldNamesAsStringOrArray
      : (fieldNamesAsStringOrArray || '')
        .split(',')
        .filter(fieldName =>
          !isNullOrEmpty(fieldName)
        );
    const bodyData = req.body;
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
      // console.log(`config: ${JSON.stringify(config, null, 2)}`);
      if (admin.apps.length === 0) {
        admin.initializeApp();
      }
      const database = admin.database();
      const getDbItems = dbTableName => {
        return database.ref(dbTableName);
      };
      const getDbItemWithFieldNames = async (dbItem, fieldNames) => {
        if (fieldNames.length === 0) {
          return dbItem;
        }
        const newDbItem = {};
        await Promise.all(fieldNames.map(async fieldName => (
          newDbItem[fieldName] = dbItem[fieldName]
        )));
        return newDbItem;
      };
      const getDbItemsAsArray = async (dbTableName, includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
        const existingDbItems = getDbItems(dbTableName);
        const dbItemsQuery = existingDbItems
          .orderByChild(childName)
          .equalTo(childValue)
          .limitToFirst(Math.max(topLimit || 100, 100));
        const dbItemsRef = await dbItemsQuery.once('value');
        const dbItems = await dbItemsRef.val();
        const dbItemsAsArray = [];
        if (dbItems) {
          await Promise.all(Object.keys(dbItems).map(async key => {
            const dbItem = dbItems[key];
            if (includeInactive || dbItem.active) {
              dbItemsAsArray.push(await getDbItemWithFieldNames(dbItem, fieldNames));
            }
            return null;
          }));
        }
        return dbItemsAsArray;
      };
      const getDbItem = (dbTableName, dbItemId) => {
        return database.ref(`${dbTableName}/${dbItemId}`);
      };
      const getDbItemValue = async (dbTableName, dbItemId, fieldNames = []) => {
        const existingDbItem = getDbItem(dbTableName, dbItemId);
        const dbItemRef = await existingDbItem.once('value');
        const dbItem = await dbItemRef.val();
        return getDbItemWithFieldNames(dbItem, fieldNames);
      };
      const getMultipleDbItemsAsArrays = async queryItems => {
        const queryItemResponses = {};
        await Promise.all(Object.keys(queryItems).map(async key => {
          const queryItem = queryItems[key];
          const {
            dbTableName,
            includeInactive: includeInactiveAsString,
            childName,
            childValue: childValueAsString,
            topLimit: topLimitAsString,
            fieldNames: fieldNamesAsStringOrArray
          } = queryItem;
          const includeInactive = isBoolean(includeInactiveAsString, true);
          const childValue = isBoolean(childValueAsString)
            ? childValueAsString.toLowerCase() === 'true'
            : childValueAsString;
          const topLimit = Number(topLimitAsString);
          const fieldNames = Array.isArray(fieldNamesAsStringOrArray)
            ? fieldNamesAsStringOrArray
            : (fieldNamesAsStringOrArray || '')
              .split(',')
              .filter(fieldName =>
                !isNullOrEmpty(fieldName)
              );
          const dbItemsAsArray = await getDbItemsAsArray(dbTableName, includeInactive, childName, childValue, topLimit, fieldNames);
          queryItemResponses[key] = dbItemsAsArray;
          return null;
        }));
        return queryItemResponses;
      };
      const saveDbItem = async item => {
        const {
          active,
          created,
          createdBy,
          [dbTables[dbTableName].primaryKeyName]: primaryKey,
          updated,
          updatedBy,
          version,
          isNew,
          ...rest
        } = item;
        const refactoredRest = await refactorObject(rest);
        const nowAsString = (new Date()).toString();
        const preparedItem = {
          active: active || (isBoolean(active) ? false : undefined),
          [dbTables[dbTableName].primaryKeyName]: primaryKey,
          updated: updated || nowAsString,
          updatedBy: updatedBy || '',
          version: parseInt(version) || 1
        };
        let errorMessage = null;
        let existingDbItem = getDbItem(dbTableName, primaryKey);
        let dbItemSnapshot = null;
        let dbItem = null;
        if (isNew) {
          preparedItem.created = created || nowAsString;
          preparedItem.createdBy = createdBy || '';
          if (primaryKey) {
            preparedItem[dbTables[dbTableName].primaryKeyName] = primaryKey;
            existingDbItem.set({
              ...preparedItem,
              ...refactoredRest
            });
          } else {
            dbItemSnapshot = await existingDbItem.push();
            preparedItem[dbTables[dbTableName].primaryKeyName] = await dbItemSnapshot.getKey();
            dbItemSnapshot.set({
              ...preparedItem,
              ...refactoredRest
            });
          }
        } else {
          dbItemSnapshot = await existingDbItem.once('value');
          dbItem = await dbItemSnapshot.val() || {};
          if (dbItem) {
            const {
              active: dbItemActive,
              created: dbItemCreated,
              createdBy: dbItemCreatedBy,
              [dbTables[dbTableName].primaryKeyName]: dbItemPrimaryKey,
              updated: dbItemUpdated,
              updatedBy: dbItemUpdatedBy,
              version: dbItemVersion,
              ...dbItemRest
            } = dbItem;
            if (dbItemVersion === version) { // debugger;
              const refactoredDbItemRest = await refactorObject(dbItemRest);
              preparedItem.version = (parseInt(version) || 0) + 1;
              existingDbItem.set({
                [dbTables[dbTableName].primaryKeyName]: preparedItem[dbTables[dbTableName].primaryKeyName] || dbItemPrimaryKey || undefined,
                active: preparedItem.active,
                created: dbItemCreated,
                createdBy: dbItemCreatedBy,
                updated: nowAsString,
                updatedBy: preparedItem.updatedBy,
                ...refactoredDbItemRest,
                ...preparedItem,
                ...refactoredRest
              });
            } else {
              errorMessage = `Your record has changed since being retrieved. Please refresh your screen.`;
            }
          } else {
            errorMessage = `primaryKey (${primaryKey}) not found.`;
          }
        }
        if (errorMessage) {
          console.log(`Save Db ${dbTables[dbTableName].objectSingularName} Error: ${errorMessage}`);
          throw new Error(errorMessage);
        }
        return preparedItem[dbTables[dbTableName].primaryKeyName];
      };
      switch (dbFunctionName) {
        case dbFunctionNames.getDbItemValue:
          resData = await getDbItemValue(dbTableName, dbItemId, fieldNames);
          break;
        case dbFunctionNames.getMultipleDbItemsAsArrays:
          resData = await getMultipleDbItemsAsArrays(bodyData);
          break;
        case dbFunctionNames.saveDbItem:
          resData = await saveDbItem(bodyData);
          break;
        case dbFunctionNames.getDbItemsAsArray:
        default:
          resData = await getDbItemsAsArray(dbTableName, includeInactive, childName, childValue, topLimit, fieldNames);
          break;
      }
      console.log(`handleDbFunctions.resData: ${JSON.stringify(resData, null, 2)}`);
    } catch (error) {
      console.log(`handleDbFunctions Error: httpResponseCode: ${httpResponseCodes.BadRequest}, error.message: ${error.message}`);
      resStatus = httpResponseCodes.BadRequest;
      resData = error.message;
    }
    return res.status(resStatus).send(resData);
  });
};

exports.handleDbFunctions = handleDbFunctions;
