const PersonalSettingsViewSkeleton = () => {
  return (
    <div className="personal__settings__skeleton border border-[#CCCCCC] rounded-[20px]">
      <div className="flex flex-wrap items-center p-[30px] border-b border-b-[#CCCCCC] 3xl:px-[15px] 3xl:py-[20px] 3xl:pb-[13px] sm:block">
        <div className="inline-block relative">
          <span className="skeletonBox w-[70px] h-[70px] rounded-full" />
        </div>
        <div className="w-[calc(100%_-_72px)] pl-[12px] sm:w-full sm:pl-0 sm:mt-[15px]">
          <h6 className="text-[16px] text-dark__TextColor font-biotif__Medium mb-[10px] flex items-center">
            <span className="skeletonBox w-[150px] mr-[10px]" />
            <span className="skeletonBox w-[90px]" />
          </h6>
          <a className="inline-flex items-center mr-[20px] mb-[10px] lg:mr-[12px] lg:w-[calc(50%_-_12px)]">
            <span className="skeletonBox w-[26px] h-[26px] rounded-[6px] mr-[10px]" />
            <span className="skeletonBox w-[200px] max-w-[calc(100%_-_38px)] lg:w-[calc(100%_-_38px)]" />
          </a>
          <a className="inline-flex items-center mr-[20px] mb-[10px] lg:mr-[12px] lg:w-[calc(50%_-_12px)]">
            <span className="skeletonBox w-[28px] h-[28px] rounded-[6px] mr-[10px]" />
            <span className="skeletonBox w-[200px] max-w-[calc(100%_-_38px)] lg:w-[calc(100%_-_38px)]" />
          </a>
        </div>
      </div>

      {/* User Information */}
      <div className="p-[30px] border-b border-b-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[22px]">
        <h3 className="setting__FieldTitle">
          <span>
            <span className="skeletonBox w-[200px]" />
          </span>
          <button>
            <span className="skeletonBox w-[28px] h-[28px] rounded-[6px]" />
          </button>
        </h3>
        <div className="flex flex-wrap mx-[-10px]">
          {[...Array(12)].map((_, idx) => (
            <div
              className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full"
              key={idx}
            >
              <p className="ipInfo__View__Label sm:!w-[144px] sm:!mb-[7px] xsm:!w-[115px]">
                <span className="skeletonBox w-full" />
              </p>
              <p className="ipInfo__View__Value pt-0">
                <span className="skeletonBox max-w-full" />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="p-[30px] border-b border-b-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[22px]">
        <h3 className="setting__FieldTitle">
          <span>
            <span className="skeletonBox w-[200px]" />
          </span>
          <button>
            <span className="skeletonBox w-[28px] h-[28px] rounded-[6px]" />
          </button>
        </h3>
        <div className="flex flex-wrap mx-[-10px]">
          {[...Array(6)].map((_, idx) => (
            <div
              className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full"
              key={idx}
            >
              <p className="ipInfo__View__Label sm:!w-[144px] sm:!mb-[7px] xsm:!w-[115px]">
                <span className="skeletonBox w-full" />
              </p>
              <p className="ipInfo__View__Value pt-0">
                <span className="skeletonBox max-w-full" />
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Profiles */}
      <div className="p-[30px] 3xl:px-[15px] 3xl:py-[22px]">
        <h3 className="setting__FieldTitle">
          <span>
            <span className="skeletonBox w-[200px]" />
          </span>
          <button>
            <span className="skeletonBox w-[28px] h-[28px] rounded-[6px]" />
          </button>
        </h3>
        <div className="flex flex-wrap mx-[-10px]">
          {[...Array(4)].map((_, idx) => (
            <div
              className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full"
              key={idx}
            >
              <p className="ipInfo__View__Label sm:!w-[144px] sm:!mb-[7px] xsm:!w-[115px]">
                <span className="skeletonBox w-full" />
              </p>
              <p className="ipInfo__View__Value pt-0">
                <span className="skeletonBox max-w-full" />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalSettingsViewSkeleton;
