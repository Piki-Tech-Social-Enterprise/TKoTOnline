import React, {
  useState,
  useEffect
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import noImageAvailable from 'assets/img/tkot/no-image-available.svg';
import LoadingIcon from './LoadingIcon';
import PropTypes from 'prop-types';
import {
  getSrc
} from './Utilities';

const propTypes = {
  isLoading: PropTypes.bool,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  imageURL: PropTypes.string.isRequired,
  isImageLoading: PropTypes.bool,
  loadingIconSize: PropTypes.oneOf([
    '',
    'sm',
    'lg'
  ]),
  src: PropTypes.string
};
const defaultProps = {
  className: 'firebase-image',
  loadingIconSize: ''
};
const FirebaseImage = props => {
  const [state, setState] = useState({
    isLoading: true,
    src: noImageAvailable,
    alt: '',
    isImageLoading: false
  });
  const handleLoad = async e => {
    e.preventDefault();
    setState(s => ({
      ...s,
      isImageLoading: false
    }));
  }
  const handleError = async e => {
    e.preventDefault();
    console.log(`Firebase Image Error: '${state.src}' was not found.`);
    setState(s => ({
      ...s,
      src: noImageAvailable,
      isImageLoading: false
    }));
  };
  const {
    className,
    loadingIconSize
  } = props;
  const {
    isLoading,
    alt,
    src,
    isImageLoading
  } = state;
  !isLoading && console.log('src: ', src);
  useEffect(() => {
    const retrieveData = () => {
      const {
        alt,
        imageURL,
        src,
        width,
        height,
        lossless
      } = props;
      const imageSrc = src || getSrc(imageURL, width, height, lossless, noImageAvailable);
      setState(s => ({
        ...s,
        isLoading: false,
        alt: alt,
        src: imageSrc,
        isImageLoading: true
      }));
    };
    if (state.isLoading) {
      retrieveData();
    }
    return () => { };
  }, [props, state]);
  return (
    <>
      {
        isLoading
          ? <LoadingIcon size={loadingIconSize} />
          : null
      }
      <img
        className={`${className} ${isLoading || isImageLoading ? 'invisible' : ''}`}
        alt={alt}
        src={src}
        title={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
    </>
  );
};

FirebaseImage.propTypes = propTypes;
FirebaseImage.defaultProps = defaultProps;

export default withFirebase(FirebaseImage);
