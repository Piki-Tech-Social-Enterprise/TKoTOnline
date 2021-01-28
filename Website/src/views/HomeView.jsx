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
  getImageURLToUse
} from 'components/App/Utilities';
import {
  lazy
} from 'react-lazy-no-flicker';

const PageLoadingSpinner = lazy(async () => await import('components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import('components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const AboutSection = lazy(async () => await import('components/Sections/About'));
const IwiMembers = lazy(async () => await import('components/Sections/IwiMembers'));
const HomeHeader = lazy(async () => await import('components/Headers/HomeHeader'));
const ProjectsSection = lazy(async () => await import('components/Sections/Projects'));
const EventsSection = lazy(async () => await import('components/Sections/Events'));
const NewsFeedSection = lazy(async () => await import('components/Sections/NewsFeed'));
const ResourcesSection = lazy(async () => await import('components/Sections/Resources'));
const EconomicDevelopmentsSection = lazy(async () => await import('components/Sections/EconomicDevelopments'));
const CovidSection = lazy(async () => await import('components/Sections/Covid'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const {
  home,
  homeAnchor,
  iwiMembersAnchor,
  aboutAnchor,
  projectsAnchor,
  eventsAnchor,
  newsFeedAnchor,
  mediaListAnchor,
  resourcesAnchor,
  economicDevelopmentsAnchor,
  covidListAnchor
} = Routes;
const HomeView = props => {
  const [state, setState] = useState({
    isLoading: true,
    isHomePage: true,
    dbSettings: null,
    homePageHeaderImageDownloadUrl: '',
    homePageAboutImageDownloadUrl: '',
    dbNewsFeedsByIsFeatured: [],
    dbNewsFeedsByIsTKoTMedia: []
  });
  const {
    isLoading,
    isHomePage,
    dbSettings,
    homePageHeaderImageDownloadUrl,
    homePageAboutImageDownloadUrl,
    dbNewsFeedsByIsFeatured,
    dbNewsFeedsByIsTKoTMedia
  } = state;
  useEffect(() => {
    const pageSetup = async () => {
      const {
        firebase
      } = props;
      const {
        getDbSettingsValues,
        getStorageFileDownloadURL,
        getDbNewsFeedsAsArray
      } = firebase;
      const dbSettings = await getDbSettingsValues(true);
      const {
        homePageHeaderImageUrl,
        homePageAboutImageUrl
      } = dbSettings;
      const imageSize = window.screen.width <= 400
        ? 'md'
        : NaN;
      const homePageHeaderImageDownloadUrl = await getStorageFileDownloadURL(getImageURLToUse(imageSize, homePageHeaderImageUrl));
      const homePageAboutImageDownloadUrl = await getStorageFileDownloadURL(getImageURLToUse(imageSize, homePageAboutImageUrl));
      const dbNewsFeedsByIsFeatured = await getDbNewsFeedsAsArray(false, 'isFeatured', true);
      const dbNewsFeedsByIsTKoTMedia = await getDbNewsFeedsAsArray(false, 'isTKoTMedia', true);
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
        dbSettings,
        homePageHeaderImageDownloadUrl,
        homePageAboutImageDownloadUrl,
        dbNewsFeedsByIsFeatured,
        dbNewsFeedsByIsTKoTMedia
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
  return (
    <>
      <TKoTHelmet
        name={homeAnchor.replace('/#', '')}
        path={home}
        description={isLoading
          ? 'Formed in 2006/7, the purpose of Te Kāhu o Taonui was to create a taumata for our Taitokerau Iwi Chairs to come together, to wānanga, share ideas and concerns with each other. To utilise the power of our collective Iwi to create more opportunities to benefit all of our whānau, hapū and Marae.'
          : dbSettings.homePageAboutDescription}
        image={`${REACT_APP_WEB_BASE_URL}${require("assets/img/tkot/tkot-logo-only-black.webp")}`}
      />
      {
        isLoading
          ? <PageLoadingSpinner />
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
                pageAboutImage={homePageAboutImageDownloadUrl}
                pageAboutDescription={dbSettings.homePageAboutDescription}
              />
              <IwiMembers
                containerClassName="bg-white"
              />
              <HomeHeader
                pageHeaderImage={homePageHeaderImageDownloadUrl}
                showClickScrollDownForMoreLink={false}
              />
              <div className="tkot-background-image-container" id="TkotBgImgContainer">
                <div className="tkot-background-image" />
              </div>
              <CovidSection
                showLearnMoreButton
                isHomePage
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
              />
              <EconomicDevelopmentsSection
                showLearnMoreButton
                isFeatured
                showViewTaitokerauEconomicSummit2020SiteButton
              />
              <ProjectsSection
                showLearnMoreButton
                isHomePage
              />
              <EventsSection
                showLearnMoreButton
                containerClassName="tkot-secondary-color-black-bg-color-61-pc"
                isHomePage
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
