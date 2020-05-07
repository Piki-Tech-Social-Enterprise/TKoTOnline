import {
  lazy
} from 'react';

/*
!!! P L E A S E   E N S U R E   T O   U P D A T E   T H E   S I T E M A P   R O U T E S   F I L E  A S   W E L L !!!
*/
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
