import React from 'react';
import {
  Container
} from 'reactstrap';
import PropTypes from 'prop-types';

const HomeHeader = props => {
  const {
    pageHeaderImage,
    pageHeaderTitle,
    pageHeaderCaption
  } = props;
  return (
    <div className="page-header clear-filter" id="header">
      <div className="page-header-image" style={{
        backgroundImage: `url(${pageHeaderImage})`
      }} />
      <Container>
        <div id="header-container">
          <div className="h1 text-dark py-3 mb-0 font-weight-bolder">{pageHeaderTitle}</div>
          <div className="h5 py-3 text-secondary">{pageHeaderCaption}</div>
        </div>
      </Container>
    </div>
  );
};

HomeHeader.propTypes = {
  pageHeaderImage: PropTypes.string.isRequired,
  pageHeaderTitle: PropTypes.string,
  pageHeaderCaption: PropTypes.string
};
HomeHeader.defaultProps = {
  pageHeaderTitle: 'Me mahi tahi tātou',
  pageHeaderCaption: 'Working together to strengthen Māori whānau, hāpu and Iwi in Te Tai Tokerau.'
};

export default HomeHeader;
