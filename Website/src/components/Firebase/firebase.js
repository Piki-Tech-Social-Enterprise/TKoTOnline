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
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'firebase-app' */'firebase/compat/app');
      const initialisedFirebaseApp = firebaseApp.apps.length
        ? firebaseApp.app()
        : firebaseApp.initializeApp(firebaseConfigOverride || MasterFirebaseConfig);
      const {
        default: initStorage
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'repositories-storage' */'./Repositories/initStorage');
      const storage = await initStorage(initialisedFirebaseApp);
      const {
        default: initNewsFeed
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'repositories-newsfeed' */'./Repositories/initNewsFeed');
      const newsFeed = await initNewsFeed(initialisedFirebaseApp);
      const {
        default: initSettings
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'repositories-settings' */'./Repositories/initSettings');
      const settings = await initSettings(initialisedFirebaseApp);
      const {
        default: initContact
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'repositories-contact' */'./Repositories/initContact');
      const contact = await initContact(initialisedFirebaseApp);
      const {
        default: initIwiMembers
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'repositories-iwi-members' */'./Repositories/initIwiMembers');
      const iwiMembers = await initIwiMembers(initialisedFirebaseApp);
      const {
        default: initCovidList
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'repositories-covidlist' */'./Repositories/initCovidList');
      const covidList = await initCovidList(initialisedFirebaseApp);
      const {
        default: initEconomicDevelopments
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'repositories-economic-developments' */'./Repositories/initEconomicDevelopments');
      const economicDevelopments = await initEconomicDevelopments(initialisedFirebaseApp);
      const {
        default: initProjects
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'repositories-projects' */'./Repositories/initProjects');
      const projects = await initProjects(initialisedFirebaseApp);
      const {
        default: initEvents
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'repositories-events' */'./Repositories/initEvents');
      const events = await initEvents(initialisedFirebaseApp);
      const {
        default: initResources
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'repositories-resources' */'./Repositories/initResources');
      const resources = await initResources(initialisedFirebaseApp);
      const {
        default: initFacebookLinks
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'repositories-facebook-links' */'./Repositories/initFacebookLinks');
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
