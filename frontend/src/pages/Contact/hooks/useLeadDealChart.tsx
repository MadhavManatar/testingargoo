import { differenceInDays } from 'date-fns';
import { DealFilter, RelatedLead } from '../types/contacts.types';
import { calculateAverageOfArray } from 'utils/util';

type Props = {
  relatedData?: RelatedLead[];
  dealFilter?: DealFilter;
  setDealFilter?: React.Dispatch<React.SetStateAction<DealFilter>>;
};

const useLeadDealChart = (props: Props) => {
  const { relatedData, dealFilter } = props;
  /* Chart & Lead & Deal */
  const relatedLeads: RelatedLead[] = [];
  const relatedDeals: RelatedLead[] = [];
  // Conversions of lead to deal
  let totalLeads = 0;
  let totalLeadsConvertedToDeal = 0;
  // Converted Value
  const convertedValueChart: { [key: string]: number } = {};
  // Won Ratio
  let totalDeal = 0;
  let winDeal = 0;
  let lostDeal = 0;
  // Won Deals value
  let totalDealValue = 0;
  let wonDealValue = 0;
  // Lead Close Days
  const leadComplateDays: number[] = [];
  const dealComplateDays: number[] = [];
  // Loop & Count Data
  if (relatedData) {
    relatedData.forEach((value: RelatedLead) => {
      if (value && value?.is_deal) {
        // Deal Won & Lost
        const stageData = value.deal_stage_history.filter(
          (stage) => stage.isCurrentActive
        );
        // Filter By Won & Lost
        if (
          (dealFilter?.won && stageData[0]?.stage?.stage_type === 'Win') ||
          (dealFilter?.lost && stageData[0]?.stage?.stage_type === 'Lost') ||
          (dealFilter?.active &&
            stageData[0]?.stage?.stage_type !== 'Lost' &&
            stageData[0]?.stage?.stage_type !== 'Win') ||
          (!dealFilter?.won && !dealFilter?.lost && !dealFilter?.active)
        ) {
          // Lead Convert To Deal
          if (value?.converted_by) {
            totalLeadsConvertedToDeal += 1;
            // Lead Complate Days
            let diffLead = differenceInDays(
              new Date(value.converted_at),
              new Date(value.created_at)
            );
            diffLead = diffLead === 0 ? 1 : diffLead;
            leadComplateDays.push(diffLead);
          }
          // Lead Complate Days
          let diffDeal = differenceInDays(
            new Date(stageData[0]?.start_time),
            new Date(value.created_at)
          );
          diffDeal = diffDeal === 0 ? 1 : diffDeal;
          if (stageData[0]?.stage?.stage_type === 'Win') {
            winDeal += 1;
            wonDealValue += value?.deal_value || 0;
            dealComplateDays.push(diffDeal);
          }
          if (stageData[0]?.stage?.stage_type === 'Lost') {
            lostDeal += 1;
            dealComplateDays.push(diffDeal);
          }
          // Deal Value
          totalDealValue += value?.deal_value || 0;
          // Add To Related Deal Array
          relatedDeals.push(value);
        }
      } else if (value) {
        totalLeads += 1;
        relatedLeads.push(value);
        // Lead Status Count
        const statusId = value?.lead_status_id;
        if (convertedValueChart[statusId]) {
          convertedValueChart[statusId]++;
        } else {
          convertedValueChart[statusId] = 1;
        }
      }
    });
  }
  // Total Deal Count
  totalDeal = relatedDeals.length;
  // Conversions of lead to deal
  const LeadToDealChart = {
    lead: totalLeads,
    deal: totalLeadsConvertedToDeal,
  };
  // Won Ratio
  const wonRationChart = {
    totalDeal,
    winDeal,
    lostDeal,
  };
  // Won Deals Value
  const WonDealsValueChart = { totalDealValue, wonDealValue };
  // Calculate Average For Chart
  const leadComplateDaysAvg = calculateAverageOfArray(leadComplateDays);

  const dealComplateDaysAvg = calculateAverageOfArray(dealComplateDays);
  return {
    relatedLeads,
    relatedDeals,
    LeadToDealChart,
    convertedValueChart,
    wonRationChart,
    WonDealsValueChart,
    leadComplateDaysAvg,
    dealComplateDaysAvg,
  };
};
export default useLeadDealChart;
