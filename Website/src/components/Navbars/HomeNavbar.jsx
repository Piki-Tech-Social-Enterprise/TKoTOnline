import React from "react";
import {
  Collapse,
  Navbar,
  NavItem,
  Nav,
  Container,
  Button
} from "reactstrap";

function HomeNavbar() {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  
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
      <Navbar className={"fixed-top "} style={{backgroundColor: '#171b5d'}} expand="lg">
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
            <Nav navbar style={{color: '#ffffff', background: '#171b5d', marginTop: '0px', paddingTop: '50px'}}>
              <NavItem style={{padding: '15px'}}>
              Link 1 
              </NavItem>
              <NavItem style={{padding: '15px'}}>
             Link 2 
               
              </NavItem>
              <NavItem style={{padding: '15px'}}>
              Link 3 
              </NavItem>
              <NavItem style={{padding: '15px'}}>
             Link 4
               
              </NavItem>
              <NavItem style={{paddingLeft: '15px'}}>
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
