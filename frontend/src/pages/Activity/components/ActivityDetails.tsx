// ** Import Packages ** //
import { AnyAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// ** Redux ** //
import {
  getIsLoadDetailsLoad,
  setLoadDetails,
  setLoadTimeLines,
} from 'redux/slices/commonSlice';
import { getActivityTab } from 'redux/slices/entityDetailSlice';

// ** Components ** //
import Breadcrumbs from 'components/Breadcrumbs';
import { TAB } from 'components/EntityDetails/constant';
import ActivityTab from './ActivityTab';
import Timeline from 'components/EntityDetails/Timeline';
import ActivityDetailPageSkeleton from '../skeletons/ActivityDetailPageSkeleton';
import { ActivityDetailHeader } from './Detail/ActivityDetailHeader';
import ActivityDetailTopActionHeader from './Detail/ActivityDetailTopActionHeader';
import MarkAsDoneModal from './Modal/MarkAsDoneModal';

// ** Hook- Services ** //
import useWindowDimensions from 'hooks/useWindowDimensions';
import { useGetActivityDetail } from '../hooks/useActivityService';

// ** Types **
import { tag } from 'components/detail-components/AssignTags/types/assignTags.type';
import { AssignTagsProps } from 'components/EntityDetails/types';
import {
  activityLogResponse,
  ActivityResponseType,
  ModalProps,
  ModalTypeProps,
} from '../types/activity.types';

// ** Constants **
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames, TagPermissions } from 'constant/permissions.constant';
import { TimelineModelName } from 'constant/timeline.constant';
import { ToastMsg } from 'constant/toast.constants';
import { ACTIVITY_TABS } from 'pages/Contact/constant';

// ** Util **
import { convertNumberOrNull, setUrlParams } from 'utils/util';
import ActivityReOpenClearResultWarningModal from './Modal/ActivityReOpenClearResultWarningModal';
import {
  useAssignTagMutation,
  useLazyGetAssignedTagByModelRecordIdQuery,
} from 'redux/api/tagApi';
import {
  useChangeActivityStatusByIdMutation,
  useUpdateActivityMutation,
} from 'redux/api/activityApi';
import ActivityInfo from './Detail/ActivityInfo';

interface Props {
  activityId?: number;
  closeViewModal?: (activityDetail?: ActivityResponseType) => void;
  closeModalForDashboard?: () => void;
  onEdit?: (data: any) => void;
  parentNode?: 'activityDetail' | 'other';
  setModalTitle?: Dispatch<SetStateAction<string>>;
}

