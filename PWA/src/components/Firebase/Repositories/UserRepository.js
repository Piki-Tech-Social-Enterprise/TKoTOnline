import BaseRepository from './BaseRepository';
import 'firebase/database';
import {
  undefinedRole
} from '../../Domains/Roles';

class UserRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.db = firebaseApp.database();
  }

  getDbUsers = async () => {
    return await this.db.ref('users');
  }

  getDbUser = async uid => {
    return await this.db.ref(`users/${uid}`);
  }

  getDbUserValue = async uid => {
    const existingDbUser = await this.getDbUser(uid),
      snapshot = await existingDbUser.once('value'),
      dbUser = await snapshot.val();
    return dbUser;
  }

  saveDbUser = async (user, saveDbUser_completed) => {
    const {
        active,
        created,
        createdBy,
        displayName,
        email,
        photoURL,
        providerData,
        roles,
        uid,
        updated,
        updatedBy
      } = user,
      existingDbUser = await this.getDbUser(uid),
      now = new Date();
    let errorMessage = null,
      dbUserRef = null,
      dbUser = null;
    if (existingDbUser) {
      dbUserRef = await existingDbUser.once('value');
      dbUser = dbUserRef.val();
      if (dbUser) {
        user = {
          active: (typeof active === 'boolean' && active) || (typeof active !== 'boolean' && !!dbUser.active),
          created: created || dbUser.created,
          createdBy: createdBy || dbUser.createdBy,
          displayName: displayName || dbUser.displayName || '',
          email: email || dbUser.email,
          photoURL: photoURL || dbUser.photoURL || '',
          providerData: providerData || dbUser.providerData || {},
          roles: roles || dbUser.roles || {
              undefinedRole
          },
          uid: uid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || uid
        }
      }
      existingDbUser.set(user, saveDbUser_completed);
    } else {
      errorMessage = 'Save Db User Error: uid (' + uid + ') not found.';
    }
    if (errorMessage) {
      console.log('Save Db User Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
  }

  deleteDbUser = async uid => {
    const existingDbUser = await this.getDbUser(uid);
    let errorMessage = null;
    if (existingDbUser) {
      await existingDbUser.remove();
    } else {
      errorMessage = 'Delete Db User Error: uid (' + uid + ') not found.';
    }
    if (errorMessage) {
      console.log('Delete Db User Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default UserRepository;
