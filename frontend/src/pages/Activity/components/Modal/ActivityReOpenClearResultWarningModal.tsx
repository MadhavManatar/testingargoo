// ** Components ** //
import AlertModal from 'components/Modal/AlertModal';

interface Props {
  isOpen: boolean;
  proceed: () => void;
  closeModal: () => void;
}

const ActivityReOpenClearResultWarningModal = ({
  isOpen,
  closeModal,
  proceed,
}: Props) => {
  return isOpen ? (
    <AlertModal
      title="Discard"
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={proceed}
      width="800px"
      submitButtonText="Proceed"
      submitButtonClass="delete__Btn"
    >
      <p className="confirmation__title">
        Your previously saved result will be removed
      </p>
    </AlertModal>
  ) : (
    <></>
  );
};

export default ActivityReOpenClearResultWarningModal;
