// ** Import Packages **

// ** Components **
import Modal from 'components/Modal';
import AddEditDeal from './AddEditDeal';
import { createModalNameByUrl } from 'helper/quickLookModalByUrl.helper';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  id?: number;
  isOpen: boolean;
  closeModal: () => void;
  onAdd?: (data?: any) => void;
  isQuickModal?: boolean;
}
const AddDealModal = (props: Props) => {
  const { closeModal, isOpen, id, onAdd, isQuickModal } = props;

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
    <>
      <Modal
        title={id ? 'Update Deal' : 'Create Deal'}
        visible={isOpen}
        onClose={() => close()}
        showFooter={false}
        width="800px"
        modalWrapperClass="add__update__modal"
      >
        <AddEditDeal
          dealId={id}
          onAdd={onAdd}
          modalName={modalName}
          closeModal={closeModal}
          isQuickModal={isQuickModal}
        />
      </Modal>
    </>
  ) : (
    <></>
  );
};

export default AddDealModal;
