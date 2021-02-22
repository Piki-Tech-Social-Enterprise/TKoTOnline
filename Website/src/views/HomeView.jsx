import React, {
  useEffect,
  useState
} from 'react';
import Routes from 'components/Routes/routes';
import {
  withFirebase
} from 'components/Firebase';
import {
  indexPageClassName,
  sidebarCollapseClassName,
  defaultPageSetup,
  getSize,
  isNumber,
  getImageURLToUse,
  withSuspense
} from 'components/App/Utilities';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Scrollspy = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-scrollspy' */'reactstrap-scrollspy/lib/scrollspy')), 'reactstrap-scrollspy');
const TKoTHelmet = withSuspense(lazy(async () => await import(/* webpackPreload: true, webpackChunkName: 'app-tkot-helmet' */'components/App/TKoTHelmet')), 'app-tkot-helmet');
const HomeNavbar = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-navbar' */'components/Navbars/HomeNavbar')), 'app-home-navbar');
const AboutSection = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-about-section' */'components/Sections/About')), 'app-about-section');
const IwiMembers = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-iwi-members-section' */'components/Sections/IwiMembers')), 'app-iwi-members-section');
const HomeHeader = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-header' */'components/Headers/HomeHeader')), 'app-home-header');
const CovidSection = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-covid-section' */'components/Sections/Covid')), 'app-covid-section');
const NewsFeedSection = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-newsfeed-section' */'components/Sections/NewsFeed')), 'app-newsfeed-section');
const ResourcesSection = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-resources-section' */'components/Sections/Resources')), 'app-resources-section');
const EconomicDevelopmentsSection = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-economic-development-section' */'components/Sections/EconomicDevelopments')), 'app-economic-development-section');
const ProjectsSection = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-projects-section' */'components/Sections/Projects')), 'components/Sections/Projects');
const EventsSection = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-events-section' */'components/Sections/Events')), 'components/Sections/Events');
const HomeFooter = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-footer' */'components/Footers/HomeFooter')), 'components/Footers/HomeFooter');
const {
  home,
  homeAnchor,
  iwiMembersAnchor,
  aboutAnchor,
  covidListAnchor,
  newsFeedAnchor,
  mediaListAnchor,
  resourcesAnchor,
  economicDevelopmentsAnchor,
  projectsAnchor,
  eventsAnchor
} = Routes;
const HomeView = props => {
  const [state, setState] = useState({
    isLoading: true,
    isHomePage: true,
    multipleDbItemsAsArrays: {
      dbSettings: [],
      dbNewsFeedsByIsFeatured: [],
      dbNewsFeedsByIsTKoTMedia: [],
      dbIwiMembers: [],
      dbCovidList: [],
      dbResources: [],
      dbEconomicDevelopments: [],
      dbProjects: [],
      dbEvents: []
    },
    dbIwiMemberDownloadURLs: []
  });
  const {
    isLoading,
    isHomePage,
    multipleDbItemsAsArrays,
    dbIwiMemberDownloadURLs
  } = state;
  const {
    dbSettings: dbSettingsAsArray,
    dbNewsFeedsByIsFeatured,
    dbNewsFeedsByIsTKoTMedia,
    dbIwiMembers,
    dbCovidList,
    dbResources,
    dbEconomicDevelopments,
    dbProjects,
    dbEvents
  } = multipleDbItemsAsArrays;
  const dbSettings = Array.isArray(dbSettingsAsArray)
    ? dbSettingsAsArray[0] || {}
    : {};
  const {
    REACT_APP_FIREBASE_STORAGE_BUCKET
  } = process.env;
  const size = getSize(window.screen.width <= 400 && 'md');
  const sizeAsString = isNumber(size)
    ? `@s_${size}`
    : '';
  const homePageAboutImageUrl = `https://storage.googleapis.com/${REACT_APP_FIREBASE_STORAGE_BUCKET}/images/static/homePageAboutImage${sizeAsString}.webp`;
  const homePageHeaderImageUrl = `https://storage.googleapis.com/${REACT_APP_FIREBASE_STORAGE_BUCKET}/images/static/homePageHeaderImage${sizeAsString}.webp`;
  const tkot20pcImage = '/static/img/tkot-white-logo-20pc.webp';
  const tkotImage = '/static/img/tkot-white-logo.webp';
  useEffect(() => {
    const pageSetup = async () => {
      const {
        firebase
      } = props;
      const {
        settingsRepository,
        storageRepository
      } = firebase;
      const {
        dbRepository
      } = settingsRepository;
      const {
        getStorageFileDownloadURL
      } = storageRepository;
      const {
        getMultipleDbItemsAsArrays
      } = dbRepository;
      const queryItems = {
        dbSettings: {
          dbTableName: 'settings',
          fieldNames: [
            'homePageAboutDescription',
            'newsSectionDescription'
          ],
          topLimit: 1
        },
        dbIwiMembers: {
          dbTableName: 'iwiMembers',
          fieldNames: [
            'sequence',
            'imid',
            'iwiMemberImageURL',
            'iwiMemberName',
            'iwiMemberURL',
            'iwiMemberRegistrationLink'
          ]
        },
        dbCovidList: {
          dbTableName: 'covidList',
          childName: 'isFeatured',
          fieldNames: [
            'category',
            'date',
            'content',
            'header',
            'imageUrl',
            'externalUrl',
            'cvid',
            'name',
            'url'
          ]
        },
        dbNewsFeedsByIsFeatured: {
          dbTableName: 'newsFeeds',
          childName: 'isFeatured',
          fieldNames: [
            'category',
            'isFeatured',
            'isTKoTMedia',
            'date',
            'content',
            'header',
            'imageUrl',
            'externalUrl',
            'nfid',
            'name',
            'url'
          ]
        },
        dbNewsFeedsByIsTKoTMedia: {
          dbTableName: 'newsFeeds',
          childName: 'isTKoTMedia',
          fieldNames: [
            'category',
            'isFeatured',
            'isTKoTMedia',
            'date',
            'content',
            'header',
            'imageUrl',
            'externalUrl',
            'nfid',
            'name',
            'url'
          ]
        },
        dbResources: {
          dbTableName: 'resources',
          childName: 'isFeatured',
          fieldNames: [
            'category',
            'header',
            'imageUrl',
            'content',
            'resourceUrl',
            'resourceDownloadUrl'
          ]
        },
        dbEconomicDevelopments: {
          dbTableName: 'economicDevelopments',
          childName: 'isFeatured',
          fieldNames: [
            'category',
            'header',
            'imageUrl',
            'content',
            'economicDevelopmentUrl',
            'economicDevelopmentDownloadUrl'
          ]
        },
        dbProjects: {
          dbTableName: 'projects',
          childName: 'isFeatured',
          fieldNames: [
            'header',
            'imageUrl',
            'pid'
          ]
        },
        dbEvents: {
          dbTableName: 'events',
          childName: 'isFeatured',
          fieldNames: [
            'startDateTime',
            'endDateTime',
            'imageUrl',
            'header',
            'externalUrl',
            'evid'
          ]
        }
      };
      const multipleDbItemsAsArrays = await getMultipleDbItemsAsArrays(queryItems);
      const {
        dbIwiMembers
      } = multipleDbItemsAsArrays;
      const dbIwiMemberDownloadURLs = await Promise.all(dbIwiMembers.map(async dbIwiMember => await getStorageFileDownloadURL(getImageURLToUse('sm', dbIwiMember.iwiMemberImageURL))));
      defaultPageSetup({
        isLoading,
        classNames: [
          indexPageClassName,
          sidebarCollapseClassName
        ]
      });
      setState(s => ({
        ...s,
        isLoading: false,
        multipleDbItemsAsArrays,
        dbIwiMemberDownloadURLs
      }));
    };
    if (isLoading) {
      pageSetup();
    }
    return () => {
      if (!isLoading) {
        defaultPageSetup();
      }
    };
  }, [props, isLoading]);
  const scrollspyTopOffset = '10%';
  const {
    REACT_APP_WEB_BASE_URL
  } = process.env;
  const tkotLogoOnlyBlackUrl = new URL('/static/img/tkot-logo-only-black.webp', REACT_APP_WEB_BASE_URL).toString();
  return (
    <>
      <TKoTHelmet
        name={homeAnchor.replace('/#', '')}
        path={home}
        description={isLoading
          ? 'Formed in 2006/7, the purpose of Te Kāhu o Taonui was to create a taumata for our Taitokerau Iwi Chairs to come together, to wānanga, share ideas and concerns with each other. To utilise the power of our collective Iwi to create more opportunities to benefit all of our whānau, hapū and Marae.'
          : dbSettings.homePageAboutDescription}
        image={tkotLogoOnlyBlackUrl}
        preloadImages={[
          tkotLogoOnlyBlackUrl,
          homePageAboutImageUrl,
          tkot20pcImage,
          tkotImage,
          homePageHeaderImageUrl
        ]}
        prefetchImages={[
          '/static/img/tkot-background-image.webp',
        ].concat(dbIwiMemberDownloadURLs)}
      />
      <Scrollspy
        names={[
          'HomeNavbar',
          homeAnchor.replace('/#', ''),
          iwiMembersAnchor.replace('/#', ''),
          aboutAnchor.replace('/#', ''),
          'TkotBgImgContainer',
          covidListAnchor.replace('/#', ''),
          newsFeedAnchor.replace('/#', ''),
          mediaListAnchor.replace('/#', ''),
          resourcesAnchor.replace('/#', ''),
          economicDevelopmentsAnchor.replace('/#', ''),
          projectsAnchor.replace('/#', ''),
          eventsAnchor.replace('/#', ''),
          'HomeFooter'
        ]}
        homeIndex={1}
        topOffset={scrollspyTopOffset}
      >
        <HomeNavbar
          initalTransparent={false}
          isHomePage={isHomePage}
        />
        <AboutSection
          pageAboutImage={homePageAboutImageUrl}
          pageAboutDescription={dbSettings.homePageAboutDescription}
        />
        <IwiMembers
          containerClassName="bg-white"
          dbIwiMembers={dbIwiMembers}
          doNotRetrieveData={isLoading}
        />
        <HomeHeader
          pageHeaderImage={homePageHeaderImageUrl}
          showClickScrollDownForMoreLink={false}
        />
        <div className="tkot-background-image-container" id="TkotBgImgContainer">
          <div className="tkot-background-image" />
        </div>
        <CovidSection
          showLearnMoreButton
          isHomePage
          dbCovidList={dbCovidList}
          doNotRetrieveData={isLoading}
        />
        <NewsFeedSection
          showLearnMoreButton
          isHomePage
          newsSectionDescription={dbSettings.newsSectionDescription}
          dbNewsFeeds={dbNewsFeedsByIsFeatured}
          doNotRetrieveData={isLoading}
        />
        <NewsFeedSection
          showLearnMoreButton
          isHomePage
          isTKoTMedia
          dbNewsFeeds={dbNewsFeedsByIsTKoTMedia}
          doNotRetrieveData={isLoading}
        />
        <ResourcesSection
          showLearnMoreButton
          isHomePage
          dbResources={dbResources}
        />
        <EconomicDevelopmentsSection
          showLearnMoreButton
          isFeatured
          showViewTaitokerauEconomicSummit2020SiteButton
          dbEconomicDevelopments={dbEconomicDevelopments}
          doNotRetrieveData={isLoading}
        />
        <ProjectsSection
          showLearnMoreButton
          isHomePage
          dbProjects={dbProjects}
          doNotRetrieveData={isLoading}
        />
        <EventsSection
          showLearnMoreButton
          containerClassName="tkot-secondary-color-black-bg-color-61-pc"
          isHomePage
          dbEvents={dbEvents}
          doNotRetrieveData={isLoading}
        />
        <HomeFooter
          isHomePage={isHomePage}
        />
      </Scrollspy>
    </>
  );
};

export default withFirebase(HomeView);
