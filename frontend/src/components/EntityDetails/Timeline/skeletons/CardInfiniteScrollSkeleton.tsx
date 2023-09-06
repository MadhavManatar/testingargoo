export const CardInfiniteScrollSkeleton = () => {
  return (
    <>
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="agGrid__infinite__box__skeleton border border-[#CCCCCC]/50 rounded-[12px] p-[15px] mb-[15px] relative"
        >
          <div className="ag__ib__row__skeleton mb-[28px] pr-[74px]">
            <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
            <div className="skeletonBox w-[200px] max-w-full" />
          </div>
          <div className="flex flex-wrap mx-[-6px]">
            <div className="ag__ib__row__skeleton px-[6px] w-1/2 mb-[28px]">
              <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
              <div className="skeletonBox w-[200px] max-w-full" />
            </div>
            <div className="ag__ib__row__skeleton px-[6px] w-1/2 mb-[28px]">
              <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
              <div className="skeletonBox w-[200px] max-w-full" />
            </div>
          </div>
          <div className="flex flex-wrap mx-[-6px]">
            <div className="ag__ib__row__skeleton px-[6px] w-1/2">
              <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
              <div className="skeletonBox w-[200px] max-w-full" />
            </div>
            <div className="ag__ib__row__skeleton px-[6px] w-1/2">
              <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
              <div className="skeletonBox w-[200px] max-w-full" />
            </div>
          </div>
          <div className="skeletonBox w-[28px] h-[28px] rounded-[6px] absolute top-[10px] right-[10px]" />
          <div className="skeletonBox w-[28px] h-[28px] rounded-[6px] absolute top-[10px] right-[47px]" />
        </div>
      ))}
    </>
  );
};
