import React, {
  useEffect,
  useState
} from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';
import {
  withFirebase
} from 'components/Firebase';
import LoadingSpinner from 'components/App/LoadingSpinner';
import draftToHtml from 'draftjs-to-html';
import {
  defaultPageSetup
} from 'components/App/Utilities';

const AboutUsView = props => {
  const [state, setState] = useState({
    isLoading: true,
    aboutPageDescription: ''
  });
  useEffect(() => {
    const retrieveSettingValues = async () => {
      const {
        firebase
      } = props;
      const dbSettings = await firebase.getDbSettingsValues(true);
      setState(s => ({
        ...s,
        isLoading: false,
        aboutPageDescription: ((dbSettings && dbSettings.aboutPageDescription) || s.aboutPageDescription || '')
      }));
    }
    defaultPageSetup(true);
    if (state.isLoading) {
      retrieveSettingValues();
    }
    return defaultPageSetup;
  }, [props, state])
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
            <Container className="p-5 mt-5">
              <Row>
                <Col className="px-0 mt-5">
                  <h3>ABOUT US</h3>
                  <div
                    dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(state.aboutPageDescription)) }}
                  />
                </Col>
              </Row>
            </Container>
            <HomeFooter />
          </>
      }
    </>
  );
};

export default withFirebase(AboutUsView);
