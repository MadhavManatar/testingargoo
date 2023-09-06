import AlertModal from 'components/Modal/AlertModal';
import { KeepEmailTimelineModalProps } from './types/index.types';

const KeepEmailTimelineModal = ({
  isOpen,
  closeModal,
  keepTimeline,
}: KeepEmailTimelineModalProps) => {
  return isOpen ? (
    <AlertModal
      title="Email Timeline"
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={keepTimeline}
      width="800px"
      submitButtonText="Keep Timeline"
      submitButtonClass="delete__Btn"
    >
      <p className="confirmation__title">
        Do you also want to remove this email's timeline records ?
      </p>
    </AlertModal>
  ) : null;
};

export default KeepEmailTimelineModal;
