import BaseRepository from './BaseRepository';
import 'firebase/database';

class EconomicDevelopmentsRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbEconomicDevelopments = async () => {
    return await this.db.ref('economicDevelopments');
  }

  getDbEconomicDevelopmentsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbEconomicDevelopment = await this.getDbEconomicDevelopments();
    const dbEconomicDevelopmentRef = !includeInactive
      ? await existingDbEconomicDevelopment
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbEconomicDevelopment
        .orderByChild(childName)
        .once('value');
    const dbEconomicDevelopment = await dbEconomicDevelopmentRef.val();
    const dbEconomicDevelopmentAsArray = [];
    if (dbEconomicDevelopment) {
      Object.keys(dbEconomicDevelopment).map(key =>
        dbEconomicDevelopmentAsArray.push(dbEconomicDevelopment[key])
      );
    }
    return dbEconomicDevelopmentAsArray.filter(ed => includeInactive || ed.active);
  }

  getDbEconomicDevelopment = async edid => {
    return await this.db.ref(`economicDevelopments/${edid}`);
  }

  getDbEconomicDevelopmentValue = async edid => {
    const existingDbEconomicDevelopment = await this.getDbEconomicDevelopment(edid);
    const dbEconomicDevelopmentRef = await existingDbEconomicDevelopment.once('value');
    const dbEconomicDevelopment = await dbEconomicDevelopmentRef.val();
    return dbEconomicDevelopment;
  }

  saveDbEconomicDevelopment = async (economicDevelopment, saveDbEconomicDevelopment_completed) => {
    const {
      active,
      created,
      createdBy,
      category,
      content,
      header,
      imageUrl,
      isFeatured,
      economicDevelopmentUrl,
      edid,
      updated,
      updatedBy
    } = economicDevelopment;
    const now = new Date();
    let errorMessage = null;
    let existingDbEconomicDevelopment = await this.getDbEconomicDevelopment(edid || '')
    let dbEconomicDevelopmentRef = null;
    let dbEconomicDevelopment = null;
    if (!edid) {
      dbEconomicDevelopmentRef = await existingDbEconomicDevelopment.push();
      economicDevelopment = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        category: category || '',
        content: content || '',
        header: header || '',
        imageUrl: imageUrl || '',
        isFeatured: isFeatured || false,
        economicDevelopmentUrl: economicDevelopmentUrl || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        edid: await dbEconomicDevelopmentRef.getKey()
      };
      dbEconomicDevelopmentRef.set(economicDevelopment, saveDbEconomicDevelopment_completed);
    } else {
      dbEconomicDevelopmentRef = await existingDbEconomicDevelopment.once('value');
      dbEconomicDevelopment = await dbEconomicDevelopmentRef.val();
      if (dbEconomicDevelopment) {
        economicDevelopment = {
          active: typeof active === 'boolean' ? active : dbEconomicDevelopment.active || false,
          category: category || dbEconomicDevelopment.category || '',
          content: content || dbEconomicDevelopment.content || '',
          created: dbEconomicDevelopment.created || now.toString(),
          createdBy: dbEconomicDevelopment.createdBy,
          header: header || dbEconomicDevelopment.header || '',
          imageUrl: imageUrl || (typeof imageUrl === 'undefined' ? dbEconomicDevelopment.imageUrl : ''),
          isFeatured: typeof isFeatured === 'boolean' ? isFeatured : dbEconomicDevelopment.isFeatured || false,
          economicDevelopmentUrl: economicDevelopmentUrl || dbEconomicDevelopment.economicDevelopmentUrl || '',
          edid: edid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbEconomicDevelopment.updatedBy
        };
        existingDbEconomicDevelopment.set(economicDevelopment, saveDbEconomicDevelopment_completed);
      } else {
        errorMessage = 'Save Db EconomicDevelopment Error: edid (' + edid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db EconomicDevelopment Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return economicDevelopment.edid;
  }

  deleteDbEconomicDevelopment = async edid => {
    const existingDbEconomicDevelopment = await this.getDbEconomicDevelopment(edid);
    let errorMessage = null;
    if (existingDbEconomicDevelopment) {
      await existingDbEconomicDevelopment.remove();
    } else {
      errorMessage = `Delete Db EconomicDevelopment Error: edid (${edid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default EconomicDevelopmentsRepository;
