// ** Import Packages **
import { AxiosRequestConfig } from 'axios';
import { Dispatch } from 'react';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayInsert,
  UseFieldArrayRemove,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** Types **
import {
  AddressFormFields,
  CountryType,
  StateType,
} from 'components/Address/types/address.types';
import { scheduleActivityResponse } from 'components/EntityDetails/StayInTouch/types/stay-in-touch.type';
import {
  AssignTagsProps,
  EntityModalState,
} from 'components/EntityDetails/types';
import {
  AsyncSelectGetOptions,
  FormFieldProps,
  Option,
} from 'components/FormField/types/formField.types';
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import { AssignTagCommonProps } from 'components/detail-components/AssignTags/types/assignTags.type';
import {
  ActivityResponseType,
  entityDataType,
} from 'pages/Activity/types/activity.types';
import { User } from 'pages/Setting/user-setting/User/types/user.types';
import { FollowEntityType } from 'pages/types';

// ** Constant **
import { ModalType, TAB } from 'components/EntityDetails/constant';
import { MultiValue, SingleValue } from 'react-select';
import { columnsDataInterface } from 'components/ColumnViewListDropDown';
import {
  BasicContactFields,
  ContactPhone,
  RelatedLead,
} from 'pages/Contact/types/contacts.types';
import { KeepEmailTimelineModalType } from 'components/Modal/KeepEmailTimelineModal/types/index.types';

export type AccountPhone = {
  isPrimary: boolean;
  phoneType: string | null;
  value: string;
};

export type AccountEmail = {
  isPrimary: boolean;
  value: string;
};

export type AccountParentChild = {
  child: {
    id: number;
    parent_account_id: number;
    name: string;
    level: number;
  }[];
  parent: {
    account_id: number;
    parent_id: number;
    parent_name: string;
    account_name: string;
    hierarchy_level: number;
  }[];
};

export type AccountFormFieldsType = {
  account_owner_id?: number;
  rating?: string;
  name?: string;
  emails: AccountEmail[];
  phones?: AccountPhone[];
  fax?: string;
  parent_account_id?: string;
  sub_account_id?: string;
  website?: string;
  account_type?: string;
  ownership?: string;
  industry?: string;
  employees?: string;
  annual_revenue?: string;
  description?: string;
  timezone?: string;
  account_image?: string | File | undefined;
  initial_color?: string | undefined;
};

export type AddAccountFormFieldsType = AccountFormFieldsType & {
  related_contacts?: RelatedContactsAccountsType[];
} & AddressFormFields;

type ResponseFieldType = {
  id: number | null;
  account_owner?: {
    id: number | null;
    first_name: string;
    last_name: string;
  };
  parent_account?: {
    id: number | null;
    name: string;
    emails: AccountEmail[];
    phones: { isPrimary: boolean; phoneType: string; value: string }[];
  } | null;
  sub_account?: {
    id: number | null;
    name: string;
    emails: AccountEmail[];
    phones: { isPrimary: boolean; phoneType: string; value: string }[];
  } | null;
  Account?: AccountDetails[];
  AccountContacts?: {
    emails: AccountEmail[];
    phones: AccountPhone[];
    job_role: string;
    id: number;
    is_primary: boolean;
    contact_id: number;
    contact: BasicContactFields;
  }[];
  phones: AccountPhone[];
  emails: AccountEmail[];
  account_followers?: AccountFollowersType[];
  total_followers?: number;
  is_following?: 0 | 1;
  profile_image?: string;
  allLeads?: RelatedLead[];
  state?: StateType;
  country?: CountryType;
  city?: string;
};

export type AccountDetails = AddAccountFormFieldsType & ResponseFieldType;

export type AccountResponseType = {
  account: AccountDetails;
  notes_count: number;
  attachments_count: number;
};

type AccountInformationFieldType =
  | 'account_owner_id'
  | 'rating'
  | 'name'
  | 'emails'
  | 'phones'
  | 'related_contacts'
  | 'fax'
  | 'parent_account_id'
  | 'website'
  | 'account_type'
  | 'ownership'
  | 'industry'
  | 'employees'
  | 'timezone'
  | 'annual_revenue'
  | 'account_image'
  | 'initial_color';
