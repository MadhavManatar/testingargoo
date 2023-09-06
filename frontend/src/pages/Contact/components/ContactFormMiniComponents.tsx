/* eslint-disable no-underscore-dangle */
// ** Import Packages **
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import _ from 'lodash';

// ** Components **
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import ContactWithJobRoleOptions from 'pages/Contact/components/ContactWithJobRoleOption';
import SingleValueComponent from './SingleValueComponent';

// ** Hook **
import usePermission from 'hooks/usePermission';
import { useGetAccountsOptions } from 'pages/Account/hooks/useAccountService';
import { useGetContactOptions } from '../hooks/useContactService';

// ** Types **
import {
  FormFieldProps,
  Option,
} from 'components/FormField/types/formField.types';
import {
  AddContactFormFieldsType,
  ContactDetails,
  RelatedAccount,
} from '../types/contacts.types';

// ** Others **
import { isSingleValue } from 'components/FormField/helper';
import { useSelector } from 'react-redux';
import { getQuickPopup } from 'redux/slices/quickPopupDefaultSlice';
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import { ModuleNames } from 'constant/permissions.constant';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

type RelatedContactFormFieldChildProps = {
  index: number;
  fields: FieldArrayWithId<
    AddContactFormFieldsType,
    'related_contacts',
    'id'
  >[];
  remove: UseFieldArrayRemove;
  field: FieldArrayWithId<AddContactFormFieldsType, 'related_contacts', 'id'>;
  displayFieldProps?: {
    [key in keyof AddContactFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddContactFormFieldsType>]?: any;
    };
  };
  contactDetail?: ContactDetails;
  setSelectedContactOptions: React.Dispatch<
    React.SetStateAction<{ [key: string]: Option }>
  >;
  selectedContactOptions: { [key: string]: Option };
  checkFieldOnBlur?: (name: string, type: string) => Promise<void>;
};

