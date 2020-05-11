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

  getDbUsersAsArray = async includeInactive => {
    const existingDbUsers = await this.getDbUsers();
    const dbUsersRef = !includeInactive
      ? await existingDbUsers
        .orderByChild('active')
        .equalTo(true)
        .once('value')
      : await existingDbUsers
        .orderByChild('active')
        .once('value');
    const dbUsers = await dbUsersRef.val();
    const dbUsersAsArray = [];
    if (dbUsers) {
      Object.keys(dbUsers).map(key =>
        dbUsersAsArray.push(dbUsers[key])
      );
    }
    return dbUsersAsArray;
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
    } = user;
    const now = new Date();
    let errorMessage = null;
    let existingDbUser = await this.getDbUser(uid || '')
    let dbUserRef = null;
    let dbUser = null;
    if (!uid) {
      dbUserRef = await existingDbUser.push();
      const newUid = await dbUserRef.getKey();
      user = {
        active: active || false,
        created: created || now.toString(),
        createdBy: createdBy || '',
        displayName: displayName || '',
        email: email || '',
        photoURL: photoURL || '',
        providerData: providerData || (email && {
          email: email,
          providerId: 'password',
          uid: newUid
        }) || {},
        roles: roles || {
          undefinedRole
        },
        isVolunteer: false,
        uid: newUid,
        updated: updated || now.toString(),
        updatedBy: updatedBy || ''
      };
      dbUserRef.set(user, saveDbUser_completed);
    } else {
      dbUserRef = await existingDbUser.once('value');
      dbUser = await dbUserRef.val();
      if (dbUser) {
        user = {
          active: active || (typeof active === 'boolean' && active) || false,
          created: created || dbUser.created,
          createdBy: createdBy || dbUser.createdBy,
          displayName: displayName || dbUser.displayName || '',
          email: email || dbUser.email,
          photoURL: photoURL || dbUser.photoURL || '',
          providerData: providerData || dbUser.providerData || {},
          roles: roles || dbUser.roles || {
            undefinedRole
          },
          isVolunteer: true,
          uid: uid,
          updated: updated || now.toString(),
          updatedBy: updatedBy || uid
        };
        existingDbUser.set(user, saveDbUser_completed);
      } else {
        errorMessage = 'Save Db User Error: uid (' + uid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db User Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return user.uid;
  }

  updateUserOnboarding = async uid => {
    const existingDbUser = await this.getDbUser(uid);
    console.log('here', existingDbUser);
    existingDbUser.update({onBoardingCompleted: true});
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
