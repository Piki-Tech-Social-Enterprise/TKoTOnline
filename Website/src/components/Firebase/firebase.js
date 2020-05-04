import * as firebaseApp from 'firebase/app';
import {
  StorageRepository,
  NewsFeedRepository,
  CommunityLinksRepository,
  SettingsRepository
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
  getDbCommunityLink = async clid => await this.communityLinkRepository.getDbCommunityLinks(clid);
  getDbCommunityLinkValue = async clid => await this.communityLinkRepository.getDbCommunityLinkValue(clid);
  saveDbCommunityLink = async (communityLink, saveDbCommunityLink_completed) => await this.communityLinkRepository.saveDbCommunityLink(communityLink, saveDbCommunityLink_completed);
  deleteDbCommunityLink = async clid => await this.communityLinkRepository.deleteDbCommunityLink(clid);
  getDbSettings = async () => await this.settingsRepository.getDbSettings();
  getDbSettingValue = async sid => await this.settingsRepository.getDbSettingValue(sid);
  getDbSettingsAsArray = async includeInactive => await this.settingsRepository.getDbSettingsAsArray(includeInactive);
  getDbCommunityLinkValue = async sid => await this.settingsRepository.getDbCommunityLinkValue(sid);
  getDbSettingsValues = async includeInactive => await this.settingsRepository.getDbSettingsValues(includeInactive);
}

export default Firebase;