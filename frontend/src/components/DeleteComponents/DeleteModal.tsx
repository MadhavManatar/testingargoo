import AlertModal from 'components/Modal/AlertModal';

interface Props {
  isOpen: boolean;
  deleteOnSubmit: (data?: any) => void;
  closeModal: () => void;
  isLoading: boolean;
  moduleName?: string;
  customMessage?: string;
}

const DeleteModal = ({
  isOpen,
  isLoading,
  closeModal,
  deleteOnSubmit,
  moduleName,
  customMessage,
}: Props) => {
  return isOpen ? (
    <AlertModal
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={deleteOnSubmit}
      submitLoading={isLoading}
      width="800px"
      submitButtonText="Delete"
      submitButtonClass="delete__Btn"
    >
      <h5 className="confirmation__title">
        {customMessage ||
          `Are you sure you want to remove ${moduleName?.toLowerCase()}?`}
      </h5>
    </AlertModal>
  ) : (
    <></>
  );
};

export default DeleteModal;
