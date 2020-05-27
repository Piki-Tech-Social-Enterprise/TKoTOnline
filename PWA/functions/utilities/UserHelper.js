const functions = require('firebase-functions');
const jsonObjectPropertiesToUppercase = jsonObject => {
  const revisedJsonObject = {};
  Object.keys(jsonObject).map(key => (
    revisedJsonObject[key.toUpperCase()] = jsonObject[key]
  ));
  return revisedJsonObject;
};
const envcmd = jsonObjectPropertiesToUppercase(functions.config && functions.config().envcmd
  ? functions.config().envcmd
  : {});
const config = Object.assign(process.env, envcmd);
const admin = require('firebase-admin');

class UserHelper {
  constructor() {
    //console.log(`config: ${JSON.stringify(config, null, 2)}`);
    //console.log(`admin.apps.length: ${admin.apps.length}`);
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
    this.createAuthUser = this.handleCreateAuthUser
      .bind(this);
    this.updateAuthUser = this.handleUpdateAuthUser
      .bind(this);
    this.saveDbUser = this.handleSaveDbUser
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
      disabled: disabled,
      displayName: displayName,
      email: email,
      emailVerified: emailVerified,
      password: password,
      phoneNumber: phoneNumber,
      photoURL: photoURL,
      uid: uid
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
    const existingAuthUser = await this.adminAuth.getUser(uid);
    console.log(`existingAuthUser: ${JSON.stringify(existingAuthUser, null, 2)}`);
    const updateRequest = {
      disabled: disabled || existingAuthUser.disabled || false,
      displayName: displayName || existingAuthUser.displayName || null,
      email: email || existingAuthUser.email || null,
      emailVerified: emailVerified || existingAuthUser.emailVerified || false,
      password: password || existingAuthUser.password || null,
      phoneNumber: phoneNumber || existingAuthUser.phoneNumber || null,
      photoURL: photoURL || existingAuthUser.phoneNumber || null
    };
    console.log(`handleUpdateAuthUser.updateRequest: ${JSON.stringify(updateRequest, null, 2)}`);
    const userRecord = await this.adminAuth.updateUser(updateRequest);
    console.log(`handleUpdateAuthUser.userRecord: ${JSON.stringify(userRecord, null, 2)}`);
    return userRecord;
  }

  async handleSaveDbUser(user, saveDbUser_completed) {
    const {
      active,
      created,
      createdBy,
      displayName,
      email,
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
      active: active || false,
      created: created || now.toString(),
      createdBy: createdBy || '',
      displayName: displayName || '',
      email: email || '',
      photoURL: photoURL || '',
      providerData: providerData || (email && [{
        email: email,
        providerId: 'password',
        uid: uid
      }]) || {},
      roles: roles || {
        undefinedRole
      },
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
          active: preparedUser.active || dbUser.active || false,
          created: preparedUser.created || dbUser.created,
          createdBy: preparedUser.createdBy || dbUser.createdBy,
          displayName: preparedUser.displayName || dbUser.displayName || '',
          email: preparedUser.email || dbUser.email,
          photoURL: preparedUser.photoURL || dbUser.photoURL || '',
          providerData: preparedUser.providerData || dbUser.providerData || [],
          roles: preparedUser.roles || dbUser.roles || {
            undefinedRole
          },
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
    return user.uid;
  }
}

exports.UserHelper = UserHelper;
exports.UNAUTHENTICATED = 'UNAUTHENTICATED';
