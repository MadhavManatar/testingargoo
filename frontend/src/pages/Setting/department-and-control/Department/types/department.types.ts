// ======================== Types =======================
import { User } from '../../../user-setting/User/types/user.types';

export type DepartmentRowObj = {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
};

export type AddMemberFormFields = {
  searchMember: string;
  member: boolean;
  memberListType: string;
};

export type AddDepartmentFormFields = {
  name: string;
  searchAdmin: string;
  description?: string;
  departmentAdmin: User;
  admin?: User;
};
