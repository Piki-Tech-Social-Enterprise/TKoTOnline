import BaseRepository from './BaseRepository';
import 'firebase/database';

class ContactRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
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
}

export default ContactRepository;
