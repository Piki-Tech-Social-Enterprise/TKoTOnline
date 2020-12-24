import React, {
  Component
} from 'react';
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import FirebaseImage from '../../App/FirebaseImage';
import shallowCompare from '../../App/Utilities';
import PropTypes from 'prop-types';

const propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  downloadURLInputProps: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool
  }),
  downloadURLInputGroupAddonProps: PropTypes.shape({
    disabled: PropTypes.bool,
    onClick: PropTypes.func
  }),
  downloadURLFileInputOnChange: PropTypes.func.isRequired,
  downloadURLFormat: PropTypes.string.isRequired,
  downloadURLFormatKeyName: PropTypes.string.isRequired,
  downloadURLFormatKeyValue: PropTypes.string.isRequired,
  downloadURLFormatFileName: PropTypes.string.isRequired,
  downloadURLResize: PropTypes.string,
  downloadURLFileInputAcceptProp: PropTypes.string,
  showImagePreview: PropTypes.bool
},
  defaultProps = {
    downloadURLInputGroupAddonProps: {
      disabled: false
    },
    downloadURLFileInputAcceptProp: 'image/*',
    showImagePreview: true
  };

class FirebaseInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      downloadURL: '',
      downloadURLSrc: '',
      downloadURLAlt: ''
    };
    this.downloadURLFileInputRef = React.createRef();
  }
  componentDidMount = () => {
    const {
      value: downloadURL
    } = this.props;
    this.setState({
      isLoading: false,
      downloadURL: downloadURL
    });
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    const shallowCompared = shallowCompare(this, nextProps, nextState, false);
    // console.log(`FirebaseInput.shouldComponentUpdate: ${shallowCompared}`);
    return shallowCompared;
  }
  componentDidUpdate = async (prevProps, prevState) => {
    const {
      value
    } = this.props,
      {
        isLoading,
        downloadURL
      } = this.state;
    if (value !== prevProps.value) {
      this.setState({
        isLoading: false,
        downloadURL: value
      });
    }
    if (downloadURL !== prevState.downloadURL) {
      this.setState({
        isLoading: false,
        downloadURL: downloadURL
      });
    }
    if (value === prevProps.value &&
      isLoading) {
      this.setState({
        isLoading: false
      });
    }
  }
  handleDownloadURLChange = e => {
    const {
      value: downloadURL
    } = e.target;
    this.setState({
      isLoading: false,
      downloadURL: downloadURL
    });
    this.props.onChange(e);
  }
  handleDownloadURLFileClick = async e => {
    e.preventDefault();
    this.downloadURLFileInputRef.current.click();
  }
  handleDownloadURLFileChange = e => {
    e.preventDefault();
    const file = e.target.files[0],
      downloadURL = this.props.downloadURLFormat
        .replace(this.props.downloadURLFormatKeyName, this.props.downloadURLFormatKeyValue)
        .replace(this.props.downloadURLFormatFileName, file.name),
      fileReader = new FileReader();
    fileReader.onloadend = e => {
      this.setState({
        downloadURLSrc: e.target.result,
        downloadURLAlt: file.name
      });
    };
    fileReader.readAsDataURL(file);
    this.setState({
      downloadURL: downloadURL
    });
    if (typeof this.props.downloadURLFileInputOnChange === 'function') {
      this.props.downloadURLFileInputOnChange(e);
    }
    this.props.onChange({
      preventDefault: e.preventDefault,
      target: {
        name: this.props.downloadURLInputProps.name,
        value: downloadURL
      }
    });
  }
  render = () => {
    return (
      <>
        {
          this.state.isLoading
            ? null
            : <>
              <InputGroup>
                <Input
                  value={this.state.downloadURL}
                  onChange={this.handleDownloadURLChange}
                  {...this.props.downloadURLInputProps} />
                <InputGroupAddon
                  className="clickable"
                  addonType="append"
                  onClick={this.props.downloadURLInputGroupAddonProps.onClick || this.handleDownloadURLFileClick}
                  {...this.props.downloadURLInputGroupAddonProps}>
                  <InputGroupText>
                    <i
                      className={this.props.downloadURLInputGroupAddonIconClassName || 'nc-icon nc-cloud-upload-94'}></i>
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <Input
                innerRef={this.downloadURLFileInputRef}
                type="file"
                onChange={this.handleDownloadURLFileChange}
                className="d-none"
                accept={this.props.downloadURLFileInputAcceptProp} />
              {
                this.props.showImagePreview
                  ? <>
                    <FirebaseImage
                      imageResize={this.props.downloadURLResize}
                      imageURL={this.state.downloadURL}
                      src={this.state.downloadURLSrc}
                      alt={this.state.downloadURLAlt} />
                  </>
                  : null
              }
            </>
        }
      </>
    );
  }
}

FirebaseInput.propTypes = propTypes;
FirebaseInput.defaultProps = defaultProps;

export default FirebaseInput;
