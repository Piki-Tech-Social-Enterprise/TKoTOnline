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

  getDbSettingsValues = async (includeInactive, childValue = true) => {
    const existingDbSettings = await this.getDbSettings();
    const dbSettingRef = !includeInactive
      ? await existingDbSettings
        .equalTo(childValue)
        .once('value')
      : await existingDbSettings
        .once('value');
    const dbSettings = await dbSettingRef.val();
    return dbSettings && Object.entries(dbSettings)[0][1];
  }
}

export default SettingsRepository;
