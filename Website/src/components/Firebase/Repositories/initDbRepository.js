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
const initDbRepository = async initOptions => {
  await import(/* webpackPrefetch: true */'firebase/database');
  const {
    isBoolean,
    isNullOrEmpty,
    refactorObject
  } = await import(/* webpackPrefetch: true */'components/App/Utilities');
  const {
    initialisedFirebaseApp,
    dbTableName: dbTableNamePassedIn
  } = initOptions;
  let _dbTableName = null;
  const database = initialisedFirebaseApp.database();
  const getDbItems = () => {
    return database.ref(_dbTableName || dbTableNamePassedIn);
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
  const getDbItemsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    const existingDbItems = getDbItems();
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
  const getDbItem = dbItemId => {
    return database.ref(`${_dbTableName || dbTableNamePassedIn}/${dbItemId}`);
  };
  const getDbItemValue = async (dbItemId, fieldNames = []) => {
    const existingDbItem = getDbItem(dbItemId);
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
      _dbTableName = dbTableName;
      const dbItemsAsArray = await getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
      queryItemResponses[key] = dbItemsAsArray;
      _dbTableName = null;
      return null;
    }));
    return queryItemResponses;
  };
  const saveDbItem = async item => {
    const dbTableName = _dbTableName || dbTableNamePassedIn;
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
  return {
    initialisedFirebaseApp,
    dbTableName: dbTableNamePassedIn,
    database,
    getDbItemsAsArray,
    getMultipleDbItemsAsArrays,
    getDbItemValue,
    saveDbItem
  };
};

export default initDbRepository;
