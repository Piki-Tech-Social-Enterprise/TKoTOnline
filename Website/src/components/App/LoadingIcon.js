import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  size: PropTypes.oneOf([
    '',
    'sm',
    'lg'
  ])
},
  defaultProps = {
    size: ''
  };

class LoadingIcon extends Component {
  render = () => {
    const {
      size
    } = this.props;
    let iconSize = null;
    switch (size) {
      case 'sm':
        iconSize = '';
        break;
      case 'lg':
        // iconSize = ' fa-5x';
        iconSize = ' h1';
        break;
      default:
        // iconSize = ' fa-3x';
        iconSize = ' h3';
    }
    return (
      // <span className={`fa fa-spin fa-spinner${iconSize}`} {...this.props} />
      <span className={iconSize}>
        <i className="now-ui-icons loader_refresh spin" />
      </span>
    );
  }
}

LoadingIcon.propTypes = propTypes;
LoadingIcon.defaultProps = defaultProps;

export default LoadingIcon;