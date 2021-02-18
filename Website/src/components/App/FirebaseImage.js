import React, {
  useState,
  useEffect
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import noImageAvailable from 'assets/img/tkot/no-image-available.svg';
import PropTypes from 'prop-types';

const propTypes = {
  isLoading: PropTypes.bool,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  imageURL: PropTypes.string,
  loadingIconSize: PropTypes.oneOf([
    '',
    'sm',
    'lg'
  ]),
  imageResize: PropTypes.oneOf([
    '',
    'sm',
    'md',
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
  imageResize: '',
  lossless: true
};
const FirebaseImage = props => {
  const [state, setState] = useState({
    isLoading: true,
    src: '',
    alt: ''
  });
  const {
    className,
  } = props;
  const {
    isLoading,
    alt,
    src,
    width,
    height
  } = state;
  useEffect(() => {
    const retrieveData = async () => {
      const {
        getSrc,
        isNullOrEmpty,
        getImageURLToUse
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-utilities' */'./Utilities');
      const {
        firebase,
        alt,
        imageResize,
        imageURL,
        src,
        width,
        height,
        lossless
      } = props;
      const {
        storageRepository
      } = firebase;
      const {
        getStorageFileDownloadURL
      } = storageRepository;
      let imageSrc = src;
      if (isNullOrEmpty(imageSrc)) {
        const imageURLToUse = getImageURLToUse(imageResize, imageURL);
        try {
          imageSrc = await getSrc(imageURLToUse, width, height, lossless, noImageAvailable, getStorageFileDownloadURL);
        } catch (error) {
          const {
            code,
            message
          } = error;
          console.error(`Firebase Image Get Src Error for '${imageURLToUse}': ${message} (${code})`);
          if (code === 'storage/object-not-found') {
            imageSrc = await getStorageFileDownloadURL(imageURL);
          }
        }
      }
      setState(s => ({
        ...s,
        isLoading: false,
        alt: alt,
        src: imageSrc,
        width,
        height
      }));
    };
    if (isLoading) {
      retrieveData();
    }
    return () => { };
  }, [props, isLoading]);
  return (
    <>
      <img
        className={`lazyload ${className} ${isLoading ? 'invisible' : ''}`}
        alt={alt}
        data-src={src}
        src={src}
        title={alt}
        width={width}
        height={height}
      />
    </>
  );
};

FirebaseImage.propTypes = propTypes;
FirebaseImage.defaultProps = defaultProps;

export default withFirebase(FirebaseImage);
