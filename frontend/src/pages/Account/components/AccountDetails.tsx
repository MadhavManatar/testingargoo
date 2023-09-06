// ** Import Packages **
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// ** Redux **
import { setLoadTimeLines } from 'redux/slices/commonSlice';
import { getTab } from 'redux/slices/entityDetailSlice';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import { Tab as EmailTab } from 'constant/emailTemplate.constant';
import NextSteps from 'components/EntityDetails/NextSteps';
import StayInTouch from 'components/EntityDetails/StayInTouch';
import Tabs from 'components/EntityDetails/Tabs';
import Timeline from 'components/EntityDetails/Timeline';
import AddNoteModal from 'components/EntityDetails/Timeline/components/AddNoteModal';
import { ModalType, TAB } from 'components/EntityDetails/constant';
import AssignTagModal from 'components/detail-components/AssignTags/AssignTagModal';
import AddAttachmentModal from 'components/detail-components/Attachment/components/AddAttachmentModal';
import AddActivityModal from 'pages/Activity/components/Modal/AddActivityModal';
import EditActivityModal from 'pages/Activity/components/Modal/EditActivityModal';
import AuthGuard from 'pages/auth/components/AuthGuard';
import AccountDetailSkeleton from '../skeletons/AccountDetailSkeleton';
import AccountDetailHeader from './detail/AccountDetailHeader';
import AccountInfo from './detail/AccountInfo';

// ** Services **
import { useGetAccountDetails } from '../hooks/useAccountService';

// ** Types **
import {
  AssignTagsProps,
  EntityModalState,
} from 'components/EntityDetails/types';
import { tag } from 'components/detail-components/AssignTags/types/assignTags.type';
import {
  AccountDetailsCompPropsType,
  AccountDetailsSectionPropsType,
  AccountParentChild,
} from '../types/account.types';

// ** Custom Hooks **
import { useGetScheduleActivity } from 'components/EntityDetails/StayInTouch/hook/useGetScheduleActivity';
import usePermission from 'hooks/usePermission';

// ** Constants **
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  ModuleNames,
  POLYMORPHIC_MODELS,
  TagPermissions,
} from 'constant/permissions.constant';
import { TimelineModelName } from 'constant/timeline.constant';
import { ToastMsg } from 'constant/toast.constants';
import { LEAD_TABS } from 'pages/Contact/constant';

// ** Others **
import { convertNumberOrNull, setUrlParams } from 'utils/util';
import FollowUnFollow from 'pages/Dashboard/components/FollowUnFollow';
import {
  QuickEntry,
  SetQuickPopupAction,
  setQuickPopup,
} from 'redux/slices/quickPopupDefaultSlice';
import {
  useAssignTagMutation,
  useLazyGetAssignedTagByModelRecordIdQuery,
} from 'redux/api/tagApi';
import {
  SetEmailInsertAction,
  setEmailInsertField,
} from 'redux/slices/emailInsertField';
import DetailHeaderEdit from 'components/detail-components/detail-header-edit';
import { useLazyGetParentChildAccountQuery } from 'redux/api/accountApi';

