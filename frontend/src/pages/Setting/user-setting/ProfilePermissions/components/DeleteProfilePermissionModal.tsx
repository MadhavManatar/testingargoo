// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Components **
import Button from 'components/Button';
import FormField from 'components/FormField';
import Modal from 'components/Modal';

// ** Types **
import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import {
  DeleteProfilePermissionModalPropsType,
  PermissionResponseType,
  TransferProfileFormFields,
} from '../types/profile-permissions.types';


// ** Schema **
import { profileTransferSchema } from '../validation-schema/profile.schema';

import { useLazyUseGetProfilesQuery } from 'redux/api/profileApi';

const DeleteProfilePermissionModal = (
  props: DeleteProfilePermissionModalPropsType
) => {
  const { isOpen, isLoading, closeModal, deleteProfile, profileDetails } =
    props;

  const [assignedProfile, setAssignedProfile] =
    useState<PermissionResponseType>();

  // ** APIS **
  const [getProfilesAPI, { isLoading: isProfilesLoading }] = useLazyUseGetProfilesQuery();

  const totalUsers = assignedProfile?.user_roles?.length || 0;

  const transferText = `Selected Profile is associated with
  ${totalUsers > 1 ? `${totalUsers} Users` : `${totalUsers} User`} please
  transfer them before delete this profile.`;

  const subTitle =
    totalUsers > 1
      ? transferText
      : 'Are you sure you want to remove this profile ?';

  const {
    formState: { errors },
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<TransferProfileFormFields>({
    resolver: yupResolver(profileTransferSchema),
  });
  const profileId = watch('id');

  useEffect(() => {
    if (profileDetails && profileDetails?.user_roles?.length >= 1) {
      setAssignedProfile(profileDetails);
    }
    reset({ id: profileDetails?.id, transfer_id: undefined });
  }, [profileDetails]);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const getProfilesOptions: AsyncSelectGetOptions = async () => {
    const data = await getProfilesAPI({
      params: { select: 'all', 'q[id][notIn]': `${assignedProfile?.id}` },
    },
      true
    );

    if ("data" in data) {
      const tempOption = data?.data.rows.map(
        (val: { name?: string; id: number }) => ({
          label: val.name,
          value: val.id,
        })
      );
      return { option: tempOption, count: data.data.count };
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    deleteProfile(value);
  });

  return isOpen ? (
    <Modal
      modalWrapperClass="small__without__HT__modal delete__user__modal"
      title="Delete Profile"
      visible={isOpen}
      onClose={closeModal}
      submitLoading={isLoading}
      width="800px"
    >
      <div className="confirmation__image__wrapper">
        <img src="/images/deleteAnimatedIcon.gif" alt="" />
      </div>
      <p className="confirmation__title">{subTitle}</p>
      {assignedProfile?.name && totalUsers > 0 && (
        <form onSubmit={onSubmit}>
          <div className="user__items__wrapper relative flex flex-wrap items-center mt-[10px]">
            <div className="username relative w-[calc(100%_-_43%)] pr-[80px] text-[20px] leading-[24px] pt-[3px] font-biotif__SemiBold sm:w-full sm:pr-0 sm:mb-[20px] sm:pb-[18px] sm:text-center">
              {assignedProfile?.name}
              <span className='hidden w-[30px] h-[2px] bg-black absolute top-[13px] right-[35px] before:content-[""] before:w-[10px] before:h-[10px] before:absolute before:top-[-4px] before:right-0 before:rotate-[45deg] before:border-[2px] before:border-black before:border-l-0 before:border-b-0 sm:w-[20px] sm:top-[100%] sm:left-[50%] sm:translate-x-[-50%] sm:rotate-90 sm:inline-block' />
            </div>
            <span className='inline-block w-[30px] h-[2px] bg-black absolute top-[50%] translate-y-[50%] left-[50%] translate-x-[-50%] before:content-[""] before:w-[10px] before:h-[10px] before:absolute before:top-[-4px] before:right-0 before:rotate-[45deg] before:border-[2px] before:border-black before:border-l-0 before:border-b-0 sm:w-[20px] sm:top-[100%] sm:left-[50%] sm:translate-x-[-50%] sm:rotate-90 sm:hidden' />
            <div className="w-[43%] flex justify-center sm:w-full">
              <div className="w-full relative z-[3]">
                <FormField<TransferProfileFormFields>
                  id="transfer_id"
                  type="asyncSelect"
                  serveSideSearch
                  name="transfer_id"
                  label="Select Profile"
                  control={control}
                  error={errors?.transfer_id}
                  getOptions={getProfilesOptions}
                  isClearable
                  isLoading={isProfilesLoading}
                  menuPosition="fixed"
                />
              </div>
            </div>
          </div>
        </form>
      )}
      <div className="w-full flex justify-center mb-[15px] mt-[15px]">
        <Button
          className="secondary__Btn smaller min-w-[170px] mr-[12px]"
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          className="bg-ip__Red hover:bg-ip__Red__hoverDark smaller min-w-[100px]"
          onClick={(value) =>
            totalUsers > 0 ? onSubmit(value) : deleteProfile({ id: profileId })
          }
          isLoading={isLoading}
        >
          {totalUsers > 0 ? 'Transfer & Delete' : 'Delete'}
        </Button>
      </div>
    </Modal>
  ) : (
    <></>
  );
};

export default DeleteProfilePermissionModal;
