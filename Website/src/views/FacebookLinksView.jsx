import React, {
  useEffect,
  useState
} from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
const HomeNavbar = lazy(() => import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(() => import('components/Footers/HomeFooter'));
import {
  withFirebase
} from 'components/Firebase';
const LoadingSpinner = lazy(() => import('components/App/LoadingSpinner'));

const FacebookLink = props => {
  const {
    dbFacebookLink
  } = props;
  const {
    name,
    url
  } = dbFacebookLink;
  return (
    <Col xs={12} sm={4}>
      <iframe
        allowTransparency="true"
        allow="encrypted-media"
        frameborder="0"
        src={`https://www.facebook.com/plugins/page.php?href=${url}&tabs=timeline%2Cevents%2Cmessages&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`}
        style={{
          height: 400
        }}
        title={name}
      />
    </Col>
  );
};
const FacebookLinksView = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbFacebookLinks: []
  });
  useEffect(() => {
    const retrieveFacebookLinkValues = async () => {
      const {
        firebase
      } = props;
      const dbFacebookLinksAsArray = await firebase.getDbFacebookLinksAsArray();
      setState(s => ({
        ...s,
        isLoading: false,
        dbFacebookLinks: dbFacebookLinksAsArray
      }));
    }
    if (state.isLoading) {
      retrieveFacebookLinkValues();
    }
  }, [props, state]);
  return (
    <>
      <HomeNavbar />
      <Container className="p-5 mt-5">
        <Row>
          <Col className="px-0 mt-5">
            <h3>FACEBOOK LINKS</h3>
            <Row>
              {
                state.isLoading
                  ? <LoadingSpinner outerClassName="ignore" innerClassName="ignore" />
                  : state.dbFacebookLinks.map((dbFacebookLink, index) => <FacebookLink dbFacebookLink={dbFacebookLink} key={index} />)
              }
            </Row>
          </Col>
        </Row>
      </Container>
      <HomeFooter />
    </>
  );
};

export default withFirebase(FacebookLinksView);