const ActivityDetails = (props: Props) => {
  const {
    activityId: activityIdFromDashboard,
    closeViewModal,
    closeModalForDashboard,
    onEdit,
    parentNode = 'detailPage',
    setModalTitle,
  } = props;
  // ** hooks ** //
  const { id } = useParams();
  const activityId = activityIdFromDashboard || convertNumberOrNull(id);
  const dispatch = useDispatch();
  const IsActivityDetailsLoad = useSelector(getIsLoadDetailsLoad);
  const tab = useSelector(getActivityTab);

  // ** states **
  const [openNotificationReminderModal, setIsOpenNotificationReminderModal] =
    useState<boolean>(false);
  const [openModal, setOpenModal] = useState<{
    complete: boolean;
    edit: boolean;
    tag: boolean;
    note: boolean;
    attachment: boolean;
    reOpen: boolean;
  }>({
    complete: false,
    edit: false,
    tag: false,
    note: false,
    attachment: false,
    reOpen: false,
  });
  const [activityRunningStatus, setActivityRunningStatus] = useState<{
    status: boolean;
    log: activityLogResponse;
  }>({ log: [], status: false });
  const [activityCompleteStatus, setActivityCompleteStatus] =
    useState<boolean>(false);
  const [assignedTags, setAssignedTags] = useState<AssignTagsProps>({
    list: [],
    total: 0,
  });

  const [openModald, setOpenModald] = useState<{
    scheduleFollowUp: boolean;
    followUpDate?: Date;
  }>({
    scheduleFollowUp: false,
    followUpDate: undefined,
  });

  const [skeletonCount, setSkeletonCount] = useState<number>(1);

  // APIS
  const [updateActivityByIdAPI, { isLoading: isUpdateActivityStatusLoading }] =
    useUpdateActivityMutation();

  // ** custom hooks **
  const {
    getActivity,
    activityDetail,
    isLoading: isGetActivityDetailLoading,
  } = useGetActivityDetail();
  const {
    deleteAssignedTag,
    getAssignedTags,
    startOrStopActivity,
    isChangeActivityStatusLoading,
  } = useActivityDetailApisHook({
    activityId,
    setAssignedTags,
    assignedTags,
    setActivityRunningStatus,
    onEdit,
  });

  useEffect(() => {
    Promise.all([invokeActivityDetailApiCall(activityId), getAssignedTags()]);
  }, [activityId,activityCompleteStatus]);

  useEffect(() => {
    setActivityCompleteStatus(Boolean(activityDetail?.completed_by));
  }, [activityDetail?.completed_by]);

  useEffect(() => {
    loadActivityDetail();
  }, [IsActivityDetailsLoad?.activity, activityId]);

  useEffect(() => {
    setModalTitle?.(activityDetail?.topic);
  }, [activityDetail?.topic]);

  const invokeActivityDetailApiCall = async (valId: number | null) => {
    if (valId) {
      await getActivity(valId);
      setSkeletonCount(skeletonCount + 1);
    }
  };

  const {
    changeActivityCompleteStatus,
    closeModal,
    changeSetOpenModal,
    loadActivityDetail,
    isMobileView,
  } = useActivityDetailFunctionHook({
    activityCompleteStatus,
    closeViewModal,
    setOpenModal,
    activityDetail,
    closeModalForDashboard,
    activityId,
    dispatch,
    invokeActivityDetailApiCall,
    IsActivityDetailsLoad,
  });

  const commonHeaderProps = {
    activityCompleteStatus,
    activityRunningStatus,
    changeSetOpenModal,
    changeActivityCompleteStatus,
    isUpdateActivityStatusLoading,
    isChangeActivityStatusLoading,
    startOrStopActivity,
    setIsOpenNotificationReminderModal,
    openNotificationReminderModal,
  };

  const updateCompleteActivityStatus = async (status: boolean) => {
    if (activityId) {
      const data = await updateActivityByIdAPI({
        id: activityId,
        data: {
          completed: status,
          memo: '',
          result: '',
        },
      });
      if ('data' in data) {
        onEdit?.(data);
        setActivityCompleteStatus(data.data?.completed);
        dispatch(setLoadTimeLines({ timeline: true }));
      }
    }
  };

  return activityId ? (
    <>
      {isGetActivityDetailLoading &&
      skeletonCount === 1 &&
      parentNode === 'activityDetail' ? (
        <ActivityDetailPageSkeleton />
      ) : (
        <div className="detailsPageNew activity__details__page">
          <div className="detailsPage__action__breadcrumbs flex flex-wrap content-start justify-between mb-0 sm:hidden">
            {activityIdFromDashboard ? (
              <></>
            ) : (
              <Breadcrumbs path={BREAD_CRUMB.activityDetails} />
            )}
            <ActivityDetailTopActionHeader
              {...commonHeaderProps}
              activityDetail={activityDetail}
              isGetActivityDetailLoading={isGetActivityDetailLoading}
              activityTypeName={activityDetail?.activity_type?.name}
              activityId={activityId}
              closeModalForDashboard={closeModalForDashboard}
              closeViewModal={closeViewModal}
              onEdit={onEdit}
              openModald={openModald}
              setOpenModald={setOpenModald}
            />
          </div>

          {isGetActivityDetailLoading && skeletonCount === 1 ? (
            <>skeleton...</>
          ) : (
            <ActivityDetailHeader
              {...commonHeaderProps}
              activityDetail={activityDetail}
              invokeActivityDetailApiCall={invokeActivityDetailApiCall}
              assignedTags={assignedTags}
              setAssignedTags={setAssignedTags}
              isMobileView={isMobileView}
              openModal={openModal}
              closeModal={closeModal}
              deleteAssignedTag={deleteAssignedTag}
              getAssignedTags={getAssignedTags}
              setActivityRunningStatus={setActivityRunningStatus}
              activityIdFromParentComponent={activityId}
              onEdit={onEdit}
            />
          )}
          <ActivityTab tabs={ACTIVITY_TABS} />
          {renderSection({
            tab,
            id: activityId,
            activityDetail,
            isMobileView,
            onEdit,
            setIsOpenNotificationReminderModal,
            openNotificationReminderModal,
            changeSetOpenModal,
            isGetActivityDetailLoading,
          })}

          <ActivityDetailMarkAsDoneModal
            {...{
              activityId,
              closeModal,
              openModal,
              setActivityCompleteStatus,
              activityTypeId: activityDetail?.activity_type_id,
              onEdit,
              dispatch,
            }}
          />
          <ActivityReOpenClearResultWarningModal
            proceed={() => {
              updateCompleteActivityStatus(!activityCompleteStatus);
              setOpenModal((prev) => ({ ...prev, reOpen: false }));
            }}
            isOpen={openModal.reOpen}
            closeModal={() =>
              setOpenModal((prev) => ({ ...prev, reOpen: false }))
            }
          />
        </div>
      )}
    </>
  ) : null;
};

