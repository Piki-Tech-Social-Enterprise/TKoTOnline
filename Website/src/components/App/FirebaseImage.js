import React, {
  Component
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import noImageAvailable from 'assets/img/tkot/no-image-available.svg';
import LoadingIcon from './LoadingIcon';
import shallowCompare, {
  isEmptyObject,
  handleLoadBlob
} from './Utilities';
import PropTypes from 'prop-types';
import axios from 'axios';

const {
  dirname
} = require("path");
const propTypes = {
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  imageURL: PropTypes.string.isRequired,
  isImageLoading: PropTypes.bool,
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
  src: PropTypes.string
},
  defaultProps = {
    className: 'firebase-image',
    loadingIconSize: '',
    imageResize: ''
  },
  getSize = (imageResize) => {
    let size = null;
    switch (imageResize) {
      case 'sm':
        size = 150;
        break;
      case 'md':
        size = 400;
        break;
      case 'lg':
        size = 768;
        break;
      default:
        size = NaN;
    }
    return size;
  };

class FirebaseImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      src: noImageAvailable,
      alt: '',
      isImageLoading: true
    };
  }
  componentDidMount = async () => {
    const {
      alt,
      imageURL,
      src
    } = this.props;
    this.downloadImage(src || await this.getSrc(imageURL));
    this.setState({
      isLoading: false,
      alt: alt
    });
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    const shallowCompared = shallowCompare(this, nextProps, nextState, false);
    // console.log(`FirebaseImage.shouldComponentUpdate: ${shallowCompared}`);
    return shallowCompared;
  }
  componentDidUpdate = async prevProps => {
    const {
      isLoading,
      isImageLoading,
      alt,
      imageURL,
      src
    } = this.props,
      newState = {};
    if (isImageLoading === prevProps.isImageLoading &&
      imageURL === prevProps.imageURL &&
      src === prevProps.src &&
      alt === prevProps.alt &&
      (isLoading || isImageLoading)) {
      newState.isLoading = false;
      newState.isImageLoading = false;
    } else {
      if (isImageLoading !== prevProps.isImageLoading) {
        newState.isImageLoading = isImageLoading;
      }
      if (imageURL !== prevProps.imageURL) {
        const newSrc = await this.getSrc(imageURL);
        if (imageURL === '' || newSrc !== noImageAvailable) {
          this.downloadImage(newSrc);
          newState.isImageLoading = true;
        }
      }
      if (src !== prevProps.src) {
        this.downloadImage(src);
        newState.isImageLoading = true;
      }
      if (alt !== prevProps.alt) {
        newState.alt = alt;
      }
    }
    if (!isEmptyObject(newState)) {
      console.log(`newState: ${JSON.stringify(newState)}`);
      this.setState(newState);
    }
  }
  getSrc = async imageURL => {
    const {
      imageResize
    } = this.props;
    let newImgName = imageURL;
    const fileName = imageURL.split("/").pop();
    const ext = fileName.split('.').pop();
    const imgName = fileName.replace(`.${ext}`, "");
    let bucketDir = dirname(newImgName);
    let src = noImageAvailable;
    if (newImgName) {
      if (newImgName.startsWith('/images/')) {
        try {
          if (imageResize !== '') {
            const size = getSize(imageResize);
            if (!isNaN(size)) {
              newImgName = `${bucketDir}/${imgName}@s_${size}.${ext}`;
            }
          }
          src = await this.props.firebase.getStorageFileDownloadURL(newImgName); //Error is hitting here
        } catch (error) {
          console.error(`Firebase Image Get Src Error for '${newImgName}': ${error.message} (${error.code})`);
          if (error.code === 'storage/object-not-found') {
            src = await this.props.firebase.getStorageFileDownloadURL(imageURL);
          }
        }
      } else {
        src = newImgName;
      }
    }
    return src;
  }
  downloadImage = async (src) => {
    if (src) {
      const srcResponse = await axios.get(src, {
        responseType: 'blob'
      }),
        {
          data: srcAsBlob
        } = srcResponse;
      handleLoadBlob(srcAsBlob, this.handleDownloadImageLoadComplete);
    }
  }
  handleDownloadImageLoadComplete = downloadedImage => {
    this.setState({
      isLoading: false,
      src: downloadedImage
    });
  }
  handleLoad = async e => {
    e.preventDefault();
    this.setState({
      isImageLoading: false
    });
  }
  handleError = async e => {
    e.preventDefault();
    console.log(`Firebase Image Error: '${this.state.src}' was not found.`);
    this.setState({
      src: noImageAvailable,
      isLoading: false,
      isImageLoading: false
    });
  }
  render = () => {
    const {
      className,
      loadingIconSize
    } = this.props,
    {
      isLoading,
      isImageLoading,
      alt,
      src
    } = this.state,
      isAnythingLoading = isLoading || isImageLoading,
      imgClassNames = `${className}${isAnythingLoading
        ? ' d-none'
        : ''}`;
    return (
      <b className={`firebase-image-container${isAnythingLoading
        ? ` is-loading${loadingIconSize
          ? ` ${loadingIconSize}`
          : ''}`
        : ''}`}>
        {
          isAnythingLoading
            ? <LoadingIcon size={loadingIconSize} />
            : null
        }
        <img
          className={imgClassNames}
          alt={alt}
          src={src}
          title={alt}
          onLoad={this.handleLoad}
          onError={this.handleError} />
      </b>
    );
  }
}

FirebaseImage.propTypes = propTypes;
FirebaseImage.defaultProps = defaultProps;

export default withFirebase(FirebaseImage);
