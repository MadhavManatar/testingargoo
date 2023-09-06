// ** Components **
import AlertModal from 'components/Modal/AlertModal';

// ** Type **
import { DeleteAttachmentModalProps } from '../types/attachment.types';

const DeleteAttachmentModal = ({
  isOpen,
  isLoading,
  closeModal,
  deleteAttachment,
}: DeleteAttachmentModalProps) => {
  return isOpen ? (
    <AlertModal
      title="Delete Document"
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={deleteAttachment}
      submitLoading={isLoading}
      width="800px"
      submitButtonText="Delete"
      submitButtonClass="delete__Btn"
    >
      <h5 className="confirmation__title">
        Are you sure you want to delete this document.
      </h5>
    </AlertModal>
  ) : (
    <></>
  );
};

export default DeleteAttachmentModal;
