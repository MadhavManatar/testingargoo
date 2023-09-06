// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Components *8
import Button from 'components/Button';
import FormField from 'components/FormField';
import Modal from 'components/Modal';


// ** Schema **
import { userTransferSchema } from '../validation-schema/user.schema';

// ** Types **
import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import {
  DeleteUserModalPropsType,
  TransferUserFormFields,
} from '../types/user.types';
import { useLazyGetAllUserQuery } from 'redux/api/userApi';

const transferOption = [
  { label: 'Delete without transfer', value: 'withOut' },
  { label: 'Transfer now', value: 'with' },
];

const DeleteUserModal = ({
  isOpen,
  isLoading,
  closeModal,
  deleteUser,
  userDetails,
}: DeleteUserModalPropsType) => {
  const [withTransfer, setWithTransfer] = useState<string>('withOut');

  // ** APIS **
  const [getUsersAPI, { isLoading: isGetUsersLoading }] = useLazyGetAllUserQuery();
  const {
    formState: { errors },
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<TransferUserFormFields>({
    resolver: yupResolver(userTransferSchema),
  });

  const userObject = watch('user');

  useEffect(() => {
    if (!isOpen) {
      reset();
      setWithTransfer('withOut');
    }
  }, [isOpen]);

  useEffect(() => {
    const temp = [...userDetails].map((user) => ({
      id: user.id,
      transfer_id: undefined,
    }));
    reset({ user: temp });
  }, [userDetails]);

  const getUsersOptions: AsyncSelectGetOptions = async () => {
    const userId = [...userDetails].map((user) => user.id);
    const data = await getUsersAPI({
      params: {
        select: 'id,first_name,last_name',
        'q[id][notIn]': `${userId}`,
      },
    }, true);
    if ("data" in data) {
      const tempOption = data.data.rows.map(
        (val: {
          first_name?: string;
          last_name?: string;
          id: number;
          email: string;
        }) => ({
          label: `${val.first_name || ''} ${val.last_name || ''}`,
          value: `${val.id}`,
        })
      );
      return {
        option: tempOption,
        count: data.data.count,
      };
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    deleteUser(value);
  });

  const renderFirstName = (users: any) => {
    if (users[0]) {
      const { first_name = '', last_name = '' } = users[0];
      return `${first_name} ${last_name}`;
    }
    return '';
  };

  return isOpen ? (
    <Modal
      modalWrapperClass="small__without__HT__modal delete__user__modal"
      title="Delete User"
      visible={isOpen}
      onClose={closeModal}
      width="800px"
    >
      <div className="confirmation__image__wrapper">
        <img src="/images/deleteAnimatedIcon.gif" alt="" />
      </div>
      <form onSubmit={onSubmit}>
        <p className="confirmation__title">
          Are you sure you want to delete{' '}
          <span className="text-ip__Red">{renderFirstName(userDetails)}</span>{' '}
          user?
        </p>
        {userDetails.some(
          (user) =>
            user?.owned_leads?.length ||
            user?.owned_accounts?.length ||
            user?.owned_contacts?.length ||
            user?.reporting_users?.length
        ) && (
            <div className="flex flex-wrap custom__radio__btn__wrapper justify-center mt-[12px]">
              {transferOption.map((option, index) => (
                <div
                  className="ip__Radio__item mr-[16px] mb-[10px] last:mr-0"
                  key={index}
                >
                  <div key={index} className="ip__Radio full__Radio__Button">
                    <input
                      type="radio"
                      value={option.value}
                      id={option.label}
                      onChange={(e) => setWithTransfer(e.target.value)}
                      checked={withTransfer === option.value}
                    />
                    <label htmlFor={option.label} className="rc__Label">
                      {option.label}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        {withTransfer === 'with' && (
          <div className="user__items__wrapper relative flex flex-wrap items-center mt-[10px]">
            <>
              {userDetails.map((user, index) => {
                const {
                  owned_leads,
                  owned_contacts,
                  owned_accounts,
                  reporting_users,
                  first_name,
                  last_name,
                } = user;
                return (
                  <Fragment key={index}>
                    <div className="username relative w-[calc(100%_-_43%)] pr-[80px] text-[20px] leading-[24px] pt-[3px] font-biotif__SemiBold sm:w-full sm:pr-0 sm:mb-[20px] sm:pb-[18px] sm:text-center">
                      {first_name} {last_name}
                      <span className='hidden w-[30px] h-[2px] bg-black absolute top-[13px] right-[35px] before:content-[""] before:w-[10px] before:h-[10px] before:absolute before:top-[-4px] before:right-0 before:rotate-[45deg] before:border-[2px] before:border-black before:border-l-0 before:border-b-0 sm:w-[20px] sm:top-[100%] sm:left-[50%] sm:translate-x-[-50%] sm:rotate-90 sm:inline-block' />
                    </div>
                    <span className='inline-block w-[30px] h-[2px] bg-black absolute top-[50%] translate-y-[50%] left-[50%] translate-x-[-50%] before:content-[""] before:w-[10px] before:h-[10px] before:absolute before:top-[-4px] before:right-0 before:rotate-[45deg] before:border-[2px] before:border-black before:border-l-0 before:border-b-0 sm:w-[20px] sm:top-[100%] sm:left-[50%] sm:translate-x-[-50%] sm:rotate-90 sm:hidden' />
                    {owned_leads.length ||
                      owned_contacts.length ||
                      owned_accounts.length ||
                      reporting_users.length ? (
                      <div className="w-[43%] flex justify-center sm:w-full">
                        <div className="w-full relative z-[3]">
                          <FormField<TransferUserFormFields>
                            id="transfer_id"
                            type="asyncSelect"
                            serveSideSearch
                            name={`user.${index}.transfer_id`}
                            label="Select User"
                            control={control}
                            error={errors.user?.[index]?.transfer_id}
                            getOptions={getUsersOptions}
                            isClearable
                            isLoading={isGetUsersLoading}
                            menuPosition="fixed"
                          />
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </Fragment>
                );
              })}
            </>
          </div>
        )}
      </form>
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
            withTransfer === 'with'
              ? onSubmit(value)
              : deleteUser({ user: userObject })
          }
          isLoading={isLoading}
        >
          {withTransfer === 'with' ? 'Transfer & Delete' : 'Delete'}
        </Button>
      </div>
    </Modal>
  ) : (
    <></>
  );
};

export default DeleteUserModal;
