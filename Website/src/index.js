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
import GoogleAnalytics from 'components/App/GoogleAnalytics';

const HomeView = React.lazy(() => import('views/HomeView'));
// import Volunteer = React.lazy(() => import('views/Volunteer'));
const PrivacyPolicyView = React.lazy(() => import('views/PrivacyPolicyView'));
const TermsOfServiceView = React.lazy(() => import('views/TermsOfServiceView'));
const AboutUsView = React.lazy(() => import('views/AboutUsView'));
const ContactUsView = React.lazy(() => import('views/ContactUsView'));
// const FacebookLinksView = React.lazy(() => import('views/FacebookLinksView'));
// const FacebookLinkView = React.lazy(() => import('views/FacebookLinkView'));
const ProjectsView = React.lazy(() => import('views/ProjectsView'));
const ProjectView = React.lazy(() => import('views/ProjectView'));
const NewsFeedsView = React.lazy(() => import('views/NewsFeedsView'));
const NewsFeedView = React.lazy(() => import('views/NewsFeedView'));
const EventsView = React.lazy(() => import('views/EventsView'));
const EventView = React.lazy(() => import('views/EventView'));

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <BrowserRouter>
      <React.Suspense fallback={<LoadingSpinner
        outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
        innerClassName="m-5 p-5 text-center"
      />}>
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
        </Switch>
      </React.Suspense>
      <GoogleAnalytics />
    </BrowserRouter>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
