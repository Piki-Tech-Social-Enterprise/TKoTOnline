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

  getDbFacebookLinksAsArray = async (includeInactive, childName = 'active', childValue = true) => {
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
    return dbFacebookLinkAsArray;
  }

  getDbFacebookLink = async fid => {
    return await this.db.ref(`facebookLinks/${fid}`);
  }

  getDbFacebookLinkValue = async fid => {
    const existingDbFacebook = await this.getDbFacebookLink(fid);
    const dbFacebookRef = await existingDbFacebook.once('value');
    const dbFacebook = await dbFacebookRef.val();
    return dbFacebook;
  }
}

export default FacebookLinksRepository;
