import React, {
  useEffect,
  useState
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import LoadingSpinner from 'components/App/LoadingSpinner';
// import useScript from 'components/App/useScript';

const ProjectView = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbProject: null
  });
  // useScript({
  //   url: 'https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v7.0',
  //   async: true,
  //   defer: true,
  //   crossorigin: 'anonymous'
  // });
  useEffect(() => {
    const retrieveProjectValue = async () => {
      const {
        firebase,
        match
      } = props;
      const {
        fid
      } = match.params;
      const dbProject = await firebase.getDbProjectValue(fid);
      setState(s => ({
        ...s,
        isLoading: false,
        dbProject: dbProject
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
      retrieveProjectValue();
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
          ? <LoadingSpinner outerClassName="ignore" innerClassName="ignore" />
          : <div
            className="fb-page"
            data-href={state.dbProject.url}
            data-tabs="timeline, events, messages"
            data-width="auto"
            data-height=""
            data-small-header="true"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="true"
          >
            <blockquote
              cite={state.dbProject.url}
              className="fb-xfbml-parse-ignore">
              <a
                href={state.dbProject.url}
              >
                {state.dbProject.name}
              </a>
            </blockquote>
          </div>
      }
    </>
  );
};

export default withFirebase(ProjectView);
