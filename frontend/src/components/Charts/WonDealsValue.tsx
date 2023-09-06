import { usCurrencyFormat } from "utils/util";

interface chartType {
  WonDealsValueChart: { totalDealValue: number; wonDealValue: number };
}
const WonDealsValue = (props: chartType) => {
  const { WonDealsValueChart } = props;

  const barWidth =
    (WonDealsValueChart.wonDealValue * 100) / WonDealsValueChart.totalDealValue;

  return (
    <div className="chart-detail-2 h-full">
      <h2 className="text-[16px] font-biotif__Medium text-[#2E3234] px-[20px] py-[17px] w-full">
        Won Deals value
      </h2>
      <div className="px-[20px] h-[calc(100%_-_60px)] flex flex-wrap content-center">
        <div className="detail__wrapper w-full mb-[20px]">
          {WonDealsValueChart.wonDealValue && (
            <div className="detail__row inline-block mr-[15px] last:mr-0">
              <span className="block w-full text-[18px] font-biotif__Medium text-[#1776BA]">
                {usCurrencyFormat(WonDealsValueChart.wonDealValue)}
              </span>
              <span className="block w-full text-[14px] font-biotif__Regular text-black/50">
                Value Of Won deals
              </span>
            </div>
          )}
          {WonDealsValueChart.totalDealValue && (
            <div className="detail__row inline-block mr-[15px] last:mr-0">
              <span className="block w-full text-[18px] font-biotif__Medium text-[#1776BA]">
                {usCurrencyFormat(WonDealsValueChart.totalDealValue)}
              </span>
              <span className="block w-full text-[14px] font-biotif__Regular text-black/50">
                Value of total deals
              </span>
            </div>
          )}
        </div>
        <div className="progress__wrapper w-full h-[56px] rounded-[20px] bg-[#1776BA]/20">
          <div
            className="h-full bg-[#1776BA] rounded-[20px]"
            style={{ width: `${barWidth}%` }}
          />
        </div>
        <div className="w-full flex justify-center mt-[17px]">
          <div className="inline-flex items-center mr-[25px] last:mr-0">
            <span className="inline-block w-[12px] h-[12px] rounded-full bg-[#1776BA] mr-[6px]" />
            <span className="inline-block text-[14px] font-biotif__Medium text-black">
              Won
            </span>
          </div>
          <div className="inline-flex items-center mr-[25px] last:mr-0">
            <span className="inline-block w-[12px] h-[12px] rounded-full bg-[#1776BA]/20 mr-[6px]" />
            <span className="inline-block text-[14px] font-biotif__Medium text-black">
              Total
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WonDealsValue;
