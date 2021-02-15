import React, {
  useState,
  useEffect
} from 'react';
// import moment from 'moment-mini';
// import {
//   DATE_MOMENT_FORMAT,
//   NEWSFEED_DATE_MOMENT_FORMAT,
//   TAG_SEPARATOR
// } from 'components/App/Utilities';

const INITIAL_STATE = {
  isLoading: true,
  formattedDate: '',
  categoryTags: [],
  TAG_SEPARATOR: ''
};
const NewsFeedCaption = props => {
  const {
    categoryLinkClassName
  } = props;
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading,
    formattedDate,
    categoryTags,
    TAG_SEPARATOR
  } = state;
  useEffect(() => {
    const retrieveData = async () => {
      const {
        newsFeed
      } = props;
      const {
        date,
        category
      } = newsFeed;
      const moment = await import(/* webpackPrefetch: true */'moment-mini').then(x => x.default);
      const {
        DATE_MOMENT_FORMAT,
        NEWSFEED_DATE_MOMENT_FORMAT,
        TAG_SEPARATOR
      } = await import(/* webpackPrefetch: true */'components/App/Utilities');
      const formattedDate = moment(date, DATE_MOMENT_FORMAT).format(NEWSFEED_DATE_MOMENT_FORMAT);
      const categoryTags = category.split(TAG_SEPARATOR);
      setState(s => ({
        ...s,
        isLoading: false,
        formattedDate,
        categoryTags,
        TAG_SEPARATOR
      }));
    };
    if (isLoading) {
      retrieveData();
    }
    return () => { }
  }, [props, isLoading]);
  let i = 0;
  return (
    <>
      {formattedDate} | {
        categoryTags.map((categoryTag, key) =>
          <span key={key}>{i++ > 0 ? TAG_SEPARATOR : ''}<a href={`/NewsFeeds?c=${encodeURIComponent(categoryTag)}`} className={`text-decoration-none ${categoryLinkClassName || 'text-light'}`}>{categoryTag}</a></span>
        )
      }
    </>
  );
};

export default NewsFeedCaption;
