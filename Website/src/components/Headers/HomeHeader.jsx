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
          <h1 className="h1-seo1 text-left">Te Kahu o Taonui</h1>
          <h3 className="h3-seo1 text-secondary text-left">Nau mai, haere mai</h3>
        </div>
      </Container>
    </div>
  );
};

export default HomeHeader;
