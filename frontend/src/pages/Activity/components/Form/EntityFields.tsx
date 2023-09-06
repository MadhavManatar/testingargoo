// ** import packages ** //
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { components } from 'react-select';

// ** components ** //
import FormField from 'components/FormField';
import DuplicateFieldWarningModal from 'components/Modal/DuplicateFieldWarningModal/DuplicateFieldWarningModal';
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import ContactWithJobRoleOption from 'pages/Contact/components/ContactWithJobRoleOption';
import SingleValueComponent from 'pages/Contact/components/SingleValueComponent';
import { GuestFieldComponent } from './GuestFieldComponent';

// ** custom hooks-services ** //
import {
  useGetAccountsRelatedContact,
  useGetAccountsRelatedToContactOptions,
} from 'pages/Account/hooks/useAccountService';
import { useGetAllLeadOrDealOptions } from 'pages/Activity/hooks/useActivityService';
import {
  useGetAccountContactOptionsForSearchInLeadDeal,
  useGetContactsRelatedAccount,
} from 'pages/Contact/hooks/useContactService';

// ** types ** //
import {
  FormFieldProps,
  Option,
} from 'components/FormField/types/formField.types';
import {
  ActivityResponseType,
  AddActivityFormFields,
  ContactGuestEmailsType,
  activityGuestsType,
  entityDataType,
  ModalProps,
  relatedEntityDataType,
} from 'pages/Activity/types/activity.types';
import {
  AddContactFormFieldsType,
  RelatedContact,
} from 'pages/Contact/types/contacts.types';

// ** constants ** //
import { ModuleNames } from 'constant/permissions.constant';

// ** others ** //
import { isSingleValue } from 'components/FormField/helper';
import { getQuickPopup } from 'redux/slices/quickPopupDefaultSlice';
import { useSelector } from 'react-redux';
import { useLazyFieldIsExistsQuery } from 'redux/api/generalServiceApi';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

type ContactAccountFieldProps = {
  entityData?: entityDataType;
  relatedEntityData?: relatedEntityDataType;
  activityDetail?: ActivityResponseType;
  contactGuestEmails: ContactGuestEmailsType;
  guestEmails: activityGuestsType[];
  setGuestsEmails: Dispatch<SetStateAction<activityGuestsType[]>>;
  setContactGuestsEmails: Dispatch<SetStateAction<ContactGuestEmailsType>>;
  toggleOtherFields: {
    guests: boolean;
    location: boolean;
    videoCall: boolean;
    description: boolean;
  };
  displayFieldProps?: {
    [key in keyof AddContactFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddContactFormFieldsType>]?: any;
    };
  };
  openModal?: ModalProps;
};

