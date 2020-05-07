import React from 'react';
import {
  Route
} from 'react-router';
import Routes from '../src/components/Routes/routes';

export default (
  <Route>
    {
      Object.keys(Routes).map(key => {
        const path = Routes[key];
        if (path.startsWith('#')) return null;
        return <Route path={path} key={key} exact />
      })
    }
  </Route>
);