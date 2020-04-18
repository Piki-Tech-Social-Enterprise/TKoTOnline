import React, {
  useEffect
} from 'react';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeHeader from 'components/Headers/HomeHeader';
import HomeFooter from 'components/Footers/HomeFooter';
import NewsFeedSection from 'components/Sections/NewsFeedSection';

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
      <div className="main">
        {/* TODO: Live News Feeds/Updates (Te Ao, Te Hiku Media, Covid 19 - MOH & Iwi Leaders) */}
        <NewsFeedSection />
        {/* TODO: Interactive Map of Iwi Links */}
        {/* TODO: Gather Volunteers for different tribal groups via Mutual Aid */}
        {/* TODO: Social Media Links */}
        {/* TODO: Join TKoT Volunteers via Mutual Aid */}
      </div>
      <HomeFooter />
    </div>
    </>
  );
};

export default HomeView;