function EntityFields(props: ContactAccountFieldProps) {
  const {
    activityDetail,
    entityData,
    relatedEntityData,
    toggleOtherFields,
    contactGuestEmails,
    guestEmails,
    setContactGuestsEmails,
    setGuestsEmails,
    displayFieldProps,
    openModal,
  } = props;

  // ** states ** //
  const [
    accountContactOfLeadDealDefaultOption,
    setAccountContactOfLeadDealDefaultOption,
  ] = useState<{
    contact: {
      label: string;
      value: number;
    };
    account: {
      label: string;
      value: number;
    };
  }>({
    account: {
      label: '',
      value: 0,
    },
    contact: {
      label: '',
      value: 0,
    },
  });
  const [accountRelatedContacts, setAccountRelatedContacts] =
    useState<RelatedContact[]>();
  const [contactRelatedAccounts, setContactRelatedAccounts] = useState<
    Option[]
  >([]);
  const [accountKey, setAccountKey] = useState<number>();
  const [contactKey, setContactKey] = useState<number>();

  // ** custom hooks ** //
  const {
    control,
    formState: { errors },
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    reset,
  } = useFormContext<AddActivityFormFields>();
  const selectorQuick = useSelector(getQuickPopup);

  // ** watch **
  const leadDealWatch = watch('activity_lead_id');
  const watchContact = watch('activity_contact');
  const watchAccount = watch('activity_account');

  const [duplicateMailModal, setDuplicateMailModal] =
    useState<DuplicateFieldModalType>({
      isOpen: false,
      data: null,
    });
  const { getAllLeadAndDealOptions, isAllLeadAndDealLoading, AllLeadDealData } =
    useGetAllLeadOrDealOptions();

  const [fieldIsExistsAPI] = useLazyFieldIsExistsQuery();
  const { getAccountContactOptions, isAccountContactsLoading } =
    useGetAccountContactOptionsForSearchInLeadDeal({
      watchAccount,
      emailWithLabel: true,
    });

  const {
    getGetAccountsRelatedToContactOptions,
    isAccountsRelatedToContactLoading,
  } = useGetAccountsRelatedToContactOptions({
    watchContact,
  });
  const { getContactsRelatedAccountOptions, isContactsRelatedAccountLoading } =
    useGetContactsRelatedAccount({
      setValueForActivity: setValue,
      setAccountRelatedContacts,
      watchContactForActivity: watchContact,
      setContactKey,
    });

  const {
    getGetAccountsRelatedContact,
    isAccountsRelatedToContactLoading: isDefaultAccountLoading,
  } = useGetAccountsRelatedContact({
    setValueForActivity: setValue,
    setContactRelatedAccounts,
    watchAccount,
    setAccountKey,
  });

  useEffect(() => {
    if (!watchAccount || (!watchContact && leadDealWatch)) {
      const leadDealContact = AllLeadDealData.find(
        (val) => val.id === leadDealWatch
      )?.related_contacts?.[0]?.contact;
      const leadDealAccount = AllLeadDealData.find(
        (val) => val.id === leadDealWatch
      )?.related_account;
      setAccountContactOfLeadDealDefaultOption((prev) => ({
        ...prev,
        ...(leadDealAccount?.id && {
          account: {
            label: leadDealAccount?.name || '',
            value: leadDealAccount.id,
          },
        }),
        ...(leadDealContact?.id && {
          contact: {
            label: leadDealContact?.name || '',
            value: leadDealContact?.id,
          },
        }),
      }));

      if (leadDealAccount?.id && !getValues('activity_account')) {
        setValue('activity_account', leadDealAccount.id);
        setAccountKey(leadDealAccount.id);
        setContactRelatedAccounts([]);
      }
      if (leadDealContact?.id && !getValues('activity_contact')) {
        setValue('activity_contact', leadDealContact.id);
        setContactKey(leadDealContact.id);
        setAccountRelatedContacts([]);
      }
    }
  }, [leadDealWatch]);

  // ** contact Default Option ** //

  const contactOption2 = accountContactOfLeadDealDefaultOption?.contact?.value
    ? [accountContactOfLeadDealDefaultOption.contact]
    : [];

  const contactOption1 =
    (contactOption2.length && contactOption2) ||
    (activityDetail?.activity_contact?.id
      ? [
          {
            label: `${activityDetail?.activity_contact?.name}`,
            value: activityDetail?.activity_contact?.id,
          },
        ]
      : []);

  const ContactDefaultOption =
    entityData?.type === ModuleNames.CONTACT
      ? [
          {
            label: entityData?.name,
            value: entityData?.id,
          },
        ]
      : contactOption1;

  // ** account Default Option ** //

  const accountOption2 = accountContactOfLeadDealDefaultOption.account?.value
    ? [accountContactOfLeadDealDefaultOption.account]
    : [];

  const accountOption1 =
    (accountOption2.length && accountOption2) ||
    (activityDetail?.activity_account
      ? [
          {
            label: `${activityDetail?.activity_account.name}`,
            value: activityDetail?.activity_account.id,
          },
        ]
      : []);

  const AccountDefaultOption =
    entityData?.type === ModuleNames.ACCOUNT
      ? [
          {
            label: entityData?.name,
            value: entityData?.id,
          },
        ]
      : accountOption1;

  // ** Lead Deal Default Option ** //
  const LeadDealDefaultOption = activityDetail?.activity_lead
    ? [
        {
          label: `${activityDetail?.activity_lead?.name}`,
          value: activityDetail?.activity_lead.id,
        },
      ]
    : selectorQuick.deal?.id && selectorQuick.deal?.name
    ? [
        {
          label: selectorQuick?.deal?.name,
          value: Number(selectorQuick?.deal?.id),
        },
      ]
    : selectorQuick.lead?.id && selectorQuick.lead?.name
    ? [
        {
          label: selectorQuick?.lead?.name,
          value: Number(selectorQuick?.lead?.id),
        },
      ]
    : [];

  // ** Default contact option based on account ** //
  const contactOptions: Option[] = accountRelatedContacts
    ? (accountRelatedContacts || []).map((val) => {
        return {
          label: val?.contact?.name || '',
          value: val?.contact?.id || 0,
          job_role: val?.contact?.job_role,
          selected: true,
        } as Option;
      })
    : [];

  const LeadDealListItem = useCallback(({ data, ...OptionProps }: any) => {
    return (
      <components.Option {...OptionProps}>
        <div className="flex flex-wrap">
          <p className="w-[calc(100%_-_80px)] pr-[10px]">{data?.label || ''}</p>
          <p className="w-[80px] text-right">
            {data?.is_deal ? 'Deal' : 'Lead'}
          </p>
        </div>
      </components.Option>
    );
  }, []);

  const onCloseWarningModal = () => {
    setDuplicateMailModal({ isOpen: false, data: null });

    if (duplicateMailModal?.data?.field === 'relatedContact' && setValue) {
      setValue('activity_contact', 0);
    }
  };

  const checkFieldOnBlur = async (value: string, type: string) => {
    if (value && type === 'relatedContact' && value.trim()) {
      const data = await fieldIsExistsAPI({
        data: { [type]: value },
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

  return (
    <>
      <div className="form__external__wrapper mb-[20px]">
        <label className="if__label if__label__blue flex flex-wrap">
          <IconAnimation
            iconType="watchFilled"
            animationIconType={IconTypeJson.Clock}
            className="items-center"
            textLabel="Deal or Lead"
            iconClassName="icon__wrapper mr-[5px] w-[30px] h-[30px] p-[1px] shrink-0 top-[-3px]"
          />
        </label>

        <FormField<AddActivityFormFields>
          id="activity_lead_id"
          placeholder="Select Deal Or Lead"
          type="asyncSelect"
          name="activity_lead_id"
          label=""
          serveSideSearch
          menuPosition="absolute"
          menuPlacement="auto"
          isClearable
          control={control}
          error={errors?.activity_lead_id}
          getOptions={getAllLeadAndDealOptions}
          isLoading={isAllLeadAndDealLoading}
          defaultOptions={
            entityData?.type === ModuleNames.DEAL ||
            entityData?.type === ModuleNames.LEAD
              ? [
                  {
                    label: entityData?.name,
                    value: entityData?.id || '',
                  },
                ]
              : LeadDealDefaultOption
          }
          OptionComponent={LeadDealListItem}
        />
      </div>
      <div className="form__external__wrapper mb-[20px]">
        <label className="if__label if__label__blue flex flex-wrap">
          <IconAnimation
            iconType="userProfileFilledIcon"
            animationIconType={IconTypeJson.Account}
            className="items-center"
            textLabel="Account"
            iconClassName="icon__wrapper mr-[5px] w-[30px] h-[30px] p-[1px] shrink-0 top-[-3px]"
          />
        </label>
        <FormField<AddActivityFormFields>
          key={accountKey}
          id="activity_account"
          placeholder="Search Or Enter Account"
          type="CreatableAsyncSelectFormFieldForSearch"
          serveSideSearch
          name="activity_account"
          label=""
          menuPosition="absolute"
          menuPlacement="auto"
          inputMaxLength={50}
          control={control}
          isClearable
          error={errors.activity_account}
          getOptions={getGetAccountsRelatedToContactOptions}
          isLoading={
            isAccountsRelatedToContactLoading || isDefaultAccountLoading
          }
          getOnChange={(e) => {
            if (isSingleValue(e) && typeof e?.value === 'number') {
              getContactsRelatedAccountOptions(e.value);
            }
          }}
          defaultOptions={
            (contactRelatedAccounts.length && contactRelatedAccounts) ||
            (AccountDefaultOption.length && AccountDefaultOption) ||
            (relatedEntityData?.account?.id
              ? [
                  {
                    label: relatedEntityData?.account?.name,
                    value: relatedEntityData?.account?.id || '',
                  },
                ]
              : selectorQuick.account?.id
              ? [
                  {
                    label: selectorQuick.account.name || '',
                    value: selectorQuick.account.id,
                  },
                ]
              : [])
          }
          limit={OPTION_LISTING_DATA_LIMIT}
        />
      </div>

      <div className="form__external__wrapper">
        <label className="if__label if__label__blue flex flex-wrap">
          <IconAnimation
            iconType="userProfileFilledIcon"
            animationIconType={IconTypeJson.Contact}
            className="items-center"
            textLabel="Contact"
            iconClassName="icon__wrapper mr-[5px] w-[30px] h-[30px] p-[1px] shrink-0 top-[-3px]"
          />
        </label>

        <FormField<AddActivityFormFields>
          key={contactKey}
          id="activity_contact"
          placeholder="Search Or Enter Contact"
          type="CreatableAsyncSelectFormFieldForSearch"
          name="activity_contact"
          label=""
          isClearable
          control={control}
          inputMaxLength={50}
          error={errors.activity_contact}
          serveSideSearch
          getOptions={getAccountContactOptions}
          getOnChange={(e) => {
            if (isSingleValue(e)) {
              if (typeof e?.value === 'string') {
                checkFieldOnBlur(e?.value, 'relatedContact');
              }
              if (typeof e?.value === 'number') {
                getGetAccountsRelatedContact(e?.value);
              }
            }
          }}
          isLoading={
            isAccountContactsLoading || isContactsRelatedAccountLoading
          }
          menuPosition="absolute"
          menuPlacement="auto"
          defaultOptions={
            (contactOptions.length && contactOptions) ||
            (ContactDefaultOption.length && ContactDefaultOption) ||
            (relatedEntityData?.contact?.id
              ? [
                  {
                    label: relatedEntityData?.contact?.name,
                    value: relatedEntityData?.contact?.id,
                  },
                ]
              : selectorQuick.contact?.id
              ? [
                  {
                    label: selectorQuick.contact.name || '',
                    value: selectorQuick.contact?.id,
                  },
                ]
              : [])
          }
          OptionComponent={ContactWithJobRoleOption}
          singleValueComponent={SingleValueComponent}
          {...(displayFieldProps &&
            displayFieldProps.contact_owner_id && {
              ...displayFieldProps.contact_owner_id,
            })}
          limit={OPTION_LISTING_DATA_LIMIT}
        />
      </div>

      {toggleOtherFields.guests ? (
        <div>
          <GuestFieldComponent
            openModal={openModal}
            clearErrors={clearErrors}
            contactGuestEmails={contactGuestEmails}
            errors={errors}
            guestEmails={guestEmails}
            setContactGuestsEmails={setContactGuestsEmails}
            setError={setError}
            setGuestsEmails={setGuestsEmails}
            control={control}
            reset={reset}
            getValues={getValues}
          />
        </div>
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
}

export default EntityFields;
