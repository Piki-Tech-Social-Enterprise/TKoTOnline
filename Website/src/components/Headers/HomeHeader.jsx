import React, {
  useState,
  useEffect
} from 'react';
// import {
//   Container
// } from 'reactstrap';
import PropTypes from 'prop-types';
import Routes from 'components/Routes/routes';
import {
  withFirebase
} from 'components/Firebase';
import lazy from 'react-lazy-no-flicker/lib/lazy';
// import {
//   getImageURLToUse
// } from 'components/App/Utilities';

const Container = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Container'));
const LoadingSpinner = lazy(async () => await import(/* webpackPrefetch: true */'components/App/LoadingSpinner'));
const INITIAL_STATE = {
  isLoading: true,
  backgroundImage: 'linear-gradient(183deg, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0))'
};
const HomeHeader = props => {
  const {
    pageHeaderImage,
    pageHeaderTitle,
    pageHeaderCaption,
    pageHeaderFilterColour,
    showClickScrollDownForMoreLink
  } = props;
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading,
    backgroundImage
  } = state;
  useEffect(() => {
    const pageSetup = async () => {
      let pageHeaderImage = props.pageHeaderImage;
      if (pageHeaderImage.startsWith('/images')) {
        const {
          getImageURLToUse
        } = await import(/* webpackPrefetch: true */'components/App/Utilities');
        const imageSize = window.screen.width <= 400
          ? 'md'
          : NaN;
        pageHeaderImage = await props.firebase.storageRepository.getStorageFileDownloadURL(getImageURLToUse(imageSize, pageHeaderImage));
      }
      const backgroundImage = `url('${pageHeaderImage}')`;
      setState(s => ({
        ...s,
        isLoading: false,
        backgroundImage
      }));
    };
    if (isLoading) {
      pageSetup();
    }
  }, [props, isLoading]);
  return (
    <>
      {
        isLoading
          ? <LoadingSpinner caller="HomeHeader" />
          : <>
            {/* <a id="About" href="#TKoTOnline" className="tkot-anchor">&nbsp;</a> */}
            <div className="page-header clear-filter tkot-section" filter-color={pageHeaderFilterColour} style={{
              minHeight: '24.188rem'
            }}>
              {
                pageHeaderImage
                  ? <div className="page-header-image" style={{
                    backgroundColor: 'gray',
                    backgroundImage
                  }} />
                  : null
              }
              <Container className="py-5 text-center">
                <div id="header-container">
                  <div className="h1 py-3 mb-0 font-weight-bold">{pageHeaderTitle}</div>
                  <div className="h5 py-0">{
                    typeof pageHeaderCaption === 'function'
                      ? pageHeaderCaption()
                      : pageHeaderCaption
                  }</div>
                </div>
                {
                  showClickScrollDownForMoreLink
                    ? <a href={Routes.iwiMembersAnchor} className="text-decoration-none">
                      <p className="my-5 py-3 text-dark"><i className="fas fa-angle-double-down" /> Click/Scroll down for more <i className="fas fa-angle-double-down" /></p>
                    </a>
                    : null
                }
              </Container>
            </div>
          </>
      }
    </>
  );
};

HomeHeader.propTypes = {
  pageHeaderImage: PropTypes.string.isRequired,
  pageHeaderTitle: PropTypes.string,
  pageHeaderCaption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  pageHeaderFilterColour: PropTypes.string
};
HomeHeader.defaultProps = {
  pageHeaderTitle: 'Me mahi tahi tātou',
  pageHeaderCaption: 'Working together to strengthen Māori whānau, hāpu and Iwi in Te Tai Tokerau.',
  pageHeaderFilterColour: 'black'
};

export default withFirebase(HomeHeader);
