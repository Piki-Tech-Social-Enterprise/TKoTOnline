import React, {
  Suspense
} from 'react';
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import {
  Container,
  Col
} from 'reactstrap';
import publicRoutes from 'publicRoutes';

const PublicLayout = props => {
  return (
    <div className="page-header clear-filter" filter-color="blue">
      <div
        className="page-header-image"
        style={{
          backgroundImage: `url(${require('assets/img/tkot/Te-Takarangi-hero-2-80pct.jpg')})`
        }}
      ></div>
      <div className="content">
        <Container>
          <Col className="ml-auto mr-auto py-3 py-lg-5" md="8">
            <div className="p-3">
              <Switch>
                <Suspense fallback={<h1>TODO: Loading Overlay Modal...</h1>}>
                  {publicRoutes.map((prop, key) => {
                    const { layout, path, component } = prop;
                    const routePath = layout + path;
                    console.log(`prop: ${JSON.stringify(prop, null, 2)}`);
                    return (
                      <Route path={routePath} component={component} key={key} />
                    );
                  })}
                </Suspense>
                <Redirect from="/public" to="/public/Login" />
              </Switch>
            </div>
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default PublicLayout;
