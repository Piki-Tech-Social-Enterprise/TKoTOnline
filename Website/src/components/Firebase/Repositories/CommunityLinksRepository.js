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
}

export default CommunityLinksRepository;
