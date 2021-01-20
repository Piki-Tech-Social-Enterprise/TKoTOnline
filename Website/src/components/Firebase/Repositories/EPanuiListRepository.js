import BaseRepository from './BaseRepository';
import 'firebase/database';

class EPanuiListRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbEPanuiList = async () => {
    return await this.db.ref('ePanuiList');
  }

  getDbEPanuiListAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    const existingDbEPanuiList = await this.getDbEPanuiList();
    let dbEPanuiListQuery = existingDbEPanuiList.orderByChild(childName);
    if (!includeInactive) {
      dbEPanuiListQuery = dbEPanuiListQuery.equalTo(childValue);
    }
    if (!isNaN(topLimit)) {
      dbEPanuiListQuery = dbEPanuiListQuery.limitToFirst(topLimit);
    }
    const dbEPanuiListRef = await dbEPanuiListQuery.once('value');
    const dbEPanuiList = await dbEPanuiListRef.val();
    const dbEPanuiListAsArray = [];
    if (dbEPanuiList) {
      Object.keys(dbEPanuiList).map(key =>
        dbEPanuiListAsArray.push(dbEPanuiList[key])
      );
    }
    return dbEPanuiListAsArray.filter(ep => includeInactive || ep.active);
  }

  getDbEPanui = async eid => {
    return await this.db.ref(`ePanuiList/${eid}`);
  }

  getDbEPanuiValue = async eid => {
    const existingDbEPanui = await this.getDbEPanui(eid),
      snapshot = await existingDbEPanui.once('value'),
      dbEPanui = await snapshot.val();
    return dbEPanui;
  }
}

export default EPanuiListRepository;
