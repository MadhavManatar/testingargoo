const DashboardChartsSkeleton = () => {
  return (
    <div className="mx-[-20px] flex flex-wrap">
      <div className="deal__revenue__forecast w-[calc(50%_-_136px)] max-w-full px-[20px] 4xl:w-[calc(100%_-_290px)] xl:w-full">
        <div className="inner__wrapper h-full bg-[#F8F8F8] rounded-[12px] p-[20px] pb-[35px]">
          <div className="header flex flex-wrap items-start mb-[30px] sm:mb-[15px]">
            <div className="text-[20px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_50px)] pr-[10px] sm:text-[18px]">
              <div className="skeletonBox w-[200px] max-w-full" />
            </div>
            <div className="text-[14px] w-[50px] font-biotif__Regular underline duration-500 hover:text-primaryColor relative top-[0px]">
              <div className="skeletonBox w-full" />
            </div>
          </div>
          <div className="mx-[-10px] flex flex-wrap items-center">
            <div className="flex items-center px-[10px] w-[215px] h-[215px] xl:w-[180px] xl:h-[180px] sm:w-[250px] sm:h-[250px] sm:mx-auto sm:mb-[15px]">
              <div className="w-full pt-[100%] relative">
                <div className="absolute top-0 left-0 h-full w-full rounded-full border-[25px] border-skeleton__BoxBG border-l-[#d2d2d2] border-b-[#bfbfbf]" />
              </div>
            </div>
            <div className="px-[10px] w-[calc(100%_-_215px)] companyGoals__wrapper xl:w-[calc(100%_-_180px)] sm:w-full">
              <div className="text-ipBlack__textColor text-[16px] font-biotif__Medium mb-[28px]">
                <div className="skeletonBox w-[200px] max-w-full" />
              </div>
              <div className="mb-[30px] companyGoals__box">
                <div className="flex justify-between items-center mb-[12px]">
                  <div className="skeletonBox w-[200px] max-w-[calc(75%_-_12px)]" />
                  <div className="skeletonBox w-[80px] max-w-[calc(100%_-_15px)] ml-[12px]" />
                </div>
                <div className="progressBar__wrapper w-full h-[11px] rounded-[50px] bg-skeleton__BoxBG">
                  <div className="valueBar h-full rounded-[50px] bg-[#bfbfbf] w-[60%]" />
                </div>
              </div>
              <div className="mb-[30px] companyGoals__box">
                <div className="flex justify-between items-center mb-[12px]">
                  <div className="skeletonBox w-[200px] max-w-[calc(75%_-_12px)]" />
                  <div className="skeletonBox w-[80px] max-w-[calc(100%_-_15px)] ml-[12px]" />
                </div>
                <div className="progressBar__wrapper w-full h-[11px] rounded-[50px] bg-skeleton__BoxBG">
                  <div className="valueBar h-full rounded-[50px] bg-[#bfbfbf] w-[50%]" />
                </div>
              </div>
              <div className="companyGoals__box">
                <div className="flex justify-between items-center mb-[12px]">
                  <div className="skeletonBox w-[200px] max-w-[calc(75%_-_12px)]" />
                  <div className="skeletonBox w-[80px] max-w-[calc(100%_-_15px)] ml-[12px]" />
                </div>
                <div className="progressBar__wrapper w-full h-[11px] rounded-[50px] bg-skeleton__BoxBG">
                  <div className="valueBar h-full rounded-[50px] bg-[#bfbfbf] w-[70%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="activities__revenue w-[270px] xl:w-full xl:px-[20px] xl:mt-[20px]">
        <div className="inner__wrapper flex flex-wrap content-between h-full bg-[#F8F8F8] rounded-[12px] p-[20px] pb-[20px]">
          <div className="flex items-center justify-between w-full">
            <div className="w-[calc(100%_-_50px)] pr-[12px]">
              <div className="skeletonBox w-[150px] max-w-full" />
            </div>
            <div className="skeletonBox w-[50px]" />
          </div>
          <div className="w-full px-[25px] py-[22px]">
            <div className="w-full mx-auto xl:w-[215px] xl:max-w-full">
              <div className="w-full pt-[100%] relative">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-[25px] border-skeleton__BoxBG border-r-[#bfbfbf]" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between w-full">
            <div className="flex items-center w-auto max-w-[calc(50%_-_6px)]">
              <div className="skeletonBox w-[20px] h-[20px] rounded-[6px]" />
              <div className="skeletonBox w-[60px] max-w-[calc(100%_-_26px)] ml-[6px]" />
            </div>
            <div className="flex items-center w-auto max-w-[calc(50%_-_6px)]">
              <div className="skeletonBox w-[20px] h-[20px] rounded-[6px]" />
              <div className="skeletonBox w-[60px] max-w-[calc(100%_-_26px)] ml-[6px]" />
            </div>
          </div>
        </div>
      </div>
      <div className="recent__email__dash w-[calc(50%_-_136px)] max-w-full px-[20px] 4xl:w-full 4xl:mt-[20px]">
        <div className="inner__wrapper h-full bg-[#F8F8F8] rounded-[12px] p-[20px] pb-[20px]">
          <div className="header flex flex-wrap items-center justify-between">
            <div className="text-[20px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_160px)] pr-[10px]">
              <div className="skeletonBox w-[130px] max-w-full" />
            </div>
            <div className="inline-flex items-center">
              <div className="skeletonBox w-[45px]" />
              <div className="skeletonBox w-[100px] h-[36px] rounded-[6px] ml-[10px]" />
            </div>
          </div>
          <div className="recent__email__table">
            <div className="recent__email__row flex items-center border-b border-b-black/10 py-[12px] flex-wrap sm:items-start sm:relative">
              <div className="recent__email__cell email__provide__img px-[8px] w-[32px] flex items-center sm:absolute sm:top-[52px] sm:left-[7px] sm:px-0 sm:w-[16px]">
                <div className="skeletonBox w-full h-[15px] rounded-[6px]" />
              </div>
              <div className="recent__email__cell profile__picture px-[8px] w-[46px] sm:px-0 sm:w-[30px] sm:absolute sm:top-[12px] sm:left-0">
                <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
              </div>
              <div className="recent__email__cell name px-[8px] w-[calc(50%_-_90px)] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mb-[8px]">
                <div className="text-[16px] font-biotif__Regular text-ipBlack__textColor whitespace-pre overflow-hidden text-ellipsis">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="recent__email__cell flex items-center text px-[8px] w-[calc(50%_-_90px)] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mb-[8px]">
                <div className="skeletonBox w-full" />
              </div>
              <div className="recent__email__cell time px-[8px] w-[100px] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mt-[2px]">
                <div className="text-[16px] font-biotif__Regular text-black/50 text-right sm:text-left sm:text-[14px]">
                  <div className="skeletonBox w-full sm:w-[62px] sm:max-w-full" />
                </div>
              </div>
            </div>
            <div className="recent__email__row flex items-center border-b border-b-black/10 py-[12px] flex-wrap sm:items-start sm:relative">
              <div className="recent__email__cell email__provide__img px-[8px] w-[32px] flex items-center sm:absolute sm:top-[52px] sm:left-[7px] sm:px-0 sm:w-[16px]">
                <div className="skeletonBox w-full h-[15px] rounded-[6px]" />
              </div>
              <div className="recent__email__cell profile__picture px-[8px] w-[46px] sm:px-0 sm:w-[30px] sm:absolute sm:top-[12px] sm:left-0">
                <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
              </div>
              <div className="recent__email__cell name px-[8px] w-[calc(50%_-_90px)] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mb-[8px]">
                <div className="text-[16px] font-biotif__Regular text-ipBlack__textColor whitespace-pre overflow-hidden text-ellipsis">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="recent__email__cell flex items-center text px-[8px] w-[calc(50%_-_90px)] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mb-[8px]">
                <div className="skeletonBox w-full" />
              </div>
              <div className="recent__email__cell time px-[8px] w-[100px] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mt-[2px]">
                <div className="text-[16px] font-biotif__Regular text-black/50 text-right sm:text-left sm:text-[14px]">
                  <div className="skeletonBox w-full sm:w-[62px] sm:max-w-full" />
                </div>
              </div>
            </div>
            <div className="recent__email__row flex items-center border-b border-b-black/10 py-[12px] flex-wrap sm:items-start sm:relative">
              <div className="recent__email__cell email__provide__img px-[8px] w-[32px] flex items-center sm:absolute sm:top-[52px] sm:left-[7px] sm:px-0 sm:w-[16px]">
                <div className="skeletonBox w-full h-[15px] rounded-[6px]" />
              </div>
              <div className="recent__email__cell profile__picture px-[8px] w-[46px] sm:px-0 sm:w-[30px] sm:absolute sm:top-[12px] sm:left-0">
                <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
              </div>
              <div className="recent__email__cell name px-[8px] w-[calc(50%_-_90px)] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mb-[8px]">
                <div className="text-[16px] font-biotif__Regular text-ipBlack__textColor whitespace-pre overflow-hidden text-ellipsis">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="recent__email__cell flex items-center text px-[8px] w-[calc(50%_-_90px)] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mb-[8px]">
                <div className="skeletonBox w-full" />
              </div>
              <div className="recent__email__cell time px-[8px] w-[100px] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mt-[2px]">
                <div className="text-[16px] font-biotif__Regular text-black/50 text-right sm:text-left sm:text-[14px]">
                  <div className="skeletonBox w-full sm:w-[62px] sm:max-w-full" />
                </div>
              </div>
            </div>
            <div className="recent__email__row flex items-center border-b border-b-black/10 py-[12px] flex-wrap sm:items-start sm:relative">
              <div className="recent__email__cell email__provide__img px-[8px] w-[32px] flex items-center sm:absolute sm:top-[52px] sm:left-[7px] sm:px-0 sm:w-[16px]">
                <div className="skeletonBox w-full h-[15px] rounded-[6px]" />
              </div>
              <div className="recent__email__cell profile__picture px-[8px] w-[46px] sm:px-0 sm:w-[30px] sm:absolute sm:top-[12px] sm:left-0">
                <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
              </div>
              <div className="recent__email__cell name px-[8px] w-[calc(50%_-_90px)] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mb-[8px]">
                <div className="text-[16px] font-biotif__Regular text-ipBlack__textColor whitespace-pre overflow-hidden text-ellipsis">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="recent__email__cell flex items-center text px-[8px] w-[calc(50%_-_90px)] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mb-[8px]">
                <div className="skeletonBox w-full" />
              </div>
              <div className="recent__email__cell time px-[8px] w-[100px] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mt-[2px]">
                <div className="text-[16px] font-biotif__Regular text-black/50 text-right sm:text-left sm:text-[14px]">
                  <div className="skeletonBox w-full sm:w-[62px] sm:max-w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChartsSkeleton;
