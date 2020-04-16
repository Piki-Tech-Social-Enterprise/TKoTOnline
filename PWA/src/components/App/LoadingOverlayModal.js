import React, {
  Component
} from 'react';
import {
  Modal,
  ModalBody
} from 'reactstrap';
import LoadingIcon from '../App/LoadingIcon';
import SendUsAnEmail from '../App/SendUsAnEmail';

class LoadingOverlayModal extends Component {
  render = () => {
    return (
      <>
        <Modal isOpen backdrop={false} size="xl" modalClassName="loading bg-panel" contentClassName="bg-transparent" fade={false}>
          <ModalBody className="text-warning text-center">
            <LoadingIcon />
            <h1>Loading...</h1>
            <p>
              Has this page not loaded after a long time waiting? Send us an email so we know.{' '}
              <SendUsAnEmail
                email={process.env.REACT_APP_PWA_EMAIL}
                subject={`${process.env.REACT_APP_PWA_NAME} PWA`}
              />
            </p>
          </ModalBody>
        </Modal>
      </>
    );
  }
}

export default LoadingOverlayModal;
