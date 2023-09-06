// ** external packages **
import { Fragment, useState, useEffect } from 'react';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayInsert,
  UseFieldArrayRemove,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** components **
import Address from 'components/Address';
import DuplicateFieldWarningModal from 'components/Modal/DuplicateFieldWarningModal/DuplicateFieldWarningModal';

// ** Hook **
import useAccountFormObject from '../hooks/useAccountFormObject';

// ** Types **
import {
  FormFieldProps,
  Option,
} from 'components/FormField/types/formField.types';
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import {
  AccountFieldType,
  AccountResponseType,
  AddAccountFormFieldsType,
} from 'pages/Account/types/account.types';
import KeepEmailTimelineModal from 'components/Modal/KeepEmailTimelineModal/KeepEmailTimelineModal';
import { KeepEmailTimelineModalType } from 'components/Modal/KeepEmailTimelineModal/types/index.types';
import { KeepTimelineEmails } from 'pages/Deal/types/deals.types';
import { isInt } from 'utils/util';

interface AccountFormProps {
  control: Control<AddAccountFormFieldsType>;
  errors: FieldErrors<AddAccountFormFieldsType>;
  register: UseFormRegister<AddAccountFormFieldsType>;
  account_owner?: {
    id: number | null;
    first_name: string;
    last_name: string;
  };
  parent_account?: {
    id: number | null;
    name: string;
  } | null;
  sub_account?: {
    id: number | null;
    name: string;
  } | null;
  accountId?: number | null;
  displayField?: AccountFieldType;
  displayFieldProps?: {
    [key in keyof AddAccountFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddAccountFormFieldsType>]?: any;
    };
  };
  setValue: UseFormSetValue<AddAccountFormFieldsType>;
  editFormFlag?: boolean;
  watch: UseFormWatch<AddAccountFormFieldsType>;
  phoneFields: FieldArrayWithId<AddAccountFormFieldsType, 'phones', 'id'>[];
  removePhone: UseFieldArrayRemove;
  insertPhone: UseFieldArrayInsert<AddAccountFormFieldsType, 'phones'>;
  emailFields: FieldArrayWithId<AddAccountFormFieldsType, 'emails', 'id'>[];
  insertEmail: UseFieldArrayInsert<AddAccountFormFieldsType, 'emails'>;
  removeEmail: UseFieldArrayRemove;
  setError: UseFormSetError<AddAccountFormFieldsType>;
  clearErrors: UseFormClearErrors<AddAccountFormFieldsType>;
  relatedContactsFields: FieldArrayWithId<
    AddAccountFormFieldsType,
    'related_contacts',
    'id'
  >[];
  appendRelatedContacts: UseFieldArrayAppend<
    AddAccountFormFieldsType,
    'related_contacts'
  >;
  removeRelatedContacts: UseFieldArrayRemove;
  accountData?: AccountResponseType;
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  setDisableKeyDownEvent?: React.Dispatch<React.SetStateAction<boolean>>;
  setTimezoneLoading: React.Dispatch<React.SetStateAction<boolean>>;
  timezoneLoading: boolean;
  setTimelineEmails?: React.Dispatch<
    React.SetStateAction<KeepTimelineEmails[]>
  >;
  keepTimelineEmails?: KeepTimelineEmails[];
  profileImg?: string | File;
  onFileSelect?: React.ChangeEventHandler<HTMLInputElement>;
  setProfileImg?: React.Dispatch<React.SetStateAction<string | File>>;
}
const AccountForm = (formProps: AccountFormProps) => {
  const {
    control,
    errors,
    register,
    account_owner,
    parent_account,
    displayField,
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
    setSubmit,
    clearErrors,
    accountId,
    accountData,
    setDisableKeyDownEvent,
    timezoneLoading,
    setTimezoneLoading,
    setTimelineEmails,
    keepTimelineEmails,
    profileImg,
    setProfileImg,
    onFileSelect,
  } = formProps;

  const emails = watch('emails');
  const relatedContacts = watch('related_contacts');

  const [duplicateMailModal, setDuplicateMailModal] =
    useState<DuplicateFieldModalType>({
      isOpen: false,
      data: null,
    });

  const [defaultTimezone, setDefaultTimezone] = useState<Option>({
    label: accountData?.account?.timezone || 'America/New_York',
    value: accountData?.account?.timezone || 'America/New_York',
  });
  const [emailTimelineModal, setEmailTimelineModal] =
    useState<KeepEmailTimelineModalType>({ isOpen: false, data: [] });
  const [addressOptions, setAddressOptions] = useState<{
    state: Option;
    country: Option;
  }>({
    country: {
      label: 'United States',
      value: 233,
    },
    state: {
      label: 'FL',
      value: 1436,
    },
  });

  const { formObject } = useAccountFormObject({
    control,
    errors,
    register,
    account_owner,
    parent_account,
    displayField,
    displayFieldProps,
    editFormFlag,
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
    accountData,
    setSubmit,
    setDuplicateMailModal,
    defaultTimezone,
    timezoneLoading,
    setEmailTimelineModal,
    profileImg,
    setProfileImg,
    onFileSelect,
  });

  useEffect(() => {
    setDisableKeyDownEvent?.(duplicateMailModal.isOpen);
  }, [duplicateMailModal]);

  useEffect(() => {
    if (accountData?.account?.id) {
      const state_code = isInt(Number(accountData?.account?.state?.state_code))
        ? `${accountData?.account?.country?.iso2 || ''}-${
            accountData?.account?.state?.state_code
          }`
        : accountData?.account?.state?.state_code || '';

      setAddressOptions({
        country: {
          label: accountData?.account?.country?.name || '',
          value: accountData?.account?.country?.id || '',
        },
        state: {
          label: state_code,
          value: accountData?.account?.state?.id || '',
        },
      });

      if (accountData?.account?.account_image && setProfileImg) {
        setProfileImg(accountData?.account?.account_image);
      }
    }
  }, [accountData]);

  const renderFieldArray = (value: keyof typeof formObject) => {
    const tempDisplay = displayField?.[value] || [];
    const temp = formObject[value];

    return Object.keys(temp).filter(
      (el) =>
        !displayField?.[value] || tempDisplay.includes(el as keyof typeof temp)
    );
  };

  const renderField = (value: keyof typeof formObject) => {
    const temp = formObject[value];
    return (
      <>
        {renderFieldArray(value).map((el) => {
          if (el as keyof typeof temp) {
            return (
              <Fragment key={el}>{temp[el as keyof typeof temp]} </Fragment>
            );
          }
          return <></>;
        })}
      </>
    );
  };

  const onCloseWarningModal = () => {
    setDuplicateMailModal({ isOpen: false, data: null });
    if (duplicateMailModal?.data?.field === 'name') {
      setValue('name', '');
    }
    if (duplicateMailModal?.data?.field === 'email' && setValue) {
      const filteredMail = (emails || [])?.map((mail) => ({
        ...mail,
        value: mail.value === duplicateMailModal?.data?.value ? '' : mail.value,
      }));
      setValue(
        'emails',
        filteredMail?.length ? filteredMail : [{ value: '', isPrimary: true }]
      );
    }
    if (duplicateMailModal?.data?.field === 'relatedContact' && setValue) {
      const filteredContacts = (relatedContacts || [])?.map((contact) => {
        const { selectedOption } = contact;
        return {
          ...contact,
          selectedOption: { ...selectedOption },
          value:
            contact.value === duplicateMailModal?.data?.value
              ? 0
              : contact.value,
        };
      });
      setValue(
        'related_contacts',
        filteredContacts?.length
          ? filteredContacts
          : [{ job_role: '', value: 0, is_primary: true, isCreatable: true }]
      );
    }
  };

  return (
    <>
      {renderFieldArray('information').length ? (
        <div className="">
          <h3 className="setting__FieldTitle">Information</h3>
          <div className="mx-[-10px] flex flex-wrap">
            {renderField('information')}
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="mt-[15px] sm:mt-[7px]">
        <h3 className="setting__FieldTitle">Address</h3>
        <Address
          setAccountValue={setValue}
          setDefaultTimezone={setDefaultTimezone}
          setTimezoneLoading={setTimezoneLoading}
          setAddressOptions={setAddressOptions}
          addressOptions={addressOptions}
        />
      </div>

      {renderFieldArray('descriptionInfo').length ? (
        <div className="mt-[15px] sm:mt-[7px]">
          <h3 className="setting__FieldTitle">Description </h3>
          <div className="mx-[-10px] flex flex-wrap">
            {renderField('descriptionInfo')}
          </div>
        </div>
      ) : (
        <></>
      )}
      {emailTimelineModal && emailTimelineModal.isOpen ? (
        <KeepEmailTimelineModal
          isOpen
          data={emailTimelineModal.data}
          closeModal={() => {
            if (emailTimelineModal.data) {
              const data = keepTimelineEmails?.find(
                (k) =>
                  k.key === emailTimelineModal.data.key &&
                  k.data === emailTimelineModal.data.value
              );
              if (!data && setTimelineEmails && keepTimelineEmails) {
                const keepD = {
                  ...emailTimelineModal.data,
                  keep: false,
                };
                keepTimelineEmails.push(keepD);
                setTimelineEmails([...keepTimelineEmails]);
              }
              setEmailTimelineModal({ isOpen: false, data: null });
            }
          }}
          keepTimeline={() => {
            if (emailTimelineModal.data) {
              const data = keepTimelineEmails?.find(
                (k) =>
                  k.key === emailTimelineModal.data.key &&
                  k.data === emailTimelineModal.data.value
              );
              if (!data && setTimelineEmails && keepTimelineEmails) {
                const keepD = {
                  ...emailTimelineModal.data,
                  keep: true,
                };
                keepTimelineEmails.push(keepD);
                setTimelineEmails([...keepTimelineEmails]);
              }
              setEmailTimelineModal({ isOpen: false, data: null });
            }
          }}
        />
      ) : (
        <></>
      )}
      {duplicateMailModal.isOpen && (
        <DuplicateFieldWarningModal
          isOpen
          data={duplicateMailModal.data}
          closeModal={() => onCloseWarningModal()}
        />
      )}
    </>
  );
};

export default AccountForm;
