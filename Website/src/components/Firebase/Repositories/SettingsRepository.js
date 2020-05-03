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

  getDbSettingsValues = async includeInactive => {
    const existingDbSettings = await this.getDbSettings();
    const dbSettingRef = !includeInactive
      ? await existingDbSettings
        .equalTo(true)
        .once('value')
      : await existingDbSettings
        .once('value');
    const dbSettings = await dbSettingRef.val();
    return dbSettings;
  }
}

export default SettingsRepository;