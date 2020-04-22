import React, {
  useState,
  useEffect
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
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText
} from 'reactstrap';

const NewsFeedCarousel = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshingItems, setIsRefreshingItems] = useState(true);
  const [carouselItems, setCarouselItems] = useState([]);
  const [cardItems, setCardItems] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const handleNext = () => {
    if (animating) return;
    const nextIndex = activeIndex === carouselItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };
  const handlePrevious = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? carouselItems.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };
  const handleCarouselIndicatorsClick = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };
  const createCarouselItems = carouselItems.map((item) => {
    return (
      <CarouselItem onExiting={() => setAnimating(true)} onExited={() => setAnimating(false)} key={item.key}>
        <img src={item.src} alt={item.alt} />
        <CarouselCaption captionText={item.caption} captionHeader={item.header} />
      </CarouselItem>
    );
  });
  useEffect(() => {
    const createNewsFeed = (text, index, isCard) => {
      return {
        src: isCard
          ? '//placehold.it/256x186/cccccc/ffffff'
          : '//placehold.it/760x400/cccccc/ffffff',
        alt: `${text} Alt`,
        caption: `${text} Caption`,
        subtitle: `${text} Subtitle`,
        header: `${text} Header`,
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        key: `${index}`
      };
    };
    const getNewsFeeds = (count, isCard) => {
      const newsFeeds = [];
      for (let i = 0; i < count; i++) {
        newsFeeds.push(createNewsFeed(`Slide ${i + 1}`, i, isCard));
      }
      return newsFeeds;
    };
    const getDbNewsFeeds = async () => {
      setIsLoading(true);
      const dbNewsFeedsForCarousel = getNewsFeeds(15); // await props.firebase.getDbNewsFeedsAsArray();
      setCarouselItems(dbNewsFeedsForCarousel);
      const dbNewsFeedsForCardDeck = getNewsFeeds(15, true);
      setCardItems(dbNewsFeedsForCardDeck);
      setIsRefreshingItems(false);
      handleNext();
      setIsLoading(false);
    };
    if (isRefreshingItems) {
      getDbNewsFeeds();
    }
  });
  return (
    isLoading
      ? <div />
      : <>
        <div className="news-feed-carousel">
          <Carousel activeIndex={activeIndex} next={handleNext} previous={handlePrevious}>
            <CarouselIndicators items={carouselItems} activeIndex={activeIndex} onClickHandler={handleCarouselIndicatorsClick} />
            {createCarouselItems}
          </Carousel>
          <ul className="news-feed-sidebar col-sm-4 bg-primary">
            {
              carouselItems.map((uncontrolledCarouselItem, index) => {
                return (
                  <li data-target="#NewsFeedCarousel" data-slide-to={`${index}`} className="news-feed-sidebar-item" key={index}>
                    <h4>{uncontrolledCarouselItem.caption}</h4>
                  </li>
                );
              })
            }
          </ul>
          <Form className="news-feed-form col-sm-4 bg-light pt-3">
            <FormGroup>
              <Input placeholder="Search" type="text" />
            </FormGroup>
          </Form>
        </div>
        <Container className="my-3" fluid>
          <Row className="flex-row flex-nowrap" style={{
            overflowX: 'scroll'
          }}>
            {
              cardItems.map((cardItem, index) => {
                return (
                  <Col xs={12} sm={4} key={index}>
                    <Card className="card-block">
                      <CardHeader>
                        <CardTitle>{cardItem.caption}</CardTitle>
                        <CardSubtitle>{cardItem.subtitle}</CardSubtitle>
                      </CardHeader>
                      <CardImg src={cardItem.src} alt={cardItem.alt} />
                      <CardBody className="text-left">
                        <h6>{cardItem.header}</h6>
                        <CardText className="small">{cardItem.content}</CardText>
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

export default NewsFeedCarousel;
