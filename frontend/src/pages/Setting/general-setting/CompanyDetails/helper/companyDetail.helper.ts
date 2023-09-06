// ** types **

import { CompanySettingsFormFields } from '../types/company-settings.types';

const generateCompanyFormData = (formVal: CompanySettingsFormFields) => {
  const CompanyFormData = new FormData();
  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;
    if (key === 'organization_logo' && formVal[key] !== undefined) {
      CompanyFormData.append(val, formVal[key] as File);
    } else if (formVal[key] !== undefined) {
      CompanyFormData.append(val, formVal[key]?.toString()?.trim() || '');
    }
  });
  return CompanyFormData;
};

export default generateCompanyFormData;
