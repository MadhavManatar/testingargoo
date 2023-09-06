const DealDetailSkeleton = () => {
  return (
    <div className="detailsPageNew sm:!pb-0">
      <div className="detailsPage__action__breadcrumbs flex flex-wrap content-start justify-between sm:hidden">
        <div className="breadcrumbs__wrapper relative">
          <div className="breadcrumbs !mt-[9px] mb-[20px] md:mb-[10px] whitespace-pre overflow-x-auto">
            <div className="skeletonBox w-[70px] mr-[10px] mb-[4px] md:w-[60px]" />
            <div className="skeletonBox w-[70px] mr-[10px] mb-[4px] md:w-[60px]" />
            <div className="skeletonBox w-[70px] mb-[4px] md:w-[60px]" />
          </div>
        </div>
        <div className="action__bar inline-flex items-start md:justify-end sm:hidden">
          <div className="skeletonBox w-[32px] h-[32px] rounded-[6px] mb-[10px] mr-[10px]" />
          <div className="skeletonBox w-[75px] h-[32px] rounded-[6px] mb-[10px] mr-[10px] md:w-[80px]" />
          <div className="skeletonBox w-[130px] h-[32px] rounded-[6px] mb-[10px] mr-[10px] md:w-[80px]" />
          <div className="skeletonBox w-[120px] h-[32px] rounded-[6px] mb-[10px] md:w-[80px]" />
        </div>
      </div>
      {/* mobile header */}
      <div className="details__page__topHeader__M contact__details__page__topHeader__M border-b border-b-[#CCCCCC]/50 pb-[8px] mb-[17px] hidden sm:block">
        <div className="flex items-center mb-[20px]">
          <div className="details__mobile__act__type flex flex-wrap items-center w-[calc(100%_-_180px)] pr-[10px]">
            <div className="skeletonBox w-[42px] h-[42px] rounded-[6px] mr-[8px] xsm:w-[32px] xsm:h-[32px]" />
            <div className="skeletonBox w-[calc(100%_-_51px)] rounded-[6px] xsm:w-[calc(100%_-_41px)]" />
          </div>
          <div className="action__btns__mobile inline-flex items-center">
            <div className="skeletonBox w-[32px] h-[32px] rounded-[6px]" />
            <div className="skeletonBox w-[98px] h-[32px] rounded-[6px] ml-[10px]" />
            <div className="skeletonBox w-[32px] h-[32px] rounded-[6px] ml-[10px]" />
          </div>
        </div>
        <div>
          <div className="skeletonBox w-[300px] max-w-full rounded-[6px] mb-[18px]" />
          <div className="skeletonBox w-[220px] max-w-full rounded-[6px] mb-[8px]" />
          <div className="skeletonBox w-[150px] max-w-full rounded-[6px] mb-[18px]" />
          <div className="skeletonBox w-[220px] max-w-full rounded-[6px] mb-[8px]" />
          <div className="skeletonBox w-[150px] max-w-full rounded-[6px] mb-0" />
        </div>
        <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center mt-[20px] mb-[5px]">
          <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-[8px] mb-[8px]" />
          <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-[8px] mb-[8px]" />
          <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-[8px] mb-[8px]" />
          <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-[8px] mb-[8px]" />
          <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-[8px] mb-[8px]" />
          <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-[0px] mb-[8px]" />
        </div>
      </div>
      {/* mobile header end */}
      <div className="activityInner__topHeader__box flex flex-wrap border border-whiteScreen__BorderColor rounded-[12px] p-[20px] pb-[10px] mb-[20px] sm:hidden">
        <div className='activityType flex flex-wrap content-center justify-center pr-[20px] w-[92px] relative before:content-[""] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[calc(100%_-_26px)] before:bg-whiteScreen__BorderColor'>
          <div className="skeletonBox w-[60px] h-[60px] rounded-[10px]" />
          <div className="skeletonBox w-full mt-[12px]" />
        </div>
        <div className="right w-[calc(100%_-_93px)] pl-[20px] flex flex-wrap justify-between">
          <div className="main__details w-full">
            <div className="skeletonBox w-[600px] max-w-full mb-[20px]" />
            <div className="skeletonBox w-[450px] max-w-full mb-[10px] lg:w-[70%]" />
            <div className="skeletonBox w-[300px] max-w-full mb-[20px] lg:w-[50%]" />
            <div className="skeletonBox w-[450px] max-w-full mb-[10px] lg:w-[70%]" />
            <div className="skeletonBox w-[300px] max-w-full lg:w-[50%]" />
          </div>
        </div>
        <div className="activity__topHeader__footer mt-[24px] pt-[20px] border-t border-whiteScreen__BorderColor w-full flex flex-wrap items-center justify-between">
          <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center">
            <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-[20px] mb-[10px] lg:mr-[10px]" />
            <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-[20px] mb-[10px] lg:mr-[10px]" />
            <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-[20px] mb-[10px] lg:mr-[10px]" />
            <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-[20px] mb-[10px] lg:mr-[10px]" />
            <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-[20px] mb-[10px] lg:mr-[0px]" />
            <div className="skeletonBox w-[36px] h-[36px] rounded-[6px] mr-0 mb-[10px] lg:hidden" />
          </div>
          <div className="inline-flex flex-wrap">
            <div className="skeletonBox w-[100px] mr-[10px] mb-[10px] lg:w-[60px]" />
            <div className="skeletonBox w-[100px] mr-[10px] mb-[10px] lg:w-[60px]" />
            <div className="skeletonBox w-[100px] lg:w-[60px]" />
          </div>
        </div>
      </div>
      <div className="ip__nextStep flex flex-wrap mb-[20px] w-[calc(100%_+_30px)] 3xl:w-[calc(100%_+_26px)] sm:mb-[10px]">
        <div className='left pr-[15px] mr-[15px] flex items-center relative before:content-[""] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[50%] before:w-[1px] before:bg-[#CCCCCC]/50 3xl:w-full 3xl:pr-0 3xl:mr-0 3xl:before:hidden 3xl:hidden'>
          <div className="skeletonBox w-[98px]" />
        </div>
        <div className="right w-[calc(100%_-_134px)] pt-[10px] overflow-x-auto ip__hideScrollbar 3xl:w-full">
          <div className="inline-block whitespace-pre">
            <div className="ip__nextStep__box inline-block w-[380px] mb-[10px] mr-[10px] last:mr-[27px] sm:w-[284px] xsm:w-[270px]">
              <div className="inner__wrapper flex flex-wrap relative !bg-ipGray__transparentBG">
                <div className="skeletonBox w-[24px] h-[24px] rounded-[6px] absolute top-[10px] right-[8px]" />
                <div className='ip__nextStep__actype flex flex-wrap content-center justify-center w-[70px] pr-[10px] relative before:content-[""] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-full before:bg-[#CCCCCC]/50 sm:w-[50px]'>
                  <div className="skeletonBox w-[32px] h-[32px] rounded-[6px]" />
                  <div className="skeletonBox w-full rounded-[6px] mt-[12px]" />
                </div>
                <div className="right__details w-[calc(100%_-_70px)] pl-[10px] pr-[28px] sm:w-[calc(100%_-_50px)]">
                  <div className="skeletonBox w-full rounded-[6px] mb-[12px]" />
                  <div className="skeletonBox w-[130px] rounded-[6px] mb-[12px]" />
                  <div className="flex flex-wrap">
                    <div className="skeletonBox w-[80px] max-w-[calc(50%_-_5px)] rounded-[6px] mr-[5px]" />
                    <div className="skeletonBox w-[80px] max-w-[calc(50%_-_5px)] rounded-[6px] ml-[5px]" />
                  </div>
                  <div className="flex flex-wrap items-center mt-[15px]">
                    <div className="skeletonBox w-[16px] h-[16px] rounded-full" />
                    <div className="skeletonBox w-[180px] max-w-[calc(100%_-_27px)] ml-[10px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="ip__nextStep__box inline-block w-[380px] mb-[10px] mr-[10px] last:mr-[27px] sm:w-[284px] xsm:w-[270px]">
              <div className="inner__wrapper flex flex-wrap relative !bg-ipGray__transparentBG">
                <div className="skeletonBox w-[24px] h-[24px] rounded-[6px] absolute top-[10px] right-[8px]" />
                <div className='ip__nextStep__actype flex flex-wrap content-center justify-center w-[70px] pr-[10px] relative before:content-[""] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-full before:bg-[#CCCCCC]/50 sm:w-[50px]'>
                  <div className="skeletonBox w-[32px] h-[32px] rounded-[6px]" />
                  <div className="skeletonBox w-full rounded-[6px] mt-[12px]" />
                </div>
                <div className="right__details w-[calc(100%_-_70px)] pl-[10px] pr-[28px] sm:w-[calc(100%_-_50px)]">
                  <div className="skeletonBox w-full rounded-[6px] mb-[12px]" />
                  <div className="skeletonBox w-[130px] rounded-[6px] mb-[12px]" />
                  <div className="flex flex-wrap">
                    <div className="skeletonBox w-[80px] max-w-[calc(50%_-_5px)] rounded-[6px] mr-[5px]" />
                    <div className="skeletonBox w-[80px] max-w-[calc(50%_-_5px)] rounded-[6px] ml-[5px]" />
                  </div>
                  <div className="flex flex-wrap items-center mt-[15px]">
                    <div className="skeletonBox w-[16px] h-[16px] rounded-full" />
                    <div className="skeletonBox w-[180px] max-w-[calc(100%_-_27px)] ml-[10px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="ip__nextStep__box inline-block w-[380px] mb-[10px] mr-[10px] last:mr-[27px] sm:w-[284px] xsm:w-[270px]">
              <div className="inner__wrapper flex flex-wrap relative !bg-ipGray__transparentBG">
                <div className="skeletonBox w-[24px] h-[24px] rounded-[6px] absolute top-[10px] right-[8px]" />
                <div className='ip__nextStep__actype flex flex-wrap content-center justify-center w-[70px] pr-[10px] relative before:content-[""] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-full before:bg-[#CCCCCC]/50 sm:w-[50px]'>
                  <div className="skeletonBox w-[32px] h-[32px] rounded-[6px]" />
                  <div className="skeletonBox w-full rounded-[6px] mt-[12px]" />
                </div>
                <div className="right__details w-[calc(100%_-_70px)] pl-[10px] pr-[28px] sm:w-[calc(100%_-_50px)]">
                  <div className="skeletonBox w-full rounded-[6px] mb-[12px]" />
                  <div className="skeletonBox w-[130px] rounded-[6px] mb-[12px]" />
                  <div className="flex flex-wrap">
                    <div className="skeletonBox w-[80px] max-w-[calc(50%_-_5px)] rounded-[6px] mr-[5px]" />
                    <div className="skeletonBox w-[80px] max-w-[calc(50%_-_5px)] rounded-[6px] ml-[5px]" />
                  </div>
                  <div className="flex flex-wrap items-center mt-[15px]">
                    <div className="skeletonBox w-[16px] h-[16px] rounded-full" />
                    <div className="skeletonBox w-[180px] max-w-[calc(100%_-_27px)] ml-[10px]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="ip__nextStep__box inline-block w-[380px] mb-[10px] mr-[10px] last:mr-[27px] sm:w-[284px] xsm:w-[270px]">
              <div className="inner__wrapper flex flex-wrap relative !bg-ipGray__transparentBG">
                <div className="skeletonBox w-[24px] h-[24px] rounded-[6px] absolute top-[10px] right-[8px]" />
                <div className='ip__nextStep__actype flex flex-wrap content-center justify-center w-[70px] pr-[10px] relative before:content-[""] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-full before:bg-[#CCCCCC]/50 sm:w-[50px]'>
                  <div className="skeletonBox w-[32px] h-[32px] rounded-[6px]" />
                  <div className="skeletonBox w-full rounded-[6px] mt-[12px]" />
                </div>
                <div className="right__details w-[calc(100%_-_70px)] pl-[10px] pr-[28px] sm:w-[calc(100%_-_50px)]">
                  <div className="skeletonBox w-full rounded-[6px] mb-[12px]" />
                  <div className="skeletonBox w-[130px] rounded-[6px] mb-[12px]" />
                  <div className="flex flex-wrap">
                    <div className="skeletonBox w-[80px] max-w-[calc(50%_-_5px)] rounded-[6px] mr-[5px]" />
                    <div className="skeletonBox w-[80px] max-w-[calc(50%_-_5px)] rounded-[6px] ml-[5px]" />
                  </div>
                  <div className="flex flex-wrap items-center mt-[15px]">
                    <div className="skeletonBox w-[16px] h-[16px] rounded-full" />
                    <div className="skeletonBox w-[180px] max-w-[calc(100%_-_27px)] ml-[10px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-[30px]">
        <div className="flex flex-wrap p-[10px] px-[15px] items-center justify-between !bg-ipGray__transparentBG rounded-[10px] mb-[15px]">
          <div className="skeletonBox w-[200px] max-w-[calc(100%_-_32px)] sm:w-[150px]" />
          <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
        </div>
        <div className="border border-[#CCCCCC]/50 rounded-[12px]">
          <div className="p-[24px] pb-[5px] 3xl:px-[15px] 3xl:py-[15px] 3xl:pb-[9px] sm:pb-[16px]">
            <div className="flex flex-wrap mx-[-15px]">
              <div className="ipInfo__ViewBox items-center !mb-[22px] px-[15px] w-1/3 3xl:w-1/2 lg:w-full">
                <div className="ipInfo__View__Label pr-[10px] !mb-0 after:hidden sm:!w-[30%]">
                  <div className="skeletonBox w-full" />
                </div>
                <div className="ipInfo__View__Value whitespace-normal !pt-0 !pl-0 sm:!w-[calc(70%_-_8px)] sm:ml-[8px]">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="ipInfo__ViewBox items-center !mb-[22px] px-[15px] w-1/3 3xl:w-1/2 lg:w-full">
                <div className="ipInfo__View__Label pr-[10px] !mb-0 after:hidden sm:!w-[30%]">
                  <div className="skeletonBox w-full" />
                </div>
                <div className="ipInfo__View__Value whitespace-normal !pt-0 !pl-0 sm:!w-[calc(70%_-_8px)] sm:ml-[8px]">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="ipInfo__ViewBox items-center !mb-[22px] px-[15px] w-1/3 3xl:w-1/2 lg:w-full">
                <div className="ipInfo__View__Label pr-[10px] !mb-0 after:hidden sm:!w-[30%]">
                  <div className="skeletonBox w-full" />
                </div>
                <div className="ipInfo__View__Value whitespace-normal !pt-0 !pl-0 sm:!w-[calc(70%_-_8px)] sm:ml-[8px]">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="ipInfo__ViewBox items-center !mb-[22px] px-[15px] w-1/3 3xl:w-1/2 lg:w-full">
                <div className="ipInfo__View__Label pr-[10px] !mb-0 after:hidden sm:!w-[30%]">
                  <div className="skeletonBox w-full" />
                </div>
                <div className="ipInfo__View__Value whitespace-normal !pt-0 !pl-0 sm:!w-[calc(70%_-_8px)] sm:ml-[8px]">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="ipInfo__ViewBox items-center !mb-[22px] px-[15px] w-1/3 3xl:w-1/2 lg:w-full">
                <div className="ipInfo__View__Label pr-[10px] !mb-0 after:hidden sm:!w-[30%]">
                  <div className="skeletonBox w-full" />
                </div>
                <div className="ipInfo__View__Value whitespace-normal !pt-0 !pl-0 sm:!w-[calc(70%_-_8px)] sm:ml-[8px]">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="ipInfo__ViewBox items-center !mb-[22px] px-[15px] w-1/3 3xl:w-1/2 lg:w-full">
                <div className="ipInfo__View__Label pr-[10px] !mb-0 after:hidden sm:!w-[30%]">
                  <div className="skeletonBox w-full" />
                </div>
                <div className="ipInfo__View__Value whitespace-normal !pt-0 !pl-0 sm:!w-[calc(70%_-_8px)] sm:ml-[8px]">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="ipInfo__ViewBox items-center !mb-[22px] px-[15px] w-1/3 3xl:w-1/2 lg:w-full 3xl:!mb-[10px] lg:!mb-[22px]">
                <div className="ipInfo__View__Label pr-[10px] !mb-0 after:hidden sm:!w-[30%]">
                  <div className="skeletonBox w-full" />
                </div>
                <div className="ipInfo__View__Value whitespace-normal !pt-0 !pl-0 sm:!w-[calc(70%_-_8px)] sm:ml-[8px]">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="ipInfo__ViewBox items-center !mb-[22px] px-[15px] w-1/3 3xl:w-1/2 lg:w-full 3xl:!mb-[10px] lg:!mb-[3px]">
                <div className="ipInfo__View__Label pr-[10px] !mb-0 after:hidden sm:!w-[30%]">
                  <div className="skeletonBox w-full" />
                </div>
                <div className="ipInfo__View__Value whitespace-normal !pt-0 !pl-0 sm:!w-[calc(70%_-_8px)] sm:ml-[8px]">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
              <div className="ipInfo__ViewBox items-center !mb-[22px] px-[15px] w-1/3 3xl:w-1/2 lg:w-full 3xl:hidden">
                <div className="ipInfo__View__Label pr-[10px] !mb-0 after:hidden sm:!w-[30%]">
                  <div className="skeletonBox w-full" />
                </div>
                <div className="ipInfo__View__Value whitespace-normal !pt-0 !pl-0 sm:!w-[calc(70%_-_8px)] sm:ml-[8px]">
                  <div className="skeletonBox w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-[30px] sm:mb-[20px]">
        <div className="flex flex-wrap p-[10px] px-[15px] items-center justify-between !bg-ipGray__transparentBG rounded-[10px] mb-[15px]">
          <div className="skeletonBox w-[200px] max-w-[calc(100%_-_32px)] sm:w-[150px]" />
          <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
        </div>
        <div className="border border-[#CCCCCC]/50 rounded-[12px] p-[24px] pb-[4px] 3xl:p-[15px] 3xl:pb-0 sm:p-0 sm:border-0">
          <div className="flex flex-wrap mx-[-10px] 3xl:mx-[-7px]">
            <div className="related__contact__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
              </div>
            </div>
            <div className="related__contact__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
              </div>
            </div>
            <div className="related__contact__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
              </div>
            </div>
            <div className="related__contact__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
              </div>
            </div>
            <div className="related__contact__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
              </div>
            </div>
            <div className="related__contact__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
              </div>
            </div>
            <div className="related__contact__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0 3xl:hidden">
              <div className="inner__wrapper flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
              </div>
            </div>
            <div className="related__contact__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0 3xl:hidden">
              <div className="inner__wrapper flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:mb-0">
        <div className="flex flex-wrap p-[10px] px-[15px] items-center justify-between !bg-ipGray__transparentBG rounded-[10px] mb-[15px]">
          <div className="skeletonBox w-[200px] max-w-[calc(100%_-_32px)] sm:w-[150px]" />
          <div className="skeletonBox w-[30px] h-[30px] rounded-[6px]" />
        </div>
        <div className="border border-[#CCCCCC]/50 rounded-[12px] p-[24px] pb-[4px] 3xl:p-[15px] 3xl:pb-0 sm:p-0 sm:border-0">
          <div className="flex flex-wrap mx-[-10px] 3xl:mx-[-7px]">
            <div className="follower__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper relative flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-[calc(100%_-_70px)] mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
                <div className="skeletonBox w-[60px] h-[23px] max-w-full rounded-[6px] absolute top-[10px] right-[12px]" />
              </div>
            </div>
            <div className="follower__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper relative flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-[calc(100%_-_70px)] mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
                <div className="skeletonBox w-[60px] h-[23px] max-w-full rounded-[6px] absolute top-[10px] right-[12px]" />
              </div>
            </div>
            <div className="follower__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper relative flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-[calc(100%_-_70px)] mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
                <div className="skeletonBox w-[60px] h-[23px] max-w-full rounded-[6px] absolute top-[10px] right-[12px]" />
              </div>
            </div>
            <div className="follower__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper relative flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-[calc(100%_-_70px)] mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
                <div className="skeletonBox w-[60px] h-[23px] max-w-full rounded-[6px] absolute top-[10px] right-[12px]" />
              </div>
            </div>
            <div className="follower__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper relative flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-[calc(100%_-_70px)] mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
                <div className="skeletonBox w-[60px] h-[23px] max-w-full rounded-[6px] absolute top-[10px] right-[12px]" />
              </div>
            </div>
            <div className="follower__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0">
              <div className="inner__wrapper relative flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-[calc(100%_-_70px)] mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
                <div className="skeletonBox w-[60px] h-[23px] max-w-full rounded-[6px] absolute top-[10px] right-[12px]" />
              </div>
            </div>
            <div className="follower__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0 3xl:hidden">
              <div className="inner__wrapper relative flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-[calc(100%_-_70px)] mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
                <div className="skeletonBox w-[60px] h-[23px] max-w-full rounded-[6px] absolute top-[10px] right-[12px]" />
              </div>
            </div>
            <div className="follower__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0 3xl:hidden">
              <div className="inner__wrapper relative flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                <div className="skeletonBox w-[40px] h-[40px] rounded-full" />
                <div className="right__details w-[calc(100%_-_40px)] pl-[15px]">
                  <div className="skeletonBox w-[300px] max-w-[calc(100%_-_70px)] mb-[10px]" />
                  <div className="skeletonBox w-[100px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[200px] max-w-full mb-[10px]" />
                  <div className="skeletonBox w-[150px] max-w-full" />
                </div>
                <div className="skeletonBox w-[60px] h-[23px] max-w-full rounded-[6px] absolute top-[10px] right-[12px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetailSkeleton;
