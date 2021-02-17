import React, {
  useState,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const NavItems = lazy(async () => await import(/* webpackPrefetch: true */'components/App/NavItems'));
const Collapse = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Collapse'));
const Navbar = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Navbar'));
const Nav = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Nav'));
const Container = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Container'));
const LoadingSpinner = lazy(async () => await import(/* webpackPrefetch: true */'components/App/LoadingSpinner'));
const INITIAL_STATE = {
  isLoading: true,
  navItems: [],
  collapseOpen: false,
  navbarColor: 'tkot-background-white'
};
const HomeNavbar = props => {
  const {
    isHomePage
  } = props;
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading,
    navItems
  } = state;
  const {
    pathname,
    hash
  } = window.location;
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
  const {
    REACT_APP_WEB_BASE_URL
  } = process.env;
  const tkotLogoOnlyBlackUrl = new URL('/static/img/tkot-logo-only-black.webp', REACT_APP_WEB_BASE_URL).toString();
  useEffect(() => {
    const scrollEventName = 'scroll';
    const updateNavbarColor = () => {
      const {
        initalTransparent,
        colorOnScrollValue
      } = props;
      const tkotBackgroundTransparent = 'tkot-background-transparent';
      const tkotBackgroundWhite = 'tkot-background-white';
      const defaultTkotBackground = initalTransparent || false
        ? tkotBackgroundTransparent
        : tkotBackgroundWhite;
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
    const retrieveData = async () => {
      const {
        isHomePage
      } = props;
      const {
        getNavItems
      } = await import(/* webpackPrefetch: true */'components/App/Utilities');
      const navItems = getNavItems(isHomePage);
      window.addEventListener(scrollEventName, updateNavbarColor);
      setState(s => ({
        ...s,
        isLoading: false,
        navItems
      }));
    };
    if (isLoading) {
      retrieveData();
    }
    return () => {
      !isLoading && window.removeEventListener(scrollEventName, updateNavbarColor);
    }
  }, [props, isLoading]);
  return (
    <>
      {
        state.collapseOpen
          ? <div id="bodyClick" onClick={handleTogglerClick} />
          : null
      }
      {
        isLoading
          ? <LoadingSpinner caller="HomeNavbar" />
          : <>
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
                    <img alt="..." className="n-logo mx-3 d-none d-lg-inline lazyload" data-src={tkotLogoOnlyBlackUrl} src={tkotLogoOnlyBlackUrl} width="32" height="62" />
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
      }
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
