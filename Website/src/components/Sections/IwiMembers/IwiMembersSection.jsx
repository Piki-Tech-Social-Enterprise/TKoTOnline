import React, {
  useState,
  useEffect,
  Fragment
} from 'react';
// import {
//   Container,
//   Row,
//   Col,
//   Button
// } from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
import Routes from 'components/Routes/routes';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import {
  sortArray
} from 'components/App/Utilities';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Container = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Col'));
const Button = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Button'));
const LoadingSpinner = lazy(async () => await import(/* webpackPrefetch: true */'components/App/LoadingSpinner'));
const NoDataToDisplayDiv = lazy(async () => await import(/* webpackPrefetch: true */'components/App/NoDataToDisplayDiv'));
const FirebaseImage = lazy(async () => await import(/* webpackPrefetch: true */'components/App/FirebaseImage'));
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
    const getIwiMembers = async () => {
      const getDbIwiMembers = async () => {
        const dbIwiMembersFieldNames = [
          'sequence',
          'imid',
          'iwiMemberImageURL',
          'iwiMemberName',
          'iwiMemberURL',
          'iwiMemberRegistrationLink'
        ];
        const dbIwiMembers = await props.firebase.iwiMembersRepository.getDbIwiMembersAsArray(false, 'active', true, NaN, dbIwiMembersFieldNames);
        return dbIwiMembers;
      };
      const {
        dbIwiMembers: dbIwiMembersPassedIn
      } = props;
      const dbIwiMembers = dbIwiMembersPassedIn
        ? dbIwiMembersPassedIn
        : await getDbIwiMembers();
      sortArray(dbIwiMembers, 'sequence', 'desc');
      // debugger;
      setState(s => ({
        ...s,
        isLoading: false,
        iwiMembers: dbIwiMembers
      }));
    };
    if (isLoading) {
      getIwiMembers();
    }
  }, [props, state]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`} style={{
      minHeight: '33.75rem'
    }}>
      <Container>
        <a id="IwiMembers" href="#TKoTOnline" className="tkot-anchor">&nbsp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto text-center my-3">
            <h3 className="text-uppercase">Our Iwi Members</h3>
            <Container className="my-3">
              <Row>
                {
                  state.isLoading
                    ? <LoadingSpinner caller="IwiMembersSection" />
                    : state.iwiMembers.length === 0
                      ? <NoDataToDisplayDiv name="Iwi Members" />
                      : state.iwiMembers.map((iwiMember, index) => {
                        const {
                          imid,
                          iwiMemberImageURL,
                          iwiMemberName,
                          iwiMemberURL,
                          iwiMemberRegistrationLink
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
                                  imageResize="sm"
                                /><br />
                                <span className="iwi-member-name">{iwiMemberName}{iwiMemberName.length < 15 ? <><br /><br /></> : <></>}</span>
                              </a>
                              <div className="text-center mt-3">
                                <Button
                                  href={iwiMemberRegistrationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="tkot-primary-red-bg-color btn-outline-dark"
                                  color="white"
                                  onClick={() => sendEvent('Home page', `Clicked "${iwiMemberName} Register" button`)}
                                >Register</Button>
                              </div>
                            </Col>
                          </Fragment>
                        );
                      })
                }
              </Row>
            </Container>
            {
              showClickScrollDownForMoreLink
                ? <a href={Routes.aboutAnchor} className="text-decoration-none text-dark">
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
