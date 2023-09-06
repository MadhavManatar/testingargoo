const PipelineFormSkeleton = () => {
  return (
    <>
      <div className="mb-[30px] sm:mb-[25px]">
        <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
        <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
      </div>
      <div className="flex flex-wrap items-center mb-[25px]">
        <span className="skeletonBox w-[26px] h-[26px] rounded-[5px] mr-[10px]" />
        <span className="skeletonBox w-[200px] max-w-[calc(100%_-_36px)]" />
      </div>
      <div className="mb-[30px] sm:mb-[25px]">
        <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
        <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
      </div>
      <div className="deal__stage__wrapper">
        <div className="deal__stage__box">
          <div className="form__Group">
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
          <div className="form__Group">
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
          <div className="form__Group">
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
          <button className="pointer-events-none !top-[8px]">
            <span className="skeletonBox w-[30px] h-[30px] rounded-full" />
          </button>
        </div>
        <div className="deal__stage__box">
          <div className="form__Group">
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
          <div className="form__Group">
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
          <div className="form__Group">
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
          <button className="pointer-events-none !top-[8px]">
            <span className="skeletonBox w-[30px] h-[30px] rounded-full" />
          </button>
        </div>
        <div className="deal__stage__box">
          <div className="form__Group">
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
          <div className="form__Group">
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
          <div className="form__Group">
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
          <button className="pointer-events-none !top-[8px]">
            <span className="skeletonBox w-[30px] h-[30px] rounded-full" />
          </button>
        </div>
      </div>
    </>
  );
};

export default PipelineFormSkeleton;
