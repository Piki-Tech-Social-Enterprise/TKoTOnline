import React, {
  useReducer,
  useRef,
  useEffect,
  useMemo
} from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselIndicators,
  CarouselCaption,
  Form,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardLink
} from 'reactstrap';
const LoadingSpinner = lazy(() => import('components/App/LoadingSpinner'));
const FirebaseImage = lazy(() => import('components/App/FirebaseImage'));
import {
  withFirebase
} from 'components/Firebase';
import NewsFeedCaption from 'components/App/NewsFeedCaption';
import {
  draftToText
} from 'components/App/Utilities';

const INITIAL_STATE = {
  isLoading: true,
  carouselItems: [],
  masterCarouselItems: [],
  cardItems: [],
  masterCardItems: [],
  activeIndex: 0,
  isAnimating: false
};
const newsFeedActionTypes = {
  load: 'LOAD',
  obtain: 'OBTAIN',
  animate: 'ANIMATE',
  prev: 'PREVIOUS',
  goto: 'GOTO',
  next: 'NEXT'
};
const newsFeedReducer = (state, action) => {
  const {
    isLoading,
    carouselItems,
    masterCarouselItems,
    cardItems,
    masterCardItems,
    activeIndex,
    isAnimating
  } = state;
  const {
    type,
    toLoad,
    items,
    toAnimate,
    clickedIndex
  } = action;
  const {
    load,
    obtain,
    animate,
    prev,
    goto,
    next
  } = newsFeedActionTypes;
  const getPreviousIndex = (index, items) => index === 0
    ? items.length - 1
    : index - 1;
  const getNextIndex = (index, items) => index === (items.length - 1)
    ? 0
    : index + 1;
  let newLoading = null;
  let newCarouselItems = null;
  let newCardItems = null;
  let newAnimating = null;
  let newActiveIndex = null;
  switch (type) {
    case load:
      newLoading = !!toLoad;
      break;
    case obtain:
      newCarouselItems = items.filter(item => !!item.isFeatured);
      newCardItems = items.filter(item => !item.isFeatured);
      newActiveIndex = getNextIndex((newCarouselItems.length - 1), newCarouselItems);
      newLoading = false;
      break;
    case animate:
      newAnimating = !!toAnimate;
      break;
    case prev:
      if (isAnimating) {
        return state;
      }
      newActiveIndex = getPreviousIndex(activeIndex, carouselItems);
      newAnimating = false;
      break;
    case goto:
      if (isAnimating) {
        return state;
      }
      newActiveIndex = clickedIndex;
      newAnimating = false;
      break;
    case next:
      if (isAnimating) {
        return state;
      }
      newActiveIndex = getNextIndex(activeIndex, carouselItems);
      newAnimating = false;
      break;
    default:
      throw new Error(`Unhandled type: ${type}`);
  }
  const newState = {
    ...state,
    isLoading: newLoading != null
      ? newLoading
      : isLoading,
    carouselItems: newCarouselItems || carouselItems,
    masterCarouselItems: masterCarouselItems.length
      ? masterCarouselItems
      : carouselItems,
    cardItems: newCardItems || cardItems,
    masterCardItems: masterCardItems.length
      ? masterCardItems
      : cardItems,
    isAnimating: newAnimating != null
      ? newAnimating
      : isAnimating,
    activeIndex: newActiveIndex || activeIndex
  };
  return newState;
};
const withLogger = dispatch => {
  return action => {
    // console.groupCollapsed('Action: ', JSON.stringify(action));
    return dispatch(action);
  };
};
const useReducerWithLogger = (reducer, initialState) => {
  let prevState = useRef(initialState);
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchWithLogger = useMemo(() => {
    return withLogger(dispatch);
  }, [dispatch]);
  useEffect(() => {
    if (state !== initialState) {
      console.log('Prev State: ', prevState.current);
      console.log('Next State: ', state);
      console.groupEnd();
    }
    prevState.current = state;
  }, [state, initialState]);
  return [state, dispatchWithLogger];
};
const useNewsFeed = ({ reducer = newsFeedReducer, initialState = INITIAL_STATE } = {}) => {
  const [state, dispatch] = useReducerWithLogger(reducer, initialState);
  const handleLoad = toLoad => dispatch({ type: newsFeedActionTypes.load, toLoad: toLoad });
  const handleItems = items => dispatch({ type: newsFeedActionTypes.obtain, items: items });
  const handleAnimate = toAnimate => dispatch({ type: newsFeedActionTypes.animate, toAnimate: toAnimate });
  const handlePrevious = () => dispatch({ type: newsFeedActionTypes.prev });
  const handleGoto = clickedIndex => dispatch({ type: newsFeedActionTypes.goto, clickedIndex: clickedIndex });
  const handleNext = () => dispatch({ type: newsFeedActionTypes.next });
  return {
    state,
    handleLoad,
    handleItems,
    handleAnimate,
    handlePrevious,
    handleGoto,
    handleNext
  };
};
const NewsFeedCarousel = props => {
  const {
    state,
    handleItems,
    handleAnimate,
    handlePrevious,
    handleGoto,
    handleNext
  } = useNewsFeed();
  const {
    isLoading,
    carouselItems,
    cardItems,
    activeIndex
  } = state;
  const createCarouselItems = carouselItems.map((item, index) => {
    return (
      <CarouselItem onExiting={() => handleAnimate(true)} onExited={() => handleAnimate(false)} key={index}>
        <FirebaseImage imageURL={item.imageUrl} alt={item.header} />
        <CarouselCaption captionText={item.category} captionHeader={item.header} />
      </CarouselItem>
    );
  });
  const handleSearchNewsFeeds = async e => {
    e.preventDefault();
    const {
      value: newsFeed
    } = e.target;
    const {
      masterCarouselItems,
      masterCardItems
    } = state;
    const filteredCarouselItems = masterCarouselItems.filter(masterCarouselItem =>
      masterCarouselItem.header.toString().toLowerCase().indexOf(newsFeed.toString().toLowerCase()) > -1);
    const filteredCardItems = masterCardItems.filter(masterCardItem =>
      masterCardItem.header.toString().toLowerCase().indexOf(newsFeed.toString().toLowerCase()) > -1);
    handleItems([].concat(filteredCarouselItems.concat(filteredCardItems)));
  };
  useEffect(() => {
    const getDbNewsFeeds = async () => {
      const {
        firebase,
        searchCategory
      } = props;
      // console.log('searchCategory: ', searchCategory);
      const dbNewsFeeds = await firebase.getDbNewsFeedsAsArray();
      handleItems(searchCategory
        ? dbNewsFeeds.filter(dbnf => dbnf.category.toLowerCase().indexOf(searchCategory.toLowerCase()) > -1)
        : dbNewsFeeds);
    };
    if (isLoading) {
      getDbNewsFeeds();
    }
  }, [props, handleItems, isLoading]);
  return (
    isLoading
      ? <LoadingSpinner />
      : <>
        {
          carouselItems && carouselItems.length
            ? <div className="news-feed-carousel">
              <Carousel interval={5000} activeIndex={activeIndex} next={handleNext} previous={handlePrevious}>
                <CarouselIndicators items={carouselItems} activeIndex={activeIndex} onClickHandler={handleGoto} />
                {createCarouselItems}
              </Carousel>
              <div className="news-feed-sidebar col-sm-4 px-0 bg-primary1">
                <ul>
                  {
                    carouselItems.map((carouselItem, index) => {
                      return (
                        <li onClick={async e => {
                          e.preventDefault();
                          handleGoto(index);
                        }} className="news-feed-sidebar-item" key={index}>
                          <h4>{carouselItem.header}</h4>
                        </li>
                      );
                    })
                  }
                </ul>
                <Form className="news-feed-form bg-light px-0 pt-3">
                  <FormGroup>
                    <Input placeholder="Search" type="text" onChange={handleSearchNewsFeeds} />
                  </FormGroup>
                </Form>
              </div>
            </div>
            : null
        }
        <Container className="my-3" fluid>
          <Row className="flex-row flex-nowrap cards-row">
            {
              cardItems.map((cardItem, index) => {
                const {
                  content,
                  header,
                  imageUrl,
                  externalUrl,
                  nfid
                } = cardItem;
                const contentAsText = draftToText(content, '');
                return (
                  <Col xs={12} md={4} key={index}>
                    <Card className="card-block">
                      <CardHeader>
                        <CardTitle className="h5 my-3 mx-2">{header}</CardTitle>
                      </CardHeader>
                      <FirebaseImage className="card-img-max-height" imageURL={imageUrl} alt={header} />
                      <CardBody className="text-left bg-white">
                        <p className="font-weight-bold">
                          <NewsFeedCaption
                            newsFeed={cardItem}
                          />
                        </p>
                        {/* <p className="font-weight-bold">{`${moment(cardItem.date, DATE_MOMENT_FORMAT).format(NEWSFEED_DATE_MOMENT_FORMAT)} | ${cardItem.category}`}</p> */}
                        <p className="d-inline-block block-with-text">{contentAsText}</p>
                        <CardLink
                          href={externalUrl ? externalUrl : `/NewsFeeds/${nfid}`}
                          target={externalUrl ? '_blank' : '_self'}
                          rel={externalUrl ? 'noopener noreferrer' : 'alternate'}
                          style={{
                            color: 'inherit'
                          }}>Read more...</CardLink>
                      </CardBody>
                    </Card>
                  </Col>
                );
              })
            }
          </Row>
        </Container>
      </>
  );
};

export default withFirebase(NewsFeedCarousel);
