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
const ProjectView = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbProject: null,
    imageDownloadURL: ''
  });
  useEffect(() => {
    const retrieveProjectValue = async () => {
      const {
        firebase,
        match
      } = props;
      const {
        pid
      } = match.params;
      const dbProject = await firebase.projectsRepository.getDbProjectValue(pid);
      const {
        imageUrl
      } = dbProject;
      const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, firebase.storageRepository.getStorageFileDownloadURL);
      setState(s => ({
        ...s,
        isLoading: false,
        dbProject: dbProject,
        imageDownloadURL: imageDownloadURL
      }));
    };
    if (state.isLoading) {
      retrieveProjectValue();
    }
  }, [props, state]);
  return (
    <>
      {
        state.isLoading
          ? <PageLoadingSpinner caller="ProjectView" />
          : <div id="Project">
            <TKoTHelmet
              name={state.dbProject.header}
              path={`/Projects/${state.dbProject.pid}`}
              description={draftToText(state.dbProject.content, '')}
              image={`${state.imageDownloadURL}`}
            />
            <HomeNavbar
              initalTransparent={false}
              colorOnScrollValue={25}
            />
            <HomeHeader
              pageHeaderImage={state.imageDownloadURL}
              pageHeaderTitle=""
              pageHeaderCaption=""
              pageHeaderFilterColour=""
            />
            <Container className="bg-warning1 mt-1 pt-5">
              <div className="h1 py-3 mb-0 font-weight-bold text-center">{state.dbProject.header}</div>
              <Row>
                <Col
                  dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(state.dbProject.content)) }}
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
