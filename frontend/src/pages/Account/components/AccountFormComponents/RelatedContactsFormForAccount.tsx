// ** Import Packages **
import { useFormContext, useWatch } from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import ContactWithJobRoleOptions from 'pages/Contact/components/ContactWithJobRoleOption';
import SingleValueComponent from 'pages/Contact/components/SingleValueComponent';

// ** Hook **
import { useGetContactOptions } from 'pages/Contact/hooks/useContactService';

// ** Types **
import { isSingleValue } from 'components/FormField/helper';
import {
  AddAccountFormFieldsType,
  RelatedContactsAccountsType,
  RelatedContactsFormForAccountPropsType,
} from '../../types/account.types';
import { getQuickPopup } from 'redux/slices/quickPopupDefaultSlice';
import { useSelector } from 'react-redux';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

const RelatedContactsFormForAccount = (
  props: RelatedContactsFormForAccountPropsType
) => {
  const {
    displayFieldProps,
    removeRelatedContacts,
    field,
    index,
    account,
    isDisabled,
    isCreatablePermission,
    checkFieldOnBlur,
  } = props;

  const methods = useFormContext<AddAccountFormFieldsType>();
  const {
    setValue,
    register,
    control,
    formState: { errors },
    getValues,
    clearErrors,
  } = methods;

  // ** watch **
  const useWatchData = useWatch({
    control,
  });
  const selectorQuick = useSelector(getQuickPopup);

  const watchRelatedContact = useWatchData.related_contacts || [];

  const accountContactDefaultOpt = account?.AccountContacts?.map((val) => {
    return {
      label: val?.contact?.name || '',
      value: val?.contact?.id,
      selected: true,
    };
  });

  const quickDefault = selectorQuick?.contact?.id
    ? [
      {
        label: selectorQuick.contact?.name || '',
        value: selectorQuick?.contact?.id,
        selected: true,
      },
    ]
    : [];

  const notSearchContactArray = watchRelatedContact
    .filter((obj) => obj?.value && typeof obj?.value === 'number')
    .map((item) => item?.value);

  const { getContactOptions, isContactsOptionsLoading } = useGetContactOptions({
    notSearchContactArray,
    emailWithLabel: true,
  });

  const defaultOption = (
    (account?.AccountContacts || []).length
      ? accountContactDefaultOpt
      : quickDefault
  )?.find((obj) => field.value === obj.value);

  const setNoOptionMessage = () => {
    if (typeof isCreatablePermission === 'boolean' && !isCreatablePermission) {
      return "You Don't Have Permission For Create Contact";
    }
    return 'Please Search or Create Contact';
  };
  const primaryContactCount = account?.AccountContacts?.filter(
    (obj) => obj.is_primary
  ).length;
  if (
    primaryContactCount === 0 &&
    account?.AccountContacts &&
    account?.AccountContacts?.length > 0 &&
    field.value === account?.AccountContacts.length
  ) {
    field.is_primary = true;
  }

  return (
    <div className={`w-full ${isDisabled ? 'ip__disabled' : ''} `}>
      <div className="w-full flex flex-wrap items-start px-[10px] mb-[20px] relative sm:mb-0 sm:pb-[12px]">
        <div className="w-[calc(50%_-_82px)] mr-[20px] sm:w-[calc(50%_-_41px)] sm:mr-[10px]">
          <FormField<AddAccountFormFieldsType>
            id={`related_contacts.${index}.value`}
            wrapperClass="mb-0"
            isClearable
            key={field.id}
            placeholder="Search Or Enter"
            type="CreatableAsyncSelectFormFieldForSearch"
            name={`related_contacts.${index}.value`}
            {...(isCreatablePermission
              ? { inputMaxLength: 50 }
              : { isValidNewOption: () => false })}
            control={control}
            error={
              errors?.related_contacts &&
              errors?.related_contacts[index] &&
              errors?.related_contacts[index]?.value
            }
            getOnChange={(e) => {
              setValue(`related_contacts.${index}.selectedOption`, e);

              if (isSingleValue(e) && e?.value) {
                setValue(
                  `related_contacts.${index}.value`,
                  typeof e.value === 'number' ? e?.value : `${e?.value}`
                );
                if (typeof e?.value === 'string' && checkFieldOnBlur) {
                  checkFieldOnBlur(e?.value, 'relatedContact');
                }
                setValue(
                  `related_contacts.${index}.isCreatable`,
                  // eslint-disable-next-line no-underscore-dangle
                  !!e.__isNew__
                );
              }
              if (isSingleValue(e) && e?.extraLabel) {
                setValue(`related_contacts.${index}.job_role`, e?.extraLabel);
                clearErrors(`related_contacts.${index}.job_role`);
              } else {
                setValue(`related_contacts.${index}.job_role`, '');
              }
              if (isSingleValue(e) && !e?.value) {
                setValue(`related_contacts.${index}.value`, '');
                setValue(`related_contacts.${index}.job_role`, '');
              }
            }}
            OptionComponent={ContactWithJobRoleOptions}
            getOptions={getContactOptions}
            singleValueComponent={SingleValueComponent}
            noOptionsMessage={() => setNoOptionMessage()}
            defaultOptions={[
              watchRelatedContact?.[index]?.selectedOption ||
              defaultOption ||
              [],
            ]}
            {...(displayFieldProps &&
              displayFieldProps.related_contacts && {
              ...displayFieldProps.related_contacts,
            })}
            menuPosition="absolute"
            menuPlacement="auto"
            isLoading={isContactsOptionsLoading}
            limit={OPTION_LISTING_DATA_LIMIT}
          />
        </div>

        <div className="w-[calc(50%_-_10px)] sm:w-[calc(50%_-_41px)]">
          <FormField<AddAccountFormFieldsType>
            wrapperClass="mb-0"
            type="text"
            name={`related_contacts.${index}.job_role`}
            labelClass="if__label__blue"
            placeholder="Enter Role"
            register={register}
            error={
              errors?.related_contacts &&
              errors?.related_contacts[index] &&
              errors?.related_contacts[index]?.job_role
            }
            fieldLimit={50}
            limit={20}
          />
        </div>
        <div className="action__box w-[70px] flex flex-wrap items-center justify-start relative top-[8px] h-[30px] sm:w-[70px] sm:absolute sm:top-[7px] sm:right-[10px]">
          <div className="ip__Checkbox primary__field relative ml-[10px]">
            <input
              type="radio"
              className="ip__Radio"
              checked={field.is_primary}
              onChange={() => {
                const updatedData = (
                  (getValues(
                    'related_contacts'
                  ) as RelatedContactsAccountsType[]) || []
                ).map((contact, cIndex) => ({
                  ...contact,
                  value: contact.selectedOption?.value || contact.value,
                  is_primary: index === cIndex,
                }));
                setValue('related_contacts', updatedData);
              }}
            />
            <label className="rc__Label">Primary</label>
          </div>
          <button
            className={`${field.is_primary ? 'pointer-events-none opacity-0' : null
              } delete__btn text-[0px] bg-primary__transparentBG rounded-full w-[30px] h-[30px] relative duration-500 flex items-center justify-center ml-[10px] p-[5px]`}
            type="button"
            disabled={
              watchRelatedContact?.length
                ? watchRelatedContact.length <= 1
                : false
            }
            onClick={() => {
              removeRelatedContacts(index);
            }}
          >
            <Icon iconType="deleteFilled" fill="var(--ip__Red)" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedContactsFormForAccount;
