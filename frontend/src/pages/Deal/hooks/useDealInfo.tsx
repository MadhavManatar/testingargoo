import DateFormat from 'components/DateFormat';
import React from 'react';
import { formatAsPercentage, usCurrencyFormat } from 'utils/util';
import { DealDetailsType } from '../types/deals.types';

type useDealInfoProps = {
  dealData: DealDetailsType;
};

const useDealInfo = (props: useDealInfoProps) => {
  const { dealData } = props;
  const {
    lead_source,
    lead_status,
    name,
    deal_value,
    description,
    lead_owner: { first_name, last_name },
    closing_date,
    probability,
    deal_stage,
    lead_score,
  } = dealData;
  const dealInfoComponents = {
    dealOwner: [first_name, last_name].join(' '),
    dealStatus: lead_status?.name,
    dealName: name,
    dealValue: usCurrencyFormat(deal_value || ''),
    dealSource: lead_source?.name,
    dealStage: deal_stage?.name,
    dealScore: lead_score,
    closingDate: closing_date && <DateFormat date={closing_date} />,
    probability: formatAsPercentage(probability),
    description,
  };
  return { dealInfoComponents };
};

export default useDealInfo;
