const initNewsFeed = async initialisedFirebaseApp => {
  await import('firebase/database');
  const database = initialisedFirebaseApp.database();
  const getDbNewsFeeds = async () => {
    return await database.ref('newsFeeds');
  };
  const getDbNewsFeedsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => {
    const existingDbNewsFeeds = await getDbNewsFeeds();
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
  };
  const getDbNewsFeed = async nfid => {
    return await database.ref(`newsFeeds/${nfid}`);
  };
  const getDbNewsFeedValue = async nfid => {
    const existingDbNewsFeed = await getDbNewsFeed(nfid);
    const dbNewsFeedRef = await existingDbNewsFeed.once('value');
    const dbNewsFeed = await dbNewsFeedRef.val();
    return dbNewsFeed;
  };
  const saveDbNewsFeed = async (newsFeed, saveDbNewsFeed_completed) => {
    const {
      active,
      created,
      createdBy,
      category,
      content,
      header,
      imageUrl,
      isFeatured,
      nfid,
      updated,
      updatedBy
    } = newsFeed;
    const now = new Date();
    let errorMessage = null;
    let existingDbNewsFeed = await getDbNewsFeed(nfid || '')
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
        header: header || '',
        imageUrl: imageUrl || '',
        isFeatured: isFeatured || false,
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
          category: category || dbNewsFeed.category || '',
          content: content || dbNewsFeed.content || '',
          header: header || dbNewsFeed.header || '',
          imageUrl: imageUrl || dbNewsFeed.imageUrl || '',
          isFeatured: typeof isFeatured === 'boolean' ? isFeatured : dbNewsFeed.isFeatured || false,
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
  };
  const deleteDbNewsFeed = async nfid => {
    const existingDbNewsFeed = await getDbNewsFeed(nfid);
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
  };
  return {
    getDbNewsFeeds,
    getDbNewsFeedsAsArray,
    getDbNewsFeed,
    getDbNewsFeedValue,
    saveDbNewsFeed,
    deleteDbNewsFeed
  };
};

export default initNewsFeed;
