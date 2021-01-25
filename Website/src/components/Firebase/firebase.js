import firebaseApp from 'firebase/app';
import {
  StorageRepository,
  NewsFeedRepository,
  CommunityLinksRepository,
  SettingsRepository,
  VolunteersRepository,
  ContactRepository,
  FunctionsRepository,
  FacebookLinksRepository,
  EventsRepository,
  ProjectsRepository,
  IwiMembersRepository,
  EPanuiListRepository,
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
    this.storageRepository = new StorageRepository(firebaseApp);
    this.newsFeedRepository = new NewsFeedRepository(firebaseApp);
    this.communityLinksRepository = new CommunityLinksRepository(firebaseApp);
    this.settingsRepository = new SettingsRepository(firebaseApp);
    this.volunteersRepository = new VolunteersRepository(firebaseApp);
    this.contactRepository = new ContactRepository(firebaseApp);
    this.functionsRepository = new FunctionsRepository(firebaseApp);
    this.facebookLinkRepository = new FacebookLinksRepository(firebaseApp);
    this.eventsRepository = new EventsRepository(firebaseApp);
    this.projectsRepository = new ProjectsRepository(firebaseApp);
    this.iwiMembersRepository = new IwiMembersRepository(firebaseApp);
    this.ePanuiListRepository = new EPanuiListRepository(firebaseApp);
    this.resourcesRepository = new ResourcesRepository(firebaseApp);
    this.economicDevelopmentsRepository = new EconomicDevelopmentsRepository(firebaseApp);
    this.covidListRepository = new CovidListRepository(firebaseApp);
  }

  getStorageFileRef = path => this.storageRepository.getStorageFileRef(path);
  getStorageFileDownloadURL = async path => await this.storageRepository.getStorageFileDownloadURL(path);
  saveStorageFile = async (path, file) => await this.storageRepository.saveStorageFile(path, file);
  deleteStorageFile = async path => await this.storageRepository.deleteStorageFile(path);
  getStorageFiles = async (path, listOptions) => await this.storageRepository.getStorageFiles(path, listOptions);
  getDbNewsFeeds = async () => await this.newsFeedRepository.getDbNewsFeeds();
  getDbNewsFeedsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => await this.newsFeedRepository.getDbNewsFeedsAsArray(includeInactive, childName, childValue, topLimit);
  getDbNewsFeed = async nfid => await this.newsFeedRepository.getDbNewsFeed(nfid);
  getDbNewsFeedValue = async nfid => await this.newsFeedRepository.getDbNewsFeedValue(nfid);
  saveDbNewsFeed = async (newsFeed, saveDbNewsFeed_completed) => await this.newsFeedRepository.saveDbNewsFeed(newsFeed, saveDbNewsFeed_completed);
  deleteDbNewsFeed = async nfid => await this.newsFeedRepository.deleteDbNewsFeed(nfid);
  getDbCommunityLinks = async () => await this.communityLinksRepository.getDbCommunityLinks();
  getDbCommunityLinksAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.communityLinksRepository.getDbCommunityLinksAsArray(includeInactive, childName, childValue);
  getDbSettings = async () => await this.settingsRepository.getDbSettings();
  getDbSettingValue = async sid => await this.settingsRepository.getDbSettingValue(sid);
  getDbSettingsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.settingsRepository.getDbSettingsAsArray(includeInactive, childName, childValue);
  getDbCommunityLinkValue = async sid => await this.settingsRepository.getDbCommunityLinkValue(sid);
  getDbSettingsValues = async (includeInactive = false, childName = 'active', childValue = true) => await this.settingsRepository.getDbSettingsValues(includeInactive, childName, childValue);
  getDbVolunteers = async () => await this.volunteersRepository.getDbVolunteers();
  getDbVolunteer = async (vid) => await this.volunteersRepository.getDbVolunteer(vid);
  getDbVolunteersAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.volunteersRepository.getDbVolunteersAsArray(includeInactive, childName, childValue);
  saveDbVolunteer = async (volunteer, saveDbVolunteer_completed) => await this.volunteersRepository.saveDbVolunteer(volunteer, saveDbVolunteer_completed);
  saveDbContact = async (contact, saveDbContact_completed) => await this.contactRepository.saveDbContact(contact, saveDbContact_completed);
  getAsync = async (options, config) => await this.functionsRepository.getAsync(options, config);
  postAsync = async options => await this.functionsRepository.postAsync(options);
  putAsync = async options => await this.functionsRepository.putAsync(options);
  call = async options => await this.functionsRepository.call(options);
  getDbFacebookLinks = async () => await this.facebookLinkRepository.getDbFacebookLinks();
  getDbFacebookLinksAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.facebookLinkRepository.getDbFacebookLinksAsArray(includeInactive, childName, childValue);
  getDbFacebookLink = async fid => await this.facebookLinkRepository.getDbFacebookLink(fid);
  getDbFacebookLinksValue = async fid => await this.facebookLinkRepository.getDbFacebookLinksValue(fid);
  getDbEvents = async () => await this.eventsRepository.getDbEvents();
  getDbEventsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.eventsRepository.getDbEventsAsArray(includeInactive, childName, childValue);
  getDbEventValue = async evid => await this.eventsRepository.getDbEventValue(evid);
  getDbProjectsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.projectsRepository.getDbProjectsAsArray(includeInactive, childName, childValue);
  getDbProjectValue = async pid => await this.projectsRepository.getDbProjectValue(pid);
  getDbIwiMembers = async () => await this.iwiMembersRepository.getDbIwiMembers();
  getDbIwiMembersAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.iwiMembersRepository.getDbIwiMembersAsArray(includeInactive, childName, childValue);
  getDbIwiMember = async imid => await this.iwiMembersRepository.getDbIwiMember(imid);
  getDbIwiMemberValue = async imid => await this.iwiMembersRepository.getDbIwiMemberValue(imid);
  getDbEPanui = async () => await this.ePanuiListRepository.getDbEPanui();
  getDbEPanuiListAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN) => await this.ePanuiListRepository.getDbEPanuiListAsArray(includeInactive, childName, childValue, topLimit);
  getDbEPanuiValue = async eid => await this.ePanuiListRepository.getDbEPanuiValue(eid);
  getDbResourcesAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.resourcesRepository.getDbResourcesAsArray(includeInactive, childName, childValue);
  getDbResourceValue = async rid => await this.resourcesRepository.getDbResourceValue(rid);
  getDbEconomicDevelopmentsAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.economicDevelopmentsRepository.getDbEconomicDevelopmentsAsArray(includeInactive, childName, childValue);
  getDbEconomicDevelopmentValue = async edid => await this.economicDevelopmentsRepository.getDbEconomicDevelopmentValue(edid);
  getDbCovidListAsArray = async (includeInactive = false, childName = 'active', childValue = true) => await this.covidListRepository.getDbCovidListAsArray(includeInactive, childName, childValue);
  getDbCovidValue = async cvid => await this.covidListRepository.getDbCovidValue(cvid);
}

export default Firebase;
