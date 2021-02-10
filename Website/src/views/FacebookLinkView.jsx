import React, {
  useEffect,
  useState
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
// import useScript from 'components/App/useScript';
import {
  lazy
} from 'react-lazy-no-flicker';

const LoadingSpinner = lazy(async () => await import(/* webpackPreload: true */'components/App/LoadingSpinner'));
const FacebookLinkView = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbFacebookLink: null
  });
  // useScript({
  //   url: 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v7.0',
  //   async: true,
  //   defer: true,
  //   crossorigin: 'anonymous'
  // });
  useEffect(() => {
    const retrieveFacebookLinkValue = async () => {
      const {
        firebase,
        match
      } = props;
      const {
        fid
      } = match.params;
      const dbFacebookLink = await firebase.facebookLinkRepository.getDbFacebookLinksValue(fid, fieldNames);
      setState(s => ({
        ...s,
        isLoading: false,
        dbFacebookLink: dbFacebookLink
      }));
    };
    const {
      body
    } = document;
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v7.0';
    script.async = true;
    script.defer = true;
    script.crossorigin = 'anonymous';
    body.appendChild(script);
    if (state.isLoading) {
      retrieveFacebookLinkValue();
    }
    return () => {
      if (state && !state.isLoading) {
        body.removeChild(script);
      }
    };
  }, [props, state]);
  return (
    <>
      <div id="fb-root"></div>
      {
        state.isLoading
          ? <LoadingSpinner caller="FacebookLinkView" />
          : <div
            className="fb-page"
            data-href={state.dbFacebookLink.url}
            data-tabs="timeline, events, messages"
            data-width="auto"
            data-height=""
            data-small-header="true"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="true"
          >
            <blockquote
              cite={state.dbFacebookLink.url}
              className="fb-xfbml-parse-ignore">
              <a
                href={state.dbFacebookLink.url}
              >
                {state.dbFacebookLink.name}
              </a>
            </blockquote>
          </div>
      }
    </>
  );
};

export default withFirebase(FacebookLinkView);
