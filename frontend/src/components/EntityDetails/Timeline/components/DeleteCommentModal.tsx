// ** Components **
import AlertModal from 'components/Modal/AlertModal';

type DeleteCommentModalProps = {
  isOpen: boolean;
  deleteComment: () => void;
  closeModal: () => void;
  isLoading: boolean;
};

const DeleteCommentModal = ({
  isOpen,
  isLoading,
  closeModal,
  deleteComment,
}: DeleteCommentModalProps) => {
  return isOpen ? (
    <AlertModal
      title="Delete Comment"
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={deleteComment}
      submitLoading={isLoading}
      width="800px"
      submitButtonText="Delete"
      submitButtonClass="delete__Btn"
    >
      <h5 className="confirmation__title">
        Are you sure you want to delete this comment ?
      </h5>
    </AlertModal>
  ) : (
    <></>
  );
};

export default DeleteCommentModal;
