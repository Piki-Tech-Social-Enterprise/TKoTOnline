import React, {
  useEffect,
  useState
} from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
import draftToHtml from 'draftjs-to-html';
import {
  draftToText,
  getSrc
} from 'components/App/Utilities';
import {
  lazy
} from 'react-lazy-no-flicker';

const PageLoadingSpinner = lazy(async () => await import('components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import('components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeHeader = lazy(async () => await import('components/Headers/HomeHeader'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const INITAL_STATE = {
  isLoading: true,
  dbProject: {},
  imageDownloadURL: ''
};
const ProjectView = props => {
  const [state, setState] = useState(INITAL_STATE);
  const {
    isLoading,
    dbProject,
    imageDownloadURL
  } = state;
  const {
    header,
    pid,
    content
  } = dbProject;
  useEffect(() => {
    const retrieveProjectValue = async () => {
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
      const dbProject = await projectsRepository.getDbProjectValue(pid, dbProjectFieldNames); debugger;
      const {
        imageUrl
      } = dbProject;
      const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, storageRepository.getStorageFileDownloadURL);
      setState(s => ({
        ...s,
        isLoading: false,
        dbProject,
        imageDownloadURL
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
              description={draftToText(content, '')}
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
                  dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(content)) }}
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
