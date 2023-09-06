// ** types **
import { PersonalSettingsFormFields } from '../types/personal-settings.types';

const generatePersonalSettingFormData = (
  formVal: PersonalSettingsFormFields
) => {
  const PersonalSettingFormData = new FormData();
  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;
    if (formVal[key] !== undefined) {
      if (key === 'profile_image' && formVal[key] !== undefined) {
        PersonalSettingFormData.append(val, formVal[key] as File);
      } else {
        PersonalSettingFormData.append(
          val,
          formVal[key]?.toString()?.trim() || ''
        );
      }
    }
  });
  PersonalSettingFormData.delete('company');
  PersonalSettingFormData.delete('id');
  return PersonalSettingFormData;
};

export default generatePersonalSettingFormData;