export const RelatedContactFormFieldChild = (
  props: RelatedContactFormFieldChildProps
) => {
  const {
    index,
    field,
    remove,
    contactDetail,
    displayFieldProps,
    selectedContactOptions,
    setSelectedContactOptions,
    checkFieldOnBlur,
  } = props;

  // ** States **
  const methods = useFormContext<AddContactFormFieldsType>();
  const {
    setValue,
    register,
    control,
    formState: { errors },
  } = methods;

  const useWatchData = useWatch({ control });
  const watchContact = useWatchData.related_contacts || [];

  const leadContactOptions: Option[] =
    watchContact && contactDetail?.related_contacts
      ? contactDetail?.related_contacts.map((val) => {
          return {
            label: val?.contact?.name || '',
            value: val?.contact?.id || 0,
            job_role: val?.contact?.job_role,
          } as Option;
        })
      : [];

  const defaultOption = leadContactOptions?.find(
    (obj) => field.contact_id === obj.value
  );

  const currentSelectedOption = selectedContactOptions?.[
    `${watchContact?.[index]?.contact_id}`
  ]
    ? selectedContactOptions[`${watchContact[index]?.contact_id}`]
    : defaultOption?.value === watchContact?.[index]?.contact_id
    ? defaultOption
    : undefined;

  const skipContactIds = (watchContact || [])
    .filter((obj) => obj?.contact_id && typeof obj?.contact_id === 'number')
    .map((item) => item?.contact_id);

  const notSearchContactArray = [...skipContactIds];

  if (contactDetail?.id) {
    notSearchContactArray.push(contactDetail?.id);
  }

  const { getContactOptions, isContactsOptionsLoading } = useGetContactOptions({
    notSearchContactArray,
    emailWithLabel: true,
  });

  const selectorQuick = useSelector(getQuickPopup);

  return (
    <div className="w-full">
      <div className="w-full flex flex-wrap items-start px-[10px] mb-[20px] relative sm:mb-0 sm:pb-[10px]">
        <div className="w-[calc(50%_-_10px)] mr-[20px] sm:w-[calc(50%_-_24px)] sm:mr-[10px]">
          <FormField<AddContactFormFieldsType>
            id={field.id}
            wrapperClass="mb-0"
            isClearable
            placeholder="Search Or Enter"
            menuPosition="absolute"
            menuPlacement="bottom"
            type="CreatableAsyncSelectFormFieldForSearch"
            name={`related_contacts.${index}.contact_id`}
            control={control}
            inputMaxLength={50}
            serveSideSearch
            getOnChange={(e) => {
              if (isSingleValue(e) && e?.value) {
                setValue(`related_contacts.${index}.contact_id`, e?.value);

                setValue(
                  `related_contacts.${index}.isCreatable`,
                  // eslint-disable-next-line no-underscore-dangle
                  !!e?.__isNew__
                );
                if (e && typeof e?.value === 'string' && checkFieldOnBlur) {
                  checkFieldOnBlur(e?.value, 'relatedContact');
                }

                // here set the selected option because need to store if component rerender
                setSelectedContactOptions((prev) => ({
                  ...prev,
                  [`${e?.value}`]: e,
                }));
              }
              if (isSingleValue(e) && e?.extraLabel) {
                setValue(`related_contacts.${index}.job_role`, e?.extraLabel);
              }
              if (isSingleValue(e) && !e?.value) {
                setValue(`related_contacts.${index}.contact_id`, undefined);
                setValue(`related_contacts.${index}.job_role`, undefined);
              }
            }}
            OptionComponent={ContactWithJobRoleOptions}
            singleValueComponent={SingleValueComponent}
            getOptions={getContactOptions}
            isLoading={isContactsOptionsLoading}
            error={
              errors?.related_contacts &&
              errors?.related_contacts[index] &&
              errors?.related_contacts[index]?.contact_id
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
              displayFieldProps.related_contacts && {
                ...displayFieldProps.related_contacts,
              })}
            limit={OPTION_LISTING_DATA_LIMIT}
          />
        </div>
        <div className="w-[calc(50%_-_52px)] sm:w-[calc(50%_-_24px)]">
          <FormField<AddContactFormFieldsType>
            wrapperClass="mb-0"
            type="text"
            name={`related_contacts.${index}.job_role`}
            placeholder="Enter Relation for this Contact"
            register={register}
            fieldLimit={50}
            error={
              errors?.related_contacts &&
              errors?.related_contacts[index] &&
              errors?.related_contacts[index]?.job_role
            }
          />
        </div>
        <div className="action__box w-[40px] flex flex-wrap items-center justify-start relative top-[8px] h-[30px] sm:w-[36px] sm:absolute sm:top-[7px] sm:right-[10px]">
          <button
            className="delete__btn text-[0px] bg-primary__transparentBG rounded-full w-[30px] h-[30px] relative duration-500 flex items-center justify-center ml-[10px] p-[5px]"
            type="button"
            onClick={() => remove(index)}
          >
            <Icon iconType="deleteFilled" fill="var(--ip__Red)" />
          </button>
        </div>
      </div>
    </div>
  );
};

type RelatedAccountFormFieldChildProps = {
  index: number;
  fields: FieldArrayWithId<
    AddContactFormFieldsType,
    'related_accounts',
    'id'
  >[];
  remove: UseFieldArrayRemove;
  field: FieldArrayWithId<AddContactFormFieldsType, 'related_accounts', 'id'>;
  displayFieldProps?: {
    [key in keyof AddContactFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddContactFormFieldsType>]?: any;
    };
  };
  contactDetail?: ContactDetails;
  setSelectedAccountOptions: React.Dispatch<
    React.SetStateAction<{ [key: string]: Option }>
  >;
  selectedAccountOptions: { [key: string]: Option };
  setIsDuplicateAccount?: React.Dispatch<
    React.SetStateAction<DuplicateFieldModalType>
  >;
  previousOptions?: any[];
};

