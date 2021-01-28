const initFacebookLinks = async initialisedFirebaseApp => {
  await import('firebase/database');
  const database = initialisedFirebaseApp.database();
  const getDbFacebookLinks = async () => {
    return await database.ref('facebookLinks');
  };
  const getDbFacebookLinksAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbFacebookLinks = await getDbFacebookLinks();
    const dbFacebookLinksRef = !includeInactive
      ? await existingDbFacebookLinks
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbFacebookLinks
        .orderByChild(childName)
        .once('value');
    const dbFacebookLinks = await dbFacebookLinksRef.val();
    const dbFacebookLinksAsArray = [];
    if (dbFacebookLinks) {
      Object.keys(dbFacebookLinks).map(key =>
        dbFacebookLinksAsArray.push(dbFacebookLinks[key])
      );
    }
    return dbFacebookLinksAsArray.filter(c => includeInactive || c.active);
  };
  const getDbFacebookLink = async fid => {
    return await database.ref(`facebookLinks/${fid}`);
  };
  const getDbFacebookLinkValue = async fid => {
    const existingDbFacebookLink = await getDbFacebookLink(fid);
    const dbFacebookLinkRef = await existingDbFacebookLink.once('value');
    const dbFacebookLink = await dbFacebookLinkRef.val();
    return dbFacebookLink;
  };
  return {
    getDbFacebookLinks,
    getDbFacebookLinksAsArray,
    getDbFacebookLink,
    getDbFacebookLinkValue
  };
};

export default initFacebookLinks;
