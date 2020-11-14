import BaseRepository from './BaseRepository';
import 'firebase/database';

class ResourcesRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbResources = async () => {
    return await this.db.ref('resources');
  }

  getDbResourcesAsArray = async (includeInactive, childName = 'active', childValue = true) => {
    const existingDbResource = await this.getDbResources();
    const dbResourceRef = !includeInactive
      ? await existingDbResource
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbResource
        .orderByChild(childValue)
        .once('value');
    const dbResource = await dbResourceRef.val();
    const dbResourceAsArray = [];
    if (dbResource) {
      Object.keys(dbResource).map(key =>
        dbResourceAsArray.push(dbResource[key])
      );
    }
    return dbResourceAsArray;
  }

  getDbResource = async rid => {
    return await this.db.ref(`resources/${rid}`);
  }

  getDbResourceValue = async rid => {
    const existingDbResource = await this.getDbResource(rid);
    const dbResourceRef = await existingDbResource.once('value');
    const dbResource = await dbResourceRef.val();
    return dbResource;
  }
}

export default ResourcesRepository;
