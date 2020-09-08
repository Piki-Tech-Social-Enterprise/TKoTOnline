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

  getDbEPanuiListAsArray = async includeInactive => {
    const existingDbEPanuiList = await this.getDbEPanuiList();
    const dbEPanuiListRef = !includeInactive
      ? await existingDbEPanuiList
        .orderByChild('active')
        .equalTo(true)
        .once('value')
      : await existingDbEPanuiList
        .orderByChild('active')
        .once('value');
    const dbEPanuiList = await dbEPanuiListRef.val();
    const dbEPanuiListAsArray = [];
    if (dbEPanuiList) {
      Object.keys(dbEPanuiList).map(key =>
        dbEPanuiListAsArray.push(dbEPanuiList[key])
      );
    }
    return dbEPanuiListAsArray;
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
