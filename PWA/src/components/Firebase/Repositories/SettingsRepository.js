import BaseRepository from './BaseRepository';
import 'firebase/database';

class SettingsRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbSettings = async () => {
    return await this.db.ref('settings');
  }

  getDbSetting = async sid => {
    return await this.db.ref(`settings/${sid}`);
  }

  getDbSettingsValues = async includeInactive => {
    const existingDbSettings = await this.getDbSettings();
    const dbSettingRef = !includeInactive
      ? await existingDbSettings
        .equalTo(true)
        .once('value')
      : await existingDbSettings
        .once('value');
    const dbSettings = await dbSettingRef.val();
    return dbSettings && Object.entries(dbSettings)[0][1];
  }

  saveDbSettings = async (settings, saveDbSetting_completed) => {
    const {
      active,
      created,
      createdBy,
      communityLinksDescritpion,
      volunteersDescritpion,
      sid,
      updated,
      updatedBy
    } = settings;
    const now = new Date();
    let errorMessage = null;
    let existingDbSettings = await this.getDbSetting(sid || '');
    let dbSettingsRef = null;
    let dbSettings = null;
    if (!sid) {
      dbSettingsRef = await existingDbSettings.push();
      settings = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        communityLinksDescritpion: communityLinksDescritpion || '',
        volunteersDescritpion: volunteersDescritpion || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        sid: await dbSettingsRef.getKey()
      };
      dbSettingsRef.set(settings, saveDbSetting_completed);
    } else {
      dbSettingsRef = await existingDbSettings.once('value');
      dbSettings = await dbSettingsRef.val();
      if (dbSettings) {
        settings = {
          active: active || (typeof active === 'boolean' && active) || false,
          created: created || dbSettings.created,
          createdBy: createdBy || dbSettings.createdBy,
          communityLinksDescritpion: communityLinksDescritpion || dbSettings.communityLinksDescritpion || '',
          volunteersDescritpion: volunteersDescritpion || dbSettings.volunteersDescritpion,
          sid: sid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbSettings.updatedBy
        };
        existingDbSettings.set(settings, saveDbSetting_completed);
      } else {
        errorMessage = 'Save Db Settings Error: sid (' + sid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db Settings Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return settings.sid;
  }
}

export default SettingsRepository;
