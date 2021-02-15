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
  getImageURLToUse
} from 'components/App/Utilities';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const PageLoadingSpinner = lazy(async () => await import(/* webpackPreload: true */'components/App/PageLoadingSpinner'));
const Scrollspy = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap-scrollspy/lib/scrollspy'));
const TKoTHelmet = lazy(async () => await import(/* webpackPreload: true */'components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import(/* webpackPrefetch: true */'components/Navbars/HomeNavbar'));
const AboutSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/About'));
const IwiMembers = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/IwiMembers'));
const HomeHeader = lazy(async () => await import(/* webpackPrefetch: true */'components/Headers/HomeHeader'));
// const CovidSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/Covid'));
// const NewsFeedSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/NewsFeed'));
// const ResourcesSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/Resources'));
// const EconomicDevelopmentsSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/EconomicDevelopments'));
// const ProjectsSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/Projects'));
// const EventsSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/Events'));
const HomeFooter = lazy(async () => await import(/* webpackPrefetch: true */'components/Footers/HomeFooter'));
const {
  home,
  homeAnchor,
  iwiMembersAnchor,
  aboutAnchor,
  // covidListAnchor,
  // newsFeedAnchor,
  // mediaListAnchor,
  // resourcesAnchor,
  // economicDevelopmentsAnchor,
  // projectsAnchor,
  // eventsAnchor
} = Routes;
const HomeView = props => {
  const [state, setState] = useState({
    isLoading: true,
    isHomePage: true,
    multipleDbItemsAsArrays: {},
    dbIwiMemberDownloadURLs: [],
    dbSettings: null,
    homePageHeaderImageDownloadUrl: '',
    homePageAboutImageDownloadUrl: '',
    dbNewsFeedsByIsFeatured: [],
    dbNewsFeedsByIsTKoTMedia: []
  });
  const {
    isLoading,
    isHomePage,
    multipleDbItemsAsArrays,
    dbIwiMemberDownloadURLs
  } = state;
  const {
    dbSettings: dbSettingsAsArray,
    // dbNewsFeedsByIsFeatured,
    // dbNewsFeedsByIsTKoTMedia,
    dbIwiMembers,
    // dbCovidList,
    // dbResources,
    // dbEconomicDevelopments,
    // dbProjects,
    // dbEvents
  } = multipleDbItemsAsArrays;
  const dbSettings = dbSettingsAsArray
    ? dbSettingsAsArray[0]
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
          ]
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
        // dbCovidList: {
        //   dbTableName: 'covidList',
        //   childName: 'isFeatured',
        //   fieldNames: [
        //     'category',
        //     'date',
        //     'content',
        //     'header',
        //     'imageUrl',
        //     'externalUrl',
        //     'cvid',
        //     'name',
        //     'url'
        //   ]
        // },
        // dbNewsFeedsByIsFeatured: {
        //   dbTableName: 'newsFeeds',
        //   childName: 'isFeatured',
        //   fieldNames: [
        //     'category',
        //     'isFeatured',
        //     'isTKoTMedia',
        //     'date',
        //     'content',
        //     'header',
        //     'imageUrl',
        //     'externalUrl',
        //     'nfid',
        //     'name',
        //     'url'
        //   ]
        // },
        // dbNewsFeedsByIsTKoTMedia: {
        //   dbTableName: 'newsFeeds',
        //   childName: 'isTKoTMedia',
        //   fieldNames: [
        //     'category',
        //     'isFeatured',
        //     'isTKoTMedia',
        //     'date',
        //     'content',
        //     'header',
        //     'imageUrl',
        //     'externalUrl',
        //     'nfid',
        //     'name',
        //     'url'
        //   ]
        // },
        // dbResources: {
        //   dbTableName: 'resources',
        //   childName: 'isFeatured',
        //   fieldNames: [
        //     'category',
        //     'header',
        //     'imageUrl',
        //     'content',
        //     'resourceUrl',
        //     'resourceDownloadUrl'
        //   ]
        // },
        // dbEconomicDevelopments: {
        //   dbTableName: 'economicDevelopments',
        //   childName: 'isFeatured',
        //   fieldNames: [
        //     'category',
        //     'header',
        //     'imageUrl',
        //     'content',
        //     'economicDevelopmentUrl',
        //     'economicDevelopmentDownloadUrl'
        //   ]
        // },
        // dbProjects: {
        //   dbTableName: 'projects',
        //   childName: 'isFeatured',
        //   fieldNames: [
        //     'header',
        //     'imageUrl',
        //     'pid'
        //   ]
        // },
        // dbEvents: {
        //   dbTableName: 'events',
        //   childName: 'isFeatured',
        //   fieldNames: [
        //     'startDateTime',
        //     'endDateTime',
        //     'imageUrl',
        //     'header',
        //     'externalUrl',
        //     'evid'
        //   ]
        // }
      };
      const multipleDbItemsAsArrays = await getMultipleDbItemsAsArrays(queryItems);
      const {
        dbIwiMembers
      } = multipleDbItemsAsArrays;
      const dbIwiMemberDownloadURLs = await Promise.all(dbIwiMembers.map(async dbIwiMember => await getStorageFileDownloadURL(getImageURLToUse('sm', dbIwiMember.iwiMemberImageURL))));
      defaultPageSetup({
        isLoading: true,
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
    return defaultPageSetup;
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
          homePageAboutImageUrl,
          tkotLogoOnlyBlackUrl,
          tkot20pcImage,
          tkotImage
        ]}
        prefetchImages={[
          homePageHeaderImageUrl,
          // '/static/img/tkot-background-image.webp',
        ].concat(dbIwiMemberDownloadURLs)}
      />
      {
        isLoading
          ? <PageLoadingSpinner caller="HomeView" />
          : <>
            <Scrollspy
              names={[
                'HomeNavbar',
                homeAnchor.replace('/#', ''),
                iwiMembersAnchor.replace('/#', ''),
                aboutAnchor.replace('/#', ''),
                // 'TkotBgImgContainer',
                // covidListAnchor.replace('/#', ''),
                // newsFeedAnchor.replace('/#', ''),
                // mediaListAnchor.replace('/#', ''),
                // resourcesAnchor.replace('/#', ''),
                // economicDevelopmentsAnchor.replace('/#', ''),
                // projectsAnchor.replace('/#', ''),
                // eventsAnchor.replace('/#', ''),
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
              />
              <HomeHeader
                pageHeaderImage={homePageHeaderImageUrl}
                showClickScrollDownForMoreLink={false}
              />
              {/* <div className="tkot-background-image-container" id="TkotBgImgContainer">
                <div className="tkot-background-image" />
              </div>
              <CovidSection
                showLearnMoreButton
                isHomePage
                dbCovidList={dbCovidList}
              />
              <NewsFeedSection
                showLearnMoreButton
                isHomePage
                newsSectionDescription={dbSettings.newsSectionDescription}
                dbNewsFeeds={dbNewsFeedsByIsFeatured}
              />
              <NewsFeedSection
                showLearnMoreButton
                isHomePage
                isTKoTMedia
                dbNewsFeeds={dbNewsFeedsByIsTKoTMedia}
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
              />
              <ProjectsSection
                showLearnMoreButton
                isHomePage
                dbProjects={dbProjects}
              />
              <EventsSection
                showLearnMoreButton
                containerClassName="tkot-secondary-color-black-bg-color-61-pc"
                isHomePage
                dbEvents={dbEvents}
              /> */}
              <HomeFooter
                isHomePage={isHomePage}
              />
            </Scrollspy>
          </>
      }
    </>
  );
};

export default withFirebase(HomeView);