type AccountAddressFieldType =
  | 'country'
  | 'state'
  | 'address1'
  | 'address2'
  | 'city'
  | 'zip';
type AccountDescriptionFieldType = 'description';

export type AccountFormObject = {
  information: {
    [key in AccountInformationFieldType]?: JSX.Element;
  };
  descriptionInfo: {
    [key in AccountDescriptionFieldType]: JSX.Element;
  };
};

export type AccountFieldType = {
  information?: AccountInformationFieldType[];
  address?: AccountAddressFieldType[];
  descriptionInfo?: AccountDescriptionFieldType[];
};

export type AccountInformationProps = {
  activities: ActivityResponseType[];
  isActivityLoading?: boolean;
};

export type RelatedContactsAccountsType = {
  is_primary: boolean;
  value: string | number;
  job_role: string;
  selectedOption?: any;
  isCreatable: boolean;
};

export interface AccountDetailsHeaderProps extends AssignTagCommonProps {
  accountData: AccountResponseType;
  isParentChildLoading?: boolean;
  parentChildData?: AccountParentChild;
  setModal: Dispatch<React.SetStateAction<EntityModalState>>;
  setIsLinkDocument: React.Dispatch<React.SetStateAction<boolean>>;
  onEditClick: (account_id: number) => void;
  isStayInTouchOpen: boolean;
  setIsStayInTouchOpen: (value: boolean) => void;
  scheduleActivityData: scheduleActivityResponse;
  isScheduleActivityLoading: boolean;
  getScheduleActivity: (id: number) => Promise<void>;
}

export interface ContactMailProps {
  mail: string;
  phone: number;
  name?: string;
  jobRole?: string;
}

export type RelatedContactsFormForAccountPropsType = {
  removeRelatedContacts: UseFieldArrayRemove;
  field: FieldArrayWithId<AddAccountFormFieldsType, 'related_contacts', 'id'>;
  index: number;
  account: AccountDetails | undefined;
  isDisabled: boolean;
  isCreatablePermission?: boolean;
  displayFieldProps?: {
    [key in keyof AddAccountFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddAccountFormFieldsType>]?: any;
    };
  };
  checkFieldOnBlur?: (name: string, type: string) => Promise<void>;
};

export type AccountFormObjectPropsType = {
  control: Control<AddAccountFormFieldsType>;
  errors: FieldErrors<AddAccountFormFieldsType>;
  register: UseFormRegister<AddAccountFormFieldsType>;
  account_owner?: {
    id: number | null;
    first_name: string;
    last_name: string;
  };
  parent_account?: {
    id: number | null;
    name: string;
  } | null;
  sub_account?: {
    id: number | null;
    name: string;
  } | null;
  accountId?: number | null | undefined;
  displayField?: AccountFieldType;
  displayFieldProps?: {
    [key in keyof AddAccountFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddAccountFormFieldsType>]?: any;
    };
  };
  setValue: UseFormSetValue<AddAccountFormFieldsType>;
  editFormFlag?: boolean;
  watch: UseFormWatch<AddAccountFormFieldsType>;
  phoneFields: FieldArrayWithId<AddAccountFormFieldsType, 'phones', 'id'>[];
  removePhone: UseFieldArrayRemove;
  insertPhone: UseFieldArrayInsert<AddAccountFormFieldsType, 'phones'>;
  emailFields: FieldArrayWithId<AddAccountFormFieldsType, 'emails', 'id'>[];
  insertEmail: UseFieldArrayInsert<AddAccountFormFieldsType, 'emails'>;
  removeEmail: UseFieldArrayRemove;
  setError: UseFormSetError<AddAccountFormFieldsType>;
  clearErrors: UseFormClearErrors<AddAccountFormFieldsType>;
  relatedContactsFields: FieldArrayWithId<
    AddAccountFormFieldsType,
    'related_contacts',
    'id'
  >[];
  appendRelatedContacts: UseFieldArrayAppend<
    AddAccountFormFieldsType,
    'related_contacts'
  >;
  removeRelatedContacts: UseFieldArrayRemove;
  accountData?: AccountResponseType;
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  setDuplicateMailModal?: React.Dispatch<
    React.SetStateAction<DuplicateFieldModalType>
  >;
  defaultTimezone?: Option | undefined;
  timezoneLoading?: boolean;
  setEmailTimelineModal?: React.Dispatch<
    React.SetStateAction<KeepEmailTimelineModalType>
  >;
  profileImg?: string | File;
  onFileSelect?: React.ChangeEventHandler<HTMLInputElement>;
  setProfileImg?: React.Dispatch<React.SetStateAction<string | File>>;
};

