export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export type Permission = {
  id?: number;
  name: string;
  value?: number;
  status: Status;
  is_disabled?: boolean;
};

export type PermissionObj = {
  id: number;
  status?: string;
  name: string;
  parent_section?: string;
  child_section?: string;
  permissions: Permission[];
};

export type ProfileData = {
  name?: string;
  clone_from?: number;
  description?: string;
};

export type ProfilesRowObj = {
  id: number;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
};

export type TransferProfileFormFields = {
  id: number; transfer_id: number;
};

export type PermissionResponseType = {
  created_at: string;
  deleted_at: string;
  description: string;
  id: number;
  is_system: boolean;
  name: string;
  organization_id: number;
  updated_at: string;
  user_roles: {
    id: number;
    organization_id: number;
    role_id: number;
    user_id: number;
  }[];
};

export type DeleteProfilePermissionModalPropsType = {
  isOpen: boolean;
  deleteProfile: (value?: any) => Promise<void>;
  closeModal: () => void;
  isLoading: boolean;
  profileDetails: PermissionResponseType;
};