type SectionProps = {
  activityDetail: ActivityResponseType;
  tab: TAB;
  id: number;
  isMobileView: boolean;
  onEdit: ((data: any) => void) | undefined;
  setIsOpenNotificationReminderModal: Dispatch<SetStateAction<boolean>>;
  openNotificationReminderModal: boolean;
  changeSetOpenModal: (val: ModalTypeProps) => void;
  isGetActivityDetailLoading: boolean;
};

const renderSection = (sectionProps: SectionProps) => {
  const {
    id,
    tab,
    activityDetail,
    isMobileView,
    onEdit,
    setIsOpenNotificationReminderModal,
    openNotificationReminderModal,
    changeSetOpenModal,
    isGetActivityDetailLoading,
  } = sectionProps;

  switch (tab) {
    case TAB.INFO:
      return (
        <ActivityInfo
          isLoading={isGetActivityDetailLoading}
          activityDetail={activityDetail}
          isMobileView={isMobileView}
          onEdit={onEdit}
          setIsOpenNotificationReminderModal={
            setIsOpenNotificationReminderModal
          }
          openNotificationReminderModal={openNotificationReminderModal}
          changeSetOpenModal={changeSetOpenModal}
        />
      );
    case TAB.TIMELINE:
      return (
        <Timeline
          modelName={TimelineModelName.ACTIVITY}
          modelRecordIds={[+id]}
        />
      );
    default:
      return <></>;
  }
};

export default ActivityDetails;

type UseActivityDetailApisHookProps = {
  activityId: number | null;
  assignedTags: AssignTagsProps;
  setAssignedTags: Dispatch<SetStateAction<AssignTagsProps>>;
  setActivityRunningStatus: Dispatch<
    SetStateAction<{
      status: boolean;
      log: activityLogResponse;
    }>
  >;
  onEdit: ((data: any) => void) | undefined;
};

const useActivityDetailApisHook = (props: UseActivityDetailApisHookProps) => {
  const {
    activityId,
    setAssignedTags,
    assignedTags,
    setActivityRunningStatus,
    onEdit,
  } = props;
  const dispatch = useDispatch();

  // ** APIS **
  const [getAssignedTagByModelRecordId] =
    useLazyGetAssignedTagByModelRecordIdQuery();
  const [
    changeActivityStatusByIdAPI,
    { isLoading: isChangeActivityStatusLoading },
  ] = useChangeActivityStatusByIdMutation();

  const [assignTag] = useAssignTagMutation();

  const getAssignedTags = async () => {
    if (activityId) {
      const { data, error } = await getAssignedTagByModelRecordId(
        {
          modelName: TagPermissions.ACTIVITY,
          params: {
            select: 'tag',
            'q[model_name]': ModuleNames.ACTIVITY,
          },
          id: activityId,
        },
        true
      );
      if (data?.rows && !error) {
        setAssignedTags({ list: data?.rows, total: data?.count });
      }
    }
  };
  const deleteAssignedTag = async (deletedId: number, tagDetail?: tag) => {
    const filteredArray = assignedTags.list.filter((obj) => {
      return obj.tag.id !== tagDetail?.id && obj.tag.name !== tagDetail?.name;
    });
    setAssignedTags({ list: filteredArray, total: filteredArray.length });

    if (activityId) {
      const data = await assignTag({
        id: activityId,
        data: {
          modelName: ModuleNames.ACTIVITY,
          tags: { deletedTagIds: [deletedId] },
          message: ToastMsg.common.deleteTag,
        },
      });
      if (!('error' in data)) {
        dispatch(setLoadTimeLines({ timeline: true }));
      } else {
        getAssignedTags();
      }
    }
  };

  const startOrStopActivity = async (is_active: boolean) => {
    if (activityId) {
      const result = await changeActivityStatusByIdAPI({
        id: activityId,
        data: {
          is_active,
        },
      });

      const data = _.cloneDeep(result);
      if ('data' in data && data.data) {
        data.data.for_change_status = true;
        onEdit?.(data);
        setActivityRunningStatus((prev) => ({
          status: !prev.status,
          log: data?.data?.activity_time_logs,
        }));
      }
    }
  };
  return {
    getAssignedTags,
    deleteAssignedTag,
    startOrStopActivity,
    isChangeActivityStatusLoading,
  };
};

