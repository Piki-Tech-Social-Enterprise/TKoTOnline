import DbBaseRepository from './DbBaseRepository';
import 'firebase/compat/database';

class NewsFeedRepository extends DbBaseRepository {
  getDbNewsFeeds = async () => {
    return await this.db.ref('newsFeeds');
  }

  getDbNewsFeedsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbNewsFeeds = await this.getDbNewsFeeds();
    const dbNewsFeedsRef = !includeInactive
      ? await existingDbNewsFeeds
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbNewsFeeds
        .orderByChild(childName)
        .once('value');
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

  saveDbNewsFeed = async (newsFeed, saveDbNewsFeed_completed) => {
    const {
      active,
      created,
      createdBy,
      category,
      content,
      date,
      externalUrl,
      header,
      imageUrl,
      isFeatured,
      isTKoTMedia,
      nfid,
      updated,
      updatedBy
    } = newsFeed;
    const now = new Date();
    let errorMessage = null;
    let existingDbNewsFeed = await this.getDbNewsFeed(nfid || '')
    let dbNewsFeedRef = null;
    let dbNewsFeed = null;
    if (!nfid) {
      dbNewsFeedRef = await existingDbNewsFeed.push();
      newsFeed = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        category: category || '',
        content: content || '',
        date: date || '',
        externalUrl: externalUrl || '',
        header: header || '',
        imageUrl: imageUrl || '',
        isFeatured: isFeatured || false,
        isTKoTMedia: isTKoTMedia || false,
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        nfid: await dbNewsFeedRef.getKey()
      };
      dbNewsFeedRef.set(newsFeed, saveDbNewsFeed_completed);
    } else {
      dbNewsFeedRef = await existingDbNewsFeed.once('value');
      dbNewsFeed = await dbNewsFeedRef.val();
      if (dbNewsFeed) {
        newsFeed = {
          active: typeof active === 'boolean' ? active : dbNewsFeed.active || false,
          category: category || '',
          content: content || dbNewsFeed.content || '',
          date: date || dbNewsFeed.date || '',
          externalUrl: externalUrl || dbNewsFeed.externalUrl || '',
          header: header || dbNewsFeed.header || '',
          imageUrl: imageUrl || dbNewsFeed.imageUrl || '',
          isFeatured: typeof isFeatured === 'boolean' ? isFeatured : dbNewsFeed.isFeatured || false,
          isTKoTMedia: typeof isTKoTMedia === 'boolean' ? isTKoTMedia : dbNewsFeed.isTKoTMedia || false,
          nfid: nfid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbNewsFeed.updatedBy
        };
        existingDbNewsFeed.set(newsFeed, saveDbNewsFeed_completed);
      } else {
        errorMessage = 'Save Db NewsFeed Error: nfid (' + nfid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db NewsFeed Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return newsFeed.nfid;
  }

  deleteDbNewsFeed = async nfid => {
    const existingDbNewsFeed = await this.getDbNewsFeed(nfid);
    let errorMessage = null;
    if (existingDbNewsFeed) {
      await existingDbNewsFeed.remove();
    } else {
      errorMessage = `Delete Db News Feed Error: nfid (${nfid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default NewsFeedRepository;
