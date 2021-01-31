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

  getDbResourcesAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
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
    return dbResourceAsArray.filter(r => includeInactive || r.active);
  }
}

export default ResourcesRepository;
