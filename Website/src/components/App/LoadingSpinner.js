import React from 'react';
import PropTypes from 'prop-types';
import {
  usePastDelay
} from 'react-lazy-no-flicker';

const LoadingSpinner = props => {
  const {
    caller,
    outerClassName,
    innerClassName,
    iconClassName,
    delayMs
  } = props;
  const {
    REACT_APP_FLICKER_DELAY
  } = process.env;
  const DEFAULT_FLICKER_DELAY = 800;
  const hasPastDelay = usePastDelay(Number(delayMs || REACT_APP_FLICKER_DELAY || DEFAULT_FLICKER_DELAY));
  return (
    <>
      {
        !hasPastDelay
          ? null
          : <>
            {console.log(`LoadingSpinner.caller: ${caller}`)}
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
  caller: PropTypes.string.isRequired,
  outerClassName: PropTypes.string,
  innerClassName: PropTypes.string,
  iconClassName: PropTypes.string,
  delayMs: PropTypes.number
};
LoadingSpinner.defaultProps = {
  outerClassName: 'my-5 p-5',
  innerClassName: 'my-5 p-5',
  iconClassName: 'fas tkot-logo fa-spin',
  delayMs: 0
};

export default LoadingSpinner;
