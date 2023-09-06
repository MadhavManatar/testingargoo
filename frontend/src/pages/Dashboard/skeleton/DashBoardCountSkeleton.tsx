export const DashBoardCountSkeleton = () => {
  return (
    <div className="w-auto ml-[-10px] mr-[-10px] flex flex-wrap">
      <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
        <div className="ip__Counter__Box !bg-ipGray__transparentBG">
          <div className="ip__Counter__Header">
            <div className="ip__Counter__Title !text-ip__Blue">
              <span className="skeletonBox" />
            </div>
            <span className="skeletonBox w-[30px] h-[30px]" />
          </div>
          <div className="ip__Counter__Number">
            <span className="skeletonBox w-[100px] h-[70px] rounded-[12px]" />
          </div>
          <span className="skeletonBox w-[50%] mt-[25px]" />
        </div>
      </div>
      <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
        <div className="ip__Counter__Box !bg-ipGray__transparentBG">
          <div className="ip__Counter__Header">
            <div className="ip__Counter__Title !text-ip__Blue">
              <span className="skeletonBox" />
            </div>
            <span className="skeletonBox w-[30px] h-[30px]" />
          </div>
          <div className="ip__Counter__Number">
            <span className="skeletonBox w-[100px] h-[70px] rounded-[12px]" />
          </div>
          <span className="skeletonBox w-[50%] mt-[25px]" />
        </div>
      </div>
      <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
        <div className="ip__Counter__Box !bg-ipGray__transparentBG">
          <div className="ip__Counter__Header">
            <div className="ip__Counter__Title !text-ip__Blue">
              <span className="skeletonBox" />
            </div>
            <span className="skeletonBox w-[30px] h-[30px]" />
          </div>
          <div className="ip__Counter__Number">
            <span className="skeletonBox w-[100px] h-[70px] rounded-[12px]" />
          </div>
          <span className="skeletonBox w-[50%] mt-[25px]" />
        </div>
      </div>
      <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
        <div className="ip__Counter__Box !bg-ipGray__transparentBG">
          <div className="ip__Counter__Header">
            <div className="ip__Counter__Title !text-ip__Blue">
              <span className="skeletonBox" />
            </div>
            <span className="skeletonBox w-[30px] h-[30px]" />
          </div>
          <div className="ip__Counter__Number">
            <span className="skeletonBox w-[100px] h-[70px] rounded-[12px]" />
          </div>
          <span className="skeletonBox w-[50%] mt-[25px]" />
        </div>
      </div>
      <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
        <div className="ip__Counter__Box !bg-ipGray__transparentBG">
          <div className="ip__Counter__Header">
            <div className="ip__Counter__Title !text-ip__Blue">
              <span className="skeletonBox" />
            </div>
            <span className="skeletonBox w-[30px] h-[30px]" />
          </div>
          <div className="ip__Counter__Number">
            <span className="skeletonBox w-[100px] h-[70px] rounded-[12px]" />
          </div>
          <span className="skeletonBox w-[50%] mt-[25px]" />
        </div>
      </div>
    </div>
  );
};

export const ContactsSkeleton = () => {
  return (
    <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
      <div className="ip__Counter__Box !bg-ipGray__transparentBG">
        <div className="ip__Counter__Header">
          <div className="ip__Counter__Title !text-ip__Blue">
            <span className="skeletonBox" />
          </div>
          <span className="skeletonBox w-[30px] h-[30px]" />
        </div>
        <div className="ip__Counter__Number !mb-0 !mt-[7px]">
          <span className="skeletonBox w-[100px] h-[70px] rounded-[12px]" />
        </div>
        <span className="skeletonBox w-[50%] mt-[15px]" />
      </div>
    </div>
  );
};

export const DealsSkeleton = () => {
  return <DashBoardSkeleton />;
};

export const LeadsSkeleton = () => {
  return <DashBoardSkeleton />;
};

export const ActivitySkeleton = () => {
  return <DashBoardSkeleton />;
};

export const AccountSkeleton = () => {
  return <DashBoardSkeleton />;
};
const DashBoardSkeleton = () => {
  return (
    <>
      <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
        <div className="ip__Counter__Box !bg-ipGray__transparentBG">
          <div className="ip__Counter__Header">
            <div className="ip__Counter__Title !text-ip__Blue">
              <span className="skeletonBox" />
            </div>
            <span className="skeletonBox w-[30px] h-[30px]" />
          </div>
          <div className="ip__Counter__Number !mb-0 !mt-[7px]">
            <span className="skeletonBox w-[100px] h-[70px] rounded-[12px]" />
          </div>
          <span className="skeletonBox w-[50%] mt-[15px]" />
        </div>
      </div>
    </>
  );
};
