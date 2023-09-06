import { RelatedLead } from 'pages/Contact/types/contacts.types';
import RelatedLeadItems from './RelatedLeadItems';
import ConvertionLeadToDeal from 'components/Charts/ConvertionLeadToDeal';
import ConvertedValue from 'components/Charts/ConvertedValue';
import StaticImageWithCount from 'components/Charts/StaticImageWithCount';

interface PropsInterface {
  leads?: RelatedLead[];
  accordion?: { [key: string]: boolean };
  openCloseAccordion?: (value: string) => void;
  LeadToDealChart: { lead: number; deal: number };
  convertedValueChart: { [key: string]: number };
  avgDays: number;
  contactData?:{
    id:number,
    name:string | undefined
  }
}

const RelatedLeads = (props: PropsInterface) => {
  const {
    leads,
    accordion,
    openCloseAccordion,
    LeadToDealChart,
    convertedValueChart,
    avgDays,
    contactData
  } = props;
  return (
    <>
      <div
        className="details__RelatedContact__wrapper mb-[30px]"
        id="related-account"
      >
        <div
          className="section__header"
          onClick={() => openCloseAccordion && openCloseAccordion('relLead')}
        >
          <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
            Related Leads ({leads?.length || 0})
          </span>
          <button
            className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:-rotate-45 before:top-[8px] ${
              accordion && accordion.relLead ? 'active' : ''
            } `}
          >
            .
          </button>
        </div>
        {accordion && accordion.relLead && (
          <div className="border border-whiteScreen__BorderColor rounded-[12px] p-[24px] pb-[4px] 3xl:p-[15px] 3xl:pb-0 sm:p-0 sm:border-0">
            <div className="flex flex-wrap mx-[-10px] 3xl:mx-[-7px]">
              {leads &&
                leads.map((val, index: number) => {
                  return val && <RelatedLeadItems key={index} lead={val} contactData={contactData}/>;
                })}
            </div>
            <div className="related__lead__chartWrapper flex flex-wrap mx-[-10px]">
              {(LeadToDealChart.deal > 0 || LeadToDealChart.lead > 0) && (
                <div className="px-[10px] w-1/3 mb-[20px] conversions__lead__to__deal">
                  <div className="inner__wrapper h-full border-[1px] border-[#CCCCCC]/50 rounded-[10px] overflow-hidden">
                    <ConvertionLeadToDeal LeadToDealChart={LeadToDealChart} />
                  </div>
                </div>
              )}
              {convertedValueChart && (
                <div className="px-[10px] w-1/3 mb-[20px] converted__value_chart">
                  <div className="inner__wrapper h-full border-[1px] border-[#CCCCCC]/50 rounded-[10px] overflow-hidden">
                    <ConvertedValue convertedValueChart={convertedValueChart} />
                  </div>
                </div>
              )}
              {avgDays > 0 && (
                <div className="px-[10px] w-1/3 mb-[20px] average__days__close__deals">
                  <div className="inner__wrapper h-full border-[1px] border-[#CCCCCC]/50 rounded-[10px] overflow-hidden">
                    <StaticImageWithCount
                      days={avgDays}
                      key={avgDays}
                      type="Leads"
                      chartColor="orange"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default RelatedLeads;
