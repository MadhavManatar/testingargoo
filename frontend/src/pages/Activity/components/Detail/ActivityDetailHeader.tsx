// ** Import Packages **
import { format } from 'date-fns-tz';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// ** Redux **
import { setLoadTimeLines } from 'redux/slices/commonSlice';

// ** Components **
import RedirectToGoogleMap from 'components/Address/components/RedirectToGoogleMap';
import Dropdown from 'components/Dropdown';
import EntityCard from 'components/EntityDetails/QuickLookCard/EntityCard';
import LeadDealCard from 'components/EntityDetails/QuickLookCard/LeadDealCard';
import AddNoteModal from 'components/EntityDetails/Timeline/components/AddNoteModal';
import AssignTagModal from 'components/detail-components/AssignTags/AssignTagModal';
import AddAttachmentModal from 'components/detail-components/Attachment/components/AddAttachmentModal';
import AuthGuard from 'pages/auth/components/AuthGuard';
import EditActivityModal from '../Modal/EditActivityModal';
import NotificationReminderModal from '../Modal/NotificationReminderModal';
import ActivityDetailDesktopHeader from './ActivityDetailDesktopHeader';
import ActivityDetailMobileHeader from './ActivityDetailMobileHeader';

// ** Hooks-Services **
import useAuth from 'hooks/useAuth';
import { useGetActiveDealStage } from 'pages/Activity/hooks/useGetCurrentDealStage';

// ** Constants **
import { NOTIFICATION_TYPE } from 'constant';
import {
  BasicPermissionTypes,
  ModuleNames,
  TagPermissions,
} from 'constant/permissions.constant';

// ** Types **
import { AssignTagsProps } from 'components/EntityDetails/types';
import {
  ActivityDetailHeaderProps,
  ActivityHeaderInfo,
  ActivityParticipantType,
  ActivityResponseType,
  ModalProps,
  activityGuestsType,
} from 'pages/Activity/types/activity.types';
import { DealDetailsType } from 'pages/Deal/types/deals.types';
import { LeadDetailsType } from 'pages/Lead/types/lead.type';

// ** Util **
import { convertNumberOrNull } from 'utils/util';

// ** Helper **
import { calculateLogOnTime } from 'pages/Activity/helper/dateAndTime.helper';
import { setContactAndMailFunc } from 'pages/Lead/helper/leads.helper';
import { getCurrentUserDateFormat } from 'redux/slices/authSlice';

