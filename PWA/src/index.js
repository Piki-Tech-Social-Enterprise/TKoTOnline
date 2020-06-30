/*!

=========================================================
* Now UI Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/now-ui-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v1.2.0";
import "assets/scss/tkot.scss?v1.0.0";
// import "assets/css/demo.css";

import AdminLayout from "layouts/Admin.jsx";
import AuthLayout from 'layouts/AuthLayout';
import PublicLayout from 'layouts/PublicLayout';
import Firebase, {
  FirebaseContext
} from './components/Firebase';

if (process.env.NODE_ENV === 'production') {
  window['console']['log'] = () => { };
}

const hist = createBrowserHistory();

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <Router history={hist}>
      <Switch>
        <Route path="/public" render={props =>
          <PublicLayout {...props} />
        } />
        <Route path="/auth" render={props =>
          <AuthLayout {...props} />
        } />
        <Route path="/admin" render={props => <AdminLayout {...props} />} />
        <Redirect from="/" to="/public/Login" />
      </Switch>
    </Router>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);
