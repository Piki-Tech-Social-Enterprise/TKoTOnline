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
  CardHeader,
  Badge
} from 'reactstrap';
import queryString from 'query-string';
import {
  withFirebase
} from 'components/Firebase';
import {
  draftToText,
  sortArray,
  handleBlockTextClick,
  groupBy
} from 'components/App/Utilities';
import {
  sendEvent
} from 'components/App/GoogleAnalytics';
import Routes from 'components/Routes/routes';
import {
  lazy
} from 'react-lazy-no-flicker';

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
const NoDataToDisplayDiv = lazy(async () => await import('components/App/NoDataToDisplayDiv'));
const NewsFeedCaption = lazy(async () => await import('components/App/NewsFeedCaption'));
const FirebaseImage = lazy(async () => await import('components/App/FirebaseImage'));
const {
  covidListPage
} = Routes;
const CovidSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbCovidList: [],
    availableCategoriesAsArray: []
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
    dbCovidList,
    availableCategoriesAsArray
  } = state;
  const routeToUse = covidListPage;
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
    const getCovidList = async () => {
      const getDbCovidList = async fieldName => {
        const dbCovidListFieldNames = [
          'category',
          'content',
          'header',
          'imageUrl',
          'externalUrl',
          'cvid',
          'name',
          'url'
        ];
        const dbCovidList = await props.firebase.covidListRepository.getDbCovidListAsArray(false, fieldName, true, NaN, dbCovidListFieldNames);
        return dbCovidList;
      };
      const {
        isHomePage,
        dbCovidList: dbCovidListPassedIn
      } = props;
      const dbCovidList = dbCovidListPassedIn
        ? dbCovidListPassedIn
        : await getDbCovidList(isHomePage
          ? 'isFeatured'
          : 'active');
      const filteredDbCovidList = searchCategory
        ? dbCovidList.filter(dbcv => dbcv.category.toLowerCase().indexOf(searchCategory.toLowerCase()) > -1)
        : dbCovidList;
      const availableCategories = groupBy(filteredDbCovidList, 'category');
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
      sortArray(filteredDbCovidList, 'date', 'desc');
      setState(s => ({
        ...s,
        isLoading: false,
        dbCovidList: filteredDbCovidList,
        availableCategoriesAsArray
      }));
    };
    if (isLoading) {
      getCovidList();
    }
  }, [props, isLoading, searchCategory]);
  return (
    <div className={`tkot-section ${containerClassName || ''}`}>
      <Container>
        <a id={covidListPage.replace('/', '')} href="#TKoTOnline" className="tkot-anchor">&nbsp;</a>
        <Row className="debug-outline">
          <Col xs={12} className="mx-auto my-3">
            <h3 className="text-uppercase text-center">Our Latest COVID-19 Kaupapa{searchCategory ? `: ${searchCategory}` : null}</h3>
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
            {/* <CovidCarousel
              searchCategory={searchCategory}
            /> */}
            <Container className="my-3" fluid>
              <Row className={`cards-row ${isHomePage ? 'flex-row flex-nowrap' : ''}`}>
                {
                  isLoading
                    ? <LoadingSpinner caller="CovidSection" />
                    : dbCovidList.length === 0
                      ? <NoDataToDisplayDiv name={covidListPage.replace('/', '')} isHomePage={isHomePage} />
                      : dbCovidList.map((dbCovid, index) => {
                        const {
                          content,
                          header,
                          imageUrl,
                          externalUrl,
                          cvid,
                          name,
                          url
                        } = dbCovid;
                        const displayName = header || name || '';
                        const isExternalLink = (externalUrl || url || '').length > 0;
                        const externalLink = isExternalLink
                          ? externalUrl || url
                          : '';
                        const internalLink = `${routeToUse}/${cvid}`;
                        const contentAsText = draftToText(content, '');
                        return (
                          <Col xs={12} sm={6} lg={4} key={index}>
                            <Card className="card-block covid-card">
                              <CardHeader>
                                <CardTitle
                                  className="h4 my-3 mx-2 font-weight-bold covid-header clickable header-with-text"
                                  onClick={async e => await handleBlockTextClick(e, 'div.covid-header', 'header-with-text')}
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
                                    newsFeed={dbCovid}
                                    categoryLinkClassName="text-dark"
                                  />
                                </p>
                                <p
                                  className="covid-content clickable d-inline-block block-with-text"
                                  onClick={async e => await handleBlockTextClick(e, 'p.covid-content', 'block-with-text')}
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
                  <Button href={covidListPage} className="text-dark" color="link" size="lg" onClick={() => sendEvent('Home page', 'Clicked "View More..." button')}>
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

export default withFirebase(CovidSection);
