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
import LoadingSpinner from 'components/App/LoadingSpinner';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeHeader from 'components/Headers/HomeHeader';
import HomeFooter from 'components/Footers/HomeFooter';
import draftToHtml from 'draftjs-to-html';

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
      const imageDownloadURL = imageUrl.startsWith('/images/')
        ? await firebase.getStorageFileDownloadURL(imageUrl)
        : imageUrl
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
            <HomeNavbar
              initalTransparent={false}
              colorOnScrollValue={25}
            />
            <HomeHeader
              pageHeaderImage={state.imageDownloadURL}
              pageHeaderTitle={state.dbProject.header}
              pageHeaderCaption=""
            />
            <Container className="bg-warning1 py-3">
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
