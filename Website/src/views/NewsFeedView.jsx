import React, {
  useEffect,
  useState
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import LoadingSpinner from 'components/App/LoadingSpinner';

const NewsFeedView = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbNewsFeed: null
  });
  useEffect(() => {
    const retrieveNewsFeedValue = async () => {
      const {
        firebase,
        match
      } = props;
      const {
        fid
      } = match.params;
      const dbNewsFeed = await firebase.getDbNewsFeedValue(fid);
      setState(s => ({
        ...s,
        isLoading: false,
        dbNewsFeed: dbNewsFeed
      }));
    };
    if (state.isLoading) {
      retrieveNewsFeedValue();
    }
  }, [props, state]);
  return (
    <>
      {
        state.isLoading
          ? <LoadingSpinner outerClassName="ignore" innerClassName="ignore" />
          : <>
          </>
      }
    </>
  );
};

export default withFirebase(NewsFeedView);
