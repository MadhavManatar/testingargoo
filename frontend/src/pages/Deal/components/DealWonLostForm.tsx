// ** external packages **
import { Fragment, useEffect, useState } from 'react';
import {
  Control,
  UseFormReset,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** components **
import FormField from 'components/FormField';

// ** types **
import { FormFieldProps } from 'components/FormField/types/formField.types';
import {
  AddDealWonLostFormFieldsType,
  DealWonLostFieldType,
  DealWonLostFormObject,
} from '../types/deals.types';
import { entityDataType } from 'pages/Activity/types/activity.types';
import { useLazyGetLeadPipelineStagesByLeadIdQuery } from 'redux/api/leadApi';

interface DealWonLostFormProps {
  control: Control<AddDealWonLostFormFieldsType>;
  errors: FieldErrors<AddDealWonLostFormFieldsType>;
  register: UseFormRegister<AddDealWonLostFormFieldsType>;
  watch: UseFormWatch<AddDealWonLostFormFieldsType>;
  getValues: UseFormGetValues<AddDealWonLostFormFieldsType>;
  setValue: UseFormSetValue<AddDealWonLostFormFieldsType>;
  reset: UseFormReset<AddDealWonLostFormFieldsType>;
  displayField?: DealWonLostFieldType;
  displayFieldProps?: {
    [key in keyof AddDealWonLostFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddDealWonLostFormFieldsType>]?: any;
    };
  };
  dealWonLostData: { entityData?: entityDataType; stageType: string };
}

const DealWonLostForm = (formProps: DealWonLostFormProps) => {
  // ** hooks var **
  const {
    control,
    errors,
    displayField,
    dealWonLostData,
    setValue,
    watch,
    register,
  } = formProps;

  // ** states **
  const [stageType, setStageType] = useState<string>('Win');

  // ** watches **
  const watchStageType = watch('stage_type');

  // ** custom hooks **
  const [getLeadPipelineStagesByLeadIdAPI, { isLoading }] =
    useLazyGetLeadPipelineStagesByLeadIdQuery();

  const getStagesData = async (id: number) => {
    const { data, error } = await getLeadPipelineStagesByLeadIdAPI(
      {
        id,
        params: {
          'q[is_deal]': true,
          stageType: stageType || 'Won',
        },
      },
    );
    let stagesOption;
    if (!error && data) {
      const stagesInfo = data;
      stagesOption = stagesInfo.map(
        (val: { name?: string; id: number }, index: number) => ({
          label: `${val.name}`,
          value: val.id,
          ...(index === 0 && { selected: true }),
        })
      );
      const temp = {
        option: stagesOption,
        count: data.length,
      };
      return temp;
    }
  };

  const getStagesOptions = async () => {
    const data = await getStagesData(dealWonLostData.entityData?.id || 0);
    return data;
  };

  useEffect(() => {
    getStagesOptions();
  }, []);

  useEffect(() => {
    if (watchStageType) {
      setStageType(watchStageType);
      setValue('stage_id', undefined);
    }
  }, [watchStageType]);

  const formObject: DealWonLostFormObject = {
    information: {
      stage_type: (
        <div className="px-[10px] w-full sm:w-full">
          <FormField<AddDealWonLostFormFieldsType>
            wrapperClass="department__add__member"
            type="radio"
            name="stage_type"
            label=""
            options={[
              {
                label: 'Won',
                value: 'Win',
                checked:
                  (dealWonLostData?.stageType &&
                    dealWonLostData?.stageType === 'Won') ||
                  true,
              },
              {
                label: 'Lost',
                value: 'Lost',
                checked:
                  dealWonLostData?.stageType &&
                  dealWonLostData?.stageType === 'Lost',
              },
            ]}
            register={register}
            onClick={(e) => setValue('stage_type', e.currentTarget.value)}
          // error={errors.memberListType}
          />
        </div>
      ),
      stage_id: (
        <div className="px-[10px] w-full sm:w-full">
          <FormField<AddDealWonLostFormFieldsType>
            required
            key={watchStageType}
            serveSideSearch
            label="Select Stage"
            labelClass="if__label__blue"
            id="stage_id"
            control={control}
            name="stage_id"
            // key={dealWonLostData?.entityData?.id}
            type="asyncSelect"
            placeholder="Select Stage"
            error={errors?.stage_id}
            getOptions={getStagesOptions}
            isLoading={isLoading}
            menuPlacement="bottom"
          // menuPosition="absolute"
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
        {renderFieldArray(value).map((el) => {
          if (el as keyof typeof temp) {
            return (
              <Fragment key={el}>{temp[el as keyof typeof temp]} </Fragment>
            );
          }
          return <></>;
        })}
      </>
    );
  };

  return (
    <>
      {renderFieldArray('information').length ? (
        <div className="">
          <div className="mx-[-10px] flex flex-wrap">
            {renderField('information')}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default DealWonLostForm;
