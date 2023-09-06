const EmailDetailSkeleton = () => {
  return (
    <div className="inbox__view__page__wrapper">
      <div className="inbox__view__actionbar bg-ipGray__transparentBG py-[10px] px-[13px] rounded-[12px] flex flex-wrap items-center justify-between mb-[30px] lg:bg-transparent lg:py-0 lg:px-0 lg:rounded-none lg:mb-[12px]">
        <div className="left flex flex-wrap items-center lg:w-full lg:justify-between">
          <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[30px]" />
          <div className="inline-flex items-center">
            <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[20px] last:mr-0" />
            <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[20px] last:mr-0" />
            <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[20px] last:mr-0" />
            <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[20px] last:mr-0" />
          </div>
        </div>
        <div className="right flex flex-wrap items-center lg:hidden">
          <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[10px] last:mr-0" />
          <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[10px] last:mr-0" />
        </div>
      </div>
      <div className="inbox__view__header flex flex-wrap items-start justify-between pl-[84px] mb-[15px] lg:pl-0">
        <div className="title text-[28px] leading-[32px] text-ipBlack__textColor font-biotif__Medium w-[calc(100%_-_80px)] pr-[15px] lg:pr-0 lg:w-full lg:text-[18px] lg:font-biotif__Medium lg:leading-[24px] lg:mt-[10px] lg:mb-[13px]">
          <div className="skeletonBox w-[400px] max-w-full lg:max-w-[70%]" />
        </div>
        <div className="print__share__btns flex flex-wrap items-center lg:hidden">
          <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[10px] last:mr-0" />
          <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[10px] last:mr-0" />
        </div>
      </div>
      <div className="inbox__view__box relative min-h-[60px] pl-[84px] lg:pl-0">
        <div className="skeletonBox w-[52px] h-[52px] absolute top-0 left-[12px] rounded-full lg:w-[38px] lg:h-[38px] lg:left-0" />
        <div className="sender__header flex flex-wrap items-center justify-between mb-[12px] lg:relative lg:pl-[50px]">
          <div className="w-full text-[18px] font-biotif__Medium text-ipBlack__textColor lg:text-[16px] lg:font-biotif__Medium lg:text-[#2E3234] lg:whitespace-pre lg:overflow-hidden lg:text-ellipsis lg:leading-[20px] lg:w-[calc(100%_-_108px)]">
            <div className="skeletonBox w-[450px] max-w-full mb-[7px] lg:mb-[8px] lg:w-full" />
          </div>
          <div className="left inline-flex flex-wrap relative top-[-5px] max-w-[calc(100%_-_328px)] lg:max-w-[calc(100%_-_108px)] lg:top-0">
            <div className="skeletonBox w-[300px] max-w-full" />
          </div>
          <div className="text-[12px] text-[#5F6368] font-biotif__Regular relative top-[2px] pr-[10px] hidden lg:inline-block lg:w-full lg:pr-0 lg:text-[10px] lg:mt-[7px]">
            <div className="skeletonBox w-[300px] max-w-full lg:w-[180px] lg:max-w-[60%]" />
          </div>
          <div className="right inline-flex items-center">
            <div className="inline-block text-[12px] text-[#5F6368] font-biotif__Regular relative top-[2px] pr-[10px] lg:hidden">
              <div className="skeletonBox w-[300px] max-w-full xl:w-[200px]" />
            </div>
            <div className="ivb__action__box flex flex-wrap items-center lg:absolute lg:top-[2px] lg:right-[-10px]">
              <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[6px] last:mr-0" />
              <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[6px] last:mr-0" />
              <div className="skeletonBox w-[32px] h-[32px] rounded-full mr-[6px] last:mr-0" />
            </div>
          </div>
        </div>
        <div className="sender__contant mb-[50px] 3xl:mb-[30px] lg:mb-[40px] lg:mt-[25px]">
          <div className="w-[800px] max-w-full">
            <div className="skeletonBox w-full mb-[10px]" />
            <div className="skeletonBox w-[80%] mb-[10px]" />
            <div className="skeletonBox w-[70%] mb-[10px]" />
            <div className="skeletonBox w-[90%] mb-[10px]" />
            <div className="skeletonBox w-full mb-[10px]" />
            <div className="skeletonBox w-[70%] mb-[30px]" />
            <div className="skeletonBox w-full mb-[10px]" />
            <div className="skeletonBox w-[80%] mb-[10px]" />
            <div className="skeletonBox w-[70%] mb-[10px]" />
            <div className="skeletonBox w-[90%] mb-[10px]" />
            <div className="skeletonBox w-full mb-[10px]" />
            <div className="skeletonBox w-[70%] mb-[30px]" />
            <div className="skeletonBox w-full mb-[10px]" />
            <div className="skeletonBox w-[80%] mb-[10px]" />
            <div className="skeletonBox w-[70%] mb-[10px]" />
            <div className="skeletonBox w-[90%] mb-[10px]" />
            <div className="skeletonBox w-full mb-[10px]" />
            <div className="skeletonBox w-[70%]" />
          </div>
        </div>
        <div className="ivb__submit__btns flex flex-wrap items-center">
          <div className="skeletonBox w-[100px] h-[38px] rounded-[6px] mr-[10px] last:mr-0 sm:w-[90px]" />
          <div className="skeletonBox w-[100px] h-[38px] rounded-[6px] mr-[10px] last:mr-0 sm:w-[90px]" />
          <div className="skeletonBox w-[100px] h-[38px] rounded-[6px] mr-[10px] last:mr-0 sm:w-[90px]" />
        </div>
      </div>
    </div>
  );
};

export default EmailDetailSkeleton;
