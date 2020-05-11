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
    color
  } = props;
  return (
    <Modal isOpen backdrop={false} size="xl" modalClassName="loading bg-panel" contentClassName="bg-transparent" fade={false}>
      <ModalBody className={`text-center ${color}`}>
        <LoadingIcon />
        <h1>Loading...</h1>
        <p>
          Has this page not loaded after a long time waiting? Send us an email so we know.{' '}
          <SendUsAnEmail email={process.env.REACT_APP_PWA_EMAIL} subject={`${process.env.REACT_APP_PWA_NAME} PWA`} />
        </p>
      </ModalBody>
    </Modal>
  );
};

LoadingOverlayModal.propTypes = {
  color: PropTypes.string
};
LoadingOverlayModal.defaultProps = {
  color: 'text-warning'
};

export default LoadingOverlayModal;
