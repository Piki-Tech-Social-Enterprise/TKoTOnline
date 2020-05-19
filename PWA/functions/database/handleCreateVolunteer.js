const {
  UserHelper,
  UNAUTHENTICATED
} = require('../utilities');
const handleCreateVolunteer = async (snap, context) => {
  let userHelper;
  try {
    console.log(`handleCreateVolunteer.parameters: ${JSON.stringify({
      snap,
      context
    }, null, 2)}`);
    const dbVolunteer = await snap.val();
    const {
      active,
      created,
      createdBy,
      firstName,
      lastName,
      // details,
      phoneNumber,
      email,
      // providerData,
      // roles,
      vid,
      updated,
      updatedBy
    } = dbVolunteer;
    const displayName = `${firstName} ${lastName}`;
    const emailVerified = false;
    const password = ''; // TODO: Need a secure process
    const photoURL = null; // TODO: Need to capture
    const {
      auth,
      authType
    } = context;
    const authUserId = authType !== UNAUTHENTICATED
      ? auth.uid
      : UNAUTHENTICATED;
    userHelper = new UserHelper();
    const authUser = {
      disabled: active,
      displayName: displayName,
      email: email,
      emailVerified: emailVerified,
      password: password,
      phoneNumber: phoneNumber,
      photoURL: photoURL
    };
    console.log(JSON.stringify(authUser, null, 2));
    const savedAuthUser  = await userHelper.createAuthUser(authUser);
    console.log(`'${savedAuthUser.uid}' was successfully updated by '${authUserId}'`);
    const dbUser = {
      active: active,
      created: created,
      createdBy: createdBy,
      displayName: displayName,
      email: email,
      photoURL: photoURL,
      providerData: [
        {
          email: email,
          providerId: 'password',
          uid: savedAuthUser.uid
        }
      ],
      roles: {
        basicRole: 'basicRole'
      },
      uid: savedAuthUser.uid,
      updated: updated,
      updatedBy: updatedBy,
      vid: vid
    };
    console.log(JSON.stringify(dbUser, null, 2));
    const savedDbUser  = await userHelper.saveDbUser(dbUser);
    console.log(`'${savedDbUser.uid}' was successfully updated by '${authUserId}'`);
  } finally {
    userHelper = null;
  }
};

exports.handleCreateVolunteer = handleCreateVolunteer;
