import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = props => {
  const {
    outerClassName,
    innerClassName,
    iconClassName
  } = props;
  return (
    <div className={outerClassName}>
      <h1 className={innerClassName}>
        <i className={iconClassName} />
      </h1>
    </div>
  )
};

LoadingSpinner.propTypes = {
  outerClassName: PropTypes.string,
  innerClassName: PropTypes.string,
  iconClassName: PropTypes.string
};
LoadingSpinner.defaultProps = {
  outerClassName: 'my-5 p-5',
  innerClassName: 'my-5 p-5',
  iconClassName: 'now-ui-icons tkot-logo spin'
};

export default LoadingSpinner;
