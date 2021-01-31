const initDbRepository = async initOptions => {
  await import('firebase/database');
  const {
    initialisedFirebaseApp,
    dbTableName
  } = initOptions;
  const database = initialisedFirebaseApp.database();
  const getDbItems = async () => {
    return await database.ref(dbTableName);
  };
  const getDbItemsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    const existingDbItems = await getDbItems();
    let dbItemsQuery = existingDbItems.orderByChild(childName);
    if (!includeInactive) {
      dbItemsQuery = dbItemsQuery.equalTo(childValue);
    }
    if (!isNaN(topLimit)) {
      dbItemsQuery = dbItemsQuery.limitToFirst(topLimit);
    }
    const dbItemsRef = await dbItemsQuery.once('value');
    const dbItems = await dbItemsRef.val();
    const dbItemsAsArray = [];
    if (dbItems) {
      Object.keys(dbItems).map(key =>
        dbItemsAsArray.push(dbItems[key])
      );
    }
    return dbItemsAsArray.filter(dbItem => includeInactive || dbItem.active);
  };
  const getDbItem = async dbItemId => {
    return await database.ref(`${dbTableName}/${dbItemId}`);
  };
  const getDbItemValue = async dbItemId => {
    const existingDbItem = await getDbItem(dbItemId);
    const dbItemRef = await existingDbItem.once('value');
    const dbItem = await dbItemRef.val();
    return dbItem;
  };
  return {
    initialisedFirebaseApp,
    dbTableName,
    database,
    getDbItems,
    getDbItemsAsArray,
    getDbItem,
    getDbItemValue
  };
};

export default initDbRepository;
