import BaseRepository from './BaseRepository';
import 'firebase/database';

class ContactRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbContacts = async () => {
    return await this.db.ref('contacts');
  }

  getDbContactsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbContact = await this.getDbContacts();
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
  }

  getDbContact = async cid => {
    return await this.db.ref(`contacts/${cid}`);
  }

  getDbContactValue = async cid => {
    const existingDbContact = await this.getDbContact(cid);
    const dbContactRef = await existingDbContact.once('value');
    const dbContact = await dbContactRef.val();
    return dbContact;
  }

  saveDbContact = async (contact, saveDbContact_completed) => {
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
    let existingDbContact = await this.getDbContact(cid || '')
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

  deleteDbContact = async cid => {
    const existingDbContact = await this.getDbContact(cid);
    let errorMessage = null;
    if (existingDbContact) {
      await existingDbContact.remove();
    } else {
      errorMessage = `Delete Db Contact Error: cid (${cid}) not found.`;
    }
    if (errorMessage) {
      throw new Error(errorMessage);
    }
  }
}

export default ContactRepository;
