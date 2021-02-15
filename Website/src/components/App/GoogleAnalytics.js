import React, {
  useState,
  useEffect
} from 'react';
import {
  withRouter
} from 'react-router-dom';
import ReactGA from 'react-ga';
// import {
//   isBoolean,
//   isNumber
// } from 'components/App/Utilities';

const GoogleAnalytics = props => {
  const [state, setState] = useState({
    isLoading: true
  });
  const {
    isLoading
  } = state;
  useEffect(() => {
    const retrieveData = async () => {
      const {
        history
      } = props;
      if (isLoading) {
        const {
          REACT_APP_GOOGLE_TRACKING_CODE: googleTrackingCode,
          REACT_APP_GOOGLE_TRACKING_DEBUG: googleTrackingDebug,
          REACT_APP_GOOGLE_TRACKING_ADDRESS: googleTrackingAddress,
          REACT_APP_GOOGLE_TRACKING_SITE_SPEED_SAMPLE_RATE: googleTrackingSiteSpeedSampleRate
        } = process.env;
        // console.info(JSON.stringify({
        //   googleTrackingCode,
        //   googleTrackingDebug,
        //   googleTrackingSiteSpeedSampleRate
        // }));
        const {
          isBoolean,
          isNumber
        } = await import(/* webpackPrefetch: true */'components/App/Utilities');
        ReactGA.initialize(googleTrackingCode, {
          debug: isBoolean(googleTrackingDebug, true),
          gaAddress: googleTrackingAddress,
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
    };
    let listener = null;
    if (isLoading) {
      retrieveData();
    }
    return () => {
      if (!isLoading && typeof listener === 'function') {
        listener();
        listener = null;
      }
    };
  }, [props, isLoading]);
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
