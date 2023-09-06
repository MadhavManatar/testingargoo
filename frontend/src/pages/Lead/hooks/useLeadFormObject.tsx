// ** Import Packages **
import { useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useSelector } from 'react-redux';

// ** Components **
import FormField from 'components/FormField';
import RelatedContactFormFieldChild from '../components/LeadFormMiniComponents';

// ** Redux **
import { getQuickPopup } from 'redux/slices/quickPopupDefaultSlice';
import store from 'redux/store';

// ** API **
import { useLazyFieldIsExistsQuery } from 'redux/api/generalServiceApi';
import { useLazyGetLeadStatusQuery } from 'redux/api/leadStatusApi';
import { useLazyGetLeadTempStatusQuery } from 'redux/api/leadTempStatusApi';

// ** Types **
import { Option } from 'components/FormField/types/formField.types';
import { RelatedContact } from 'pages/Contact/types/contacts.types';
import {
  AddLeadFormFieldsType,
  LeadFormFieldObject,
  LeadFormObjectPropsType,
} from 'pages/Lead/types/lead.type';

// ** Services **
import { useGetAccountsRelatedToContactOptions } from 'pages/Account/hooks/useAccountService';
import { useGetUserOrDescendantUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';

// ** Hooks **
import usePermission from 'hooks/usePermission';
import { useGetContactsRelatedAccount } from 'pages/Contact/hooks/useContactService';

//  ** Constants **
import { LEAD_SCORE } from 'constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';

// ** Other **
import { isSingleValue } from 'components/FormField/helper';
import { useGetLeadDealSourceOptions } from 'pages/Setting/general-setting/common-controls/LeadDealSource/hooks/useLeadDealSourceServices';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

const useLeadFormObject = (formProps: LeadFormObjectPropsType) => {
  const {
    control,
    errors,
    register,
    setValue,
    watch,
    displayFieldProps,
    editFormFlag = false,
    leadDetail,
    setEmailTimelineModal,
    setDuplicateMailModal,
  } = formProps;

  const {
    fields: contactsFields,
    append: appendContacts,
    remove: removeContacts,
  } = useFieldArray({
    name: 'contacts',
    control,
  });

  const {
    readAccountPermission,
    createAccountPermission,
    readContactPermission,
    createContactPermission,
  } = usePermission();

  // ** Store **
  const { auth } = store.getState();
  const { user } = auth;
  const selectorQuick = useSelector(getQuickPopup);

  // ** States **
  const [leadTemperatureStatusOpt, setLeadTemperatureStatusOpt] = useState<
    Option[]
  >([]);
  const [leadStatusOpt, setLeadStatusOpt] = useState<Option[]>([]);
  const [selectedContactOptions, setSelectedContactOptions] = useState<{
    [key: string]: Option;
  }>({});
  const [accountRelatedContacts, setAccountRelatedContacts] =
    useState<RelatedContact[]>();
  const [contactRelatedAccounts, setContactRelatedAccounts] = useState<
    Option[]
  >([]);
  const [accountKey, setAccountKey] = useState<number>();

  // ** APIS **
  const { getLeadDealSourceOptions, isLeadDealSourceLoading } =
    useGetLeadDealSourceOptions();
  const [getLeadStatusApi] = useLazyGetLeadStatusQuery();
  const [getLeadTempStatusApi] = useLazyGetLeadTempStatusQuery();

  // ** watch **
  const watchContact = watch('contacts');
  const watchAccount = watch('related_account');

  // async load for lead owner
  const [fieldIsExistsAPI] = useLazyFieldIsExistsQuery();
  const {
    userOrDescendantUserOptions: getLeadOwnerOption,
    isDescendantUsersLoading,
    isUsersLoading,
  } = useGetUserOrDescendantUserOptions(
    editFormFlag
      ? { ...MODULE_PERMISSION.LEAD.update }
      : { ...MODULE_PERMISSION.LEAD.create }
  );

  const {
    getGetAccountsRelatedToContactOptions,
    isAccountsRelatedToContactLoading,
  } = useGetAccountsRelatedToContactOptions({
    watchContact: watchContact?.find((item) => item.is_primary)?.contact_id,
  });

  const { getContactsRelatedAccountOptions, isContactsRelatedAccountLoading } =
    useGetContactsRelatedAccount({
      setValue,
      setAccountRelatedContacts,
      watchContact,
    });

  // const getLeadDealSourceOptions = async () => {
  //   const { data, error } = await getLeadDealSourceApi(
  //     {
  //       data: {
  //         query: {
  //           ...MODULE_PERMISSION.LEAD.read,
  //           'include[creator]': 'id,first_name,last_name,full_name',
  //           'q[type]': EntityAttributesEnum.LEAD_DEAL_SOURCE,
  //           select: 'id,name,is_system,type',
  //           sort: '-id',
  //         },
  //       },
  //     },
  //     true
  //   );

  //   if (!error && data?.rows) {
  //     const Options = data.rows.map((val: { name: string; id: number }) => ({
  //       label: val.name,
  //       value: val?.id,
  //     }));
  //     if (leadDetail?.id && leadDetail?.lead_source?.id) {
  //       setValue('lead_source', leadDetail?.lead_source.id);
  //     } else if (Options?.length) {
  //       setValue('lead_source', Options?.[0].value);
  //     }
  //   }
  // };

  // async load for account contact
  useEffect(() => {
    getLeadStatusData();
    getLeadTempStatusData();
  }, [leadDetail?.id]);

  const getLeadTempStatusData = async () => {
    const { data, error } = await getLeadTempStatusApi(
      {
        data: {
          query: {
            ...MODULE_PERMISSION.LEAD.read,
            'q[type]': EntityAttributesEnum.LEAD_TEMP_STATUS,
            'include[creator]': 'id,first_name,last_name,full_name',
            select: 'id,name,is_system,type',
            sort: '-id',
          },
        },
      },
      true
    );

    if (data && !error) {
      const options = data?.rows?.map((option: any, index: number) => ({
        label: option.name,
        value: option.id,
        ...(!leadDetail?.lead_temperature?.id &&
          index === 0 && { selected: true }),
      }));

      if (leadDetail?.id && leadDetail?.lead_temp_id) {
        setValue('lead_temp_id', leadDetail?.lead_temp_id || null);
      } else {
        setValue('lead_temp_id', options[0].value);
      }
      setLeadTemperatureStatusOpt([...options]);
    }
  };

  const getLeadStatusData = async () => {
    const { data, error } = await getLeadStatusApi(
      {
        data: {
          query: {
            ...MODULE_PERMISSION.LEAD.read,
            'q[type]': EntityAttributesEnum.LEAD_STATUS,
            'include[creator]': 'id,first_name,last_name,full_name',
            select: 'id,name,is_system,type',
            sort: '-id',
          },
        },
      },
      true
    );
    if (data && !error) {
      const options = data?.rows?.map((option: any, index: number) => ({
        ...(!leadDetail?.lead_status?.id && index === 0
          ? { selected: true }
          : {}),
        label: option.name,
        value: option.id,
      }));

      if (!leadDetail?.lead_status?.id) {
        setValue('lead_status_id', options[0].value);
      }
      setLeadStatusOpt([...options]);
    }
  };

  const setNoOptionMessage = () => {
    if (
      typeof createAccountPermission === 'boolean' &&
      !createAccountPermission
    ) {
      return "You Don't Have Permission For Create Account";
    }
    return 'Please Search or Create Account';
  };
  const checkFieldOnBlur = async (value: string, type: string) => {
    if (value && type === 'relatedContact' && value.trim()) {
      const data = await fieldIsExistsAPI({
        data: {
          [type]: value,
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

  const formObject: LeadFormFieldObject = {
    information: {
      lead_owner_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddLeadFormFieldsType>
            id="lead_owner_id"
            placeholder="Select Owner"
            type="asyncSelect"
            name="lead_owner_id"
            label="Owner"
            icon="userProfileFilledIcon"
            iconPosition="left"
            labelClass="if__label__blue"
            control={control}
            error={errors?.lead_owner_id}
            isLoading={isDescendantUsersLoading || isUsersLoading}
            getOptions={getLeadOwnerOption}
            defaultOptions={
              leadDetail?.lead_owner?.id
                ? [
                    {
                      label: `${leadDetail?.lead_owner.first_name} ${leadDetail?.lead_owner.last_name}`,
                      value: leadDetail?.lead_owner.id,
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
            menuPosition="absolute"
            menuPlacement="auto"
            {...(displayFieldProps &&
              displayFieldProps.lead_owner_id && {
                ...displayFieldProps.lead_owner_id,
              })}
          />
        </div>
      ),
      name: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddLeadFormFieldsType>
            required
            type="text"
            name="name"
            label="Name"
            labelClass="if__label__blue"
            placeholder="Enter Name"
            register={register}
            error={errors?.name}
            fieldLimit={100}
            {...(displayFieldProps &&
              displayFieldProps.name && {
                ...displayFieldProps.name,
              })}
          />
        </div>
      ),
      lead_status_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddLeadFormFieldsType>
            id="lead_status_id"
            placeholder="Select Status"
            required
            type="select"
            name="lead_status_id"
            label="Status"
            menuPosition="absolute"
            menuPlacement="auto"
            labelClass="if__label__blue"
            control={control}
            error={errors?.lead_status_id}
            options={leadStatusOpt}
            {...(displayFieldProps &&
              displayFieldProps.lead_status_id && {
                ...displayFieldProps.lead_status_id,
              })}
          />
        </div>
      ),
      lead_temp_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddLeadFormFieldsType>
            id="lead_temp_id"
            placeholder="Select Temperature"
            type="select"
            name="lead_temp_id"
            label="Temperature"
            labelClass="if__label__blue"
            control={control}
            error={errors?.lead_temp_id}
            options={leadTemperatureStatusOpt}
            menuPosition="absolute"
            menuPlacement="auto"
            {...(displayFieldProps &&
              displayFieldProps.lead_temp_id && {
                ...displayFieldProps.lead_temp_id,
              })}
          />
        </div>
      ),

      related_account: (
        <div
          className={`px-[10px] w-1/2 sm:w-full ${
            !readAccountPermission ? 'hidden' : ''
          }`}
        >
          <FormField<AddLeadFormFieldsType>
            id="related_account"
            key={accountKey}
            placeholder="Select Account"
            type="CreatableAsyncSelectFormFieldForSearch"
            name="related_account"
            label="Related Account"
            labelClass="if__label__blue"
            {...(createAccountPermission
              ? { inputMaxLength: 50 }
              : {
                  isValidNewOption: () => false,
                  noOptionsMessage: () => setNoOptionMessage(),
                })}
            icon="buildingFilledIcon"
            menuPosition="absolute"
            menuPlacement="auto"
            iconPosition="left"
            aria-placeholder="Select Account"
            control={control}
            serveSideSearch
            getOptions={getGetAccountsRelatedToContactOptions}
            getOnChange={(e) => {
              if (isSingleValue(e) && typeof e?.value === 'number') {
                getContactsRelatedAccountOptions(e.value);
              } else if (
                !e &&
                setEmailTimelineModal &&
                leadDetail &&
                leadDetail?.id
              ) {
                const d: number = watchAccount as number;
                if (d === leadDetail?.related_account?.id) {
                  setEmailTimelineModal({
                    isOpen: true,
                    data: {
                      key: 'related_account',
                      data: leadDetail?.related_account.id,
                    },
                  });
                }
              }
            }}
            isLoading={
              isAccountsRelatedToContactLoading ||
              isContactsRelatedAccountLoading
            }
            error={errors?.related_account}
            isClearable
            defaultOptions={
              (contactRelatedAccounts.length && contactRelatedAccounts) ||
              (leadDetail?.related_account?.id
                ? [
                    {
                      label: `${leadDetail?.related_account?.name || ''}`,
                      value: leadDetail?.related_account?.id,
                    },
                  ]
                : selectorQuick.account?.name && selectorQuick.account?.id
                ? [
                    {
                      label: selectorQuick.account?.name,
                      value: selectorQuick.account?.id,
                    },
                  ]
                : [])
            }
            {...(displayFieldProps &&
              displayFieldProps.related_account && {
                ...displayFieldProps.related_account,
              })}
            limit={OPTION_LISTING_DATA_LIMIT}
          />
        </div>
      ),
      contacts: (
        <div
          className={`repeater__Rcontact__box withPrimary w-full relative ${
            !readContactPermission ? '!hidden' : ''
          }`}
        >
          <label className="if__label if__label__blue w-full !mb-[10px] px-[10px] ">
            Related Contacts
          </label>

          {contactsFields.map((field, index) => {
            return (
              <RelatedContactFormFieldChild
                isCreatablePermission={createContactPermission}
                isDisabled={!readContactPermission}
                checkFieldOnBlur={checkFieldOnBlur}
                selectedContactOptions={selectedContactOptions}
                setSelectedContactOptions={setSelectedContactOptions}
                key={field.id}
                contactsFields={contactsFields}
                index={index}
                field={field}
                removeContacts={removeContacts}
                watchAccount={watchAccount}
                displayFieldProps={displayFieldProps}
                related_contacts={
                  accountRelatedContacts || leadDetail?.related_contacts
                }
                setContactRelatedAccounts={setContactRelatedAccounts}
                setAccountKey={setAccountKey}
                setEmailTimelineModal={setEmailTimelineModal}
              />
            );
          })}
          <div className="w-full px-[10px] mt-[-6px] mb-[17px] ">
            <button
              className="add__btn text-[14px] text-[#8A8A8A] disabled font-biotif__Medium duration-500 hover:text-primaryColor"
              type="button"
              onClick={() =>
                appendContacts({
                  job_role: '',
                  contact_id: '',
                  is_primary: false,
                })
              }
              disabled={contactsFields.length >= 10 || false}
            >
              + Add Contact
            </button>
          </div>
          <label className="inline-block font-biotif__Regular text-light__TextColor text-[14px] absolute top-0 right-[31px]">
            Primary
          </label>
        </div>
      ),
      deal_value: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddLeadFormFieldsType>
            type="currency_format"
            formatName="currency"
            name="deal_value"
            label="Value"
            labelClass="if__label__blue"
            icon="currencyFilledIcon"
            iconPosition="left"
            placeholder="EX. $X,XXX.XX"
            error={errors?.deal_value}
            control={control}
            fieldLimit={21}
            {...(displayFieldProps &&
              displayFieldProps.deal_value && {
                ...displayFieldProps.deal_value,
              })}
          />
        </div>
      ),

      lead_source: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddLeadFormFieldsType>
            key={leadDetail?.lead_source?.id}
            id="lead_source"
            placeholder="Select or Enter Source"
            type="creatableAsyncSelect"
            name="lead_source"
            inputMaxLength={40}
            label="Source"
            menuPosition="absolute"
            menuPlacement="auto"
            labelClass="if__label__blue"
            isClearable
            control={control}
            getOptions={getLeadDealSourceOptions}
            isLoading={isLeadDealSourceLoading}
            error={errors?.lead_source}
            {...(displayFieldProps &&
              displayFieldProps.lead_source && {
                ...displayFieldProps.lead_source,
              })}
            defaultOptions={
              leadDetail?.lead_source?.id
                ? [
                    {
                      label: leadDetail?.lead_source?.name,
                      value: leadDetail?.lead_source?.id,
                    },
                  ]
                : []
            }
          />
        </div>
      ),
      lead_score: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddLeadFormFieldsType>
            id="lead_score"
            placeholder="Select Score"
            type="select"
            name="lead_score"
            inputMode="numeric"
            label="Score"
            isClearable
            labelClass="if__label__blue"
            menuPosition="absolute"
            menuPlacement="auto"
            control={control}
            options={LEAD_SCORE}
            {...(displayFieldProps &&
              displayFieldProps.lead_score && {
                ...displayFieldProps.lead_score,
              })}
          />
        </div>
      ),
    },

    descriptionInfo: {
      description: (
        <div className="w-full px-[10px]">
          <FormField<AddLeadFormFieldsType>
            type="textarea"
            name="description"
            labelClass="if__label__blue"
            placeholder="Enter Description"
            register={register}
            error={errors?.description}
            fieldLimit={5000}
            {...(displayFieldProps &&
              displayFieldProps.description && {
                ...displayFieldProps.description,
              })}
          />
        </div>
      ),
    },
  };
  return { formObject };
};

export default useLeadFormObject;
