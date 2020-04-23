import {
  lazy
} from 'react';

const authRoutes = [
  {
    layout: '/auth',
    path: '/Dashboard',
    name: 'Dashboard',
    component: lazy(() => import('views/Auth/AuthDashboardView')),
    icon: 'design_app'
  },
  {
    layout: '/auth',
    path: '/ResourceDrive',
    name: 'Resource Drive',
    component: lazy(() => import('views/Auth/AuthResourceDriveView')),
    icon: 'business_bank'
  }
];

export default authRoutes;
