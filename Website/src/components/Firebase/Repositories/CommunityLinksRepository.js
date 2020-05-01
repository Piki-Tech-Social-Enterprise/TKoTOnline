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
}

export default CommunityLinksRepository;
