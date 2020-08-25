import React, {
  useState,
  useEffect,
  lazy,
  Fragment
} from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
import Routes from 'components/Routes/routes';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const FirebaseImage = lazy(async () => await import('components/App/FirebaseImage'));
const IwiMembersSection = props => {
  const {
    containerClassName,
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
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id="IwiMembers" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase">Our Iwi Members</h3>
            <Container className="my-3">
              <Row>
                {
                  state.isLoading
                    ? <LoadingSpinner />
                    : state.iwiMembers.map((iwiMember, index) => {
                      const {
                        imid,
                        iwiMemberImageURL,
                        iwiMemberName,
                        iwiMemberURL
                      } = iwiMember;
                      return (
                        <Fragment key={imid}>
                          {
                            index > 0 && index % 6 === 0
                              ? <Col xs={6} sm={2} md={3} lg={2} className="h5 text-center text-uppercase bg-warning1 iwi-member-col">&nbsp;</Col>
                              : null
                          }
                          <Col xs={6} sm={2} md={3} lg={2} className="h5 text-center text-uppercase bg-success1">
                            <a
                              href={iwiMemberURL}
                              className="text-dark text-decoration-none tkot-primary-blue-color"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => sendEvent('Home page', `Clicked "${iwiMemberName}" Logo`)}
                            >
                              <FirebaseImage
                                className="iwi-member-image mt-3 mb-0"
                                imageURL={iwiMemberImageURL}
                                alt={iwiMemberName}
                                width="120"
                                height="120"
                                lossless={true}
                              /><br />
                              <span className="iwi-member-name">{iwiMemberName}</span>
                            </a>
                          </Col>
                        </Fragment>
                      );
                    })
                }
              </Row>
            </Container>
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
    </div>
  );
};

export default withFirebase(IwiMembersSection);
