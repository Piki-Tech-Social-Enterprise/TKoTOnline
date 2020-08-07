import React, {
  useState,
  useEffect
} from 'react';
import {
  Collapse,
  Navbar,
  Nav,
  Container,
  // Button
} from 'reactstrap';
// import Routes from '../Routes/routes';
import PropTypes from 'prop-types';
import NavItems from 'components/App/NavItems';
import Tooltips from 'components/App/Tooltips';
import {
  getNavItems
} from 'components/App/Utilities';

// const {
//   home,
//   homePage,
//   iwiMembers,
//   about,
//   aboutUs,
//   // communityLinks,
//   newsFeed,
//   newsFeeds,
//   // interactiveMap,
//   // volunteers,
//   // facebookLinks,
//   events,
//   eventsPage,
//   projects,
//   projectsPage,
//   contactUs
// } = Routes;
const HomeNavbar = props => {
  const {
    initalTransparent,
    colorOnScrollValue,
    isHomePage
  } = props;
  const tkotBackgroundTransparent = 'tkot-background-transparent';
  const tkotBackgroundWhite = 'tkot-background-white';
  const defaultTkotBackground = initalTransparent || false
    ? tkotBackgroundTransparent
    : tkotBackgroundWhite;
  const [state, setState] = useState({
    collapseOpen: false,
    navbarColor: defaultTkotBackground
  });
  const {
    pathname,
    hash
  } = window.location;
  // const {
  //   REACT_APP_PWA_BASE_URL
  // } = process.env;
  const navItems = getNavItems(isHomePage);
  useEffect(() => {
    const updateNavbarColor = () => {
      let navbarColor = defaultTkotBackground;
      if (
        document.documentElement.scrollTop >= colorOnScrollValue ||
        document.body.scrollTop >= colorOnScrollValue
      ) {
        navbarColor = tkotBackgroundWhite;
      }
      setState(s => ({
        ...s,
        navbarColor: navbarColor
      }));
    };
    window.addEventListener('scroll', updateNavbarColor);
    return () => {
      window.removeEventListener('scroll', updateNavbarColor);
    }
  }, [defaultTkotBackground, colorOnScrollValue])
  return (
    <>
      {state.collapseOpen ? (
        <div id="bodyClick" onClick={() => {
          document.documentElement.classList.toggle("nav-open");
          setState(s => ({
            ...s,
            collapseOpen: false
          }));
        }} />
      ) : null}
      <Navbar className={`fixed-top ${state.navbarColor}`} expand="lg" id="HomeNavbar">
        <Container className="pl-0">
          <div className="navbar-translate">
            <button className="navbar-toggler navbar-toggler" aria-expanded={state.collapseOpen} type="button" onClick={() => {
              document.documentElement.classList.toggle("nav-open");
              setState(s => ({
                ...s,
                collapseOpen: !state.collapseOpen
              }));
            }}>
              <span className="navbar-toggler-bar top-bar"></span>
              <span className="navbar-toggler-bar middle-bar"></span>
              <span className="navbar-toggler-bar bottom-bar"></span>
            </button>
          </div>
          <Collapse className="justify-content-center" isOpen={state.collapseOpen} navbar>
            <a href="/">
              {/* <img alt="..." className="n-logo" src={require("assets/img/tkot/tkot-mixed-no-tag-line.png")} width="180" /> */}
              <img alt="..." className="n-logo mx-3 d-none d-lg-inline" src={require("assets/img/tkot/tkot-logo-only-black.png")} width="32" />
            </a>
            <Nav navbar>
              <NavItems
                useScrollspyNavLinks={isHomePage}
                pathname={pathname}
                hash={hash}
                items={navItems}
              />
              {/* {
                isHomePage
                  ? <>
                    <NavItem>
                      <ScrollspyNavLink name={home.replace('/#', '')}>
                        <NavLink href={home} active={pathname === home || pathname === homePage}>Home</NavLink>
                      </ScrollspyNavLink>
                    </NavItem>
                    <NavItem>
                      <ScrollspyNavLink name={iwiMembers.replace('/#', '')}>
                        <NavLink href={iwiMembers} active={hash !== '' && iwiMembers.endsWith(hash)}>Iwi</NavLink>
                      </ScrollspyNavLink>
                    </NavItem>
                    <NavItem>
                      <ScrollspyNavLink name={home.replace('/#', '')}>
                        <NavLink href={about} active={hash !== '' && about.endsWith(hash)}>About</NavLink>
                      </ScrollspyNavLink>
                    </NavItem>
                    <NavItem>
                      <ScrollspyNavLink name={projects.replace('/#', '')}>
                        <NavLink href={projects} active={hash !== '' && projects.endsWith(hash)}>Projects</NavLink>
                      </ScrollspyNavLink>
                    </NavItem>
                    <NavItem>
                      <ScrollspyNavLink name={events.replace('/#', '')}>
                        <NavLink href={events} active={hash !== '' && events.endsWith(hash)}>Wānanga</NavLink>
                      </ScrollspyNavLink>
                    </NavItem>
                    <NavItem>
                      <ScrollspyNavLink name={newsFeed.replace('/#', '')}>
                        <NavLink href={newsFeed} active={hash !== '' && newsFeed.endsWith(hash)}>News</NavLink>
                      </ScrollspyNavLink>
                    </NavItem>
                  </>
                  : <>
                    <NavItem>
                      <NavLink href={home} active={hash !== '' && home.endsWith(hash)}>Home</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href={iwiMembers} active={hash !== '' && iwiMembers.endsWith(hash)}>Iwi</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href={aboutUs} active={pathname.endsWith(aboutUs)}>About</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href={projectsPage} active={pathname.endsWith(projectsPage)}>Projects</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href={eventsPage} active={pathname.endsWith(eventsPage)}>Wananga</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href={newsFeeds} active={pathname.endsWith(newsFeeds)}>News</NavLink>
                    </NavItem>
                  </>
              } */}
              {/* <NavItem>
                <NavLink href={contactUs} active={pathname.endsWith(contactUs)}>Contact</NavLink>
              </NavItem> */}
              {/* <NavItem>
                <Button href={`${REACT_APP_PWA_BASE_URL}/public/Login`} outline color='light'>
                  Login
                </Button>
              </NavItem> */}
              {/* <NavItem active={hash && interactiveMap.endsWith(hash)}>
              <NavLink href={interactiveMap}>Interactive Map</NavLink>
            </NavItem> */}
              {/* <NavItem active={hash !== '' && volunteers.endsWith(hash)}>
              <NavLink href={volunteers}>Volunteers</NavLink>
            </NavItem> */}
              {/* <NavItem active={hash !== '' && pathname.endsWith(facebookLinks)}>
              <NavLink href={facebookLinks}>Facebook</NavLink>
            </NavItem> */}
            </Nav>
            <Tooltips
              items={navItems}
            />
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
};

HomeNavbar.propTypes = {
  colorOnScrollValue: PropTypes.number
};
HomeNavbar.defaultProps = {
  colorOnScrollValue: 300
};

export default HomeNavbar;
