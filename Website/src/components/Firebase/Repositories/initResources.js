const initResources = async initialisedFirebaseApp => {
  await import('firebase/database');
  const database = initialisedFirebaseApp.database();
  const getDbResources = async () => {
    return await database.ref('resources');
  };
  const getDbResourcesAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbResources = await getDbResources();
    const dbResourcesRef = !includeInactive
      ? await existingDbResources
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbResources
        .orderByChild(childName)
        .once('value');
    const dbResources = await dbResourcesRef.val();
    const dbResourcesAsArray = [];
    if (dbResources) {
      Object.keys(dbResources).map(key =>
        dbResourcesAsArray.push(dbResources[key])
      );
    }
    return dbResourcesAsArray.filter(c => includeInactive || c.active);
  };
  const getDbResource = async pid => {
    return await database.ref(`resources/${pid}`);
  };
  const getDbResourceValue = async pid => {
    const existingDbResource = await getDbResource(pid);
    const dbResourceRef = await existingDbResource.once('value');
    const dbResource = await dbResourceRef.val();
    return dbResource;
  };
  return {
    getDbResources,
    getDbResourcesAsArray,
    getDbResource,
    getDbResourceValue
  };
};

export default initResources;
