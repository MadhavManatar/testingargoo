import AlertModal from 'components/Modal/AlertModal';

interface Props {
  isOpen: boolean;
  deleteNote: () => void;
  closeModal: () => void;
  isLoading: boolean;
}

const DeleteNoteModal = ({
  isOpen,
  isLoading,
  closeModal,
  deleteNote,
}: Props) => {
  return isOpen ? (
    <AlertModal
      title="Delete Note"
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={deleteNote}
      submitLoading={isLoading}
      width="800px"
      submitButtonText="Delete"
      submitButtonClass="delete__Btn"
    >
      <h5 className="confirmation__title">
        Are you sure you want to delete this Note?
      </h5>
    </AlertModal>
  ) : (
    <></>
  );
};

export default DeleteNoteModal;
