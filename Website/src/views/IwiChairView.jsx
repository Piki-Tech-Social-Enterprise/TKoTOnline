import React, {
  useEffect,
  useState
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Container = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Container'));
const Row = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Row'));
const Col = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Col'));
const PageLoadingSpinner = lazy(async () => await import(/* webpackPreload: true */'components/App/PageLoadingSpinner'));
const TKoTHelmet = lazy(async () => await import(/* webpackPreload: true */'components/App/TKoTHelmet'));
const HomeNavbar = lazy(async () => await import(/* webpackPrefetch: true */'components/Navbars/HomeNavbar'));
const HomeHeader = lazy(async () => await import(/* webpackPrefetch: true */'components/Headers/HomeHeader'));
const HomeFooter = lazy(async () => await import(/* webpackPrefetch: true */'components/Footers/HomeFooter'));
const FirebaseImage = lazy(async () => await import(/* webpackPrefetch: true */'components/App/FirebaseImage'));
const INITAL_STATE = {
  isLoading: true,
  dbIwiMember: {},
  iwiChairImageDownloadURL: '',
  iwiChairProfileAsText: '',
  iwiChairProfileAsHtml: ''
};
const IwiChairView = props => {
  const [state, setState] = useState(INITAL_STATE);
  const {
    isLoading,
    dbIwiMember,
    iwiChairImageDownloadURL,
    iwiChairProfileAsText,
    iwiChairProfileAsHtml
  } = state;
  const {
    iwiChairName,
    imid,
    iwiMemberName
  } = dbIwiMember;
  useEffect(() => {
    const retrieveIwiChairValue = async () => {
      const {
        getSrc,
        getImageURLToUse,
        draftToText
      } = await import('components/App/Utilities');
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
        iwiChairImageURL,
        iwiChairProfile
      } = dbIwiMember;
      const iwiChairImageDownloadURL = await getSrc(getImageURLToUse(NaN, iwiChairImageURL), null, null, true, null, storageRepository.getStorageFileDownloadURL);
      const iwiChairProfileAsText = draftToText(iwiChairProfile, '');
      const {
        default: draftToHtml
      } = await import(/* webpackPrefetch: true */'draftjs-to-html');
      const iwiChairProfileAsHtml = draftToHtml(JSON.parse(iwiChairProfile || '{}'));
      setState(s => ({
        ...s,
        isLoading: false,
        dbIwiMember,
        iwiChairImageDownloadURL,
        iwiChairProfileAsText,
        iwiChairProfileAsHtml
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
              description={iwiChairProfileAsText}
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
                  dangerouslySetInnerHTML={{ __html: iwiChairProfileAsHtml }}
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
