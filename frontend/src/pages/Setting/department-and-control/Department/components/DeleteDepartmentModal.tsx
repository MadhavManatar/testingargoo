// =================== import packages ==================
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
// ======================================================
import AlertModal from 'components/Modal/AlertModal';

interface Props {
  isOpen: boolean;
  deleteDepartment: () => void;
  closeModal: () => void;
  isLoading: boolean;
}

const DeleteDepartmentModal = ({
  isOpen,
  isLoading,
  closeModal,
  deleteDepartment,
}: Props) => {
  // ================= Hooks =============
  const { handleSubmit, reset } = useForm({});

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = handleSubmit(async () => {
    deleteDepartment();
  });

  return isOpen ? (
    <AlertModal
      title="Delete Department"
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={onSubmit}
      submitLoading={isLoading}
      width="800px"
      submitButtonText="Delete"
      submitButtonClass="delete__Btn"
    >
      <h5 className="confirmation__title">
        Are you sure you want to delete this department?
      </h5>
    </AlertModal>
  ) : (
    <></>
  );
};

export default DeleteDepartmentModal;
