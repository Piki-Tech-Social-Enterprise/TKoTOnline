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
import FirebaseImage from 'components/App/FirebaseImage';

const IwiChairView = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbIwiMember: null,
    iwiChairImageDownloadURL: ''
  });
  useEffect(() => {
    const retrieveIwiChairValue = async () => {
      const {
        firebase,
        match
      } = props;
      const {
        imid
      } = match.params;
      const dbIwiMember = await firebase.getDbIwiMemberValue(imid);
      const {
        iwiChairImageURL
      } = dbIwiMember;
      const iwiChairImageDownloadURL = iwiChairImageURL.startsWith('/images/')
        ? await firebase.getStorageFileDownloadURL(iwiChairImageURL)
        : iwiChairImageURL
      setState(s => ({
        ...s,
        isLoading: false,
        dbIwiMember: dbIwiMember,
        iwiChairImageDownloadURL: iwiChairImageDownloadURL
      }));
    };
    if (state.isLoading) {
      retrieveIwiChairValue();
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
          : <div id="IwiChair">
            <HomeNavbar
              initalTransparent={false}
              colorOnScrollValue={25}
            />
            <HomeHeader
              pageHeaderImage={''}
              pageHeaderTitle={state.dbIwiMember.iwiChairName}
              pageHeaderCaption={() => (<>
                <FirebaseImage
                  className="rounded-circle iwi-chair-image"
                  imageURL={state.dbIwiMember.iwiChairImageURL}
                  alt={state.dbIwiMember.iwiChairName}
                  loadingIconSize="lg"
                />
                <p className="h4 font-weight-bold text-center">{state.dbIwiMember.iwiMemberName}</p>
              </>)}
              pageHeaderFilterColour="blue-alt"
            />
            <Container className="bg-warning1 pt-5 pb-3">
              <Row>
                <Col
                  dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(state.dbIwiMember.iwiChairProfile)) }}
                />
              </Row>
            </Container>
            <HomeFooter />
          </div>
      }
    </>
  );
};

export default withFirebase(IwiChairView);
