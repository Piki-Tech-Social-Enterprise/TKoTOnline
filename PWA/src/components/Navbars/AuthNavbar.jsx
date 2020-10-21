import React, {
  useState,
  createRef,
  useEffect
} from 'react';
import {
  withFirebase
} from '../Firebase/Contexts/firebaseContext';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container
} from 'reactstrap';
import {
  useWindowEvent
} from 'components/App/Utilities';

const AuthNavbar = props => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [color, setColor] = useState('transparent');
  const {
    firebase,
    history
  } = props;
  const sidebarToggleRef = createRef();
  const handleNavbarToggleClick = () => {
    setColor(isOpen
      ? 'transparent'
      : 'white');
    setIsOpen(!isOpen);
  };
  const dropdownToggle = async e => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen);
  };
  const getBrand = () => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].path === props.match.path) {
        return routes[i].name;
      }
    }
    return "Admin Dashboard";
    // const {
    //   routes,
    //   location,
    //   match
    // } = props;
    // const {
    //   pathname
    // } = location;
    // const isMatch = (routeLayout, routePath, pathName) => {
    //   console.log(`routeLayout: ${routeLayout}, routePath: ${routePath}, pathname: ${pathname}`);
    //   let fullRoutePath = `${routeLayout}${routePath}`;
    //   if (fullRoutePath === pathName) {
    //     return true;
    //   }
    //   const {
    //     params
    //   } = match;
    //   console.log(`params: ${JSON.stringify(params, null, 2)}`);
    //   let isParamAMatch = false;
    //   Object.keys(params).map(paramKey => {
    //     const param = params[paramKey];
    //     console.log(`routeLayout: ${routeLayout}, paramKey: ${paramKey}, param: ${param}, pathname: ${pathname}`);
    //     fullRoutePath = `${routeLayout}${routePath.replace(paramKey, param)}`;
    //     if (!isParamAMatch && fullRoutePath === pathName) {
    //       isParamAMatch = true;
    //     }
    //     return null;
    //   });
    //   return isParamAMatch;
    // };
    // let name = null;
    // routes.map(route => {
    //   if (route.collapse) {
    //     route.views.map(view => {
    //       if (view.path === pathname) {
    //         name = view.name;
    //       }
    //       return null;
    //     });
    //   } else if (isMatch(route.layout, route.path, pathname)) {
    //     name = route.name;
    //   }
    //   return null;
    // });
    // return name;
  };
  const openSidebar = () => {
    document.documentElement.classList.toggle('nav-open');
    sidebarToggleRef.current.classList.toggle('toggled');
  };
  const updateColor = () => {
    setColor(window.innerWidth < 993 && isOpen
      ? 'white'
      : 'transparent');
  };
  const handleViewProfileClick = async e => {
    e.preventDefault();
    history.push('/auth/Profile');
  };
  const handleLogoutClick = async e => {
    e.preventDefault();
    await firebase.signOut();
    history.push('/');
  };
  useWindowEvent('resize', updateColor);
  useEffect(() => {
    const {
      classList: sidebarToggleCssClasses
    } = sidebarToggleRef.current;
    return () => {
      if (
        window.innerWidth < 993 &&
        props.history.location.pathname !== props.location.pathname &&
        document.documentElement.className.indexOf('nav-open') !== -1
      ) {
        document.documentElement.classList.toggle('nav-open');
        sidebarToggleCssClasses.toggle('toggled');
      }
    };
  }, [props, sidebarToggleRef]);
  return (
    <Navbar
      color={
        props.location.pathname.indexOf('full-screen-maps') !== -1
          ? 'white'
          : color
      }
      expand='lg'
      className={
        props.location.pathname.indexOf('full-screen-maps') !== -1
          ? 'navbar-absolute fixed-top'
          : 'navbar-absolute fixed-top ' +
          (color === 'transparent'
            ? 'navbar-transparent '
            : '')
      }
    >
      <Container fluid>
        <div className='navbar-wrapper'>
          <div className='navbar-toggle'>
            <button type='button' ref={sidebarToggleRef} className='navbar-toggler' onClick={openSidebar}>
              <span className='navbar-toggler-bar bar1' />
              <span className='navbar-toggler-bar bar2' />
              <span className='navbar-toggler-bar bar3' />
            </button>
          </div>
          <NavbarBrand href='/'>{getBrand()}</NavbarBrand>
        </div>
        <NavbarToggler onClick={handleNavbarToggleClick}>
          <span className='navbar-toggler-bar navbar-kebab' />
          <span className='navbar-toggler-bar navbar-kebab' />
          <span className='navbar-toggler-bar navbar-kebab' />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar className='justify-content-end'>
          <Nav navbar>
            <Dropdown nav isOpen={dropdownOpen} toggle={dropdownToggle}>
              <DropdownToggle caret nav>
                <i className='now-ui-icons location_world' />
                <p>
                  <span className='d-lg-none d-md-block'>Account</span>
                </p>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag="a" href="#tkot" onClick={handleViewProfileClick}>
                  <i className='now-ui-icons users_circle-08' />
                  <p>Edit Profile</p>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag="a" href="#tkot" onClick={handleLogoutClick}>
                  <i className='now-ui-icons sport_user-run' />
                  <p>Logout</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default withFirebase(AuthNavbar);
