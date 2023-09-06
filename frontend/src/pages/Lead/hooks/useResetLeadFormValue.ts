import {
  AddLeadFormFieldsType,
  LeadDetailPageType,
  LeadFormFieldsType,
} from 'pages/Lead/types/lead.type';
import { useEffect } from 'react';
import { UseFormReset } from 'react-hook-form';
import { usCurrencyFormat } from 'utils/util';

type Props = {
  reset: UseFormReset<AddLeadFormFieldsType>;
  lead: LeadDetailPageType;
  isEditing?:
    | keyof LeadFormFieldsType
    | 'related_account'
    | 'related_contacts'
    | 'lead_source'
    | undefined;
};

const useResetFormValue = (props: Props) => {
  const { lead: leadData, reset, isEditing } = props;
  useEffect(() => {
    const {
      lead_source,
      lead_status_id,
      name,
      related_account,
      deal_value,
      description,
      lead_owner,
      related_contacts,
      lead_score,
    } = leadData.lead;
    reset({
      lead_source: lead_source?.id || '',
      lead_status_id: lead_status_id || undefined,
      name,
      deal_value: deal_value ? usCurrencyFormat(deal_value || '') : undefined,
      description,
      related_account: related_account?.id || undefined,
      lead_owner_id: lead_owner?.id || undefined,
      contacts: related_contacts?.length
        ? related_contacts.map((val) => {
            return { job_role: val.job_role, value: val.contact_id };
          })
        : [{ job_role: '', contact_id: '', is_primary: true }],
      lead_temp_id: leadData.lead?.lead_temperature?.id,
      lead_score,
    });
  }, [leadData, isEditing]);
};

export default useResetFormValue;
