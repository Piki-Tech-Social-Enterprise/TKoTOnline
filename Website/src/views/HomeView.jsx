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
// import InteractiveMapSection from 'components/Sections/InteractiveMap';
// import VolunteersSection from 'components/Sections/Volunteers';
// import CommuintyLinksSection from 'components/Sections/CommunityLinks';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const TKoTHelmet = lazy(async () => await import('components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeHeader = lazy(async () => await import('components/Headers/HomeHeader'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const AboutSection = lazy(async () => await import('components/Sections/About'));
const NewsFeedSection = lazy(async () => await import('components/Sections/NewsFeed'));
const IwiMembers = lazy(async () => await import('components/Sections/IwiMembers'));
const EventsSection = lazy(async () => await import('components/Sections/Events'));
const ProjectsSection = lazy(async () => await import('components/Sections/Projects'));
const ResourcesSection = lazy(async () => await import('components/Sections/Resources'));
const {
  home,
  iwiMembers,
  about,
  projects,
  events,
  newsFeed,
  resources
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
                home.replace('/#', ''),
                iwiMembers.replace('/#', ''),
                about.replace('/#', ''),
                'TkotBgImgContainer',
                projects.replace('/#', ''),
                events.replace('/#', ''),
                newsFeed.replace('/#', ''),
                resources.replace('/#', ''),
                'HomeFooter'
              ]}
              homeIndex={1}
              topOffset={scrollspyTopOffset}
            >
              <HomeNavbar
                initalTransparent={false}
                isHomePage={state.isHomePage}
              />
              {/* About */}
              <AboutSection
                pageAboutImage={state.homePageAboutImageDownloadUrl}
              />
              {/* Iwi Members */}
              <IwiMembers
                containerClassName="bg-white"
              />
              <HomeHeader
                pageHeaderImage={state.homePageHeaderImageDownloadUrl}
                showClickScrollDownForMoreLink={false}
              />
              {/* Community Links Section) */}
              {/* <CommuintyLinksSection /> */}
              <div className="tkot-background-image-container" id="TkotBgImgContainer">
                <div className="tkot-background-image" />
              </div>
              {/* Projects */}
              <ProjectsSection
                containerClassName="bg-secondary1"
                showLearnMoreButton
                isHomePage
              />
              {/* Events */}
              {/* <EventsSection showLearnMoreButton containerClassName="tkot-primary-blue-bg-color-50-pc" /> */}
              {/* <EventsSection showLearnMoreButton containerClassName="tkot-primary-red-bg-color-50-pc" /> */}
              {/* <EventsSection showLearnMoreButton containerClassName="tkot-secondary-color-grey-bg-color-50-pc" /> */}
              {/* <EventsSection showLearnMoreButton containerClassName="tkot-secondary-color-black-bg-color-50-pc" /> */}
              {/* <EventsSection showLearnMoreButton containerClassName="tkot-secondary-color-grey-bg-color-61-pc" /> */}
              <EventsSection
                showLearnMoreButton
                containerClassName="tkot-secondary-color-black-bg-color-61-pc"
                // containerClassName="bg-success"
                isHomePage
              />
              {/* Live News Feeds/Updates (Te Ao, Te Hiku Media, Covid 19 - MOH & Iwi Leaders) */}
              <NewsFeedSection
                containerClassName="bg-warning1"
                showLearnMoreButton
                isHomePage
              />
              <ResourcesSection
                containerClassName="bg-secondary1"
                showLearnMoreButton
                isHomePage
              />
              {/* Interactive Map of Iwi Links */}
              {/* <InteractiveMapSection /> */}
              {/* Volunteers via Mutual Aid */}
              {/* <VolunteersSection /> */}
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
