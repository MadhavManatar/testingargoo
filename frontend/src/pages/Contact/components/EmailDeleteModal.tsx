// ** Modal **
import Modal from 'components/Modal';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  isLoading: boolean;
  onDelete: () => void;
}

const EmailDeleteModal = ({
  isOpen,
  isLoading,
  closeModal,
  onDelete,
}: Props) => {
  return isOpen ? (
    <Modal
      title="Delete Pipeline Stage"
      modalWrapperClass="small__without__HT__modal"
      submitButtonClass="bg-ip__Red hover:bg-ip__Red__hoverDark"
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={onDelete}
      submitLoading={isLoading}
      width="800px"
      submitButtonText="Delete"
    >
      <h5 className="confirmation__title">Are you sure you want to delete this email </h5>
    </Modal>
  ) : (
    <></>
  );
};

export default EmailDeleteModal;
