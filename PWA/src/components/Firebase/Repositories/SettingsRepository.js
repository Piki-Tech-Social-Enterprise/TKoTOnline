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

  getDbSettingsAsArray = async includeInactive => {
    const existingDbSettings = await this.getDbSettings();
    const dbSettingRef = !includeInactive
      ? await existingDbSettings
        .orderByChild('active')
        .equalTo(true)
        .once('value')
      : await existingDbSettings
        .orderByChild('active')
        .once('value');
    const dbSetting = await dbSettingRef.val();
    const dbSettingAsArray = [];
    if (dbSetting) {
      Object.keys(dbSetting).map(key =>
        dbSettingAsArray.push(dbSetting[key])
      );
    }
    return dbSettingAsArray;
  }

  getDbSetting = async sid => {
    return await this.db.ref(`settings/${sid}`);
  }

  getDbSettingValue = async sid => {
    const existingDbSetting = await this.getDbSetting(sid);
    console.log(existingDbSetting);
    const dbSettingRef = await existingDbSetting.once('value');
    const dbSetting = await dbSettingRef.val();
    return dbSetting;
  }

  saveDbSetting = async (settings, saveDbSetting_completed) => {
    const {
      active,
      created,
      createdBy,
      settingName,
      settingText,
      sid,
      updated,
      updatedBy
    } = settings;
    const now = new Date();
    let errorMessage = null;
    let existingDbSettings = await this.getDbSettings(sid || '')
    let dbSettingsRef = null;
    let dbSettings = null;
    if (!sid) {
      dbSettingsRef = await existingDbSettings.push();
      settings = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        settingName: settingName || '',
        settingText: settingText || '',
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
          settingName: settingName || dbSettings.settingName || '',
          settingText: settingText || dbSettings.settingText || '',
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

  deleteDbSetting = async sid => {
    const existingDbSettings = await this.getDbSettings(sid);
    let errorMessage = null;
    if (existingDbSettings) {
      await existingDbSettings.remove();
    } else {
      errorMessage = `Delete Settings Error: sid (${sid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default SettingsRepository;
