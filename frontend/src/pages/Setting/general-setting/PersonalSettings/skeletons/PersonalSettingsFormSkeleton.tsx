const PersonalSettingsFormSkeleton = () => {
  return (
    <div>
      <div className="ipTabsContant">
        <div className="upload__File">
          <div className="flex flex-wrap items-center mb-[25px]">
            <div className="inline-block relative">
              <div className="inline-block">
                <span className="skeletonBox w-[70px] h-[70px] rounded-full" />
              </div>
            </div>
            <div className="w-[calc(100%_-_72px)] pl-[12px]">
              <span className="skeletonBox w-[180px] max-w-full mb-[15px]" />
              <div className="w-[500px] max-w-full">
                <span className="skeletonBox my-[8px]" />
                <span className="skeletonBox w-[230px] max-w-full" />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-[30px] mt-[30px] lg:mt-[18px] lg:mb-[20px]">
          <h3 className="setting__FieldTitle !mb-[30px] lg:!mb-[24px]">
            <span className="skeletonBox w-[200px]" />
          </h3>
          {[...Array(6)].map((_, idx) => (
            <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]" key={idx}>
              <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
                <div className="mb-[30px] sm:mb-[25px]">
                  <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                  <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
                </div>
              </div>
              <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
                <div className="mb-[30px] sm:mb-[25px]">
                  <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                  <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-[30px] lg:mb-[20px]">
          <h3 className="setting__FieldTitle">
            <span className="skeletonBox w-[200px]" />
          </h3>
          {[...Array(3)].map((_, idx) => (
            <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]" key={idx}>
              <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
                <div className="mb-[30px] sm:mb-[25px]">
                  <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                  <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
                </div>
              </div>
              <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
                <div className="mb-[30px] sm:mb-[25px]">
                  <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                  <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-[30px] lg:mb-0">
          <h3 className="setting__FieldTitle">
            <span className="skeletonBox w-[200px]" />
          </h3>
          <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]">
            <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
              <div className="mb-[30px] sm:mb-[25px]">
                <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
              </div>
            </div>
            <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
              <div className="mb-[30px] sm:mb-[25px]">
                <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
              </div>
            </div>
          </div>
          <div className="mx-[-30px] flex flex-wrap xl:mx-[-15px] lg:mx-[-10px]">
            <div className="w-1/2 px-[30px] xl:px-[15px] lg:px-[10px] sm:w-full">
              <div className="mb-[30px] sm:mb-[25px]">
                <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
                <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalSettingsFormSkeleton;
