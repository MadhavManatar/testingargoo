// ** types **
import { AddUserFormFields } from '../types/user.types';

const generateUserFormData = (formVal: AddUserFormFields) => {
  const UserFormData = new FormData();
  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;
    if (key === 'profile_image' && formVal[key] !== undefined) {
      UserFormData.append(val, formVal[key] as File);
    } else {
      UserFormData.append(val, formVal[key]?.toString()?.trim() || '');
    }
  });

  return UserFormData;
};

export default generateUserFormData;
