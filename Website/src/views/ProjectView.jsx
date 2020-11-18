import React, {
  useEffect,
  useState,
  lazy
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

const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
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
      const dbProject = await firebase.getDbProjectValue(pid);
      const {
        imageUrl
      } = dbProject;
      const imageDownloadURL = await getSrc(imageUrl, null, null, true, null, firebase.getStorageFileDownloadURL);
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
          ? <LoadingSpinner
            outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
            innerClassName="m-5 p-5 text-center"
          />
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
              pageHeaderTitle={state.dbProject.header}
              pageHeaderCaption=""
              pageHeaderFilterColour=""
            />
            <Container className="bg-warning1 mt-5 pt-5">
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
