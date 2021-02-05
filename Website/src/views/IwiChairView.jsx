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
  getSrc,
  getImageURLToUse
} from 'components/App/Utilities';
import {
  lazy
} from 'react-lazy-no-flicker';

const PageLoadingSpinner = lazy(async () => await import('components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import('components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import('components/Navbars/HomeNavbar'));
const HomeHeader = lazy(async () => await import('components/Headers/HomeHeader'));
const HomeFooter = lazy(async () => await import('components/Footers/HomeFooter'));
const FirebaseImage = lazy(async () => await import('components/App/FirebaseImage'));
const INITAL_STATE = {
  isLoading: true,
  dbIwiMember: {},
  iwiChairImageDownloadURL: ''
};
const IwiChairView = props => {
  const [state, setState] = useState(INITAL_STATE);
  const {
    isLoading,
    dbIwiMember,
    iwiChairImageDownloadURL
  } = state;
  const {
    iwiChairName,
    imid,
    iwiChairProfile,
    iwiMemberName
  } = dbIwiMember;
  useEffect(() => {
    const retrieveIwiChairValue = async () => {
      const {
        firebase,
        match
      } = props;
      const {
        iwiMembersRepository,
        storageRepository
      } = firebase;
      const {
        imid
      } = match.params;
      const dbIwiMemberFieldNames = [
        'iwiChairImageURL',
        'iwiChairName',
        'imid',
        'iwiChairProfile',
        'iwiMemberName'
      ];
      const dbIwiMember = await iwiMembersRepository.getDbIwiMemberValue(imid, dbIwiMemberFieldNames);
      const {
        iwiChairImageURL
      } = dbIwiMember;
      const iwiChairImageDownloadURL = await getSrc(getImageURLToUse(NaN, iwiChairImageURL), null, null, true, null, storageRepository.getStorageFileDownloadURL);
      setState(s => ({
        ...s,
        isLoading: false,
        dbIwiMember,
        iwiChairImageDownloadURL
      }));
    };
    if (isLoading) {
      retrieveIwiChairValue();
    }
  }, [props, isLoading]);
  return (
    <>
      {
        isLoading
          ? <PageLoadingSpinner caller="IwiChairView" />
          : <div id="IwiChair">
            <TKoTHelmet
              name={iwiChairName}
              path={`/AboutUs/${imid}`}
              description={draftToText(iwiChairProfile, '')}
              image={`${iwiChairImageDownloadURL}`}
            />
            <HomeNavbar
              initalTransparent={false}
              colorOnScrollValue={25}
            />
            <HomeHeader
              pageHeaderImage={''}
              pageHeaderTitle={iwiChairName}
              pageHeaderCaption={() => (<>
                <FirebaseImage
                  className="rounded-circle iwi-chair-image"
                  src={iwiChairImageDownloadURL}
                  width="250"
                  lossless={true}
                  alt={iwiChairName}
                  loadingIconSize="lg"
                  imageResize="md"
                />
                <p className="h4 font-weight-bold text-center">{iwiMemberName}</p>
              </>)}
              pageHeaderFilterColour="blue-alt"
            />
            <Container className="bg-warning1 mt-5 pt-5">
              <Row>
                <Col
                  dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(iwiChairProfile)) }}
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
