// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// ** Components **
import Modal from 'components/Modal';
import { agGridSelectedProps } from 'components/TableInfiniteScroll';
import FormField from 'components/FormField';

// ** services **
import { useAddOrgDepartmentMutation } from 'redux/api/orgDepartmentApi';

// ** schema **
import { orgDepartmentsSchema } from '../validation-schema/orgDepartments.schema';

type orgDepartmentFieldType = {
  name: string;
};

interface Props {
  isOpen?: boolean;
  closeModal: () => void;
  onAdd?: () => void;
  setOrgDepartmentInfo: React.Dispatch<React.SetStateAction<agGridSelectedProps>>;
}

const AddOrgDepartment = (props: Props) => {
  const { closeModal, isOpen, onAdd, setOrgDepartmentInfo } = props;

  // ** APIS **
  const [addOrgDepartment, { isLoading }] = useAddOrgDepartmentMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<orgDepartmentFieldType>({
    resolver: yupResolver(orgDepartmentsSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = handleSubmit(async (value) => {
    const data = await addOrgDepartment({
      data: {
        name: value.name,
      },
    });
    if (data) {
      if (setOrgDepartmentInfo) setOrgDepartmentInfo([]);
      if (onAdd) {
        onAdd();
      }
      close();
    }
  });

  const close = () => {
    reset();
    closeModal();
  };

  return isOpen ? (
    <Modal
      title="New Contact Job Role"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      onSubmit={onSubmit}
      submitButtonText="Add"
      submitLoading={isLoading}
      contentClass="add__pipeline__modal"
    >
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
    </Modal>
  ) : (
    <></>
  );
};

export default AddOrgDepartment;
