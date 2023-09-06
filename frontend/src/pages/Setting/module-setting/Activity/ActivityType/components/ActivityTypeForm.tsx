// ** import Packages **
import { useEffect, useState } from 'react';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';

// ** Service **
import { useGetActivityResultOptions } from '../../ActivityResult/hooks/useGetActivityTypesService';

// ** types **
import { FormFieldProps } from 'components/FormField/types/formField.types';
import { useGetDefaultActivityType } from '../hooks/useActivityType';
import {
  ActivityTypeFieldType,
  ActivityTypeResponseType,
} from '../types/activity-type.types';

// ** others **
import ActivityTypeIcon from './ActivityTypeIcon';
import IconTypeList from './IconTypeList';

// ** Helper **
import { isSingleValue } from 'components/FormField/helper';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';
import { ACTIVITY_TYPE_MAIL_STATUS_OPTIONS } from 'constant/activity.constant';

interface ActivityTypeFormProps {
  errors: FieldErrors<ActivityTypeFieldType>;
  register: UseFormRegister<ActivityTypeFieldType>;
  control: Control<ActivityTypeFieldType>;
  setValue: UseFormSetValue<ActivityTypeFieldType>;
  setIconImage: (fileObj: File | string) => void;
  iconImage?: string | File;
  onFileSelect?: React.ChangeEventHandler<HTMLInputElement>;
  iconImageName: string;
  setIconImageName: React.Dispatch<React.SetStateAction<string>>;
  setIconType: React.Dispatch<React.SetStateAction<string>>;
  iconType: string;
  ActivityTypeData?: ActivityTypeResponseType;
  displayFieldProps?: {
    [key in keyof ActivityTypeFieldType]?: {
      [formKey in keyof FormFieldProps<ActivityTypeFieldType>]?: any;
    };
  };
}

function ActivityType(props: ActivityTypeFormProps) {
  const {
    errors,
    register,
    control,
    setIconImage,
    setValue,
    iconImage,
    onFileSelect,
    iconImageName,
    setIconImageName,
    setIconType,
    iconType,
    ActivityTypeData,
    displayFieldProps,
  } = props;

  const { getDefaultActivityType, isGetDefaultActivityTypLoading } =
    useGetDefaultActivityType();

  const disableField =
    ActivityTypeData?.is_system || ActivityTypeData?.is_default;

  const [defaultActivityResult, setDefaultActivityResult] = useState<any>();
  const { getActivityResultOptions, isActivityResultsLoading } =
    useGetActivityResultOptions({
      activityTypeId: ActivityTypeData?.id,
      isOtherOptionDisabled: true,
    });

  useEffect(() => {
    getDefaultResult();
  }, []);

  useEffect(() => {
    if (defaultActivityResult?.id) {
      setValue('activity_result.value', defaultActivityResult?.id);
    }
  }, [defaultActivityResult]);

  const getDefaultResult = async () => {
    const res = await getActivityResultOptions();
    if (res?.extraInfo?.length) {
      const defaultResult = res.option?.find(
        (result) => result?.id === ActivityTypeData?.activity_result?.id
      );
      setDefaultActivityResult(defaultResult);
    }
  };

  return (
    <>
      <FormField<ActivityTypeFieldType>
        required
        placeholder="Pick a name like 'Value Proportion'"
        type="text"
        label="Name"
        labelClass="if__label__blue"
        name="name"
        error={errors?.name}
        register={register}
        fieldLimit={25}
        disabled={disableField}
        autoFocus
      />
      <FormField<ActivityTypeFieldType>
        id="parent_activity_type"
        required
        key={ActivityTypeData?.parent_type?.id}
        placeholder="Select Parent Activity Type"
        type="asyncSelect"
        name="parent_type"
        label="Parent Activity Type"
        labelClass="if__label__blue"
        serveSideSearch
        control={control}
        error={errors?.parent_type}
        getOptions={getDefaultActivityType}
        isLoading={isGetDefaultActivityTypLoading}
        menuPlacement="bottom"
        menuPosition="fixed"
        defaultOptions={
          ActivityTypeData?.parent_type
            ? [
                {
                  label: ActivityTypeData?.parent_type.name,
                  value: ActivityTypeData?.parent_type.id,
                  selected: true,
                },
              ]
            : []
        }
        disabled={disableField}
      />
      <FormField<ActivityTypeFieldType>
        id="activity_result"
        key={ActivityTypeData?.activity_result || defaultActivityResult}
        placeholder="Select Result"
        type="CreatableAsyncSelectFormFieldForSearch"
        name="activity_result.value"
        label="Default Result"
        labelClass="if__label__blue"
        inputMaxLength={50}
        menuPlacement="auto"
        menuPosition="absolute"
        control={control}
        serveSideSearch
        getOptions={getActivityResultOptions}
        isLoading={isActivityResultsLoading}
        defaultOptions={
          ActivityTypeData?.activity_result
            ? [
                {
                  label: ActivityTypeData?.activity_result?.result,
                  value: ActivityTypeData?.activity_result?.id,
                  selected: true,
                },
              ]
            : defaultActivityResult?.id
            ? [
                {
                  label: defaultActivityResult?.result,
                  value: defaultActivityResult?.id,
                  selected: true,
                },
              ]
            : []
        }
        getOnChange={(e) => {
          if (isSingleValue(e) && e?.value) {
            setValue(
              `activity_result.value`,
              typeof e.value === 'number' ? e?.value : `${e?.value}`
            );
            // eslint-disable-next-line no-underscore-dangle
            setValue(`activity_result.isCreatable`, !!e?.__isNew__);
          }

          if (isSingleValue(e) && !e?.value) {
            setValue(`activity_result.value`, '');
          }
        }}
        error={errors?.activity_result?.value}
        isClearable
        {...(displayFieldProps &&
          displayFieldProps.activity_result && {
            ...displayFieldProps.activity_result,
          })}
        limit={OPTION_LISTING_DATA_LIMIT}
      />

      <FormField<ActivityTypeFieldType>
        id="default_activity_type"
        placeholder="Select Default Notifications"
        type="select"
        name="email_status"
        label="Default Email Notification"
        labelClass="if__label__blue"
        control={control}
        menuPlacement="bottom"
        menuPosition="fixed"
        options={ACTIVITY_TYPE_MAIL_STATUS_OPTIONS}
      />

      <FormField<ActivityTypeFieldType>
        register={register}
        id="color"
        type="color"
        name="color"
        error={errors.color}
        required
        placeholder="Pick a color"
        label="Color"
        labelClass="if__label__blue"
        fieldLimit={25}
      />

      <IconTypeList
        setIconType={setIconType}
        setIconImage={setIconImage}
        iconType={iconType}
        disabled={disableField}
      />

      <div className='orHR my-[25px] text-center text-light__TextColor text-[16px] uppercase font-biotif__Medium relative before:content-[""] before:top-[10px] before:left-[50%] before:translate-x-[-50%] before:absolute before:h-[1px] before:w-[calc(100%_-_20px)] before:bg-whiteScreen__BorderColor'>
        <span className="inline-block z-[2] relative px-[10px] bg-white">
          OR
        </span>
      </div>

      <ActivityTypeIcon
        errors={errors}
        setFileObjectCb={setIconImage}
        image={iconImage}
        onFileChange={onFileSelect}
        iconImageName={iconImageName}
        setIconImageName={setIconImageName}
        disabled={disableField}
      />
    </>
  );
}

export default ActivityType;
