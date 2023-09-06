// ** Types **
import {
  AddressFormFields,
  CountryType,
  StateType,
} from 'components/Address/types/address.types';
import { Option } from 'components/FormField/types/formField.types';
import { agGridSelectedProps } from 'components/TableInfiniteScroll';
import { SocialMediaFields } from 'pages/Setting/general-setting/PersonalSettings/types/personal-settings.types';
import { UserSession } from 'pages/Setting/general-setting/SecuritySettings/ManageSessions/types/userSession.types';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';

export type UserFormFields = {
  profile_image: File | string;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: string;
  phone: string;
  mobile: string;
  role: string;
  report_to?: number;
  fax: string;
  website: string;
  user_signature?: string;
  timezone: string;
  initial_color?: string;
};

export type AddUserFormFields = UserFormFields &
  AddressFormFields &
  SocialMediaFields;

type Response = {
  id: number | null;
  userOrganization: {
    id: number | null;
    name: string;
  } | null;
  roles: {
    id: number | null;
    name: string;
  }[];
  report_to_user?: {
    user_reporter: {
      id: number;
      first_name: string;
      last_name: string;
      full_name: string;
    };
  };
  added_by_user: {
    id: number | null;
    first_name: string;
    full_name: string;
    last_name: string;
  } | null;
  verified: false;
  userSessions?: { documents: UserSession[]; total: number };
  state: StateType;
  country: CountryType;
  city: string;
};

export type UserResponse = AddUserFormFields & Response;

export type TransferUserFormFields = {
  user: { id: number; transfer_id: number }[];
};

export type UserProfile = {
  user_id: number;
  organization_id: number;
  profile_id: number;
  deleted_at: Date | null;
  is_deleted: boolean;
  id: number;
  profile: {
    id: number;
    organization_id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    is_deleted: boolean;
    description: string | null;
  };
}[];

export type User = {
  id: number;
  username: string | null;
  email: string;
  phone: string | null;
  password: string | null;
  added_by: number | null;
  birth_date: Date | null;
  website: string | null;
  fax: string | null;
  gender: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  active: string;
  verified: boolean;
  last_login_time: Date | null;
  report_to: number | null;
  apple_id: string | null;
  google_id: string | null;
  settings: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  is_deleted: boolean;
  facebook: string | null;
  linkedin: string | null;
  mobile: string | null;
  profile_image: string | null;
  twitter: string | null;
  zip: string | null;
  is_owner: boolean;
  skype: string | null;
  first_name: string | null;
  last_name: string | null;
  UserProfile?: UserProfile;
};

export type DeleteUserModalPropsType = {
  isOpen: boolean;
  deleteUser: (value: TransferUserFormFields) => void;
  closeModal: () => void;
  isLoading: boolean;
  userDetails: { [key: string]: any }[];
};

export type AddUserModalPropsType = {
  isOpen: boolean;
  addUser: (data: AddUserFormFields) => void;
  closeModal: () => void;
  isLoading: boolean;
  setUserInfo?: React.Dispatch<React.SetStateAction<agGridSelectedProps>>;
};

export type UserFormPropsType = {
  userId?: number | null;
  id?: number | null;
  control: Control<AddUserFormFields>;
  errors: FieldErrors<AddUserFormFields>;
  register: UseFormRegister<AddUserFormFields>;
  roles?: { id: number | null; name: string }[];
  reportTo?: {
    user_reporter: {
      id: number | null;
      first_name: string;
      last_name: string;
      full_name: string;
    };
  };
  verifiedUser?: boolean;
  user_signature?: string;
  timezone?: string;
  setAddressOptions?: React.Dispatch<
    React.SetStateAction<{
      state: Option;
      country: Option;
    }>
  >;
  addressOptions?: {
    state: Option;
    country: Option;
  };
};

export type UseUserColumnsPropsType = {
  selectionRef?: any;
  setSelectionList?: any;
  disabled?: boolean;
  userInfo?: agGridSelectedProps;
  setDefaultId?: React.Dispatch<React.SetStateAction<number | undefined>>;
  isSelectionDisabled?: boolean;
  openDeleteUserModal: (ids: number[]) => void;
};
