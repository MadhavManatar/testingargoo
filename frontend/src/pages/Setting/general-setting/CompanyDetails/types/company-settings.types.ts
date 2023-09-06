// ** types **
import { AddressFormFields } from 'components/Address/types/address.types';

export type PersonalInfoFields = {
  name?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  organization_category?: string;
  website?: string;
};

export type CompanyLogoFields = {
  organization_logo?: string | File;
};

export type CompanySettingsFormFields = PersonalInfoFields &
  AddressFormFields &
  CompanyLogoFields;

export type CompanyDetailsViewPropsType = {
  setViewMode: React.Dispatch<React.SetStateAction<boolean>>;
}