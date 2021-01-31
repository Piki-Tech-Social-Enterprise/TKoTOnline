import BaseRepository from './BaseRepository';
import 'firebase/database';

class CovidListRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbCovidList = async () => {
    return await this.db.ref('covidList');
  }

  getDbCovidListAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    const existingDbCovidList = await this.getDbCovidList();
    let dbCovidListQuery = existingDbCovidList.orderByChild(childName);
    if (!includeInactive) {
      dbCovidListQuery = dbCovidListQuery.equalTo(childValue);
    }
    if (!isNaN(topLimit)) {
      dbCovidListQuery = dbCovidListQuery.limitToFirst(topLimit);
    }
    const dbCovidListRef = await dbCovidListQuery.once('value');
    const dbCovidList = await dbCovidListRef.val();
    const dbCovidListAsArray = [];
    if (dbCovidList) {
      Object.keys(dbCovidList).map(key =>
        dbCovidListAsArray.push(dbCovidList[key])
      );
    }
    return dbCovidListAsArray.filter(cv => includeInactive || cv.active);
  }

  getDbCovid = async cvid => {
    return await this.db.ref(`covidList/${cvid}`);
  }

  getDbCovidValue = async cvid => {
    const existingDbCovid = await this.getDbCovid(cvid);
    const dbCovidRef = await existingDbCovid.once('value');
    const dbCovid = await dbCovidRef.val();
    return dbCovid;
  }
}

export default CovidListRepository;
