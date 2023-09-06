import { useRef, useEffect } from 'react';
// ** Redux **
import store from 'redux/store';

// ** Components **
import FormField from 'components/FormField';
import ContactWithJobRoleOptions from '../components/ContactWithJobRoleOption';

// ** Services **
import { useGetPhoneTypeOption } from 'pages/Setting/general-setting/common-controls/PhoneType/hooks/usePhoneTypeServices';
import { useGetJobRoleOption } from 'pages/Setting/module-setting/Contact/JobRole/hooks/useJobRoleServices';
import { useGetUserOrDescendantUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';
import { useGetAccountContactOptions } from '../hooks/useContactService';
import { useGetTimeZoneList } from 'components/Address/hooks/useAddressService';

// ** Types **
import {
  AddContactFormFieldsType,
  ContactFormObject,
  ContactFormProps,
} from 'pages/Contact/types/contacts.types';

//  ** Constants **
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { maskInputRegex } from 'constant/regex.constant';
import { MultiValue, SingleValue } from 'react-select';
import { isSingleValue } from 'components/FormField/helper';
import { Option } from 'components/FormField/types/formField.types';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

const useContactInlineFormObject = (formProps: ContactFormProps) => {
  const {
    control,
    errors,
    register,
    contactData,
    displayFieldProps,
    editFormFlag = false,
    inlineEditing = false,
    emailFields,
    phoneFields,
    isKeyDownCreatableRef,
    setIsKeyDownCreatable,
    defaultTimezone,
  } = formProps;

  // ** hooks **
  const { auth } = store.getState();
  const { user } = auth;
  const emailRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);

  // ** APIS **
  const { getPhoneTypeOption, isGetPhoneTypeLoading } = useGetPhoneTypeOption();

  // ** Custom hooks **
  const { getJobRoleOption } = useGetJobRoleOption({
    job_role: contactData?.job_role || '',
  });

  // async load for user
  const {
    userOrDescendantUserOptions: getContactOwnerOptions,
    isDescendantUsersLoading,
    isUsersLoading,
  } = useGetUserOrDescendantUserOptions(
    editFormFlag
      ? { ...MODULE_PERMISSION.CONTACT.update }
      : { ...MODULE_PERMISSION.CONTACT.create }
  );

  const { getAccountContactOptions, isAccountContactsLoading } =
    useGetAccountContactOptions({ contactId: contactData?.id });
  const { getTimezoneList, isTimeZoneListLoading } = useGetTimeZoneList();

  const setSelectedValueRefForEnterSave = (
    e: MultiValue<Option> | SingleValue<Option>
  ) => {
    if (isSingleValue(e)) {
      if (e?.label) {
        if (isKeyDownCreatableRef?.current === null) {
          setIsKeyDownCreatable?.(true);
          isKeyDownCreatableRef.current = 'is_new';
        }
      }
    }
  };
  useEffect(() => {
    emailRef?.current?.querySelector('input')?.focus();
    descRef?.current?.querySelector('textarea')?.focus();
  });

  const formObject: ContactFormObject = {
    information: {
      contact_owner_id: (
        <FormField<AddContactFormFieldsType>
          id="contact_owner_id"
          placeholder="Select Owner"
          type="asyncSelect"
          serveSideSearch
          name="contact_owner_id"
          {...(!inlineEditing && { label: 'Owner' })}
          labelClass="if__label__blue"
          icon="profileFilledIconGrey"
          iconPosition="right"
          control={control}
          error={errors?.contact_owner_id}
          getOptions={getContactOwnerOptions}
          isLoading={isUsersLoading || isDescendantUsersLoading}
          defaultOptions={
            contactData?.contact_owner?.id
              ? [
                {
                  label: contactData?.contact_owner?.full_name,
                  value: contactData?.contact_owner?.id,
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
            displayFieldProps.contact_owner_id && {
            ...displayFieldProps.contact_owner_id,
          })}
          menuPosition="absolute"
          menuPlacement="bottom"
          getOnChange={setSelectedValueRefForEnterSave}
        />
      ),
      name: (
        <FormField<AddContactFormFieldsType>
          required
          type="text"
          name="name"
          {...(!inlineEditing && { label: 'Name' })}
          labelClass="if__label__blue"
          placeholder="Enter Name"
          autoComplete="off"
          register={register}
          error={errors?.name}
          fieldLimit={50}
        />
      ),
      birth_date: (
        <FormField<AddContactFormFieldsType>
          type="date"
          name="birth_date"
          showYearDropdown
          showMonthDropdown
          {...(!inlineEditing && { label: 'Date Of Birth' })}
          labelClass="if__label__blue"
          placeholder="MM-DD-YYYY"
          register={register}
          control={control}
          maxDate={new Date()}
          error={errors.birth_date}
          isClearable
          autoFocus
          getOnChangeDateValue={(elm) => elm?.focus()}
        />
      ),
      job_role: (
        <FormField<AddContactFormFieldsType>
          wrapperClass="mb-0"
          {...(!inlineEditing && { label: 'Job Role' })}
          id="job_role"
          placeholder="Select Job Role"
          type="CreatableAsyncSelectFormFieldForSearch"
          menuPosition="absolute"
          menuPlacement="bottom"
          name="job_role"
          register={register}
          inputMaxLength={50}
          control={control}
          error={errors.job_role}
          isClearable
          serveSideSearch
          getOptions={getJobRoleOption}
          labelClass="if__label__blue"
          defaultOptions={
            contactData?.job_role
              ? [
                {
                  label: contactData?.job_role,
                  value: contactData?.job_role,
                  selected: true,
                },
              ]
              : []
          }
          {...(!inlineEditing && { label: 'Job Role' })}
          {...(displayFieldProps &&
            displayFieldProps.job_role && {
            ...displayFieldProps.job_role,
          })}
          getOnChange={setSelectedValueRefForEnterSave}
          limit={OPTION_LISTING_DATA_LIMIT}
        />
      ),
      emails: (
        <div className="repeater__email__box w-full relative">
          <label className="if__label if__label__blue pl-[10px] pr-[80px]">
            Email
          </label>
          {(emailFields || [])?.map((field, index) => {
            return (
              field.is_primary && (
                <div
                  key={field.id}
                  className="w-full flex flex-wrap items-end sm:relative sm:pb-[0px]"
                >
                  <div ref={emailRef} className="w-full">
                    <FormField<AddContactFormFieldsType>
                      wrapperClass="mb-0"
                      name={`emails.${index}.value`}
                      autoComplete="new-password"
                      type="text"
                      className={`ip__input `}
                      placeholder="Enter Your Email Address"
                      register={register}
                      fieldLimit={60}
                      error={
                        errors?.emails &&
                        errors?.emails[index] &&
                        errors?.emails[index]?.value
                      }
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
      ),
      phones: (
        <>
          <div className="repeater__phone__box w-full relative">
            <label className="if__label if__label__blue w-full px-[10px]">
              Phone <span className="required__sign">*</span>
            </label>
            {(phoneFields || [])?.map((field, index) => {
              return (
                field.is_primary && (
                  <div className="w-full" key={field.id}>
                    <div
                      className={`w-full flex flex-wrap items-start mb-[0px] relative ${errors?.phones &&
                        errors?.phones[index] &&
                        errors?.phones[index]?.phoneType
                        ? ''
                        : 'sm:pb-[0px]'
                        }`}
                    >
                      <div className="ip__Select w-[100px] mr-[10px]">
                        <FormField<AddContactFormFieldsType>
                          wrapperClass="mb-0"
                          id={`phone.${index}.phoneType`}
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
      ),
      reporting_to: (
        <FormField<AddContactFormFieldsType>
          id="reporting_to"
          placeholder="Select Reporting To"
          type="asyncSelect"
          menuPosition="absolute"
          menuPlacement="bottom"
          isClearable
          serveSideSearch
          name="reporting_to"
          {...(!inlineEditing && { label: 'Reporting To' })}
          labelClass="if__label__blue"
          control={control}
          error={errors?.reporting_to}
          getOptions={getAccountContactOptions}
          isLoading={isAccountContactsLoading}
          defaultOptions={
            contactData?.reporting_to_contact?.id
              ? [
                {
                  label: `${contactData?.reporting_to_contact.name}`,
                  value: `${contactData?.reporting_to_contact.id}`,
                  selected: true,
                },
              ]
              : []
          }
          OptionComponent={ContactWithJobRoleOptions}
          {...(displayFieldProps &&
            displayFieldProps.reporting_to && {
            ...displayFieldProps.reporting_to,
          })}
          getOnChange={setSelectedValueRefForEnterSave}
        />
      ),
      department: (
        <FormField<AddContactFormFieldsType>
          type="text"
          name="department"
          {...(!inlineEditing && { label: 'Department' })}
          labelClass="if__label__blue"
          placeholder="Enter Department"
          register={register}
          error={errors?.department}
          fieldLimit={50}
        />
      ),
      twitter: (
        <FormField<AddContactFormFieldsType>
          type="text"
          name="twitter"
          {...(!inlineEditing && { label: 'Twitter' })}
          labelClass="if__label__blue"
          placeholder="Enter Your Twitter Profile Link"
          register={register}
          error={errors?.twitter}
        />
      ),
      timezone: (
        <FormField<AddContactFormFieldsType>
          id="timezone"
          placeholder="Select TimeZone"
          key={defaultTimezone?.value}
          type="asyncSelect"
          menuPosition="absolute"
          menuPlacement="bottom"
          name="timezone"
          {...(!inlineEditing && { label: 'TimeZone' })}
          labelClass="if__label__blue"
          control={control}
          error={errors?.timezone}
          isLoading={isTimeZoneListLoading}
          defaultOptions={
            contactData?.timezone
              ? [
                {
                  label: contactData?.timezone,
                  value: contactData?.timezone,
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
        <div ref={descRef}>
          <FormField<AddContactFormFieldsType>
            type="textarea"
            name="description"
            {...(!inlineEditing && { label: 'Description' })}
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

export default useContactInlineFormObject;