const AccountDetails = () => {
  // ** Hooks **
  const { id } = useParams();
  const accountId = convertNumberOrNull(id);
  const navigate = useNavigate();
  const tab = useSelector(getTab);
  const dispatch = useDispatch();

  const [reRenderNextStep, setReRenderNextStep] = useState<number>(0);
  const [isStayInTouchOpen, setIsStayInTouchOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<EntityModalState>({
    [ModalType.TAG]: { open: false },
    [ModalType.NOTE]: { open: false },
    [ModalType.ATTACHMENT]: { open: false },
    [ModalType.ACTIVITY]: { open: false },
    [ModalType.EDIT_ACTIVITY]: { open: false },
    [ModalType.CONVERT_LEAD]: { open: false },
  });

  const [isLinkDocument, setIsLinkDocument] = useState(false);
  const [assignedTags, setAssignedTags] = useState<AssignTagsProps>({
    list: [],
    total: 0,
  });
  const [parentChildData, setParentChildData] = useState<AccountParentChild>({
    child: [],
    parent: [],
  });

  // ** apis **
  const [getParentChildAccountAPI, { isLoading: isParentChildLoading }] =
    useLazyGetParentChildAccountQuery();

  const {
    createNotePermission,
    createDocumentPermission,
    createActivityPermission,
    tagForAccountPermission,
  } = usePermission();

  // ** State **
  const [stopLoadingSkeleton, setStopLoadingSkeleton] =
    useState<boolean>(false);

  const { accountData, setShowLoader, isAccountLoading } = useGetAccountDetails(
    { accountId, setStopLoadingSkeleton }
  );
  const {
    getScheduleActivity,
    scheduleActivityData,
    isScheduleActivityLoading,
  } = useGetScheduleActivity();
  const { getAssignedTags } = useGetAssignedTags(
    accountId,
    setAssignedTags,
    assignedTags
  );
  const { deleteAssignedTag } = useDeleteAssignedTags(
    accountId,
    getAssignedTags,
    setAssignedTags,
    assignedTags
  );
  // Get & Store parent child data
  useEffect(() => {
    (async () => {
      const { data, error } = await getParentChildAccountAPI(
        {
          params: {
            parent_account_id: accountData.account.parent_account_id,
            account_id: accountData.account.id,
          },
        },
        true
      );
      if (data && !error) {
        setParentChildData(data);
      }
    })();
  }, [accountData]);

  useEffect(() => {
    if (accountData.account.id) {
      setStopLoadingSkeleton(false);
      const primaryContact = accountData?.account?.AccountContacts?.find(
        (val) => val.is_primary
      );
      // ** Store Account in the Redux for quick Popup default Value
      const state_data: SetQuickPopupAction = {
        entity: QuickEntry.ACCOUNT,
        data: {
          id: accountData?.account.id,
          name: accountData?.account.name,
        },
      };
      dispatch(setQuickPopup(state_data));
      // ** Store Contact in the Redux for quick Popup default Value
      const state_data_contact: SetQuickPopupAction = {
        entity: QuickEntry.CONTACT,
        data: {
          id: Number(primaryContact?.contact_id) || '',
          name: primaryContact?.contact?.name || '',
          jobRole:
            primaryContact?.job_role || primaryContact?.contact?.job_role || '',
        },
      };
      dispatch(setQuickPopup(state_data_contact));
      // ** Store Lead in the Redux for quick Popup default Value
      const state_data_lead: SetQuickPopupAction = {
        entity: QuickEntry.LEAD,
        data: {
          id: '',
          name: '',
          jobRole: '',
        },
      };
      dispatch(setQuickPopup(state_data_lead));
      // ** Store Deal in the Redux for quick Popup default Value
      const state_data_deal: SetQuickPopupAction = {
        entity: QuickEntry.DEAL,
        data: {
          id: '',
          name: '',
          jobRole: '',
        },
      };
      dispatch(setQuickPopup(state_data_deal));
      // ** Store Parent in the Redux for quick Popup default Value
      const state_data_parent: SetQuickPopupAction = {
        entity: QuickEntry.PARENT,
        data: {
          id: accountData?.account.id,
          name: accountData?.account.name,
          parentCount: parentChildData.parent.length,
          childCount: parentChildData.child.length,
          isParentChildLoading,
        },
      };
      dispatch(setQuickPopup(state_data_parent));
      // ** Store For Email Insert in the Redux for quick Popup default Value
      const primaryEmail = accountData.account?.emails?.find(
        (val) => val.isPrimary
      );
      const primaryAccount = accountData?.account?.AccountContacts?.find(
        (val) => val.is_primary
      );
      const emailInsertField: SetEmailInsertAction = {
        entity: EmailTab.ACCOUNT,
        data: {
          id: accountData.account.id || 0,
          account_name: accountData.account?.name || '',
          account_owner:
            `${accountData.account?.account_owner?.first_name} ${accountData.account?.account_owner?.last_name}` ||
            '',
          account_email: primaryEmail?.value || '',
          account_address: accountData.account?.address1
            ? `${accountData.account?.address1} ${accountData.account?.address2}`
            : '',
          account_contact_name: primaryAccount?.contact?.name || '',
        },
      };
      dispatch(setEmailInsertField(emailInsertField));
      getScheduleActivity(accountData.account.id);
      getAssignedTags();
    }
  }, [accountData.account.id, parentChildData, isParentChildLoading]);

  const closeModal = () => {
    setModal({
      [ModalType.TAG]: { open: false },
      [ModalType.NOTE]: { open: false },
      [ModalType.ATTACHMENT]: { open: false },
      [ModalType.ACTIVITY]: { open: false },
      [ModalType.CONVERT_LEAD]: { open: false },
      [ModalType.EDIT_ACTIVITY]: { open: false },
    });
  };

  const onEditClick = (account_id: number) => {
    navigate(setUrlParams(PRIVATE_NAVIGATION.accounts.edit, account_id));
  };

  return accountId ? (
    <>
      <AccountDetailsComp
        tab={tab}
        parentChildData={parentChildData}
        isParentChildLoading={isParentChildLoading}
        setModal={setModal}
        accountId={accountId}
        accountData={accountData}
        onEditClick={onEditClick}
        assignedTags={assignedTags}
        setAssignedTags={setAssignedTags}
        setShowLoader={setShowLoader}
        isAccountLoading={stopLoadingSkeleton ? false : isAccountLoading}
        reRenderNextStep={reRenderNextStep}
        isStayInTouchOpen={isStayInTouchOpen}
        setIsLinkDocument={setIsLinkDocument}
        deleteAssignedTag={deleteAssignedTag}
        getScheduleActivity={getScheduleActivity}
        scheduleActivityData={scheduleActivityData}
        setIsStayInTouchOpen={setIsStayInTouchOpen}
        isScheduleActivityLoading={isScheduleActivityLoading}
      />

      {modal.NOTE?.open ? (
        <AuthGuard isAccessible={createNotePermission}>
          <AddNoteModal
            closeModal={closeModal}
            isOpen={modal.NOTE.open}
            modelRecordId={accountId}
            modelName={ModuleNames.ACCOUNT}
          />
        </AuthGuard>
      ) : null}
      {modal.ATTACHMENT?.open ? (
        <AuthGuard isAccessible={createDocumentPermission}>
          <AddAttachmentModal
            closeModal={closeModal}
            isLink={isLinkDocument}
            modelRecordId={accountId}
            isOpen={modal.ATTACHMENT.open}
            modelName={ModuleNames.ACCOUNT}
          />
        </AuthGuard>
      ) : null}
      {modal.TAG?.open ? (
        <AuthGuard isAccessible={tagForAccountPermission}>
          <AssignTagModal
            closeModal={closeModal}
            isOpen={modal.TAG?.open}
            modelRecordId={accountId}
            assignedTags={assignedTags}
            setAssignedTags={setAssignedTags}
            modelName={ModuleNames.ACCOUNT}
            getAssignedTags={getAssignedTags}
            deleteAssignedTag={deleteAssignedTag}
            editTagsPermission={tagForAccountPermission}
          />
        </AuthGuard>
      ) : null}
      {modal.ACTIVITY?.open && accountData?.account?.id && (
        <AuthGuard isAccessible={createActivityPermission}>
          <AddActivityModal
            isOpen={modal.ACTIVITY?.open}
            closeModal={closeModal}
            entityData={{
              id: accountData?.account?.id,
              name: accountData?.account?.name || '',
              type: ModuleNames.ACCOUNT,
            }}
            relatedEntityData={{
              ...(accountData?.account?.AccountContacts?.[0]?.contact_id && {
                contact: {
                  id: accountData?.account?.AccountContacts?.[0]?.contact_id,
                  name:
                    accountData?.account?.AccountContacts?.[0]?.contact?.name ||
                    '',
                  email:
                    accountData?.account?.AccountContacts?.[0]?.contact
                      ?.emails[0]?.value || '',
                },
              }),
            }}
            onAdd={() => setReRenderNextStep(reRenderNextStep + 1)}
          />
        </AuthGuard>
      )}

      {modal.EDIT_ACTIVITY?.open && modal.EDIT_ACTIVITY.id ? (
        <EditActivityModal
          closeModal={closeModal}
          id={modal.EDIT_ACTIVITY.id}
          isOpen={modal.EDIT_ACTIVITY?.open}
          onEdit={() => setReRenderNextStep(reRenderNextStep + 1)}
        />
      ) : null}
    </>
  ) : null;
};

const useGetAssignedTags = (
  accountId: number | null,
  setAssignedTags: React.Dispatch<React.SetStateAction<AssignTagsProps>>,
  assignedTags: AssignTagsProps
) => {
  const [getAssignedTagByModelRecordId] =
    useLazyGetAssignedTagByModelRecordIdQuery();

  const getAssignedTags = async () => {
    if (accountId) {
      const { data, error } = await getAssignedTagByModelRecordId(
        {
          modelName: TagPermissions.ACCOUNT,
          id: accountId,
          params: {
            select: 'tag',
            'q[model_name]': ModuleNames.ACCOUNT,
          },
        },
        true
      );

      if (data && !error) {
        setAssignedTags({ list: data?.rows, total: data?.count });
      }
    }
  };

  return {
    getAssignedTags,
    assignedTags,
  };
};

const useDeleteAssignedTags = (
  accountId: number | null,
  getAssignedTags: () => Promise<void>,
  setAssignedTags: React.Dispatch<React.SetStateAction<AssignTagsProps>>,
  assignedTags: AssignTagsProps
) => {
  const dispatch = useDispatch();
  const [assignTag] = useAssignTagMutation();

  const deleteAssignedTag = async (deletedId: number, tagDetail?: tag) => {
    const filteredArray = assignedTags.list.filter((obj) => {
      return obj.tag.id !== tagDetail?.id && obj.tag.name !== tagDetail?.name;
    });
    setAssignedTags({ list: filteredArray, total: filteredArray.length });
    callAssignTagAPI(deletedId, accountId || 0);
  };

  const callAssignTagAPI = async (deletedId: number, account_id: number) => {
    const data = await assignTag({
      id: account_id,
      data: {
        modelName: ModuleNames.ACCOUNT,
        tags: { deletedTagIds: [deletedId] },
        message: ToastMsg.common.deleteTag,
      },
    });
    if (!('error' in data)) {
      dispatch(setLoadTimeLines({ timeline: true }));
      getAssignedTags();
    }
  };

  return {
    deleteAssignedTag,
  };
};

const AccountDetailsComp = (props: AccountDetailsCompPropsType) => {
  const {
    accountData,
    parentChildData,
    isParentChildLoading,
    accountId,
    assignedTags,
    setAssignedTags,
    deleteAssignedTag,
    getScheduleActivity,
    isAccountLoading,
    isScheduleActivityLoading,
    isStayInTouchOpen,
    onEditClick,
    reRenderNextStep,
    scheduleActivityData,
    setIsLinkDocument,
    setIsStayInTouchOpen,
    setModal,
    setShowLoader,
    tab,
  } = props;

  const { updateAccountPermission, tagForAccountPermission } = usePermission();

  return isAccountLoading ? (
    <AccountDetailSkeleton />
  ) : (
    <div className="detailsPageNew account__details__page">
      <div className="detailsPage__action__breadcrumbs flex flex-wrap content-start justify-between">
        <Breadcrumbs path={BREAD_CRUMB.accountDetails} />
        <AuthGuard isAccessible={updateAccountPermission}>
          <div className="action__bar inline-flex items-start md:w-full md:justify-end sm:hidden">
            <div className="edit__lead__btn">
              <DetailHeaderEdit onclick={() => onEditClick(accountId)} />
            </div>
            <FollowUnFollow
              entityData={accountData.account}
              entityId={accountId}
              moduleName={ModuleNames.ACCOUNT}
            />
            {accountData.account.id && (
              <StayInTouch
                model_record_id={accountId}
                model_name={POLYMORPHIC_MODELS.ACCOUNT}
                isStayInTouchOpen={isStayInTouchOpen}
                setIsStayInTouchOpen={(value) => setIsStayInTouchOpen(value)}
                scheduleActivityData={scheduleActivityData}
                isScheduleActivityLoading={isScheduleActivityLoading}
                getScheduleActivity={getScheduleActivity}
              />
            )}
          </div>
        </AuthGuard>
      </div>
      {accountData.account.id && (
        <AccountDetailHeader
          parentChildData={parentChildData}
          isParentChildLoading={isParentChildLoading}
          accountData={accountData}
          assignedTags={assignedTags}
          setAssignedTags={setAssignedTags}
          deleteAssignedTag={deleteAssignedTag}
          setIsLinkDocument={setIsLinkDocument}
          setModal={setModal}
          editTagsPermission={tagForAccountPermission}
          onEditClick={onEditClick}
          isStayInTouchOpen={isStayInTouchOpen}
          setIsStayInTouchOpen={setIsStayInTouchOpen}
          scheduleActivityData={scheduleActivityData}
          isScheduleActivityLoading={isScheduleActivityLoading}
          getScheduleActivity={getScheduleActivity}
        />
      )}

      {accountData.account.id && (
        <NextSteps
          key={`${accountData?.account?.name},${reRenderNextStep}`}
          id={accountId}
          moduleName={ModuleNames.ACCOUNT}
        />
      )}
      <Tabs tabs={LEAD_TABS} />
      {accountData.account.id &&
        renderSection({
          parentChildData,
          setShowLoader,
          tab,
          id: accountId,
          isAccountLoading,
          setIsStayInTouchOpen,
          scheduleActivityData,
          accountData,
          getScheduleActivity,
          isScheduleActivityLoading,
        })}
    </div>
  );
};

const renderSection = (sectionProps: AccountDetailsSectionPropsType) => {
  const {
    id,
    tab,
    scheduleActivityData,
    setIsStayInTouchOpen,
    setShowLoader,
    isAccountLoading,
    accountData,
    getScheduleActivity,
    isScheduleActivityLoading,
    parentChildData,
  } = sectionProps;
  switch (tab) {
    case TAB.INFO:
      return (
        <AccountInfo
          parentChildData={parentChildData}
          isScheduleActivityLoading={isScheduleActivityLoading}
          accountData={accountData}
          setShowLoader={setShowLoader}
          isLoading={isAccountLoading}
          setIsStayInTouchOpen={setIsStayInTouchOpen}
          scheduleActivityData={scheduleActivityData}
          getScheduleActivity={getScheduleActivity}
        />
      );
    case TAB.TIMELINE:
      return (
        <Timeline
          modelName={TimelineModelName.ACCOUNT}
          modelRecordIds={[+id]}
          related_contacts={accountData.account.AccountContacts?.map(
            (item) => item.contact
          )}
        />
      );
    default:
  }
};

export default AccountDetails;
