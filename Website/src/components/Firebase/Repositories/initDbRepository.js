const restApiDatabase = () => {
  const restApiDatabaseDataSnapshot = async path => {
    const {
      REACT_APP_FIREBASE_PROJECT_ID
    } = process.env;
    const fullPath = `https://${REACT_APP_FIREBASE_PROJECT_ID}.firebaseio.com/${path}`;
    console.log(`restApiDatabaseDataSnapshot::fullPath: ${fullPath}`);
    const _self = {
      response: await fetch(fullPath),
      val: async () => {
        const {
          response
        } = _self;
        return await response.json();
      }
    };
    return _self;
  };
  const restApiDatabaseReference = path => {
    const _self = {
      basePath: path,
      orderByChild: path => {
        _self._orderByChildPath = path;
        return _self;
      },
      equalTo: path => {
        _self._equalToPath = path;
        return _self;
      },
      limitToFirst: limit => {
        _self._limitToFirst = limit;
        return _self;
      },
      once: async eventType => {
        const newPath = _buildPath();
        return await restApiDatabaseDataSnapshot(newPath);
      }
    };
    const _buildPath = () => {
      const generateParam = (key, value, isFirstParam = false) => {
        const param = `${isFirstParam ? '?' : '&'}${key}=${value}`;
        return param;
      };
      let newPath = `${_self.basePath}.json`;
      if (_self._orderByChildPath) {
        newPath = `${newPath}${generateParam('orderBy', `"${encodeURIComponent(_self._orderByChildPath)}"`, Boolean(newPath.indexOf('?') === -1))}`;
      }
      if (_self._equalToPath) {
        newPath = `${newPath}${generateParam('equalTo', `${encodeURIComponent(_self._equalToPath)}`, Boolean(newPath.indexOf('?') === -1))}`;
      }
      if (_self._limitToFirst) {
        newPath = `${newPath}${generateParam('limitToFirst', _self._limitToFirst, Boolean(newPath.indexOf('?') === -1))}`;
      }
      return newPath;
    };
    return _self;
  };
  const _self = {
    ref: path => {
      return restApiDatabaseReference(path);
    },
    useEmulator: (url, port) => {
      
    }
  };
  return _self;
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
const initDbRepository = async initOptions => {
  const {
    isBoolean,
    isNullOrEmpty,
    refactorObject,
    isNumber
  } = await import(/* webpackPreload: true, webpackChunkName: 'app-utilities' */'components/App/Utilities');
  const {
    initialisedFirebaseApp,
    dbTableName: dbTableNamePassedIn,
    useSDKDatabase
  } = initOptions;
  let _dbTableName = dbTableNamePassedIn;
  if (useSDKDatabase) {
    await import(/* webpackPreload: true, webpackChunkName: 'firebase-database' */'firebase/compat/database');
  }
  const database = useSDKDatabase
    ? initialisedFirebaseApp.database()
    : restApiDatabase();
  const {
    REACT_APP_USE_EMULATOR,
    REACT_APP_DTB_PORT
  } = process.env;
  if (isBoolean(REACT_APP_USE_EMULATOR, true) && isNumber(REACT_APP_DTB_PORT)) { // && this.db._delegate._repoInternal.repoInfo_._host !== `localhost:${REACT_APP_DTB_PORT}`) {
    database.useEmulator('localhost', Number(REACT_APP_DTB_PORT));
    console.log(`initDbRepository.database.useEmulator is set to: 'localhost:${REACT_APP_DTB_PORT}'`);
  }
  const _getDbItems = dbItemId => {
    return database.ref(`${_dbTableName}${!isNullOrEmpty(dbItemId) ? `/${dbItemId}` : ''}`);
  };
  const getDbItems = () => {
    return _getDbItems();
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
    return _getDbItems(dbItemId);
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
        dbTableName: multipleDbItemsTableName,
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
      _dbTableName = multipleDbItemsTableName;
      const dbItemsAsArray = await getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
      queryItemResponses[key] = dbItemsAsArray;
      _dbTableName = dbTableNamePassedIn;
      return null;
    }));
    return queryItemResponses;
  };
  const saveDbItem = async item => {
    const {
      active,
      created,
      createdBy,
      [dbTables[_dbTableName].primaryKeyName]: primaryKey,
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
      [dbTables[_dbTableName].primaryKeyName]: primaryKey,
      updated: updated || nowAsString,
      updatedBy: updatedBy || '',
      version: parseInt(version) || 1
    };
    let errorMessage = null;
    let existingDbItem = getDbItem(primaryKey);
    let dbItemSnapshot = null;
    let dbItem = null;
    if (isNew) {
      preparedItem.created = created || nowAsString;
      preparedItem.createdBy = createdBy || '';
      if (primaryKey) {
        preparedItem[dbTables[_dbTableName].primaryKeyName] = primaryKey;
        existingDbItem.set({
          ...preparedItem,
          ...refactoredRest
        });
      } else {
        dbItemSnapshot = await existingDbItem.push();
        preparedItem[dbTables[_dbTableName].primaryKeyName] = await dbItemSnapshot.getKey();
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
          [dbTables[_dbTableName].primaryKeyName]: dbItemPrimaryKey,
          updated: dbItemUpdated,
          updatedBy: dbItemUpdatedBy,
          version: dbItemVersion,
          ...dbItemRest
        } = dbItem;
        if (dbItemVersion === version) { // debugger;
          const refactoredDbItemRest = await refactorObject(dbItemRest);
          preparedItem.version = (parseInt(version) || 0) + 1;
          existingDbItem.set({
            [dbTables[_dbTableName].primaryKeyName]: preparedItem[dbTables[_dbTableName].primaryKeyName] || dbItemPrimaryKey || undefined,
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
      console.log(`Save Db ${dbTables[_dbTableName].objectSingularName} Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }
    return preparedItem[dbTables[_dbTableName].primaryKeyName];
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
