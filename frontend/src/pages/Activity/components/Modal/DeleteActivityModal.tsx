// ** components ** //
import AlertModal from 'components/Modal/AlertModal';

interface Props {
  isOpen: boolean;
  deleteActivity: () => void;
  closeModal: () => void;
  isLoading: boolean;
}

const DeleteActivityModal = ({
  isOpen,
  isLoading,
  closeModal,
  deleteActivity,
}: Props) => {
  return isOpen ? (
    <AlertModal
      title="Delete Deal"
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={deleteActivity}
      submitLoading={isLoading}
      width="800px"
      submitButtonText="Delete"
      submitButtonClass="delete__Btn"
    >
      <p className="confirmation__title">
        The Activity and related things will be deleted.?
      </p>
    </AlertModal>
  ) : (
    <></>
  );
};

export default DeleteActivityModal;
