import React, {
  useState,
  useEffect
} from 'react';
import {
  withRouter
} from 'react-router-dom';
import ReactGA from 'react-ga';
import {
  isBoolean,
  isNumber
} from 'components/App/Utilities';

const GoogleAnalytics = props => {
  const [state, setState] = useState({
    isLoading: true
  });
  useEffect(() => {
    let listener = null;
    const {
      history
    } = props;
    if (state.isLoading) {
      const {
        REACT_APP_GOOGLE_TRACKING_CODE: googleTrackingCode,
        REACT_APP_GOOGLE_TRACKING_DEBUG: googleTrackingDebug,
        REACT_APP_GOOGLE_TRACKING_SITE_SPEED_SAMPLE_RATE: googleTrackingSiteSpeedSampleRate
      } = process.env;
      // console.info(JSON.stringify({
      //   googleTrackingCode,
      //   googleTrackingDebug,
      //   googleTrackingSiteSpeedSampleRate
      // }));
      ReactGA.initialize(googleTrackingCode, {
        debug: isBoolean(googleTrackingDebug, true),
        gaOptions: {
          siteSpeedSampleRate: isNumber(googleTrackingSiteSpeedSampleRate)
            ? Number(googleTrackingSiteSpeedSampleRate)
            : 100
        }
      });
      listener = history.listen(location => {
        const {
          pathname,
          hash
        } = location;
        ReactGA.set({
          page: pathname
        });
        ReactGA.pageview(pathname + hash);
        console.log('ReactGA.pageview + hash: ', pathname + hash);
      });
      setState(s => ({
        ...s,
        isLoading: false
      }));
    };
    return () => {
      if (!state.isLoading && typeof listener === 'function') {
        listener();
        listener = null;
      }
    };
  }, [props, state]);
  return (<></>);
};
const sendEvent = (category, action, label = null, value = null) => {
  const args = {
    category,
    action,
    label,
    value
  };
  ReactGA.event(args);
  console.log('ReactGA.event: ', JSON.stringify(args, null, 2));
};

export default withRouter(GoogleAnalytics);
export {
  sendEvent
};
