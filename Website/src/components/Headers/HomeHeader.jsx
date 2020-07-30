import React from 'react';
import {
  Container
} from 'reactstrap';
import PropTypes from 'prop-types';
import Routes from 'components/Routes/routes';

const HomeHeader = props => {
  const {
    pageHeaderImage,
    pageHeaderTitle,
    pageHeaderCaption,
    showClickScrollDownForMoreLink
  } = props;
  return (
    <div className="page-header clear-filter" filter-color="black" id="About">
      <div className="page-header-image" style={{
        backgroundImage: `url(${pageHeaderImage})`
      }} />
      <Container className="py-5 text-center">
        <div id="header-container">
          <div className="h1 py-3 mb-0 font-weight-bold">{pageHeaderTitle}</div>
          <div className="h5 py-0">{
            typeof pageHeaderCaption === 'function'
              ? pageHeaderCaption()
              : pageHeaderCaption
          }</div>
        </div>
        {
          showClickScrollDownForMoreLink
            ? <a href={Routes.iwiMembers} className="text-decoration-none">
              <p className="my-5 py-3 text-dark"><i className="fas fa-angle-double-down" /> Click/Scroll down for more <i className="fas fa-angle-double-down" /></p>
            </a>
            : null
        }
      </Container>
    </div>
  );
};

HomeHeader.propTypes = {
  pageHeaderImage: PropTypes.string.isRequired,
  pageHeaderTitle: PropTypes.string
};
HomeHeader.defaultProps = {
  pageHeaderTitle: 'Me mahi tahi tātou',
  pageHeaderCaption: 'Working together to strengthen Māori whānau, hāpu and Iwi in Te Tai Tokerau.'
};

export default HomeHeader;
