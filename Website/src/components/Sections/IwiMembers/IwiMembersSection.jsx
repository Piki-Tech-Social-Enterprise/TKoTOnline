import React, {
  useState,
  useEffect
} from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
import LoadingSpinner from 'components/App/LoadingSpinner';
import FirebaseImage from 'components/App/FirebaseImage';
import Routes from 'components/Routes/routes';

const IwiMembersSection = props => {
  const {
    showClickScrollDownForMoreLink
  } = props;
  const [state, setState] = useState({
    isLoading: true,
    iwiMembers: [],
    columnCount: 4
  });
  useEffect(() => {
    const {
      isLoading
    } = state;
    const getData = async () => {
      const {
        firebase
      } = props;
      const dbIwiMembers = await firebase.getDbIwiMembersAsArray();
      // debugger;
      setState(s => ({
        ...s,
        isLoading: false,
        iwiMembers: dbIwiMembers
      }));
    };
    if (isLoading) {
      getData();
    }
  }, [props, state]);
  return (
    <Container className="tkot-section bg-secondary1">
      <a id="IwiMembers" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <Row>
        <Col className="text-uppercase text-center">
          <h3>Our Iwi Members</h3>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Row>
            {
              state.isLoading
                ? <LoadingSpinner />
                : state.iwiMembers.map(iwiMember => {
                  const {
                    imid,
                    iwiMemberImageURL,
                    iwiMemberName,
                    iwiMemberURL
                  } = iwiMember;
                  return (
                    <Col xs={6} sm={2} key={imid} className="h5 text-center text-uppercase">
                      <a href={iwiMemberURL} className="text-dark text-decoration-none tkot-primary-blue-color" target="_blank" rel="noopener noreferrer">
                        <FirebaseImage className="iwi-member-image mx-3 mt-3 mb-0" imageURL={iwiMemberImageURL} alt={iwiMemberName} /><br />
                        <span className="iwi-member-name">{iwiMemberName}</span>
                      </a>
                    </Col>
                  );
                })
            }
          </Row>
          {
            showClickScrollDownForMoreLink
              ? <a href={Routes.about} className="text-decoration-none text-dark">
                <p className="my-0 mt-4"><i className="fas fa-angle-double-down" /> Click/Scroll down for more <i className="fas fa-angle-double-down" /></p>
              </a>
              : null
          }
        </Col>
      </Row>
    </Container>
  );
};

export default withFirebase(IwiMembersSection);
