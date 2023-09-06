const DetailPageHeaderInfoSkeleton = () => {
  return (
    <div className="leads__header__info border border-whiteScreen__BorderColor rounded-[12px] p-[24px] flex flex-wrap mb-[20px] lg:pb-[12px] sm:p-[15px] sm:pb-[8px]">
      <div className="left w-[calc(100%_-_200px)] lg:w-full">
        <div className="flex flex-wrap">
          <h6 className="text-dark__TextColor text-[20px] font-biotif__Medium mr-[15px] mb-[10px] mt-[6px]">
            <div className="skeletonBox w-[130px]" />
          </h6>
          <div className="badge__wrapper mb-[10px]">
            <span className="inline-block mr-[12px]">
              <div className="skeletonBox w-[115px] h-[26px] rounded-[8px]" />
            </span>
            <span className="inline-block mr-[12px]">
              <div className="skeletonBox w-[115px] h-[26px] rounded-[8px]" />
            </span>
            <span className="inline-block mr-[12px]">
              <div className="skeletonBox w-[115px] h-[26px] rounded-[8px]" />
            </span>
            <span className="inline-block mr-[12px]">
              <div className="skeletonBox w-[115px] h-[26px] rounded-[8px]" />
            </span>
            <span className="inline-block mr-[12px]">
              <div className="skeletonBox w-[115px] h-[26px] rounded-[8px]" />
            </span>
          </div>
        </div>
        <div className="buttons__wrapper flex flex-wrap items-center">
          <div className="inline-block mr-[20px] mb-[10px] sm:mr-[18px] xsm:mr-[10px]">
            <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
          </div>
          <div className="inline-block mr-[20px] mb-[10px] sm:mr-[18px] xsm:mr-[10px]">
            <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
          </div>
          <div className="inline-block mr-[20px] mb-[10px] sm:mr-[18px] xsm:mr-[10px]">
            <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
          </div>
          <div className="inline-block mr-[20px] mb-[10px] sm:mr-[18px] xsm:mr-[10px]">
            <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
          </div>
          <div className="inline-block mr-[20px] mb-[10px] sm:mr-[18px] xsm:mr-[10px]">
            <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
          </div>
          <div className="inline-block mr-[20px] mb-[10px] sm:mr-[18px] xsm:mr-[10px]">
            <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
          </div>
        </div>
      </div>
      <div className="right w-[180px] pl-[20px] ml-[20px] border-l border-l-whiteScreen__BorderColor flex flex-wrap content-center lg:w-full lg:pl-0 lg:ml-0 lg:border-l-0 lg:border-t lg:border-t-whiteScreen__BorderColor lg:pt-[12px] lg:mt-[12px]">
        <div className="w-full flex flex-wrap items-center mb-[10px] lg:inline-flex lg:mr-[20px] lg:w-auto">
          <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
          <span className="value w-[calc(100%_-_30px)] pl-[15px] lg:w-[100px] sm:w-[150px]">
            <div className="skeletonBox w-full" />
          </span>
        </div>
        <div className="w-full flex flex-wrap items-center lg:inline-flex lg:mr-[20px] lg:w-auto lg:mb-[10px]">
          <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
          <span className="value w-[calc(100%_-_30px)] pl-[15px] lg:w-[100px] sm:w-[150px]">
            <div className="skeletonBox w-full" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailPageHeaderInfoSkeleton;
