import BaseRepository from './BaseRepository';
import 'firebase/database';

class NewsFeedRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbNewsFeeds = async () => {
    return await this.db.ref('newsFeeds');
  }

  getDbNewsFeedsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    const existingDbNewsFeeds = await this.getDbNewsFeeds();
    let dbNewsFeedsQuery = existingDbNewsFeeds.orderByChild(childName);
    if (!includeInactive) {
      dbNewsFeedsQuery = dbNewsFeedsQuery.equalTo(childValue);
    }
    if (!isNaN(topLimit)) {
      dbNewsFeedsQuery = dbNewsFeedsQuery.limitToFirst(topLimit);
    }
    const dbNewsFeedsRef = await dbNewsFeedsQuery.once('value');
    const dbNewsFeeds = await dbNewsFeedsRef.val();
    const dbNewsFeedsAsArray = [];
    if (dbNewsFeeds) {
      Object.keys(dbNewsFeeds).map(key =>
        dbNewsFeedsAsArray.push(dbNewsFeeds[key])
      );
    }
    return dbNewsFeedsAsArray.filter(nf => includeInactive || nf.active);
  }

  getDbNewsFeed = async nfid => {
    return await this.db.ref(`newsFeeds/${nfid}`);
  }

  getDbNewsFeedValue = async nfid => {
    const existingDbNewsFeed = await this.getDbNewsFeed(nfid);
    const dbNewsFeedRef = await existingDbNewsFeed.once('value');
    const dbNewsFeed = await dbNewsFeedRef.val();
    return dbNewsFeed;
  }
}

export default NewsFeedRepository;
