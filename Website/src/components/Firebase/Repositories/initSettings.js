const initSettings = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import(/* webpackPrefetch: true */'./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'settings'
  });
  const getDbSettingsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
  };
  const getDbSettingValue = async (sid, fieldNames = []) => {
    return await dbRepository.getDbItemValue(sid, fieldNames);
  };
  const getDbSettingsValues = async (fieldNames = []) => {
    const includeInactive = false;
    const childName = 'active';
    const childValue = true;
    const topLimit = NaN;
    const dbSettingsAsArray = await getDbSettingsAsArray(includeInactive, childName, childValue, topLimit, fieldNames);
    return dbSettingsAsArray[0];
  };
  return {
    dbRepository,
    getDbSettingsAsArray,
    getDbSettingValue,
    getDbSettingsValues
  };
};

export default initSettings;
