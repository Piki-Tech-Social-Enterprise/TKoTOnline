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
import { BrowserRouter, Route, Switch /*, Redirect */ } from "react-router-dom";

// styles for this kit
import "assets/css/bootstrap.min.css";
import "assets/scss/now-ui-kit.scss";
import "assets/scss/tkot.scss?v=1.0.0";
// import "assets/demo/demo.css";
// import "assets/demo/nucleo-icons-page-styles.css";
// pages for this kit
// import Index from "views/Index.js";
// import NucleoIcons from "views/NucleoIcons.js";
// import LoginPage from "views/examples/LoginPage.js";
// import LandingPage from "views/examples/LandingPage.js";
// import ProfilePage from "views/examples/ProfilePage.js";
import Firebase, {
  FirebaseContext
} from 'components/Firebase';
import LoadingSpinner from 'components/App/LoadingSpinner';

// const LoadingSpinner = lazy(() => import('components/App/LoadingSpinner').then(m => m.default));
const GoogleAnalytics = lazy(() => import('components/App/GoogleAnalytics'));
const HomeView = lazy(() => import('views/HomeView'));
// import Volunteer = lazy(() => import('views/Volunteer'));
const PrivacyPolicyView = lazy(() => import('views/PrivacyPolicyView'));
const TermsOfServiceView = lazy(() => import('views/TermsOfServiceView'));
const AboutUsView = lazy(() => import('views/AboutUsView'));
const ContactUsView = lazy(() => import('views/ContactUsView'));
// const FacebookLinksView = lazy(() => import('views/FacebookLinksView'));
// const FacebookLinkView = lazy(() => import('views/FacebookLinkView'));
const ProjectsView = lazy(() => import('views/ProjectsView'));
const ProjectView = lazy(() => import('views/ProjectView'));
const NewsFeedsView = lazy(() => import('views/NewsFeedsView'));
const NewsFeedView = lazy(() => import('views/NewsFeedView'));
const EventsView = lazy(() => import('views/EventsView'));
const EventView = lazy(() => import('views/EventView'));
const IwiChairView = lazy(() => import('views/IwiChairView'));

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
          {/* <Route path="/index" render={props => <Index {...props} />} exact /> */}
          {/* <Route
          path="/nucleo-icons"
          render={props => <NucleoIcons {...props} />}
        /> */}
          {/* <Route
          path="/landing-page"
          render={props => <LandingPage {...props} />}
        /> */}
          {/* <Route
          path="/profile-page"
          render={props => <ProfilePage {...props} />}
        /> */}
          {/* <Route
          path="/Volunteer"
          render={props => <Volunteer {...props} />}
        /> */}
          <Route
            path="/PrivacyPolicy"
            render={props => <PrivacyPolicyView {...props} />}
          />
          <Route
            path="/TermsOfUse"
            render={props => <TermsOfServiceView {...props} />}
          />
          {/* <Route
          path="/login-page"
          render={props => <LoginPage {...props} />}
        /> */}
          <Route
            path="/AboutUs"
            render={props => <AboutUsView {...props} />}
            exact
          />
          <Route
            path="/ContactUs"
            render={props => <ContactUsView {...props} />}
          />
          {/* <Route
          path="/FacebookLinks"
          render={props => <FacebookLinksView {...props} />}
          exact
        />
        <Route
          path="/FacebookLinks/:fid"
          render={props => <FacebookLinkView {...props} />}
          exact
        /> */}
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
