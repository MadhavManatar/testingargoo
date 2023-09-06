// ** Import Packages **
import { Fragment, useEffect, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';
import RelatedContactFormFieldChild from './LeadFormMiniComponents';

// ** Redux **
import store from 'redux/store';

// ** API **
import { useLazyGetLeadStatusQuery } from 'redux/api/leadStatusApi';
import { useLazyGetPipelineByIdQuery } from 'redux/api/pipelineApi';

// ** Services **
import { useGetAccountsRelatedToContactOptions } from 'pages/Account/hooks/useAccountService';
import { useGetContactsRelatedAccount } from 'pages/Contact/hooks/useContactService';
import { useGetUserOrDescendantUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';

// ** hooks-services **
import usePermission from 'hooks/usePermission';
import useDefaultPipeline from 'pages/Deal/hooks/useDefaultPipeline';
import { useGetLeadDealSourceOptions } from 'pages/Setting/general-setting/common-controls/LeadDealSource/hooks/useLeadDealSourceServices';
import { useGetPipelineOptions } from 'pages/Setting/module-setting/Deal/Pipeline/hooks/usePipelineService';
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';

// ** types **
import { Option } from 'components/FormField/types/formField.types';
import { RelatedContact } from 'pages/Contact/types/contacts.types';
import {
  ConvertLeadFormFieldType,
  ConvertLeadFormObject,
  ConvertLeadFormPropsType,
} from '../types/convertLead.type';

// ** Constants **
import { MODULE_PERMISSION } from 'constant/permissions.constant';

// ** others **
import { isSingleValue } from 'components/FormField/helper';
import { setContacts } from '../helper/leads.helper';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

type defaultInfoType = {
  pipeline_id?: Option;
  deal_stage_id?: Option;
};
const ConvertLeadForm = (props: ConvertLeadFormPropsType) => {
  const {
    displayFieldProps,
    editFormFlag = false,
    displayField,
    lead_status,
    isGetLeadLoading,
    leadData,
    setStageLostIds,
  } = props;

  const {
    control,
    reset,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ConvertLeadFormFieldType>();

  const { auth } = store.getState();
  const { user } = auth;

  const watchAccount = watch('related_account');
  const watchContact = watch('contacts');
  const watchPipeline = watch('pipeline_id');
  const useWatchData = useWatch({ control });

  // ** States **
  const [leadStatusOpt, setLeadStatusOpt] = useState<Option[]>([]);
  const [defaultInfo, setDefaultInfo] = useState<defaultInfoType>({});
  const [selectedContactOptions, setSelectedContactOptions] = useState<{
    [key: string]: Option;
  }>({});
  const [accountRelatedContacts, setAccountRelatedContacts] =
    useState<RelatedContact[]>();
  const [contactRelatedAccounts, setContactRelatedAccounts] = useState<
    Option[]
  >([]);
  const [accountKey, setAccountKey] = useState<number>();
  const [dealStageArray, setDealStageArray] = useState<
    { label: string; value: number; id: number }[]
  >([]);

  const {
    fields: contactsFields,
    append: appendContacts,
    remove: removeContacts,
  } = useFieldArray({
    name: 'contacts',
    control,
  });

  // ** API **
  const [getLeadStatusApi] = useLazyGetLeadStatusQuery();
  const [getDealPipelineById, { isLoading: isDealStageLoading }] =
    useLazyGetPipelineByIdQuery();

  // ** custom hooks **
  const { getPipelineOptions, isPipelineLoading } = useGetPipelineOptions();
  const {
    readAccountPermission,
    createAccountPermission,
    readContactPermission,
    createContactPermission,
  } = usePermission();

  const { getLeadDealSourceOptions, isLeadDealSourceLoading } =
    useGetLeadDealSourceOptions();

  const { getContactsRelatedAccountOptions, isContactsRelatedAccountLoading } =
    useGetContactsRelatedAccount({
      setValue,
      setAccountRelatedContacts,
      watchContact,
    });
  const { initialPipelineOption } = useDefaultPipeline({
    getDealStageOptions,
    setDefaultInfo,
    getPipelineOptions,
  });
  // async load for lead owner
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

  useEffect(() => {
    if (watchPipeline) {
      getDealStageOptions();
    }
  }, [watchPipeline]);

  useEffect(() => {
    if (leadData.lead) {
      initialPipelineOption();
      getLeadStatusData();
    }
  }, [leadData.lead]);

  useEffect(() => {
    const setPipelineId = defaultInfo.pipeline_id?.value;
    const setDealStageId = defaultInfo.deal_stage_id?.value;

    if (setPipelineId) {
      setValue('pipeline_id', +setPipelineId);
    }

    if (setDealStageId) {
      setValue('deal_stage_id', +setDealStageId);
    }
  }, [defaultInfo]);

  useEffect(() => {
    const {
      lead_source,
      name,
      related_account,
      deal_value,
      description,
      lead_owner,
      related_contacts,
      pipeline_id,
      lead_status: currStatus,
    } = leadData.lead;

    reset({
      lead_source: lead_source?.id || '',
      name,
      deal_value,
      description,
      pipeline_id,
      related_account: related_account?.id ? related_account.id : '',
      lead_owner_id: lead_owner?.id || undefined,
      lead_status_id: Number(currStatus?.id),
      contacts: related_contacts?.length
        ? setContacts(related_contacts)
        : [{ job_role: '', contact_id: '', is_primary: true }],
    });
  }, [leadData]);

  async function getDealStageOptions(id?: number) {
    const pipelineId = id || useWatchData?.pipeline_id;
    if (pipelineId) {
      const { data, error } = await getDealPipelineById({ id: pipelineId });
      if (data && !error) {
        const arr: { label: string; value: number; id: number }[] = [];
        const lostIds: number[] = [];
        data?.stages.map(
          (item: { name: string; id: number; stage_type: string }) => {
            if (item.stage_type === 'Lost') {
              lostIds.push(item.id);
            }
            arr.push({
              label: item.name,
              value: item.id,
              id: item.id,
            });
            return arr;
          }
        );
        setDealStageArray(arr);
        setStageLostIds(lostIds);
        return arr;
      }
    }
  }

  const getLeadStatusData = async () => {
    const { data, error } = await getLeadStatusApi(
      {
        data: {
          query: {
            ...MODULE_PERMISSION.LEAD.read,
            'q[type]': EntityAttributesEnum.LEAD_STATUS,
          },
        },
      },
      true
    );
    if (data && !error) {
      const options = data?.rows?.map((option: any, index: number) => ({
        label: option.name,
        value: option.id,
        ...(!lead_status?.id && index === 0 && { selected: true }),
      }));

      if (leadData.lead) {
        setValue('lead_status_id', leadData.lead.lead_status_id);
      } else if (!lead_status?.id) {
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
  const formObject: ConvertLeadFormObject = {
    information: {
      lead_owner_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<ConvertLeadFormFieldType>
            id="lead_owner_id"
            placeholder="Select Owner"
            type="asyncSelect"
            name="lead_owner_id"
            label="Owner"
            labelClass="if__label__blue"
            control={control}
            error={errors?.lead_owner_id}
            isLoading={isDescendantUsersLoading || isUsersLoading}
            getOptions={getLeadOwnerOption}
            defaultOptions={
              leadData?.lead?.lead_owner?.id
                ? [
                    {
                      label: `${leadData?.lead?.lead_owner?.first_name} ${leadData?.lead?.lead_owner?.last_name}`,
                      value: leadData?.lead?.lead_owner?.id,
                      selected: true,
                    },
                  ]
                : [
                    {
                      label: `${user?.first_name} ${user?.last_name}`,
                      value: `${user?.id}`,
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
          <FormField<ConvertLeadFormFieldType>
            type="text"
            name="name"
            label="Name"
            labelClass="if__label__blue"
            required
            placeholder="Enter Name"
            register={register}
            error={errors?.name}
            fieldLimit={50}
            {...(displayFieldProps &&
              displayFieldProps.name && {
                ...displayFieldProps.name,
              })}
          />
        </div>
      ),
      lead_status_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<ConvertLeadFormFieldType>
            id="lead_status_id"
            placeholder="Select Status"
            type="select"
            name="lead_status_id"
            label="Status"
            labelClass="if__label__blue"
            control={control}
            error={errors?.lead_status_id}
            options={leadStatusOpt}
            menuPosition="absolute"
            menuPlacement="auto"
            {...(displayFieldProps &&
              displayFieldProps.lead_status_id && {
                ...displayFieldProps.lead_status_id,
              })}
          />
        </div>
      ),
      lead_source: (
        <div className="w-1/2 px-[10px] sm:w-full">
          <FormField<ConvertLeadFormFieldType>
            id="lead_source"
            placeholder="Select Source"
            type="creatableAsyncSelect"
            name="lead_source"
            inputMaxLength={40}
            label="Source"
            labelClass="if__label__blue"
            isClearable
            control={control}
            getOptions={getLeadDealSourceOptions}
            isLoading={isLeadDealSourceLoading}
            menuPosition="absolute"
            menuPlacement="auto"
            error={errors?.lead_source}
            {...(displayFieldProps &&
              displayFieldProps.lead_source && {
                ...displayFieldProps.lead_source,
              })}
            defaultOptions={
              leadData?.lead?.lead_source?.id
                ? [
                    {
                      label: leadData?.lead?.lead_source?.name,
                      value: leadData?.lead?.lead_source?.id,
                    },
                  ]
                : []
            }
          />
        </div>
      ),

      related_account: (
        <div
          className={`px-[10px] w-1/2 sm:w-full ${
            !readAccountPermission ? 'hidden' : ''
          }`}
        >
          <FormField<ConvertLeadFormFieldType>
            id="related_account"
            placeholder="None"
            type="CreatableAsyncSelectFormFieldForSearch"
            serveSideSearch
            key={accountKey}
            name="related_account"
            label="Related Account"
            labelClass="if__label__blue"
            {...(createAccountPermission
              ? { inputMaxLength: 50 }
              : {
                  isValidNewOption: () => false,
                  noOptionsMessage: () => setNoOptionMessage(),
                })}
            getOnChange={(e) => {
              if (isSingleValue(e) && typeof e?.value === 'number') {
                getContactsRelatedAccountOptions(e.value);
              }
            }}
            aria-placeholder="Select Account"
            control={control}
            inputMaxLength={50}
            getOptions={getGetAccountsRelatedToContactOptions}
            isLoading={
              isAccountsRelatedToContactLoading ||
              isContactsRelatedAccountLoading
            }
            isClearable
            error={errors?.related_account}
            defaultOptions={
              (contactRelatedAccounts.length && contactRelatedAccounts) ||
              (leadData?.lead?.related_account?.id
                ? [
                    {
                      label: `${leadData?.lead?.related_account?.name || ''}`,
                      value: leadData?.lead?.related_account?.id,
                    },
                  ]
                : [])
            }
            menuPosition="absolute"
            menuPlacement="auto"
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
                  accountRelatedContacts || leadData.lead.related_contacts
                }
                setContactRelatedAccounts={setContactRelatedAccounts}
                setAccountKey={setAccountKey}
              />
            );
          })}
          <div className="w-full px-[10px] mt-[-6px] mb-[17px] ">
            <button
              className="add__btn text-[14px] text-[#8A8A8A] font-biotif__Medium duration-500 hover:text-primaryColor"
              type="button"
              onClick={() => {
                appendContacts({
                  job_role: '',
                  contact_id: '',
                  is_primary: false,
                });
              }}
              disabled={
                contactsFields?.length ? contactsFields.length >= 10 : false
              }
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
          <FormField<ConvertLeadFormFieldType>
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
      pipeline_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<ConvertLeadFormFieldType>
            required
            id="pipeline_id"
            placeholder="Select Pipeline"
            type="asyncSelect"
            serveSideSearch
            name="pipeline_id"
            label="Pipeline"
            key={defaultInfo.pipeline_id}
            labelClass="if__label__blue"
            control={control}
            error={errors?.pipeline_id}
            getOptions={getPipelineOptions}
            defaultOptions={
              defaultInfo.pipeline_id ? [defaultInfo.pipeline_id] : []
            }
            isLoading={isPipelineLoading}
            menuPosition="absolute"
            menuPlacement="auto"
            {...(displayFieldProps &&
              displayFieldProps.pipeline_id && {
                ...displayFieldProps.pipeline_id,
              })}
          />
        </div>
      ),
      deal_stage_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<ConvertLeadFormFieldType>
            required
            id="deal_stage_id"
            placeholder="Select Deal Stage"
            type="select"
            name="deal_stage_id"
            label="Stage"
            labelClass="if__label__blue"
            control={control}
            error={errors?.deal_stage_id}
            options={dealStageArray}
            defaultOptions={
              defaultInfo.deal_stage_id ? [defaultInfo.deal_stage_id] : []
            }
            isLoading={isDealStageLoading}
            menuPosition="absolute"
            menuPlacement="auto"
            {...(displayFieldProps &&
              displayFieldProps.deal_stage_id && {
                ...displayFieldProps.deal_stage_id,
              })}
          />
        </div>
      ),
      closing_date: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<ConvertLeadFormFieldType>
            type="date"
            name="closing_date"
            label="Closing Date"
            labelClass="if__label__blue"
            placeholder="MM-DD-YYYY"
            register={register}
            control={control}
            error={errors?.closing_date}
            isClearable
            minDate={new Date()}
            showMonthDropdown
            showYearDropdown
          />
        </div>
      ),
      probability: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<ConvertLeadFormFieldType>
            type="currency_format"
            formatName="percentage"
            name="probability"
            label="Probability"
            labelClass="if__label__blue"
            placeholder="EX.XXX %"
            error={errors?.probability}
            control={control}
            fieldLimit={15}
            {...(displayFieldProps &&
              displayFieldProps.probability && {
                ...displayFieldProps.probability,
              })}
          />
        </div>
      ),
    },

    descriptionInfo: {
      description: (
        <div className="w-full px-[10px]">
          <FormField<ConvertLeadFormFieldType>
            type="textarea"
            name="description"
            label="Description"
            labelClass="if__label__blue"
            placeholder="Enter Description"
            register={register}
            error={errors?.description}
            fieldLimit={500}
            {...(displayFieldProps &&
              displayFieldProps.description && {
                ...displayFieldProps.description,
              })}
          />
        </div>
      ),
    },
  };

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

  return (
    <>
      {isGetLeadLoading ? (
        <>
          {[...Array(5)].map((_, idx) => (
            <div className="mx-[-15px] flex flex-wrap" key={idx}>
              <div className="w-1/2 px-[15px] sm:w-full">
                <div className="mb-[30px]">
                  <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                  <span className="skeletonBox w-full h-[48px] rounded-[8px]" />
                </div>
              </div>
              <div className="w-1/2 px-[15px] sm:w-full">
                <div className="mb-[30px]">
                  <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                  <span className="skeletonBox w-full h-[48px] rounded-[8px]" />
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          {renderFieldArray('information').length ? (
            <div className="">
              <h3 className="setting__FieldTitle">Lead Information</h3>
              <div className="mx-[-10px] flex flex-wrap">
                {renderField('information')}
              </div>
            </div>
          ) : (
            <></>
          )}

          {renderFieldArray('descriptionInfo').length ? (
            <div className="mt-[15px] sm:mt-[7px]">
              <h3 className="setting__FieldTitle">Description Information</h3>
              <div className="mx-[-10px] flex flex-wrap">
                {renderField('descriptionInfo')}
              </div>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default ConvertLeadForm;
