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

  getDbProjectsAsArray = async (includeInactive, childName = 'active', childValue = true) => {
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
    return dbProjectAsArray;
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

  saveDbProject = async (project, saveDbProject_completed) => {
    const {
      active,
      created,
      createdBy,
      content,
      header,
      imageUrl,
      pid,
      updated,
      updatedBy
    } = project;
    const now = new Date();
    let errorMessage = null;
    let existingDbProject = await this.getDbProject(pid || '')
    let dbProjectRef = null;
    let dbProject = null;
    if (!pid) {
      dbProjectRef = await existingDbProject.push();
      project = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        content: content || '',
        header: header || '',
        imageUrl: imageUrl || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        pid: await dbProjectRef.getKey()
      };
      dbProjectRef.set(project, saveDbProject_completed);
    } else {
      dbProjectRef = await existingDbProject.once('value');
      dbProject = await dbProjectRef.val();
      if (dbProject) {
        project = {
          active: typeof active === 'boolean' ? active : dbProject.active || false,
          content: content || dbProject.content || '',
          header: header || dbProject.header || '',
          imageUrl: imageUrl || dbProject.imageUrl || '',
          pid: pid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbProject.updatedBy
        };
        existingDbProject.set(project, saveDbProject_completed);
      } else {
        errorMessage = 'Save Db Project Error: pid (' + pid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db Project Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return project.pid;
  }

  deleteDbProject = async pid => {
    const existingDbProject = await this.getDbProject(pid);
    let errorMessage = null;
    if (existingDbProject) {
      await existingDbProject.remove();
    } else {
      errorMessage = `Delete Db Project Error: pid (${pid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default ProjectsRepository;
