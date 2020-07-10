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

const {
  iwiMembers,
  about,
  // communityLinks,
  newsFeed,
  // interactiveMap,
  // volunteers,
  // facebookLinks,
  events,
  solutions,
  // aboutUs,
  // contactUs
} = Routes;
const HomeNavbar = props => {
  const {
    initalTransparent
  } = props;
  const colorOnScrollValue = 300;
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
  }, [defaultTkotBackground])
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
                <NavLink href={iwiMembers}>Iwi</NavLink>
              </NavItem>
              <NavItem active={hash !== '' && about.endsWith(hash)}>
                <NavLink href={about}>About</NavLink>
              </NavItem>
              <NavItem active={hash !== '' && solutions.endsWith(hash)}>
                <NavLink href={solutions}>Projects</NavLink>
              </NavItem>
              <NavItem active={hash !== '' && events.endsWith(hash)}>
                <NavLink href={events}>Wananga</NavLink>
              </NavItem>
              <NavItem active={hash !== '' && newsFeed.endsWith(hash)}>
                <NavLink href={newsFeed}>News</NavLink>
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
              {/* <NavItem active={pathname.endsWith(aboutUs)}>
                <NavLink href={aboutUs}>About</NavLink>
              </NavItem> */}
              {/* <NavItem active={pathname.endsWith(contactUs)}>
                <NavLink href={contactUs}>Contact</NavLink>
              </NavItem> */}
              <NavItem>
                <Button href={`${REACT_APP_PWA_BASE_URL}/public/Login`} outline color='light'>
                  Login
                </Button>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default HomeNavbar;
