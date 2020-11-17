import React, {
  useState,
  useEffect,
  lazy
} from 'react';
import {
  // Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Carousel,
  // CarouselIndicators,
  CarouselItem,
  CarouselControl
} from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
import {
  intoChunks,
  draftToText,
  handleBlockTextClick
} from 'components/App/Utilities';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const FirebaseImage = lazy(async () => await import('components/App/FirebaseImage'));
const getIwiMembersAsChunks = (iwiMembers, columnCount) => {
  const iwiMembersMegaMenuItems = {};
  const chunks = intoChunks(iwiMembers, columnCount);
  chunks.map((chunk, index) => {
    iwiMembersMegaMenuItems[`column${index + 1}Items`] = chunk;
    return null;
  });
  return iwiMembersMegaMenuItems;
};
const IwiChairCarousel = props => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const handleNext = () => {
    if (animating) return;
    const nextIndex = activeIndex === itemsAsChunksKeys.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };
  const handlePrevious = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? itemsAsChunksKeys.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };
  // const goToIndex = (newIndex) => {
  //   if (animating) return;
  //   setActiveIndex(newIndex);
  // };
  const {
    itemsAsChunks,
    itemCallbackFunc
  } = props;
  // console.log('itemsAsChunks: ', JSON.stringify(itemsAsChunks, null, 2));
  const itemsAsChunksKeys = Object.keys(itemsAsChunks);
  return (
    <>
      <Carousel
        activeIndex={activeIndex}
        next={handleNext}
        previous={handlePrevious}
      >
        {/* <CarouselIndicators
          items={itemsAsChunks[activeIndex]}
          activeIndex={activeIndex}
          onClickHandler={goToIndex}
        /> */}
        {
          itemsAsChunksKeys.map((itemsKey, index) => {
            const items = itemsAsChunks[itemsKey];
            return items.length
              ? <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={index}
              >
                <Row>
                  {
                    items.map(itemCallbackFunc)
                  }
                </Row>
              </CarouselItem>
              : null
          })
        }
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={handlePrevious}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={handleNext}
        />
      </Carousel>
    </>);
};
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
    <div className={`tkot-section ${containerClassName || ''}`}>
      {/* <a id="IwiChair" href="#TKoTOnline" className="tkot-anchor">&nbsp;</a> */}
      <Row noGutters>
        <Col>
          <div className="mx-auto text-center">
            <h3 className="text-uppercase">Iwi Chairs</h3>
            <div className="my-3 iwi-chairs-carousel">
              {
                state.isLoading
                  ? <LoadingSpinner />
                  : <IwiChairCarousel
                    itemsAsChunks={getIwiMembersAsChunks(dbIwiMembers, 3)}
                    itemCallbackFunc={(dbIwiMember, dbIwiMemberKey) => {
                      const {
                        iwiChairName,
                        iwiChairProfile,
                        iwiChairImageURL,
                        iwiMemberName,
                        imid
                      } = dbIwiMember;
                      const contentAsText = draftToText(iwiChairProfile, '');
                      return (
                        <Col xs={12} lg={4} key={dbIwiMemberKey}>
                          <Card className="card-block iwi-chair-card my-3 py-3">
                            <CardHeader>
                              <CardTitle
                                className="h4 my-3 mx-2 font-weight-bold iwi-chair-header clickable header-with-text"
                                onClick={async e => await handleBlockTextClick(e, 'div.iwi-chair-header', 'header-with-text')}
                              >{iwiChairName}</CardTitle>
                            </CardHeader>
                            <FirebaseImage
                              className="rounded-circle iwi-chair-image"
                              imageURL={iwiChairImageURL}
                              width="250"
                              height="250"
                              lossless={true}
                              alt={iwiChairName}
                              loadingIconSize="lg"
                            />
                            <CardBody className="text-left bg-white">
                              <p className="h4 mt-0 font-weight-bold text-center card-iwi-member-name">{iwiMemberName}</p>
                              <p
                                className="iwi-chair-content clickable d-inline-block block-with-text"
                                onClick={async e => await handleBlockTextClick(e, 'p.iwi-chair-content', 'block-with-text')}
                              >{contentAsText}</p>
                              <div className="text-center">
                                <Button
                                  href={`/AboutUs/${imid}`}
                                  className="tkot-primary-red-bg-color btn-outline-dark"
                                  color="white"
                                  onClick={() => sendEvent(`${isHomePage ? 'Home -' : ''} Iwi Chairs section`, 'Clicked "Pānui Mai..." button', iwiChairName, `/AboutUs/${imid}`)}
                                >Pānui Mai...</Button>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      );
                    }}
                  />
              }
              {/* <Row>
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
                                  onClick={() => sendEvent(`${isHomePage ? 'Home' : 'IwiChairs'} page`, 'Clicked "Pānui Mai..." button', iwiChairName, `/AboutUs/${imid}`)}
                                >Pānui Mai...</Button>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      );
                    })
                }
              </Row> */}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withFirebase(IwiChairSection);
