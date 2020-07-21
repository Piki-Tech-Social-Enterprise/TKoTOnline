import BaseRepository from './BaseRepository';
import 'firebase/database';

class FacebookLinksRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbFacebookLinks = async () => {
    return await this.db.ref('facebookLinks');
  }

  getDbFacebookLinksAsArray = async includeInactive => {
    const existingDbFacebookLink = await this.getDbFacebookLinks();
    const dbFacebookLinkRef = !includeInactive
      ? await existingDbFacebookLink
        .orderByChild('active')
        .equalTo(true)
        .once('value')
      : await existingDbFacebookLink
        .orderByChild('active')
        .once('value');
    const dbFacebookLink = await dbFacebookLinkRef.val();
    const dbFacebookLinkAsArray = [];
    if (dbFacebookLink) {
      Object.keys(dbFacebookLink).map(key =>
        dbFacebookLinkAsArray.push(dbFacebookLink[key])
      );
    }
    return dbFacebookLinkAsArray;
  }

  getDbFacebookLink = async fid => {
    return await this.db.ref(`facebookLinks/${fid}`);
  }

  getDbFacebookLinkValue = async fid => {
    const existingDbFacebookLinks = await this.getDbFacebookLink(fid);
    const dbFacebookLinksRef = await existingDbFacebookLinks.once('value');
    const dbFacebookLinks = await dbFacebookLinksRef.val();
    return dbFacebookLinks;
  }

  saveDbFacebookLink = async (facebookLink, saveDbFacebookLink_completed) => {
    const {
      active,
      created,
      createdBy,
      url,
      name,
      fid,
      updated,
      updatedBy
    } = facebookLink;
    const now = new Date();
    let errorMessage = null;
    let existingDbFacebookLinks = await this.getDbFacebookLink(fid || '')
    let dbFacebookLinksRef = null;
    let dbFacebookLinks = null;
    if (!fid) {
      dbFacebookLinksRef = await existingDbFacebookLinks.push();
      facebookLink = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        url: url || '',
        name: name || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        fid: await dbFacebookLinksRef.getKey()
      };
      dbFacebookLinksRef.set(facebookLink, saveDbFacebookLink_completed);
    } else {
      dbFacebookLinksRef = await existingDbFacebookLinks.once('value');
      dbFacebookLinks = await dbFacebookLinksRef.val();
      if (dbFacebookLinks) {
        facebookLink = {
          active: active || (typeof active === 'boolean' && active) || false,
          url: url || dbFacebookLinks.url || '',
          name: name || dbFacebookLinks.name || '',
          fid: fid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbFacebookLinks.updatedBy
        };
        existingDbFacebookLinks.set(facebookLink, saveDbFacebookLink_completed);
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
    const existingDbFacebookLinks = await this.getDbFacebookLink(fid);
    let errorMessage = null;
    if (existingDbFacebookLinks) {
      await existingDbFacebookLinks.remove();
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
