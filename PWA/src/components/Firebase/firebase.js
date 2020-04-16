import * as firebaseApp from 'firebase/app';
import {
  AuthenticationRepository,
  UserRepository,
  StorageRepository
} from './Repositories';
import MasterFirebaseConfig from './Config/MasterFirebaseConfig';

class Firebase {
  constructor(firebaseConfigOverride) {
    console.log(`MasterFirebaseConfig: ${JSON.stringify(MasterFirebaseConfig, null, 2)}`);
    this.app = firebaseApp.apps.length
      ? firebaseApp.app()
      : firebaseApp.initializeApp(firebaseConfigOverride || MasterFirebaseConfig);
    this.authenticationRepository = new AuthenticationRepository(firebaseApp);
    this.userRepository = new UserRepository(firebaseApp);
    this.storageRepository = new StorageRepository(firebaseApp);
  }

  createUserWithEmailAndPassword = async (email, password, role, displayName, createUserWithEmailAndPassword_Completed) => this.authenticationRepository.createUserWithEmailAndPassword(email, password, role, displayName, createUserWithEmailAndPassword_Completed);
  updateProfile = async (profile) => await this.authenticationRepository.updateProfile(profile);
  signInWithEmailAndPassword = async (email, password) => await this.authenticationRepository.signInWithEmailAndPassword(email, password);
  signOut = async () => await this.authenticationRepository.signOut();
  sendPasswordResetEmail = async email => await this.authenticationRepository.sendPasswordResetEmail(email);
  sendEmailVerification = async () => await this.authenticationRepository.sendEmailVerification();
  reauthenticate = async currentPassword => await this.authenticationRepository.reauthenticate(currentPassword);
  getUserCredentials = async providerId => await this.authenticationRepository.getUserCredentials(providerId);
  changeEmail = async e => await this.authenticationRepository.changeEmail(e);
  changePassword = async e => await this.authenticationRepository.changePassword(e);
  updatePassword = async password => await this.authenticationRepository.updatePassword(password);
  authUserListener = async (next, fallback) => await this.authenticationRepository.authUserListener(next, fallback);
  deleteAccount = async e => await this.authenticationRepository.deleteAccount(e);
  getDbUsers = async () => await this.userRepository.getDbUsers();
  getDbUser = async uid => await this.userRepository.getDbUser(uid);
  getDbUserValue = async uid => await this.userRepository.getDbUserValue(uid);
  saveDbUser = async (user, saveDbUser_completed) => await this.userRepository.saveDbUser(user, saveDbUser_completed);
  deleteDbUser = async uid => await this.userRepository.deleteDbUser(uid);
  getStorageFileRef = path => this.storageRepository.getStorageFileRef(path);
  getStorageFileDownloadURL = async path => await this.storageRepository.getStorageFileDownloadURL(path);
  saveStorageFile = async (path, file) => await this.storageRepository.saveStorageFile(path, file);
  deleteStorageFile = async path => await this.storageRepository.deleteStorageFile(path);
}

export default Firebase;