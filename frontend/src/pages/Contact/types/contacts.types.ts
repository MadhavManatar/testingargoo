// ** Import Packages **
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayInsert,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** Constant **
import { TAB } from 'components/EntityDetails/constant';

//  ** Types **
import {
  AddressFormFields,
  CountryType,
  StateType,
} from 'components/Address/types/address.types';
import { scheduleActivityResponse } from 'components/EntityDetails/StayInTouch/types/stay-in-touch.type';
import {
  FormFieldProps,
  Option,
} from 'components/FormField/types/formField.types';
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import { AccountEmail, AccountPhone } from 'pages/Account/types/account.types';
import {
  ActivityResponseType,
} from 'pages/Activity/types/activity.types';
import { SocialMediaFields } from 'pages/Setting/general-setting/PersonalSettings/types/personal-settings.types';
import { User } from 'pages/Setting/user-setting/User/types/user.types';
import { FollowEntityType } from 'pages/types';
import { columnsDataInterface } from 'components/ColumnViewListDropDown';

export type ContactPhone = {
  is_primary?: boolean;
  phoneType?: string | null;
  value?: string;
};

export type DealFilter = {
  won: boolean;
  lost: boolean;
  active: boolean;
};

export type ContactEmail = {
  is_primary?: boolean;
  value?: string;
  is_from_edit?: boolean;
};

export type ContactFormFieldsType = {
  contact_owner_id?: number | null;
  country_id?: number;
  name?: string;
  emails?: ContactEmail[];
  phones?: ContactPhone[];
  related_accounts?: RelatedAccount[];
  department?: string;
  reporting_to?: string;
  birth_date?: string;
  skype?: string;
  twitter?: string;
  description?: string;
  timezone?: string;
  job_role?: string;
  primary_account_id?: number;
  contact_image?: string | File | undefined;
  initial_color?: string | undefined;
};

export type RelatedContact = {
  contact?: ContactBasicForRelated;
  job_role?: string;
  contact_id?: string | number;
  isCreatable?: boolean;
  is_primary?: boolean;
};

export type RelatedAccount = {
  account?: any;
  job_role: string;
  account_id: string | number;
  isCreatable?: boolean;
  is_primary?: boolean;
};

export type RelatedLead = {
  is_deal: boolean;
  id: number;
  name: string;
  lead_status_id: number;
  created_at: Date;
  closing_date: Date;
  converted_at: Date;
  converted_by: number;
  deal_value: number | null;
  lead_score: number | null;
  pipeline: { name: string };
  deal_stage_history: {
    deal_id: number;
    stage_id: number;
    isCurrentActive: boolean;
    start_time: Date;
    end_time: Date;
    stage: { name: string; stage_type: string };
  }[];
  related_account: {
    name: string;
    id: boolean;
    phones: AccountPhone[];
    emails: AccountEmail[];
  };
  related_contact: {
    id: number;
    name: string | undefined;
  };
};

export type RelatedLeadData = {
  contact_id: number;
  lead: RelatedLead;
  model_record_id: number;
};

export type AddContactFormFieldsType = ContactFormFieldsType & {
  related_contacts?: RelatedContact[];
  mail_provider?: string;
} & AddressFormFields &
  SocialMediaFields;

type Response = {
  id: number;
  contact_owner: {
    id: number | null;
    full_name: string;
  };
  account: {
    id: number;
    name: string;
  };
  reporting_to_contact: {
    id: number | null;
    name: string;
  };
  state: StateType;
  country: CountryType;
  related_contacts: RelatedContact[];
  related_accounts: RelatedAccount[];
  related_leads?: RelatedLeadData[];
  phones: ContactPhone[];
  emails: ContactEmail[];
};

export type ContactDetails = ContactFormFieldsType &
  AddressFormFields &
  SocialMediaFields &
  Response;

export type BasicContactFields = {
  id: number;
  phones: ContactPhone[];
  emails: ContactEmail[];
  job_role?: string;
  name?: string;
  address1?: string;
  address2?: string;
  state?: StateType;
  country?: CountryType;
  zip?: string;
  city?: string;
};

export type ContactResponseType = {
  contact: ContactDetails | (ContactDetails & ContactResponseFollowers);
  notes_count: number;
  attachments_count: number;
};

type ContactInformationFieldType =
  | 'contact_owner_id'
  | 'name'
  | 'emails'
  | 'phones'
  | 'related_accounts'
  | 'department'
  | 'reporting_to'
  | 'birth_date'
  | 'related_contacts'
  | 'timezone'
  | 'twitter'
  | 'job_role'
  | 'contact_image'
  | 'initial_color';

type ContactAddressFieldType =
  | 'country'
  | 'state'
  | 'address1'
  | 'address2'
  | 'city'
  | 'zip';

type ContactDescriptionFieldType = 'description';

export type ContactFormObject = {
  information: {
    [key in ContactInformationFieldType]?: JSX.Element;
  };
  descriptionInfo: {
    [key in ContactDescriptionFieldType]: JSX.Element;
  };
};

export type ContactFieldType = {
  information?: ContactInformationFieldType[];
  address?: ContactAddressFieldType[];
  descriptionInfo?: ContactDescriptionFieldType[];
};

