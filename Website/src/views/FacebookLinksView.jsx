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

const FacebookLink = props => {
  const {
    dbFacebookLink
  } = props;
  const {
    fid,
    name
  } = dbFacebookLink;
  return (
    <Col xs={12} sm={4}>
      <iframe
        src={`FacebookLinks/${fid}`}
        title={name}
        style={{
          height: 400
        }}
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
