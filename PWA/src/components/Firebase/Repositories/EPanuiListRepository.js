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
      firstName,
      lastName,
      details,
      phoneNumber,
      email,
      providerData,
      vid,
      updated,
      updatedBy
    } = ePanui;
    const now = new Date();
    let errorMessage = null;
    let existingDbEPanui = await this.getDbEPanui(vid || '')
    let dbEPanuiRef = null;
    let dbEPanui = null;
    if (!vid) {
      dbEPanuiRef = await existingDbEPanui.push();
      const newVid = await dbEPanuiRef.getKey();
      ePanui = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        firstName: firstName || '',
        lastName: lastName || '',
        details: details || {},
        phoneNumber: phoneNumber || '',
        email: email || '',
        providerData: providerData || (email && {
          email: email,
          providerId: 'password',
          vid: newVid
        }) || {},
        vid: newVid,
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
          created: created || dbEPanui.created,
          createdBy: createdBy || dbEPanui.createdBy,
          firstName: firstName || dbEPanui.firstName || '',
          lastName: lastName || dbEPanui.lastName || '',
          phoneNumber: phoneNumber || dbEPanui.phoneNumber || '',
          email: email || dbEPanui.email,
          providerData: providerData || dbEPanui.providerData || {},
          details: details || dbEPanui.details || {},
          vid: vid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || vid
        };
        existingDbEPanui.set(ePanui, saveDbEPanui_completed);
      } else {
        errorMessage = 'Save Db EPanui Error: vid (' + vid + ') not found.';
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
