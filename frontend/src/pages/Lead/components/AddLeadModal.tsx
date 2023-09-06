// ** import packages **

// ** components **
import Modal from 'components/Modal';
import AddEditLead from './AddEditLead';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createModalNameByUrl } from 'helper/quickLookModalByUrl.helper';

interface Props {
  id?: number;
  isOpen: boolean;
  closeModal: () => void;
  onAdd?: (data?: any) => void;
  isQuickModal?: boolean;
}

const AddLeadModal = (props: Props) => {
  const { closeModal, isOpen, id, onAdd, isQuickModal } = props;
  // ** Redirect **
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
      title={id ? 'Update Lead' : 'Create Lead'}
      visible={isOpen}
      onClose={() => close()}
      showFooter={false}
      width="800px"
      modalWrapperClass="add__update__modal"
    >
      <AddEditLead
        modalName={modalName}
        leadId={id}
        onAdd={onAdd}
        closeModal={closeModal}
        isQuickModal={isQuickModal}
      />
    </Modal>
  ) : (
    <></>
  );
};

export default AddLeadModal;
