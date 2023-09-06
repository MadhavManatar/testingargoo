// ** Import Packages **
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import StayInTouch from 'components/EntityDetails/StayInTouch';
import Icon from 'components/Icon';
import AuthGuard from 'pages/auth/components/AuthGuard';
import AddDealWonLostModal from '../AddDealWonLostModal';
import DetailHeaderEdit from 'components/detail-components/detail-header-edit';
import FollowUnFollow from 'pages/Dashboard/components/FollowUnFollow';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Constants  **
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';

// ** Types **
import { scheduleActivityResponse } from 'components/EntityDetails/StayInTouch/types/stay-in-touch.type';
import { DealDetailsType } from 'pages/Deal/types/deals.types';

// ** Util **
import { setUrlParams } from 'utils/util';

type DealDetailTopActionHeaderProps = {
  dealId: number;
  dealDetails: DealDetailsType;
  setReRenderOnStage: (arg: boolean) => void;
  isStayInTouchOpen: boolean;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleActivityData: scheduleActivityResponse;
  isScheduleActivityLoading: boolean;
  getScheduleActivity: (id: number) => Promise<void>;
};

const DealDetailTopActionHeader = (props: DealDetailTopActionHeaderProps) => {
  const {
    dealId,
    dealDetails,
    setReRenderOnStage,
    isStayInTouchOpen,
    setIsStayInTouchOpen,
    scheduleActivityData,
    isScheduleActivityLoading,
    getScheduleActivity,
  } = props;

  const { updateDealPermission } = usePermission();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<{
    open: boolean;
    stageType: string;
  }>({
    open: false,
    stageType: '',
  });
  const [convertLeadToggle, setConvertLeadToggle] = useState<boolean>(false);

  const openDealWonLostModal = (type: 'Won' | 'Lost') => {
    setIsOpen({ open: true, stageType: type });
  };
  const closeDealWonLostModal = () => {
    setIsOpen({ open: false, stageType: '' });
  };

  const displayWonLostButton = () => {
    if (dealDetails?.deal_stage?.stage_type === 'Win') {
      return (
        <Button
          isDisabled
          className="min-w-[80px] bg-[#27AE60] py-[4px] px-[17px] text-white text-[14px] font-biotif__Medium rounded-[10px] h-[32px] mb-[10px] hover:text-white hover:bg-ip__SuccessGreen__hoverDark lg:min-w-[70px]"
          onClick={() => openDealWonLostModal('Won')}
        >
          Won
        </Button>
      );
    }

    if (dealDetails?.deal_stage?.stage_type === 'Lost') {
      return (
        <Button
          isDisabled
          className="min-w-[80px] mr-[10px] bg-ip__Red py-[4px] px-[17px] text-white text-[14px] font-biotif__Medium rounded-[10px] h-[32px] mb-[10px] hover:text-white hover:bg-ip__Red__hoverDark lg:min-w-[70px]"
          type="button"
          onClick={() => openDealWonLostModal('Lost')}
        >
          Lost
        </Button>
      );
    }

    return (
      <>
        <Button
          className="min-w-[80px] mr-[10px] bg-ip__Red py-[4px] px-[17px] text-white text-[14px] font-biotif__Medium rounded-[10px] h-[32px] mb-[10px] hover:text-white hover:bg-ip__Red__hoverDark lg:min-w-[70px]"
          type="button"
          onClick={() => openDealWonLostModal('Lost')}
        >
          Lost
        </Button>
        <Button
          className="min-w-[80px] bg-ip__SuccessGreen py-[4px] px-[17px] text-white text-[14px] font-biotif__Medium rounded-[10px] h-[32px] mb-[10px] hover:text-white hover:bg-ip__SuccessGreen__hoverDark lg:min-w-[70px]"
          onClick={() => openDealWonLostModal('Won')}
        >
          Won
        </Button>
      </>
    );
  };

  return (
    <>
      <div className="detailsPage__action__breadcrumbs flex flex-wrap content-start justify-between">
        <Breadcrumbs path={BREAD_CRUMB.dealDetails} />
        <div className="action__bar inline-flex items-start lg:w-full lg:justify-end sm:hidden">
          <AuthGuard isAccessible={updateDealPermission}>
            <>
              <div className="edit__lead__btn">
                <DetailHeaderEdit
                  onclick={() =>
                    navigate(
                      setUrlParams(PRIVATE_NAVIGATION.deals.edit, dealId)
                    )
                  }
                />
              </div>
              <FollowUnFollow
                entityData={dealDetails}
                entityId={dealId}
                moduleName={ModuleNames.DEAL}
              />
              <StayInTouch
                model_record_id={dealId}
                model_name={POLYMORPHIC_MODELS.DEAL}
                isStayInTouchOpen={isStayInTouchOpen}
                setIsStayInTouchOpen={setIsStayInTouchOpen}
                scheduleActivityData={scheduleActivityData}
                isScheduleActivityLoading={isScheduleActivityLoading}
                getScheduleActivity={getScheduleActivity}
              />
              {displayWonLostButton()}
              <div className="toggle__wrapper relative ml-[5px]">
                <button
                  className="toggleBtn h-[32px]"
                  type="button"
                  onClick={() => setConvertLeadToggle((prev) => !prev)}
                >
                  <Icon
                    className="toggle__btn relative cursor-pointer w-[28px] h-[28px] duration-500 hover:bg-parentBgWhite__grayBtnBG rounded-[6px] p-[7px]"
                    iconType="toggle3dotsIcon"
                  />
                </button>
                <div
                  className={`add__dropdown__menu  ${
                    convertLeadToggle ? '' : 'hidden'
                  }  absolute top-[calc(100%_-_4px)] right-[0px] pt-[20px] z-[4]`}
                >
                  <div className="inner__wrapper bg-ipWhite__bgColor min-w-[150px] relative rounded-[10px]">
                    <div>
                      <div
                        key={window.self.crypto.randomUUID()}
                        className="item"
                        onClick={() => {
                          navigate(
                            setUrlParams(
                              PRIVATE_NAVIGATION.deals.convert,
                              dealId
                            )
                          );
                        }}
                      >
                        <div className="flex items-center relative z-[2] cursor-pointer">
                          <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                            Convert To Lead
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          </AuthGuard>
        </div>
      </div>
      {isOpen.open && (
        <AddDealWonLostModal
          closeModal={closeDealWonLostModal}
          dealWonLostData={{
            entityData: {
              id: dealId,
              name: dealDetails.name || '',
              type: ModuleNames.DEAL,
            },
            stageType: isOpen.stageType,
          }}
          isOpen={isOpen.open}
          onAdd={() => setReRenderOnStage(true)}
        />
      )}
    </>
  );
};

export default DealDetailTopActionHeader;
