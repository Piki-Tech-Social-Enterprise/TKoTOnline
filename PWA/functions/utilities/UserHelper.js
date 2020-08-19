// const functions = require('firebase-functions');
// const {
//   jsonObjectPropertiesToUppercase
// } = require('./index');
// const envcmd = jsonObjectPropertiesToUppercase(functions.config && functions.config().envcmd
//   ? functions.config().envcmd
//   : {});
// const config = Object.assign(process.env, envcmd);
const admin = require('firebase-admin');
const {
  undefinedRole
} = require('../utilities/Roles');
// const {
//   parse,
//   stringify
// } = require('flatted');
const {
  isEmptyString,
  isBoolean,
  getFirebaseStorageURL
} = require('../utilities');

class UserHelper {
  constructor() {
    // console.log(`config: ${JSON.stringify(config, null, 2)}`);
    // console.log(`admin.apps.length: ${admin.apps.length}`);
    if (admin.apps.length === 0) {
      admin.initializeApp();
    } else {
      console.log(`admin.apps[0]: ${JSON.stringify({
        name: admin.apps[0].name,
        options: admin.apps[0].options
      }, null, 2)}`);
    }
    this.adminAuth = admin.auth();
    this.adminDatabase = admin.database();
    // this.adminStorage = admin.storage();
    this.createAuthUser = this.handleCreateAuthUser
      .bind(this);
    this.updateAuthUser = this.handleUpdateAuthUser
      .bind(this);
    this.deleteAuthUser = this.handleDeleteAuthUser
      .bind(this);
    this.saveDbUser = this.handleSaveDbUser
      .bind(this);
    this.deleteDbUser = this.handleDeleteDbUser
      .bind(this);
    this.createUser = this.handleCreateUser
      .bind(this);
    this.updateUser = this.handleUpdateUser
      .bind(this);
    this.deleteUser = this.handleDeleteUser
      .bind(this);
    return this;
  }

  async handleCreateAuthUser(authUser) {
    const {
      disabled,
      displayName,
      email,
      emailVerified,
      password,
      phoneNumber,
      photoURL,
      uid
    } = authUser;
    const createRequest = {
      disabled: disabled || (isBoolean(disabled) ? false : undefined),
      displayName: displayName || undefined,
      email: email || undefined,
      emailVerified: emailVerified || (isBoolean(emailVerified) ? false : undefined),
      password: password || undefined,
      phoneNumber: phoneNumber || undefined,
      photoURL: photoURL || (isEmptyString(photoURL) ? '' : undefined),
      uid: uid || undefined
    };
    console.log(`handleCreateAuthUser.createRequest: ${JSON.stringify(createRequest, null, 2)}`);
    const userRecord = await this.adminAuth.createUser(createRequest);
    console.log(`handleCreateAuthUser.userRecord: ${JSON.stringify(userRecord, null, 2)}`);
    return userRecord;
  }

  async handleUpdateAuthUser(authUser) {
    const {
      disabled,
      displayName,
      email,
      emailVerified,
      password,
      phoneNumber,
      photoURL,
      uid
    } = authUser;
    console.log(`handleUpdateAuthUser.authUser: ${JSON.stringify(authUser, null, 2)}`);
    const existingAuthUser = await this.adminAuth.getUser(uid);
    console.log(`handleUpdateAuthUser.existingAuthUser: ${JSON.stringify(existingAuthUser, null, 2)}`);
    const updateRequest = {
      disabled: disabled || (isBoolean(disabled) ? false : existingAuthUser.disabled),
      displayName: displayName || existingAuthUser.displayName || undefined,
      email: email || existingAuthUser.email || undefined,
      emailVerified: emailVerified || (isBoolean(emailVerified) ? false : existingAuthUser.emailVerified),
      password: password || existingAuthUser.password || undefined,
      phoneNumber: phoneNumber || existingAuthUser.phoneNumber || undefined,
      photoURL: photoURL || (isEmptyString(photoURL) ? '' : existingAuthUser.photoURL || undefined)
    };
    console.log(`handleUpdateAuthUser.updateRequest: ${JSON.stringify(updateRequest, null, 2)}`);
    const userRecord = await this.adminAuth.updateUser(uid, updateRequest);
    console.log(`handleUpdateAuthUser.userRecord: ${JSON.stringify(userRecord, null, 2)}`);
    return userRecord;
  }

  async handleDeleteAuthUser(authUser) {
    const {
      uid
    } = authUser;
    const existingAuthUser = await this.adminAuth.getUser(uid);
    console.log(`existingAuthUser: ${JSON.stringify(existingAuthUser, null, 2)}`);
    if (existingAuthUser) {
      await this.adminAuth.deleteUser(uid);
    }
  }

  async getDbUser(uid) {
    return await this.adminDatabase.ref(`users/${uid}`);
  }

