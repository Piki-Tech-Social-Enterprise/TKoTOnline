import React from 'react';
import {
  Container
} from 'reactstrap';
import PropTypes from 'prop-types';

const AuthFooter = props => {
    const {
      isDefault,
      isFluid
    } = props;
    return (
      <footer className={`footer${((isDefault && ' footer-default') || '')}`}>
        <Container fluid={isFluid}>
          <div className="copyright">
            TODO: TKoT PWA Name v1.X &copy; {1900 + new Date().getYear()}
          </div>
        </Container>
      </footer>
    );
};

AuthFooter.propTypes = {
  isDefault: PropTypes.bool,
  isFluid: PropTypes.bool
};

export default AuthFooter;
