import {
  lazy
} from 'react';

const publicRoutes = [
  {
    layout: '/public',
    path: '/Login',
    name: 'Login',
    component: lazy(() => import('views/Public/LoginView'))
  },
  {
    layout: '/public',
    path: '/ForgotPassword',
    name: 'ForgotPassword',
    component: lazy(() => import('views/Public/ForgotPassword'))
  },
  {
    layout: '/public',
    path: '/Register',
    name: 'Register',
    component: lazy(() => import('views/Public/RegisterView'))
  },
  {
    layout: '/public',
    path: '/PrivacyPolicy',
    name: 'Privacy Policy',
    component: lazy(() => import('views/Public/PrivacyPolicyView'))
  },
  {
    layout: '/public',
    path: '/TermsOfUse',
    name: 'Terms of Use',
    component: lazy(() => import('views/Public/TermsOfUseView'))
  }
];

export default publicRoutes;
