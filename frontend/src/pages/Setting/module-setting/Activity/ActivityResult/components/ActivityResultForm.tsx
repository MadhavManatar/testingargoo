// ** Components **
import FormField from 'components/FormField';

// ** Import Types **
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

// ** types **
import { ActivityResultFieldType } from '../types/activity-result.types';

// ** use services **
import { useGetActivityTypesOptions } from '../hooks/useGetActivityTypesService';

interface ActivityResultFormProps {
  errors: FieldErrors<ActivityResultFieldType>;
  register: UseFormRegister<ActivityResultFieldType>;
  control: Control<ActivityResultFieldType>;
  activityTypes?: {
    activityTypeId: number;
    name: string;
    middleTableId: number;
  }[];
  universalResult: boolean;
  setUniversalResult: React.Dispatch<React.SetStateAction<boolean>>;
}

function ActivityResultForm(props: ActivityResultFormProps) {
  const {
    errors,
    register,
    control,
    activityTypes,
    universalResult,
    setUniversalResult,
  } = props;
  const { getActivityTypeOptions, isActivityTypeLoading } =
    useGetActivityTypesOptions();
  return (
    <>
      <div className="w-full">
        <FormField
          placeholder="Name"
          name="result"
          required
          error={errors?.result}
          type="text"
          label="Name"
          labelClass="if__label__blue"
          register={register}
        />
      </div>
      <div className="w-full">
        <FormField
          name="is_universal"
          type="checkbox"
          label="Mark as Universal"
          register={register}
          onChange={(event) => {
            setUniversalResult((event.target as HTMLInputElement).checked);
          }}
        />
      </div>
      {!universalResult && (
        <div className="w-full relative z-[4]">
          <FormField<ActivityResultFieldType>
            id="activity_type_id"
            isMulti
            key={activityTypes?.length}
            required={!universalResult}
            placeholder="Select Type"
            type="asyncSelect"
            serveSideSearch
            name="activity_types"
            label="Type"
            labelClass="if__label__blue"
            control={control}
            error={errors?.activity_types}
            getOptions={getActivityTypeOptions}
            defaultOptions={
              activityTypes?.length
                ? activityTypes?.map((obj) => ({
                    label: obj.name,
                    selected: true,
                    value: obj.activityTypeId,
                  }))
                : []
            }
            isLoading={isActivityTypeLoading}
            menuPlacement="bottom"
            menuPosition="fixed"
          />
        </div>
      )}
      <div className="w-full">
        <FormField
          name="isMemo"
          type="checkbox"
          label="Required Memo"
          register={register}
        />
      </div>
    </>
  );
}

export default ActivityResultForm;
