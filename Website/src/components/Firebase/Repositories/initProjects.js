const initProjects = async initialisedFirebaseApp => {
  await import('firebase/database');
  const database = initialisedFirebaseApp.database();
  const getDbProjects = async () => {
    return await database.ref('projects');
  };
  const getDbProjectsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbProjects = await getDbProjects();
    const dbProjectsRef = !includeInactive
      ? await existingDbProjects
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbProjects
        .orderByChild(childName)
        .once('value');
    const dbProjects = await dbProjectsRef.val();
    const dbProjectsAsArray = [];
    if (dbProjects) {
      Object.keys(dbProjects).map(key =>
        dbProjectsAsArray.push(dbProjects[key])
      );
    }
    return dbProjectsAsArray.filter(c => includeInactive || c.active);
  };
  const getDbProject = async pid => {
    return await database.ref(`projects/${pid}`);
  };
  const getDbProjectValue = async pid => {
    const existingDbProject = await getDbProject(pid);
    const dbProjectRef = await existingDbProject.once('value');
    const dbProject = await dbProjectRef.val();
    return dbProject;
  };
  return {
    getDbProjects,
    getDbProjectsAsArray,
    getDbProject,
    getDbProjectValue
  };
};

export default initProjects;
