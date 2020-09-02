import BaseRepository from './BaseRepository';
import 'firebase/auth';
import {
  undefinedRole
} from '../../Domains/Roles';
import swal from 'sweetalert2';
import {
  UserRepository,
  StorageRepository
} from '../Repositories';

class AuthenticationRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.auth = firebaseApp.auth();
    this.userRepository = new UserRepository(firebaseApp);
    this.emailAuthProvider = firebaseApp.auth.EmailAuthProvider;
    this.storageRepository = new StorageRepository(firebaseApp);
  }

  createUserWithEmailAndPassword = async (
    email,
    password,
    role,
    displayName,
    createUserWithEmailAndPassword_Completed
  ) => {
    const authUser = await this.auth.createUserWithEmailAndPassword(email, password);
    const {
      uid,
      providerData
    } = authUser.user;
    const now = new Date();
    this.sendEmailVerification();
    this.userRepository.saveDbUser({
      active: true,
      created: now.toString(),
      createdBy: uid,
      displayName: displayName || '',
      email: email,
      emailVerified: false,
      isNew: true,
      photoURL: '',
      providerData: providerData,
      roles: {
        [role]: role
      },
      uid: uid,
      updated: now.toString(),
      updatedBy: uid
    }, createUserWithEmailAndPassword_Completed);
    return authUser;
  };

  updateProfile = async profile => {
    return await this.auth.currentUser.updateProfile(profile);
  };

  signInWithEmailAndPassword = async (email, password) => {
    return await this.auth.signInWithEmailAndPassword(email, password);
  };

  signOut = async () => {
    console.log(`Current User: ${this.auth.currentUser}`);
    return await this.auth.signOut();
  };

  sendPasswordResetEmail = async email => {
    return await this.auth.sendPasswordResetEmail(email);
  };

  sendEmailVerification = async () => {
    return await this.auth.currentUser.sendEmailVerification();
    /* return await this.auth.currentUser.sendEmailVerification({
        url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    }); */
  };

  reauthenticate = async currentPassword => {
    const user = this.auth.currentUser,
      userCredentials = await this.emailAuthProvider.credential(
        user.email,
        currentPassword
      );
    return await user.reauthenticateWithCredential(userCredentials);
  };

  getUserCredentials = async providerId => {
    let result = null,
      errorMessage = null;
    try {
      if (providerId === 'password') {
        result = await swal.fire({
          title: 'Current Password',
          input: 'password',
          inputPlaceholder: 'Enter your current password',
          showCancelButton: true,
          footer: 'Need to verify your credentials before continuing...'
        });
        if (result.isConfirmed) {
          return await this.reauthenticate(result.value);
        }
      }
    } catch (error) {
      errorMessage = error.message;
    }
    if (errorMessage) {
      console.log('Get User Credentials Error: ', errorMessage);
      return errorMessage;
    }
  };

  changeEmail = async e => {
    e.preventDefault();
    const user = this.auth.currentUser,
      { uid } = user;
    let result = null,
      newEmail = null,
      errorMessage = null;
    try {
      const user = this.auth.currentUser,
        providerId = user.providerData[0].providerId,
        userCredentials = await this.getUserCredentials(providerId);
      console.log(`userCredentials: ${userCredentials}`);
      if (
        userCredentials &&
        typeof userCredentials !== 'string' &&
        userCredentials.user
      ) {
        result = await swal.fire({
          title: 'Change Email',
          input: 'email',
          inputPlaceholder: 'Enter your new email',
          showCancelButton: true
        });
        newEmail = result.value;
        if (newEmail) {
          try {
            await user.updateEmail(newEmail);
            if (!user.emailVerified) {
              await user.sendEmailVerification();
              await this.userRepository.saveDbUser({
                uid: uid,
                email: newEmail,
                updatedBy: uid
              });
              await this.signOut();
              await swal.fire({
                icon: 'success',
                title: 'Change Email Successful',
                text: 'Please verify your email to login.'
              });
              return;
            }
          } catch (error) {
            errorMessage =
              'Unable to update your email to <b>' +
              newEmail +
              '</b>. Reason: ' +
              error.message;
          }
        }
      } else {
        errorMessage = userCredentials;
      }
    } catch (error) {
      errorMessage = error.message;
    }
    if (errorMessage) {
      swal.fire({
        icon: 'error',
        title: 'Change Email Error',
        html: errorMessage
      });
      console.log('Change Email Error: ', errorMessage);
    }
  };

  changePassword = async e => {
    e.preventDefault();
    let result = null,
      newPassword = null,
      confirmPassword = null,
      errorMessage = null;
    try {
      const user = this.auth.currentUser,
        providerId = user.providerData[0].providerId,
        userCredentials = await this.getUserCredentials(providerId);
      console.log(`userCredentials: ${userCredentials}`);
      if (
        userCredentials &&
        typeof userCredentials !== 'string' &&
        userCredentials.user
      ) {
        result = await swal.fire({
          title: 'New Password',
          input: 'password',
          inputPlaceholder: 'Enter your new password',
          showCancelButton: true
        });
        newPassword = result.value;
        result = await swal.fire({
          title: 'Confirm Password',
          input: 'password',
          inputPlaceholder: 'Re-enter your new password',
          showCancelButton: true
        });
        confirmPassword = result.value;
        if (newPassword && confirmPassword && newPassword === confirmPassword) {
          try {
            await this.updatePassword(newPassword);
            await this.signOut();
            await swal.fire({
              icon: 'success',
              title: 'Change Password Successful',
              text: 'Please login again to confirm your new password.'
            });
            return;
          } catch (error) {
            errorMessage =
              'Unable to update your password to <b>' +
              newPassword +
              '</b>. Reason: ' +
              error.message;
          }
        } else {
          errorMessage = 'New Password does not match Confirm Password.';
        }
      } else {
        errorMessage = userCredentials;
      }
    } catch (error) {
      errorMessage = error.message;
    }
    if (errorMessage) {
      swal.fire({
        icon: 'error',
        title: 'Change Password Error',
        html: errorMessage
      });
      console.log('Change Password Error: ', errorMessage);
    }
  };

  updatePassword = async password => {
    return await this.auth.currentUser.updatePassword(password);
  };

  authUserListener = async (next, fallback) => {
    return await this.auth.onAuthStateChanged(async authUser => {
      if (authUser) {
        const dbUser = await this.userRepository.getDbUserValue(authUser.uid);
        if (dbUser && !dbUser.roles) {
          dbUser.roles = {
            undefinedRole
          };
        }
        // console.log(`{ dbUser, authUser }: ${JSON.stringify({ dbUser, authUser }, null, 2)}`);
        const {
          uid: dbUserUid,
          emailVerified: dbUserEmailVerified,
          photoURL: dbUserPhotoURL,
          ...dbUserRest
        } = dbUser;
        const {
          uid: authUserUid,
          email: authUserEmail,
          emailVerified: authUserEmailVerified,
          providerData: authUserProviderData,
          photoURL: authUserPhotoURL
        } = authUser;
        const combinedUser = {
          uid: authUserUid,
          email: authUserEmail,
          emailVerified: authUserEmailVerified,
          providerData: authUserProviderData,
          photoURL: authUserPhotoURL,
          ...dbUserRest
        };
        if (!dbUserEmailVerified && authUserEmailVerified) {
          await this.userRepository.saveDbUser({
            emailVerified: true,
            photoURL: dbUserPhotoURL || authUserPhotoURL || '',
            uid: dbUserUid
          });
          combinedUser.emailVerified = true;
        }
        // console.log(`combinedUser: ${JSON.stringify(combinedUser, null, 2)}`);
        next(combinedUser);
      } else {
        fallback();
      }
    });
  };

  deleteAccount = async e => {
    e.preventDefault();
    let result = null;
    let errorMessage = null;
    try {
      result = await swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'You won\'t be able to undo this!',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-outline-danger',
          cancelButton: 'btn btn-outline-link'
        }
      });
      if (result.isConfirmed) {
        const {
          currentUser
        } = this.auth;
        const {
          providerId
        } = currentUser.providerData[0];
        const userCredentials = await this.getUserCredentials(providerId);
        if (typeof userCredentials === 'string') {
          errorMessage = userCredentials;
        } else {
          const {
            user
          } = userCredentials;
          const {
            uid
          } = user;
          if (providerId === 'password') {
            const userPhotoFolderUrl = `/images/users/${uid}`;
            const storageFiles = await this.storageRepository.getStorageFiles(userPhotoFolderUrl);
            await Promise.all(storageFiles.items.map(async storageFileItem => await storageFileItem.delete()));
          }
          await this.userRepository.deleteDbUser(uid);
          await user.delete();
          await this.signOut();
          swal.fire({
            icon: 'success',
            title: 'Delete Account Successful',
            text: 'Your account has been deleted.'
          });
        }
      }
    } catch (error) {
      errorMessage = error.message;
      console.log(`Delete Account Error: ${errorMessage}`);
    }
    if (errorMessage) {
      swal.fire({
        icon: 'error',
        title: 'Delete Account Error',
        html: errorMessage
      });
    }
  };
}

export default AuthenticationRepository;
