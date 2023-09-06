// ** Import Packages **
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// ** Components **
import FormField from 'components/FormField';
import RelatedContactFormFieldChild from 'pages/Lead/components/LeadFormMiniComponents';

// ** Redux **
import { getQuickPopup } from 'redux/slices/quickPopupDefaultSlice';
import store from 'redux/store';

// ** hooks-services **
import usePermission from 'hooks/usePermission';
import { useGetAccountsRelatedToContactOptions } from 'pages/Account/hooks/useAccountService';
import { useGetPipelineOptions } from 'pages/Setting/module-setting/Deal/Pipeline/hooks/usePipelineService';
import { useGetUserOrDescendantUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';

// ** Services **
import { useGetLeadDealSourceOptions } from 'pages/Setting/general-setting/common-controls/LeadDealSource/hooks/useLeadDealSourceServices';
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';

// ** API **
import { useLazyFieldIsExistsQuery } from 'redux/api/generalServiceApi';
import { useLazyGetLeadStatusQuery } from 'redux/api/leadStatusApi';
import { useLazyGetPipelineByIdQuery } from 'redux/api/pipelineApi';

// ** Hooks **
import { useGetContactsRelatedAccount } from 'pages/Contact/hooks/useContactService';
import useDefaultPipeline from './useDefaultPipeline';

// ** Types **
import { Option } from 'components/FormField/types/formField.types';
import { RelatedContact } from 'pages/Contact/types/contacts.types';
import {
  AddDealFormFieldsType,
  DealFormObject,
  DealFormObjectPropsType,
  dealDefaultInfoType,
} from '../types/deals.types';

//  ** Constants **
import { LEAD_SCORE } from 'constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';

// ** Other **
import { isSingleValue } from 'components/FormField/helper';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

const useDealFormObject = (formProps: DealFormObjectPropsType) => {
  const {
    control,
    errors,
    register,
    setValue,
    watch,
    displayFieldProps,
    contactsFields,
    removeContacts,
    dealDetail,
    editFormFlag = false,
    inlineEditing = false,
    setStageLostIds,
    appendContacts,
    setEmailTimelineModal,
    setDuplicateMailModal,
  } = formProps;
  const { auth } = store.getState();
  const { user } = auth;

  // ** State **
  const [accountKey, setAccountKey] = useState<number>();
  const [formInitialize, setFormInitialize] = useState(false);
  const [leadStatusOpt, setLeadStatusOpt] = useState<Option[]>([]);
  const [defaultInfo, setDefaultInfo] = useState<dealDefaultInfoType>({});
  const [accountRelatedContacts, setAccountRelatedContacts] =
    useState<RelatedContact[]>();
  const [dealStageArray, setDealStageArray] = useState<
    { label: string; value: number; id: number }[]
  >([]);
  const [selectedContactOptions, setSelectedContactOptions] = useState<{
    [key: string]: Option;
  }>({});
  const [contactRelatedAccounts, setContactRelatedAccounts] = useState<
    Option[]
  >([]);

  // ** watches **
  const watchPipeline = watch('pipeline_id');
  const watchContact = watch('contacts');
  const watchAccount = watch('related_account');

  // ** API **
  const [getLeadStatusApi] = useLazyGetLeadStatusQuery();
  const [getDealPipelineById, { isLoading: isDealStageLoading }] =
    useLazyGetPipelineByIdQuery();

  // ** custom hooks **
  const selectorQuick = useSelector(getQuickPopup);
  const {
    userOrDescendantUserOptions: getLeadOwnerOption,
    isDescendantUsersLoading,
    isUsersLoading,
  } = useGetUserOrDescendantUserOptions(
    editFormFlag
      ? { ...MODULE_PERMISSION.DEAL.update }
      : { ...MODULE_PERMISSION.DEAL.create }
  );

  const { getPipelineOptions, isPipelineLoading } = useGetPipelineOptions();

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

  const [fieldIsExistsAPI] = useLazyFieldIsExistsQuery();
  const { initialPipelineOption } = useDefaultPipeline({
    getDealStageOptions,
    setDefaultInfo,
    getPipelineOptions,
  });
  const { getLeadDealSourceOptions, isLeadDealSourceLoading } =
    useGetLeadDealSourceOptions();

  const {
    readAccountPermission,
    createAccountPermission,
    readContactPermission,
    createContactPermission,
  } = usePermission();

  useEffect(() => {
    if (watchPipeline) {
      setFormInitialize(true);
      if (formInitialize) {
        setValue('deal_stage_id', undefined);
      }
      getDealStageOptions();
    }
  }, [watchPipeline]);

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
    if (dealDetail?.pipeline?.id) {
      const defaultPipelineId = {
        label: `${dealDetail?.pipeline.name}`,
        value: dealDetail?.pipeline.id,
        selected: true,
      };
      setDefaultInfo((prev) => ({
        ...prev,
        pipeline_id: defaultPipelineId,
      }));
    }
    if (dealDetail?.deal_stage?.id) {
      const defaultStageId = {
        label: `${dealDetail?.deal_stage?.name}`,
        value: dealDetail?.deal_stage?.id,
        selected: true,
      };
      setDefaultInfo((prev) => ({
        ...prev,
        deal_stage_id: defaultStageId,
      }));
    }
  }, [dealDetail]);

  useEffect(() => {
    if (!dealDetail?.id) {
      initialPipelineOption();
    }
    getLeadStatusData();
  }, []);

  const getLeadStatusData = async () => {
    const { data, error } = await getLeadStatusApi(
      {
        data: {
          query: {
            ...MODULE_PERMISSION.DEAL.read,
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
        ...(!dealDetail?.lead_status?.id && index === 0 && { selected: true }),
      }));

      if (!dealDetail?.lead_status?.id) {
        setValue('lead_status_id', options[0].value);
      }
      setLeadStatusOpt([...options]);
    }
  };

  async function getDealStageOptions(id?: number) {
    const pipelineId = watchPipeline || id;
    if (pipelineId) {
      const { data, error } = await getDealPipelineById({ id: pipelineId });
      if (!error && data) {
        const arr: { label: string; value: number; id: number }[] = [];
        const lostIds: number[] = [];
        data?.stages.map(
          (item: { name: string; id: number; stage_type: string }) => {
            if (item.stage_type === 'Lost') {
              lostIds.push(item.id);
            }
            arr.push({ label: item.name, value: item.id, id: item.id });
            return arr;
          }
        );
        setDealStageArray(arr);
        setStageLostIds?.(lostIds);
        if (
          dealDetail?.id &&
          dealDetail.pipeline_id === data?.stages?.[0]?.pipeline_id
        ) {
          if (
            dealDetail.deal_stage_history?.find((obj) => obj.isCurrentActive)
              ?.stage_id
          ) {
            setValue(
              'deal_stage_id',
              dealDetail.deal_stage_history?.find((obj) => obj.isCurrentActive)
                ?.stage_id as number
            );
          }
        } else if (data?.stages[0]?.id) {
          setValue('deal_stage_id', data?.stages[0]?.id);
        }
        return arr;
      }
    }
  }

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

  const formObject: DealFormObject = {
    information: {
      lead_owner_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddDealFormFieldsType>
            id="lead_owner_id"
            placeholder="Select Owner"
            type="asyncSelect"
            name="lead_owner_id"
            {...(!inlineEditing && { label: 'Owner' })}
            labelClass="if__label__blue"
            icon="userProfileFilledIcon"
            iconPosition="left"
            control={control}
            error={errors?.lead_owner_id}
            isLoading={isDescendantUsersLoading || isUsersLoading}
            getOptions={getLeadOwnerOption}
            defaultOptions={
              dealDetail?.lead_owner?.id
                ? [
                    {
                      label: `${dealDetail?.lead_owner.first_name} ${dealDetail?.lead_owner.last_name}`,
                      value: dealDetail?.lead_owner.id,
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
            menuPlacement="bottom"
            {...(displayFieldProps &&
              displayFieldProps.lead_owner_id && {
                ...displayFieldProps.lead_owner_id,
              })}
          />
        </div>
      ),
      name: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddDealFormFieldsType>
            required
            type="text"
            name="name"
            {...(!inlineEditing && { label: 'Name' })}
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
          <FormField<AddDealFormFieldsType>
            id="lead_status_id"
            placeholder="Select Status"
            type="select"
            name="lead_status_id"
            {...(!inlineEditing && { label: 'Status' })}
            labelClass="if__label__blue"
            control={control}
            error={errors?.lead_status_id}
            options={leadStatusOpt}
            menuPosition="absolute"
            menuPlacement="bottom"
            {...(displayFieldProps &&
              displayFieldProps.lead_status_id && {
                ...displayFieldProps.lead_status_id,
              })}
          />
        </div>
      ),
      lead_source: (
        <div className="w-1/2 px-[10px] sm:w-full">
          <FormField<AddDealFormFieldsType>
            id="lead_source"
            key={dealDetail?.lead_source?.id}
            placeholder="Select or Enter Source"
            type="creatableAsyncSelect"
            name="lead_source"
            inputMaxLength={20}
            {...(!inlineEditing && { label: 'Source' })}
            labelClass="if__label__blue"
            isClearable
            control={control}
            getOptions={getLeadDealSourceOptions}
            isLoading={isLeadDealSourceLoading}
            menuPosition="absolute"
            menuPlacement="bottom"
            error={errors?.lead_source}
            {...(displayFieldProps &&
              displayFieldProps.lead_source && {
                ...displayFieldProps.lead_source,
              })}
            defaultOptions={
              dealDetail?.lead_source?.id
                ? [
                    {
                      label: dealDetail?.lead_source?.name,
                      value: dealDetail?.lead_source?.id,
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
          <FormField<AddDealFormFieldsType>
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
            register={register}
            serveSideSearch
            getOptions={getGetAccountsRelatedToContactOptions}
            getOnChange={(e) => {
              if (isSingleValue(e) && typeof e?.value === 'number') {
                getContactsRelatedAccountOptions(e.value);
              } else if (
                !e &&
                setEmailTimelineModal &&
                dealDetail &&
                dealDetail?.id
              ) {
                const d: number = watchAccount as number;
                if (d === dealDetail?.related_account?.id) {
                  setEmailTimelineModal({
                    isOpen: true,
                    data: {
                      key: 'related_account',
                      data: dealDetail?.related_account?.id,
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
              (dealDetail?.related_account?.id
                ? [
                    {
                      label: `${dealDetail?.related_account?.name || ''}`,
                      value: dealDetail?.related_account?.id,
                    },
                  ]
                : selectorQuick.account?.name &&
                  selectorQuick.account?.id && [
                    {
                      label: selectorQuick.account?.name,
                      value: selectorQuick.account?.id,
                    },
                  ])
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
          {!inlineEditing && (
            <label className="if__label if__label__blue w-full !mb-[10px] px-[10px]">
              Related Contacts
            </label>
          )}
          {contactsFields.map((field, index) => {
            return (
              <Fragment key={field.id}>
                <RelatedContactFormFieldChild
                  isCreatablePermission={createContactPermission}
                  isDisabled={!readContactPermission}
                  selectedContactOptions={selectedContactOptions}
                  checkFieldOnBlur={checkFieldOnBlur}
                  setSelectedContactOptions={setSelectedContactOptions}
                  contactsFields={contactsFields}
                  index={index}
                  field={field}
                  removeContacts={removeContacts}
                  watchAccount={watchAccount}
                  displayFieldProps={displayFieldProps}
                  related_contacts={
                    accountRelatedContacts || dealDetail?.related_contacts
                  }
                  setContactRelatedAccounts={setContactRelatedAccounts}
                  setAccountKey={setAccountKey}
                  setEmailTimelineModal={setEmailTimelineModal}
                />
              </Fragment>
            );
          })}
          <div className="w-full px-[10px] mt-[-6px] mb-[17px]">
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
          {!inlineEditing && (
            <label className="inline-block font-biotif__Regular text-light__TextColor text-[14px] absolute top-0 right-[31px]">
              Primary
            </label>
          )}
        </div>
      ),
      closing_date: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddDealFormFieldsType>
            type="date"
            name="closing_date"
            {...(!inlineEditing && { label: 'Closing Date' })}
            labelClass="if__label__blue"
            placeholder="MM-DD-YYYY"
            register={register}
            control={control}
            error={errors?.closing_date}
            isClearable
            {...(displayFieldProps &&
              displayFieldProps.closing_date && {
                ...displayFieldProps.closing_date,
              })}
          />
        </div>
      ),
      probability: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddDealFormFieldsType>
            type="currency_format"
            formatName="percentage"
            name="probability"
            {...(!inlineEditing && { label: 'Probability' })}
            labelClass="if__label__blue"
            placeholder="EX.XXX %"
            inputMode="numeric"
            error={errors?.probability}
            control={control}
            {...(displayFieldProps &&
              displayFieldProps.probability && {
                ...displayFieldProps.probability,
              })}
          />
        </div>
      ),
      deal_value: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddDealFormFieldsType>
            type="currency_format"
            formatName="currency"
            name="deal_value"
            {...(!inlineEditing && { label: 'Value' })}
            labelClass="if__label__blue"
            icon="currencyFilledIcon"
            iconPosition="left"
            placeholder="EX. $X,XXX.XX"
            error={errors?.deal_value}
            control={control}
            fieldLimit={21}
            inputMode="numeric"
            {...(displayFieldProps &&
              displayFieldProps.deal_value && {
                ...displayFieldProps.deal_value,
              })}
          />
        </div>
      ),
      deal_score: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddDealFormFieldsType>
            id="lead_score"
            isClearable
            placeholder="Select Score"
            type="select"
            name="lead_score"
            inputMode="numeric"
            {...(!inlineEditing && { label: 'Score' })}
            labelClass="if__label__blue"
            control={control}
            options={LEAD_SCORE}
            menuPosition="absolute"
            menuPlacement="bottom"
            {...(displayFieldProps &&
              displayFieldProps.lead_score && {
                ...displayFieldProps.lead_score,
              })}
          />
        </div>
      ),
      pipeline_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddDealFormFieldsType>
            required
            serveSideSearch
            {...(!inlineEditing && { label: 'Pipeline' })}
            labelClass="if__label__blue"
            id="pipeline_id"
            control={control}
            name="pipeline_id"
            key={defaultInfo.pipeline_id}
            type="asyncSelect"
            placeholder="Select Pipeline"
            error={errors?.pipeline_id}
            getOptions={getPipelineOptions}
            defaultOptions={
              defaultInfo.pipeline_id ? [defaultInfo.pipeline_id] : []
            }
            isLoading={isPipelineLoading}
            menuPosition="absolute"
            menuPlacement="bottom"
            {...(displayFieldProps &&
              displayFieldProps.pipeline_id && {
                ...displayFieldProps.pipeline_id,
              })}
          />
        </div>
      ),
      deal_stage_id: (
        <div className="px-[10px] w-1/2 sm:w-full">
          <FormField<AddDealFormFieldsType>
            required
            id="deal_stage_id"
            placeholder="Select Stage"
            type="select"
            name="deal_stage_id"
            key={defaultInfo.deal_stage_id}
            {...(!inlineEditing && { label: 'Stage' })}
            labelClass="if__label__blue"
            control={control}
            defaultOptions={
              defaultInfo.deal_stage_id ? [defaultInfo.deal_stage_id] : []
            }
            error={errors.deal_stage_id}
            options={dealStageArray}
            isLoading={isDealStageLoading || isDealStageLoading}
            menuPosition="absolute"
            menuPlacement="bottom"
            {...(displayFieldProps &&
              displayFieldProps.deal_stage_id && {
                ...displayFieldProps.deal_stage_id,
              })}
          />
        </div>
      ),
    },

    descriptionInfo: {
      description: (
        <div className="w-full px-[10px]">
          <FormField<AddDealFormFieldsType>
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

export default useDealFormObject;