export const RelatedAccountFormFieldChild = (
  props: RelatedAccountFormFieldChildProps
) => {
  const {
    index,
    field,
    remove,
    contactDetail,
    displayFieldProps,
    selectedAccountOptions,
    setSelectedAccountOptions,
    previousOptions,
    setIsDuplicateAccount,
  } = props;

  // ** States **
  const methods = useFormContext<AddContactFormFieldsType>();
  const {
    setValue,
    register,
    control,
    formState: { errors },
  } = methods;
  const useWatchData = useWatch({ control });
  const selectorQuick = useSelector(getQuickPopup);

  const { createAccountPermission } = usePermission();
  const watchAccount = useWatchData.related_accounts || [];

  const leadContactOptions: Option[] =
    watchAccount && contactDetail?.related_accounts
      ? contactDetail?.related_accounts.map((val) => {
          return {
            label: val?.account?.name || '',
            value: val?.account?.id || 0,
            job_role: val?.account?.job_role,
            selected: true,
          } as Option;
        })
      : [];

  const defaultOption = leadContactOptions?.find(
    (obj) => field.account_id === obj.value
  );

  const currentSelectedOption = selectedAccountOptions?.[
    `${watchAccount?.[index]?.account_id}`
  ]
    ? selectedAccountOptions[`${watchAccount[index]?.account_id}`]
    : defaultOption?.value === watchAccount?.[index]?.account_id
    ? defaultOption
    : undefined;

  const skipContactIds = (watchAccount || [])
    .filter((obj) => obj?.account_id && typeof obj?.account_id === 'number')
    .map((item) => item?.account_id);

  const notSearchAccountArray = [...skipContactIds];

  const { getAccountsOptions, isAccountsLoading } = useGetAccountsOptions({
    notSearchAccountArray,
  });

  const setNoOptionMessage = () => {
    if (
      typeof createAccountPermission === 'boolean' &&
      !createAccountPermission
    ) {
      return "You Don't Have Permission For Create Account";
    }
    return 'Please Search or Create Account';
  };

  if (currentSelectedOption) {
    previousOptions?.push(currentSelectedOption);
  }

  return (
    <div className="w-full">
      <div className="w-full flex flex-wrap items-start px-[10px] mb-[20px] relative sm:mb-0 sm:pb-[10px]">
        <div className="w-[calc(50%_-_40px)] mr-[20px] sm:w-[calc(50%_-_24px)] sm:mr-[10px]">
          <FormField<AddContactFormFieldsType>
            id={field.id}
            wrapperClass="mb-0"
            isClearable
            placeholder="Search Or Enter"
            menuPosition="absolute"
            menuPlacement="bottom"
            type="CreatableAsyncSelectFormFieldForSearch"
            name={`related_accounts.${index}.account_id`}
            control={control}
            {...(createAccountPermission
              ? { inputMaxLength: 50 }
              : {
                  isValidNewOption: () => false,
                  noOptionsMessage: () => setNoOptionMessage(),
                })}
            serveSideSearch
            getOnChange={(e) => {
              if (isSingleValue(e) && e?.value) {
                if (watchAccount) {
                  const tempOptions = watchAccount.map(
                    (obj) => selectedAccountOptions?.[`${obj.account_id}`]
                  );
                  const foundValInPrevOptions = tempOptions?.findIndex(
                    (currentOption) =>
                      currentOption?.label?.toLowerCase().trim() ===
                      e?.label?.toLowerCase().trim()
                  );
                  if (
                    foundValInPrevOptions !== -1 &&
                    selectedAccountOptions[
                      `${watchAccount?.[index]?.account_id}`
                    ]?.label
                      ?.toLowerCase()
                      .trim() !== e.label?.toLowerCase().trim()
                  ) {
                    setValue('related_accounts', watchAccount as any);
                    setIsDuplicateAccount?.({
                      isOpen: true,
                      data: {
                        value: e?.label.toString(),
                        moduleName: ModuleNames.ACCOUNT,
                        field: '',
                        recordName: '',
                      },
                    });
                    return;
                  }
                }
                setValue(`related_accounts.${index}.account_id`, e?.value);
                setValue(
                  `related_accounts.${index}.isCreatable`,
                  !!e?.__isNew__
                );
                setValue(
                  `related_accounts.${index}.isCreatable`,
                  !!e?.__isNew__
                );
                // here set the selected option because need to store if component rerender
                setSelectedAccountOptions((prev) => ({
                  ...prev,
                  [`${e?.value}`]: e,
                }));
              } else if (watchAccount?.[index]?.account_id) {
                const tempSelectedOptions = _.clone(selectedAccountOptions);
                delete tempSelectedOptions[`${watchAccount[index].account_id}`];
                setSelectedAccountOptions(tempSelectedOptions);
              }
              if (isSingleValue(e) && e?.extraLabel) {
                setValue(`related_accounts.${index}.job_role`, e?.extraLabel);
              } else {
                setValue(`related_accounts.${index}.job_role`, '');
              }
              if (isSingleValue(e) && !e?.value) {
                setValue(`related_accounts.${index}.account_id`, '');
                setValue(`related_accounts.${index}.job_role`, '');
              }
            }}
            OptionComponent={ContactWithJobRoleOptions}
            getOptions={getAccountsOptions}
            isLoading={isAccountsLoading}
            error={
              errors?.related_accounts &&
              errors?.related_accounts[index] &&
              errors?.related_accounts[index]?.account_id
            }
            defaultOptions={
              currentSelectedOption
                ? [currentSelectedOption]
                : selectorQuick.account
                ? [
                    {
                      label: selectorQuick.parent?.name,
                      value: selectorQuick.parent?.id,
                    },
                  ]
                : []
            }
            {...(displayFieldProps &&
              displayFieldProps.related_accounts && {
                ...displayFieldProps.related_accounts,
              })}
            limit={OPTION_LISTING_DATA_LIMIT}
          />
        </div>
        <div className="w-[calc(50%_-_52px)] sm:w-[calc(50%_-_24px)]">
          <FormField<AddContactFormFieldsType>
            wrapperClass="mb-0"
            type="text"
            name={`related_accounts.${index}.job_role`}
            placeholder="Enter This Contacts Role for this Account"
            register={register}
            fieldLimit={50}
            error={
              errors?.related_accounts &&
              errors?.related_accounts[index] &&
              errors?.related_accounts[index]?.job_role
            }
          />
        </div>
        <div className="action__box mt-[12px] w-[70px] flex flex-wrap items-center justify-end relative bottom-[6px] h-[30px] sm:absolute sm:top-[9px] sm:right-[10px]">
          <div className="ip__Checkbox primary__field relative ml-[10px]">
            <input
              type="radio"
              className="ip__Radio"
              checked={field.is_primary}
              onChange={() => {
                if (setValue) {
                  const accountValues = watchAccount.map((item, cIndex) => ({
                    ...item,
                    is_primary: cIndex === index,
                  }));
                  setValue(
                    'related_accounts',
                    accountValues as RelatedAccount[]
                  );
                }
              }}
            />
            <label className="rc__Label ">Primary</label>
          </div>
          <button
            className={`${
              field.is_primary ? 'pointer-events-none opacity-0' : null
            } delete__btn text-[0px] bg-primary__transparentBG rounded-full w-[30px] h-[30px] relative duration-500 flex items-center justify-center ml-[10px] p-[5px]`}
            type="button"
            onClick={() => remove(index)}
          >
            <Icon iconType="deleteFilled" fill="var(--ip__Red)" />
          </button>
        </div>
      </div>
    </div>
  );
};
