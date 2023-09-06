// ** Import Packages **
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// ** Components **
import Modal from 'components/Modal';
import AddEditContact from './AddEditContact';

// ** Helper **
import { createModalNameByUrl } from 'helper/quickLookModalByUrl.helper';

interface Props {
  id?: number;
  isOpen: boolean;
  onAdd?: (data?: any) => void;
  closeModal: () => void;
  isQuickModal?: boolean;
}

const AddContactModal = (props: Props) => {
  const { closeModal, isOpen, onAdd, id, isQuickModal } = props;
  const [modalName, setModalName] = useState('');
  const { pathname } = useLocation();
  useEffect(() => {
    const name = createModalNameByUrl(pathname);
    setModalName(name);
  }, []);

  const close = () => {
    closeModal();
  };

  return isOpen ? (
    <Modal
      title={id ? 'Update Contact' : 'Create Contact'}
      visible={isOpen}
      onClose={() => close()}
      width="800px"
      modalWrapperClass="add__update__modal"
    >
      <AddEditContact
        modalName={modalName}
        closeModal={closeModal}
        contactId={id}
        onAdd={onAdd}
        isQuickModal={isQuickModal}
      />
    </Modal>
  ) : (
    <></>
  );
};

export default AddContactModal;