export const ActivityDetailHeader = (props: ActivityDetailHeaderProps) => {
  const {
    isUpdateActivityStatusLoading,
    activityDetail,
    invokeActivityDetailApiCall,
    assignedTags,
    setAssignedTags,
    deleteAssignedTag,
    getAssignedTags,
    openModal,
    closeModal,
    isChangeActivityStatusLoading,
    activityRunningStatus,
    setActivityRunningStatus,
    changeSetOpenModal,
    startOrStopActivity,
    changeActivityCompleteStatus,
    activityIdFromParentComponent,
    isMobileView,
    activityCompleteStatus,
    onEdit,
    openNotificationReminderModal,
    setIsOpenNotificationReminderModal,
  } = props;

  // ** Hooks ** //
  const { id } = useParams();
  const activityId = activityIdFromParentComponent || convertNumberOrNull(id);

  //  ** Constants ** //
  const {
    activity_type,
    activity_contact,
    activity_account,
    activity_lead,
    start_date,
    all_day,
    duration,
    join_link,
    activity_time_logs,
    is_active,
    notifications,
    guests,
    activity_participants,
  } = activityDetail;

  const contactAddress = {
    address1: activity_contact?.address1 || '',
    address2: activity_contact?.address2 || '',
    state: activity_contact?.state?.state_code || '',
    city: activity_contact?.city || '',
    country: activity_contact?.country?.name || '',
    zip: activity_contact?.zip || '',
  };

  const checkContactAddressLength = Object.values(contactAddress).find(
    (element) => element
  );

  const accountAddress = {
    address1: activity_account?.address1 || '',
    address2: activity_account?.address2 || '',
    state: activity_account?.state?.state_code || '',
    city: activity_account?.city || '',
    country: activity_account?.country?.name || '',
    zip: activity_account?.zip || '',
  };

  const address = checkContactAddressLength ? contactAddress : accountAddress;

  // ** States ** //
  const [isLinkDocument, setIsLinkDocument] = useState(false);
  const [activeDealStage, setActiveDealStage] = useState<string>('');
  // const [openNotificationReminderModal, setIsOpenNotificationReminderModal] =
  //   useState<boolean>(false);

  const { getActiveDealStageData } = useGetActiveDealStage({
    setActiveDealStage,
  });

  useEffect(() => {
    if (activityDetail?.activity_lead_id) {
      if (activityDetail?.activity_lead?.is_deal) {
        getActiveDealStageData(activityDetail.activity_lead_id);
      }
    }
  }, [activityDetail.activity_lead_id]);

  useEffect(() => {
    setActivityRunningStatus({
      log: activity_time_logs,
      status: is_active,
    });
  }, [activity_time_logs, is_active]);

  const accountCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = accountCardProps;
      const accountPrimaryEmail = (activity_account?.emails || [])?.find(
        (val) => val.isPrimary
      )?.value;
      const accountPrimaryPhone = (activity_account?.phones || [])?.find(
        (val) => val.isPrimary
      );

      const checkAddressLength = Object.values(accountAddress).find(
        (element) => element
      );
      return (
        <>
          {activity_account?.name && Boolean(activity_account?.id) && (
            <EntityCard
              modelName={ModuleNames.ACCOUNT}
              id={activity_account?.id}
              name={activity_account?.name}
              email={accountPrimaryEmail}
              phone={accountPrimaryPhone?.value?.toString() || ''}
              phoneType={accountPrimaryPhone?.phoneType || ''}
              {...(!!checkAddressLength && { address: accountAddress })}
              {...{ close, setIsOpen, isOpen }}
            />
          )}
        </>
      );
    },
    [activity_account]
  );

  const contactCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = accountCardProps;
      const contactPrimaryEmail = (activity_contact?.emails || [])?.filter(
        (val) => val.is_primary
      )?.[0]?.value;
      const contactPrimaryPhone = (activity_contact?.phones || [])?.filter(
        (val) => val.is_primary
      )?.[0];
      const checkAddressLength = Object.values(contactAddress).find(
        (element) => element
      );

      return (
        <>
          {activity_contact?.name && Boolean(activity_contact?.id) && (
            <EntityCard
              modelName={ModuleNames.CONTACT}
              id={activity_contact?.id}
              name={activity_contact?.name}
              email={contactPrimaryEmail}
              phone={contactPrimaryPhone?.value?.toString()}
              phoneType={contactPrimaryPhone?.phoneType || ''}
              {...(!!checkAddressLength && { address: contactAddress })}
              {...{ close, setIsOpen, isOpen }}
            />
          )}
        </>
      );
    },
    [activity_contact]
  );

  const leadDealCard = useCallback(
    (leadDealCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    }) => {
      const { close, setIsOpen } = leadDealCardProps;
      const contactMail = setContactAndMailFunc({
        leadData: activity_lead as unknown as LeadDetailsType | DealDetailsType,
        isActivityContactMail: true,
      });
      return (
        <>
          {Boolean(activity_lead?.id) && activity_lead?.name && (
            <LeadDealCard
              id={activity_lead?.id}
              name={activity_lead?.name}
              closing_date={activity_lead?.closing_date}
              is_deal={activity_lead?.is_deal}
              owner={{
                first_name: activity_lead?.lead_owner?.first_name,
                last_name: activity_lead?.lead_owner?.last_name,
              }}
              source={activity_lead?.lead_source?.name}
              value={activity_lead?.deal_value}
              {...{ close, setIsOpen }}
              contactMail={contactMail}
              activeDealStage={activeDealStage}
            />
          )}
        </>
      );
    },
    [activity_lead, activeDealStage]
  );

  const dateFormat = useSelector(getCurrentUserDateFormat) || 'MM/dd/yyyy';

  const phone =
    activity_contact?.phones?.filter((val) => val?.is_primary)[0] ||
    activity_account?.phones?.filter((val) => val?.isPrimary)[0];

  const mail =
    activity_contact?.emails?.filter((val) => val?.is_primary)[0]?.value ||
    activity_account?.emails?.filter((val) => val?.isPrimary)[0]?.value;

  const headerInfo: ActivityHeaderInfo = {
    activityType: activity_type?.name,
    activityRunningStatus: `${
      activityRunningStatus.status ? 'Stop' : 'Start'
    } ${activity_type?.name || ''}`,
    contactName: activity_contact?.id ? (
      <Dropdown
        className="quickView__accContact__tippy"
        zIndex={10}
        hideOnClick
        content={contactCard}
      >
        <button
          type="button"
          className="hover:text-primaryColorSD cursor-pointer hover:underline"
        >
          {activity_contact?.name}
        </button>
      </Dropdown>
    ) : (
      <></>
    ),
    contactJobRole: activity_contact?.job_role || '',
    contactNameAndJobRoleComma:
      activity_contact?.job_role && activity_account?.name ? ', ' : '',
    accountName: activity_account?.id ? (
      <Dropdown
        className="quickView__accContact__tippy"
        zIndex={10}
        hideOnClick
        content={accountCard}
      >
        <button
          type="button"
          className="hover:text-primaryColorSD cursor-pointer hover:underline"
        >
          {activity_account?.name}
        </button>
      </Dropdown>
    ) : (
      <></>
    ),
    dealOrLeadName: activity_lead?.id ? (
      <Dropdown
        className="quickView__accContact__tippy"
        zIndex={10}
        hideOnClick
        content={leadDealCard}
      >
        <button
          type="button"
          className="hover:text-primaryColorSD cursor-pointer hover:underline"
        >
          {activity_lead?.is_deal ? 'Deal' : 'Lead'}: {activity_lead?.name}
        </button>
      </Dropdown>
    ) : (
      <></>
    ),
    contactPrimaryEmail: mail,
    contactPrimaryPhone: phone,
    formattedStartDate: start_date
      ? format(new Date(start_date || ''), ` EEEE, ${dateFormat}`)
      : '',
    formattedTime: all_day
      ? 'All Time'
      : start_date
      ? format(new Date(start_date || ''), ' hh:mm aa')
      : '',
    formattedDuration: ` ${duration} Minutes`,
    zoomMeetingLink: join_link,
    activityStatus: activityCompleteStatus ? 'Re-Open' : 'Mark as done',
    logOnTime: (
      <>
        <span className="inline-block text-[14px] text-black font-biotif__Medium pr-[5px] sm:text-[14px] sm:text-black/50 sm:font-biotif__SemiBold">
          Time Logged:
        </span>
        <span className="inline-block text-[14px] text-black/50 font-biotif__Medium sm:text-[14px] sm:text-black sm:font-biotif__SemiBold">
          {calculateLogOnTime(activityRunningStatus?.log) || '-'}{' '}
        </span>
      </>
    ),
    title3: activity_account ? (
      <RedirectToGoogleMap address={{ ...address }} />
    ) : (
      <></>
    ),

    ...restOfHeaderInfoObject({
      guests,
      notifications,
      activity_participants,
      setIsOpenNotificationReminderModal,
    }),
  };

  const commonHeaderProps = {
    activityDetail,
    activityRunningStatus,
    assignedTags,
    setAssignedTags,
    changeSetOpenModal,
    deleteAssignedTag,
    headerInfo,
    setIsLinkDocument,
  };
  return (
    <>
      {isMobileView ? (
        <ActivityDetailMobileHeader
          {...commonHeaderProps}
          changeActivityCompleteStatus={changeActivityCompleteStatus}
          isChangeActivityStatusLoading={isChangeActivityStatusLoading}
          isUpdateActivityStatusLoading={isUpdateActivityStatusLoading}
          startOrStopActivity={startOrStopActivity}
        />
      ) : (
        <ActivityDetailDesktopHeader {...commonHeaderProps} />
      )}
      <ActivityDetailAllModal
        activityId={activityId}
        assignedTags={assignedTags}
        setAssignedTags={setAssignedTags}
        closeModal={closeModal}
        deleteAssignedTag={deleteAssignedTag}
        getAssignedTags={getAssignedTags}
        invokeActivityDetailApiCall={invokeActivityDetailApiCall}
        isLinkDocument={isLinkDocument}
        openModal={openModal}
        openNotificationReminderModal={openNotificationReminderModal}
        setIsOpenNotificationReminderModal={setIsOpenNotificationReminderModal}
        activityDetail={activityDetail}
        onEdit={onEdit}
      />
    </>
  );
};

