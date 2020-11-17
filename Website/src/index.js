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
          <Route path={home} render={props => (
            <HomeView {...props} />
          )} exact />
          <Route
            path={privacyPolicy}
            render={props => <PrivacyPolicyView {...props} />}
          />
          <Route
            path={termsOfUse}
            render={props => <TermsOfServiceView {...props} />}
          />
          <Route
            path={aboutUs}
            render={props => <AboutUsView {...props} />}
            exact
          />
          <Route
            path={contactUs}
            render={props => <ContactUsView {...props} />}
          />
          <Route
            path={projectsPage}
            render={props => <ProjectsView {...props} />}
            exact
          />
          <Route
            path={projectPage}
            render={props => <ProjectView {...props} />}
            exact
          />
          <Route
            path={newsFeeds}
            render={props => <NewsFeedsView {...props} />}
            exact
          />
          <Route
            path={newsFeed}
            render={props => <NewsFeedView {...props} />}
            exact
          />
          <Route
            path={events}
            render={props => <EventsView {...props} />}
            exact
          />
          <Route
            path={event}
            render={props => <EventView {...props} />}
            exact
          />
          <Route
            path={iwiChair}
            render={props => <IwiChairView {...props} />}
            exact
          />
          <Route
            path={resourcesPage}
            render={props => <ResourcesView {...props} />}
            exact
          />
          <Route
            path={facebookLinks}
            render={props => <FacebookLinksView {...props} />}
            exact
          />
          <Route
            path={facebookLink}
            render={props => <FacebookLinkView {...props} />}
            exact
          />
          <Route
            path={resourceCardPage}
            render={props => <ResourceCardView {...props} />}
            exact
          />
        </Switch>
        <GoogleAnalytics />
      </BrowserRouter>
    </FirebaseContext.Provider>
  </React.Suspense>,
  document.getElementById("root")
);
