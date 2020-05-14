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

  getDbContactsAsArray = async includeInactive => {
    const existingDbContact = await this.getDbContacts();
    const dbContactRef = !includeInactive
      ? await existingDbContact
        .orderByChild('active')
        .equalTo(true)
        .once('value')
      : await existingDbContact
        .orderByChild('active')
        .once('value');
    const dbContact = await dbContactRef.val();
    const dbContactsAsArray = [];
    if (dbContact) {
      Object.keys(dbContact).map(key =>
        dbContactsAsArray.push(dbContact[key])
      );
    }
    return dbContactsAsArray;
  }

  getDbContact = async cid => {
    return await this.db.ref(`contacts/${cid}`);
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
      cid,
      updated,
      updatedBy
    } = contact;

    const now = new Date();
    let errorMessage = null;
    let existingDbContacts = await this.getDbContact(cid || '')
    let dbContactsRef = null;
    let dbContacts = null;
    
    if (!cid) {
      dbContactsRef = await existingDbContacts.push();
      contact = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        firstName: firstName || '',
        lastname: lastName || '',
        email: email || '',
        message: message ||'',
        updated: updated || now.toString(),
        updatedBy: updatedBy || '',
        cid: await dbContactsRef.getKey()
      };
      dbContactsRef.set(contact, saveDbContact_completed);
    } else {
        dbContactsRef = await existingDbContacts.once('value');
      dbContacts = await dbContactsRef.val();
      if (dbContacts) {
        contact = {
          active: active || (typeof active === 'boolean' && active) || false,
          created: created || dbContacts.created,
          createdBy: createdBy || dbContacts.createdBy,
          firstName: firstName || dbContacts.firstName || '',
          lastName: lastName || dbContacts.lastName || '',
          email: email || dbContacts.email || '',
          message: message || dbContacts.message || '',
          cid: cid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || dbContacts.updatedBy
        };
        existingDbContacts.set(contact, saveDbContact_completed);
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
}

export default ContactRepository;
