// ** import packages **
import { ChangeEventHandler, useState } from 'react';
import { useForm } from 'react-hook-form';
// ** Types **
import {
  Permission,
  Status,
} from 'pages/Setting/user-setting/ProfilePermissions/types/profile-permissions.types';

import Modal from 'components/Modal';
import FormField from 'components/FormField';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  permissions: Permission[];
  onUpdatePermission: (data: Permission[]) => void;
}

type PermissionFields = {
  [key: string]: boolean;
};

const EditPermissionModal = (props: Props) => {
  const { isOpen, closeModal } = props;
  const { permissions, onUpdatePermission } = props;

  // ** States **
  const [checkboxStatus, setCheckboxStatus] = useState({
    ...permissions.reduce((accumulator: any, currVal) => {
      const key = currVal.name;
      accumulator[key] = currVal.status === Status.ACTIVE;
      return accumulator;
    }, {}),
  });

  // ** Custom hooks **
  const { register, formState, handleSubmit } = useForm<PermissionFields>({});

  const updatePermissions = () => {
    const updatedPermissions = permissions.map((h) => ({
      name: h.name,
      id: h.id,
      status: checkboxStatus[`${h.name}`] ? Status.ACTIVE : Status.INACTIVE,
      is_disabled: h.is_disabled,
    }));
    onUpdatePermission(updatedPermissions);
  };

  const onCheckboxChange: ChangeEventHandler<HTMLInputElement> &
    ChangeEventHandler<HTMLTextAreaElement> = (e) => {
      if (e.target.name === 'read') {
        setCheckboxStatus((prev: PermissionFields) => {
          if ((e.target as HTMLInputElement).checked) {
            return {
              ...prev,
              read: (e.target as HTMLInputElement).checked,
            };
          }
          if (!(e.target as HTMLInputElement).checked) {
            return {
              read: (e.target as HTMLInputElement).checked,
              create: (e.target as HTMLInputElement).checked,
              update: (e.target as HTMLInputElement).checked,
              delete: (e.target as HTMLInputElement).checked,
            };
          }
          return prev;
        });
      } else {
        setCheckboxStatus((prev: PermissionFields) => {
          return {
            ...prev,
            [e.target.name]: (e.target as HTMLInputElement).checked,
            ...(!checkboxStatus.read
              ? { read: (e.target as HTMLInputElement).checked }
              : {}),
          };
        });
      }
    };
  return isOpen ? (
    <Modal
      title="Edit Permissions"
      visible={isOpen}
      onClose={() => closeModal()}
      onCancel={() => closeModal()}
      onSubmit={handleSubmit(updatePermissions)}
    >
      {permissions.map((obj, index) => (
        <FormField<PermissionFields>
          disabled={obj.is_disabled}
          key={index}
          wrapperClass="full__Checkbox question__Checkbox permissionfull__Checkbox"
          type="checkbox"
          name={obj.name}
          label={obj.name}
          register={register}
          errors={formState.errors}
          checked={checkboxStatus[obj.name]}
          onChange={onCheckboxChange}
        />
      ))}
    </Modal>
  ) : (
    <></>
  );
};

export default EditPermissionModal;
