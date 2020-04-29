import {
  lazy
} from 'react';
import {
  basicRole,
  adminRole,
  systemAdminRole
} from 'components/Domains/Roles';

const basicRoleUp = {
  systemAdminRole,
  adminRole,
  basicRole
};
const adminRoleUp = {
  systemAdminRole,
  adminRole
};
const adminRoleOnly = {
  adminRole
};
const systemAdminRoleOnly = {
  systemAdminRole
};
const authRoutes = [
  {
    layout: '/auth',
    path: '/',
    name: 'Home',
    component: null,
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: {},
    excludeFromAuthenticatedRoutes: true,
    excludeFromSidebar: true
  },
  {
    layout: '/auth',
    path: '/Dashboard',
    name: 'Dashboard',
    component: lazy(() => import('views/Auth/AuthDashboardView')),
    exact: true,
    iconLibrary: 'now-ui-icons',
    icon: 'design_app',
    roles: systemAdminRoleOnly,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/ResourceDrive',
    name: 'Resource Drive',
    component: lazy(() => import('views/Auth/AuthResourceDriveView')),
    exact: true,
    iconLibrary: 'now-ui-icons',
    icon: 'business_bank',
    roles: basicRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/NewsFeeds',
    name: 'News Feeds',
    component: lazy(() => import('views/Auth/AuthNewsFeedsView')),
    exact: true,
    iconLibrary: 'now-ui-icons',
    icon: 'objects_planet',
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/NewsFeeds/:nfid',
    name: 'News Feed',
    component: lazy(() => import('views/Auth/AuthNewsFeedView')),
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: true
  }
];
const getAuthRouteByName = name => {
  return authRoutes.find(ar => ar.name === name);
};

export default authRoutes;
export {
  basicRoleUp,
  adminRoleUp,
  adminRoleOnly,
  systemAdminRoleOnly,
  getAuthRouteByName
};
