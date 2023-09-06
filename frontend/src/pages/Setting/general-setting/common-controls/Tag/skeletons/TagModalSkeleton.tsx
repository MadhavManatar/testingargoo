const TagModalSkeleton = () => {
  return (
    <>
      <div className="w-full">
        <div className="mb-[30px] sm:mb-[25px]">
          <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
          <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
          <div className="skeletonBox w-full h-full rounded-full relative" />
        </div>
        <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
          <div className="skeletonBox w-full h-full rounded-full relative" />
        </div>
        <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
          <div className="skeletonBox w-full h-full rounded-full relative" />
        </div>
        <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
          <div className="skeletonBox w-full h-full rounded-full relative" />
        </div>
        <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
          <div className="skeletonBox w-full h-full rounded-full relative" />
        </div>
      </div>
    </>
  );
};

export default TagModalSkeleton;
