import { ModuleNames } from 'constant/permissions.constant';
import {
  entityDataType,
  relatedEntityDataType,
} from 'pages/Activity/types/activity.types';
import { Dispatch, SetStateAction } from 'react';

export interface AllCardCommonPropType {
  close: () => void;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  isOpen?: boolean;
}

export interface LeadDealCardPropsType extends AllCardCommonPropType {
  is_deal?: boolean;
  id: number;
  pipeline?: string;
  name: string;
  stage?: string;
  deal_stage_history?: [
    {
      id: string | number;
      stage: {
        id: number;
        name: string;
      };
    }
  ];
  owner?: { first_name?: string; last_name?: string };
  source?: string;
  value?: string;
  closing_date?: string;
  activeDealStage?: string;
  contactMail?: {
    phone: string | undefined;
    mail: string | undefined;
    phoneType: string | undefined;
  };
}

export interface EntityCardPropsType extends AllCardCommonPropType {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  phoneType?: string;
  modelName:
    | ModuleNames.LEAD
    | ModuleNames.DEAL
    | ModuleNames.CONTACT
    | ModuleNames.ACTIVITY
    | ModuleNames.ACCOUNT;
  address?: {
    address1?: string;
    address2?: string;
    state?: string;
    city?: string;
    country?: string;
    zip?: string;
  };
  handleDealWonLost?: () => void;
  launchActivity?: () => void;
  activityEntityData?: entityDataType;
  relatedEntityData?: relatedEntityDataType;
  hideActivity?: boolean;
  hideEmail?: boolean;
  hidePhone?: boolean;
  startOrStopActivity?: {
    label: string;
    action: () => void;
  };
  completeOrOpenActivity?: {
    label: string;
    action: () => void;
  };
}
