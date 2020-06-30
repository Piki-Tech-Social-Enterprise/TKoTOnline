import React from 'react';
import {
  Container
} from 'reactstrap';

const HomeHeader = () => {
  return (
    <div className="page-header clear-filter" id="header">
      <div className="page-header-image" style={{
        backgroundImage: `url(${require('assets/img/tkot/Te-Takarangi-hero-2.jpg')})`
      }} />
      <Container>
        <div id="header-container">
          <h1 className="text-uppercase text-left">Te Kahu o Taonui</h1>
          <div className="h3 tkot-secondary-color-grey-color text-left font-italic">Me mahi tahi tātou</div>
        </div>
      </Container>
    </div>
  );
};

export default HomeHeader;
