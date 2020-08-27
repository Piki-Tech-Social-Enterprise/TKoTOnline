import React, {
  useState,
  lazy
} from 'react';
import {
  Collapse,
  Navbar,
  Nav,
  Container
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  useWindowEvent,
  getNavItems
} from 'components/App/Utilities';

const NavItems = lazy(async () => await import('components/App/NavItems'));
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
  const navItems = getNavItems(isHomePage);
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
  const handleTogglerClick = async (e, isButtonClick = false) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    setState(s => ({
      ...s,
      collapseOpen: !isButtonClick
        ? false
        : !state.collapseOpen
    }));
  };
  useWindowEvent('scroll', updateNavbarColor);
  return (
    <>
      {
        state.collapseOpen
          ? <div id="bodyClick" onClick={handleTogglerClick} />
          : null
      }
      <Navbar className={`fixed-top ${state.navbarColor}`} expand="lg" id="HomeNavbar">
        <Container className="pl-0">
          <div className="navbar-translate">
            <button className="navbar-toggler navbar-toggler" aria-expanded={state.collapseOpen} type="button" onClick={async e => handleTogglerClick(e, true)}>
              <span className="navbar-toggler-bar top-bar"></span>
              <span className="navbar-toggler-bar middle-bar"></span>
              <span className="navbar-toggler-bar bottom-bar"></span>
            </button>
          </div>
          <Collapse className="justify-content-center" isOpen={state.collapseOpen} navbar>
            <a href="/">
              <img alt="..." className="n-logo mx-3 d-none d-lg-inline lazyload" data-src={require("assets/img/tkot/tkot-logo-only-black.webp")} width="32" />
            </a>
            <Nav navbar>
              <NavItems
                useScrollspyNavLinks={isHomePage}
                pathname={pathname}
                hash={hash}
                items={navItems}
                includeTooltips={true}
              />
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
