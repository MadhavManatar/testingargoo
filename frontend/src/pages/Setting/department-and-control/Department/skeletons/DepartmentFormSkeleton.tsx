const DepartmentFormSkeleton = () => {
  return (
    <>
      <div className="mx-[-15px] flex flex-wrap">
        <div className="w-full px-[15px] sm:w-full">
          <div className="mb-[30px]">
            <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
            <span className="skeletonBox w-full h-[48px] rounded-[8px]" />
          </div>
        </div>
        <div className="w-full px-[15px] sm:w-full">
          <div className="mb-[30px]">
            <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
            <span className="skeletonBox w-full h-[48px] rounded-[8px]" />
          </div>
        </div>
        <div className="w-full px-[15px] sm:w-full">
          <div className="mb-[30px]">
            <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
            <span className="skeletonBox w-full h-[150px] rounded-[8px]" />
          </div>
        </div>
      </div>
      <span className="skeletonBox w-[150px] max-w-full mb-[14px]" />
      <div className="add__member__box bg-formField__BGColor rounded-[10px] p-[15px] flex flex-wrap items-center">
        <div className="left flex items-center flex-wrap w-[calc(100%_-_147px)] pr-[15px] 4xl:w-full 4xl:pr-0 4xl:mb-[10px] xl:w-[calc(100%_-_147px)] sm:w-full">
          <div className="icon__wrapper">
            <span className="skeletonBox w-[38px] h-[38px] rounded-[8px]" />
          </div>
          <div className="details__wrapper w-[calc(100%_-_39px)] pl-[14px]">
            <div className="skeletonBox w-[130px] max-w-full mb-[8px]" />
            <div className="skeletonBox w-full max-w-full" />
          </div>
        </div>
        <div className="skeletonBox w-[145px] h-[40px] max-w-full rounded-[8px] 4xl:w-full xl:w-[130px] xl:ml-[10px] sm:w-full sm:ml-0" />
      </div>
      <div className="flex flex-wrap mt-[35px] 4xl:justify-between xl:mt-[25px]">
        <div className="mr-[16px] min-w-[120px] 4xl:mr-0 4xl:min-w-[calc(50%_-_8px)]">
          <div className="skeletonBox w-full h-[40px] max-w-full rounded-[8px]" />
        </div>
        <div className="min-w-[120px] 4xl:min-w-[calc(50%_-_8px)]">
          <div className="skeletonBox w-full h-[40px] max-w-full rounded-[8px]" />
        </div>
      </div>
    </>
  );
};

export default DepartmentFormSkeleton;
