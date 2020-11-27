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

  getDbEPanuiListAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbEPanuiList = await this.getDbEPanuiList();
    const dbEPanuiListRef = !includeInactive
      ? await existingDbEPanuiList
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbEPanuiList
        .orderByChild(childName)
        .once('value');
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
