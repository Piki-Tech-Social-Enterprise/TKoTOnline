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

  getDbEPanuiListAsArray = async (includeInactive, childName = 'active', childValue = true) => {
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

  addDbEPanuiDetails = async (eid, details) => {
    const existingDbEPanui = await this.getDbEPanui(eid);
    existingDbEPanui.update({details});
  }

  saveDbEPanui = async (ePanui, saveDbEPanui_completed) => {
    const {
      active,
      created,
      createdBy,
      category,
      content,
      eid,
      date,
      imageUrl,
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
        category: category || '',
        content: content || '',
        eid: newEid,
        date,
        imageUrl: imageUrl || '',
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
          active: typeof active === 'boolean' ? active : dbEPanui.active || false,
          category: category || dbEPanui.category || '',
          content: content || dbEPanui.content || '',
          eid: eid,
          date: date || dbEPanui.date,
          imageUrl: imageUrl || dbEPanui.imageUrl || '',
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
    return ePanui.eid;
  }

  deleteDbEPanui = async eid => {
    const existingDbEPanui = await this.getDbEPanui(eid);
    let errorMessage = null;
    if (existingDbEPanui) {
      await existingDbEPanui.remove();
    } else {
      errorMessage = 'Delete Db EPanui Error: eid (' + eid + ') not found.';
    }
    if (errorMessage) {
      console.log('Delete Db EPanui Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default EPanuiListRepository;
