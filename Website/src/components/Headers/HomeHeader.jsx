/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";
// core components

function IndexHeader() {

  return (
    <>
      <div className="page-header clear-filter" id="header">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("assets/img/tkot/Te-Takarangi-hero-2.jpg") + ")"
          }}
        ></div>
        <Container>
          <div className="float-left" id="header-container">
            
            <h1 className="h1-seo">Te Kahu o Taonui</h1>
            <h3 className="h3-seo">Nau mai, haere mai</h3>
          </div>
          {/* <h6 className="category category-absolute">
            Designed by{" "}
            <a href="http://invisionapp.com/?ref=creativetim" target="_blank">
              <img
                alt="..."
                className="invision-logo"
                src={require("assets/img/invision-white-slim.png")}
              ></img>
            </a>
            . Coded by{" "}
            <a
              href="https://www.creative-tim.com?ref=nukr-index-header"
              target="_blank"
            >
              <img
                alt="..."
                className="creative-tim-logo"
                src={require("assets/img/creative-tim-white-slim2.png")}
              ></img>
            </a>
            .
          </h6> */}
        </Container>
      </div>
    </>
  );
}

export default IndexHeader;
