import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  email: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string
};
const defaultProps = {
  title: 'Click here to send us an email'
};
const SendUsAnEmail = props => {
  const {
    email,
    subject,
    title,
    className
  } = props;
  return (
    <a href={`mailto:${email}?subject=${subject}`} title={`${title}`} className={`${className || ''}`}>
      <span
        dangerouslySetInnerHTML={{
          __html: `${email
            .replace('@', '&#64;')
            .replace('.', '&#46;')}`
        }}
      />
    </a>
  );
};

SendUsAnEmail.propTypes = propTypes;
SendUsAnEmail.defaultProps = defaultProps;

export default SendUsAnEmail;
