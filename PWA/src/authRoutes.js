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
    path: '/Profile',
    name: 'Profile',
    component: lazy(async () => await import('views/Auth/AuthUserView')),
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: basicRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: true
  },
  // {
  //   layout: '/auth',
  //   path: '/Dashboard',
  //   name: 'Dashboard',
  //   component: lazy(async () => await import('views/Auth/AuthDashboardView')),
  //   exact: true,
  //   iconLibrary: 'now-ui-icons',
  //   icon: 'design_app',
  //   roles: systemAdminRoleOnly,
  //   excludeFromAuthenticatedRoutes: false,
  //   excludeFromSidebar: false
  // },
  // {
  //   layout: '/auth',
  //   path: '/ResourceDrive',
  //   name: 'Resource Drive',
  //   component: lazy(async () => await import('views/Auth/AuthResourceDriveView')),
  //   exact: true,
  //   iconLibrary: 'now-ui-icons',
  //   icon: 'business_bank',
  //   roles: basicRoleUp,
  //   excludeFromAuthenticatedRoutes: false,
  //   excludeFromSidebar: false
  // },
  // {
  //   layout: '/auth',
  //   path: '/CommunityLinks',
  //   name: 'Community Links',
  //   component: lazy(async () => await import('views/Auth/AuthCommunityLinksView')),
  //   exact: true,
  //   iconLibrary: 'now-ui-icons',
  //   icon: 'objects_support-17',
  //   roles: adminRoleUp,
  //   excludeFromAuthenticatedRoutes: false,
  //   excludeFromSidebar: false
  // },
  // {
  //   layout: '/auth',
  //   path: '/CommunityLinks/:clid',
  //   name: 'Community Link',
  //   component: lazy(async () => await import('views/Auth/AuthCommunityLinkView')),
  //   exact: true,
  //   iconLibrary: null,
  //   icon: null,
  //   roles: adminRoleUp,
  //   excludeFromAuthenticatedRoutes: false,
  //   excludeFromSidebar: true
  // },
  {
    layout: '/auth',
    path: '/Settings',
    name: 'Settings',
    component: lazy(async () => await import('views/Auth/AuthSettingsView')),
    exact: true,
    iconLibrary: 'now-ui-icons',
    icon: 'ui-1_settings-gear-63',
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/IwiMembers',
    name: 'Iwi',
    component: lazy(async () => await import('views/Auth/AuthIwiMembersView')),
    exact: true,
    iconLibrary: 'now-ui-icons',
    icon: 'education_paper',
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/IwiMembers/:imid',
    name: 'Iwi Member',
    component: lazy(async () => await import('views/Auth/AuthIwiMemberView')),
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: true
  },
  {
    layout: '/auth',
    path: '/Projects',
    name: 'Projects',
    component: lazy(async () => await import('views/Auth/AuthProjectsView')),
    exact: true,
    iconLibrary: 'now-ui-icons',
    icon: 'business_bulb-63',
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/Projects/:pid',
    name: 'Project',
    component: lazy(async () => await import('views/Auth/AuthProjectView')),
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: true
  },
  {
    layout: '/auth',
    path: '/Wananga',
    name: 'Wananga/Events',
    component: lazy(async () => await import('views/Auth/AuthEventsView')),
    exact: true,
    iconLibrary: 'now-ui-icons',
    icon: 'ui-1_calendar-60',
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/Wananga/:evid',
    name: 'Wananga/Event',
    component: lazy(async () => await import('views/Auth/AuthEventView')),
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: true
  },
  {
    layout: '/auth',
    path: '/NewsFeeds',
    name: 'News',
    component: lazy(async () => await import('views/Auth/AuthNewsFeedsView')),
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
    component: lazy(async () => await import('views/Auth/AuthNewsFeedView')),
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: true
  },
  {
    layout: '/auth',
    path: '/Resources',
    name: 'Resources',
    component: lazy(async () => await import('views/Auth/AuthResourcesView')),
    exact: true,
    iconLibrary: 'now-ui-icons',
    icon: 'ui-2_favourite-28',
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/Resources/:rid',
    name: 'Resource',
    component: lazy(async () => await import('views/Auth/AuthResourceView')),
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: true
  },
  {
    layout: '/auth',
    path: '/EconomicDevelopments',
    name: 'Economic Developments',
    component: lazy(async () => await import('views/Auth/AuthEconomicDevelopmentsView')),
    exact: true,
    iconLibrary: 'now-ui-icons',
    icon: 'business_bank',
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/EconomicDevelopments/:edid',
    name: 'Economic Development',
    component: lazy(async () => await import('views/Auth/AuthEconomicDevelopmentView')),
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: true
  },
  // {
  //   layout: '/auth',
  //   path: '/Volunteers',
  //   name: 'Volunteers',
  //   component: lazy(async () => await import('views/Auth/AuthVolunteersView')),
  //   exact: true,
  //   iconLibrary: 'now-ui-icons',
  //   icon: 'users_circle-08',
  //   roles: adminRoleUp,
  //   excludeFromAuthenticatedRoutes: false,
  //   excludeFromSidebar: false
  // },
  // {
  //   layout: '/auth',
  //   path: '/Volunteers/:vid',
  //   name: 'Volunteer',
  //   component: lazy(async () => await import('views/Auth/AuthVolunteerView')),
  //   exact: true,
  //   iconLibrary: null,
  //   icon: null,
  //   roles: adminRoleUp,
  //   excludeFromAuthenticatedRoutes: false,
  //   excludeFromSidebar: true
  // },
  {
    layout: '/auth',
    path: '/FacebookLinks',
    name: 'Facebook RSS',
    component: lazy(async () => await import('views/Auth/AuthFacebookLinksView')),
    exact: true,
    iconLibrary: 'fab',
    icon: 'fa-facebook-f',
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/FacebookLinks/:fid',
    name: 'Facebook RSS',
    component: lazy(async () => await import('views/Auth/AuthFacebookLinkView')),
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: true
  },
  {
    layout: '/auth',
    path: '/Contacts',
    name: 'Contact Messages',
    component: lazy(async () => await import('views/Auth/AuthContactsView')),
    exact: true,
    iconLibrary: 'now-ui-icons',
    icon: 'ui-1_email-85',
    roles: basicRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/Contacts/:cid',
    name: 'Contact Message',
    component: lazy(async () => await import('views/Auth/AuthContactView')),
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: basicRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: true
  },
  {
    layout: '/auth',
    path: '/EPanui',
    name: 'E-Pānui List',
    component: lazy(async () => await import('views/Auth/AuthEPanuiListView')),
    exact: true,
    iconLibrary: 'now-ui-icons',
    icon: 'ui-1_send',
    roles: basicRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/EPanui/:eid',
    name: 'E-Pānui',
    component: lazy(async () => await import('views/Auth/AuthEPanuiView')),
    exact: true,
    iconLibrary: null,
    icon: null,
    roles: basicRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: true
  },
  {
    layout: '/auth',
    path: '/Users',
    name: 'Users',
    component: lazy(async () => await import('views/Auth/AuthUsersView')),
    exact: true,
    iconLibrary: 'fas',
    icon: 'fa-users',
    roles: adminRoleUp,
    excludeFromAuthenticatedRoutes: false,
    excludeFromSidebar: false
  },
  {
    layout: '/auth',
    path: '/Users/:uid',
    name: 'User',
    component: lazy(async () => await import('views/Auth/AuthUserView')),
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
