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
import LoadingSpinner from 'components/App/LoadingSpinner';
import "assets/scss/now-ui-kit.scss";
import 'assets/scss/tkot.scss';
import 'assets/fontawesome-free-5.15.1-web/scss/fontawesome.scss';
import 'assets/fontawesome-free-5.15.1-web/scss/brands.scss';
import 'assets/fontawesome-free-5.15.1-web/scss/regular.scss';
import 'assets/fontawesome-free-5.15.1-web/scss/solid.scss';
import 'assets/fontawesome-free-5.15.1-web/scss/v4-shims.scss';
import 'lazysizes';
import Routes from 'components/Routes/routes';
import {
  lazy
} from 'react-lazy-no-flicker';

const appRoutes = [
  {
    path: Routes.home,
    component: lazy(async () => await import('views/HomeView'))
  },
  {
    path: Routes.privacyPolicy,
    component: lazy(async () => await import('views/PrivacyPolicyView'))
  },
  {
    path: Routes.termsOfUse,
    component: lazy(async () => await import('views/TermsOfServiceView'))
  },
  {
    path: Routes.aboutUs,
    component: lazy(async () => await import('views/AboutUsView'))
  },
  {
    path: Routes.contactUs,
    component: lazy(async () => await import('views/ContactUsView'))
  },
  {
    path: Routes.projectsPage,
    component: lazy(async () => await import('views/ProjectsView'))
  },
  {
    path: Routes.projectPage,
    component: lazy(async () => await import('views/ProjectView'))
  },
  {
    path: Routes.newsFeeds,
    component: lazy(async () => await import('views/NewsFeedsView'))
  },
  {
    path: Routes.newsFeed,
    component: lazy(async () => await import('views/NewsFeedView'))
  },
  {
    path: Routes.events,
    component: lazy(async () => await import('views/EventsView'))
  },
  {
    path: Routes.event,
    component: lazy(async () => await import('views/EventView'))
  },
  {
    path: Routes.iwiChair,
    component: lazy(async () => await import('views/IwiChairView'))
  },
  {
    path: Routes.resourcesPage,
    component: lazy(async () => await import('views/ResourcesView'))
  },
  {
    path: Routes.facebookLinks,
    component: lazy(async () => await import('views/FacebookLinksView'))
  },
  {
    path: Routes.facebookLink,
    component: lazy(async () => await import('views/FacebookLinkView'))
  },
  {
    path: Routes.resourceCardPage,
    component: lazy(async () => await import('views/ResourceCardView'))
  },
  {
    path: Routes.economicDevelopmentsPage,
    component: lazy(async () => await import('views/EconomicDevelopmentsView'))
  },
  {
    path: Routes.economicDevelopmentCardPage,
    component: lazy(async () => await import('views/EconomicDevelopmentCardView'))
  },
  {
    path: Routes.mediaListPage,
    component: lazy(async () => await import('views/NewsFeedsView'))
  },
  {
    path: Routes.mediaPage,
    component: lazy(async () => await import('views/NewsFeedView'))
  },
  {
    path: Routes.covidListPage,
    component: lazy(async () => await import('views/CovidListView'))
  },
  {
    path: Routes.covidPage,
    component: lazy(async () => await import('views/CovidView'))
  },
  {
    path: '',
    component: lazy(async () => await import('views/Global404View'))
  }
];
const GoogleAnalytics = lazy(async () => await import('components/App/GoogleAnalytics'));
const updatePreloads = async () => {
  // console.log(`navigator.userAgent: ${navigator.userAgent}`);
  const navigatorUserAgentAsLowerCase = navigator.userAgent.toLowerCase();
  const isFirefox = navigatorUserAgentAsLowerCase.indexOf('firefox') > -1 || navigatorUserAgentAsLowerCase.indexOf('mozilla') > -1;
  if (isFirefox) {
    const links = document.getElementsByTagName('link');
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.rel === 'preload' && typeof link.onload === 'function') {
        link.rel = 'stylesheet';
      }
    }
  }
};

if (process.env.NODE_ENV === 'production') {
  window['console']['log'] = () => { };
}
updatePreloads();

ReactDOM.render(
  <React.Suspense fallback={<LoadingSpinner
    outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
    innerClassName="m-5 p-5 text-center"
  />}>
    <FirebaseContext.Provider value={new Firebase()}>
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
  </React.Suspense>,
  document.getElementById("root")
);
