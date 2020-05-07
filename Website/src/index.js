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
import Index from "views/Index.js";
import NucleoIcons from "views/NucleoIcons.js";
import LoginPage from "views/examples/LoginPage.js";
import LandingPage from "views/examples/LandingPage.js";
import ProfilePage from "views/examples/ProfilePage.js";
import HomeView from 'views/HomeView';
import Firebase, {
  FirebaseContext
} from 'components/Firebase';
import Volunteer from 'views/Volunteer';
import PrivacyPolicy from 'views/PrivacyPolicyView';
import TermsOfService from 'views/TermsOfServiceView';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <BrowserRouter>
      <Switch>
        <Route path="/" render={props => (
          <HomeView {...props} />
        )} exact />
        <Route path="/index" render={props => <Index {...props} />} exact />
        <Route
          path="/nucleo-icons"
          render={props => <NucleoIcons {...props} />}
        />
        <Route
          path="/landing-page"
          render={props => <LandingPage {...props} />}
        />
        <Route
          path="/profile-page"
          render={props => <ProfilePage {...props} />}
        />
        <Route
          path="/Volunteer"
          render={props => <Volunteer {...props} />}
        />
        <Route
          path="/PrivacyPolicy"
          render={props => <PrivacyPolicy {...props} />}
        />
        <Route
          path="/TermsOfUse"
          render={props => <TermsOfService {...props} />}
        />
        <Route path="/login-page" render={props => <LoginPage {...props} />} />
      </Switch>
    </BrowserRouter>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
