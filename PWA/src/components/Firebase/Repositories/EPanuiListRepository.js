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

  getDbEPanui = async vid => {
    return await this.db.ref(`ePanuiList/${vid}`);
  }

  getDbEPanuiValue = async vid => {
    const existingDbEPanui = await this.getDbEPanui(vid),
      snapshot = await existingDbEPanui.once('value'),
      dbEPanui = await snapshot.val();
    return dbEPanui;
  }

  addDbEPanuiDetails = async (vid, details) => {
    const existingDbEPanui = await this.getDbEPanui(vid);
    existingDbEPanui.update({details});
  }

  saveDbEPanui = async (ePanui, saveDbEPanui_completed) => {
    const {
      active,
      created,
      createdBy,
      eid,
      date,
      name,
      url,
      updated,
      updatedBy
    } = ePanui;
    const now = new Date();
    let errorMessage = null;
    let existingDbEPanui = await this.getDbEPanui(eid || '')
    let dbEPanuiRef = null;
    let dbEPanui = null;
    if (!eid) {
      dbEPanuiRef = await existingDbEPanui.push();
      const newEid = await dbEPanuiRef.getKey();
      ePanui = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        eid: newEid,
        date,
        name,
        url,
        updated: updated || now.toString(),
        updatedBy: updatedBy || ''
      };
      dbEPanuiRef.set(ePanui, saveDbEPanui_completed);
    } else {
      dbEPanuiRef = await existingDbEPanui.once('value');
      dbEPanui = await dbEPanuiRef.val();
      if (dbEPanui) {
        ePanui = {
          active: active || (typeof active === 'boolean' && active) || false,
          eid: eid,
          date: date || dbEPanui.date,
          name: name || dbEPanui.name,
          url: url || dbEPanui.url,
          updated: updated || now.toString(),
          updatedBy: updatedBy || ''
        };
        existingDbEPanui.set(ePanui, saveDbEPanui_completed);
      } else {
        errorMessage = 'Save Db EPanui Error: eid (' + eid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db EPanui Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return ePanui.vid;
  }

  deleteDbEPanui = async vid => {
    const existingDbEPanui = await this.getDbEPanui(vid);
    let errorMessage = null;
    if (existingDbEPanui) {
      await existingDbEPanui.remove();
    } else {
      errorMessage = 'Delete Db EPanui Error: vid (' + vid + ') not found.';
    }
    if (errorMessage) {
      console.log('Delete Db EPanui Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default EPanuiListRepository;
