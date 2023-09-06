const PhoneTypeFormSkeleton = () => {
  return (
    <>
      <div className="mb-[30px] sm:mb-[25px]">
        <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
        <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
      </div>
      <div className="icon__libraryBox__wrapper">
        <span className="skeletonBox w-[250px] max-w-full mb-[15px]" />
        <div className="flex flex-wrap">
          <div className="skeletonBox w-[46px] h-[46px] rounded-[10px] mr-[20px] mb-[20px]" />
          <div className="skeletonBox w-[46px] h-[46px] rounded-[10px] mr-[20px] mb-[20px]" />
          <div className="skeletonBox w-[46px] h-[46px] rounded-[10px] mr-[20px] mb-[20px]" />
          <div className="skeletonBox w-[46px] h-[46px] rounded-[10px] mr-[20px] mb-[20px]" />
          <div className="skeletonBox w-[46px] h-[46px] rounded-[10px] mr-[20px] mb-[20px]" />
          <div className="skeletonBox w-[46px] h-[46px] rounded-[10px] mr-[20px] mb-[20px]" />
          <div className="skeletonBox w-[46px] h-[46px] rounded-[10px] mr-[20px] mb-[20px]" />
        </div>
      </div>
    </>
  );
};

export default PhoneTypeFormSkeleton;
