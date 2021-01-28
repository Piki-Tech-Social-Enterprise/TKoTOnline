const initCovidList = async initialisedFirebaseApp => {
  await import('firebase/database');
  const database = initialisedFirebaseApp.database();
  const getDbCovidList = async () => {
    return await database.ref('covidList');
  };
  const getDbCovidListAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbCovidList = await getDbCovidList();
    const dbCovidListRef = !includeInactive
      ? await existingDbCovidList
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbCovidList
        .orderByChild(childName)
        .once('value');
    const dbCovidList = await dbCovidListRef.val();
    const dbCovidListAsArray = [];
    if (dbCovidList) {
      Object.keys(dbCovidList).map(key =>
        dbCovidListAsArray.push(dbCovidList[key])
      );
    }
    return dbCovidListAsArray.filter(c => includeInactive || c.active);
  };
  const getDbCovid = async cvid => {
    return await database.ref(`covidList/${cvid}`);
  };
  const getDbCovidValue = async cvid => {
    const existingDbCovid = await getDbCovid(cvid);
    const dbCovidRef = await existingDbCovid.once('value');
    const dbCovid = await dbCovidRef.val();
    return dbCovid;
  };
  const saveDbCovid = async (covid, saveDbCovid_completed) => {
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
      paMaiUrl,
      cvid,
      updated,
      updatedBy
    } = covid;
    const now = new Date();
    let errorMessage = null;
    let existingDbCovid = await getDbCovid(cvid || '')
    let dbCovidRef = null;
    let dbCovid = null;
    if (!cvid) {
      dbCovidRef = await existingDbCovid.push();
      covid = {
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
        paMaiUrl: paMaiUrl || '',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        cvid: await dbCovidRef.getKey()
      };
      dbCovidRef.set(covid, saveDbCovid_completed);
    } else {
      dbCovidRef = await existingDbCovid.once('value');
      dbCovid = await dbCovidRef.val();
      if (dbCovid) {
        covid = {
          active: typeof active === 'boolean' ? active : dbCovid.active || false,
          category: category || dbCovid.category || '',
          content: content || dbCovid.content || '',
          date: date || dbCovid.date || '',
          externalUrl: externalUrl || '',
          header: header || dbCovid.header || '',
          imageUrl: imageUrl || dbCovid.imageUrl || '',
          isFeatured: typeof isFeatured === 'boolean' ? isFeatured : dbCovid.isFeatured || false,
          paMaiUrl: paMaiUrl || '',
          cvid: cvid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbCovid.updatedBy
        };
        existingDbCovid.set(covid, saveDbCovid_completed);
      } else {
        errorMessage = 'Save Db Covid Error: cvid (' + cvid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db Covid Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return covid.cvid;
  };
  const deleteDbCovid = async cvid => {
    const existingDbCovid = await getDbCovid(cvid);
    let errorMessage = null;
    if (existingDbCovid) {
      await existingDbCovid.remove();
    } else {
      errorMessage = `Delete Db News Feed Error: cvid (${cvid}) not found.`;
    }
    if (errorMessage) {
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  };
  return {
    getDbCovidList,
    getDbCovidListAsArray,
    getDbCovid,
    getDbCovidValue,
    saveDbCovid,
    deleteDbCovid
  };
};

export default initCovidList;
