interface chartType {
  days: number;
  chartColor: string;
  type: string;
}
const StaticImageWithCount = (props: chartType) => {
  const { days, chartColor, type } = props;
  let imageUrl = 'lead__close__img.svg';
  let fontColor = 'text-[#F78310]';
  if (chartColor === 'blue') {
    imageUrl = 'deal__close__img.png';
    fontColor = 'text-[#1776BA]';
  }
  return (
    <div className="static__chart__wrapper flex flex-wrap content-between h-full">
      <h3 className="text-[16px] font-biotif__Medium text-[#2E3234] pt-[18px] px-[20px] w-full">
        Average Days to Close {type}
      </h3>
      <div className="chart__inner__wrapper w-full relative">
        <span
          className={`text-[50px] font-biotif__Medium ${fontColor} absolute right-[80px] top-[-20px]`}
        >
          {days} Days
        </span>
        <div className="img__wrapper">
          {/* deal__close__img.svg */}
          <img className="w-full" src={`/images/${imageUrl}`} alt="" />
        </div>
      </div>
    </div>
  );
};

export default StaticImageWithCount;
