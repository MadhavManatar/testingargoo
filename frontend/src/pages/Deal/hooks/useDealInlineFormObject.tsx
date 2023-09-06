// ** Import Packages **
import { useEffect, useRef, useState } from 'react';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayInsert,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { MultiValue, SingleValue } from 'react-select';

// ** Components **
import FormField from 'components/FormField';
import { isSingleValue } from 'components/FormField/helper';

// ** Redux **
import store from 'redux/store';

// ** API **
import { useLazyGetLeadStatusQuery } from 'redux/api/leadStatusApi';
import { useLazyGetPipelineByIdQuery } from 'redux/api/pipelineApi';

// ** Hooks**
import { useGetLeadDealSourceOptions } from 'pages/Setting/general-setting/common-controls/LeadDealSource/hooks/useLeadDealSourceServices';
import { useGetPipelineOptions } from 'pages/Setting/module-setting/Deal/Pipeline/hooks/usePipelineService';
import { useGetUserOrDescendantUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';

// ** Services **
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';

// ** Types **
import {
  FormFieldProps,
  Option,
} from 'components/FormField/types/formField.types';
import {
  AddDealFormFieldsType,
  DealDetailsType,
  DealFieldType,
  DealFormObject,
} from '../types/deals.types';

//  ** Constants **
import { LEAD_SCORE } from 'constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';

interface DealFormProps {
  control: Control<AddDealFormFieldsType>;
  errors: FieldErrors<AddDealFormFieldsType>;
  register: UseFormRegister<AddDealFormFieldsType>;
  watch: UseFormWatch<AddDealFormFieldsType>;
  getValues: UseFormGetValues<AddDealFormFieldsType>;
  setValue: UseFormSetValue<AddDealFormFieldsType>;
  editFormFlag?: boolean;
  displayField?: DealFieldType;
  displayFieldProps?: {
    [key in keyof AddDealFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddDealFormFieldsType>]?: any;
    };
  };
  contactsFields: FieldArrayWithId<AddDealFormFieldsType, 'contacts', 'id'>[];
  insertContacts: UseFieldArrayInsert<AddDealFormFieldsType, 'contacts'>;
  removeContacts: UseFieldArrayRemove;
  dealDetail?: DealDetailsType;
  inlineEditing?: boolean;
  setStageLostIds?: React.Dispatch<React.SetStateAction<number[]>>;
  setIsKeyDownCreatable: (value: React.SetStateAction<boolean>) => void;
  isKeyDownCreatableRef: React.MutableRefObject<any>;
}

