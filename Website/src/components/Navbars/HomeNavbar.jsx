import React, {
  useState,
  useEffect
} from 'react';
import {
  Collapse,
  Navbar,
  NavItem,
  Nav,
  Container,
  Button,
  NavLink
} from 'reactstrap';
import Routes from '../Routes/routes';
import PropTypes from 'prop-types';
import {
  ScrollspyNavLink
} from 'reactstrap-scrollspy';

const {
  iwiMembers,
  about,
  // communityLinks,
  newsFeed,
  newsFeeds,
  // interactiveMap,
  // volunteers,
  // facebookLinks,
  events,
  eventsPage,
  projects,
  aboutUs,
  contactUs,
  projectsPage
} = Routes;
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
  const {
    REACT_APP_PWA_BASE_URL
  } = process.env;
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
      <Navbar className={`fixed-top ${state.navbarColor}`} expand="lg">
        <Container className="pl-0">
          <div className="navbar-translate">
            <a href="/">
              <img alt="..." className="n-logo" src={require("assets/img/tkot/tkot-mixed-no-tag-line.png")} width="180" />
            </a>
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
          <Collapse className="justify-content-end" isOpen={state.collapseOpen} navbar>
            <Nav navbar>
              <NavItem active={hash !== '' && iwiMembers.endsWith(hash)}>
                <ScrollspyNavLink name={iwiMembers.replace('/#', '')}>
                  <NavLink href={iwiMembers}>Iwi</NavLink>
                </ScrollspyNavLink>
              </NavItem>
              {
                isHomePage
                  ? <>
                    <NavItem active={hash !== '' && about.endsWith(hash)}>
                      <ScrollspyNavLink name={about.replace('/#', '')}>
                        <NavLink href={about}>About</NavLink>
                      </ScrollspyNavLink>
                    </NavItem>
                    <NavItem active={hash !== '' && projects.endsWith(hash)}>
                      <ScrollspyNavLink name={projects.replace('/#', '')}>
                        <NavLink href={projects}>Projects</NavLink>
                      </ScrollspyNavLink>
                    </NavItem>
                    <NavItem active={hash !== '' && events.endsWith(hash)}>
                      <ScrollspyNavLink name={events.replace('/#', '')}>
                        <NavLink href={events}>Wananga</NavLink>
                      </ScrollspyNavLink>
                    </NavItem>
                    <NavItem active={hash !== '' && newsFeed.endsWith(hash)}>
                      <ScrollspyNavLink name={newsFeed.replace('/#', '')}>
                        <NavLink href={newsFeed}>News</NavLink>
                      </ScrollspyNavLink>
                    </NavItem>
                  </>
                  : <>
                    <NavItem active={pathname.endsWith(aboutUs)}>
                      <NavLink href={aboutUs}>About</NavLink>
                    </NavItem>
                    <NavItem active={pathname.endsWith(projectsPage)}>
                      <NavLink href={projectsPage}>Projects</NavLink>
                    </NavItem>
                    <NavItem active={pathname.endsWith(eventsPage)}>
                      <NavLink href={eventsPage}>Wananga</NavLink>
                    </NavItem>
                    <NavItem active={pathname.endsWith(newsFeeds)}>
                      <NavLink href={newsFeeds}>News</NavLink>
                    </NavItem>
                  </>
              }
              <NavItem active={pathname.endsWith(contactUs)}>
                <NavLink href={contactUs}>Contact</NavLink>
              </NavItem>
              <NavItem>
                <Button href={`${REACT_APP_PWA_BASE_URL}/public/Login`} outline color='light'>
                  Login
                </Button>
              </NavItem>
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
