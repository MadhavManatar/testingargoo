// ** types **
import { ActivityResultFieldType } from '../types/activity-result.types';

const generateActivityResultFormData = (formVal: ActivityResultFieldType) => {
  const ActivityResultFormData = new FormData();
  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;

    ActivityResultFormData.append(val, formVal[key]?.toString()?.trim() || '');
  });
  return ActivityResultFormData;
};

export default generateActivityResultFormData;
