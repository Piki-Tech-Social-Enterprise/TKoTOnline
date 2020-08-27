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
ReactDOM.render(
  <React.Suspense fallback={<LoadingSpinner
    outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
    innerClassName="m-5 p-5 text-center"
  />}>
    <FirebaseContext.Provider value={new Firebase()}>
      <BrowserRouter>
        <Switch>
          <Route path="/" render={props => (
            <HomeView {...props} />
          )} exact />
          <Route
            path="/PrivacyPolicy"
            render={props => <PrivacyPolicyView {...props} />}
          />
          <Route
            path="/TermsOfUse"
            render={props => <TermsOfServiceView {...props} />}
          />
          <Route
            path="/AboutUs"
            render={props => <AboutUsView {...props} />}
            exact
          />
          <Route
            path="/ContactUs"
            render={props => <ContactUsView {...props} />}
          />
          <Route
            path="/Projects"
            render={props => <ProjectsView {...props} />}
            exact
          />
          <Route
            path="/Projects/:pid"
            render={props => <ProjectView {...props} />}
            exact
          />
          <Route
            path="/NewsFeeds"
            render={props => <NewsFeedsView {...props} />}
            exact
          />
          <Route
            path="/NewsFeeds/:nfid"
            render={props => <NewsFeedView {...props} />}
            exact
          />
          <Route
            path="/Wananga"
            render={props => <EventsView {...props} />}
            exact
          />
          <Route
            path="/Wananga/:evid"
            render={props => <EventView {...props} />}
            exact
          />
          <Route
            path="/AboutUs/:imid"
            render={props => <IwiChairView {...props} />}
            exact
          />
        </Switch>
        <GoogleAnalytics />
      </BrowserRouter>
    </FirebaseContext.Provider>
  </React.Suspense>,
  document.getElementById("root")
);
