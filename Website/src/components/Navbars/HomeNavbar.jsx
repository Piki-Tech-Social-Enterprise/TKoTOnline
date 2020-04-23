import React from "react";
import {
  Collapse,
  Navbar,
  NavItem,
  Nav,
  Container,
  Button,
  NavLink
} from "reactstrap";

import Routes from '../Routes/routes';

const {
  newsFeed,
  interactiveMap,
  volunter
} = Routes;

function HomeNavbar() {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const {
    pathname
  } = window.location;
  
  return (
    <>
      {collapseOpen ? (
        <div
          id="bodyClick"
          onClick={() => {
            document.documentElement.classList.toggle("nav-open");
            setCollapseOpen(false);
          }}
        />
      ) : null}
      <Navbar className={"fixed-top"} expand="lg">
        <Container>
          <div className="navbar-translate">
          <img
              alt="..."
              className="n-logo"
              src={require("assets/img/tkot/tkot-logo-512x512.png")}
              width="75"
            ></img>
        
            <button
              className="navbar-toggler navbar-toggler"
              onClick={() => {
                document.documentElement.classList.toggle("nav-open");
                setCollapseOpen(!collapseOpen);
              }}
              aria-expanded={collapseOpen}
              type="button"
            >
              <span className="navbar-toggler-bar top-bar"></span>
              <span className="navbar-toggler-bar middle-bar"></span>
              <span className="navbar-toggler-bar bottom-bar"></span>
            </button>
          </div>
          <Collapse
            className="justify-content-end"
            isOpen={collapseOpen}
            navbar
          >
            <Nav navbar>
              <NavItem active={pathname.endsWith(newsFeed)}>
                   <NavLink href={newsFeed}>News Feed</NavLink>
              </NavItem>
              <NavItem active={pathname.endsWith(interactiveMap)}>
                   <NavLink href={interactiveMap}>Interactive Map</NavLink>
              </NavItem>
              <NavItem active={pathname.endsWith(volunter)}>
                   <NavLink href={volunter}>Volunter</NavLink>
              </NavItem>
              <NavItem>
                <Button outline color="white">
                      Login
                </Button>
              </NavItem>
              </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default HomeNavbar;
