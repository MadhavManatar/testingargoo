// ** types **
import { isInt } from 'utils/util';
import { ActivityTypeFieldType } from '../types/activity-type.types';

export const filterActivityResultData = (result?: {
  value: string | number;
  isCreatable: boolean;
}) => {
  const categoryObj: { old?: number; new?: { name: string } } = {};
  if (result) {
    const resultObj = convertStringToInteger(result);
    if (Number.isSafeInteger(resultObj)) {
      categoryObj.old = result?.value as number;
    } else if (typeof result?.value === 'string') {
      categoryObj.new = { name: result?.value };
    }
    return categoryObj;
  }
  return null;
};

export const convertStringToInteger = (props: {
  value: string | number;
  isCreatable: boolean;
}) => {
  const { isCreatable, value } = props;
  const id = Number(value);
  if (isCreatable) return value;

  if (typeof value !== 'string') return false;

  if (isInt(id)) return id;

  return value;
};

const generateActivityTypeFormData = (formVal: ActivityTypeFieldType) => {
  const ActivityTypeFormData = new FormData();
  Object.keys(formVal)
    .filter((item) => !['is_system', 'activity_result'].includes(item))
    .forEach((val) => {
      const key = val as keyof typeof formVal;
      if (
        key === 'icon' &&
        formVal.icon_type === 'Custom' &&
        formVal[key] !== undefined
      ) {
        ActivityTypeFormData.append(val, formVal[key] as File);
      } else if (formVal[key] !== undefined) {
        ActivityTypeFormData.append(
          val,
          formVal[key]?.toString()?.trim() || ''
        );
      }
    });
  if (formVal?.activity_result?.value) {
    ActivityTypeFormData.append(
      'activity_result',
      JSON.stringify(filterActivityResultData(formVal.activity_result))
    );
  } else {
    ActivityTypeFormData.append('activity_result', 'null');
  }
  return ActivityTypeFormData;
};

export const getDefaultActivityResult = (data: {
  types_results: any[];
  default_result_id: number;
}) => {
  return data?.types_results?.find(
    (resultObj: { activity_result_id: number }) =>
      resultObj?.activity_result_id === data?.default_result_id
  )?.activity_result;
};

export default generateActivityTypeFormData;
