import React from 'react';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';
import {
  withFirebase
} from 'components/Firebase';
import EventsSection from 'components/Sections/Events';

const EventsView = () => {
  return (
    <>
      <HomeNavbar />
      <EventsSection containerClassName="mt-5" />
      <HomeFooter />
    </>
  );
};

export default withFirebase(EventsView);
