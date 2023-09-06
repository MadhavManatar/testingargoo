// ** Import Packages **
import { useEffect, useState } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import _ from 'lodash';

// ** Redux **
import store from 'redux/store';

// ** Components **
import FileUpload from 'components/FileUpload';
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import {
  RelatedAccountFormFieldChild,
  RelatedContactFormFieldChild,
} from '../components/ContactFormMiniComponents';
import ContactWithJobRoleOptions from '../components/ContactWithJobRoleOption';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Services **
import { useGetTimeZoneList } from 'components/Address/hooks/useAddressService';
import { useGetPhoneTypeOption } from 'pages/Setting/general-setting/common-controls/PhoneType/hooks/usePhoneTypeServices';
import { useGetJobRoleOption } from 'pages/Setting/module-setting/Contact/JobRole/hooks/useJobRoleServices';
import { useGetUserOrDescendantUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';
import { useGetAccountContactOptions } from '../hooks/useContactService';

// ** Types **
import { Option } from 'components/FormField/types/formField.types';
import {
  AddContactFormFieldsType,
  ContactFormObject,
  ContactFormProps,
} from 'pages/Contact/types/contacts.types';

//  ** Constants **
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { maskInputRegex } from 'constant/regex.constant';
// import { TIMEZONE_LIST } from 'constant/timeZoneList.constant';

// ** Util **
import { isValidEmail } from 'utils/util';
import { useLazyFieldIsExistsQuery } from 'redux/api/generalServiceApi';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

const useContactFormObject = (formProps: ContactFormProps) => {
  const {
    control,
    errors,
    register,
    watch,
    setValue,
    contactData,
    displayFieldProps,
    editFormFlag = false,
    inlineEditing = false,
    setOpenEmailModal,
    emailsField,
    emailsInsert,
    emailsRemove,
    setDuplicateMailModal,
    defaultTimezone,
    timezoneLoading,
    onFileSelect,
    profileImg,
    setProfileImg,
    setIsDuplicateAccount,
  } = formProps;

  // ** watch **
  const watchAccount = watch('related_accounts');
  const useWatchData = useWatch({
    control,
  });

  // ** hooks **
  const { auth } = store.getState();
  const { user } = auth;
  const { id } = useParams();
  const { fields, append, remove } = useFieldArray({
    name: 'related_contacts',
    control,
  });
  const {
    fields: accountFields,
    append: accountAppend,
    remove: accountRemove,
  } = useFieldArray({ name: 'related_accounts', control });

  const previousAccountsArray: any[] = [];
  const {
    fields: phonesField,
    insert: phonesInsert,
    remove: phonesRemove,
  } = useFieldArray({ name: 'phones', control });

  // ** states **
  const [selectedAccountOptions, setSelectedAccountOptions] = useState<{
    [key: string]: Option;
  }>({});

  const [selectedContactOptions, setSelectedContactOptions] = useState<{
    [key: string]: Option;
  }>({});

  // ** APIS **
  const { getPhoneTypeOption, isGetPhoneTypeLoading } = useGetPhoneTypeOption();

  // ** Custom Hooks *
  const { readAccountPermission } = usePermission();
  const { getJobRoleOption, isGetJobRoleLoading } = useGetJobRoleOption({
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
  const [fieldIsExistsAPI] = useLazyFieldIsExistsQuery();
  const { getAccountContactOptions, isAccountContactsLoading } =
    useGetAccountContactOptions({ contactId: contactData?.id });
  // ** custom hooks **
  const { getTimezoneList, isTimeZoneListLoading } = useGetTimeZoneList();

  // Here set related account value
  useEffect(() => {
    if (
      contactData?.related_accounts &&
      _.isArray(contactData?.related_accounts)
    ) {
      setSelectedAccountOptions(
        contactData.related_accounts.reduce(
          (prevValue, currentObj) => ({
            ...prevValue,
            [`${currentObj.account.id}`]: {
              label: currentObj.account.name,
              value: currentObj.account.id,
              job_role: currentObj.job_role,
            },
          }),
          {}
        )
      );
    }
  }, [contactData?.related_accounts]);

  const setNoOptionMessage = () => {
    if (readAccountPermission) {
      return 'Please Select Account First';
    }
    if (typeof watchAccount === 'string') {
      return 'Please Create Contact';
    }
    if (typeof watchAccount === 'number') {
      return 'Please Select Contact';
    }
    return 'No Options';
  };

  const checkFieldOnBlur = async (value: string, type: string) => {
    const contactId = contactData?.id || id;
    if (
      value &&
      (((type === 'name' || type === 'relatedContact') && value.trim()) ||
        (type === 'email' && isValidEmail(value)))
    ) {
      const data = await fieldIsExistsAPI({
        data: {
          [type]: value,
          ...(contactId && { contactId }),
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

  const formObject: ContactFormObject = {
    information: {
      contact_image: (
        <div className="px-[10px] w-full">
          <div className="upload__File mb-[20px]">
            {setProfileImg && (
              <FileUpload
                error={errors.contact_image}
                setFileObjectCb={setProfileImg}
                image={profileImg}
                onFileChange={onFileSelect}
                fileUploadText="Upload Image"
              />
            )}
          </div>
        </div>
      ),
      contact_owner_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddContactFormFieldsType>
            id="contact_owner_id"
            key={contactData?.contact_owner_id}
            placeholder="Select Owner"
            type="asyncSelect"
            menuPosition="absolute"
            menuPlacement="bottom"
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
          />
        </div>
      ),
      name: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddContactFormFieldsType>
            required
            type="text"
            name="name"
            {...(!inlineEditing && { label: 'Name' })}
            labelClass="if__label__blue"
            autoComplete="off"
            placeholder="Enter Name"
            register={register}
            onBlur={(e) => {
              if (e.target.value) {
                checkFieldOnBlur(e.target.value, 'name');
              }
            }}
            error={errors?.name}
            fieldLimit={50}
          />
        </div>
      ),
      birth_date: (
        <div className="px-[10px] w-1/2 sm:w-full">
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
          />
        </div>
      ),
      job_role: (
        <div className="px-[10px] w-1/2 sm:w-full sm:mb-[20px]">
          <FormField<AddContactFormFieldsType>
            wrapperClass="mb-0"
            id="job_role"
            inputMaxLength={50}
            placeholder="Select Job Role"
            type="CreatableAsyncSelectFormFieldForSearch"
            menuPosition="absolute"
            menuPlacement="bottom"
            name="job_role"
            register={register}
            control={control}
            error={errors.job_role}
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
            isClearable
            isLoading={isGetJobRoleLoading}
            serveSideSearch
            getOptions={getJobRoleOption}
            labelClass="if__label__blue"
            {...(!inlineEditing && { label: 'Job Role' })}
            limit={OPTION_LISTING_DATA_LIMIT}
          />
        </div>
      ),
      emails: (
        <div className="repeater__email__box w-full relative">
          <label className="if__label if__label__blue pl-[10px] pr-[80px]">
            Email
          </label>
          {emailsField?.map((field, index) => {
            return (
              <div
                key={field.id}
                className="w-full flex flex-wrap items-end px-[10px] mb-[20px] sm:relative sm:mb-[5px] sm:pb-[8px]"
              >
                <div className="w-[calc(100%_-_70px)] sm:w-[calc(100%_-_70px)]">
                  <FormField<AddContactFormFieldsType>
                    wrapperClass="mb-0"
                    name={`emails.${index}.value`}
                    autoComplete="new-password"
                    type="text"
                    className={`ip__input `}
                    onBlur={(e) => {
                      if (e.target.value) {
                        checkFieldOnBlur(e.target.value, 'email');
                      }
                    }}
                    placeholder="Enter Your Email Address"
                    register={register}
                    fieldLimit={60}
                  />
                </div>
                <div className="action__box w-[70px] flex flex-wrap items-center justify-end relative bottom-[6px] h-[30px] sm:absolute sm:top-[9px] sm:right-[10px]">
                  <div className="ip__Checkbox primary__field relative ml-[10px]">
                    <input
                      type="radio"
                      className="ip__Radio"
                      checked={field.is_primary}
                      onChange={() => {
                        if (setValue) {
                          setValue(
                            'emails',
                            (useWatchData.emails || []).map(
                              (emails, eIndex) => ({
                                value: emails.value,
                                is_primary: index === eIndex,
                              })
                            )
                          );
                        }
                      }}
                    />
                    <label className="rc__Label ">Primary</label>
                  </div>
                  <button
                    className={`${field.is_primary ? 'pointer-events-none opacity-0' : null
                      } delete__btn text-[0px] bg-primary__transparentBG rounded-full w-[30px] h-[30px] relative duration-500 flex items-center justify-center ml-[10px] p-[5px]`}
                    type="button"
                    onClick={() => {
                      if (field.is_from_edit) {
                        setOpenEmailModal?.({
                          email_val: field.value || '',
                          isOpen: true,
                          indexVal: index,
                        });
                      } else {
                        emailsRemove?.(index);
                      }
                    }}
                  >
                    <Icon iconType="deleteFilled" fill="var(--ip__Red)" />
                  </button>
                </div>
                {errors?.emails &&
                  errors?.emails[index] &&
                  errors?.emails[index]?.value &&
                  errors?.emails[index]?.value?.message && (
                    <p className="ip__Error">
                      {errors?.emails[index]?.value?.message}
                    </p>
                  )}
              </div>
            );
          })}
          <div className="w-full px-[10px] mt-[-6px] mb-[17px]">
            <button
              className="add__btn text-[14px] text-[#8A8A8A] font-biotif__Medium duration-500 hover:text-primaryColor"
              type="button"
              onClick={() => {
                emailsInsert?.((emailsField || []).length, {
                  value: '',
                  is_primary: false,
                });
              }}
              disabled={emailsField?.length ? emailsField.length >= 10 : false}
            >
              + Add Email
            </button>
          </div>
          <label className="inline-block font-biotif__Regular text-light__TextColor text-[14px] absolute top-0 right-[31px]">
            Primary
          </label>
        </div>
      ),
      phones: (
        <div className="repeater__phone__box w-full relative">
          <label className="if__label if__label__blue w-full px-[10px]">
            Phone
          </label>
          {phonesField?.map((field, index) => {
            return (
              <div
                className="w-full"
                key={field.id}
                id={`phone.${index}.phoneType`}
              >
                <div
                  className={`w-full flex flex-wrap items-start px-[10px] mb-[20px] relative sm:mb-[12px] ${errors?.phones &&
                    errors?.phones[index] &&
                    errors?.phones[index]?.phoneType
                    ? ''
                    : 'sm:pb-[0px]'
                    }`}
                >
                  <div className="ip__Select w-[180px] mr-[10px] sm:w-[100px]">
                    <FormField
                      wrapperClass="mb-0"
                      id={`phone.${index}.phoneType`}
                      placeholder="Select Phone Type"
                      type="asyncSelect"
                      menuPosition="absolute"
                      menuPlacement="bottom"
                      name={`phones.${index}.phoneType`}
                      autoComplete="new-password"
                      control={control}
                      error={
                        errors?.phones &&
                        errors?.phones[index] &&
                        errors?.phones[index]?.phoneType
                      }
                      isClearable
                      isLoading={isGetPhoneTypeLoading}
                      getOptions={getPhoneTypeOption}
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
                    />
                  </div>
                  <div className="w-[calc(100%_-_261px)] sm:w-[calc(100%_-_180px)]">
                    <FormField
                      wrapperClass="mb-0"
                      id={`phone.${index}.value`}
                      type="mask_input"
                      maskInputType="mask_input_phone"
                      name={`phones.${index}.value`}
                      placeholder="EX. (XXX) XXX-XXXX"
                      error={
                        errors?.phones &&
                        errors?.phones[index] &&
                        errors?.phones[index]?.value
                      }
                      control={control}
                      mask={maskInputRegex}
                      inputMode="numeric"
                    />
                  </div>
                  <div className="action__box w-[70px] flex flex-wrap items-center justify-end relative top-[8px] h-[30px] sm:absolute sm:top-[7px] sm:right-[10px]">
                    <div className="ip__Checkbox primary__field relative ml-[10px]">
                      <input
                        type="radio"
                        className="ip__Radio"
                        checked={field.is_primary}
                        onChange={() => {
                          if (setValue) {
                            setValue(
                              'phones',
                              (useWatchData.phones || []).map(
                                (phone, pIndex) => ({
                                  value: phone.value,
                                  phoneType: phone.phoneType,
                                  is_primary: index === pIndex,
                                })
                              )
                            );
                          }
                        }}
                      />
                      <label className="rc__Label">Primary</label>
                    </div>
                    <button
                      className={`${field.is_primary
                        ? 'pointer-events-none opacity-0'
                        : null
                        } delete__btn text-[0px] bg-primary__transparentBG rounded-full w-[30px] h-[30px] relative duration-500 flex items-center justify-center ml-[10px] p-[5px]`}
                      type="button"
                      onClick={() => phonesRemove(index)}
                    >
                      <Icon iconType="deleteFilled" fill="var(--ip__Red)" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="w-full px-[10px] mt-[-6px] mb-[17px]">
            <button
              className="add__btn text-[14px] text-[#8A8A8A] font-biotif__Medium duration-500 hover:text-primaryColor"
              type="button"
              onClick={() => {
                phonesInsert(phonesField.length, {
                  value: '',
                  phoneType: '',
                  is_primary: false,
                });
              }}
              disabled={phonesField?.length ? phonesField.length >= 10 : false}
            >
              + Add Phone
            </button>
          </div>
          <label className="inline-block font-biotif__Regular text-light__TextColor text-[14px] absolute top-0 right-[31px]">
            Primary
          </label>
        </div>
      ),
      related_contacts: (
        <div className="repeater__Rcontact__box withPrimary w-full relative">
          <label className="if__label if__label__blue w-full !mb-[10px] px-[10px]">
            Related Contacts
          </label>
          {fields.map((field, index) => {
            return (
              <RelatedContactFormFieldChild
                key={field.id}
                fields={fields}
                index={index}
                field={field}
                remove={remove}
                checkFieldOnBlur={checkFieldOnBlur}
                contactDetail={contactData}
                displayFieldProps={displayFieldProps}
                selectedContactOptions={selectedContactOptions}
                setSelectedContactOptions={setSelectedContactOptions}
              />
            );
          })}
          <div className="w-full px-[10px] mt-[-6px] mb-[17px]">
            <button
              className="add__btn text-[14px] text-[#8A8A8A] font-biotif__Medium duration-500 hover:text-primaryColor"
              type="button"
              onClick={() => {
                append({
                  job_role: '',
                  contact_id: '',
                });
              }}
              disabled={fields?.length ? fields.length >= 10 : false}
            >
              + Add Contact
            </button>
          </div>
        </div>
      ),
      related_accounts: (
        <div
          className={`repeater__Rcontact__box withPrimary w-full relative ${!readAccountPermission ? '!hidden' : ''
            }`}
        >
          <label className="if__label if__label__blue w-full !mb-[10px] px-[10px]">
            Related Accounts
          </label>
          {accountFields.map((field, index) => {
            return (
              <RelatedAccountFormFieldChild
                key={field.id}
                fields={accountFields}
                index={index}
                field={field}
                remove={accountRemove}
                contactDetail={contactData}
                displayFieldProps={displayFieldProps}
                selectedAccountOptions={selectedAccountOptions}
                setSelectedAccountOptions={setSelectedAccountOptions}
                previousOptions={previousAccountsArray}
                setIsDuplicateAccount={setIsDuplicateAccount}
              />
            );
          })}
          <div className="w-full px-[10px] mt-[-6px] mb-[17px]">
            <button
              className="add__btn text-[14px] text-[#8A8A8A] font-biotif__Medium duration-500 hover:text-primaryColor"
              type="button"
              onClick={() => {
                accountAppend({
                  job_role: '',
                  account_id: '',
                  is_primary: false,
                });
              }}
              disabled={
                accountFields?.length ? accountFields.length >= 10 : false
              }
            >
              + Add Account
            </button>
            <label className="inline-block font-biotif__Regular text-light__TextColor text-[14px] absolute top-0 right-[31px]">
              Primary
            </label>
          </div>
        </div>
      ),
      reporting_to: (
        <div className="w-1/2 px-[10px] sm:w-full">
          <FormField<AddContactFormFieldsType>
            id="reporting_to"
            key={contactData?.contact_owner_id}
            placeholder="Select Reporting To"
            type="asyncSelect"
            menuPosition="absolute"
            menuPlacement="bottom"
            serveSideSearch
            isClearable
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
            noOptionsMessage={() => setNoOptionMessage()}
            OptionComponent={ContactWithJobRoleOptions}
          />
        </div>
      ),
      department: (
        <div className="px-[10px] w-1/2 sm:w-full">
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
        </div>
      ),
      twitter: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddContactFormFieldsType>
            type="text"
            name="twitter"
            {...(!inlineEditing && { label: 'Twitter' })}
            labelClass="if__label__blue"
            placeholder="Enter Your Twitter Profile Link"
            register={register}
            error={errors?.twitter}
          />
        </div>
      ),
      timezone: (
        <div className="px-[10px] w-1/2 sm:w-full">
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
          <FormField<AddContactFormFieldsType>
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

export default useContactFormObject;
