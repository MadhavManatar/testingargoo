import { AddDealFormFieldsType } from 'pages/Deal/types/deals.types';
import { LeadDetailPageType, LeadSectionType } from './lead.type';
import { FormFieldProps } from 'components/FormField/types/formField.types';

export type ConvertLeadFormFieldType = AddDealFormFieldsType & {
  closing_date?: string;
  pipeline_id?: number | null;
};

type ConvertLeadInformationFieldType =
  | 'lead_owner_id'
  | 'name'
  | 'lead_source'
  | 'deal_value'
  | 'deal_stage_id'
  | 'closing_date'
  | 'probability'
  | 'contacts'
  | 'related_account'
  | 'lead_status_id'
  | 'pipeline_id';

type ConvertLeadDescriptionFieldType = 'description';

export type ConvertLeadFormObject = {
  information: {
    [key in ConvertLeadInformationFieldType]: JSX.Element;
  };
  descriptionInfo: {
    [key in ConvertLeadDescriptionFieldType]: JSX.Element;
  };
};

export type ConvertLeadFormPropsType = {
  editFormFlag: boolean;
  displayField?: LeadSectionType;
  displayFieldProps?: {
    [key in keyof ConvertLeadFormFieldType]?: {
      [formKey in keyof FormFieldProps<ConvertLeadFormFieldType>]?: any;
    };
  };
  lead_status?: {
    id: number | null;
    name: string | undefined;
    color: string | undefined;
  };
  isGetLeadLoading: boolean;
  leadData: LeadDetailPageType;
  setStageLostIds: React.Dispatch<React.SetStateAction<number[]>>;
};