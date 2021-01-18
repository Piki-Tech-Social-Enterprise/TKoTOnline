import React from 'react';
import PropTypes from 'prop-types';
import {
  usePastDelay
} from 'react-lazy-no-flicker';

const LoadingSpinner = props => {
  const hasPastDelay = usePastDelay(800);
  const {
    outerClassName,
    innerClassName,
    iconClassName
  } = props;
  return (
    <>
      {
        !hasPastDelay
          ? null
          : <>
            <div className={outerClassName}>
              <h1 className={innerClassName}>
                <i className={iconClassName} />
              </h1>
            </div>
          </>
      }
    </>
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
  iconClassName: 'fas tkot-logo fa-spin'
};

export default LoadingSpinner;
