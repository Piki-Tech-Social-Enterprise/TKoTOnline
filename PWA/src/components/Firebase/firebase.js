import firebaseApp from 'firebase/app';
import {
  AuthenticationRepository,
  UserRepository,
  StorageRepository,
  NewsFeedRepository,
  CommunityLinksRepository,
  SettingsRepository,
  VolunteersRepository,
  ContactRepository,
  FunctionsRepository,
  EPanuiListRepository,
  FacebookLinksRepository,
  EventsRepository,
  ProjectsRepository,
  IwiMembersRepository,
  ResourcesRepository
} from './Repositories';
import MasterFirebaseConfig from './Config/MasterFirebaseConfig';

class Firebase {
  constructor(firebaseConfigOverride) {
    // console.log(`MasterFirebaseConfig: ${JSON.stringify(MasterFirebaseConfig, null, 2)}`);
    this.app = firebaseApp.apps.length
      ? firebaseApp.app()
      : firebaseApp.initializeApp(firebaseConfigOverride || MasterFirebaseConfig);
    this.authenticationRepository = new AuthenticationRepository(firebaseApp);
    this.userRepository = new UserRepository(firebaseApp);
    this.storageRepository = new StorageRepository(firebaseApp);
    this.newsFeedRepository = new NewsFeedRepository(firebaseApp);
    this.communityLinksRepository = new CommunityLinksRepository(firebaseApp);
    this.settingsRepository = new SettingsRepository(firebaseApp);
    this.volunteersRepository = new VolunteersRepository(firebaseApp);
    this.contactRepository = new ContactRepository(firebaseApp);
    this.functionsRepository = new FunctionsRepository(firebaseApp);
    this.ePanuiListRepository = new EPanuiListRepository(firebaseApp);
    this.facebookLinksRepository = new FacebookLinksRepository(firebaseApp);
    this.eventsRepository = new EventsRepository(firebaseApp);
    this.projectsRepository = new ProjectsRepository(firebaseApp);
    this.iwiMembersRepository = new IwiMembersRepository(firebaseApp);
    this.resourcesRepository = new ResourcesRepository(firebaseApp);
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
  getDbUsersAsArray = async includeInactive => await this.userRepository.getDbUsersAsArray(includeInactive);
  getDbUser = async uid => await this.userRepository.getDbUser(uid);
  updateUserOnboarding = async uid => await this.userRepository.updateUserOnboarding(uid);
  getDbUserValue = async uid => await this.userRepository.getDbUserValue(uid);
  saveDbUser = async (user, saveDbUser_completed) => await this.userRepository.saveDbUser(user, saveDbUser_completed);
  deleteDbUser = async uid => await this.userRepository.deleteDbUser(uid);
  getStorageFileRef = path => this.storageRepository.getStorageFileRef(path);
  getStorageFileDownloadURL = async path => await this.storageRepository.getStorageFileDownloadURL(path);
  saveStorageFile = async (path, file) => await this.storageRepository.saveStorageFile(path, file);
  deleteStorageFile = async path => await this.storageRepository.deleteStorageFile(path);
  getStorageFiles = async (path, listOptions) => await this.storageRepository.getStorageFiles(path, listOptions);
  getDbNewsFeeds = async () => await this.newsFeedRepository.getDbNewsFeeds();
  getDbNewsFeedsAsArray = async includeInactive => await this.newsFeedRepository.getDbNewsFeedsAsArray(includeInactive);
  getDbNewsFeed = async nfid => await this.newsFeedRepository.getDbNewsFeed(nfid);
  getDbNewsFeedValue = async nfid => await this.newsFeedRepository.getDbNewsFeedValue(nfid);
  saveDbNewsFeed = async (newsFeed, saveDbNewsFeed_completed) => await this.newsFeedRepository.saveDbNewsFeed(newsFeed, saveDbNewsFeed_completed);
  deleteDbNewsFeed = async nfid => await this.newsFeedRepository.deleteDbNewsFeed(nfid);

  getDbCommunityLinks = async () => await this.communityLinksRepository.getDbCommunityLinks();
  getDbCommunityLinksAsArray = async includeInactive => await this.communityLinksRepository.getDbCommunityLinksAsArray(includeInactive);
  getDbCommunityLink = async clid => await this.communityLinksRepository.getDbCommunityLinks(clid);
  getDbCommunityLinkValue = async clid => await this.communityLinksRepository.getDbCommunityLinkValue(clid);
  saveDbCommunityLink = async (communityLink, saveDbCommunityLink_completed) => await this.communityLinksRepository.saveDbCommunityLink(communityLink, saveDbCommunityLink_completed);
  deleteDbCommunityLink = async clid => await this.communityLinksRepository.deleteDbCommunityLink(clid);

  getDbSettings = async () => await this.settingsRepository.getDbSettings();
  getDbSetting = async sid => await this.settings.getDbSetting(sid);
  getDbSettingsValues = async includeInactive => await this.settingsRepository.getDbSettingsValues(includeInactive);
  saveDbSettings = async (settings, saveDbSetting_completed) => await this.settingsRepository.saveDbSettings(settings, saveDbSetting_completed);

  getDbVolunteers = async () => await this.volunteersRepository.getDbVolunteers();
  getDbVolunteersAsArray = async includeInactive => await this.volunteersRepository.getDbVolunteersAsArray(includeInactive);
  getDbVolunteer = async vid => await this.volunteersRepository.getDbVolunteer(vid);
  addDbVolunteerDetails = async (vid, details) => await this.volunteersRepository.addDbVolunteerDetails(vid, details);
  getDbVolunteerValue = async vid => await this.volunteersRepository.getDbVolunteerValue(vid);
  saveDbVolunteer = async (volunteer, saveDbVolunteer_completed) => await this.volunteersRepository.saveDbVolunteer(volunteer, saveDbVolunteer_completed);
  deleteDbVolunteer = async vid => await this.volunteersRepository.deleteDbVolunteer(vid);

  getDbContacts = async () => await this.contactRepository.getDbContacts();
  getDbContactsAsArray = async includeInactive => await this.contactRepository.getDbContactsAsArray(includeInactive);
  getDbContact = async cid => await this.contactRepository.getDbContact(cid);
  getDbContactValue = async cid => await this.contactRepository.getDbContactValue(cid);
  saveDbContact = async (contact, saveDbContact_completed) => await this.contactRepository.saveDbContact(contact, saveDbContact_completed);
  deleteDbContact = async cid => await this.contactRepository.deleteDbContact(cid);

  getAsync = async (options, config) => await this.functionsRepository.getAsync(options, config);
  postAsync = async options => await this.functionsRepository.postAsync(options);
  putAsync = async options => await this.functionsRepository.putAsync(options);
  deleteAsync = async options => await this.functionsRepository.deleteAsync(options);
  call = async options => await this.functionsRepository.call(options);

  getDbEPanuiList = async () => await this.ePanuiListRepository.getDbEPanuiList();
  getDbEPanuiListAsArray = async includeInactive => await this.ePanuiListRepository.getDbEPanuiListAsArray(includeInactive);
  getDbEPanui = async eid => await this.ePanuiListRepository.getDbEPanui(eid);
  getDbEPanuiValue = async eid => await this.ePanuiListRepository.getDbEPanuiValue(eid);
  saveDbEPanui = async (ePanui, saveDbEPanui_completed) => await this.ePanuiListRepository.saveDbEPanui(ePanui, saveDbEPanui_completed);
  deleteDbEPanui = async eid => await this.ePanuiListRepository.deleteDbEPanui(eid);

  getDbFacebookLinks = async () => await this.facebookLinksRepository.getDbFacebookLinks();
  getDbFacebookLinksAsArray = async includeInactive => await this.facebookLinksRepository.getDbFacebookLinksAsArray(includeInactive);
  getDbFacebookLink = async fid => await this.facebookLinksRepository.getDbFacebookLinks(fid);
  getDbFacebookLinkValue = async fid => await this.facebookLinksRepository.getDbFacebookLinkValue(fid);
  saveDbFacebookLink = async (facebookLink, saveDbFacebookLink_completed) => await this.facebookLinksRepository.saveDbFacebookLink(facebookLink, saveDbFacebookLink_completed);
  deleteDbFacebookLink = async fid => await this.facebookLinksRepository.deleteDbFacebookLink(fid);

  getDbEvents = async () => await this.eventsRepository.getDbEvents();
  getDbEventsAsArray = async includeInactive => await this.eventsRepository.getDbEventsAsArray(includeInactive);
  getDbEvent = async evid => await this.eventsRepository.getDbEvents(evid);
  getDbEventValue = async evid => await this.eventsRepository.getDbEventValue(evid);
  saveDbEvent = async (event, saveDbEvent_completed) => await this.eventsRepository.saveDbEvent(event, saveDbEvent_completed);
  deleteDbEvent = async evid => await this.eventsRepository.deleteDbEvent(evid);

  getDbProjects = async () => await this.projectsRepository.getDbProjects();
  getDbProjectsAsArray = async includeInactive => await this.projectsRepository.getDbProjectsAsArray(includeInactive);
  getDbProject = async pid => await this.projectsRepository.getDbProjects(pid);
  getDbProjectValue = async pid => await this.projectsRepository.getDbProjectValue(pid);
  saveDbProject = async (project, saveDbProject_completed) => await this.projectsRepository.saveDbProject(project, saveDbProject_completed);
  deleteDbProject = async pid => await this.projectsRepository.deleteDbProject(pid);

  getDbIwiMembers = async () => await this.iwiMembersRepository.getDbIwiMembers();
  getDbIwiMembersAsArray = async includeInactive => await this.iwiMembersRepository.getDbIwiMembersAsArray(includeInactive);
  getDbIwiMember = async imid => await this.iwiMembersRepository.getDbIwiMembers(imid);
  getDbIwiMemberValue = async imid => await this.iwiMembersRepository.getDbIwiMemberValue(imid);
  saveDbIwiMember = async (iwiMember, saveDbIwiMember_completed) => await this.iwiMembersRepository.saveDbIwiMember(iwiMember, saveDbIwiMember_completed);
  deleteDbIwiMember = async imid => await this.iwiMembersRepository.deleteDbIwiMember(imid);

  getDbResources = async () => await this.resourcesRepository.getDbResources();
  getDbResourcesAsArray = async includeInactive => await this.resourcesRepository.getDbResourcesAsArray(includeInactive);
  getDbResource = async rid => await this.resourcesRepository.getDbResources(rid);
  getDbResourceValue = async rid => await this.resourcesRepository.getDbResourceValue(rid);
  saveDbResource = async (resource, saveDbResource_completed) => await this.resourcesRepository.saveDbResource(resource, saveDbResource_completed);
  deleteDbResource = async rid => await this.resourcesRepository.deleteDbResource(rid);
}

export default Firebase;