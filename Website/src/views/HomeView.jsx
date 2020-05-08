import React, {
  useEffect
} from 'react';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeHeader from 'components/Headers/HomeHeader';
import HomeFooter from 'components/Footers/HomeFooter';
import NewsFeedSection from 'components/Sections/NewsFeed';
// import InteractiveMapSection from 'components/Sections/InteractiveMap';
import VolunteersSection from 'components/Sections/Volunteers';
import CommuintyLinksSection from 'components/Sections/CommunityLinks';

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
    const navOpenClassName = 'nav-open';
    bodyClassNames.add(indexPageClassName);
    bodyClassNames.add(sidebarCollapseClassName);
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
      <HomeNavbar />
      <div className="wrapper">
        <HomeHeader />
        <div className="main bg-primary1">
          {/* Community Links Section) */}
          <CommuintyLinksSection />
          {/* Live News Feeds/Updates (Te Ao, Te Hiku Media, Covid 19 - MOH & Iwi Leaders) */}
          <NewsFeedSection />
          {/* Interactive Map of Iwi Links */}
          {/* <InteractiveMapSection /> */}
          {/* Volunteers via Mutual Aid */}
          <VolunteersSection />
        </div>
        <HomeFooter />
      </div>
    </>
  );
};

export default HomeView;
