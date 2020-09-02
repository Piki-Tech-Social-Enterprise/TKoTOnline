import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalBody
} from 'reactstrap';
import LoadingIcon from '../App/LoadingIcon';
import SendUsAnEmail from '../App/SendUsAnEmail';

const LoadingOverlayModal = props => {
  const {
    color,
    text
  } = props;
  const {
    REACT_APP_PWA_EMAIL,
    REACT_APP_PWA_NAME
  } = process.env;
  return (
    <Modal isOpen backdrop={false} size="xl" modalClassName="loading bg-panel" contentClassName="bg-transparent" fade={false}>
      <ModalBody className={`text-center ${color}`}>
        <LoadingIcon />
        <h1>{text}</h1>
        <p>
          If this message is still displayed after a long time waiting? Send us an email so we know.{' '}
          <SendUsAnEmail email={REACT_APP_PWA_EMAIL} subject={`${REACT_APP_PWA_NAME} PWA`} />
        </p>
      </ModalBody>
    </Modal>
  );
};

LoadingOverlayModal.propTypes = {
  color: PropTypes.string,
  text: PropTypes.string
};
LoadingOverlayModal.defaultProps = {
  color: 'text-warning',
  text: 'Loading...'
};

export default LoadingOverlayModal;
