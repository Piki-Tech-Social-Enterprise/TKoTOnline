import React, {
  useEffect,
  useState
} from 'react';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeHeader from 'components/Headers/HomeHeader';
import HomeFooter from 'components/Footers/HomeFooter';
import AboutSection from 'components/Sections/About';
import NewsFeedSection from 'components/Sections/NewsFeed';
// import InteractiveMapSection from 'components/Sections/InteractiveMap';
// import VolunteersSection from 'components/Sections/Volunteers';
import IwiMembers from 'components/Sections/IwiMembers';
// import CommuintyLinksSection from 'components/Sections/CommunityLinks';
import EventsSection from 'components/Sections/Events';
import ProjectsSection from 'components/Sections/Projects';
import {
  Scrollspy
} from 'reactstrap-scrollspy';
import Routes from 'components/Routes/routes';
import {
  withFirebase
} from 'components/Firebase';
import LoadingSpinner from 'components/App/LoadingSpinner';
import {
  indexPageClassName,
  sidebarCollapseClassName,
  defaultPageSetup,
  getSrc
} from 'components/App/Utilities';

const {
  home,
  iwiMembers,
  about,
  projects,
  events,
  newsFeed
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
      const homePageHeaderImageDownloadUrl = homePageHeaderImageUrl.startsWith('/images/')
        ? getSrc(homePageHeaderImageUrl, null, null, true)
        : homePageHeaderImageUrl;
      const homePageAboutImageDownloadUrl = homePageAboutImageUrl.startsWith('/images/')
        ? getSrc(homePageAboutImageUrl, null, null, true)
        : homePageAboutImageUrl;
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
  return (
    <>
      {
        state.isLoading
          ? <LoadingSpinner
            outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
            innerClassName="m-5 p-5 text-center"
          />
          : <>
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