type ActivityDetailAllModalPropsType = {
  openModal: ModalProps;
  closeModal: () => void;
  invokeActivityDetailApiCall: (valId: number | null) => void;
  isLinkDocument: boolean;
  assignedTags: AssignTagsProps;
  setAssignedTags: (value: React.SetStateAction<AssignTagsProps>) => void;
  getAssignedTags: () => Promise<void>;
  deleteAssignedTag: (deleteId: number) => Promise<void>;
  activityId: number | null;
  openNotificationReminderModal: boolean;
  setIsOpenNotificationReminderModal: Dispatch<SetStateAction<boolean>>;
  activityDetail: ActivityResponseType;
  onEdit: ((data: any) => void) | undefined;
};

const ActivityDetailAllModal = (props: ActivityDetailAllModalPropsType) => {
  const {
    assignedTags,
    closeModal,
    setAssignedTags,
    deleteAssignedTag,
    getAssignedTags,
    invokeActivityDetailApiCall,
    isLinkDocument,
    openModal,
    activityId,
    openNotificationReminderModal,
    setIsOpenNotificationReminderModal,
    activityDetail,
    onEdit,
  } = props;
  const { hasAuthorized } = useAuth();
  const dispatch = useDispatch();

  // ** Constants ** //
  const editTagsPermission = hasAuthorized([
    { module: ModuleNames.TAG, type: TagPermissions.ACTIVITY },
  ]);
  return (
    <>
      {activityId && (
        <>
          <AuthGuard
            permissions={[
              {
                module: ModuleNames.NOTE,
                type: BasicPermissionTypes.CREATE,
              },
            ]}
          >
            {openModal.note ? (
              <AddNoteModal
                isOpen={openModal.note}
                closeModal={closeModal}
                modelName={ModuleNames.ACTIVITY}
                modelRecordId={activityId}
              />
            ) : (
              <></>
            )}
          </AuthGuard>
          <AuthGuard
            permissions={[
              {
                module: ModuleNames.ATTACHMENT,
                type: BasicPermissionTypes.CREATE,
              },
            ]}
          >
            {openModal.attachment ? (
              <AddAttachmentModal
                isOpen={openModal.attachment}
                closeModal={closeModal}
                modelName={ModuleNames.ACTIVITY}
                modelRecordId={activityId}
                isLink={isLinkDocument}
              />
            ) : (
              <></>
            )}
          </AuthGuard>
          {openModal.edit ? (
            <AuthGuard
              permissions={[
                {
                  module: ModuleNames.ACTIVITY,
                  type: BasicPermissionTypes.UPDATE,
                },
              ]}
            >
              {openModal.edit ? (
                <EditActivityModal
                  id={activityId}
                  isOpen={openModal.edit}
                  onEdit={(data) => {
                    if (onEdit) {
                      onEdit(data);
                    } else {
                      dispatch(setLoadTimeLines({ timeline: true }));
                    }
                    invokeActivityDetailApiCall(activityId);
                  }}
                  closeModal={closeModal}
                  openModal={openModal}
                />
              ) : (
                <></>
              )}
            </AuthGuard>
          ) : (
            <></>
          )}
          <AuthGuard
            permissions={[
              {
                module: ModuleNames.TAG,
                type: TagPermissions.ACTIVITY,
              },
            ]}
          >
            {openModal.tag ? (
              <AssignTagModal
                isOpen={openModal.tag}
                setAssignedTags={setAssignedTags}
                closeModal={closeModal}
                modelRecordId={activityId}
                assignedTags={assignedTags}
                modelName={ModuleNames.ACTIVITY}
                getAssignedTags={getAssignedTags}
                deleteAssignedTag={deleteAssignedTag}
                editTagsPermission={editTagsPermission}
              />
            ) : (
              <></>
            )}
          </AuthGuard>

          {/* see All reminder Modal */}
          {openNotificationReminderModal ? (
            <NotificationReminderModal
              closeModal={() => setIsOpenNotificationReminderModal(false)}
              isOpen={openNotificationReminderModal}
              activityId={activityId}
              notifications={activityDetail?.notifications || []}
              onUpdate={() => {
                invokeActivityDetailApiCall(activityId);
                setIsOpenNotificationReminderModal(false);
              }}
            />
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

type restOfHeaderInfoObjectArgsType = {
  notifications: {
    notificationType: string;
    duration: number;
    durationType: number;
  }[];
  setIsOpenNotificationReminderModal: Dispatch<SetStateAction<boolean>>;
  guests: activityGuestsType[];
  activity_participants: ActivityParticipantType[];
};
const restOfHeaderInfoObject = (args: restOfHeaderInfoObjectArgsType) => {
  const {
    notifications,
    setIsOpenNotificationReminderModal,
    guests,
    activity_participants,
  } = args;
  return {
    reminder: {
      isShow: notifications?.length > 0,
      title: <span className="text-black/50 pr-[4px]">Reminder:</span>,
      singleReminder: (
        <span className="inline-block mr-[5px]">
          {notifications?.[0]?.duration}{' '}
          {
            NOTIFICATION_TYPE?.find(
              (type) => type.value === notifications?.[0]?.durationType
            )?.label
          }{' '}
          Before
        </span>
      ),
      allReminder: (
        <span
          className="inline-block text-primaryColor cursor-pointer hover:underline"
          onClick={() => setIsOpenNotificationReminderModal(true)}
        >
          See all
        </span>
      ),
    },
    isMeetingConfirmed:
      guests?.length > 0 &&
      activity_participants?.length > 0 &&
      (guests || []).every((val) => val.is_confirm === true) &&
      (activity_participants || []).every((val) => val.is_confirm === true),
  };
};
