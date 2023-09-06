// ** Import Packages **
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';

// ** Redux **
import { getQuickPopup } from 'redux/slices/quickPopupDefaultSlice';
import store from 'redux/store';

// ** Components **
import FileUpload from 'components/FileUpload';
import FormField from 'components/FormField';
import EmailAccount from '../components/AccountFormComponents/EmailsAccount';
import PhoneAccount from '../components/AccountFormComponents/PhoneAccount';
import RelatedContactsFormForAccount from '../components/AccountFormComponents/RelatedContactsFormForAccount';

// ** Services **
import { useGetTimeZoneList } from 'components/Address/hooks/useAddressService';
import { useGetUserOrDescendantUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';
import {
  useFetchSubAccountEnableSettingData,
  useGetAccountsWithoutChildOptions,
  useGetParentAccountsOptions,
} from './useAccountService';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Types **
import {
  AccountFormObject,
  AccountFormObjectPropsType,
  AccountParentChild,
  AddAccountFormFieldsType,
  CheckParentAccountPropsType,
} from '../types/account.types';

// ** Constants **
import { RATING_VALUE } from 'constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';

// ** Util **
import { convertNumberOrNull, isValidEmail } from 'utils/util';
import { useLazyFieldIsExistsQuery } from 'redux/api/generalServiceApi';
import {
  useLazyCheckParentAccountQuery,
  useLazyGetParentChildAccountQuery,
} from 'redux/api/accountApi';

const useAccountFormObject = (formProps: AccountFormObjectPropsType) => {
  const {
    control,
    errors,
    register,
    account_owner,
    parent_account,
    displayFieldProps,
    editFormFlag = false,
    watch,
    phoneFields,
    emailFields,
    insertEmail,
    removeEmail,
    removePhone,
    insertPhone,
    relatedContactsFields,
    appendRelatedContacts,
    removeRelatedContacts,
    setValue,
    setError,
    clearErrors,
    accountId,
    setSubmit,
    accountData,
    setDuplicateMailModal,
    defaultTimezone,
    timezoneLoading,
    setEmailTimelineModal,
    onFileSelect,
    profileImg,
    setProfileImg,
  } = formProps;

  const [parentChildData, setParentChildData] = useState<AccountParentChild>({
    child: [],
    parent: [],
  });

  // ** hooks **
  const { auth } = store.getState();
  const { user } = auth;
  const { id } = useParams();
  const { createContactPermission, readContactPermission } = usePermission();
  const [getParentChildAccountAPI] = useLazyGetParentChildAccountQuery();
  const selectorQuick = useSelector(getQuickPopup);
  const [searchParams] = useSearchParams();
  const queryAccount = searchParams?.get('quickAccount');
  // async load for account owner
  const [fieldIsExistsAPI] = useLazyFieldIsExistsQuery();
  const {
    userOrDescendantUserOptions: getAccountOwnerOptions,
    isDescendantUsersLoading,
    isUsersLoading,
  } = useGetUserOrDescendantUserOptions(
    editFormFlag
      ? { ...MODULE_PERMISSION.ACCOUNT.update }
      : { ...MODULE_PERMISSION.ACCOUNT.create }
  );

  // async load for parent account
  const { getParentAccountsOptions, isParentAccountLoading } =
    useGetParentAccountsOptions();
  const { getAccountsWithoutChildOptions, isAccountsWithoutChildLoading } =
    useGetAccountsWithoutChildOptions({ accountId });
  const { getTimezoneList, isTimeZoneListLoading } = useGetTimeZoneList();

  const { isSubAccountEnable } = useFetchSubAccountEnableSettingData();

  const watchParentAccountId = watch('parent_account_id');

  const { checkForParentAccount } = useCheckParentAccountHook({
    accountId,
    watchParentAccountId,
    setError,
    setValue,
    setSubmit,
    clearErrors,
  });

  useEffect(() => {
    if (accountId && watchParentAccountId) {
      checkForParentAccount();
    }
  }, [watchParentAccountId]);
  // Get & Store parent child data
  useEffect(() => {
    (async () => {
      const { data, error } = await getParentChildAccountAPI(
        {
          params: {
            parent_account_id: accountData?.account.parent_account_id,
            account_id: accountData?.account.id,
          },
        },
        true
      );
      if (data && !error) {
        setParentChildData(data);
      }
    })();
  }, [accountData]);
  const onRemoveStageForPhone = (index: number) => {
    removePhone(index);
  };

  const onRemoveStageForEmail = (index: number) => {
    removeEmail(index);
  };

  const checkFieldOnBlur = async (value: string, type: string) => {
    const currentAccountId = accountId || id;
    if (
      value &&
      (((type === 'name' || type === 'relatedContact') && value.trim()) ||
        (type === 'email' && isValidEmail(value)))
    ) {
      const data = await fieldIsExistsAPI({
        data: {
          [type]: value,
          ...(id && { accountId: +id }),
          ...(currentAccountId && { accountId: currentAccountId }),
        },
      });
      if (
        'error' in data &&
        data.error &&
        'data' in data.error &&
        data.error.data?.duplicateField &&
        data.error.data?.duplicateField?.moduleName !== '' &&
        setDuplicateMailModal
      ) {
        setDuplicateMailModal({
          isOpen: true,
          data: data.error.data?.duplicateField,
        });
      }
    }
  };

  const formObject: AccountFormObject = {
    information: {
      account_image: (
        <div className="px-[10px] w-full">
          <div className="upload__File mb-[20px]">
            {setProfileImg && (
              <FileUpload
                error={errors.account_image}
                setFileObjectCb={setProfileImg}
                image={profileImg}
                onFileChange={onFileSelect}
                fileUploadText="Upload Image"
              />
            )}
          </div>
        </div>
      ),
      account_owner_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddAccountFormFieldsType>
            id="account_owner_id"
            placeholder="Select Owner"
            type="asyncSelect"
            name="account_owner_id"
            label="Owner"
            labelClass="if__label__blue"
            icon="profileFilledIconGrey"
            iconPosition="left"
            serveSideSearch
            control={control}
            menuPosition="absolute"
            menuPlacement="auto"
            error={errors?.account_owner_id}
            getOptions={getAccountOwnerOptions}
            isLoading={isDescendantUsersLoading || isUsersLoading}
            defaultOptions={
              account_owner?.id
                ? [
                  {
                    label: `${account_owner.first_name} ${account_owner.last_name}`,
                    value: account_owner.id,
                    selected: true,
                  },
                ]
                : [
                  {
                    label: `${user?.first_name} ${user?.last_name}`,
                    value: user?.id,
                    selected: true,
                  },
                ]
            }
            {...(displayFieldProps &&
              displayFieldProps.account_owner_id && {
              ...displayFieldProps.account_owner_id,
            })}
          />
        </div>
      ),
      name: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddAccountFormFieldsType>
            required
            type="text"
            name="name"
            label="Name"
            labelClass="if__label__blue"
            placeholder="Enter Name"
            autoComplete="off"
            register={register}
            error={errors?.name}
            fieldLimit={50}
            onBlur={(e) => {
              if (e.target.value) {
                checkFieldOnBlur(e.target.value, 'name');
              }
            }}
          />
        </div>
      ),
      rating: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddAccountFormFieldsType>
            id="rating"
            name="rating"
            label="Rating"
            labelClass="if__label__blue"
            type="select"
            placeholder="Select Rating"
            control={control}
            error={errors?.rating}
            options={RATING_VALUE}
            menuPosition="absolute"
            menuPlacement="auto"
          />
        </div>
      ),
      parent_account_id: (
        <>
          {isSubAccountEnable && (
            <div
              className={`${parentChildData.child.filter((ch) => ch.level === 4).length >= 1
                ? 'cursor-not-allowed'
                : ''
                } w-1/2 px-[10px] sm:w-full`}
            >
              <FormField<AddAccountFormFieldsType>
                id="parent_account_id"
                placeholder="Select Parent"
                type="asyncSelect"
                serveSideSearch
                name="parent_account_id"
                label="Parent"
                disabled={parentChildData.child.length >= 4}
                labelClass="if__label__blue"
                control={control}
                error={errors?.parent_account_id}
                getOptions={
                  accountId
                    ? getAccountsWithoutChildOptions
                    : getParentAccountsOptions
                }
                getOnChange={(data) => {
                  if (!data) {
                    setSubmit(true);
                    clearErrors('parent_account_id');
                  }
                  if (!data && setEmailTimelineModal) {
                    const d = convertNumberOrNull(watchParentAccountId);

                    if (
                      d !== null &&
                      accountData?.account.parent_account?.id !== null &&
                      d === accountData?.account.parent_account?.id
                    ) {
                      setEmailTimelineModal({
                        isOpen: true,
                        data: {
                          key: 'parent_account',
                          data: accountData?.account.parent_account_id,
                        },
                      });
                    }
                  }
                }}
                isLoading={
                  accountId
                    ? isAccountsWithoutChildLoading
                    : isParentAccountLoading
                }
                defaultOptions={
                  parent_account?.id
                    ? [
                      {
                        label: `${parent_account.name}`,
                        value: `${parent_account.id}`,
                        selected: true,
                      },
                    ]
                    : queryAccount && selectorQuick.parent?.id
                      ? [
                        {
                          label: `${selectorQuick.parent?.name}`,
                          value: `${selectorQuick.parent?.id}`,
                          selected: true,
                        },
                      ]
                      : []
                }
                menuPosition="absolute"
                menuPlacement="auto"
                isClearable
              />
            </div>
          )}
        </>
      ),
      emails: (
        <EmailAccount
          checkMailOnBlur={checkFieldOnBlur}
          emailFields={emailFields}
          onRemoveStageForEmail={onRemoveStageForEmail}
          insertEmail={insertEmail}
        />
      ),
      phones: (
        <PhoneAccount
          insertPhone={insertPhone}
          onRemoveStageForPhone={onRemoveStageForPhone}
          phoneFields={phoneFields}
        />
      ),
      related_contacts: (
        <div
          className={`repeater__Rcontact__box withPrimary w-full relative ${!readContactPermission ? '!hidden' : ''
            }`}
        >
          <label className="if__label if__label__blue w-full !mb-[10px] px-[10px] ">
            Related Contacts
          </label>
          {relatedContactsFields.map((field, index) => {
            return (
              <RelatedContactsFormForAccount
                field={field}
                index={index}
                key={field.id}
                account={accountData?.account}
                checkFieldOnBlur={checkFieldOnBlur}
                isDisabled={!readContactPermission}
                removeRelatedContacts={removeRelatedContacts}
                isCreatablePermission={createContactPermission}
              />
            );
          })}

          <div
            className={`w-full px-[10px] mt-[-6px] mb-[17px] ${!readContactPermission ? 'ip__disabled' : ''
              } `}
          >
            <button
              className="add__btn text-[14px] text-[#8A8A8A] font-biotif__Medium duration-500 hover:text-primaryColor"
              type="button"
              onClick={() => {
                appendRelatedContacts({
                  is_primary: false,
                  job_role: '',
                  value: '',
                  isCreatable: false,
                });
              }}
              disabled={
                relatedContactsFields?.length
                  ? relatedContactsFields.length >= 10
                  : false
              }
            >
              + Add Contact
            </button>
          </div>

          <label className="inline-block font-biotif__Regular text-light__TextColor text-[14px] absolute top-0 right-[31px]">
            Primary
          </label>
        </div>
      ),
      fax: (
        <div className="w-1/2 px-[10px] sm:w-full">
          <FormField<AddAccountFormFieldsType>
            type="text"
            name="fax"
            label="Fax"
            labelClass="if__label__blue"
            placeholder="Enter Fax"
            inputMode="numeric"
            register={register}
            error={errors?.fax}
            fieldLimit={20}
          />
        </div>
      ),
      website: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddAccountFormFieldsType>
            type="text"
            id="website"
            name="website"
            label="Website"
            labelClass="if__label__blue"
            placeholder="Enter Website"
            register={register}
            error={errors?.website}
            fieldLimit={50}
          />
        </div>
      ),
      account_type: (
        <div className="w-1/2 px-[10px] sm:w-full">
          <FormField<AddAccountFormFieldsType>
            type="text"
            name="account_type"
            label="Type"
            labelClass="if__label__blue"
            placeholder="Enter Type"
            register={register}
            error={errors?.account_type}
            fieldLimit={20}
          />
        </div>
      ),
      ownership: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddAccountFormFieldsType>
            type="text"
            name="ownership"
            label="Ownership"
            labelClass="if__label__blue"
            placeholder="Enter Type of Ownership"
            register={register}
            error={errors?.ownership}
            fieldLimit={50}
          />
        </div>
      ),
      industry: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddAccountFormFieldsType>
            type="text"
            name="industry"
            label="Industry"
            labelClass="if__label__blue"
            placeholder="Enter Industry"
            register={register}
            error={errors?.industry}
            fieldLimit={100}
          />
        </div>
      ),
      employees: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddAccountFormFieldsType>
            type="text"
            name="employees"
            label="Employees"
            labelClass="if__label__blue"
            placeholder="Enter Number of Employees"
            register={register}
            error={errors?.employees}
            fieldLimit={7}
          />
        </div>
      ),
      annual_revenue: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddAccountFormFieldsType>
            type="currency_format"
            formatName="currency"
            name="annual_revenue"
            label="Annual Revenue"
            labelClass="if__label__blue"
            icon="currencyFilledIcon"
            iconPosition="left"
            placeholder="EX. $X,XXX.XX"
            error={errors?.annual_revenue}
            control={control}
            fieldLimit={15}
          />
        </div>
      ),
      timezone: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddAccountFormFieldsType>
            id="timezone"
            placeholder="Select TimeZone"
            key={defaultTimezone?.value}
            type="asyncSelect"
            label="TimeZone"
            menuPosition="absolute"
            menuPlacement="bottom"
            name="timezone"
            labelClass="if__label__blue"
            control={control}
            error={errors?.timezone}
            isLoading={isTimeZoneListLoading || timezoneLoading}
            defaultOptions={defaultTimezone ? [defaultTimezone] : []}
            getOptions={getTimezoneList}
          />
        </div>
      ),
    },

    descriptionInfo: {
      description: (
        <div className="w-full px-[10px]">
          <FormField<AddAccountFormFieldsType>
            type="textarea"
            name="description"
            labelClass="if__label__blue"
            placeholder="Enter Description"
            register={register}
            error={errors?.description}
            fieldLimit={5000}
          />
        </div>
      ),
    },
  };

  return { formObject };
};

export default useAccountFormObject;

const useCheckParentAccountHook = (props: CheckParentAccountPropsType) => {
  const {
    accountId,
    watchParentAccountId,
    setError,
    setValue,
    setSubmit,
    clearErrors,
  } = props;

  const [checkParentAccountAPI] = useLazyCheckParentAccountQuery();

  const checkForParentAccount = async () => {
    const { data, error } = await checkParentAccountAPI(
      {
        params: {
          account_id: accountId,
          parent_id: watchParentAccountId,
        },
      },
      true
    );

    if (!error && data) {
      if (data?.allow === false) {
        setError('parent_account_id', {
          type: 'custom',
          message: 'Please select another parent',
        });
        setValue('parent_account_id', '');
        setSubmit(false);
      } else if (data?.allow === true) {
        clearErrors('parent_account_id');
        setSubmit(true);
      }
    }
  };

  return {
    checkForParentAccount,
  };
};
