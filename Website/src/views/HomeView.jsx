import React, {
  useEffect
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

const {
  iwiMembers,
  about,
  projects,
  events,
  newsFeed
} = Routes;
const HomeView = () => {
  useEffect(() => {
    const {
      body
    } = document;
    const {
      classList: bodyClassNames
    } = body;
    const indexPageClassName = 'index-page';
    const sidebarCollapseClassName = 'sidebar-collapse';
    const tkotBackgroundImage = 'tkot-background-image';
    const navOpenClassName = 'nav-open';
    bodyClassNames.add(indexPageClassName);
    bodyClassNames.add(sidebarCollapseClassName);
    bodyClassNames.add(tkotBackgroundImage);
    document.documentElement.classList.remove(navOpenClassName);
    window.scrollTo(0, 0);
    body.scrollTop = 0;
    return () => {
      bodyClassNames.remove(indexPageClassName);
      bodyClassNames.remove(sidebarCollapseClassName);
    };
  });
  return (
    <Scrollspy
      names={[
        'HomeNavbar',
        'HomeHeader',
        iwiMembers.replace('/#', ''),
        about.replace('/#', ''),
        projects.replace('/#', ''),
        events.replace('/#', ''),
        newsFeed.replace('/#', ''),
        'HomeFooter'
      ]}
      homeIndex={1}
    >
      <HomeNavbar initalTransparent isHomePage />
      <HomeHeader pageHeaderImage={require('assets/img/tkot/tkot-home-header-background-image.png')} />
      {/* Iwi Members */}
      <IwiMembers />
      {/* About */}
      <AboutSection />
      {/* Community Links Section) */}
      {/* <CommuintyLinksSection /> */}
      {/* Projects */}
      <ProjectsSection showLearnMoreButton />
      {/* Events */}
      {/* <EventsSection showLearnMoreButton containerClassName="tkot-primary-blue-bg-color-50-pc" /> */}
      {/* <EventsSection showLearnMoreButton containerClassName="tkot-primary-red-bg-color-50-pc" /> */}
      <EventsSection showLearnMoreButton containerClassName="tkot-secondary-color-grey-bg-color-50-pc" />
      {/* <EventsSection showLearnMoreButton containerClassName="tkot-secondary-color-black-bg-color-50-pc" /> */}
      {/* Live News Feeds/Updates (Te Ao, Te Hiku Media, Covid 19 - MOH & Iwi Leaders) */}
      <NewsFeedSection showLearnMoreButton />
      {/* Interactive Map of Iwi Links */}
      {/* <InteractiveMapSection /> */}
      {/* Volunteers via Mutual Aid */}
      {/* <VolunteersSection /> */}
      <HomeFooter />
    </Scrollspy>
  );
};

export default HomeView;
