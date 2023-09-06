const EditDealSkeleton = () => {
  return (
    <div className="dealEdit__skeleton">
      <div className="mb-[30px] xl:mb-[13px] sm:mb-[22px]">
        {[...Array(3)].map((_, idx) => (
          <div className="mx-[-15px] flex flex-wrap" key={idx}>
            <div className="w-1/2 px-[15px] sm:w-full">
              <div className="mb-[30px] xl:mb-[22px]">
                <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                <span className="skeletonBox w-full h-[48px] rounded-[8px] xl:h-[38px] xl:rounded-[6px]" />
              </div>
            </div>
            <div className="w-1/2 px-[15px] sm:w-full">
              <div className="mb-[30px] xl:mb-[22px]">
                <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                <span className="skeletonBox w-full h-[48px] rounded-[8px] xl:h-[38px] xl:rounded-[6px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-[30px] xl:mb-[13px] sm:mb-[22px]">
        {[...Array(3)].map((_, idx) => (
          <div className="mx-[-15px] flex flex-wrap" key={idx}>
            <div className="w-1/2 px-[15px] sm:w-full">
              <div className="mb-[30px] xl:mb-[22px]">
                <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                <span className="skeletonBox w-full h-[48px] rounded-[8px] xl:h-[38px] xl:rounded-[6px]" />
              </div>
            </div>
            <div className="w-1/2 px-[15px] sm:w-full">
              <div className="mb-[30px] xl:mb-[22px]">
                <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                <span className="skeletonBox w-full h-[48px] rounded-[8px] xl:h-[38px] xl:rounded-[6px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-0">
        {[...Array(3)].map((_, idx) => (
          <div className="mx-[-15px] flex flex-wrap" key={idx}>
            <div className="w-1/2 px-[15px] sm:w-full">
              <div className="mb-[30px] xl:mb-[22px]">
                <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                <span className="skeletonBox w-full h-[48px] rounded-[8px] xl:h-[38px] xl:rounded-[6px]" />
              </div>
            </div>
            <div className="w-1/2 px-[15px] sm:w-full">
              <div className="mb-[30px] xl:mb-[22px]">
                <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                <span className="skeletonBox w-full h-[48px] rounded-[8px] xl:h-[38px] xl:rounded-[6px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditDealSkeleton;
