import React, {
  useState,
  useEffect
} from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardHeader
} from 'reactstrap';
import LoadingSpinner from 'components/App/LoadingSpinner';
import FirebaseImage from 'components/App/FirebaseImage';
import {
  withFirebase
} from 'components/Firebase';
import {
  draftToText
} from 'components/App/Utilities';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';

const IwiChairSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbIwiMembers: []
  });
  const {
    containerClassName,
    isHomePage
  } = props;
  const {
    isLoading,
    dbIwiMembers
  } = state;
  useEffect(() => {
    const getDbIwiMembers = async () => {
      const {
        firebase
      } = props;
      const dbIwiMembers = await firebase.getDbIwiMembersAsArray();
      setState(s => ({
        ...s,
        isLoading: false,
        dbIwiMembers: dbIwiMembers
      }));
    };
    if (isLoading) {
      getDbIwiMembers();
    }
  }, [props, isLoading, setState]);
  return (
    <Container className={`tkot-section ${containerClassName || ''}`}>
      <a id="IwiChair" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <Row>
        <Col>
          <div className="mx-auto text-center">
            <h3 className="text-uppercase">Iwi Chairs</h3>
            {/* <IwiChairCarousel
              searchCategory={searchCategory}
            /> */}
            <Container className="my-3" fluid>
              <Row className="flex-row flex-nowrap cards-row">
                {
                  isLoading
                    ? <LoadingSpinner />
                    : dbIwiMembers.map((dbIwiMember, index) => {
                      const {
                        iwiChairName,
                        iwiChairProfile,
                        iwiChairImageURL,
                        iwiMemberName,
                        imid
                      } = dbIwiMember;
                      const contentAsText = draftToText(iwiChairProfile, '');
                      return (
                        <Col xs={12} sm={6} lg={4} key={index}>
                          <Card className="card-block">
                            <CardHeader>
                              <CardTitle className="h4 my-3 mx-2 font-weight-bold">{iwiChairName}</CardTitle>
                            </CardHeader>
                            <FirebaseImage
                              className="rounded-circle iwi-chair-image"
                              imageURL={iwiChairImageURL}
                              alt={iwiChairName}
                              loadingIconSize="lg"
                            />
                            <CardBody className="text-left bg-white">
                              <p className="h4 mt-0 font-weight-bold text-center">{iwiMemberName}</p>
                              <p className="d-inline-block block-with-text">{contentAsText}</p>
                              <div className="text-center">
                                <Button
                                  href={`/AboutUs/${imid}`}
                                  className="tkot-primary-red-bg-color btn-outline-dark"
                                  color="white"
                                  onClick={() => sendEvent(`${isHomePage ? 'Home' : 'IwiChairs'} page`, 'Clicked "Read More..." button', iwiChairName, `/AboutUs/${imid}`)}
                                >Read more...</Button>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      );
                    })
                }
              </Row>
            </Container>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default withFirebase(IwiChairSection);
