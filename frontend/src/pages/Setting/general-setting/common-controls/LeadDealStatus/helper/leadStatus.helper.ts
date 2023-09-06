// ** types **
import { LeadStatusFieldType } from '../types/lead-status.types';

const generateLeadStatusFormData = (formVal: LeadStatusFieldType) => {
  const dealLostReasonFormData = new FormData();
  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;

    dealLostReasonFormData.append(val, formVal[key]?.toString()?.trim() || '');
  });
  return dealLostReasonFormData;
};

export default generateLeadStatusFormData;
