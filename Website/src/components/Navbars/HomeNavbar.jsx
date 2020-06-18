import React, {
  useState
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
  communityLinks,
  newsFeed,
  // interactiveMap,
  // volunteers,
  facebookLinks,
  events,
  aboutUs,
  contactUs
} = Routes;

const HomeNavbar = () => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const {
    pathname,
    hash
  } = window.location;
  console.log(`pathname: ${pathname}`)
  const {
    REACT_APP_PWA_BASE_URL
  } = process.env;
  return (
    <>
      {collapseOpen ? (
        <div id="bodyClick" onClick={() => {
          document.documentElement.classList.toggle("nav-open");
          setCollapseOpen(false);
        }} />
      ) : null}
      <Navbar className={"fixed-top"} expand="lg">
        <Container>
          <div className="navbar-translate">
            <a href="/">
              <img alt="..." className="n-logo" src={require("assets/img/tkot/tkot-logo-512x512.png")} width="75" />
            </a>
            <button className="navbar-toggler navbar-toggler" aria-expanded={collapseOpen} type="button" onClick={() => {
              document.documentElement.classList.toggle("nav-open");
              setCollapseOpen(!collapseOpen);
            }}>
              <span className="navbar-toggler-bar top-bar"></span>
              <span className="navbar-toggler-bar middle-bar"></span>
              <span className="navbar-toggler-bar bottom-bar"></span>
            </button>
          </div>
          <Collapse className="justify-content-end" isOpen={collapseOpen} navbar>
            <Nav navbar>
              <NavItem active={hash !== '' && communityLinks.endsWith(hash)}>
                <NavLink href={communityLinks}>Community</NavLink>
              </NavItem>
              <NavItem active={hash !== '' && newsFeed.endsWith(hash)}>
                <NavLink href={newsFeed}>News</NavLink>
              </NavItem>
              <NavItem active={hash !== '' && events.endsWith(hash)}>
                <NavLink href={events}>Events</NavLink>
              </NavItem>
              {/* <NavItem active={hash && interactiveMap.endsWith(hash)}>
                <NavLink href={interactiveMap}>Interactive Map</NavLink>
              </NavItem> */}
              {/* <NavItem active={hash !== '' && volunteers.endsWith(hash)}>
                <NavLink href={volunteers}>Volunteers</NavLink>
              </NavItem> */}
              <NavItem active={hash !== '' && pathname.endsWith(facebookLinks)}>
                <NavLink href={facebookLinks}>Facebook</NavLink>
              </NavItem>
              <NavItem active={pathname.endsWith(aboutUs)}>
                <NavLink href={aboutUs}>About</NavLink>
              </NavItem>
              <NavItem active={pathname.endsWith(contactUs)}>
                <NavLink href={contactUs}>Contact</NavLink>
              </NavItem>
              <NavItem>
                <Button href={`${REACT_APP_PWA_BASE_URL}/public/Login`} outline>
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
