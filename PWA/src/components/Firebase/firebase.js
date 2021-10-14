import firebaseApp from 'firebase/compat/app';
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
  ResourcesRepository,
  EconomicDevelopmentsRepository,
  CovidListRepository
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
    this.economicDevelopmentsRepository = new EconomicDevelopmentsRepository(firebaseApp);
    this.covidListRepository = new CovidListRepository(firebaseApp);
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
  getDbUsersAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.userRepository.getDbUsersAsArray(includeInactive, childName, childValue);
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
  getDbNewsFeedsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.newsFeedRepository.getDbNewsFeedsAsArray(includeInactive, childName, childValue);
  getDbNewsFeed = async nfid => await this.newsFeedRepository.getDbNewsFeed(nfid);
  getDbNewsFeedValue = async nfid => await this.newsFeedRepository.getDbNewsFeedValue(nfid);
  saveDbNewsFeed = async (newsFeed, saveDbNewsFeed_completed) => await this.newsFeedRepository.saveDbNewsFeed(newsFeed, saveDbNewsFeed_completed);
  deleteDbNewsFeed = async nfid => await this.newsFeedRepository.deleteDbNewsFeed(nfid);

  getDbCommunityLinks = async () => await this.communityLinksRepository.getDbCommunityLinks();
  getDbCommunityLinksAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.communityLinksRepository.getDbCommunityLinksAsArray(includeInactive, childName, childValue);
  getDbCommunityLink = async clid => await this.communityLinksRepository.getDbCommunityLinks(clid);
  getDbCommunityLinkValue = async clid => await this.communityLinksRepository.getDbCommunityLinkValue(clid);
  saveDbCommunityLink = async (communityLink, saveDbCommunityLink_completed) => await this.communityLinksRepository.saveDbCommunityLink(communityLink, saveDbCommunityLink_completed);
  deleteDbCommunityLink = async clid => await this.communityLinksRepository.deleteDbCommunityLink(clid);

  getDbSettings = async () => await this.settingsRepository.getDbSettings();
  getDbSetting = async sid => await this.settings.getDbSetting(sid);
  getDbSettingsValues = async (includeInactive = false, childName = 'active', childValue = true) => await this.settingsRepository.getDbSettingsValues(includeInactive);
  saveDbSettings = async (settings, saveDbSetting_completed) => await this.settingsRepository.saveDbSettings(settings, saveDbSetting_completed);

  getDbVolunteers = async () => await this.volunteersRepository.getDbVolunteers();
  getDbVolunteersAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.volunteersRepository.getDbVolunteersAsArray(includeInactive, childName, childValue);
  getDbVolunteer = async vid => await this.volunteersRepository.getDbVolunteer(vid);
  addDbVolunteerDetails = async (vid, details) => await this.volunteersRepository.addDbVolunteerDetails(vid, details);
  getDbVolunteerValue = async vid => await this.volunteersRepository.getDbVolunteerValue(vid);
  saveDbVolunteer = async (volunteer, saveDbVolunteer_completed) => await this.volunteersRepository.saveDbVolunteer(volunteer, saveDbVolunteer_completed);
  deleteDbVolunteer = async vid => await this.volunteersRepository.deleteDbVolunteer(vid);

  getDbContacts = async () => await this.contactRepository.getDbContacts();
  getDbContactsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.contactRepository.getDbContactsAsArray(includeInactive, childName, childValue);
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
  getDbEPanuiListAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.ePanuiListRepository.getDbEPanuiListAsArray(includeInactive, childName, childValue);
  getDbEPanui = async eid => await this.ePanuiListRepository.getDbEPanui(eid);
  getDbEPanuiValue = async eid => await this.ePanuiListRepository.getDbEPanuiValue(eid);
  saveDbEPanui = async (ePanui, saveDbEPanui_completed) => await this.ePanuiListRepository.saveDbEPanui(ePanui, saveDbEPanui_completed);
  deleteDbEPanui = async eid => await this.ePanuiListRepository.deleteDbEPanui(eid);

  getDbFacebookLinks = async () => await this.facebookLinksRepository.getDbFacebookLinks();
  getDbFacebookLinksAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.facebookLinksRepository.getDbFacebookLinksAsArray(includeInactive, childName, childValue);
  getDbFacebookLink = async fid => await this.facebookLinksRepository.getDbFacebookLink(fid);
  getDbFacebookLinksValue = async fid => await this.facebookLinksRepository.getDbFacebookLinksValue(fid);
  saveDbFacebookLink = async (facebookLink, saveDbFacebookLink_completed) => await this.facebookLinksRepository.saveDbFacebookLink(facebookLink, saveDbFacebookLink_completed);
  deleteDbFacebookLink = async fid => await this.facebookLinksRepository.deleteDbFacebookLink(fid);

  getDbEvents = async () => await this.eventsRepository.getDbEvents();
  getDbEventsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.eventsRepository.getDbEventsAsArray(includeInactive, childName, childValue);
  getDbEvent = async evid => await this.eventsRepository.getDbEvents(evid);
  getDbEventValue = async evid => await this.eventsRepository.getDbEventValue(evid);
  saveDbEvent = async (event, saveDbEvent_completed) => await this.eventsRepository.saveDbEvent(event, saveDbEvent_completed);
  deleteDbEvent = async evid => await this.eventsRepository.deleteDbEvent(evid);

  getDbProjects = async () => await this.projectsRepository.getDbProjects();
  getDbProjectsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.projectsRepository.getDbProjectsAsArray(includeInactive, childName, childValue);
  getDbProject = async pid => await this.projectsRepository.getDbProjects(pid);
  getDbProjectValue = async pid => await this.projectsRepository.getDbProjectValue(pid);
  saveDbProject = async (project, saveDbProject_completed) => await this.projectsRepository.saveDbProject(project, saveDbProject_completed);
  deleteDbProject = async pid => await this.projectsRepository.deleteDbProject(pid);

  getDbIwiMembers = async () => await this.iwiMembersRepository.getDbIwiMembers();
  getDbIwiMembersAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.iwiMembersRepository.getDbIwiMembersAsArray(includeInactive, childName, childValue);
  getDbIwiMember = async imid => await this.iwiMembersRepository.getDbIwiMembers(imid);
  getDbIwiMemberValue = async imid => await this.iwiMembersRepository.getDbIwiMemberValue(imid);
  saveDbIwiMember = async (iwiMember, saveDbIwiMember_completed) => await this.iwiMembersRepository.saveDbIwiMember(iwiMember, saveDbIwiMember_completed);
  deleteDbIwiMember = async imid => await this.iwiMembersRepository.deleteDbIwiMember(imid);

  getDbResources = async () => await this.resourcesRepository.getDbResources();
  getDbResourcesAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.resourcesRepository.getDbResourcesAsArray(includeInactive, childName, childValue);
  getDbResource = async rid => await this.resourcesRepository.getDbResources(rid);
  getDbResourceValue = async rid => await this.resourcesRepository.getDbResourceValue(rid);
  saveDbResource = async (resource, saveDbResource_completed) => await this.resourcesRepository.saveDbResource(resource, saveDbResource_completed);
  deleteDbResource = async rid => await this.resourcesRepository.deleteDbResource(rid);

  getDbEconomicDevelopments = async () => await this.economicDevelopmentsRepository.getDbEconomicDevelopments();
  getDbEconomicDevelopmentsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.economicDevelopmentsRepository.getDbEconomicDevelopmentsAsArray(includeInactive, childName, childValue);
  getDbEconomicDevelopment = async edid => await this.economicDevelopmentsRepository.getDbEconomicDevelopments(edid);
  getDbEconomicDevelopmentValue = async edid => await this.economicDevelopmentsRepository.getDbEconomicDevelopmentValue(edid);
  saveDbEconomicDevelopment = async (economicDevelopment, saveDbEconomicDevelopment_completed) => await this.economicDevelopmentsRepository.saveDbEconomicDevelopment(economicDevelopment, saveDbEconomicDevelopment_completed);
  deleteDbEconomicDevelopment = async edid => await this.economicDevelopmentsRepository.deleteDbEconomicDevelopment(edid);

  getDbCovidList = async () => await this.covidListRepository.getDbCovidList();
  getDbCovidListAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.covidListRepository.getDbCovidListAsArray(includeInactive, childName, childValue);
  getDbCovid = async cvid => await this.covidListRepository.getDbCovid(cvid);
  getDbCovidValue = async cvid => await this.covidListRepository.getDbCovidValue(cvid);
  saveDbCovid = async (covid, saveDbCovid_completed) => await this.covidListRepository.saveDbCovid(covid, saveDbCovid_completed);
  deleteDbCovid = async cvid => await this.covidListRepository.deleteDbCovid(cvid);
}

export default Firebase;
