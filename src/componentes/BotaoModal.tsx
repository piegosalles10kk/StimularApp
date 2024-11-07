import React, { useState } from 'react';
import { Modal, Button } from 'native-base';
import { Botao } from './Botao';

interface Props {
  botao: string;
  bodyText: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const EditableModal: React.FC<Props> = ({
  botao,
  bodyText,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleConfirm = () => {
    onConfirm();
    handleCloseModal();
  };

  const handleCancel = () => {
    onCancel();
    handleCloseModal();
  };

  return (
    <>
      <Botao onPress={handleOpenModal}
      mb='10%'
      >{botao}</Botao>
      <Modal isOpen={modalVisible} onClose={handleCloseModal}>
        <Modal.Content>
          <Modal.Body>
            <Modal.Header alignSelf="center" fontWeight='bold'>🚨ATENÇÃO🚨</Modal.Header>
            <Modal.Body alignSelf="center" >{bodyText}</Modal.Body>
            <Botao onPress={handleConfirm} alignSelf="center" mt='1%'>
              {confirmButtonText}
            </Botao>
            <Botao onPress={handleCancel} alignSelf="center" mt='10%' mb="10%">
              {cancelButtonText}
            </Botao>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default EditableModal;