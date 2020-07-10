import React from 'react';
import {
  Container
} from 'reactstrap';

const HomeHeader = () => {
  return (
    <div className="page-header clear-filter" id="header">
      <div className="page-header-image" style={{
        backgroundImage: `url(${require('assets/img/tkot/tkot-home-header-background-image.png')})`
      }} />
      <Container>
        <div id="header-container">
          <div className="h1 text-dark mb-0 font-weight-bolder">Me mahi tahi tātou</div>
          <div className="text-secondary">Working together to strengthen Māori whānau, hāpu and Iwi in Te Tai Tokerau.</div>
        </div>
      </Container>
    </div>
  );
};

export default HomeHeader;
