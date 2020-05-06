import React, {
    Component
  } from 'react';
  import {
    Modal,
    ModalBody
  } from 'reactstrap';
  import LoadingIcon from '../App/LoadingIcon';
  import SendUsAnEmail from './SendUsAnEmail';
  
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
                  email={process.env.REACT_APP_WEB_EMAIL}
                  subject={`${process.env.REACT_APP_WEB_NAME} WEB`}
                />
              </p>
            </ModalBody>
          </Modal>
        </>
      );
    }
  }
  
  export default LoadingOverlayModal;
  