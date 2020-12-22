import React, {
  useEffect,
  useState,
  lazy
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
  getSrc
} from 'components/App/Utilities';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
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
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const {
  homeAnchor,
  iwiMembersAnchor,
  aboutAnchor,
  projectsAnchor,
  eventsAnchor,
  newsFeedAnchor,
  mediaListAnchor,
  resourcesAnchor,
  economicDevelopmentsAnchor
} = Routes;
const HomeView = props => {
  const [state, setState] = useState({
    isLoading: true,
    isHomePage: true,
    dbSettings: null,
    homePageHeaderImageDownloadUrl: '',
    homePageAboutImageDownloadUrl: ''
  });
  useEffect(() => {
    const retrieveSettingValues = async () => {
      const {
        firebase
      } = props;
      const dbSettings = await firebase.getDbSettingsValues(true);
      const {
        homePageHeaderImageUrl,
        homePageAboutImageUrl
      } = dbSettings;
      const homePageHeaderImageDownloadUrl = await getSrc(homePageHeaderImageUrl, null, null, true, null, firebase.getStorageFileDownloadURL);
      const homePageAboutImageDownloadUrl = await getSrc(homePageAboutImageUrl, null, null, true, null, firebase.getStorageFileDownloadURL);
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
        dbSettings: dbSettings,
        homePageHeaderImageDownloadUrl: homePageHeaderImageDownloadUrl,
        homePageAboutImageDownloadUrl: homePageAboutImageDownloadUrl
      }));
    };
    if (state.isLoading) {
      retrieveSettingValues();
    }
    return defaultPageSetup;
  }, [props, state]);
  const scrollspyTopOffset = '10%';
  const {
    REACT_APP_WEB_BASE_URL
  } = process.env;
  return (
    <>
      {
        state.isLoading
          ? <LoadingSpinner
            outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
            innerClassName="m-5 p-5 text-center"
          />
          : <>
            <TKoTHelmet
              name=""
              path="/"
              description={state.dbSettings.homePageAboutDescription}
              image={`${REACT_APP_WEB_BASE_URL}${require("assets/img/tkot/tkot-logo-only-black.webp")}`}
            />
            <Scrollspy
              names={[
                'HomeNavbar',
                homeAnchor.replace('/#', ''),
                iwiMembersAnchor.replace('/#', ''),
                aboutAnchor.replace('/#', ''),
                'TkotBgImgContainer',
                projectsAnchor.replace('/#', ''),
                eventsAnchor.replace('/#', ''),
                newsFeedAnchor.replace('/#', ''),
                mediaListAnchor.replace('/#', ''),
                resourcesAnchor.replace('/#', ''),
                economicDevelopmentsAnchor.replace('/#', ''),
                'HomeFooter'
              ]}
              homeIndex={1}
              topOffset={scrollspyTopOffset}
            >
              <HomeNavbar
                initalTransparent={false}
                isHomePage={state.isHomePage}
              />
              <AboutSection
                pageAboutImage={state.homePageAboutImageDownloadUrl}
              />
              <IwiMembers
                containerClassName="bg-white"
              />
              <HomeHeader
                pageHeaderImage={state.homePageHeaderImageDownloadUrl}
                showClickScrollDownForMoreLink={false}
              />
              <div className="tkot-background-image-container" id="TkotBgImgContainer">
                <div className="tkot-background-image" />
              </div>
              <ProjectsSection
                containerClassName="bg-secondary1"
                showLearnMoreButton
                isHomePage
              />
              <EventsSection
                showLearnMoreButton
                containerClassName="tkot-secondary-color-black-bg-color-61-pc"
                isHomePage
              />
              <NewsFeedSection
                containerClassName="bg-warning1"
                showLearnMoreButton
                isHomePage
              />
              <NewsFeedSection
                showLearnMoreButton
                isHomePage
                isTKoTMedia
              />
              <ResourcesSection
                containerClassName="bg-secondary1"
                showLearnMoreButton
                isHomePage
              />
              <EconomicDevelopmentsSection
                containerClassName="bg-primary1"
                showLearnMoreButton
                isHomePage={false}
              />
              <HomeFooter
                isHomePage={state.isHomePage}
              />
            </Scrollspy>
          </>
      }
    </>
  );
};

export default withFirebase(HomeView);
