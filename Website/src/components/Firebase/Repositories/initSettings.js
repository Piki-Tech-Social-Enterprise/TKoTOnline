const initSettings = async initialisedFirebaseApp => {
  await import('firebase/database');
  const database = initialisedFirebaseApp.database();
  const getDbSettings = async () => {
    return await database.ref('settings');
  };
  const getDbSettingsValues = async (includeInactive, childValue = true) => {
    const existingDbSettings = await getDbSettings();
    const dbSettingRef = !includeInactive
      ? await existingDbSettings
        .equalTo(childValue)
        .once('value')
      : await existingDbSettings
        .once('value');
    const dbSettings = await dbSettingRef.val();
    return dbSettings && Object.entries(dbSettings)[0][1];
  };
  return {
    getDbSettings,
    getDbSettingsValues
  };
};

export default initSettings;
