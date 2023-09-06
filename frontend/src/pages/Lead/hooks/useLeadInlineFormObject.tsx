// ** external packages **
import { useEffect, useRef, useState } from 'react';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { MultiValue, SingleValue } from 'react-select';

// ** redux **
import store from 'redux/store';

// ** API **
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';
import { useLazyGetLeadStatusQuery } from 'redux/api/leadStatusApi';
import { useLazyGetLeadTempStatusQuery } from 'redux/api/leadTempStatusApi';

// ** components **
import FormField from 'components/FormField';

// ** types **
import {
  FormFieldProps,
  Option,
} from 'components/FormField/types/formField.types';
import {
  AddLeadFormFieldsType,
  LeadDetailsType,
  LeadInlineFormFieldObject,
  LeadSectionType,
} from 'pages/Lead/types/lead.type';

// ** services **
import { useGetAccountsOptions } from 'pages/Account/hooks/useAccountService';
import { useGetLeadDealSourceOptions } from 'pages/Setting/general-setting/common-controls/LeadDealSource/hooks/useLeadDealSourceServices';
import { useGetUserOrDescendantUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';

//  ** Constant **
import { LEAD_SCORE } from 'constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';

// ** Other **
import { isSingleValue } from 'components/FormField/helper';

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
  displayLabel?: boolean;
  setIsKeyDownCreatable: (value: React.SetStateAction<boolean>) => void;
  isKeyDownCreatableRef: React.MutableRefObject<any>;
}

const useLeadInlineFormObject = (formProps: LeadFormProps) => {
  const {
    control,
    errors,
    register,
    setValue,
    displayFieldProps,
    editFormFlag = false,
    leadDetail,
    setIsKeyDownCreatable,
    isKeyDownCreatableRef,
  } = formProps;
  const { auth } = store.getState();
  const { user } = auth;
  const descRef = useRef<HTMLDivElement>(null);

  const [leadTemperatureStatusOpt, setLeadTemperatureStatusOpt] = useState<
    Option[]
  >([]);
  const [leadStatusOpt, setLeadStatusOpt] = useState<Option[]>([]);

  // ** API **
  const [getLeadStatusApi] = useLazyGetLeadStatusQuery();
  const [getLeadTempStatusApi] = useLazyGetLeadTempStatusQuery();
  // ** Custom hooks **
  const {
    userOrDescendantUserOptions: getLeadOwnerOption,
    isDescendantUsersLoading,
    isUsersLoading,
  } = useGetUserOrDescendantUserOptions(
    editFormFlag
      ? { ...MODULE_PERMISSION.LEAD.update }
      : { ...MODULE_PERMISSION.LEAD.create }
  );

  const { getAccountsOptions, isAccountsLoading } = useGetAccountsOptions({});

  const { getLeadDealSourceOptions, isLeadDealSourceLoading } =
    useGetLeadDealSourceOptions();

  useEffect(() => {
    if (leadDetail?.id) {
      getLeadStatusData();
      getLeadTempStatusData();
    }
  }, [leadDetail?.id]);

  const getLeadTempStatusData = async () => {
    const { data, error } = await getLeadTempStatusApi(
      {
        data: {
          query: {
            ...MODULE_PERMISSION.LEAD.read,
            'q[type]': EntityAttributesEnum.LEAD_TEMP_STATUS,
          },
        },
      },
      true
    );
    if (data && !error) {
      const options = data?.rows?.map((option: any, index: number) => ({
        label: option.name,
        value: option.id,
        ...(!leadDetail?.lead_temp?.id && index === 0 && { selected: true }),
      }));

      if (!leadDetail?.lead_temp?.id) {
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

      if (!leadDetail?.lead_status_id) {
        setValue('lead_status_id', options[0].value);
      }
      setLeadStatusOpt([...options]);
    }
  };

  const setSelectedValueRefOnChangeEvent = (
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

  const formObject: LeadInlineFormFieldObject = {
    information: {
      lead_owner_id: (
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
          getOnChange={setSelectedValueRefOnChangeEvent}
          menuPosition="absolute"
          menuPlacement="auto"
          {...(displayFieldProps &&
            displayFieldProps.lead_owner_id && {
              ...displayFieldProps.lead_owner_id,
            })}
        />
      ),
      name: (
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
      ),
      lead_status_id: (
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
          getOnChange={setSelectedValueRefOnChangeEvent}
          autoFocus
        />
      ),
      lead_temp_id: (
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
          getOnChange={setSelectedValueRefOnChangeEvent}
          autoFocus
        />
      ),

      related_account: (
        <FormField<AddLeadFormFieldsType>
          id="related_account"
          placeholder="Select Account"
          type="creatableAsyncSelect"
          name="related_account"
          label="Related Account"
          icon="buildingFilledIcon"
          iconPosition="left"
          labelClass="if__label__blue"
          aria-placeholder="Select Account"
          control={control}
          inputMaxLength={50}
          getOptions={getAccountsOptions}
          isLoading={isAccountsLoading}
          error={errors?.related_account}
          isClearable
          defaultOptions={
            leadDetail?.related_account?.id
              ? [
                  {
                    label: `${leadDetail?.related_account.name || ''}`,
                    value: leadDetail?.related_account.id,
                  },
                ]
              : []
          }
          menuPosition="absolute"
          menuPlacement="auto"
          {...(displayFieldProps &&
            displayFieldProps.related_account && {
              ...displayFieldProps.related_account,
            })}
        />
      ),
      deal_value: (
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
      ),

      lead_source: (
        <FormField<AddLeadFormFieldsType>
          id="lead_source"
          placeholder="Select Source"
          type="creatableAsyncSelect"
          name="lead_source"
          inputMaxLength={40}
          {...(true && { label: 'Source' })}
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
            leadDetail?.lead_source?.id
              ? [
                  {
                    label: leadDetail?.lead_source?.name,
                    value: leadDetail?.lead_source?.id,
                  },
                ]
              : []
          }
          getOnChange={setSelectedValueRefOnChangeEvent}
        />
      ),
      lead_score: (
        <FormField<AddLeadFormFieldsType>
          id="lead_score"
          placeholder="Select Score"
          type="select"
          name="lead_score"
          inputMode="numeric"
          label="Score"
          isClearable
          labelClass="if__label__blue"
          control={control}
          options={LEAD_SCORE}
          menuPosition="absolute"
          menuPlacement="auto"
          {...(displayFieldProps &&
            displayFieldProps.lead_score && {
              ...displayFieldProps.lead_score,
            })}
          getOnChange={setSelectedValueRefOnChangeEvent}
          autoFocus
        />
      ),
    },

    descriptionInfo: {
      description: (
        <div ref={descRef} className="w-full">
          <FormField<AddLeadFormFieldsType>
            type="textarea"
            name="description"
            label="Description"
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

export default useLeadInlineFormObject;
