import React, {
  useState,
  useEffect,
  Fragment
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import Routes from 'components/Routes/routes';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Container = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-container' */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-row' */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-col' */'reactstrap/es/Col'));
const Button = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-button' */'reactstrap/es/Button'));
const LoadingSpinner = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-loading-spinner' */'components/App/LoadingSpinner'));
const NoDataToDisplayDiv = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-no-data-to-display-div' */'components/App/NoDataToDisplayDiv'));
const FirebaseImage = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-firebase-image' */'components/App/FirebaseImage'));
const IwiMembersSection = props => {
  const {
    containerClassName,
    showClickScrollDownForMoreLink
  } = props;
  const [state, setState] = useState({
    isLoading: true,
    iwiMembers: []
  });
  const {
    isLoading,
    iwiMembers
  } = state;
  useEffect(() => {
    const getIwiMembers = async () => {
      const getDbIwiMembers = async () => {
        const dbIwiMembersFieldNames = [
          'sequence',
          'imid',
          'iwiMemberImageURL',
          'iwiMemberName',
          'iwiMemberURL',
          // 'iwiMemberRegistrationLink'
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
      const {
        sortArray
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-utilities' */'components/App/Utilities');
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
  }, [props, isLoading]);
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
                  isLoading
                    ? <LoadingSpinner caller="IwiMembersSection" />
                    : iwiMembers.length === 0
                      ? <NoDataToDisplayDiv name="Iwi Members" />
                      : iwiMembers.map((iwiMember, index) => {
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
                              {
                                iwiMemberRegistrationLink
                                  ? <>
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
                                  </>
                                  : null
                              }
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
