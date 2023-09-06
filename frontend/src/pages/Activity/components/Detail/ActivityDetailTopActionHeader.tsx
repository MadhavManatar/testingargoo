// ** Components ** //
import Button from 'components/Button';
import AuthGuard from 'pages/auth/components/AuthGuard';
import { ScheduleFollowUp } from './ScheduleFollowUp';

// ** Types ** //
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import {
  activityLogResponse,
  ActivityResponseType,
  ModalTypeProps,
} from 'pages/Activity/types/activity.types';
import FollowUnFollow from 'pages/Dashboard/components/FollowUnFollow';
import DetailHeaderEdit from 'components/detail-components/detail-header-edit';
import { Dispatch, SetStateAction } from 'react';

type ActivityDetailTopActionHeaderPropsType = {
  changeSetOpenModal: (val: ModalTypeProps) => void;
  isUpdateActivityStatusLoading: boolean;
  changeActivityCompleteStatus: () => void;
  activityCompleteStatus: boolean;
  isGetActivityDetailLoading: boolean;
  isChangeActivityStatusLoading: boolean;
  activityId: number;
  activityDetail: ActivityResponseType;
  activityRunningStatus: {
    status: boolean;
    log: activityLogResponse;
  };
  startOrStopActivity: (is_active: boolean) => Promise<void>;
  activityTypeName: string;
  closeModalForDashboard?: () => void;
  closeViewModal?: (activityDetail?: ActivityResponseType) => void;
  onEdit: ((data: any) => void) | undefined;
  openModald: {
    scheduleFollowUp: boolean;
    followUpDate?: Date | undefined;
  };
  setOpenModald: Dispatch<
    SetStateAction<{
      scheduleFollowUp: boolean;
      followUpDate?: Date | undefined;
    }>
  >;
};

const ActivityDetailTopActionHeader = (
  props: ActivityDetailTopActionHeaderPropsType
) => {
  const {
    activityCompleteStatus,
    changeActivityCompleteStatus,
    changeSetOpenModal,
    isUpdateActivityStatusLoading,
    isGetActivityDetailLoading,
    isChangeActivityStatusLoading,
    activityId,
    activityDetail,
    activityRunningStatus,
    startOrStopActivity,
    activityTypeName,
    closeModalForDashboard,
    closeViewModal,
    onEdit,
    openModald,
    setOpenModald,
  } = props;
  return (
    <div className="action__bar inline-flex flex-wrap items-start xl:w-full xl:justify-end xl:mt-[8px] sm:hidden">
      <AuthGuard
        permissions={[
          {
            module: ModuleNames.ACTIVITY,
            type: BasicPermissionTypes.UPDATE,
          },
        ]}
      >
        <div className="edit__lead__btn">
          <DetailHeaderEdit onclick={() => changeSetOpenModal('edit')} />
        </div>
      </AuthGuard>
      <AuthGuard
        permissions={[
          {
            module: ModuleNames.ACTIVITY,
            type: BasicPermissionTypes.UPDATE,
          },
        ]}
      >
        <Button
          isLoading={isUpdateActivityStatusLoading}
          className="mr-[10px] bg-whiteScreen__BorderColor py-[4px] px-[17px] text-ipBlack__textColor text-[14px] font-biotif__Medium rounded-[6px] h-[32px] mb-[10px] hover:bg-primaryColor hover:text-white"
          onClick={() => changeActivityCompleteStatus()}
          isDisabled={isGetActivityDetailLoading}
        >
          {activityCompleteStatus ? 'Re-Open' : 'Mark as done'}
        </Button>
      </AuthGuard>
      {activityCompleteStatus && (
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.ACTIVITY,
              type: BasicPermissionTypes.UPDATE,
            },
          ]}
        >
          <ScheduleFollowUp
            activityId={activityId}
            isDisabled={isGetActivityDetailLoading}
            closeModalForDashboard={closeModalForDashboard}
            closeViewModal={closeViewModal}
            onEdit={onEdit}
            openModald={openModald}
            setOpenModald={setOpenModald}
          />
        </AuthGuard>
      )}
      <FollowUnFollow
        entityData={activityDetail}
        entityId={activityId}
        moduleName={ModuleNames.ACTIVITY}
      />
      <div className="activityCall__wrapper relative">
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.ACTIVITY,
              type: BasicPermissionTypes.UPDATE,
            },
          ]}
        >
          <Button
            isLoading={isChangeActivityStatusLoading}
            className={`${activityRunningStatus.status
              ? 'bg-ip__Red hover:bg-ip__Red__hoverDark'
              : ' bg-ip__SuccessGreen hover:bg-ip__SuccessGreen__hoverDark'
              } inline-flex h-[32px] py-[5px] mb-[10px] rounded-[6px]`}
            onClick={() => startOrStopActivity(!activityRunningStatus.status)}
            isDisabled={isGetActivityDetailLoading}
          >
            {`${activityRunningStatus.status ? 'Stop' : 'Start'} ${activityTypeName || ''
              }`}
          </Button>
        </AuthGuard>
      </div>
    </div>
  );
};

export default ActivityDetailTopActionHeader;
