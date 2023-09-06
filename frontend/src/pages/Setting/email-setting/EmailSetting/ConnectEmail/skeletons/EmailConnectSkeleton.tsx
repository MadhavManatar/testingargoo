import Icon from "components/Icon";

const EmailConnectSkeleton = () => {
  return (
    <>
      <div className="mb-[25px] flex justify-end 3xl:mb-[15px] sm:mb-[20px] sm:items-center sm:justify-between">
        <div className="skeletonBox w-[150px] max-w-full h-[40px] rounded-[6px] lg:h-[34px]" />
      </div>
      <div className="ip__hideScrollbar sm:h-[calc(100dvh_-_176px)] sm:overflow-y-auto">
        <div className="connectedEmail__box mb-[25px] 3xl:p-[14px] sm:p-0 sm:border sm:border-[#CCCCCC]/50 rounded-[12px] sm:mb-[15px]">
          <div className="inner__box">
            <div className="header flex flex-wrap items-center pb-[20px] border-b border-b-whiteScreen__BorderColor sm:pb-[13px]">
              <div className="left w-[calc(100%_-_190px)] pr-[12px] flex flex-wrap items-center sm:w-[calc(100%_-_32px)] sm:mb-0 sm:pr-[10px] null">
                <div className="skeletonBox w-[32px] h-[32px] rounded-[6px] mr-[15px]" />
                <div className="w-[calc(100%_-_48px)] text-[18px] leading-[22px] font-biotif__Medium text-mediumDark__TextColor break-words whitespace-pre overflow-hidden text-ellipsis 3xl:text-[16px] lg:w-[calc(100%_-_48px)]">
                  <div className="skeletonBox w-[200px] max-w-full" />
                </div>
              </div>
              <div className="right inline-flex items-center sm:w-full sm:justify-end sm:hidden">
                <div className="delete__btn grayscale opacity-40 pointer-events-none">
                  <Icon iconType="deleteFilled" />
                </div>
                <div className="skeletonBox w-[135px] max-w-full h-[40px] rounded-[6px] ml-[10px] lg:h-[34px]" />
              </div>
            </div>
            <div className="connectedEmail__body pt-[20px]">
              <div className="inner__header flex items-center justify-between mb-[20px]">
                <div className="skeletonBox w-[100px] mr-[10px]" />
                <div className="skeletonBox w-[120px]" />
              </div>
              <div className="details__box__wrapper flex flex-wrap mx-[-10px]">
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full lg:hidden">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full 3xl:hidden">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="connectedEmail__box mb-[25px] 3xl:p-[14px] sm:p-0 sm:border sm:border-[#CCCCCC]/50 rounded-[12px] sm:mb-[15px]">
          <div className="inner__box">
            <div className="header flex flex-wrap items-center pb-[20px] border-b border-b-whiteScreen__BorderColor sm:pb-[13px]">
              <div className="left w-[calc(100%_-_190px)] pr-[12px] flex flex-wrap items-center sm:w-[calc(100%_-_32px)] sm:mb-0 sm:pr-[10px] null">
                <div className="skeletonBox w-[32px] h-[32px] rounded-[6px] mr-[15px]" />
                <div className="w-[calc(100%_-_48px)] text-[18px] leading-[22px] font-biotif__Medium text-mediumDark__TextColor break-words whitespace-pre overflow-hidden text-ellipsis 3xl:text-[16px] lg:w-[calc(100%_-_48px)]">
                  <div className="skeletonBox w-[200px] max-w-full" />
                </div>
              </div>
              <div className="right inline-flex items-center sm:w-full sm:justify-end sm:hidden">
                <div className="delete__btn grayscale opacity-40 pointer-events-none">
                  <Icon iconType="deleteFilled" />
                </div>
                <div className="skeletonBox w-[135px] max-w-full h-[40px] rounded-[6px] ml-[10px] lg:h-[34px]" />
              </div>
            </div>
            <div className="connectedEmail__body pt-[20px]">
              <div className="inner__header flex items-center justify-between mb-[20px]">
                <div className="skeletonBox w-[100px] mr-[10px]" />
                <div className="skeletonBox w-[120px]" />
              </div>
              <div className="details__box__wrapper flex flex-wrap mx-[-10px]">
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full lg:hidden">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full 3xl:hidden">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="connectedEmail__box mb-[25px] 3xl:p-[14px] sm:p-0 sm:border sm:border-[#CCCCCC]/50 rounded-[12px] sm:mb-[15px]">
          <div className="inner__box">
            <div className="header flex flex-wrap items-center pb-[20px] border-b border-b-whiteScreen__BorderColor sm:pb-[13px]">
              <div className="left w-[calc(100%_-_190px)] pr-[12px] flex flex-wrap items-center sm:w-[calc(100%_-_32px)] sm:mb-0 sm:pr-[10px] null">
                <div className="skeletonBox w-[32px] h-[32px] rounded-[6px] mr-[15px]" />
                <div className="w-[calc(100%_-_48px)] text-[18px] leading-[22px] font-biotif__Medium text-mediumDark__TextColor break-words whitespace-pre overflow-hidden text-ellipsis 3xl:text-[16px] lg:w-[calc(100%_-_48px)]">
                  <div className="skeletonBox w-[200px] max-w-full" />
                </div>
              </div>
              <div className="right inline-flex items-center sm:w-full sm:justify-end sm:hidden">
                <div className="delete__btn grayscale opacity-40 pointer-events-none">
                  <Icon iconType="deleteFilled" />
                </div>
                <div className="skeletonBox w-[135px] max-w-full h-[40px] rounded-[6px] ml-[10px] lg:h-[34px]" />
              </div>
            </div>
            <div className="connectedEmail__body pt-[20px]">
              <div className="inner__header flex items-center justify-between mb-[20px]">
                <div className="skeletonBox w-[100px] mr-[10px]" />
                <div className="skeletonBox w-[120px]" />
              </div>
              <div className="details__box__wrapper flex flex-wrap mx-[-10px]">
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full lg:hidden">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full 3xl:hidden">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="connectedEmail__box mb-[25px] 3xl:p-[14px] sm:p-0 sm:border sm:border-[#CCCCCC]/50 rounded-[12px] sm:mb-[15px]">
          <div className="inner__box">
            <div className="header flex flex-wrap items-center pb-[20px] border-b border-b-whiteScreen__BorderColor sm:pb-[13px]">
              <div className="left w-[calc(100%_-_190px)] pr-[12px] flex flex-wrap items-center sm:w-[calc(100%_-_32px)] sm:mb-0 sm:pr-[10px] null">
                <div className="skeletonBox w-[32px] h-[32px] rounded-[6px] mr-[15px]" />
                <div className="w-[calc(100%_-_48px)] text-[18px] leading-[22px] font-biotif__Medium text-mediumDark__TextColor break-words whitespace-pre overflow-hidden text-ellipsis 3xl:text-[16px] lg:w-[calc(100%_-_48px)]">
                  <div className="skeletonBox w-[200px] max-w-full" />
                </div>
              </div>
              <div className="right inline-flex items-center sm:w-full sm:justify-end sm:hidden">
                <div className="delete__btn grayscale opacity-40 pointer-events-none">
                  <Icon iconType="deleteFilled" />
                </div>
                <div className="skeletonBox w-[135px] max-w-full h-[40px] rounded-[6px] ml-[10px] lg:h-[34px]" />
              </div>
            </div>
            <div className="connectedEmail__body pt-[20px]">
              <div className="inner__header flex items-center justify-between mb-[20px]">
                <div className="skeletonBox w-[100px] mr-[10px]" />
                <div className="skeletonBox w-[120px]" />
              </div>
              <div className="details__box__wrapper flex flex-wrap mx-[-10px]">
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full lg:hidden">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="details__box w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 lg:w-1/2 xsm:w-full 3xl:hidden">
                  <div className="details__box__inner">
                    <div className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                      <div className="skeletonBox w-[80%] max-w-full" />
                    </div>
                    <div className="text-[14px] font-biotif__Medium text-light__TextColor mb-[14px]">
                      <div className="skeletonBox w-full max-w-full" />
                    </div>
                    <div className="status flex flex-wrap items-center">
                      <div className="skeletonBox w-[80px] max-w-[calc(100%_-_30px)] mr-[8px]" />
                      <div className="skeletonBox w-[18px] h-[18px] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailConnectSkeleton;
