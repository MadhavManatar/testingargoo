// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Components **
import Modal from 'components/Modal';
import DiscardConfirmationModal from 'components/Modal/DiscardConfirmationModal';
import FormField from 'components/FormField';
import { agGridSelectedProps } from 'components/TableInfiniteScroll';

// ** Services **
import {
  useLazyGetOrgDepartmentByIdQuery,
  useUpdateOrgDepartmentMutation,
} from 'redux/api/orgDepartmentApi';

// ** others **
import { orgDepartmentsSchema } from '../validation-schema/orgDepartments.schema';

type orgDepartmentFieldType = {
  name: string;
};

interface Props {
  isOpen?: boolean;
  closeModal: () => void;
  onEdit?: () => void;
  setOrgDepartmentInfo: React.Dispatch<React.SetStateAction<agGridSelectedProps>>;
  id: number;
}

const EditOrgDepartmentModal = (props: Props) => {
  const { closeModal, isOpen, onEdit, id, setOrgDepartmentInfo } = props;

  // ** Hooks
  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
  } = useForm<orgDepartmentFieldType>({
    resolver: yupResolver(orgDepartmentsSchema),
  });

  // ** states **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  // ** API **
  const [getOrgDepartmentById, { isLoading }] =
    useLazyGetOrgDepartmentByIdQuery();

  const [updateOrgDepartment, { isLoading: isUpdateLoading }] =
    useUpdateOrgDepartmentMutation();

  useEffect(() => {
    if (id) {
      getOrgDepartment(id);
    }
  }, [id]);

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const getOrgDepartment = async (contactTypeId: number) => {
    const { data, error } = await getOrgDepartmentById({
      id: contactTypeId,
    });

    if (data && !error) {
      reset({ name: data?.name || '' });
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    if (id) {
      const data = await updateOrgDepartment({
        id,
        data: {
          name: value.name,
        },
      });
      if (data) {
        if (setOrgDepartmentInfo) setOrgDepartmentInfo([]);
        if (onEdit) {
          onEdit();
        }
        close();
      }
    }
  });
  const onCancelForm = () => {
    const isDirtyFields = Object.values(dirtyFields);
    if (isDirtyFields.length) {
      setOpenDiscardModal(true);
    } else {
      close();
    }
  };
  const close = () => {
    reset();
    closeModal();
  };

  return isOpen ? (
    <Modal
      title="Update Org Department"
      visible={isOpen}
      onClose={onCancelForm}
      onCancel={onCancelForm}
      onSubmit={onSubmit}
      submitButtonText="Update"
      submitLoading={isUpdateLoading}
      contentClass="add__pipeline__modal"
    >
      {!isLoading ? (
        <form onSubmit={onSubmit}>
          <FormField<orgDepartmentFieldType>
            required
            placeholder="Enter a name"
            type="text"
            label="Name"
            labelClass="if__label__blue"
            name="name"
            error={errors?.name}
            register={register}
            fieldLimit={25}
          />
        </form>
      ) : null}

      {openDiscardModal ? (
        <DiscardConfirmationModal
          discardActivity={close}
          isOpen={openDiscardModal}
          closeModal={() => setOpenDiscardModal(false)}
        />
      ) : null}
    </Modal>
  ) : (
    <></>
  );
};

export default EditOrgDepartmentModal;
