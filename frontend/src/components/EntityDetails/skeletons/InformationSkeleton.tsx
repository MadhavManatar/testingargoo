type infoSkeletonProps = {
  infoCount?: number;
  addressCount?: number;
  isDescription?: boolean;
};
function InformationSkeleton(props: infoSkeletonProps) {
  const { addressCount = 0, infoCount = 0, isDescription = false } = props;
  return (
    <div className="border border-[#CCCCCC] rounded-[20px] sm:ml-[-15px] sm:mr-[-15px] sm:rounded-none sm:border-0 sm:bg-ipGray__transparentBG ip__info__sec">
      {infoCount ? (
        <div
          className={`p-[30px]  3xl:px-[15px] 3xl:py-[22px] ${
            isDescription || addressCount ? 'border-b border-b-[#CCCCCC]' : ''
          }`}
        >
          <h3 className="setting__FieldTitle">
            <span>
              <span className="skeletonBox w-[200px]" />
            </span>
            <button>
              <span className="skeletonBox w-[28px] h-[28px] rounded-[6px]" />
            </button>
          </h3>
          <div className="flex flex-wrap mx-[-10px]">
            {Array(infoCount)
              .fill('info')
              .map((_val) => {
                return (
                  <div
                    className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full"
                    key={window.self.crypto.randomUUID()}
                  >
                    <p className="ipInfo__View__Label sm:!w-[160px] sm:!mb-[7px]">
                      <span className="skeletonBox w-full" />
                    </p>
                    <p className="ipInfo__View__Value">
                      <span className="skeletonBox max-w-full" />
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        ''
      )}
      {addressCount ? (
        <div
          className={`p-[30px]  3xl:px-[15px] 3xl:py-[22px] ${
            isDescription ? 'border-b border-b-[#CCCCCC]' : ''
          }`}
        >
          <h3 className="setting__FieldTitle">
            <span>
              <span className="skeletonBox w-[200px]" />
            </span>
          </h3>
          <div className="flex flex-wrap mx-[-10px]">
            {Array(addressCount)
              .fill('address')
              .map((_val) => {
                return (
                  <div
                    className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full"
                    key={window.self.crypto.randomUUID()}
                  >
                    <p className="ipInfo__View__Label sm:!w-[160px] sm:!mb-[7px]">
                      <span className="skeletonBox w-full" />
                    </p>
                    <p className="ipInfo__View__Value">
                      <span className="skeletonBox max-w-full" />
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        ''
      )}
      {isDescription ? (
        <div className="p-[30px] 3xl:px-[15px] 3xl:py-[22px]">
          <h3 className="setting__FieldTitle">
            <span>
              <span className="skeletonBox w-[200px]" />
            </span>
          </h3>
          <div className="flex flex-wrap mx-[-10px]">
            <div className="ipInfo__ViewBox w-full">
              <p className="ipInfo__View__Label sm:!w-[160px] sm:!mb-[7px]">
                <span className="skeletonBox w-full" />
              </p>
              <p className="ipInfo__View__Value">
                <span className="skeletonBox max-w-full" />
              </p>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default InformationSkeleton;
