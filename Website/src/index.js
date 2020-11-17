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
import React, {
  lazy
} from "react";
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
import "assets/scss/tkot.scss?v=1.0.0";
import 'lazysizes';
import Routes from 'components/Routes/routes';

const {
  home,
  privacyPolicy,
  termsOfUse,
  aboutUs,
  newsFeeds,
  newsFeed,
  events,
  event,
  iwiChair,
  projectsPage,
  projectPage,
  resourcesPage,
  contactUs,
  facebookLinks,
  facebookLink,
  resourceCardPage
} = Routes;
const GoogleAnalytics = lazy(async () => await import('components/App/GoogleAnalytics'));
const HomeView = lazy(async () => await import('views/HomeView'));
const PrivacyPolicyView = lazy(async () => await import('views/PrivacyPolicyView'));
const TermsOfServiceView = lazy(async () => await import('views/TermsOfServiceView'));
const AboutUsView = lazy(async () => await import('views/AboutUsView'));
const ContactUsView = lazy(async () => await import('views/ContactUsView'));
const ProjectsView = lazy(async () => await import('views/ProjectsView'));
const ProjectView = lazy(async () => await import('views/ProjectView'));
const NewsFeedsView = lazy(async () => await import('views/NewsFeedsView'));
const NewsFeedView = lazy(async () => await import('views/NewsFeedView'));
const EventsView = lazy(async () => await import('views/EventsView'));
const EventView = lazy(async () => await import('views/EventView'));
const IwiChairView = lazy(async () => await import('views/IwiChairView'));
const ResourcesView = lazy(async () => await import('views/ResourcesView'));
const FacebookLinksView = lazy(async () => await import('views/FacebookLinksView'));
const FacebookLinkView = lazy(async () => await import('views/FacebookLinkView'));
const ResourceCardView = lazy(async () => await import('views/ResourceCardView'));
const appRoutes = [
  {
    path: home,
    component: HomeView
  },
  {
    path: privacyPolicy,
    component: PrivacyPolicyView
  },
  {
    path: termsOfUse,
    component: TermsOfServiceView
  },
  {
    path: aboutUs,
    component: AboutUsView
  },
  {
    path: contactUs,
    component: ContactUsView
  },
  {
    path: projectsPage,
    component: ProjectsView
  },
  {
    path: projectPage,
    component: ProjectView
  },
  {
    path: newsFeeds,
    component: NewsFeedsView
  },
  {
    path: newsFeed,
    component: NewsFeedView
  },
  {
    path: events,
    component: EventsView
  },
  {
    path: event,
    component: EventView
  },
  {
    path: iwiChair,
    component: IwiChairView
  },
  {
    path: resourcesPage,
    component: ResourcesView
  },
  {
    path: facebookLinks,
    component: FacebookLinksView
  },
  {
    path: facebookLink,
    component: FacebookLinkView
  },
  {
    path: resourceCardPage,
    component: ResourceCardView
  }
];

if (process.env.NODE_ENV === 'production') {
  window['console']['log'] = () => { };
}
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
