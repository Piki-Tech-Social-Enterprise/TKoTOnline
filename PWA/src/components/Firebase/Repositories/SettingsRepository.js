import DbBaseRepository from './DbBaseRepository';
import 'firebase/compat/database';

class SettingsRepository extends DbBaseRepository {
  getDbSettings = async () => {
    return await this.db.ref('settings');
  }

  getDbSetting = async sid => {
    return await this.db.ref(`settings/${sid}`);
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

  saveDbSettings = async (settings, saveDbSetting_completed) => {
    const {
      active,
      created,
      createdBy,
      homePageHeaderImageUrl,
      homePageAboutImageUrl,
      homePageAboutDescription,
      homePageVideoSourceUrl,
      aboutPageDescription,
      aboutPageTKoTBackOfficeStructureDescription,
      aboutPageTKoTBackOfficeStructureImageUrl,
      aboutPageExtraDescription,
      newsSectionDescription,
      gmailEmail,
      gmailPassword,
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
        homePageHeaderImageUrl: homePageHeaderImageUrl || '',
        homePageAboutImageUrl: homePageAboutImageUrl || '',
        homePageAboutDescription: homePageAboutDescription || '',
        homePageVideoSourceUrl: homePageVideoSourceUrl || '',
        aboutPageDescription: aboutPageDescription || '',
        aboutPageTKoTBackOfficeStructureDescription: aboutPageTKoTBackOfficeStructureDescription || '',
        aboutPageTKoTBackOfficeStructureImageUrl: aboutPageTKoTBackOfficeStructureImageUrl || '',
        aboutPageExtraDescription: aboutPageExtraDescription || '',
        newsSectionDescription: newsSectionDescription || '',
        gmailEmail: gmailEmail || '',
        gmailPassword: gmailPassword || '',
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
          active: typeof active === 'boolean' ? active : dbSettings.active || false,
          homePageHeaderImageUrl: homePageHeaderImageUrl || dbSettings.homePageHeaderImageUrl,
          homePageAboutImageUrl: homePageAboutImageUrl || dbSettings.homePageAboutImageUrl,
          homePageAboutDescription: homePageAboutDescription || dbSettings.homePageAboutDescription,
          homePageVideoSourceUrl: homePageVideoSourceUrl || dbSettings.homePageVideoSourceUrl,
          aboutPageDescription: aboutPageDescription || dbSettings.aboutPageDescription,
          aboutPageTKoTBackOfficeStructureDescription: aboutPageTKoTBackOfficeStructureDescription || dbSettings.aboutPageTKoTBackOfficeStructureDescription,
          aboutPageTKoTBackOfficeStructureImageUrl: aboutPageTKoTBackOfficeStructureImageUrl || dbSettings.aboutPageTKoTBackOfficeStructureImageUrl,
          aboutPageExtraDescription: aboutPageExtraDescription || dbSettings.aboutPageExtraDescription,
          newsSectionDescription: newsSectionDescription || dbSettings.newsSectionDescription,
          gmailEmail: gmailEmail || dbSettings.gmailEmail,
          gmailPassword: gmailPassword || dbSettings.gmailPassword,
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
