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
const FirebaseImage = lazy(async () => await import('components/App/FirebaseImage'));
const IwiChairView = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbIwiMember: null
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
      const iwiChairImageDownloadURL = await getSrc(iwiChairImageURL, 250, null, true, null, firebase.getStorageFileDownloadURL);
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
            <TKoTHelmet
              name={state.dbIwiMember.iwiChairName}
              path={`/AboutUs/${state.dbIwiMember.imid}`}
              description={draftToText(state.dbIwiMember.iwiChairProfile, '')}
              image={`${state.iwiChairImageDownloadURL}`}
            />
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
                  imageURL={state.iwiChairImageDownloadURL}
                  width="250"
                  lossless={true}
                  alt={state.dbIwiMember.iwiChairName}
                  loadingIconSize="lg"
                  imageResize="md"
                />
                <p className="h4 font-weight-bold text-center">{state.dbIwiMember.iwiMemberName}</p>
              </>)}
              pageHeaderFilterColour="blue-alt"
            />
            <Container className="bg-warning1 mt-5 pt-5">
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
