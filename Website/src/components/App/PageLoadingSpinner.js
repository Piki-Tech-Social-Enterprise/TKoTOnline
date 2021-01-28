import React from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from 'components/App/LoadingSpinner';

const PageLoadingSpinner = props => {
  const {
    caller,
    outerClassName,
    innerClassName,
    iconClassName,
    delayMs
  } = props;
  return (
    <>
      <LoadingSpinner
        caller={caller}
        outerClassName={outerClassName}
        innerClassName={innerClassName}
        iconClassName={iconClassName}
        delayMs={delayMs}
      />
    </>
  )
};

PageLoadingSpinner.propTypes = {
  caller: PropTypes.string.isRequired,
  outerClassName: PropTypes.string,
  innerClassName: PropTypes.string,
  iconClassName: PropTypes.string,
  delayMs: PropTypes.number
};
PageLoadingSpinner.defaultProps = {
  outerClassName: 'p-5 tkot-secondary-color-black-bg-color-20-pc vh-100',
  innerClassName: 'm-5 p-5 text-center',
  iconClassName: 'fas tkot-logo fa-spin',
  delayMs: 0
};

export default PageLoadingSpinner;
