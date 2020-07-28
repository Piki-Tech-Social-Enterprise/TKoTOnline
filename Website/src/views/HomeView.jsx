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
  defaultPageSetup
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
        ? await firebase.getStorageFileDownloadURL(homePageHeaderImageUrl)
        : homePageHeaderImageUrl;
      const homePageAboutImageDownloadUrl = homePageAboutImageUrl.startsWith('/images/')
        ? await firebase.getStorageFileDownloadURL(homePageAboutImageUrl)
        : homePageAboutImageUrl;
      defaultPageSetup(true);
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
  return (
    <>
      {
        state.isLoading
          ? <LoadingSpinner
            outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
            innerClassName="m-5 p-5 text-center"
          />
          : <Scrollspy
            names={[
              'HomeNavbar',
              home.replace('/#', ''),
              iwiMembers.replace('/#', ''),
              about.replace('/#', ''),
              projects.replace('/#', ''),
              events.replace('/#', ''),
              newsFeed.replace('/#', ''),
              'HomeFooter'
            ]}
            homeIndex={1}
            topOffset="10%"
          >
            <HomeNavbar
              initalTransparent={false}
              isHomePage
            />
            <HomeHeader
              pageHeaderImage={state.homePageHeaderImageDownloadUrl}
              showClickScrollDownForMoreLink={false}
            />
            {/* Iwi Members */}
            <IwiMembers />
            {/* About */}
            <AboutSection
              pageAboutImage={state.homePageAboutImageDownloadUrl}
            />
            {/* Community Links Section) */}
            {/* <CommuintyLinksSection /> */}
            {/* Projects */}
            <ProjectsSection showLearnMoreButton />
            {/* Events */}
            {/* <EventsSection showLearnMoreButton containerClassName="tkot-primary-blue-bg-color-50-pc" /> */}
            {/* <EventsSection showLearnMoreButton containerClassName="tkot-primary-red-bg-color-50-pc" /> */}
            {/* <EventsSection showLearnMoreButton containerClassName="tkot-secondary-color-grey-bg-color-50-pc" /> */}
            {/* <EventsSection showLearnMoreButton containerClassName="tkot-secondary-color-black-bg-color-50-pc" /> */}
            {/* <EventsSection showLearnMoreButton containerClassName="tkot-secondary-color-grey-bg-color-61-pc" /> */}
            <EventsSection showLearnMoreButton containerClassName="tkot-secondary-color-black-bg-color-61-pc" />
            {/* Live News Feeds/Updates (Te Ao, Te Hiku Media, Covid 19 - MOH & Iwi Leaders) */}
            <NewsFeedSection showLearnMoreButton />
            {/* Interactive Map of Iwi Links */}
            {/* <InteractiveMapSection /> */}
            {/* Volunteers via Mutual Aid */}
            {/* <VolunteersSection /> */}
            <HomeFooter />
          </Scrollspy>
      }
    </>
  );
};

export default withFirebase(HomeView);
