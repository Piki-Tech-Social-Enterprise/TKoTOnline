import BaseRepository from './BaseRepository';
import 'firebase/database';

class ProjectsRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbProjects = async () => {
    return await this.db.ref('projects');
  }

  getDbProjectsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbProject = await this.getDbProjects();
    const dbProjectRef = !includeInactive
      ? await existingDbProject
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbProject
        .orderByChild(childName)
        .once('value');
    const dbProject = await dbProjectRef.val();
    const dbProjectAsArray = [];
    if (dbProject) {
      Object.keys(dbProject).map(key =>
        dbProjectAsArray.push(dbProject[key])
      );
    }
    return dbProjectAsArray.filter(p => includeInactive || p.active);
  }

  getDbProject = async pid => {
    return await this.db.ref(`projects/${pid}`);
  }

  getDbProjectValue = async pid => {
    const existingDbProject = await this.getDbProject(pid);
    const dbProjectRef = await existingDbProject.once('value');
    const dbProject = await dbProjectRef.val();
    return dbProject;
  }
}

export default ProjectsRepository;
