import React, {
  useState,
  useEffect
} from 'react';
import {
  withRouter
} from 'react-router-dom';
import ReactGA from 'react-ga';

const GoogleAnalytics = props => {
  const [state, setState] = useState({
    isLoading: true
  })
  useEffect(() => {
    const {
      pathname
    } = props.location;
    if (state.isLoading) {
      const {
        REACT_APP_GOOGLE_TRACKING_CODE: googleTrackingCode,
        REACT_APP_GOOGLE_TRACKING_DEBUG: googleTrackingDebug
      } = process.env;
      ReactGA.initialize(googleTrackingCode, {
        debug: googleTrackingDebug
      });
      setState(s => ({
        ...s,
        isLoading: false
      }));
    }
    ReactGA.set({
      page: pathname
    });
    ReactGA.pageview(pathname);
    return () => {};
  }, [props, state]);
  return (<></>);
};

export default withRouter(GoogleAnalytics);
