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
  }
];

export default authRoutes;
