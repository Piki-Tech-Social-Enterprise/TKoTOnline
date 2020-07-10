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
import SolutionsSection from 'components/Sections/Solutions';

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
    <>
      <HomeNavbar initalTransparent />
      <div className="wrapper">
        <HomeHeader />
        <div className="main bg-primary1">
          {/* Iwi Members */}
          <IwiMembers />
          {/* About */}
          <AboutSection />
          {/* Community Links Section) */}
          {/* <CommuintyLinksSection /> */}
          {/* Solutions */}
          <SolutionsSection />
          {/* Events */}
          <EventsSection />
          {/* Live News Feeds/Updates (Te Ao, Te Hiku Media, Covid 19 - MOH & Iwi Leaders) */}
          <NewsFeedSection showLearnMoreButton />
          {/* Interactive Map of Iwi Links */}
          {/* <InteractiveMapSection /> */}
          {/* Volunteers via Mutual Aid */}
          {/* <VolunteersSection /> */}
        </div>
        <HomeFooter />
      </div>
    </>
  );
};

export default HomeView;