type UseActivityDetailFunctionHookProps = {
  activityCompleteStatus: boolean;
  setOpenModal: Dispatch<SetStateAction<ModalProps>>;
  closeViewModal?: (activityDetail?: ActivityResponseType) => void;
  activityDetail: ActivityResponseType;
  closeModalForDashboard: (() => void) | undefined;
  activityId: number | null;
  IsActivityDetailsLoad:
    | {
        leads: boolean;
        contacts: boolean;
        deals: boolean;
        accounts: boolean;
        activity: boolean;
      }
    | undefined;
  invokeActivityDetailApiCall: (valId: number | null) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
};

const useActivityDetailFunctionHook = (
  props: UseActivityDetailFunctionHookProps
) => {
  const {
    activityCompleteStatus,
    closeViewModal,
    setOpenModal,
    activityDetail,
    closeModalForDashboard,
    activityId,
    IsActivityDetailsLoad,
    invokeActivityDetailApiCall,
    dispatch,
  } = props;
  const navigate = useNavigate();
  const { isMobileView } = useWindowDimensions();

  const changeSetOpenModal = (val: ModalTypeProps) => {
    closeModalForDashboard?.();
    if (val === 'edit' && isMobileView) {
      navigate(
        setUrlParams(
          PRIVATE_NAVIGATION.activities.EditActivityMobileView,
          activityDetail?.id
        )
      );
    } else {
      setOpenModal({
        complete: val === 'complete',
        edit: val === 'edit' || val === 'editScroll',
        tag: val === 'tag',
        note: val === 'note',
        attachment: val === 'attachment',
        editScroll: val === 'editScroll',
        reOpen: val === 'reOpen',
      });
    }
  };

  const changeActivityCompleteStatus = () => {
    if (activityCompleteStatus) {
      setOpenModal((prev) => ({ ...prev, reOpen: true }));
    } else {
      changeSetOpenModal('complete');
    }
  };

  const closeModal = () => {
    setOpenModal({
      complete: false,
      edit: false,
      tag: false,
      note: false,
      attachment: false,
      reOpen: false,
    });

    // ** for Desktop **//

    closeViewModal?.(activityDetail);
  };

  const loadActivityDetail = () => {
    if (IsActivityDetailsLoad?.activity && activityId) {
      invokeActivityDetailApiCall(activityId);
      dispatch(
        setLoadDetails({
          loadModuleDetails: {
            ...IsActivityDetailsLoad,
            activity: false,
          },
        })
      );
    }
  };

  return {
    changeActivityCompleteStatus,
    closeModal,
    changeSetOpenModal,
    loadActivityDetail,
    isMobileView,
  };
};

type ActivityDetailMarkAsDoneModalPropsType = {
  openModal: {
    complete: boolean;
    edit: boolean;
    tag: boolean;
    note: boolean;
    attachment: boolean;
  };
  closeModal: () => void;
  setActivityCompleteStatus: Dispatch<SetStateAction<boolean>>;
  activityId: number;
  activityTypeId?: number;
  onEdit: ((data: any) => void) | undefined;
  dispatch: Dispatch<AnyAction>;
};

const ActivityDetailMarkAsDoneModal = (
  props: ActivityDetailMarkAsDoneModalPropsType
) => {
  const {
    closeModal,
    openModal,
    setActivityCompleteStatus,
    activityId,
    activityTypeId,
    onEdit,
    dispatch,
  } = props;
  return (
    <>
      {openModal.complete ? (
        <MarkAsDoneModal
          isOpen={openModal.complete}
          closeModal={closeModal}
          onAdd={(data: any) => {
            onEdit?.(data);
            setActivityCompleteStatus(true);
            dispatch(setLoadTimeLines({ timeline: true }));
          }}
          activityId={activityId}
          activityTypeId={activityTypeId}
        />
      ) : null}
    </>
  );
};
