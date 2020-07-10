import React from 'react';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';
import {
  withFirebase
} from 'components/Firebase';
import NewsFeedSection from 'components/Sections/NewsFeed';

const NewsFeedsView = props => {
  return (
    <>
      <HomeNavbar />
      <NewsFeedSection containerClassName="mt-5" />
      <HomeFooter />
    </>
  );
};

export default withFirebase(NewsFeedsView);
