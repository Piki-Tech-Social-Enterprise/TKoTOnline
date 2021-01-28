const initContact = async initialisedFirebaseApp => {
  await import('firebase/database');
  const database = initialisedFirebaseApp.database();
  const getDbContacts = async () => {
    return await database.ref('contacts');
  };
  const getDbContactsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbContact = await getDbContacts();
    const dbContactRef = !includeInactive
      ? await existingDbContact
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbContact
        .orderByChild(childName)
        .once('value');
    const dbContact = await dbContactRef.val();
    const dbContactsAsArray = [];
    if (dbContact) {
      Object.keys(dbContact).map(key =>
        dbContactsAsArray.push(dbContact[key])
      );
    }
    return dbContactsAsArray.filter(c => includeInactive || c.active);
  };
  const getDbContact = async cid => {
    return await database.ref(`contacts/${cid}`);
  };
  const saveDbContact = async (contact, saveDbContact_completed) => {
    const {
      active,
      created,
      createdBy,
      firstName,
      lastName,
      email,
      message,
      subscribed,
      cid,
      updated,
      updatedBy
    } = contact;

    const now = new Date();
    let errorMessage = null;
    let existingDbContact = await getDbContact(cid || '')
    let dbContactRef = null;
    let dbContact = null;

    if (!cid) {
      dbContactRef = await existingDbContact.push();
      contact = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        message: message || '',
        subscribed: subscribed || false,
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        cid: await dbContactRef.getKey()
      };
      dbContactRef.set(contact, saveDbContact_completed);
    } else {
      dbContactRef = await existingDbContact.once('value');
      dbContact = await dbContactRef.val();
      if (dbContact) {
        contact = {
          active: typeof active === 'boolean' ? active : dbContact.active || false,
          created: created || dbContact.created || '',
          createdBy: createdBy || dbContact.createdBy || '',
          firstName: firstName || dbContact.firstName || '',
          lastName: lastName || dbContact.lastName || '',
          email: email || dbContact.email || '',
          message: message || dbContact.message || '',
          subscribed: subscribed || dbContact.subscribed || false,
          cid: cid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbContact.updatedBy
        };
        existingDbContact.set(contact, saveDbContact_completed);
      } else {
        errorMessage = 'Save Db Contacts Error: cid (' + cid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db Contacts Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return contact.cid;
  }
  return {
    getDbContacts,
    getDbContactsAsArray,
    getDbContact,
    saveDbContact
  };
};

export default initContact;
