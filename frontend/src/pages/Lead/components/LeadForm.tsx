// ** external packages **
import { Fragment, useState } from 'react';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** Component **
import DuplicateFieldWarningModal from 'components/Modal/DuplicateFieldWarningModal/DuplicateFieldWarningModal';
import KeepEmailTimelineModal from 'components/Modal/KeepEmailTimelineModal/KeepEmailTimelineModal';

// ** Hook **
import useLeadFormObject from '../hooks/useLeadFormObject';

// ** Types **
import { FormFieldProps } from 'components/FormField/types/formField.types';
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import { KeepEmailTimelineModalType } from 'components/Modal/KeepEmailTimelineModal/types/index.types';
import { KeepTimelineEmails } from 'pages/Deal/types/deals.types';
import {
  AddLeadFormFieldsType,
  LeadDetailsType,
  LeadSectionType,
} from '../types/lead.type';

interface LeadFormProps {
  control: Control<AddLeadFormFieldsType>;
  errors: FieldErrors<AddLeadFormFieldsType>;
  register: UseFormRegister<AddLeadFormFieldsType>;
  watch: UseFormWatch<AddLeadFormFieldsType>;
  setValue: UseFormSetValue<AddLeadFormFieldsType>;
  displayField?: LeadSectionType;
  displayFieldProps?: {
    [key in keyof AddLeadFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddLeadFormFieldsType>]?: any;
    };
  };
  editFormFlag?: boolean;
  leadDetail?: LeadDetailsType;
  setTimelineEmails?: React.Dispatch<
    React.SetStateAction<KeepTimelineEmails[]>
  >;
  keepTimelineEmails?: KeepTimelineEmails[];
}

const LeadForm = (formProps: LeadFormProps) => {
  const {
    control,
    errors,
    register,
    setValue,
    watch,
    displayField,
    displayFieldProps,
    editFormFlag = false,
    leadDetail,
    setTimelineEmails,
    keepTimelineEmails,
  } = formProps;
  const relatedContacts = watch('contacts');

  const [duplicateMailModal, setDuplicateMailModal] =
    useState<DuplicateFieldModalType>({
      isOpen: false,
      data: null,
    });
  const [emailTimelineModal, setEmailTimelineModal] =
    useState<KeepEmailTimelineModalType>({ isOpen: false, data: [] });

  const { formObject } = useLeadFormObject({
    leadDetail,
    control,
    errors,
    register,
    setValue,
    watch,
    displayField,
    displayFieldProps,
    editFormFlag,
    setEmailTimelineModal,
    setDuplicateMailModal,
  });

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

    if (duplicateMailModal?.data?.field === 'relatedContact' && setValue) {
      const filteredContacts = (relatedContacts || [])?.map((contact) => ({
        ...contact,
        contact_id:
          contact.contact_id === duplicateMailModal?.data?.value
            ? ''
            : contact.contact_id,
      }));
      setValue('contacts', filteredContacts);
    }
  };

  return (
    <>
      {renderFieldArray('information').length ? (
        <div className="">
          <div className="mx-[-10px] flex flex-wrap">
            {renderField('information')}
          </div>
        </div>
      ) : null}
      {renderFieldArray('descriptionInfo').length ? (
        <div className="mt-[15px] sm:mt-[7px]">
          <h3 className="setting__FieldTitle">Description</h3>
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
                setTimelineEmails(keepTimelineEmails);
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
                setTimelineEmails(keepTimelineEmails);
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

export default LeadForm;