const useDealInlineFormObject = (formProps: DealFormProps) => {
  // ** hooks var **
  const {
    control,
    errors,
    register,
    setValue,
    watch,
    displayFieldProps,
    dealDetail,
    editFormFlag = false,
    inlineEditing = false,
    setStageLostIds,
    isKeyDownCreatableRef,
    setIsKeyDownCreatable,
  } = formProps;
  const { auth } = store.getState();
  const { user } = auth;
  const descRef = useRef<HTMLDivElement>(null);

  // ** states **
  const [dealStageArray, setDealStageArray] = useState<
    { label: string; value: number; id: number }[]
  >([]);
  const [formInitialize, setFormInitialize] = useState(false);
  const [leadStatusOpt, setLeadStatusOpt] = useState<Option[]>([]);

  // ** watches **
  const watchPipeline = watch('pipeline_id');

  // ** APIS **
  const [getLeadStatusApi] = useLazyGetLeadStatusQuery();
  const [getDealPipelineById, { isLoading: isDealStageLoading }] =
    useLazyGetPipelineByIdQuery();

  // ** custom hooks **
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

  const { getLeadDealSourceOptions, isLeadDealSourceLoading } =
    useGetLeadDealSourceOptions();

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
    getPipelineOptions();
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

  const getDealStageOptions = async () => {
    if (watchPipeline) {
      const { data, error } = await getDealPipelineById(
        { id: watchPipeline },
        true
      );
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

        setStageLostIds?.(lostIds);
        setDealStageArray(arr);
      }
    }
  };

  const setSelectedValueRefForEnterSave = (
    e: MultiValue<Option> | SingleValue<Option>
  ) => {
    if (isSingleValue(e)) {
      if (e?.label) {
        setIsKeyDownCreatable(true);
        isKeyDownCreatableRef.current = 'is_new';
      }
    }
  };

  useEffect(() => {
    descRef?.current?.querySelector('textarea')?.focus();
  });

  const formObject: DealFormObject = {
    information: {
      lead_owner_id: (
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
          menuPlacement="bottom"
          {...(displayFieldProps &&
            displayFieldProps.lead_owner_id && {
              ...displayFieldProps.lead_owner_id,
            })}
          getOnChange={setSelectedValueRefForEnterSave}
        />
      ),
      name: (
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
      ),
      lead_status_id: (
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
          menuPlacement="bottom"
          {...(displayFieldProps &&
            displayFieldProps.lead_status_id && {
              ...displayFieldProps.lead_status_id,
            })}
          autoFocus
          getOnChange={setSelectedValueRefForEnterSave}
        />
      ),
      lead_source: (
        <FormField<AddDealFormFieldsType>
          id="lead_source"
          key={dealDetail?.lead_source?.id}
          placeholder="Select Source"
          type="creatableAsyncSelect"
          name="lead_source"
          inputMaxLength={20}
          {...(!inlineEditing && { label: 'Source' })}
          labelClass="if__label__blue"
          menuPosition="fixed"
          isClearable
          control={control}
          getOptions={getLeadDealSourceOptions}
          isLoading={isLeadDealSourceLoading}
          menuPlacement="auto"
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
          getOnChange={setSelectedValueRefForEnterSave}
        />
      ),
      closing_date: (
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
          getOnChangeDateValue={(elm) => elm?.focus()}
        />
      ),
      won_date: (
        <FormField<AddDealFormFieldsType>
          type="date"
          name="won_date"
          {...(!inlineEditing && { label: 'Won/Lost Date' })}
          labelClass="if__label__blue"
          placeholder="MM-DD-YYYY"
          register={register}
          control={control}
          // minDate={new Date()}
          error={errors?.won_date}
          isClearable
          {...(displayFieldProps &&
            displayFieldProps.won_date && {
              ...displayFieldProps.won_date,
            })}
          getOnChangeDateValue={(elm) => elm?.focus()}
        />
      ),
      probability: (
        <FormField<AddDealFormFieldsType>
          name="probability"
          {...(!inlineEditing && { label: 'Probability' })}
          labelClass="if__label__blue"
          {...(displayFieldProps &&
            displayFieldProps.probability && {
              ...displayFieldProps.probability,
            })}
          type="currency_format"
          formatName="percentage"
          placeholder="EX.XXX %"
          error={errors?.probability}
          control={control}
          fieldLimit={15}
          {...(displayFieldProps &&
            displayFieldProps.probability && {
              ...displayFieldProps.probability,
            })}
        />
      ),
      deal_value: (
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
          {...(displayFieldProps &&
            displayFieldProps.deal_value && {
              ...displayFieldProps.deal_value,
            })}
        />
      ),
      pipeline_id: (
        <FormField<AddDealFormFieldsType>
          required
          serveSideSearch
          {...(!inlineEditing && { label: 'Pipeline' })}
          labelClass="if__label__blue"
          id="pipeline_id"
          control={control}
          name="pipeline_id"
          key={dealDetail?.deal_stage?.id}
          type="asyncSelect"
          placeholder="Select Pipeline"
          error={errors?.pipeline_id}
          getOptions={getPipelineOptions}
          defaultOptions={
            dealDetail?.pipeline?.id
              ? [
                  {
                    label: `${dealDetail?.pipeline.name}`,
                    value: dealDetail?.pipeline.id,
                    selected: true,
                  },
                ]
              : []
          }
          isLoading={isPipelineLoading}
          menuPlacement="bottom"
          {...(displayFieldProps &&
            displayFieldProps.pipeline_id && {
              ...displayFieldProps.pipeline_id,
            })}
        />
      ),
      deal_stage_id: (
        <FormField<AddDealFormFieldsType>
          required
          id="deal_stage_id"
          placeholder="Select Stage"
          type="select"
          name="deal_stage_id"
          {...(!inlineEditing && { label: 'Stage' })}
          labelClass="if__label__blue"
          control={control}
          defaultOptions={
            dealDetail?.deal_stage?.id
              ? [
                  {
                    label: `${dealDetail?.deal_stage?.name}`,
                    value: dealDetail?.deal_stage?.id,
                    selected: true,
                  },
                ]
              : []
          }
          error={errors.deal_stage_id}
          options={dealStageArray}
          isLoading={isDealStageLoading}
          menuPlacement="bottom"
          {...(displayFieldProps &&
            displayFieldProps.deal_stage_id && {
              ...displayFieldProps.deal_stage_id,
            })}
          autoFocus
          getOnChange={setSelectedValueRefForEnterSave}
        />
      ),
      deal_score: (
        <FormField<AddDealFormFieldsType>
          id="lead_score"
          placeholder="Select Score"
          type="select"
          inputMode="numeric"
          name="lead_score"
          isClearable
          {...(!inlineEditing && { label: 'Score' })}
          labelClass="if__label__blue"
          control={control}
          options={LEAD_SCORE}
          menuPlacement="bottom"
          {...(displayFieldProps &&
            displayFieldProps.lead_score && {
              ...displayFieldProps.lead_score,
            })}
          autoFocus
        />
      ),
    },
    descriptionInfo: {
      description: (
        <div ref={descRef} className="w-full">
          <FormField<AddDealFormFieldsType>
            type="textarea"
            name="description"
            {...(!inlineEditing && { label: 'Description' })}
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

export default useDealInlineFormObject;
