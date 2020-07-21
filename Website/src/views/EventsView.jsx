import React, {
  useEffect,
  useState
} from 'react';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';
import {
  withFirebase
} from 'components/Firebase';
import EventsSection from 'components/Sections/Events';
import LoadingSpinner from 'components/App/LoadingSpinner';
import {
  defaultPageSetup
} from 'components/App/Utilities';

const EventsView = () => {
  const [state, setState] = useState({
    isLoading: true
  });
  useEffect(() => {
    defaultPageSetup(true);
    setState(s => ({
      ...s,
      isLoading: false
    }));
    return defaultPageSetup;
  }, [setState]);
  return (
    <>
      {
        state.isLoading
          ? <LoadingSpinner
            outerClassName="p-5 tkot-secondary-color-black-bg-color-20-pc vh-100"
            innerClassName="m-5 p-5 text-center"
          />
          : <>
            <HomeNavbar
              initalTransparent
              colorOnScrollValue={25}
            />
            <EventsSection containerClassName="mt-5" />
            <HomeFooter />
          </>
      }
    </>
  );
};

export default withFirebase(EventsView);
