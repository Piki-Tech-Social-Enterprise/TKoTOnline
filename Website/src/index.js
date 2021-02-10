/*

=========================================================
* Now UI Kit React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-kit-react
* Copyright 2019 Creative Tim (http://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-kit-react/blob/master/LICENSE.md)

* Designed by www.invisionapp.com Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Route,
  Switch
} from "react-router-dom";
import Firebase, {
  FirebaseContext
} from 'components/Firebase';
import PageLoadingSpinner from 'components/App/PageLoadingSpinner';
import LazySizes from 'components/App/LazySizes';
import Routes from 'components/Routes/routes';
import {
  lazy
} from 'react-lazy-no-flicker';

const appRoutes = [
  {
    path: Routes.home,
    component: lazy(async () => await import(/* webpackPreload: true */'views/HomeView'))
  },
  {
    path: Routes.privacyPolicy,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/PrivacyPolicyView'))
  },
  {
    path: Routes.termsOfUse,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/TermsOfServiceView'))
  },
  {
    path: Routes.aboutUs,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/AboutUsView'))
  },
  {
    path: Routes.contactUs,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/ContactUsView'))
  },
  {
    path: Routes.projectsPage,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/ProjectsView'))
  },
  {
    path: Routes.projectPage,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/ProjectView'))
  },
  {
    path: Routes.newsFeeds,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/NewsFeedsView'))
  },
  {
    path: Routes.newsFeed,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/NewsFeedView'))
  },
  {
    path: Routes.events,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/EventsView'))
  },
  {
    path: Routes.event,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/EventView'))
  },
  {
    path: Routes.iwiChair,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/IwiChairView'))
  },
  {
    path: Routes.resourcesPage,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/ResourcesView'))
  },
  {
    path: Routes.facebookLinks,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/FacebookLinksView'))
  },
  // {
  //   path: Routes.facebookLink,
  //   component: lazy(async () => await import(/* webpackPrefetch: true */'views/FacebookLinkView'))
  // },
  // {
  //   path: Routes.resourceCardPage,
  //   component: lazy(async () => await import(/* webpackPrefetch: true */'views/ResourceCardView'))
  // },
  {
    path: Routes.economicDevelopmentsPage,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/EconomicDevelopmentsView'))
  },
  // {
  //   path: Routes.economicDevelopmentCardPage,
  //   component: lazy(async () => await import(/* webpackPrefetch: true */'views/EconomicDevelopmentCardView'))
  // },
  {
    path: Routes.mediaListPage,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/NewsFeedsView'))
  },
  {
    path: Routes.mediaPage,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/NewsFeedView'))
  },
  {
    path: Routes.covidListPage,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/CovidListView'))
  },
  {
    path: Routes.covidPage,
    component: lazy(async () => await import(/* webpackPrefetch: true */'views/CovidView'))
  },
  // {
  //   path: '',
  //   component: lazy(async () => await import(/* webpackPrefetch: true */'views/Global404View'))
  // }
];
const GoogleAnalytics = lazy(async () => await import(/* webpackPreload: true */'components/App/GoogleAnalytics'));

if (process.env.NODE_ENV === 'production') {
  window['console']['log'] = () => { };
}

ReactDOM.render(
  <React.Suspense fallback={<PageLoadingSpinner caller="Root" />}>
    <LazySizes />
    <Firebase>
      {
        firebase => <>
          <FirebaseContext.Provider value={firebase}>
            <BrowserRouter>
              <Switch>
                {
                  appRoutes.map((ar, index) => {
                    const {
                      path,
                      component: Component
                    } = ar;
                    return (
                      <Route
                        path={path}
                        render={props => <Component
                          {...props}
                        />}
                        exact
                        key={index}
                      />
                    );
                  })
                }
              </Switch>
              <GoogleAnalytics />
            </BrowserRouter>
          </FirebaseContext.Provider>
        </>
      }
    </Firebase>
  </React.Suspense>,
  document.getElementById("root")
);
