import React, {
  useState,
  useEffect,
  lazy
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
// import NewsFeedCarousel from './NewsFeedCarousel';
import queryString from 'query-string';
import {
  withFirebase
} from 'components/Firebase';
import NewsFeedCaption from 'components/App/NewsFeedCaption';
import {
  draftToText,
  sortArray,
  handleBlockTextClick
} from 'components/App/Utilities';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import draftToHtml from 'draftjs-to-html';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const NoDataToDisplayDiv = lazy(async () => await import('components/App/NoDataToDisplayDiv'));
const FirebaseImage = lazy(async () => await import('components/App/FirebaseImage'));
const NewsFeedSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbSettings: {},
    dbNewsFeeds: []
  });
  const {
    containerClassName,
    showLearnMoreButton,
    isHomePage
  } = props;
  const parsedQs = queryString.parse(window.location.search);
  const {
    c: searchCategory
  } = parsedQs;
  const {
    isLoading,
    dbSettings,
    dbNewsFeeds
  } = state;
  useEffect(() => {
    const getDbNewsFeeds = async () => {
      const {
        firebase,
        isHomePage
      } = props;
      const dbSettings = await firebase.getDbSettingsValues(true); // debugger;
      const dbNewsFeeds = isHomePage
        ? await firebase.getDbNewsFeedsAsArray(false, 'isFeatured')
        : await firebase.getDbNewsFeedsAsArray();
      const filteredDbNewsFeeds = searchCategory
        ? dbNewsFeeds.filter(dbnf => dbnf.category.toLowerCase().indexOf(searchCategory.toLowerCase()) > -1)
        : dbNewsFeeds;
      const dbEPanui = isHomePage
        ? await firebase.getDbEPanuiListAsArray(false, 'isFeatured')
        : await firebase.getDbEPanuiListAsArray();
      const filteredDbEPanui = searchCategory
        ? dbEPanui.filter(dbep => dbep.category.toLowerCase().indexOf(searchCategory.toLowerCase()) > -1)
        : dbEPanui;
      const filteredDbNewsFeedsAndEPanui = filteredDbNewsFeeds.concat(filteredDbEPanui);
      sortArray(filteredDbNewsFeedsAndEPanui, 'date', 'desc');
      setState(s => ({
        ...s,
        isLoading: false,
        dbSettings,
        dbNewsFeeds: filteredDbNewsFeedsAndEPanui
      }));
    };
    if (isLoading) {
      getDbNewsFeeds();
    }
  }, [props, isLoading, setState, searchCategory]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id="NewsFeed" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
        <Row className="debug-outline">
          <Col className="mx-auto my-3">
            <h3 className="text-uppercase text-center">Our Latest News{searchCategory ? `: ${searchCategory}` : null}</h3>
            {
              dbSettings.newsSectionDescription
                ? <>
                  <div
                    dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(dbSettings.newsSectionDescription)) }}
                  />
                </>
                : null
            }
            {/* <NewsFeedCarousel
              searchCategory={searchCategory}
            /> */}
            <Container className="my-3" fluid>
              <Row className={`cards-row ${isHomePage ? 'flex-row flex-nowrap' : ''}`}>
                {
                  isLoading
                    ? <LoadingSpinner />
                    : dbNewsFeeds.length === 0
                      ? <NoDataToDisplayDiv name="Newsfeeds" isHomePage={isHomePage} />
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
                        const internalLink = `/NewsFeeds/${nfid}`;
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
                  <Button href="/NewsFeeds" className="text-dark" color="link" size="lg" onClick={() => sendEvent('Home page', 'Clicked "View More..." button')}>
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
