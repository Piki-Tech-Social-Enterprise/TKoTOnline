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

const IwiMembersSection = props => {
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
        <Col>
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
                    <Col xs={6} sm={2} key={imid}>
                      <a href={iwiMemberURL} className="text-dark bg-info1" target="_blank" rel="noopener noreferrer">
                        <FirebaseImage className="iwi-member-image m-3" imageURL={iwiMemberImageURL} alt={iwiMemberName} />
                      </a>
                    </Col>
                  );
                })
            }
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default withFirebase(IwiMembersSection);