export interface ContactInformationProps {
  setTab: React.Dispatch<
    React.SetStateAction<{
      info: boolean;
      timeline: boolean;
      notes: boolean;
      attachment: boolean;
      activity: boolean;
      related_contacts: boolean;
    }>
  >;
  relatableContactRef: React.RefObject<HTMLInputElement>;
  activities: ActivityResponseType[];
  isActivityLoading?: boolean;
}

export type ContactModalTypes = {
  delete: boolean;
  bulkMail: boolean;
  manageColumn: boolean;
  addTag: boolean;
  saveAsView: boolean;
};

export type bulkMailChildModalType = {
  scheduleModal?: boolean;
  confirmationModal?: boolean;
  reconnectProvider?: boolean;
};

export type useContactColumnsDefProps = {
  selectionRef?: any;
  openAddTagModal: (id: number) => void;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  disabled?: boolean;
  setIsWrapTxtUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  isSortable?: boolean;
  isSelectionDisabled?: boolean;
  columns: columnsDataInterface[];
  onHandleUpdateColumns: (columns: columnsDataInterface[]) => void;
  selectionList?: any;
  onRowClickNavigateLink: string;
};

export type useContactTrashColumnsDefProps = {
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  disabled?: boolean;
  isSortable?: boolean;
  isSelectionDisabled?: boolean;
  restoreData: (id?: number | undefined) => void;
  openDeleteContactModal: () => void;
  setActionBtnState: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ContactFormProps = {
  control: Control<AddContactFormFieldsType>;
  errors: FieldErrors<AddContactFormFieldsType>;
  register: UseFormRegister<AddContactFormFieldsType>;
  watch: UseFormWatch<AddContactFormFieldsType>;
  displayField?: ContactFieldType;
  setValue?: UseFormSetValue<AddContactFormFieldsType>;
  displayFieldProps?: {
    [key in keyof AddContactFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddContactFormFieldsType>]?: any;
    };
  };
  phoneFields?: FieldArrayWithId<AddContactFormFieldsType, 'phones', 'id'>[];
  emailFields?: FieldArrayWithId<AddContactFormFieldsType, 'emails', 'id'>[];
  editFormFlag?: boolean;
  contactData?: ContactDetails;
  inlineEditing?: boolean;
  setOpenEmailModal?: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      email_val: string;
      indexVal?: number | undefined;
      contactValues?: AddContactFormFieldsType | undefined;
    }>
  >;
  emailsField?: FieldArrayWithId<AddContactFormFieldsType, 'emails', 'id'>[];
  emailsInsert?: UseFieldArrayInsert<AddContactFormFieldsType, 'emails'>;
  emailsRemove?: UseFieldArrayRemove;
  openEmailModal?: {
    isOpen: boolean;
    email_val: string;
    indexVal?: number | undefined;
    contactValues?: AddContactFormFieldsType | undefined;
  };
  updateContact?: (values: AddContactFormFieldsType) => Promise<void>;
  setDuplicateMailModal?: React.Dispatch<
    React.SetStateAction<DuplicateFieldModalType>
  >;
  setDisableKeyDownEvent?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsKeyDownCreatable?: (value: React.SetStateAction<boolean>) => void;
  isKeyDownCreatableRef?: React.MutableRefObject<any>;
  defaultTimezone?: Option | undefined;
  timezoneLoading?: boolean;
  setTimezoneLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  profileImg?: string | File;
  onFileSelect?: React.ChangeEventHandler<HTMLInputElement>;
  setProfileImg?: React.Dispatch<React.SetStateAction<string | File>>;
  isDuplicateAccount?: DuplicateFieldModalType;
  setIsDuplicateAccount?: React.Dispatch<
    React.SetStateAction<DuplicateFieldModalType>
  >;
};

export type ContactInfoPropsType = {
  contactData: ContactResponseType;
  isLoading: boolean;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleActivityData: scheduleActivityResponse;
  setShowMainLoader: React.Dispatch<React.SetStateAction<boolean>>;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
};

export type ContactSocialPropsType = {
  accordion?: { [key: string]: boolean };
  openCloseAccordion?: (value: string) => void;
};

export type ContactDetailsSectionPropsType = {
  contactData: ContactResponseType;
  tab: TAB;
  id: number;
  isLoading: boolean;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleActivityData: scheduleActivityResponse;
  setShowMainLoader: React.Dispatch<React.SetStateAction<boolean>>;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
};

export type ContactResponseFollowers = {
  is_following?: 0 | 1;
  contact_followers?: ContactFollowersType[];
  total_followers?: number;
};

export type ContactFollowersType = {
  id?: number;
  follower_id: number;
  contact_id: number;
  organization_id: number;
  created_by: number;
  updated_by: number;
  creator?: Partial<User>;
  modifier?: Partial<User>;
  contact?: Partial<Response>;
  follower: FollowEntityType;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
};

export type ContactBasicForRelated = {
  id: number;
  name: string;
  job_role?: string;
  emails: ContactEmail[];
  phones: ContactPhone[];
  address1?: string;
  address2?: string;
  state?: StateType;
  country?: CountryType;
  zip?: string;
  city?: string;
};
