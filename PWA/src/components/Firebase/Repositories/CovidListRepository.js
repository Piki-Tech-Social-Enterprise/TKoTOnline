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

  saveDbCovid = async (covid, saveDbCovid_completed) => {
    const {
      active,
      created,
      createdBy,
      category,
      content,
      header,
      imageUrl,
      date,
      isFeatured,
      cvid,
      updated,
      updatedBy
    } = covid;
    const now = new Date();
    let errorMessage = null;
    let existingDbCovid = await this.getDbCovid(cvid || '')
    let dbCovidRef = null;
    let dbCovid = null;
    if (!cvid) {
      dbCovidRef = await existingDbCovid.push();
      covid = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        category: category || '',
        content: content || '',
        header: header || '',
        imageUrl: imageUrl || '',
        date: date || '',
        isFeatured: isFeatured || false,
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        cvid: await dbCovidRef.getKey()
      };
      dbCovidRef.set(covid, saveDbCovid_completed);
    } else {
      dbCovidRef = await existingDbCovid.once('value');
      dbCovid = await dbCovidRef.val();
      if (dbCovid) {
        covid = {
          active: typeof active === 'boolean' ? active : dbCovid.active || false,
          category: category || dbCovid.category || '',
          content: content || dbCovid.content || '',
          header: header || dbCovid.header || '',
          imageUrl: imageUrl || dbCovid.imageUrl || '',
          isFeatured: typeof isFeatured === 'boolean' ? isFeatured : dbCovid.isFeatured || false,
          date: date || dbCovid.date || '',
          cvid: cvid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbCovid.updatedBy
        };
        existingDbCovid.set(covid, saveDbCovid_completed);
      } else {
        errorMessage = 'Save Db Covid Error: cvid (' + cvid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db Covid Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return covid.cvid;
  }

  deleteDbCovid = async cvid => {
    const existingDbCovid = await this.getDbCovid(cvid);
    let errorMessage = null;
    if (existingDbCovid) {
      await existingDbCovid.remove();
    } else {
      errorMessage = `Delete Db News Feed Error: cvid (${cvid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default CovidListRepository;
