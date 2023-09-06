// ** Import Packages **
// ** Components **
import Modal from 'components/Modal';

// ** Types **
import { AddAccountModalPropsType } from '../types/account.types';

// ** Services **

// ** Schema **

import AddEditAccount from './AddEditAccount';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createModalNameByUrl } from 'helper/quickLookModalByUrl.helper';

const AddAccountModal = (props: AddAccountModalPropsType) => {
  const { closeModal, isOpen, onAdd, id } = props;
  // ** Hooks **

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
      title={id ? 'Update Account' : 'Create Account'}
      visible={isOpen}
      onClose={() => close()}
      width="800px"
      modalWrapperClass="add__update__modal"
    >
      <AddEditAccount
        accountId={id}
        onAdd={onAdd}
        closeModal={closeModal}
        modalName={modalName}
      />
    </Modal>
  ) : (
    <></>
  );
};

export default AddAccountModal;
