import { DealFilter, RelatedLead } from 'pages/Contact/types/contacts.types';
import RelatedDealItems from './RelatedDealItems';
import WonRatio from 'components/Charts/WonRatio';
import WonDealsValue from 'components/Charts/WonDealsValue';
import StaticImageWithCount from 'components/Charts/StaticImageWithCount';
import RelatedDealsFilter from './RelatedDealsFilter';

interface PropsInterface {
  deals?: RelatedLead[];
  accordion?: { [key: string]: boolean };
  openCloseAccordion?: (value: string) => void;
  wonRationChart: { totalDeal: number; winDeal: number; lostDeal: number };
  WonDealsValueChart: { totalDealValue: number; wonDealValue: number };
  avgDays: number;
  dealFilter?: DealFilter;
  setDealFilter?: React.Dispatch<React.SetStateAction<DealFilter>>;
  contactData?:{
    id:number,
    name:string | undefined
  }
}

const RelatedDeals = (props: PropsInterface) => {
  const {
    deals,
    accordion,
    openCloseAccordion,
    wonRationChart,
    WonDealsValueChart,
    avgDays,
    dealFilter,
    setDealFilter,
    contactData
  } = props;

  return (
    <div
      className="details__RelatedDeal__wrapper mb-[30px]"
      id="related-account">
      <div className="section__header" onClick={() => openCloseAccordion && openCloseAccordion('relDeal')}>
        <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_212px)] pr-[10px]">
          Related Deals ({deals?.length || 0})
        </span>
        <div className="flex justify-end items-center">
          <div>
            <RelatedDealsFilter
              dealFilter={dealFilter}
              setDealFilter={setDealFilter}
            />
          </div>
          <button
            className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:-rotate-45 before:top-[8px] ${
              accordion && accordion.relDeal ? 'active' : ''
              } `}
            onClick={() => openCloseAccordion && openCloseAccordion('relDeal')}
          >
            .
          </button>
        </div>
      </div>
      {accordion && accordion.relDeal && (
        <div className="border border-whiteScreen__BorderColor rounded-[12px] p-[24px] pb-[4px] 3xl:p-[15px] 3xl:pb-0 sm:p-0 sm:border-0">
          {/* <div className="flex justify-end">
            <RelatedDealsFilter
              dealFilter={dealFilter}
              setDealFilter={setDealFilter}
            />
          </div> */}
          <div className="flex flex-wrap mx-[-10px] 3xl:mx-[-7px]">
            {deals &&
              deals.map((val, index: number) => {
                return val && <RelatedDealItems key={index} lead={val} contactData={contactData}/>;
              })}
            {deals?.length === 0 && (
              <div className="text-center w-full mb-[20px]">
                <span className="text text-[18px] font-biotif__Bold text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
                  No Deals Found
                </span>
              </div>
            )}
          </div>

          <div className="related__deal__chartWrapper flex flex-wrap mx-[-10px]">
            {(wonRationChart.winDeal > 0 || wonRationChart.lostDeal > 0) && (
              <div className="px-[10px] w-1/3 mb-[20px]">
                <div className="inner__wrapper h-full border-[1px] border-[#CCCCCC]/50 rounded-[10px]">
                  <WonRatio wonRationChart={wonRationChart} />
                </div>
              </div>
            )}
            {WonDealsValueChart.wonDealValue > 0 && (
              <div className="px-[10px] w-1/3 mb-[20px]">
                <div className="inner__wrapper h-full border-[1px] border-[#CCCCCC]/50 rounded-[10px]">
                  <WonDealsValue WonDealsValueChart={WonDealsValueChart} />
                </div>
              </div>
            )}
            {avgDays > 0 && (
              <div className="px-[10px] w-1/3 mb-[20px]">
                <div className="inner__wrapper h-full border-[1px] border-[#CCCCCC]/50 rounded-[10px]">
                  <StaticImageWithCount
                    days={avgDays}
                    key={avgDays}
                    type="Deals"
                    chartColor="blue"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default RelatedDeals;
