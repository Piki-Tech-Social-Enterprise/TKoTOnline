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
    icon: null,
    roles: {},
    excludeFromAuthenticatedRoutes: true
  },
  {
    layout: '/auth',
    path: '/Dashboard',
    name: 'Dashboard',
    component: lazy(() => import('views/Auth/AuthDashboardView')),
    icon: 'design_app',
    roles: systemAdminRoleOnly,
    excludeFromAuthenticatedRoutes: false
  },
  {
    layout: '/auth',
    path: '/ResourceDrive',
    name: 'Resource Drive',
    component: lazy(() => import('views/Auth/AuthResourceDriveView')),
    icon: 'business_bank',
    roles: basicRoleUp,
    excludeFromAuthenticatedRoutes: false
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
