// =================== import packages ==================
import { useEffect, useState } from 'react';
import { UseFormReset, UseFormSetValue } from 'react-hook-form';
// ======================== Types =======================
import { User } from 'pages/Setting/user-setting/User/types/user.types';
import { AddDepartmentFormFields } from '../types/department.types';
import { useLazyGetDepartmentByIdQuery } from 'redux/api/departmentApi';

interface Props {
  departmentId: number | null;
  setValue: UseFormSetValue<AddDepartmentFormFields>;
  reset: UseFormReset<AddDepartmentFormFields>;
  selectedMembers: User[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<User[]>>;
}

export const useGetDepartmentDetails = (props: Props) => {
  const { departmentId, setValue, reset, setSelectedMembers, selectedMembers } =
    props;
  let abortFlag = false;

  // ================= State ====================
  const [departmentData, setDepartmentData] =
    useState<AddDepartmentFormFields>();

  // ================= Apis Hooks =============
  const [getDepartmentByIdAPI, { isLoading, isError }] =
    useLazyGetDepartmentByIdQuery();

  const getDepartmentDetail = async (id: number) => {
    const { data, error } = await getDepartmentByIdAPI({
      id,
      params: {
        'include[admin][select]': 'id,first_name,last_name,profile_image',
        'include[UserDepartment][select]': 'id,department_id,user_id',
        'include[UserDepartment][include][user][select]':
          'id,first_name,last_name,profile_image',
      },
    }, true);

    if (data && !error && !abortFlag) {
      setDepartmentData({ ...data });
      reset({ ...data });
      setValue('departmentAdmin', data.admin);
      setSelectedMembers([
        ...selectedMembers,
        ...data.UserDepartment.map((obj: { user: User }) => ({ ...obj.user })),
      ]);
    }
  };

  useEffect(() => {
    if (departmentId) {
      getDepartmentDetail(departmentId);
    }
    return () => {
      abortFlag = true;
    };
  }, []);

  return { departmentData, isLoading, isError };
};
