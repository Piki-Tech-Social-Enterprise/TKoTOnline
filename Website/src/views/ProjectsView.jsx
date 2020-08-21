import React, {
  useEffect,
  useState,
  lazy
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import {
  defaultPageSetup
} from 'components/App/Utilities';

const LoadingSpinner = lazy(() => import('components/App/LoadingSpinner'));
const HomeNavbar = lazy(() => import('components/Navbars/HomeNavbar'));
const HomeFooter = lazy(() => import('components/Footers/HomeFooter'));
const ProjectsSection = lazy(() => import('components/Sections/Projects'));
const ProjectsView = () => {
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
            <ProjectsSection containerClassName="mt-5" />
            <HomeFooter />
          </>
      }
    </>
  );
};

export default withFirebase(ProjectsView);
