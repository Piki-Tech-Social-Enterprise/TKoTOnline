import React, {
  useState,
  createRef,
  useEffect
} from 'react';
import {
  Link
} from 'react-router-dom';
import {
  withFirebase
} from '../Firebase/Contexts/firebaseContext';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupText,
  InputGroupAddon,
  Input
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
    const {
      routes,
      location
    } = props;
    const {
      pathname
    } = location;
    let name = null;
    routes.map(route => {
      if (route.collapse) {
        route.views.map(view => {
          if (view.path === pathname) {
            name = view.name;
          }
          return null;
        });
      } else if (route.path === pathname) {
        name = route.name;
      }
      return null;
    });
    return name;
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
          <form>
            <InputGroup className='no-border'>
              <Input placeholder='Search...' />
              <InputGroupAddon addonType='append'>
                <InputGroupText>
                  <i className='now-ui-icons ui-1_zoom-bold' />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </form>
          <Nav navbar>
            <NavItem>
              <Link to='#pablo' className='nav-link'>
                <i className='now-ui-icons media-2_sound-wave' />
                <p>
                  <span className='d-lg-none d-md-block'>Stats</span>
                </p>
              </Link>
            </NavItem>
            <Dropdown nav isOpen={dropdownOpen} toggle={e => dropdownToggle(e)}>
              <DropdownToggle caret nav>
                <i className='now-ui-icons location_world' />
                <p>
                  <span className='d-lg-none d-md-block'>Some Actions</span>
                </p>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag='a' >Action</DropdownItem>
                <DropdownItem tag='a'>Another Action</DropdownItem>
                <DropdownItem tag='a'>Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <NavItem>
              <Link to='#pablo' className='nav-link' onClick={handleLogoutClick}>
                <i className='now-ui-icons sport_user-run' />
                <p>
                  <span className='d-lg-none d-md-block'>Logout</span>
                </p>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default withFirebase(AuthNavbar);
