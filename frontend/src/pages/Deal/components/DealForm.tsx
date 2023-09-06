// ** Import Packages **
import { Fragment, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

// ** Components **
import DuplicateFieldWarningModal from 'components/Modal/DuplicateFieldWarningModal/DuplicateFieldWarningModal';
import KeepEmailTimelineModal from 'components/Modal/KeepEmailTimelineModal/KeepEmailTimelineModal';

// ** Hook **
import useDealFormObject from '../hooks/useDealFormObject';

// ** Types **
import { FormFieldProps } from 'components/FormField/types/formField.types';
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import { KeepEmailTimelineModalType } from 'components/Modal/KeepEmailTimelineModal/types/index.types';
import {
  AddDealFormFieldsType,
  DealDetailsType,
  DealFieldType,
  KeepTimelineEmails,
} from '../types/deals.types';

interface DealFormProps {
  editFormFlag?: boolean;
  displayField?: DealFieldType;
  displayFieldProps?: {
    [key in keyof AddDealFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddDealFormFieldsType>]?: any;
    };
  };
  dealDetail?: DealDetailsType;
  setStageLostIds?: React.Dispatch<React.SetStateAction<number[]>>;
  setTimelineEmails?: React.Dispatch<
    React.SetStateAction<KeepTimelineEmails[]>
  >;
  keepTimelineEmails?: KeepTimelineEmails[];
}

const DealForm = (formProps: DealFormProps) => {
  const {
    displayField,
    displayFieldProps,
    editFormFlag = false,
    dealDetail,
    setStageLostIds,
    setTimelineEmails,
    keepTimelineEmails,
  } = formProps;

  const [duplicateMailModal, setDuplicateMailModal] =
    useState<DuplicateFieldModalType>({
      isOpen: false,
      data: null,
    });
  const {
    control,
    getValues,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AddDealFormFieldsType>();
  const relatedContacts = watch('contacts');

  const {
    fields: contactsFields,
    append: appendContacts,
    remove: removeContacts,
  } = useFieldArray({
    name: 'contacts',
    control,
  });
  const [emailTimelineModal, setEmailTimelineModal] =
    useState<KeepEmailTimelineModalType>({ isOpen: false, data: [] });

  const { formObject } = useDealFormObject({
    contactsFields,
    appendContacts,
    control,
    errors,
    getValues,
    register,
    removeContacts,
    setValue,
    watch,
    dealDetail,
    displayField,
    displayFieldProps,
    editFormFlag,
    setStageLostIds,
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
          <h3 className="setting__FieldTitle">Information</h3>
          <div className="mx-[-10px] flex flex-wrap">
            {renderField('information')}
          </div>
        </div>
      ) : (
        <></>
      )}
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
                  k.data === emailTimelineModal.data.value &&
                  k.keep === false
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
                  k.data === emailTimelineModal.data.value &&
                  k.keep === true
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

export default DealForm;
