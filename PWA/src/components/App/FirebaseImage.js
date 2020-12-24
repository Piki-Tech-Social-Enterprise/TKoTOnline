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
  getSrc,
  isNullOrEmpty,
  getImageURLToUse
} from '../App/Utilities';

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
    src,
    width,
    height
  } = state;
  // !isLoading && console.log(`src: ${src}`);
  useEffect(() => {
    const retrieveData = async () => {
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
      const imageURLToUse = getImageURLToUse(imageResize, imageURL);
      let imageSrc = src;
      if (isNullOrEmpty(imageSrc)) {
        try {
          imageSrc = await getSrc(imageURLToUse, width, height, lossless, noImageAvailable, firebase.getStorageFileDownloadURL);
        } catch (error) {
          const {
            code,
            message
          } = error;
          console.error(`Firebase Image Get Src Error for '${imageURLToUse}': ${message} (${code})`);
          if (code === 'storage/object-not-found') {
            imageSrc = await firebase.getStorageFileDownloadURL(imageURL);
          }
        }
        // console.log(`imageURL: ${imageURL}, imageSrc: ${imageSrc}`);
      }
      setState(s => ({
        ...s,
        isLoading: false,
        alt: alt,
        src: imageSrc,
        width,
        height,
        imageURL
      }));
    };
    if (state.isLoading || state.imageURL !== props.imageURL) {
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
