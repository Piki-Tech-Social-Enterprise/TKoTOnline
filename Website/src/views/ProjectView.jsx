import React, {
  useEffect,
  useState
} from 'react';
// import {
//   Container,
//   Row,
//   Col
// } from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
// import draftToHtml from 'draftjs-to-html';
// import {
//   draftToText,
//   getSrc
// } from 'components/App/Utilities';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Container = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Col'));
const PageLoadingSpinner = lazy(async () => await import(/* webpackPreload: true */'components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import(/* webpackPreload: true */'components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import(/* webpackPrefetch: true */'components/Navbars/HomeNavbar'));
const HomeHeader = lazy(async () => await import(/* webpackPrefetch: true */'components/Headers/HomeHeader'));
const HomeFooter = lazy(async () => await import(/* webpackPrefetch: true */'components/Footers/HomeFooter'));
const INITAL_STATE = {
  isLoading: true,
  dbProject: {},
  imageDownloadURL: '',
  contentAsText: '',
  contentAsHtml: ''
};
const ProjectView = props => {
  const [state, setState] = useState(INITAL_STATE);
  const {
    isLoading,
    dbProject,
    imageDownloadURL,
    contentAsText,
    contentAsHtml
  } = state;
  const {
    header,
    pid
  } = dbProject;
  useEffect(() => {
    const retrieveProjectValue = async () => {
      const {
        getSrc,
        draftToText
      } = await import('components/App/Utilities');
      const {
        firebase,
        match
      } = props;
      const {
        projectsRepository,
        storageRepository
      } = firebase;
      const {
        pid
      } = match.params;
      const dbProjectFieldNames = [
        'imageUrl',
        'header',
        'pid',
        'content'
      ];
      const dbProject = await projectsRepository.getDbProjectValue(pid, dbProjectFieldNames);
      const {
        imageUrl,
        content
      } = dbProject;
      const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, storageRepository.getStorageFileDownloadURL);
      const contentAsText = draftToText(content, '');
      const {
        default: draftToHtml
      } = await import(/* webpackPrefetch: true */'draftjs-to-html');
      const contentAsHtml = draftToHtml(JSON.parse(content || '{}'));
      setState(s => ({
        ...s,
        isLoading: false,
        dbProject,
        imageDownloadURL,
        contentAsText,
        contentAsHtml
      }));
    };
    if (isLoading) {
      retrieveProjectValue();
    }
  }, [props, isLoading]);
  return (
    <>
      {
        isLoading
          ? <PageLoadingSpinner caller="ProjectView" />
          : <div id="Project">
            <TKoTHelmet
              name={header}
              path={`/Projects/${pid}`}
              description={contentAsText}
              image={`${imageDownloadURL}`}
            />
            <HomeNavbar
              initalTransparent={false}
              colorOnScrollValue={25}
            />
            <HomeHeader
              pageHeaderImage={imageDownloadURL}
              pageHeaderTitle=""
              pageHeaderCaption=""
              pageHeaderFilterColour=""
            />
            <Container className="bg-warning1 mt-1 pt-5">
              <div className="h1 py-3 mb-0 font-weight-bold text-center">{header}</div>
              <Row>
                <Col
                  dangerouslySetInnerHTML={{ __html: contentAsHtml }}
                />
              </Row>
            </Container>
            <HomeFooter />
          </div>
      }
    </>
  );
};

export default withFirebase(ProjectView);