  async handleSaveDbUser(user, saveDbUser_completed) {
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
    console.log('handleSaveDbUser.user: ', JSON.stringify(user, null, 2));
    const now = new Date();
    const preparedUser = {
      active: active || (isBoolean(active) ? false : undefined),
      created: created || now.toString(),
      createdBy: createdBy || '',
      displayName: displayName || '',
      email: email || '',
      emailVerified: emailVerified || (isBoolean(emailVerified) ? false : undefined),
      photoURL: photoURL || (isEmptyString(photoURL) ? '' : undefined),
      providerData: providerData || (email ? [{
        email: email,
        providerId: 'password',
        uid: uid
      }] : []) || [],
      roles: roles || {
        undefinedRole
      },
      uid: uid,
      updated: updated || now.toString(),
      updatedBy: updatedBy || ''
    };
    console.log('handleSaveDbUser.preparedUser: ', JSON.stringify(preparedUser, null, 2));
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
        dbUser = {
          active: preparedUser.active || (isBoolean(preparedUser.active) ? false : dbUser.active || undefined),
          created: preparedUser.created || dbUser.created,
          createdBy: preparedUser.createdBy || dbUser.createdBy,
          displayName: preparedUser.displayName || dbUser.displayName || '',
          email: preparedUser.email || dbUser.email,
          emailVerified: preparedUser.emailVerified || (isBoolean(preparedUser.emailVerified) ? false : dbUser.emailVerified || undefined),
          photoURL: preparedUser.photoURL || (isEmptyString(preparedUser.photoURL) ? '' : dbUser.photoURL || undefined),
          providerData: preparedUser.providerData || dbUser.providerData || [],
          roles: preparedUser.roles || dbUser.roles || {
            undefinedRole
          },
          uid: preparedUser.uid || dbUser.uid,
          updated: preparedUser.updated || now.toString(),
          updatedBy: preparedUser.updatedBy || ''
        };
        console.log('handleSaveDbUser.dbUser: ', JSON.stringify(dbUser, null, 2));
        existingDbUser.set(dbUser, saveDbUser_completed);
      } else {
        errorMessage = 'Save Db User Error: uid (' + uid + ') not found.';
      }
    }
    if (errorMessage) {
      console.log('Save Db User Error: ', errorMessage);
      throw new Error(errorMessage);
    }
    return preparedUser.uid;
  }

  async handleDeleteDbUser(uid) {
    const existingDbUser = await this.getDbUser(uid);
    let errorMessage = null;
    if (existingDbUser) {
      await existingDbUser.remove();
    } else {
      errorMessage = 'Delete Db User Error: uid (' + uid + ') not found.';
    }
    if (errorMessage) {
      console.log('Delete Db User Error: ', errorMessage);
      throw new Error(errorMessage);
    }
  }

  createAuthUserClone(authUser) {
    const authUserClone = Object.assign({}, authUser);
    authUserClone.photoURL = getFirebaseStorageURL(process.env.GCLOUD_PROJECT, authUser.photoURL);
    console.log(`handleCreateUser.authUserClone: ${JSON.stringify(authUserClone, null, 2)}`);
    return authUserClone;
  }

  async handleCreateUser(authUser) {
    // console.log(`config: ${stringify(config, null, 2)}`);
    console.log(`handleCreateUser.authUser: ${JSON.stringify(authUser, null, 2)}`);
    let errorMessages = [];
    try {
      await this.handleCreateAuthUser(authUser.photoURL.startsWith('/images/')
        ? this.createAuthUserClone(authUser)
        : authUser);
    } catch (error) {
      errorMessages.push(`Create User Error (AuthUser): ${error}`);
    }
    try {
      console.log(`handleCreateUser.authUser--2: ${JSON.stringify(authUser, null, 2)}`);
      await this.handleSaveDbUser(authUser);
    } catch (error) {
      errorMessages.push(`Create User Error (DbUser): ${error}`);
    }
    if (errorMessages.length) {
      const errorMessage = errorMessages.join('\n');
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
    return true;
  }

  async handleUpdateUser(authUser) {
    // console.log(`config: ${stringify(config, null, 2)}`);
    console.log(`handleUpdateUser.authUser: ${JSON.stringify(authUser, null, 2)}`);
    let errorMessages = [];
    try {
      await this.handleUpdateAuthUser(authUser.photoURL.startsWith('/images/')
        ? this.createAuthUserClone(authUser)
        : authUser);
    } catch (error) {
      errorMessages.push(`Update User Error (AuthUser): ${error}`);
    }
    try {
      console.log(`handleUpdateUser.authUser--2: ${JSON.stringify(authUser, null, 2)}`);
      await this.handleSaveDbUser(authUser);
    } catch (error) {
      errorMessages.push(`Update User Error (DbUser): ${error}`);
    }
    if (errorMessages.length) {
      const errorMessage = errorMessages.join('\n');
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
    return true;
  }

  async handleDeleteUser(authUser, force = false) {
    // console.log(`config: ${JSON.stringify(config, null, 2)}`);
    const {
      uid
    } = authUser;
    let errorMessages = [];
    try {
      await this.handleDeleteAuthUser(authUser);
    } catch (error) {
      errorMessages.push(`Delete User Error (AuthUser): ${error}`);
    }
    if (errorMessages.length === 0 || force) {
      try {
        await this.handleDeleteDbUser(uid);
      } catch (error) {
        errorMessages.push(`Delete User Error (DbUser): ${error}`);
      }
    }
    // if (errorMessages.length === 0 || force) {
    //   try {
    //     // const {
    //     //   REACT_APP_FIREBASE_STORAGE_BUCKET
    //     // } = config;
    //     // await this.adminStorage.bucket(REACT_APP_FIREBASE_STORAGE_BUCKET).deleteFiles({
    //     await this.adminStorage.bucket().deleteFiles({
    //       force: true,
    //       prefix: `images/users/${uid}/`
    //     });
    //   } catch (error) {
    //     errorMessages.push(`Delete User Error (Files): ${error}`);
    //   }
    // }
    if (errorMessages.length && !force) {
      const errorMessage = errorMessages.join('\n');
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
    return true;
  }
}

exports.UserHelper = UserHelper;
exports.UNAUTHENTICATED = 'UNAUTHENTICATED';
