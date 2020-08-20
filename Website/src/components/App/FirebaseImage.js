import React, {
  useState,
  useEffect
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import noImageAvailable from 'assets/img/tkot/no-image-available.svg';
// import LoadingIcon from './LoadingIcon';
import PropTypes from 'prop-types';
import {
  getSrc
} from './Utilities';

const propTypes = {
  isLoading: PropTypes.bool,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  imageURL: PropTypes.string.isRequired,
  loadingIconSize: PropTypes.oneOf([
    '',
    'sm',
    'lg'
  ]),
  src: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  lossless: PropTypes.bool
};
const defaultProps = {
  className: 'firebase-image',
  loadingIconSize: '',
  lossless: true
};
const FirebaseImage = props => {
  const [state, setState] = useState({
    isLoading: true,
    src: '',
    // src: noImageAvailable,
    alt: ''
  });
  const {
    className,
    // loadingIconSize
  } = props;
  const {
    isLoading,
    alt,
    src
  } = state;
  // !isLoading && console.log(`src: ${src}`);
  useEffect(() => {
    const retrieveData = async () => {
      const {
        firebase,
        alt,
        imageURL,
        src,
        width,
        height,
        lossless
      } = props;
      const imageSrc = src || await getSrc(imageURL, width, height, lossless, noImageAvailable, firebase.getStorageFileDownloadURL);
      // console.log(`imageURL: ${imageURL}, imageSrc: ${imageSrc}`);
      setState(s => ({
        ...s,
        isLoading: false,
        alt: alt,
        src: imageSrc
      }));
    };
    if (state.isLoading) {
      retrieveData();
    }
    return () => { };
  }, [props, state]);
  return (
    <>
      {/* {
        isLoading
          ? <LoadingIcon size={loadingIconSize} />
          : null
      } */}
      <img
        className={`${className} ${isLoading ? 'invisible' : ''}`}
        alt={alt}
        src={src}
        title={alt}
      />
    </>
  );
};

FirebaseImage.propTypes = propTypes;
FirebaseImage.defaultProps = defaultProps;

export default withFirebase(FirebaseImage);
