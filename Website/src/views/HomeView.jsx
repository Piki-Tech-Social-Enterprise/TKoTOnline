import React, {
  useEffect,
  useState
} from 'react';
import {
  Scrollspy
} from 'reactstrap-scrollspy';
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
import {
  lazy
} from 'react-lazy-no-flicker';

const PageLoadingSpinner = lazy(async () => await import(/* webpackPreload: true */'components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import(/* webpackPreload: true */'components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import(/* webpackPreload: true */'components/Navbars/HomeNavbar'));
const AboutSection = lazy(async () => await import(/* webpackPreload: true */'components/Sections/About'));
const IwiMembers = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/IwiMembers'));
const HomeHeader = lazy(async () => await import(/* webpackPrefetch: true */'components/Headers/HomeHeader'));
const CovidSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/Covid'));
const NewsFeedSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/NewsFeed'));
const ResourcesSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/Resources'));
const EconomicDevelopmentsSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/EconomicDevelopments'));
const ProjectsSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/Projects'));
const EventsSection = lazy(async () => await import(/* webpackPrefetch: true */'components/Sections/Events'));
const HomeFooter = lazy(async () => await import(/* webpackPrefetch: true */'components/Footers/HomeFooter'));
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
    multipleDbItemsAsArrays: {},
    dbIwiMemberDownloadURLs: [],
    // dbSettings: null,
    // homePageHeaderImageDownloadUrl: '',
    // homePageAboutImageDownloadUrl: '',
    // dbNewsFeedsByIsFeatured: [],
    // dbNewsFeedsByIsTKoTMedia: []
  });
  const {
    isLoading,
    isHomePage,
    multipleDbItemsAsArrays,
    dbIwiMemberDownloadURLs
    // dbSettings,
    // homePageHeaderImageDownloadUrl,
    // homePageAboutImageDownloadUrl,
    // dbNewsFeedsByIsFeatured,
    // dbNewsFeedsByIsTKoTMedia
  } = state;
  const {
    dbSettings: dbSettingsAsArray,
    dbIwiMembers,
    dbCovidList,
    dbNewsFeedsByIsFeatured,
    dbNewsFeedsByIsTKoTMedia,
    dbResources,
    dbEconomicDevelopments,
    dbProjects,
    dbEvents
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
  const homePageAboutImageUrl = `https://firebasestorage.googleapis.com/v0/b/${REACT_APP_FIREBASE_STORAGE_BUCKET}/o/images%2Fstatic%2FhomePageAboutImage${sizeAsString}.webp?alt=media`;
  const homePageHeaderImageUrl = `https://firebasestorage.googleapis.com/v0/b/${REACT_APP_FIREBASE_STORAGE_BUCKET}/o/images%2Fstatic%2FhomePageHeaderImage${sizeAsString}.webp?alt=media`;
  const tkot20pcImage = '/static/img/tkot-white-logo-20pc.webp';
  const tkotImage = '/static/img/tkot-white-logo.webp';
  useEffect(() => {
    const pageSetup = async () => {
      const {
        firebase
      } = props;
      const {
        settingsRepository,
        // storageRepository,
        // newsFeedRepository
      } = firebase;
      const {
        // getDbSettingsValues,
        dbRepository
      } = settingsRepository;
      const {
        getMultipleDbItemsAsArrays
      } = dbRepository;
      // const {
      //   getStorageFileDownloadURL
      // } = storageRepository;
      // const {
      //   getDbNewsFeedsAsArray
      // } = newsFeedRepository;
      // const dbSettings = await getDbSettingsValues([
      //   // 'homePageHeaderImageUrl',
      //   // 'homePageAboutImageUrl',
      //   'homePageAboutDescription',
      //   // 'newsSectionDescription'
      // ]);
      const queryItems = {
        dbSettings: {
          dbTableName: 'settings',
          fieldNames: [
            'homePageAboutDescription'
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
      // console.log(`multipleDbItemsAsArrays: ${JSON.stringify(multipleDbItemsAsArrays, null, 2)}`);
      // const {
      //   homePageHeaderImageUrl,
      //   homePageAboutImageUrl
      // } = dbSettings;
      // const imageSize = window.screen.width <= 400
      //   ? 'md'
      //   : NaN;
      // const homePageHeaderImageDownloadUrl = await getStorageFileDownloadURL(getImageURLToUse(imageSize, homePageHeaderImageUrl));
      // const homePageAboutImageDownloadUrl = await getStorageFileDownloadURL(getImageURLToUse(imageSize, homePageAboutImageUrl));
      // const dbNewsFeedsFieldNames = [
      //   'category',
      //   'isFeatured',
      //   'isTKoTMedia',
      //   'date',
      //   'content',
      //   'header',
      //   'imageUrl',
      //   'externalUrl',
      //   'nfid',
      //   'name',
      //   'url'
      // ];
      // const dbNewsFeedsByIsFeatured = await getDbNewsFeedsAsArray(false, 'isFeatured', true, NaN, dbNewsFeedsFieldNames);
      // const dbNewsFeedsByIsTKoTMedia = await getDbNewsFeedsAsArray(false, 'isTKoTMedia', true, NaN, dbNewsFeedsFieldNames);
      const dbIwiMemberDownloadURLs = await Promise.all(multipleDbItemsAsArrays.dbIwiMembers.map(async dbIwiMember => await props.firebase.storageRepository.getStorageFileDownloadURL(getImageURLToUse('sm', dbIwiMember.iwiMemberImageURL))));
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
        // dbSettings,
        // homePageHeaderImageDownloadUrl,
        // homePageAboutImageDownloadUrl,
        // dbNewsFeedsByIsFeatured,
        // dbNewsFeedsByIsTKoTMedia
      }));
    };
    if (isLoading) {
      pageSetup();
    }
    return defaultPageSetup;
    // return () => { };
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
          homePageHeaderImageUrl,
          homePageAboutImageUrl,
          '/static/img/tkot-background-image.webp',
          tkotLogoOnlyBlackUrl,
          tkot20pcImage,
          tkotImage
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
                // pageAboutImage={homePageAboutImageDownloadUrl || dbSettings.homePageAboutImageUrl}
                pageAboutImage={homePageAboutImageUrl}
                pageAboutDescription={dbSettings.homePageAboutDescription}
              />
              <IwiMembers
                containerClassName="bg-white"
                dbIwiMembers={dbIwiMembers}
              />
              <HomeHeader
                // pageHeaderImage={homePageHeaderImageDownloadUrl || dbSettings.homePageHeaderImageUrl}
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
              />
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