export type AccountInfoPropsType = {
  scheduleActivityData: scheduleActivityResponse;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  accountData: AccountResponseType;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
  parentChildData?: AccountParentChild;
};

export type AccountPageModalPropsType = {
  delete: boolean;
  manageColumn: boolean;
  addTag?: boolean;
  saveAsView?: boolean;
};

export type AccountDetailsCompPropsType = {
  onEditClick: (account_id: number) => void;
  parentChildData?: AccountParentChild;
  isParentChildLoading?: boolean;
  isAccountLoading: boolean;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
  tab: TAB;
  reRenderNextStep: number;
  setModal: React.Dispatch<React.SetStateAction<EntityModalState>>;
  setIsLinkDocument: React.Dispatch<React.SetStateAction<boolean>>;
  deleteAssignedTag: (deletedId: number) => Promise<void>;
  assignedTags: AssignTagsProps;
  setAssignedTags: (value: React.SetStateAction<AssignTagsProps>) => void;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
  scheduleActivityData: scheduleActivityResponse;
  accountData: AccountResponseType;
  isStayInTouchOpen: boolean;
  accountId: number;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type AccountDetailsSectionPropsType = {
  tab: TAB;
  id: number;
  scheduleActivityData: scheduleActivityResponse;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
  isAccountLoading: boolean;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  accountData: AccountResponseType;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
  parentChildData?: AccountParentChild;
};

export type UseAccountListPropsType = {
  selectionRef?: any;
  setSelectionList?: any;
  openAddTagModal(id: number): void;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  disabled?: boolean;
  isSelectionDisabled?: boolean;
  columns: columnsDataInterface[];
  onHandleUpdateColumns: (columns: columnsDataInterface[]) => void;
  setIsWrapTxtUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  selectionList?: any;
  onRowClickNavigateLink: string;
};

export type UseAccountListTrashPropsType = {
  openAddActivityModal: (
    data: entityDataType,
    relatedData: { contact?: { id: number; name: string } }
  ) => void;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  disabled?: boolean;
  isSelectionDisabled?: boolean;
  openDeleteAccountModal: () => void;
  restoreData: (id?: number | undefined) => Promise<any>;
};

export type CheckParentAccountPropsType = {
  accountId: number | null | undefined;
  watchParentAccountId: string | undefined;
  setError: UseFormSetError<AddAccountFormFieldsType>;
  setValue: UseFormSetValue<AddAccountFormFieldsType>;
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  clearErrors: UseFormClearErrors<AddAccountFormFieldsType>;
};

export type AccountInlineFormObjectPropsType = {
  control: Control<AddAccountFormFieldsType>;
  errors: FieldErrors<AddAccountFormFieldsType>;
  register: UseFormRegister<AddAccountFormFieldsType>;
  parent_account?: {
    id: number | null;
    name: string;
  } | null;
  sub_account?: {
    id: number | null;
    name: string;
  } | null;
  accountId?: number | null;
  displayField?: AccountFieldType;
  displayFieldProps?: {
    [key in keyof AddAccountFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddAccountFormFieldsType>]?: any;
    };
  };
  setValue: UseFormSetValue<AddAccountFormFieldsType>;
  editFormFlag?: boolean;
  watch: UseFormWatch<AddAccountFormFieldsType>;
  phoneFields: FieldArrayWithId<AddAccountFormFieldsType, 'phones', 'id'>[];
  removePhone: UseFieldArrayRemove;
  insertPhone: UseFieldArrayInsert<AddAccountFormFieldsType, 'phones'>;
  emailFields: FieldArrayWithId<AddAccountFormFieldsType, 'emails', 'id'>[];
  insertEmail: UseFieldArrayInsert<AddAccountFormFieldsType, 'emails'>;
  removeEmail: UseFieldArrayRemove;
  setError: UseFormSetError<AddAccountFormFieldsType>;
  clearErrors: UseFormClearErrors<AddAccountFormFieldsType>;
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  accountData?: AccountResponseType;
  setIsKeyDownCreatable: (value: React.SetStateAction<boolean>) => void;
  isKeyDownCreatableRef: React.MutableRefObject<any>;
  defaultTimezone?: Option;
  setEmailTimelineModal: React.Dispatch<
    React.SetStateAction<KeepEmailTimelineModalType>
  >;
};

