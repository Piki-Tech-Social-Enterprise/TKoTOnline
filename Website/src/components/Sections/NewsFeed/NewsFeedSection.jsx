import React, {
  useState,
  useEffect
} from 'react';
import queryString from 'query-string';
import {
  withFirebase
} from 'components/Firebase';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import Routes from 'components/Routes/routes';
import lazy from 'react-lazy-no-flicker/lib/lazy';
import {
  withSuspense
} from 'components/App/Utilities';

const Container = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-container' */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-row' */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-col' */'reactstrap/es/Col'));
const Button = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-button' */'reactstrap/es/Button'));
const Card = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-card' */'reactstrap/es/Card'));
const CardBody = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-cardbody' */'reactstrap/es/CardBody'));
const CardTitle = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-cardtitle' */'reactstrap/es/CardTitle'));
const CardHeader = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-cardheader' */'reactstrap/es/CardHeader'));
const Badge = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-badge' */'reactstrap/es/Badge'));
const LoadingSpinner = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-loading-spinner' */'components/App/LoadingSpinner'));
const NoDataToDisplayDiv = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-no-data-to-display-div' */'components/App/NoDataToDisplayDiv'));
const NewsFeedCaption = withSuspense(lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-newsfeed-caption' */'components/App/NewsFeedCaption')), 'app-newsfeed-caption');
const FirebaseImage = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-firebase-image' */'components/App/FirebaseImage'));
const {
  newsFeeds,
  mediaListPage
} = Routes;
const NewsFeedSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbNewsFeeds: [],
    availableCategoriesAsArray: [],
    newsSectionDescriptionAsHtml: '',
    draftToText: () => { },
    handleBlockTextClick: () => { }
  });
  const {
    containerClassName,
    showLearnMoreButton,
    isHomePage,
    isTKoTMedia
  } = props;
  const parsedQs = queryString.parse(window.location.search);
  const {
    c: searchCategory
  } = parsedQs;
  const {
    isLoading,
    dbNewsFeeds,
    availableCategoriesAsArray,
    newsSectionDescriptionAsHtml,
    draftToText,
    handleBlockTextClick
  } = state;
  const routeToUse = !isTKoTMedia ? newsFeeds : mediaListPage;
  const CategoryBadge = props => {
    const {
      category,
      color
    } = props;
    return (
      <>
        <Badge
          href={`${routeToUse}${category === 'All' ? '' : `?c=${encodeURIComponent(category)}`}`}
          className="mr-1"
          color={color}
          pill
        >{category}</Badge>
      </>
    );
  };
  useEffect(() => {
    const retrieveData = async () => {
      const {
        sortArray,
        groupBy,
        draftToText,
        handleBlockTextClick
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-utilities' */'components/App/Utilities');
      const getNewsFeeds = async fieldName => {
        const dbNewsFeedsFieldNames = [
          'category',
          'isFeatured',
          'isTKoTMedia',
          'date',
          'content',
          'header',
          'imageUrl',
          'externalUrl',
          'nfid',
          'name',
          'url'
        ];
        const dbNewsFeeds = await props.firebase.newsFeedRepository.getDbNewsFeedsAsArray(false, fieldName, true, NaN, dbNewsFeedsFieldNames);
        return dbNewsFeeds;
      };
      const {
        isTKoTMedia,
        dbNewsFeeds: dbNewsFeedsPassedIn,
        newsSectionDescription,
        doNotRetrieveData
      } = props;
      if (!doNotRetrieveData) {
        const dbNewsFeeds = Array.isArray(dbNewsFeedsPassedIn) && dbNewsFeedsPassedIn.length > 0
          ? dbNewsFeedsPassedIn
          : await getNewsFeeds(isTKoTMedia
            ? 'isTKoTMedia'
            : 'isFeatured');
        const filteredDbNewsFeeds = searchCategory
          ? dbNewsFeeds.filter(dbnf => dbnf.category.toLowerCase().indexOf(searchCategory.toLowerCase()) > -1)
          : dbNewsFeeds;
        const filteredDbNewsFeedsAndEPanui = filteredDbNewsFeeds
          .filter(item =>
            (!isTKoTMedia && !item.isTKoTMedia) ||
            (isTKoTMedia && item.isTKoTMedia)
          );
        const availableCategories = groupBy(filteredDbNewsFeedsAndEPanui, 'category');
        const availableCategoriesAsArray = [];
        Object.keys(availableCategories).map(k => {
          const categories = k.split(',').map(c => c.trim());
          categories.map(c => {
            if (!availableCategoriesAsArray.includes(c)) {
              availableCategoriesAsArray.push(c);
            }
            return null;
          })
          return null;
        });
        // console.log(`availableCategoriesAsArray: ${JSON.stringify(availableCategoriesAsArray, null, 2)}`);
        sortArray(filteredDbNewsFeedsAndEPanui, 'date', 'desc');
        const {
          default: draftToHtml
        } = await import(/* webpackPrefetch: true, webpackChunkName: 'draftjs-to-html' */'draftjs-to-html');
        const newsSectionDescriptionAsHtml = draftToHtml(JSON.parse(newsSectionDescription || '{}'));
        setState(s => ({
          ...s,
          isLoading: false,
          dbNewsFeeds: filteredDbNewsFeedsAndEPanui,
          availableCategoriesAsArray,
          newsSectionDescriptionAsHtml,
          draftToText,
          handleBlockTextClick
        }));
      }
    };
    if (isLoading) {
      retrieveData();
    }
  }, [props, isLoading, searchCategory]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id={!isTKoTMedia ? newsFeeds.replace('/', '') : mediaListPage.replace('/', '')} href="#TKoTOnline" className="tkot-anchor">&nbsp;</a>
        <Row className="debug-outline">
          <Col xs={12} className="mx-auto my-3">
            <h3 className="text-uppercase text-center">Our Latest {!isTKoTMedia ? 'Newsfeeds' : 'Media'}{searchCategory ? `: ${searchCategory}` : null}</h3>
            {
              !isTKoTMedia && newsSectionDescriptionAsHtml
                ? <>
                  <div
                    dangerouslySetInnerHTML={{ __html: newsSectionDescriptionAsHtml }}
                  />
                </>
                : null
            }
            {
              isHomePage || availableCategoriesAsArray.length === 0
                ? null
                : <>
                  <div className="mb-3">
                    Categories:&nbsp;
                    {
                      availableCategoriesAsArray.map((category, index) =>
                        <CategoryBadge
                          category={category}
                          color="primary"
                          key={index}
                        />)
                    }
                    <CategoryBadge
                      category="All"
                      color="secondary"
                    />
                  </div>
                </>
            }
            {/* <NewsFeedCarousel
              searchCategory={searchCategory}
            /> */}
            <Container className="my-3" fluid>
              <Row className={`cards-row ${isHomePage ? 'flex-row flex-nowrap' : ''}`}>
                {
                  isLoading
                    ? <LoadingSpinner caller="NewsFeedSection" />
                    : dbNewsFeeds.length === 0
                      ? <NoDataToDisplayDiv name={!isTKoTMedia ? newsFeeds.replace('/', '') : mediaListPage.replace('/', '')} isHomePage={isHomePage} />
                      : dbNewsFeeds.map((dbNewsFeed, index) => {
                        const {
                          content,
                          header,
                          imageUrl,
                          externalUrl,
                          nfid,
                          name,
                          url
                        } = dbNewsFeed;
                        const displayName = header || name || '';
                        const isExternalLink = (externalUrl || url || '').length > 0;
                        const externalLink = isExternalLink
                          ? externalUrl || url
                          : '';
                        const internalLink = `${routeToUse}/${nfid}`;
                        const contentAsText = draftToText(content, '');
                        return (
                          <Col xs={12} sm={6} lg={4} key={index}>
                            <Card className="card-block news-feed-card">
                              <CardHeader>
                                <CardTitle
                                  className="h4 my-3 mx-2 font-weight-bold news-feed-header clickable header-with-text"
                                  onClick={async e => await handleBlockTextClick(e, 'div.news-feed-header', 'header-with-text')}
                                >{displayName}</CardTitle>
                              </CardHeader>
                              <FirebaseImage
                                className="card-img-max-height"
                                imageURL={imageUrl || ''}
                                width="340"
                                lossless={true}
                                alt={displayName}
                                loadingIconSize="lg"
                                imageResize="md"
                              />
                              <CardBody className="text-left bg-white">
                                <p className="font-weight-bold">
                                  <NewsFeedCaption
                                    newsFeed={dbNewsFeed}
                                    categoryLinkClassName="text-dark"
                                  />
                                </p>
                                <p
                                  className="news-feed-content clickable d-inline-block block-with-text"
                                  onClick={async e => await handleBlockTextClick(e, 'p.news-feed-content', 'block-with-text')}
                                >{contentAsText}</p>
                                <div className="text-center">
                                  <Button
                                    href={isExternalLink ? externalLink : internalLink}
                                    target={isExternalLink ? '_blank' : '_self'}
                                    rel={isExternalLink ? 'noopener noreferrer' : 'alternate'}
                                    className="tkot-primary-red-bg-color btn-outline-dark"
                                    color="white"
                                    onClick={() => sendEvent(`${isHomePage ? 'Home -' : ''} News page`, 'Clicked "Pānui Mai..." button', displayName, isExternalLink ? externalLink : internalLink)}
                                  >Pānui Mai...</Button>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      })
                }
              </Row>
            </Container>
            {
              showLearnMoreButton
                ? <div className="mb-4 text-center">
                  <Button href={!isTKoTMedia ? newsFeeds : mediaListPage} className="text-dark" color="link" size="lg" onClick={() => sendEvent('Home page', 'Clicked "View More..." button')}>
                    View more...
                  </Button>
                </div>
                : null
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withFirebase(NewsFeedSection);
