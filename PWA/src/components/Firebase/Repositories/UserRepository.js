import DbBaseRepository from './DbBaseRepository';
import {
  isEmptyString,
  isBoolean
} from '../../App/Utilities';

class UserRepository extends DbBaseRepository {
  getDbUsers = async () => {
    return await this.db.ref('users');
  }

  getDbUsersAsArray = async (includeInactive = false, childName = 'active', childValue = true) => {
    const existingDbUsers = await this.getDbUsers();
    const dbUsersRef = !includeInactive
      ? await existingDbUsers
        .orderByChild(childName)
        .equalTo(childValue)
        .once('value')
      : await existingDbUsers
        .orderByChild(childName)
        .once('value');
    const dbUsers = await dbUsersRef.val();
    const dbUsersAsArray = [];
    if (dbUsers) {
      Object.keys(dbUsers).map(key =>
        dbUsersAsArray.push(dbUsers[key])
      );
    }
    return dbUsersAsArray.filter(u => includeInactive || u.active);
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
      emailVerified,
      isNew,
      photoURL,
      providerData,
      roles,
      uid,
      updated,
      updatedBy
    } = user;
    const now = new Date();
    const preparedUser = {
      active: active || (isBoolean(active) ? false : undefined),
      created: created || now.toString(),
      createdBy: createdBy || '',
      displayName: displayName || '',
      email: email || '',
      emailVerified: emailVerified || (isBoolean(emailVerified) ? false : undefined),
      photoURL: photoURL || (isEmptyString(photoURL) ? '' : undefined),
      providerData: providerData || (email && [{
        email: email,
        providerId: 'password',
        uid: uid
      }]) || undefined,
      roles: roles || undefined,
      uid: uid,
      updated: updated || now.toString(),
      updatedBy: updatedBy || ''
    };
    let errorMessage = null;
    let existingDbUser = await this.getDbUser(uid || '')
    let dbUserRef = null;
    let dbUser = null;
    if (!uid) {
      dbUserRef = await existingDbUser.push();
      const newUid = await dbUserRef.getKey();
      preparedUser.uid = newUid;
      preparedUser.providerData[0].uid = newUid;
      dbUserRef.set(preparedUser, saveDbUser_completed);
    } else {
      dbUserRef = await existingDbUser.once('value');
      dbUser = await dbUserRef.val() || {};
      if (dbUser || isNew) {
        existingDbUser.set({
          active: preparedUser.active || (isBoolean(preparedUser.active) ? false : dbUser.active || undefined),
          created: preparedUser.created || dbUser.created,
          createdBy: preparedUser.createdBy || dbUser.createdBy,
          displayName: preparedUser.displayName || dbUser.displayName || '',
          email: preparedUser.email || dbUser.email,
          emailVerified: preparedUser.emailVerified || (isBoolean(preparedUser.emailVerified) ? false : dbUser.emailVerified || undefined),
          photoURL: preparedUser.photoURL || (isEmptyString(preparedUser.photoURL) ? '' : dbUser.photoURL || undefined),
          providerData: preparedUser.providerData || dbUser.providerData || [],
          roles: preparedUser.roles || dbUser.roles || undefined,
          uid: preparedUser.uid || dbUser.uid,
          updated: preparedUser.updated || now.toString(),
          updatedBy: preparedUser.updatedBy || ''
        }, saveDbUser_completed);
      } else {
        errorMessage = 'Save Db User Error: uid (' + uid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db User Error: ' + errorMessage);
      throw new Error(errorMessage);
    }
    return preparedUser.uid;
  }

  updateUserOnboarding = async uid => {
    const existingDbUser = await this.getDbUser(uid);
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
