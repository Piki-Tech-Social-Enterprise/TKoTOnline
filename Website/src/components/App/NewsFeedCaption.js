import React from 'react';
import moment from 'moment-mini';
import {
  DATE_MOMENT_FORMAT,
  NEWSFEED_DATE_MOMENT_FORMAT,
  TAG_SEPARATOR
} from 'components/App/Utilities';

const NewsFeedCaption = props => {
  const {
    newsFeed,
    categoryLinkClassName
  } = props;
  const {
    date,
    category
  } = newsFeed;
  const formattedDate = moment(date, DATE_MOMENT_FORMAT).format(NEWSFEED_DATE_MOMENT_FORMAT);
  const categoryTags = category.split(TAG_SEPARATOR);
  let i = 0;
  return (
    <>
      {formattedDate} | {
        categoryTags.map((categoryTag, key) =>
          <span key={key}>{i++ > 0 ? TAG_SEPARATOR : ''}<a href={`/NewsFeeds?c=${categoryTag}`} className={`text-decoration-none ${categoryLinkClassName || 'text-light'}`}>{categoryTag}</a></span>
        )
      }
    </>
  );
};

export default NewsFeedCaption;
