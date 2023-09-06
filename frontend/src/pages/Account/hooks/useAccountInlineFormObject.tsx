// ** Import Packages **
import { useEffect, useRef } from 'react';

// ** Redux **
import store from 'redux/store';

// ** Components **
import FormField from 'components/FormField';

// ** Services **
import { useGetPhoneTypeOption } from 'pages/Setting/general-setting/common-controls/PhoneType/hooks/usePhoneTypeServices';
import { useGetUserOrDescendantUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';
import {
  useGetAccountsWithoutChildOptions,
  useGetParentAccountsOptions,
} from './useAccountService';
import { useGetTimeZoneList } from 'components/Address/hooks/useAddressService';

// ** Types **
import {
  AccountEmailFieldsPropsType,
  AccountFormObject,
  AccountInlineFormObjectPropsType,
  AccountPhoneFieldsPropsType,
  AddAccountFormFieldsType,
  CheckParentAccountPropsType,
} from '../types/account.types';

// ** Constants **
import { RATING_VALUE } from 'constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { maskInputRegex } from 'constant/regex.constant';
import { MultiValue, SingleValue } from 'react-select';
import { isSingleValue } from 'components/FormField/helper';
import { Option } from 'components/FormField/types/formField.types';
import { convertNumberOrNull } from 'utils/util';
import { useLazyCheckParentAccountQuery } from 'redux/api/accountApi';

const useAccountInlineFormObject = (
  formProps: AccountInlineFormObjectPropsType
) => {
  const {
    control,
    errors,
    register,
    parent_account,
    displayFieldProps,
    editFormFlag = false,
    watch,
    phoneFields,
    emailFields,
    setValue,
    setError,
    clearErrors,
    accountId,
    setSubmit,
    accountData,
    isKeyDownCreatableRef,
    setIsKeyDownCreatable,
    defaultTimezone,
    setEmailTimelineModal,
  } = formProps;

  const accountOwner = accountData?.account.account_owner;

  // ** hooks **
  const { auth } = store.getState();
  const { user } = auth;
  const descRef = useRef<HTMLDivElement>(null);

  // **Custom hooks **
  // async load for account owner
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

  const watchParentAccountId = watch('parent_account_id');

  const { checkForParentAccount } = useCheckParentAccountHook({
    accountId,
    watchParentAccountId,
    setError,
    setValue,
    setSubmit,
    clearErrors,
  });

  const { getPhoneTypeOption, isGetPhoneTypeLoading } = useGetPhoneTypeOption();

  useEffect(() => {
    if (accountId && watchParentAccountId && accountData?.account.id) {
      checkForParentAccount();
    }
  }, [watchParentAccountId, accountId, accountData?.account.id]);

  const setSelectedValueRefForEnterSave = (
    e: MultiValue<Option> | SingleValue<Option>
  ) => {
    if (isSingleValue(e)) {
      if (e?.label) {
        setIsKeyDownCreatable(true);
        isKeyDownCreatableRef.current = 'is_new';
      }
    }
  };

  useEffect(() => {
    descRef?.current?.querySelector('textarea')?.focus();
  });

  const formObject: AccountFormObject = {
    information: {
      account_owner_id: (
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
          error={errors?.account_owner_id}
          getOptions={getAccountOwnerOptions}
          isLoading={isDescendantUsersLoading || isUsersLoading}
          defaultOptions={
            accountOwner?.id
              ? [
                  {
                    label: `${accountOwner.first_name} ${accountOwner.last_name}`,
                    value: accountOwner.id,
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
          menuPlacement="bottom"
          {...(displayFieldProps &&
            displayFieldProps.account_owner_id && {
              ...displayFieldProps.account_owner_id,
            })}
          getOnChange={setSelectedValueRefForEnterSave}
          autoFocus
        />
      ),
      rating: (
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
          menuPlacement="bottom"
          getOnChange={setSelectedValueRefForEnterSave}
          autoFocus
        />
      ),
      name: (
        <FormField<AddAccountFormFieldsType>
          required
          type="text"
          name="name"
          label="Name"
          labelClass="if__label__blue"
          placeholder="Enter Name"
          autoComplete="new-password"
          register={register}
          error={errors?.name}
          fieldLimit={50}
        />
      ),
      emails: (
        <EmailFieldsComp
          emailFields={emailFields}
          errors={errors}
          register={register}
        />
      ),
      phones: (
        <PhoneFieldsComp
          errors={errors}
          register={register}
          phoneFields={phoneFields}
          getPhoneTypeOption={getPhoneTypeOption}
          isGetPhoneTypeLoading={isGetPhoneTypeLoading}
          control={control}
          setSelectedValueRefForEnterSave={setSelectedValueRefForEnterSave}
        />
      ),
      fax: (
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
      ),
      parent_account_id: (
        <>
          <FormField<AddAccountFormFieldsType>
            id="parent_account_id"
            placeholder="Select Parent"
            type="asyncSelect"
            serveSideSearch
            name="parent_account_id"
            label="Parent"
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
                setValue('parent_account_id', '');
                clearErrors('parent_account_id');
              }
              if (!data && setEmailTimelineModal) {
                const d = convertNumberOrNull(watchParentAccountId);
                if (d === accountData?.account.parent_account?.id) {
                  setEmailTimelineModal({
                    isOpen: true,
                    data: {
                      key: 'parent_account',
                      data: accountData?.account.parent_account_id,
                    },
                  });
                }
              }
              setSelectedValueRefForEnterSave(data);
            }}
            isLoading={
              accountId ? isAccountsWithoutChildLoading : isParentAccountLoading
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
                : []
            }
            menuPlacement="bottom"
            isClearable
          />
        </>
      ),
      website: (
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
      ),
      account_type: (
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
      ),
      ownership: (
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
      ),
      industry: (
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
      ),
      employees: (
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
      ),
      annual_revenue: (
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
      ),
      timezone: (
        <FormField<AddAccountFormFieldsType>
          id="timezone"
          placeholder="Select TimeZone"
          key={defaultTimezone?.value}
          type="asyncSelect"
          menuPosition="absolute"
          menuPlacement="bottom"
          name="timezone"
          labelClass="if__label__blue"
          control={control}
          error={errors?.timezone}
          isLoading={isTimeZoneListLoading}
          defaultOptions={
            accountData?.account?.timezone
              ? [
                  {
                    label: accountData?.account?.timezone,
                    value: accountData?.account?.timezone,
                  },
                ]
              : defaultTimezone
              ? [defaultTimezone]
              : []
          }
          getOptions={getTimezoneList}
          getOnChange={setSelectedValueRefForEnterSave}
        />
      ),
    },

    descriptionInfo: {
      description: (
        <div ref={descRef} className="w-full">
          <FormField<AddAccountFormFieldsType>
            type="textarea"
            name="description"
            label="Description"
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

export default useAccountInlineFormObject;

const useCheckParentAccountHook = (props: CheckParentAccountPropsType) => {
  const {
    accountId,
    watchParentAccountId,
    setError,
    setValue,
    setSubmit,
    clearErrors,
  } = props;

  // ** apis ** //
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
          message: 'Please Select another parent',
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

const EmailFieldsComp = (props: AccountEmailFieldsPropsType) => {
  const { emailFields, errors, register } = props;
  const emailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    emailRef?.current?.querySelector('input')?.focus();
  });

  return (
    <>
      <div className="repeater__email__box w-full relative">
        <label className="if__label if__label__blue pl-[10px] pr-[80px]">
          Email
        </label>
        {emailFields?.map((field, index) => {
          return (
            field.isPrimary && (
              <div
                style={{ ...(!index && { order: emailFields.length }) }}
                className="w-full flex flex-wrap items-endsm:pb-[0px]"
                key={field.id}
                ref={emailRef}
              >
                <div className="w-full">
                  <FormField<AddAccountFormFieldsType>
                    wrapperClass="mb-0"
                    type="text"
                    id={`emails.${index}.value`}
                    name={`emails.${index}.value`}
                    autoComplete="new-password"
                    error={
                      errors?.emails &&
                      errors?.emails[index] &&
                      errors?.emails[index]?.value
                    }
                    placeholder="Enter Your Email Address"
                    register={register}
                    fieldLimit={60}
                  />
                </div>
              </div>
            )
          );
        })}
      </div>
    </>
  );
};

const PhoneFieldsComp = (props: AccountPhoneFieldsPropsType) => {
  const {
    errors,
    register,
    phoneFields,
    getPhoneTypeOption,
    isGetPhoneTypeLoading,
    control,
    setSelectedValueRefForEnterSave,
  } = props;

  return (
    <>
      <div className="repeater__phone__box w-full relative">
        <label className="if__label if__label__blue w-full pl-[10px] pr-[80px]">
          Phone <span className="required__sign">*</span>
        </label>
        {phoneFields?.map((field, index) => {
          return (
            field.isPrimary && (
              <div
                style={{ ...(!index && { order: phoneFields.length }) }}
                className="w-full"
                key={field.id}
              >
                <div
                  className={`w-full flex flex-wrap items-start mb-[0px] relative ${
                    errors?.phones &&
                    errors?.phones[index] &&
                    errors?.phones[index]?.phoneType
                      ? ''
                      : 'sm:pb-[0px]'
                  }`}
                >
                  <div className="ip__Select w-[100px] mr-[10px]">
                    <FormField<AddAccountFormFieldsType>
                      wrapperClass="mb-0"
                      id={`phones.${index}.phoneType`}
                      placeholder="Select Phone Type"
                      type="asyncSelect"
                      name={`phones.${index}.phoneType`}
                      autoComplete="new-password"
                      control={control}
                      error={
                        errors?.phones &&
                        errors?.phones[index] &&
                        errors?.phones[index]?.phoneType
                      }
                      isClearable
                      getOptions={getPhoneTypeOption}
                      isLoading={isGetPhoneTypeLoading}
                      defaultOptions={
                        field.phoneType
                          ? [
                              {
                                label: field.phoneType,
                                value: field.phoneType,
                                selected: true,
                              },
                            ]
                          : []
                      }
                      menuPlacement="bottom"
                      getOnChange={setSelectedValueRefForEnterSave}
                      autoFocus
                    />
                  </div>
                  <div className="w-[calc(100%_-_110px)]">
                    <FormField
                      type="mask_input"
                      maskInputType="mask_input_phone"
                      name={`phones.${index}.value`}
                      placeholder="EX. (XXX) XXX-XXXX"
                      register={register}
                      error={
                        errors?.phones &&
                        errors?.phones[index] &&
                        errors?.phones[index]?.value
                      }
                      control={control}
                      inputMode="numeric"
                      mask={maskInputRegex}
                    />
                  </div>
                </div>
              </div>
            )
          );
        })}
      </div>
    </>
  );
};
