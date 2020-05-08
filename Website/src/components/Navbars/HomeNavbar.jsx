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
  volunteers
} = Routes;

const HomeNavbar = () => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const {
    pathname
  } = window.location;
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
              <NavItem active={pathname.endsWith(communityLinks)}>
                <NavLink href={communityLinks}>Community Links</NavLink>
              </NavItem>
              <NavItem active={pathname.endsWith(newsFeed)}>
                <NavLink href={newsFeed}>News Feed</NavLink>
              </NavItem>
              {/* <NavItem active={pathname.endsWith(interactiveMap)}>
                <NavLink href={interactiveMap}>Interactive Map</NavLink>
              </NavItem> */}
              <NavItem active={pathname.endsWith(volunteers)}>
                <NavLink href={volunteers}>Volunteers</NavLink>
              </NavItem>
              <NavItem>
                <Button outline color="white" href={`${REACT_APP_PWA_BASE_URL}/public/Login`}>
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
