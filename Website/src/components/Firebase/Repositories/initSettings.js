const initSettings = async initialisedFirebaseApp => {
  const {
    default: initDbRepository
  } = await import('./initDbRepository');
  const dbRepository = await initDbRepository({
    initialisedFirebaseApp,
    dbTableName: 'settings'
  });
  const getDbSettings = async () => {
    return await dbRepository.getDbItems();
  };
  const getDbSettingsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    return await dbRepository.getDbItemsAsArray(includeInactive, childName, childValue, topLimit);
  };
  const getDbSetting = async sid => {
    return await dbRepository.getDbItem(sid);
  };
  const getDbSettingValue = async sid => {
    return await dbRepository.getDbItemValue(sid);
  };
  const getDbSettingsValues = async () => {
    const dbSettingsAsArray = await getDbSettingsAsArray()
    return dbSettingsAsArray[0];
  };
  return {
    dbRepository,
    getDbSettings,
    getDbSettingsAsArray,
    getDbSetting,
    getDbSettingValue,
    getDbSettingsValues
  };
};

export default initSettings;
