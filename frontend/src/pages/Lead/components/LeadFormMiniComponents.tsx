// ** Import Packages **
import { useFormContext, useWatch } from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import ContactWithJobRoleOptions from 'pages/Contact/components/ContactWithJobRoleOption';
import SingleValueComponent from 'pages/Contact/components/SingleValueComponent';

// ** Types **
import { Option } from 'components/FormField/types/formField.types';
import { ContactBasicForRelated } from 'pages/Contact/types/contacts.types';
import {
  AddLeadFormFieldsType,
  RelatedContactFormFieldChildPropsType,
} from '../types/lead.type';

// ** Hooks **
import { useGetAccountsRelatedContact } from 'pages/Account/hooks/useAccountService';
import { useGetAccountContactOptionsForSearchInLeadDeal } from 'pages/Contact/hooks/useContactService';

// ** Others **
import { isSingleValue } from 'components/FormField/helper';
import { useSelector } from 'react-redux';
import { getQuickPopup } from 'redux/slices/quickPopupDefaultSlice';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

const RelatedContactFormFieldChild = (
  props: RelatedContactFormFieldChildPropsType
) => {
  const {
    index,
    field,
    displayFieldProps,
    removeContacts,
    related_contacts,
    watchAccount,
    setSelectedContactOptions,
    selectedContactOptions,
    setContactRelatedAccounts,
    setAccountKey,
    isDisabled,
    isCreatablePermission,
    setEmailTimelineModal,
    checkFieldOnBlur,
  } = props;
  const contact = `contacts.${index}.contact_id`;
  const jobRole = `contacts.${index}.job_role`;

  const methods = useFormContext<AddLeadFormFieldsType>();
  const {
    setValue,
    register,
    control,
    clearErrors,
    formState: { errors },
  } = methods;

  const useWatchData = useWatch({
    control,
  });
  // ** States **

  const watchLeadContact = useWatchData.contacts || [];

  const leadContactOptions: Option[] = related_contacts
    ? (related_contacts || []).map((val) => {
        return {
          label: val?.contact?.name || '',
          value: val?.contact?.id || 0,
          job_role: val?.contact?.job_role,
          selected: true,
        } as Option;
      })
    : [];

  const defaultOption = leadContactOptions?.find((obj) => {
    return field.contact_id === obj.value;
  });

  const contactOption =
    defaultOption?.value === watchLeadContact?.[index]?.contact_id
      ? defaultOption
      : undefined;

  const currentSelectedOption = selectedContactOptions?.[
    `${watchLeadContact?.[index]?.contact_id}`
  ]
    ? selectedContactOptions[`${watchLeadContact[index]?.contact_id}`]
    : contactOption;

  const notSearchContactArray = watchLeadContact
    .filter((obj) => obj?.contact_id && typeof obj?.contact_id === 'number')
    .map((item) => item?.contact_id);

  // Custom Hooks
  const { getAccountContactOptions, isAccountContactsLoading } =
    useGetAccountContactOptionsForSearchInLeadDeal({
      watchAccount,
      notSearchContactArray,
      emailWithLabel: true,
    });
  const selectorQuick = useSelector(getQuickPopup);

  const { getGetAccountsRelatedContact, isAccountsRelatedToContactLoading } =
    useGetAccountsRelatedContact({
      setValue,
      setContactRelatedAccounts,
      setAccountKey,
      watchAccount,
    });

  const setNoOptionMessage = () => {
    if (typeof isCreatablePermission === 'boolean' && !isCreatablePermission) {
      return "You Don't Have Permission For Create Contact";
    }
    return 'Please Search or Create Contact';
  };

  return (
    <div className={`w-full ${isDisabled ? 'ip__disabled' : ''}`}>
      <div className="w-full flex flex-wrap items-start px-[10px] mb-[20px] relative sm:mb-0 sm:pb-[10px]">
        <div className="w-[calc(50%_-_10px)] mr-[20px] sm:w-[calc(50%_-_41px)] sm:mr-[10px]">
          <FormField<AddLeadFormFieldsType>
            wrapperClass="mb-0"
            // key={`${index}-${leadContactOptions?.length}`}
            id={contact}
            placeholder="Select Contact"
            type="CreatableAsyncSelectFormFieldForSearch"
            name={contact}
            serveSideSearch
            {...(isCreatablePermission
              ? { inputMaxLength: 50 }
              : {
                  isValidNewOption: () => false,
                  noOptionsMessage: () => setNoOptionMessage(),
                })}
            getOnChange={(e) => {
              // here if user manually add job role then not add contact job role
              if (isSingleValue(e) && e?.value) {
                if (e && typeof e?.value === 'string' && checkFieldOnBlur) {
                  checkFieldOnBlur(e?.value, 'relatedContact');
                }
                if (typeof e?.value === 'number') {
                  getGetAccountsRelatedContact(e?.value);
                }

                setValue(`contacts.${index}.contact_id`, e?.value);
                // here set the selected option because need to store if component rerender
                setSelectedContactOptions((prev) => ({
                  ...prev,
                  [`${e?.value}`]: e,
                }));
                // eslint-disable-next-line no-underscore-dangle
                if (e?.__isNew__) {
                  setValue(`contacts.${index}.isCreatable`, true);
                } else {
                  setValue(`contacts.${index}.isCreatable`, false);
                }
              }
              if (isSingleValue(e) && e?.job_role) {
                setValue(`contacts.${index}.job_role`, e?.job_role);
                clearErrors(`contacts.${index}.job_role`);
              }
              if (isSingleValue(e) && !e?.value) {
                setValue(`contacts.${index}.contact_id`, '');
                setValue(`contacts.${index}.job_role`, '');
              }
              if (!e && setEmailTimelineModal) {
                if (
                  related_contacts &&
                  related_contacts.length &&
                  related_contacts[index] &&
                  related_contacts[index].contact_id ===
                    watchLeadContact[index].contact_id
                ) {
                  setEmailTimelineModal({
                    isOpen: true,
                    data: {
                      key: 'related_contact',
                      data: related_contacts[index].contact_id,
                    },
                  });
                }
              }
            }}
            menuPosition="absolute"
            menuPlacement="auto"
            OptionComponent={ContactWithJobRoleOptions}
            getOptions={getAccountContactOptions}
            singleValueComponent={SingleValueComponent}
            isLoading={
              isAccountContactsLoading || isAccountsRelatedToContactLoading
            }
            control={control}
            isClearable
            error={
              errors?.contacts &&
              errors?.contacts[index] &&
              errors?.contacts[index]?.contact_id
            }
            defaultOptions={
              currentSelectedOption
                ? [currentSelectedOption]
                : selectorQuick.contact?.name && selectorQuick.contact?.id
                ? [
                    {
                      label: selectorQuick.contact?.name,
                      value: selectorQuick.contact?.id,
                    },
                  ]
                : []
            }
            {...(displayFieldProps &&
              displayFieldProps.contacts && {
                ...displayFieldProps.contacts,
              })}
            limit={OPTION_LISTING_DATA_LIMIT}
          />
        </div>
        <div className="w-[calc(50%_-_82px)] sm:w-[calc(50%_-_41px)]">
          <FormField<AddLeadFormFieldsType>
            wrapperClass="mb-0"
            type="text"
            name={jobRole}
            placeholder="Enter Job Role"
            register={register}
            fieldLimit={50}
            error={
              errors?.contacts &&
              errors?.contacts[index] &&
              errors?.contacts[index]?.job_role
            }
            {...(displayFieldProps &&
              displayFieldProps.lead_source && {
                ...displayFieldProps.lead_source,
              })}
          />
        </div>
        <div className="action__box w-[70px] flex flex-wrap items-center justify-start relative top-[8px] h-[30px] sm:w-[70px] sm:absolute sm:top-[7px] sm:right-[10px]">
          <div className="ip__Checkbox primary__field relative ml-[10px]">
            <input
              type="radio"
              className="ip__Radio"
              checked={field.is_primary}
              onChange={() => {
                setValue(
                  'contacts',
                  watchLeadContact.map((obj, cIndex) => ({
                    contact_id: obj.contact_id,
                    contact: obj.contact as ContactBasicForRelated,
                    job_role: obj.job_role,
                    isCreatable: obj.isCreatable,
                    is_primary: index === cIndex,
                  }))
                );
              }}
            />
            <label className="rc__Label">Primary</label>
          </div>
          <button
            className={`${
              field.is_primary ? 'pointer-events-none opacity-0' : null
            } delete__btn text-[0px] bg-primary__transparentBG rounded-full w-[30px] h-[30px] relative duration-500 flex items-center justify-center ml-[10px] p-[5px]`}
            type="button"
            onClick={() => {
              if (
                related_contacts &&
                related_contacts.length &&
                related_contacts[index] &&
                related_contacts[index].contact_id ===
                  watchLeadContact[index].contact_id &&
                setEmailTimelineModal
              ) {
                setEmailTimelineModal({
                  isOpen: true,
                  data: {
                    key: 'related_contact',
                    data: related_contacts[index].contact_id,
                  },
                });
              }
              removeContacts(index);
            }}
          >
            <Icon iconType="deleteFilled" fill="var(--ip__Red)" />
          </button>
          {errors?.contacts &&
            errors?.contacts[index] &&
            errors?.contacts[index]?.is_primary && (
              <p className="ip__Error">
                {errors?.contacts[index]?.is_primary?.message}
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default RelatedContactFormFieldChild;
