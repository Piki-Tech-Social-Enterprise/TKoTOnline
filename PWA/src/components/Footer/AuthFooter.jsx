import React from 'react';
import {
  Container
} from 'reactstrap';
import PropTypes from 'prop-types';
import CopyrightInfomation from 'components/App/CopyrightInfomation';

const AuthFooter = props => {
    const {
      isDefault,
      isFluid
    } = props;
    return (
      <footer className={`footer${((isDefault && ' footer-default') || '')}`}>
        <Container fluid={isFluid}>
          <CopyrightInfomation />
        </Container>
      </footer>
    );
};

AuthFooter.propTypes = {
  isDefault: PropTypes.bool,
  isFluid: PropTypes.bool
};

export default AuthFooter;
