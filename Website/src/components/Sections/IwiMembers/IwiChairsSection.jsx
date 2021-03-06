import React, {
  useState,
  useEffect
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import {
  intoChunks,
  draftToText,
  handleBlockTextClick,
  sortArray
} from 'components/App/Utilities';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Row = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-row' */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-col' */'reactstrap/es/Col'));
const Button = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-button' */'reactstrap/es/Button'));
const Card = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-card' */'reactstrap/es/Card'));
const CardBody = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-cardbody' */'reactstrap/es/CardBody'));
const CardTitle = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-cardtitle' */'reactstrap/es/CardTitle'));
const CardHeader = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-cardheader' */'reactstrap/es/CardHeader'));
const Carousel = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-carousel' */'reactstrap/es/Carousel'));
const CarouselItem = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-carousel-item' */'reactstrap/es/CarouselItem'));
const CarouselControl = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-carousel-control' */'reactstrap/es/CarouselControl'));
const LoadingSpinner = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-loading-spinner' */'components/App/LoadingSpinner'));
const NoDataToDisplayDiv = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-no-data-to-display-div' */'components/App/NoDataToDisplayDiv'));
const FirebaseImage = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-firebase-image' */'components/App/FirebaseImage'));
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
      const dbIwiMembers = await firebase.iwiMembersRepository.getDbIwiMembersAsArray();
      sortArray(dbIwiMembers, 'sequence', 'desc');
      setState(s => ({
        ...s,
        isLoading: false,
        dbIwiMembers: dbIwiMembers
      }));
    };
    if (isLoading) {
      getDbIwiMembers();
    }
  }, [props, isLoading]);
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
                  ? <LoadingSpinner caller="IwiChairSection" />
                  : dbIwiMembers.length === 0
                    ? <NoDataToDisplayDiv name="Iwi Chairs" isHomePage={isHomePage} />
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
                                imageResize="md"
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
                    ? <LoadingSpinner caller="IwiChairSection" />
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
                              imageResize="md"
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
