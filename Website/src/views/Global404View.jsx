import React, {
  useEffect,
  useState,
  lazy
} from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import {
  defaultPageSetup
} from 'components/App/Utilities';
import Routes from 'components/Routes/routes';
import tkotLogoOnlyBlackImage from 'assets/img/tkot/tkot-logo-only-black.png';

const {
  home
} = Routes;
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const Global404View = () => {
  const [state, setState] = useState({
    isLoading: true
  });
  useEffect(() => {
    const pageSetup = async () => {
      setState(s => ({
        ...s,
        isLoading: false
      }));
    };
    defaultPageSetup(true);
    if (state.isLoading) {
      pageSetup();
    }
  }, [state]);
  return (
    <>
      {
        state.isLoading
          ? <LoadingSpinner
            outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
            innerClassName="m-5 p-5 text-center"
          />
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
                    src={tkotLogoOnlyBlackImage}
                    style={{
                      maxWidth: '180px'
                    }}
                  />
                </Col>
                <Col xs={12} sm={9} className="mt-5">
                  <h1>404 - Auē Taukuri Ē!</h1>
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
