import BaseRepository from './BaseRepository';
import 'firebase/database';

class CommunityLinksRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbCommunityLinks = async () => {
    return await this.db.ref('communityLinks');
  }

  getDbCommunityLinksAsArray = async includeInactive => {
    const existingDbCommunityLink = await this.getDbCommunityLinks();
    const dbCommunityLinkRef = !includeInactive
      ? await existingDbCommunityLink
        .orderByChild('active')
        .equalTo(true)
        .once('value')
      : await existingDbCommunityLink
        .orderByChild('active')
        .once('value');
    const dbCommunityLink = await dbCommunityLinkRef.val();
    const dbCommunityLinkAsArray = [];
    if (dbCommunityLink) {
      Object.keys(dbCommunityLink).map(key =>
        dbCommunityLinkAsArray.push(dbCommunityLink[key])
      );
    }
    return dbCommunityLinkAsArray;
  }

  getDbCommunityLink = async clid => {
    return await this.db.ref(`communityLinks/${clid}`);
  }

  getDbCommunityLinkValue = async clid => {
    const existingDbCommunityLinks = await this.getDbCommunityLinks(clid);
    const dbCommunityLinksRef = await existingDbCommunityLinks.once('value');
    const dbCommunityLinks = await dbCommunityLinksRef.val();
    return dbCommunityLinks;
  }

  saveDbCommunityLink = async (communityLink, saveDbCommunityLink_completed) => {
    const {
      active,
      created,
      createdBy,
      link,
      linkName,
      clid,
      updated,
      updatedBy
    } = communityLink;
    const now = new Date();
    let errorMessage = null;
    let existingDbCommunityLinks = await this.getDbCommunityLink(clid || '')
    let dbCommunityLinksRef = null;
    let dbCommunityLinks = null;
    if (!clid) {
      dbCommunityLinksRef = await existingDbCommunityLinks.push();
      communityLink = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        link: link || '',
        linkName: linkName || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        clid: await dbCommunityLinksRef.getKey()
      };
      dbCommunityLinksRef.set(communityLink, saveDbCommunityLink_completed);
    } else {
      dbCommunityLinksRef = await existingDbCommunityLinks.once('value');
      dbCommunityLinks = await dbCommunityLinksRef.val();
      if (dbCommunityLinks) {
        communityLink = {
          active: active || (typeof active === 'boolean' && active) || false,
          created: created || dbCommunityLinks.created,
          createdBy: createdBy || dbCommunityLinks.createdBy,
          link: link || dbCommunityLinks.link || '',
          linkName: linkName || dbCommunityLinks.title || '',
          clid: clid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbCommunityLinks.updatedBy
        };
        existingDbCommunityLinks.set(communityLink, saveDbCommunityLink_completed);
      } else {
        errorMessage = 'Save Db CommunityLinks Error: clid (' + clid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db CommunityLinks Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return communityLink.clid;
  }

  deleteDbCommunityLink = async clid => {
    const existingDbCommunityLinks = await this.getDbCommunityLink(clid);
    let errorMessage = null;
    if (existingDbCommunityLinks) {
      await existingDbCommunityLinks.remove();
    } else {
      errorMessage = `Delete Db News Feed Error: clid (${clid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default CommunityLinksRepository;
