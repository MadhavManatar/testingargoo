// ** types **
import { LeadDealSourceFieldType } from '../types/lead-deal-source.types';

const generateLeadDealSourceFormData = (formVal: LeadDealSourceFieldType) => {
  const leadDealSourceFormData = new FormData();
  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;

    leadDealSourceFormData.append(val, formVal[key]?.toString()?.trim() || '');
  });
  return leadDealSourceFormData;
};

export default generateLeadDealSourceFormData;
