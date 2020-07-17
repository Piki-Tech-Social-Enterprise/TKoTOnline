import React from 'react';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';
import {
  withFirebase
} from 'components/Firebase';
import ProjectsSection from 'components/Sections/Projects';

const ProjectsView = () => {
  return (
    <>
      <HomeNavbar />
      <ProjectsSection containerClassName="mt-5" />
      <HomeFooter />
    </>
  );
};

export default withFirebase(ProjectsView);
