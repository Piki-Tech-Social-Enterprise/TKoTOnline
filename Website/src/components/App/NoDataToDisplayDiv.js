import React from 'react';
import PropTypes from 'prop-types';

const NoDataToDisplayDiv = props => {
  const {
    name,
    isHomePage,
    color
  } = props;
  return (
    <>
      <div className={`w-100 h5 text-center text-${color}`}>No {isHomePage ? `Featured ${name}` : name} to display.</div>
    </>
  );
};

NoDataToDisplayDiv.propTypes = {
  name: PropTypes.string.isRequired,
  isHomePage: PropTypes.bool,
  color: PropTypes.oneOf([
    'dark',
    'light'
  ])
};
NoDataToDisplayDiv.defaultProps = {
  isHomePage: false,
  color: 'dark'
};

export default NoDataToDisplayDiv;
