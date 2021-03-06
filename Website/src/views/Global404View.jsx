import React, {
  useEffect,
  useState
} from 'react';
import Routes from 'components/Routes/routes';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Container = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-container' */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-row' */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-col' */'reactstrap/es/Col'));
const Button = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-button' */'reactstrap/es/Button'));
const {
  home
} = Routes;
const HomeNavbar = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-navbar' */'components/Navbars/HomeNavbar')), 'app-home-navbar');
const HomeFooter = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-home-footer' */'components/Footers/HomeFooter')), 'components/Footers/HomeFooter');
const PageLoadingSpinner = lazy(async () => await import(/* webpackPreload: true, webpackChunkName: 'app-page-loading-spinner' */'components/App/PageLoadingSpinner'));
const Global404View = () => {
  const [state, setState] = useState({
    isLoading: true
  });
  const {
    isLoading
  } = state;
  useEffect(() => {
    let defaultPageSetup = {};
    const pageSetup = async () => {
      const {
        defaultPageSetup: defaultPageSetupImported
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-utilities' */'components/App/Utilities');
      defaultPageSetup = defaultPageSetupImported;
      defaultPageSetup(true);
      setState(s => ({
        ...s,
        isLoading: false
      }));
    };
    if (isLoading) {
      pageSetup();
    }
    return () => {
      if (!isLoading) {
        defaultPageSetup();
      }
    };
  }, [isLoading]);
  return (
    <>
      {
        isLoading
          ? <PageLoadingSpinner caller="Global404View" />
          : <>
            <HomeNavbar
              initalTransparent
              colorOnScrollValue={25}
            />
            <Container className="pt-5 px-5 mt-5">
              <Row>
                <Col sm={3} className="d-none d-sm-block mt-5">
                  <img
                    alt="404"
                    src="/static/img/tkot-logo-only-black.png"
                    className="global-404-image"
                  />
                </Col>
                <Col xs={12} sm={9} className="mt-5">
                  <h1 className="font-weight-bold" style={{
                    fontFamily: 'inherit'
                  }}>404 - Auē Taukuri Ē!</h1>
                  <h3>Aroha mai e hoa, something went wrong?!</h3>
                  <p>If you entered a web address, please check it was correct.</p>
                  <p>Kia pai to ra!</p>
                  <Button
                    className="tm-bg-primary text-white mt-3"
                    size="lg"
                    href={home}
                  >Take Me Back Home</Button>
                </Col>
              </Row>
            </Container>
            <HomeFooter />
          </>
      }
    </>
  );
};

export default Global404View;
