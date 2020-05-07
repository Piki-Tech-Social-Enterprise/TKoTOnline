import React from 'react';
import {
  Route
} from 'react-router';

const publicRoutes = [
  {
    layout: '/public',
    path: '/Login'
  },
  {
    layout: '/public',
    path: '/ForgotPassword'
  },
  {
    layout: '/public',
    path: '/Register'
  },
  {
    layout: '/public',
    path: '/PrivacyPolicy'
  },
  {
    layout: '/public',
    path: '/TermsOfUse'
  }
];

export default (
  <Route>
    {
      Object.keys(publicRoutes).map(key => {
        const {
          layout,
          path
        } = publicRoutes[key];
        if (path.startsWith('#')) return null;
        return <Route path={`${layout}/${path}`} key={key} exact />
      })
    }
  </Route>
);