// ** Import Packages **
import { Dispatch } from 'react';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** Types **
import { scheduleActivityResponse } from 'components/EntityDetails/StayInTouch/types/stay-in-touch.type';
import {
  AssignTagsProps,
  EntityModalState,
  HeaderInfo,
} from 'components/EntityDetails/types';
import {
  FormFieldProps,
  Option,
} from 'components/FormField/types/formField.types';
import {
  AssignTagCommonProps,
  tag,
} from 'components/detail-components/AssignTags/types/assignTags.type';
import { AccountDetails } from 'pages/Account/types/account.types';
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import { RelatedContact } from 'pages/Contact/types/contacts.types';

// ** Constant **
import { ModalType, TAB } from 'components/EntityDetails/constant';
import { User } from 'pages/Setting/user-setting/User/types/user.types';
import { FollowEntityType } from 'pages/types';
import { KeepEmailTimelineModalType } from 'components/Modal/KeepEmailTimelineModal/types/index.types';
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import { columnsDataInterface } from 'components/ColumnViewListDropDown';

export type LeadFormFieldsType = {
  lead_owner_id?: number | null;
  name?: string;
  is_deal?: string;
  deal_value?: string;
  description?: string;
  contacts?: RelatedContact[];
  lead_temp_id?: number | null;
  lead_temperature?: {
    id: number | null;
    name: string | undefined;
    color: string | undefined;
  };
  pipeline_id?: number | null;
  lead_score?: number;
  lead_status_id?: number | null;
  total_deal_age?: string;
};

export type AddLeadFormFieldsType = LeadFormFieldsType & {
  related_account?: string | number;
  related_contacts?: RelatedContact[];
  lead_source?: string | number;
};

type ResponseFieldType = {
  id: number | null;
  color?: string;
  lead_temp?: {
    id: number | null;
    name: string | undefined;
    color: string | undefined;
  };
  lead_status: {
    id: number | null;
    name: string | undefined;
    color: string | undefined;
  };
  lead_owner: {
    id: number | null;
    first_name: string | undefined;
    last_name: string | undefined;
  };
  related_contacts?: RelatedContact[];
  related_accounts?: {
    account: {
      id: number;
      name: string;
    };
    id: number;
    account_id: number;
  }[];
  related_account?: AccountDetails;
  lead_source: {
    id: number | null;
    name: string;
  };
  lead_temperature?: {
    id: number | null;
    name: string | undefined;
    color: string | undefined;
  };
  is_following?: 0 | 1;
  lead_followers?: LeadFollowersType[];
  total_followers?: number;
};

export type LeadDetailsType = LeadFormFieldsType & ResponseFieldType;

export type LeadDetailPageType = {
  lead: LeadDetailsType;
  notes_count: number;
  attachments_count: number;
};

type LeadInfoFieldType =
  | 'lead_owner_id'
  | 'name'
  | 'lead_source'
  | 'deal_value'
  | 'contacts'
  | 'lead_temp_id'
  | 'lead_status_id'
  | 'related_account'
  | 'lead_score';

type LeadDescriptionFieldType = 'description';

export type LeadFormFieldObject = {
  information: {
    [key in LeadInfoFieldType]: JSX.Element;
  };
  descriptionInfo: {
    [key in LeadDescriptionFieldType]: JSX.Element;
  };
};

type LeadInlineInfoFieldType =
  | 'lead_owner_id'
  | 'name'
  | 'lead_source'
  | 'deal_value'
  | 'lead_temp_id'
  | 'lead_status_id'
  | 'related_account'
  | 'lead_score';

export type LeadInlineFormFieldObject = {
  information: {
    [key in LeadInlineInfoFieldType]: JSX.Element;
  };
  descriptionInfo: {
    [key in LeadDescriptionFieldType]: JSX.Element;
  };
};

export type LeadSectionType = {
  information?: LeadInfoFieldType[];
  descriptionInfo?: LeadDescriptionFieldType[];
};

export type LeadInfoPropsType = {
  isLoading: boolean;
  isActivityLoading?: boolean;
  leadData: LeadDetailPageType;
  activities?: ActivityResponseType[];
  scheduleActivityData: scheduleActivityResponse;
  setShowMainLoader: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isShowMainLoader: boolean;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
};

export interface LeadDetailsHeaderProps extends AssignTagCommonProps {
  leadStatusOpt: Option[];
  leadData: LeadDetailPageType;
  updateLeadTemp: (data: number) => void;
  setAssignedTags: (value: React.SetStateAction<AssignTagsProps>) => void;
  setModal: Dispatch<React.SetStateAction<EntityModalState>>;
  setIsLinkDocument: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStayInTouchOpen: Dispatch<React.SetStateAction<boolean>>;
  isStayInTouchOpen: boolean;
  scheduleActivityData: scheduleActivityResponse;
  isScheduleActivityLoading: boolean;
  getScheduleActivity: (id: number) => Promise<void>;
}

