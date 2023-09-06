// ** types **
import {
  AddressFormFields,
  CountryType,
  StateType,
} from 'components/Address/types/address.types';

export type PersonalInfoFields = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  role?: string;
  website?: string;
  birth_date?: string;
  report_to?: number;
  fax?: string;
  date_format?: string;
  timezone?: string;
  user_signature?: string;
};

export type SocialMediaFields = {
  facebook?: string;
  linkedin?: string;
  twitter?: string;
};

export type ProfileImageFields = {
  profile_image?: string | File;
};

export type PersonalSettingsFormFields = { id: number } & PersonalInfoFields &
  AddressFormFields &
  SocialMediaFields &
  ProfileImageFields;

export type PersonalInfoType = { id: number } & PersonalInfoFields &
  AddressFormFields &
  SocialMediaFields &
  ProfileImageFields;

export type PersonalSettingView = {
  first_name?: string;
  last_name?: string;
  email?: string;
  mobile?: string;
  phone?: string;
  profileName?: string;
  zip?: string;
  city?: string;
  state?: StateType;
  country?: CountryType;
  address1?: string;
  address2?: string;
  birth_date?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  profile_image?: string;
  reportToName?: string;
  fax?: string;
  added_by_user: {
    id: number | null;
    first_name: string;
    full_name: string;
    last_name: string;
  } | null;
  date_format?: string;
  timezone?: string;
  user_signature?: string;
  initial_color?: string;
};
