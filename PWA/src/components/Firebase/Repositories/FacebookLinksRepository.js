import DbBaseRepository from './DbBaseRepository';
import 'firebase/compat/database';

class FacebookLinksRepository extends DbBaseRepository {
  getDbFacebookLinks = async () => {
    return await this.db.ref('facebookLinks');
  }

  getDbFacebookLinksAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbFacebookLink = await this.getDbFacebookLinks();
    const dbFacebookLinkRef = !includeInactive
      ? await existingDbFacebookLink
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbFacebookLink
        .orderByChild(childName)
        .once('value');
    const dbFacebookLink = await dbFacebookLinkRef.val();
    const dbFacebookLinkAsArray = [];
    if (dbFacebookLink) {
      Object.keys(dbFacebookLink).map(key =>
        dbFacebookLinkAsArray.push(dbFacebookLink[key])
      );
    }
    return dbFacebookLinkAsArray.filter(fl => includeInactive || fl.active);
  }

  getDbFacebookLink = async fid => {
    return await this.db.ref(`facebookLinks/${fid}`);
  }

  getDbFacebookLinksValue = async fid => {
    const existingDbFacebookLink = await this.getDbFacebookLink(fid);
    const dbFacebookLinkRef = await existingDbFacebookLink.once('value');
    const dbFacebookLink = await dbFacebookLinkRef.val();
    return dbFacebookLink;
  }

  saveDbFacebookLink = async (facebookLink, saveDbFacebookLink_completed) => {
    const {
      active,
      created,
      createdBy,
      url,
      name,
      fid,
      sequence,
      updated,
      updatedBy
    } = facebookLink;
    const now = new Date();
    let errorMessage = null;
    let existingDbFacebookLink = await this.getDbFacebookLink(fid || '')
    let dbFacebookLinkRef = null;
    let dbFacebookLink = null;
    if (!fid) {
      dbFacebookLinkRef = await existingDbFacebookLink.push();
      facebookLink = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        url: url || '',
        name: name || '',
        sequence: sequence || Number.MAX_SAFE_INTEGER,
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        fid: await dbFacebookLinkRef.getKey()
      };
      dbFacebookLinkRef.set(facebookLink, saveDbFacebookLink_completed);
    } else {
      dbFacebookLinkRef = await existingDbFacebookLink.once('value');
      dbFacebookLink = await dbFacebookLinkRef.val();
      if (dbFacebookLink) {
        facebookLink = {
          active: typeof active === 'boolean' ? active : dbFacebookLink.active || false,
          url: url || dbFacebookLink.url || '',
          name: name || dbFacebookLink.name || '',
          fid: fid,
          sequence: sequence || dbFacebookLink.sequence || Number.MAX_SAFE_INTEGER,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbFacebookLink.updatedBy
        };
        existingDbFacebookLink.set(facebookLink, saveDbFacebookLink_completed);
      } else {
        errorMessage = 'Save Db FacebookLinks Error: fid (' + fid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db FacebookLinks Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return facebookLink.fid;
  }

  deleteDbFacebookLink = async fid => {
    const existingDbFacebookLink = await this.getDbFacebookLink(fid);
    let errorMessage = null;
    if (existingDbFacebookLink) {
      await existingDbFacebookLink.remove();
    } else {
      errorMessage = `Delete Db News Feed Error: fid (${fid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default FacebookLinksRepository;
