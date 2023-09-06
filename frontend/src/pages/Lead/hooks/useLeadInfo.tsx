import { usCurrencyFormat } from 'utils/util';

import { LeadDetailsType } from '../types/lead.type';

type Props = {
  lead: LeadDetailsType;
};

const useLeadInfo = (props: Props) => {
  const { lead } = props;

  const {
    lead_owner,
    name,
    lead_status,
    deal_value,
    lead_source,
    lead_score,
    description,
  } = lead;

  const leadInfo = {
    leadOwner: [lead_owner?.first_name, lead_owner?.last_name].join(' ').trim(),
    name,
    leadStatus: lead_status?.name,
    dealValue: usCurrencyFormat(deal_value || ''),
    leadSource: lead_source?.name,
    leadTemperature: lead?.lead_temperature?.name,
    leadScore: lead_score,
    description,
  };

  return { leadInfo };
};

export default useLeadInfo;
