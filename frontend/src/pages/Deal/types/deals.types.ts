// ** Import Packages **
import { Dispatch, SetStateAction } from 'react';
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** Constant **
import { ModalType } from 'components/EntityDetails/constant';

// ** Types **
import { EntityModalState, HeaderInfo } from 'components/EntityDetails/types';
import { scheduleActivityResponse } from 'components/EntityDetails/StayInTouch/types/stay-in-touch.type';
import { RelatedContact } from 'pages/Contact/types/contacts.types';

import {
  FormFieldProps,
  GetAllApiProps,
  Option,
} from 'components/FormField/types/formField.types';
import { User } from 'pages/Setting/user-setting/User/types/user.types';
import { FollowEntityType } from 'pages/types';
import { KeepEmailTimelineModalType } from 'components/Modal/KeepEmailTimelineModal/types/index.types';
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import { AccountBasicForRelated } from 'pages/Account/types/account.types';

export type DealFormFieldsType = {
  lead_owner_id?: number | null;
  name?: string;
  is_deal?: string;
  probability?: string;
  deal_value?: string;
  description?: string;
  contacts?: RelatedContact[];
  closing_date?: string;
  won_date?: string;
  pipeline_id?: number | null;
  pipeline?: {
    id: number | null;
    name: string | undefined;
  };
  lead_score?: number;
  deal_stage_id?: number | null;
  deal_stage?: {
    id: number | null;
    name: string | undefined;
    stage_type: string;
  };
  total_deal_age?: string;
  lead_status_id?: number | null;
  is_following?: 0 | 1;
  lead_followers?: DealFollowersType[];
  total_followers?: number;
};

export type AddDealFormFieldsType = DealFormFieldsType & {
  related_account?: string | number;
  lead_source?: string | number;
};

export interface KeepTimelineEmails {
  key: string;
  data: number;
  keep: boolean;
}

type ResponseFieldType = {
  id: number | null;
  lead_owner: {
    id: number | null;
    first_name: string | undefined;
    last_name: string | undefined;
  };
  lead_source: {
    id: number | null;
    name: string;
  };
  related_account: AccountBasicForRelated;
  lead_status: {
    id: number | null;
    name: string | undefined;
    color: string | undefined;
  };
  related_contacts?: RelatedContact[];
};
export type DealDetailsType = DealFormFieldsType &
  ResponseFieldType & {
    converted_at: string;
    created_at: string;
    deal_stage_history?: [
      {
        stage_id: number;
        id: string | number;
        isCurrentActive: boolean;
        start_time: Date;
        stage: {
          name: string;
          stage_type: string;
        };
      }
    ];
  };

export type DealResponseType = {
  lead: DealDetailsType;
  notes_count: number | null;
  attachments_count: number | null;
};

type DealInformationFieldType =
  | 'lead_owner_id'
  | 'name'
  | 'probability'
  | 'lead_source'
  | 'deal_value'
  | 'closing_date'
  | 'won_date'
  | 'contacts'
  | 'related_account'
  | 'pipeline_id'
  | 'deal_stage_id'
  | 'lead_status_id'
  | 'deal_score';

type DealDescriptionFieldType = 'description';

export type DealFormObject = {
  information: {
    [key in DealInformationFieldType]?: JSX.Element;
  };
  descriptionInfo: {
    [key in DealDescriptionFieldType]: JSX.Element;
  };
};

export type DealFieldType = {
  information?: DealInformationFieldType[];
  descriptionInfo?: DealDescriptionFieldType[];
};

export type AddDealLostFormFieldsType = {
  reason: string | null;
  comment: string | null;
  otherReason?: string | null;
};

type DealLostInformationFieldType = 'reason' | 'comment' | 'otherReason';

export type DealLostFormObject = {
  information: {
    [key in DealLostInformationFieldType]: JSX.Element;
  };
};

export type DealLostFieldType = {
  information?: DealLostInformationFieldType[];
};

export type AddDealWonLostFormFieldsType = {
  stage_id: string | number | undefined;
  stage_type: string;
};

type DealWonLostInformationFieldType = 'stage_id' | 'stage_type';

export type DealWonLostFormObject = {
  information: {
    [key in DealWonLostInformationFieldType]: JSX.Element;
  };
};

export type DealWonLostFieldType = {
  information?: DealWonLostInformationFieldType[];
};

export type DealInformationProps = {
  reRenderOnStage: boolean;
  setReRenderOnStage: (arg: boolean) => void;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface DealDetailsHeaderProps {
  dealId: number;
  dealData: DealDetailsType;
  setModal: Dispatch<SetStateAction<EntityModalState>>;
  closeModal: (EmailModalType: ModalType) => void;
  modal: EntityModalState;
  dealClosingDateData: {
    time_frame: number;
    neutral_color: string;
    warning_color: string;
    passed_due_color: string;
  };
  headerInfo: HeaderInfo;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
  isStayInTouchOpen: boolean;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleActivityData: scheduleActivityResponse;
  setReRenderOnStage: React.Dispatch<React.SetStateAction<boolean>>;
  reRenderOnStage: boolean;
}

export type DealFormObjectPropsType = {
  control: Control<AddDealFormFieldsType>;
  errors: FieldErrors<AddDealFormFieldsType>;
  register: UseFormRegister<AddDealFormFieldsType>;
  watch: UseFormWatch<AddDealFormFieldsType>;
  getValues: UseFormGetValues<AddDealFormFieldsType>;
  setValue: UseFormSetValue<AddDealFormFieldsType>;
  editFormFlag?: boolean;
  displayField?: DealFieldType;
  displayFieldProps?: {
    [key in keyof AddDealFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddDealFormFieldsType>]?: any;
    };
  };
  contactsFields: FieldArrayWithId<AddDealFormFieldsType, 'contacts', 'id'>[];
  removeContacts: UseFieldArrayRemove;
  dealDetail?: DealDetailsType;
  inlineEditing?: boolean;
  setStageLostIds?: React.Dispatch<React.SetStateAction<number[]>>;
  appendContacts: UseFieldArrayAppend<AddDealFormFieldsType, 'contacts'>;
  setEmailTimelineModal?: React.Dispatch<
    React.SetStateAction<KeepEmailTimelineModalType>
  >;
  setDuplicateMailModal?: React.Dispatch<
    React.SetStateAction<DuplicateFieldModalType>
  >;
};

export type DealInformationPropsType = {
  dealData: DealResponseType;
  isLoading: boolean;
  scheduleActivityData: scheduleActivityResponse;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMainLoader: React.Dispatch<React.SetStateAction<boolean>>;
  isShowMainLoader: boolean;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
};

export type DealFollowersType = {
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

export type dealDefaultInfoType = {
  pipeline_id?: Option;
  deal_stage_id?: Option;
};

export type UseDefaultPipelinePropsType = {
  getPipelineOptions: (option?: GetAllApiProps | undefined) => Promise<
    | {
        option: Option[];
        count: number;
      }
    | undefined
  >;
  getDealStageOptions: (id?: number) => Promise<
    | {
        label: string;
        value: number;
        id: number;
      }[]
    | undefined
  >;
  setDefaultInfo: (value: React.SetStateAction<dealDefaultInfoType>) => void;
};

export type UseDealClosingDateCalType = {
  dealClosingDateData: {
    time_frame: number;
    neutral_color: string;
    warning_color: string;
    passed_due_color: string;
  };
  closing_date: string | undefined;
  converted_at: string;
  created_at: string;
};
