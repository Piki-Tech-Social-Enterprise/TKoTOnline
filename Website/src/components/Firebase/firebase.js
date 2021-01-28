import React, {
  useState,
  useEffect
} from 'react';
import MasterFirebaseConfig from './Config/MasterFirebaseConfig';

const INITIAL_STATE = {
  isLoading: true,
  firebase: null
};
const Firebase = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading,
    firebase
  } = state;
  useEffect(() => {
    const setup = async () => {
      const {
        firebaseConfigOverride
      } = props;
      const {
        default: firebaseApp
      } = await import('firebase/app');
      const initialisedFirebaseApp = firebaseApp.apps.length
        ? firebaseApp.app()
        : firebaseApp.initializeApp(firebaseConfigOverride || MasterFirebaseConfig);
      const {
        default: initStorage
      } = await import('./Repositories/initStorage');
      const storage = await initStorage(initialisedFirebaseApp);
      const {
        default: initNewsFeed
      } = await import('./Repositories/initNewsFeed');
      const newsFeed = await initNewsFeed(initialisedFirebaseApp);
      const {
        default: initSettings
      } = await import('./Repositories/initSettings');
      const settings = await initSettings(initialisedFirebaseApp);
      const {
        default: initContact
      } = await import('./Repositories/initContact');
      const contact = await initContact(initialisedFirebaseApp);
      const {
        default: initIwiMembers
      } = await import('./Repositories/initIwiMembers');
      const iwiMembers = await initIwiMembers(initialisedFirebaseApp);
      const {
        default: initCovidList
      } = await import('./Repositories/initCovidList');
      const covidList = await initCovidList(initialisedFirebaseApp);
      const {
        default: initEconomicDevelopments
      } = await import('./Repositories/initEconomicDevelopments');
      const economicDevelopments = await initEconomicDevelopments(initialisedFirebaseApp);
      const {
        default: initProjects
      } = await import('./Repositories/initProjects');
      const projects = await initProjects(initialisedFirebaseApp);
      const {
        default: initEvents
      } = await import('./Repositories/initEvents');
      const events = await initEvents(initialisedFirebaseApp);
      const {
        default: initResources
      } = await import('./Repositories/initResources');
      const resources = await initResources(initialisedFirebaseApp);
      const {
        default: initFacebookLinks
      } = await import('./Repositories/initFacebookLinks');
      const facebookLinks = await initFacebookLinks(initialisedFirebaseApp);
      const firebase = {
        app: initialisedFirebaseApp,
        storageRepository: storage,
        newsFeedRepository: newsFeed,
        settingsRepository: settings,
        contactRepository: contact,
        iwiMembersRepository: iwiMembers,
        covidListRepository: covidList,
        economicDevelopmentsRepository: economicDevelopments,
        projectsRepository: projects,
        eventsRepository: events,
        resourcesRepository: resources,
        facebookLinkRepository: facebookLinks
      };
      setState(s => ({
        ...s,
        isLoading: false,
        firebase
      }));
    };
    if (isLoading) {
      setup();
    }
    return () => { };
  }, [props, isLoading]);
  return <>
    {
      isLoading
        ? null
        : props.children(firebase)
    }
  </>;
};

export default Firebase;
