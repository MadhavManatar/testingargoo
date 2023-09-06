// ** Import Packages **
import { Fragment, useState, useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

// ** Components **
import Address from 'components/Address';
import DuplicateFieldWarningModal from 'components/Modal/DuplicateFieldWarningModal/DuplicateFieldWarningModal';
import EmailDeleteModal from './EmailDeleteModal';

// ** Types **
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import { ContactFormProps } from 'pages/Contact/types/contacts.types';
import { Option } from 'components/FormField/types/formField.types';

//  ** Constants **
import useContactFormObject from '../hooks/useContactFormObject';
import { isInt } from 'utils/util';
import { ModuleNames } from 'constant/permissions.constant';

const ContactForm = (formProps: ContactFormProps) => {
  const {
    control,
    errors,
    register,
    watch,
    setValue,
    setDisableKeyDownEvent,
    contactData,
    displayField,
    displayFieldProps,
    editFormFlag = false,
    setOpenEmailModal,
    openEmailModal,
    updateContact,
    timezoneLoading,
    setTimezoneLoading,
    profileImg,
    setProfileImg,
    onFileSelect,
    isDuplicateAccount,
    setIsDuplicateAccount,
  } = formProps;

  const [duplicateMailModal, setDuplicateMailModal] =
    useState<DuplicateFieldModalType>({
      isOpen: false,
      data: null,
    });
  const [defaultTimezone, setDefaultTimezone] = useState<Option>({
    label: contactData?.timezone || 'America/New_York',
    value: contactData?.timezone || 'America/New_York',
  });
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

  const {
    fields: emailsField,
    insert: emailsInsert,
    remove: emailsRemove,
  } = useFieldArray({ name: 'emails', control });

  const { formObject } = useContactFormObject({
    control,
    errors,
    register,
    setValue,
    watch,
    contactData,
    displayField,
    displayFieldProps,
    editFormFlag,
    setOpenEmailModal,
    emailsField,
    emailsInsert,
    emailsRemove,
    setDuplicateMailModal,
    defaultTimezone,
    timezoneLoading,
    profileImg,
    setProfileImg,
    onFileSelect,
    isDuplicateAccount,
    setIsDuplicateAccount,
  });
  const emails = watch('emails');
  const relatedContacts = watch('related_contacts');

  const data = {
    value: isDuplicateAccount?.data?.value || '',
    moduleName: ModuleNames.ACCOUNT,
    recordName: '',
    field: 'account',
  };
  useEffect(() => {
    setDisableKeyDownEvent?.(duplicateMailModal.isOpen);
  }, [duplicateMailModal]);

  useEffect(() => {
    if (contactData?.id) {
      const state_code = isInt(Number(contactData?.state?.state_code))
        ? `${contactData?.country?.iso2 || ''}-${
            contactData?.state?.state_code
          }`
        : contactData?.state?.state_code || '';

      setAddressOptions({
        country: {
          label: contactData?.country?.name || '',
          value: contactData?.country?.id || '',
        },
        state: {
          label: state_code,
          value: contactData?.state?.id || '',
        },
      });

      if (contactData?.contact_image && setProfileImg) {
        setProfileImg(contactData?.contact_image);
      }
    }
  }, [contactData]);

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
        {renderFieldArray(value).map((el, index) => {
          if (el as keyof typeof temp) {
            return (
              <Fragment key={index}>{temp[el as keyof typeof temp]} </Fragment>
            );
          }
          return <></>;
        })}
      </>
    );
  };

  const onCloseWarningModal = () => {
    setDuplicateMailModal({ isOpen: false, data: null });
    if (duplicateMailModal?.data?.field === 'name' && setValue) {
      setValue('name', '');
    }

    if (duplicateMailModal?.data?.field === 'email' && setValue) {
      const filteredMail = (emails || [])?.map((mail) => ({
        ...mail,
        value: mail.value === duplicateMailModal?.data?.value ? '' : mail.value,
      }));
      setValue(
        'emails',
        filteredMail?.length ? filteredMail : [{ value: '', is_primary: true }]
      );
    }
    if (duplicateMailModal?.data?.field === 'relatedContact' && setValue) {
      const filteredContacts = (relatedContacts || [])?.map((contact) => ({
        ...contact,
        contact_id:
          contact.contact_id === duplicateMailModal?.data?.value
            ? ''
            : contact.contact_id,
      }));
      setValue(
        'related_contacts',
        filteredContacts?.length
          ? filteredContacts
          : [{ contact_id: '', job_role: '' }]
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

      {/* address component */}
      <div className="mt-[15px] sm:mt-[7px]">
        <h3 className="setting__FieldTitle">Address</h3>

        <Address
          setContactValue={setValue}
          setDefaultTimezone={setDefaultTimezone}
          setTimezoneLoading={setTimezoneLoading}
          setAddressOptions={setAddressOptions}
          addressOptions={addressOptions}
        />
      </div>

      {renderFieldArray('descriptionInfo').length ? (
        <div className="mt-[15px] sm:mt-[7px]">
          <h3 className="setting__FieldTitle">Description</h3>
          <div className="mx-[-10px] flex flex-wrap">
            {renderField('descriptionInfo')}
          </div>
        </div>
      ) : null}

      {openEmailModal?.isOpen ? (
        <EmailDeleteModal
          closeModal={() => {
            setOpenEmailModal?.({
              email_val: '',
              isOpen: false,
            });

            if (openEmailModal.indexVal === 0) {
              setValue?.('emails', [
                {
                  is_primary: true,
                  is_from_edit: true,
                  value: openEmailModal.email_val,
                },
              ]);
            }
          }}
          isLoading={false}
          isOpen={openEmailModal.isOpen}
          onDelete={() => {
            if (openEmailModal?.contactValues) {
              updateContact?.(openEmailModal?.contactValues);
            }
            emailsRemove(openEmailModal.indexVal);
            setOpenEmailModal?.({
              email_val: '',
              isOpen: false,
            });
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
      {isDuplicateAccount?.isOpen && (
        <DuplicateFieldWarningModal
          data={data}
          isOpen
          closeModal={() =>
            setIsDuplicateAccount?.({ isOpen: false, data: null })
          }
        />
      )}
    </>
  );
};

export default ContactForm;
