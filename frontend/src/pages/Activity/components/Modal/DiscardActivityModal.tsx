// ** Components ** //
import AlertModal from 'components/Modal/AlertModal';

interface Props {
  isOpen: boolean;
  discardActivity: () => void;
  closeModal: () => void;
}

const DiscardActivityModal = ({
  isOpen,
  closeModal,
  discardActivity,
}: Props) => {
  return isOpen ? (
    <AlertModal
      title="Discard"
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={discardActivity}
      width="800px"
      submitButtonText="Discard"
      submitButtonClass="delete__Btn"
    >
      <p className="confirmation__title">
        The changes you have made might not be saved. do you want to Discard ?
      </p>
    </AlertModal>
  ) : (
    <></>
  );
};

export default DiscardActivityModal;
