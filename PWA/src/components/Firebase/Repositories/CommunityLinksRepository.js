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

  getDbCommunityLinksAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbCommunityLink = await this.getDbCommunityLinks();
    const dbCommunityLinkRef = !includeInactive
      ? await existingDbCommunityLink
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbCommunityLink
        .orderByChild(childName)
        .once('value');
    const dbCommunityLink = await dbCommunityLinkRef.val();
    const dbCommunityLinkAsArray = [];
    if (dbCommunityLink) {
      Object.keys(dbCommunityLink).map(key =>
        dbCommunityLinkAsArray.push(dbCommunityLink[key])
      );
    }
    return dbCommunityLinkAsArray.filter(cl => includeInactive || cl.active);
  }

  getDbCommunityLink = async clid => {
    return await this.db.ref(`communityLinks/${clid}`);
  }

  getDbCommunityLinkValue = async clid => {
    const existingDbCommunityLink = await this.getDbCommunityLink(clid);
    const dbCommunityLinkRef = await existingDbCommunityLink.once('value');
    const dbCommunityLink = await dbCommunityLinkRef.val();
    return dbCommunityLink;
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
    let dbCommunityLinkRef = null;
    let dbCommunityLink = null;
    if (!clid) {
      dbCommunityLinkRef = await existingDbCommunityLinks.push();
      communityLink = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        link: link || '',
        linkName: linkName || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        clid: await dbCommunityLinkRef.getKey()
      };
      dbCommunityLinkRef.set(communityLink, saveDbCommunityLink_completed);
    } else {
      dbCommunityLinkRef = await existingDbCommunityLinks.once('value');
      dbCommunityLink = await dbCommunityLinkRef.val();
      if (dbCommunityLink) {
        communityLink = {
          active: typeof active === 'boolean' ? active : dbCommunityLink.active || false,
          link: link || dbCommunityLink.link || '',
          linkName: linkName || dbCommunityLink.linkName || '',
          clid: clid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbCommunityLink.updatedBy
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