export type AccountMobileHeaderPropsType = {
  accountData: AccountResponseType;
  onEditClick: (account_id: number) => void;
  accountId: number | null;
  setOpenModal: (modalName: ModalType) => void;
  setIsLinkDocument: React.Dispatch<React.SetStateAction<boolean>>;
  assignedTags: AssignTagsProps;
  deleteAssignedTag: (deletedId: number) => Promise<void>;
  editTagsPermission: boolean;
  isStayInTouchOpen: boolean;
  setIsStayInTouchOpen: (value: boolean) => void;
  scheduleActivityData: scheduleActivityResponse;
  isScheduleActivityLoading: boolean;
  getScheduleActivity: (id: number) => Promise<void>;
  contact_jobRole: string | undefined;
  contact_name: string | undefined;
  mail: string | undefined;
  phone: AccountPhone | ContactPhone | undefined;
  address: {
    address1: string;
    address2: string;
    state: string;
    city: string;
    country: string;
    zip: string;
  };
};

export type AccountEmailFieldsPropsType = {
  emailFields: FieldArrayWithId<AddAccountFormFieldsType, 'emails', 'id'>[];
  errors: FieldErrors<AddAccountFormFieldsType>;
  register: UseFormRegister<AddAccountFormFieldsType>;
};

export type AccountPhoneFieldsPropsType = {
  errors: FieldErrors<AddAccountFormFieldsType>;
  register: UseFormRegister<AddAccountFormFieldsType>;
  phoneFields: FieldArrayWithId<AddAccountFormFieldsType, 'phones', 'id'>[];
  getPhoneTypeOption: AsyncSelectGetOptions;
  isGetPhoneTypeLoading: boolean;
  control: Control<AddAccountFormFieldsType, any>;
  setSelectedValueRefForEnterSave: (
    e: MultiValue<Option> | SingleValue<Option>
  ) => void;
};
export type AccountFollowersType = {
  id?: number;
  follower_id: number;
  account_id: number;
  organization_id: number;
  created_by: number;
  updated_by: number;
  creator?: Partial<User>;
  modifier?: Partial<User>;
  account?: Partial<ResponseFieldType>;
  follower: FollowEntityType;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
};

export type AddAccountModalPropsType = {
  redirect?: boolean;
  isQuickModal?: boolean;
  isOpen: boolean;
  onAdd?: (data?: any) => void;
  closeModal: () => void;
  displayField?: AccountFieldType;
  displayFieldProps?: {
    [key in keyof AddAccountFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddAccountFormFieldsType>]?: any;
    };
  };
  id?: number;
};

export type UseAddAccountPropsType = {
  redirect?: boolean;
  isQuickModal: boolean;
  onAdd?: ((data?: any) => void) | undefined;
  addAccountAPI: (
    data: object,
    config?: AxiosRequestConfig<object>
  ) => Promise<{
    data?: any;
    error?: any;
  }>;
  closeModal?: () => void;
  reloadModalDetails?: () => void;
};

export type AccountBasicForRelated = {
  id: number | null;
  emails: AccountEmail[];
  phones: AccountPhone[];
  state?: StateType;
  country?: CountryType;
  name: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
};
