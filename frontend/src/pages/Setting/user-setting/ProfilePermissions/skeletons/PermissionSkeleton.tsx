const PermissionSkeleton = () => {
  return (
    <>
      <div className="skeletonBox w-[215px] max-w-full mb-[25px] sm:mb-[12px]" />
      <div className="permissionBody mb-[40px] sm:mb-[26px]">
      {[...Array(6)].map((_, index) => (
        <div className="permission__Row items-center mb-[22px] last:!mb-0 lg:!py-[15px] sm:mb-[10px]" key={index}>
          <div className="permission__TD permission__LB lg:flex lg:!items-center lg:!w-full lg:!pr-0">
            <div className="permission__Label lg:!w-[calc(100%_-_75px)]">
              <span className="skeletonBox w-full lg:w-[200px] lg:max-w-full" />
            </div>
            <div className="skeletonBox w-[42px] h-[20px] rounded-[30px]" />
            <div className="skeletonBox hidden w-[20px] h-[20px] rounded-full ml-[7px] lg:block" />
          </div>
          <div className="permission__TD permissionEnableList !px-[5px] lg:!px-0 lg:!mt-[16px]">
            <ul className="permission__ELUL w-full">
              <div className="flex flex-wrap items-center w-full lg:justify-between">
                <li className="permission__ELItem !mb-0 !px-[10px] w-1/4 before:!hidden lg:!px-0 lg:w-[calc(25%_-_15px)] sm:w-[calc(25%_-_10px)]">
                  <span className="skeletonBox w-full" />
                </li>
                <li className="permission__ELItem !mb-0 !px-[10px] w-1/4 before:!hidden lg:!px-0 lg:w-[calc(25%_-_15px)] sm:w-[calc(25%_-_10px)]">
                  <span className="skeletonBox w-full" />
                </li>
                <li className="permission__ELItem !mb-0 !px-[10px] w-1/4 before:!hidden lg:!px-0 lg:w-[calc(25%_-_15px)] sm:w-[calc(25%_-_10px)]">
                  <span className="skeletonBox w-full" />
                </li>
                <li className="permission__ELItem !mb-0 !px-[10px] w-1/4 before:!hidden lg:!px-0 lg:w-[calc(25%_-_15px)] sm:w-[calc(25%_-_10px)]">
                  <span className="skeletonBox w-full" />
                </li>
              </div>
            </ul>
          </div>
          <div className="permission__TD permissionEdit">
            <span className="skeletonBox w-full" />
          </div>
        </div>
      ))}
      </div>

      <div className="skeletonBox w-[215px] max-w-full mb-[25px] sm:mb-[12px]" />
      <div className="permissionBody">
      {[...Array(6)].map((_, index) => (
        <div className="permission__Row items-center mb-[22px] last:!mb-0 lg:!py-[15px] sm:mb-[10px]" key={index}>
          <div className="permission__TD permission__LB lg:flex lg:!items-center lg:!w-full lg:!pr-0">
            <div className="permission__Label lg:!w-[calc(100%_-_75px)]">
              <span className="skeletonBox w-full lg:w-[200px] lg:max-w-full" />
            </div>
            <div className="skeletonBox w-[42px] h-[20px] rounded-[30px]" />
            <div className="skeletonBox hidden w-[20px] h-[20px] rounded-full ml-[7px] lg:block" />
          </div>
          <div className="permission__TD permissionEnableList !px-[5px] lg:!px-0 lg:!mt-[16px]">
            <ul className="permission__ELUL w-full">
              <div className="flex flex-wrap items-center w-full lg:justify-between">
                <li className="permission__ELItem !mb-0 !px-[10px] w-1/4 before:!hidden lg:!px-0 lg:w-[calc(25%_-_15px)] sm:w-[calc(25%_-_10px)]">
                  <span className="skeletonBox w-full" />
                </li>
                <li className="permission__ELItem !mb-0 !px-[10px] w-1/4 before:!hidden lg:!px-0 lg:w-[calc(25%_-_15px)] sm:w-[calc(25%_-_10px)]">
                  <span className="skeletonBox w-full" />
                </li>
                <li className="permission__ELItem !mb-0 !px-[10px] w-1/4 before:!hidden lg:!px-0 lg:w-[calc(25%_-_15px)] sm:w-[calc(25%_-_10px)]">
                  <span className="skeletonBox w-full" />
                </li>
                <li className="permission__ELItem !mb-0 !px-[10px] w-1/4 before:!hidden lg:!px-0 lg:w-[calc(25%_-_15px)] sm:w-[calc(25%_-_10px)]">
                  <span className="skeletonBox w-full" />
                </li>
              </div>
            </ul>
          </div>
          <div className="permission__TD permissionEdit">
            <span className="skeletonBox w-full" />
          </div>
        </div>
      ))}
      </div>
    </>
  );
};

export default PermissionSkeleton;
