import * as firebaseApp from 'firebase/app';
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
  SolutionsRepository
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
    this.communityLinkRepository = new CommunityLinksRepository(firebaseApp);
    this.settingsRepository = new SettingsRepository(firebaseApp);
    this.volunteersRepository = new VolunteersRepository(firebaseApp);
    this.contactRepository = new ContactRepository(firebaseApp);
    this.functionsRepository = new FunctionsRepository(firebaseApp);
    this.facebookLinkRepository = new FacebookLinksRepository(firebaseApp);
    this.eventsRepository = new EventsRepository(firebaseApp);
    this.solutionsRepository = new SolutionsRepository(firebaseApp);
  }

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
  getDbCommunityLinks = async () => await this.communityLinkRepository.getDbCommunityLinks();
  getDbCommunityLinksAsArray = async includeInactive => await this.communityLinkRepository.getDbCommunityLinksAsArray(includeInactive);
  getDbSettings = async () => await this.settingsRepository.getDbSettings();
  getDbSettingValue = async sid => await this.settingsRepository.getDbSettingValue(sid);
  getDbSettingsAsArray = async includeInactive => await this.settingsRepository.getDbSettingsAsArray(includeInactive);
  getDbCommunityLinkValue = async sid => await this.settingsRepository.getDbCommunityLinkValue(sid);
  getDbSettingsValues = async includeInactive => await this.settingsRepository.getDbSettingsValues(includeInactive);
  getDbVolunteers = async () => await this.volunteersRepository.getDbVolunteers();
  getDbVolunteer = async (vid) => await this.volunteersRepository.getDbVolunteer(vid);
  getDbVolunteersAsArray = async includeInactive => await this.volunteersRepository.getDbVolunteersAsArray(includeInactive);
  saveDbVolunteer = async (volunteer, saveDbVolunteer_completed) => await this.volunteersRepository.saveDbVolunteer(volunteer, saveDbVolunteer_completed);
  saveDbContact = async (contact, saveDbContact_completed) => await this.contactRepository.saveDbContact(contact, saveDbContact_completed);
  getAsync = async (options, config) => await this.functionsRepository.getAsync(options, config);
  postAsync = async options => await this.functionsRepository.postAsync(options);
  putAsync = async options => await this.functionsRepository.putAsync(options);
  call = async options => await this.functionsRepository.call(options);
  getDbFacebookLinks = async () => await this.facebookLinkRepository.getDbFacebookLinks();
  getDbFacebookLinksAsArray = async includeInactive => await this.facebookLinkRepository.getDbFacebookLinksAsArray(includeInactive);
  getDbFacebookLink = async fid => await this.facebookLinkRepository.getDbFacebookLink(fid);
  getDbFacebookLinkValue = async fid => await this.facebookLinkRepository.getDbFacebookLinkValue(fid);
  getDbEvents = async () => await this.eventsRepository.getDbEvents();
  getDbEventsAsArray = async includeInactive => await this.eventsRepository.getDbEventsAsArray(includeInactive);
  getDbSolutions = async () => await this.solutionsRepository.getDbSolutions();
  getDbSolutionsAsArray = async includeInactive => await this.solutionsRepository.getDbSolutionsAsArray(includeInactive);
}

export default Firebase;