export type LeadMobileHeaderProps = {
  updateLeadPermission: boolean;
  leadStatusOpt: Option[];
  contactAndMail: ContactMailProps;
  leadData: LeadDetailPageType;
  setModal: Dispatch<React.SetStateAction<EntityModalState>>;
  headerInfo: HeaderInfo;
  setIsStayInTouchOpen: Dispatch<React.SetStateAction<boolean>>;
  isStayInTouchOpen: boolean;
  scheduleActivityData: scheduleActivityResponse;
  isScheduleActivityLoading: boolean;
  getScheduleActivity: (id: number) => Promise<void>;
  assignedTags: AssignTagsProps;
  setAssignedTags: (value: React.SetStateAction<AssignTagsProps>) => void;
  editTagsPermission: boolean;
  updateLeadTemp: (data: number) => void;
  setOpenModal: (modalName: ModalType) => void;
  setIsLinkDocument: React.Dispatch<React.SetStateAction<boolean>>;
  leadTempInfo?: Option;
  deleteAssignedTag: (deleteId: number, tagDetail?: tag) => Promise<void>;
};

export type ContactMailProps = {
  mail: string;
  phone?: string;
  phoneType?: string;
};

export type LeadFormObjectPropsType = {
  control: Control<AddLeadFormFieldsType>;
  errors: FieldErrors<AddLeadFormFieldsType>;
  register: UseFormRegister<AddLeadFormFieldsType>;
  watch: UseFormWatch<AddLeadFormFieldsType>;
  setValue: UseFormSetValue<AddLeadFormFieldsType>;
  displayField?: LeadSectionType;
  displayFieldProps?: {
    [key in keyof AddLeadFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddLeadFormFieldsType>]?: any;
    };
  };
  editFormFlag?: boolean;
  leadDetail?: LeadDetailsType;
  displayLabel?: boolean;
  setEmailTimelineModal?: React.Dispatch<
    React.SetStateAction<KeepEmailTimelineModalType>
  >;
  setDuplicateMailModal?: React.Dispatch<
    React.SetStateAction<DuplicateFieldModalType>
  >;
};

export type RelatedContactFormFieldChildPropsType = {
  index: number;
  contactsFields: FieldArrayWithId<AddLeadFormFieldsType, 'contacts', 'id'>[];
  field: FieldArrayWithId<AddLeadFormFieldsType, 'contacts', 'id'>;
  displayFieldProps?: {
    [key in keyof AddLeadFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddLeadFormFieldsType>]?: any;
    };
  };
  removeContacts: UseFieldArrayRemove;
  related_contacts: RelatedContact[] | undefined;
  watchAccount?: string | number;
  setSelectedContactOptions: React.Dispatch<
    React.SetStateAction<{
      [key: string]: Option;
    }>
  >;
  selectedContactOptions: {
    [key: string]: Option;
  };
  setContactRelatedAccounts: React.Dispatch<React.SetStateAction<Option[]>>;
  setAccountKey: React.Dispatch<React.SetStateAction<number | undefined>>;
  setEmailTimelineModal?: React.Dispatch<
    React.SetStateAction<KeepEmailTimelineModalType>
  >;
  isDisabled?: boolean;
  isCreatablePermission?: boolean;
  checkFieldOnBlur?: (name: string, type: string) => Promise<void>;
};

export type UseLeadColumnsPropsType = {
  selectionRef?: any;
  openAddTagModal: (id: number) => void;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  getLeadsLoading?: boolean;
  leadStatusOpt: GraphDataType[];
  isCheckAllRef?: any;
  disabled?: any;
  isSelectionDisabled?: boolean;
  columns: columnsDataInterface[];
  onHandleUpdateColumns: (columns: columnsDataInterface[]) => void;
  setIsWrapTxtUpdate: React.Dispatch<React.SetStateAction<boolean>>;

  selectionList?: any;
  onRowClickNavigateLink: string;
};

export type GraphDataType = {
  label: string;
  color: string;
  y: number;
  id?: number;
};

export type UseLeadTrashColumnsPropsType = {
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  getLeadsLoading?: boolean;
  isCheckAllRef?: any;
  disabled?: any;
  isSelectionDisabled?: boolean;
  openDeleteLeadsModal: () => void;
  restoreData: (id?: number | undefined) => void;
  setActionBtnState: React.Dispatch<React.SetStateAction<boolean>>;
};
export type LeadDetailsSectionPropsType = {
  tab: TAB;
  id: number;
  leadData: LeadDetailPageType;
  isLoading: boolean;
  scheduleActivityData: scheduleActivityResponse;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMainLoader: React.Dispatch<React.SetStateAction<boolean>>;
  isShowMainLoader: boolean;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
};

export type LeadFollowersType = {
  id?: number;
  follower_id: number;
  lead_id: number;
  organization_id: number;
  created_by: number;
  updated_by: number;
  creator?: Partial<User>;
  modifier?: Partial<User>;
  lead?: Partial<ResponseFieldType>;
  follower: FollowEntityType;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string;
};
