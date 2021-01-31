import BaseRepository from './BaseRepository';
import 'firebase/database';

class EconomicDevelopmentsRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbEconomicDevelopments = async () => {
    return await this.db.ref('economicDevelopments');
  }

  getDbEconomicDevelopmentsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbEconomicDevelopment = await this.getDbEconomicDevelopments();
    const dbEconomicDevelopmentRef = !includeInactive
      ? await existingDbEconomicDevelopment
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbEconomicDevelopment
        .orderByChild(childValue)
        .once('value');
    const dbEconomicDevelopment = await dbEconomicDevelopmentRef.val();
    const dbEconomicDevelopmentAsArray = [];
    if (dbEconomicDevelopment) {
      Object.keys(dbEconomicDevelopment).map(key =>
        dbEconomicDevelopmentAsArray.push(dbEconomicDevelopment[key])
      );
    }
    return dbEconomicDevelopmentAsArray.filter(ed => includeInactive || ed.active);
  }
}

export default EconomicDevelopmentsRepository;
