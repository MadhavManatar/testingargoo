// ** Import Packages **
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// ** Redux **
import {
  getIsAccountQuickAdd,
  setLoadTimeLines,
} from 'redux/slices/commonSlice';
import { getTab } from 'redux/slices/entityDetailSlice';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
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
import LeadDetailSkeleton from '../skeletons/LeadDetailSkeleton';
import LeadDetailHeader from './detail/LeadDetailHeader';
import LeadInfo from './detail/LeadInfo';

// ** Hook **
import { useGetScheduleActivity } from 'components/EntityDetails/StayInTouch/hook/useGetScheduleActivity';
import usePermission from 'hooks/usePermission';
import { useGetLeadDetails } from '../hooks/useLeadService';

// ** Service **
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';

// ** Types **
import {
  AssignTagsProps,
  EntityModalState,
} from 'components/EntityDetails/types';
import { Option } from 'components/FormField/types/formField.types';
import { tag } from 'components/detail-components/AssignTags/types/assignTags.type';
import {
  LeadDetailsSectionPropsType,
  LeadDetailsType,
} from '../types/lead.type';

// ** Constants **
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  BasicPermissionTypes,
  MODULE_PERMISSION,
  ModuleNames,
  POLYMORPHIC_MODELS,
  TagPermissions,
} from 'constant/permissions.constant';
import { TimelineModelName } from 'constant/timeline.constant';
import { ToastMsg } from 'constant/toast.constants';
import { LEAD_TABS } from 'pages/Contact/constant';

// ** Utils **
import { convertNumberOrNull, setUrlParams } from 'utils/util';
import FollowUnFollow from 'pages/Dashboard/components/FollowUnFollow';
import DetailHeaderEdit from 'components/detail-components/detail-header-edit';

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
import { useUpdateLeadMutation } from 'redux/api/leadApi';
import { useLazyGetLeadTempStatusQuery } from 'redux/api/leadTempStatusApi';

const LeadDetails = () => {
  // ** Hooks ** //
  const { id } = useParams();
  const leadId = convertNumberOrNull(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tab = useSelector(getTab);

  // ** states **
  const [stopLoadingSkeleton, setStopLoadingSkeleton] =
    useState<boolean>(false);
  const [isStayInTouchOpen, setIsStayInTouchOpen] = useState<boolean>(false);
  const [reRenderNextStep, setReRenderNextStep] = useState<number>(0);
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
  const [leadStatusOpt, setLeadStatusOpt] = useState<Option[]>([]);

  // ** APIS **
  const [getLeadTempStatusApi, { isLoading: leadTempStatusIsLoading }] =
    useLazyGetLeadTempStatusQuery();
  const [getAssignedTagByModelRecordId] =
    useLazyGetAssignedTagByModelRecordIdQuery();
  const [assignTag] = useAssignTagMutation();
  const [updateLeadByIdAPI] = useUpdateLeadMutation();

  // ** Custom Hooks **
  const { updateLeadPermission, createDealPermission, tagForLeadPermission } =
    usePermission();
  const isAccountQuickAdd: boolean | undefined =
    useSelector(getIsAccountQuickAdd);
  const {
    leadData,
    isLoading,
    getLeadDetail,
    setShowMainLoader,
    isShowMainLoader,
  } = useGetLeadDetails({ leadId, setStopLoadingSkeleton });

  const {
    getScheduleActivity,
    scheduleActivityData,
    isScheduleActivityLoading,
  } = useGetScheduleActivity();

  useEffect(() => {
    if (leadId) {
      getScheduleActivity(leadId);
    }
  }, []);

  useEffect(() => {
    if (leadData.lead.lead_temperature) {
      const leadTemp = leadData.lead.lead_temperature;
      if (leadTemp?.id && leadTemp?.name) {
        const leadIndex = leadStatusOpt.find(
          (option: Option) => option.value === leadTemp.id
        );
        if (!leadIndex) {
          leadStatusOpt.unshift({
            label: leadTemp.name,
            value: leadTemp.id,
            color: leadTemp.color,
          });
        }
      }
    }
  }, [leadData.lead.lead_temperature]);

  useEffect(() => {
    setStopLoadingSkeleton(false);
    // ** Store Deal in the Redux for quick Popup default Value
    const state_data: SetQuickPopupAction = {
      entity: QuickEntry.LEAD,
      data: {
        id: leadData.lead?.id,
        name: leadData.lead?.name,
      },
    };
    dispatch(setQuickPopup(state_data));
    // ** Store Account in the Redux for quick Popup default Value
    const state_data_account: SetQuickPopupAction = {
      entity: QuickEntry.ACCOUNT,
      data: {
        id: leadData.lead?.related_account?.id,
        name: leadData.lead?.related_account?.name,
      },
    };
    dispatch(setQuickPopup(state_data_account));
    // ** Store Contact in the Redux for quick Popup default Value
    const primaryContact = leadData.lead?.related_contacts?.find(
      (val) => val.is_primary
    );
    const state_data_contact: SetQuickPopupAction = {
      entity: QuickEntry.CONTACT,
      data: {
        id: primaryContact?.contact?.id,
        name: primaryContact?.contact?.name,
      },
    };
    dispatch(setQuickPopup(state_data_contact));
    // ** Store For Email Insert in the Redux for quick Popup default Value
    const relatedContact = leadData.lead?.related_contacts?.find(
      (val) => val.is_primary
    );
    const emailInsertField: SetEmailInsertAction = {
      entity: EmailTab.LEAD,
      data: {
        id: leadData.lead?.id || 0,
        lead_name: leadData.lead?.name || '',
        lead_owner:
          `${leadData.lead?.lead_owner?.first_name} ${leadData.lead?.lead_owner?.last_name}` ||
          '',
        lead_related_account: leadData.lead?.related_account?.name || '',
        lead_related_contact: relatedContact?.contact?.name || '',
        lead_value: leadData.lead?.deal_value || '',
      },
    };
    dispatch(setEmailInsertField(emailInsertField));
  }, [leadData.lead.id]);

  useEffect(() => {
    getData();
    getAssignedTags();
  }, []);

  useEffect(() => {
    if (isAccountQuickAdd && leadId) {
      getLeadDetail(leadId);
    }
  }, [isAccountQuickAdd]);

  const getData = async () => {
    const { data, error } = await getLeadTempStatusApi({
      data: {
        query: {
          ...MODULE_PERMISSION.LEAD.read,
          'q[type]': EntityAttributesEnum.LEAD_TEMP_STATUS,
        },
      },
    });

    if (data && !error) {
      const options = data?.rows?.map((option: LeadDetailsType) => ({
        label: option.name,
        value: option.id,
        color: option.color,
      }));
      setLeadStatusOpt([...options]);
    }
  };

  const getAssignedTags = async () => {
    if (leadId) {
      const { data, error } = await getAssignedTagByModelRecordId(
        {
          modelName: TagPermissions.LEAD,
          id: leadId,
          params: {
            select: 'tag',
            'q[model_name]': ModuleNames.LEAD,
          },
        },
        true
      );

      if (data && !error) {
        setAssignedTags({ list: data?.rows, total: data?.count });
      }
    }
  };

  const updateLeadTemp = async (val: number) => {
    if (val !== leadData.lead.lead_temp_id && leadId) {
      const LeadFormData = new FormData();
      LeadFormData.append('lead_temp_id', `${val}`);
      LeadFormData.append('is_deal', 'false');

      const data = await updateLeadByIdAPI({
        id: leadId,
        data: LeadFormData,
        params: { toastMsg: 'Lead Status Updated Successfully' },
      });

      if ('data' in data && !('error' in data)) {
        setShowMainLoader(false);
        await getLeadDetail(leadId);
        dispatch(setLoadTimeLines({ timeline: true }));
      }
    }
  };

  const deleteAssignedTag = async (deletedId: number, tagDetail?: tag) => {
    const filteredArray = assignedTags.list.filter((obj) => {
      return obj.tag.id !== tagDetail?.id && obj.tag.name !== tagDetail?.name;
    });
    setAssignedTags({ list: filteredArray, total: filteredArray.length });
    const data = await assignTag({
      id: leadId || 0,
      data: {
        modelName: ModuleNames.LEAD,
        tags: { deletedTagIds: [deletedId] },
        message: ToastMsg.common.deleteTag,
      },
    });

    if (data) {
      dispatch(setLoadTimeLines({ timeline: true }));
    } else {
      getAssignedTags();
    }
  };

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

  return leadId ? (
    <>
      {!stopLoadingSkeleton &&
      (isLoading || isScheduleActivityLoading || leadTempStatusIsLoading) &&
      isShowMainLoader ? (
        <LeadDetailSkeleton />
      ) : (
        <div className="detailsPageNew lead__details__page">
          <div className="detailsPage__action__breadcrumbs flex flex-wrap content-start justify-between">
            <Breadcrumbs path={BREAD_CRUMB.leadDetails} />
            <div className="action__bar inline-flex items-start md:w-full md:justify-end sm:hidden">
              <AuthGuard isAccessible={updateLeadPermission}>
                <>
                  <div className="edit__lead__btn">
                    <DetailHeaderEdit
                      onclick={() =>
                        navigate(
                          setUrlParams(PRIVATE_NAVIGATION.leads.edit, leadId)
                        )
                      }
                    />
                  </div>
                  <FollowUnFollow
                    entityData={leadData.lead}
                    entityId={leadId}
                    moduleName={ModuleNames.LEAD}
                  />
                  <StayInTouch
                    model_record_id={leadId}
                    model_name={POLYMORPHIC_MODELS.LEAD}
                    isStayInTouchOpen={isStayInTouchOpen}
                    setIsStayInTouchOpen={(value) => {
                      setIsStayInTouchOpen(value);
                    }}
                    scheduleActivityData={scheduleActivityData}
                    isScheduleActivityLoading={isScheduleActivityLoading}
                    getScheduleActivity={getScheduleActivity}
                  />
                </>
              </AuthGuard>
              <AuthGuard isAccessible={createDealPermission}>
                <Button
                  className="inline-flex bg-primaryColor py-[4px] px-[17px] text-white hover:bg-primaryColor__hoverDark h-[32px] rounded-[6px] mb-[10px]"
                  onClick={() =>
                    navigate(
                      setUrlParams(PRIVATE_NAVIGATION.leads.convert, leadId)
                    )
                  }
                >
                  Convert Lead
                </Button>
              </AuthGuard>
            </div>
          </div>

          <LeadDetailHeader
            leadData={leadData}
            setModal={setModal}
            assignedTags={assignedTags}
            setAssignedTags={setAssignedTags}
            leadStatusOpt={leadStatusOpt}
            updateLeadTemp={updateLeadTemp}
            editTagsPermission={tagForLeadPermission}
            setIsLinkDocument={setIsLinkDocument}
            deleteAssignedTag={deleteAssignedTag}
            getScheduleActivity={getScheduleActivity}
            isScheduleActivityLoading={isScheduleActivityLoading}
            isStayInTouchOpen={isStayInTouchOpen}
            scheduleActivityData={scheduleActivityData}
            setIsStayInTouchOpen={setIsStayInTouchOpen}
          />

          <NextSteps
            key={`${leadData?.lead?.name},${reRenderNextStep}`}
            id={leadId}
            moduleName={ModuleNames.LEAD}
          />
          <Tabs tabs={LEAD_TABS} />

          {renderSection({
            setShowMainLoader,
            tab,
            id: leadId,
            leadData,
            isLoading,
            scheduleActivityData,
            setIsStayInTouchOpen,
            isShowMainLoader,
            getScheduleActivity,
            isScheduleActivityLoading,
          })}
        </div>
      )}

      {modal?.NOTE?.open ? (
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.NOTE,
              type: BasicPermissionTypes.CREATE,
            },
          ]}
        >
          <AddNoteModal
            isOpen={modal.NOTE.open}
            closeModal={closeModal}
            modelName={ModuleNames.LEAD}
            modelRecordId={leadId}
          />
        </AuthGuard>
      ) : null}
      {modal?.ATTACHMENT?.open ? (
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.ATTACHMENT,
              type: BasicPermissionTypes.CREATE,
            },
          ]}
        >
          <AddAttachmentModal
            isOpen={modal.ATTACHMENT.open}
            closeModal={closeModal}
            modelName={ModuleNames.LEAD}
            modelRecordId={leadId}
            isLink={isLinkDocument}
          />
        </AuthGuard>
      ) : null}
      {modal?.TAG?.open ? (
        <AssignTagModal
          setAssignedTags={setAssignedTags}
          modelRecordId={leadId}
          isOpen={modal.TAG.open}
          closeModal={closeModal}
          assignedTags={assignedTags}
          modelName={ModuleNames.LEAD}
          getAssignedTags={getAssignedTags}
          deleteAssignedTag={deleteAssignedTag}
          editTagsPermission={tagForLeadPermission}
        />
      ) : null}
      {modal?.ACTIVITY?.open && leadData?.lead?.id && (
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.ACTIVITY,
              type: BasicPermissionTypes.CREATE,
            },
          ]}
        >
          <AddActivityModal
            isOpen={modal.ACTIVITY.open}
            closeModal={closeModal}
            entityData={{
              id: leadData?.lead?.id,
              name: leadData?.lead?.name || '',
              type: ModuleNames.LEAD,
            }}
            relatedEntityData={{
              ...(leadData?.lead?.related_contacts?.[0]?.contact?.id && {
                contact: {
                  id: leadData?.lead?.related_contacts[0]?.contact?.id,
                  name:
                    leadData?.lead?.related_contacts[0]?.contact?.name || '',
                },
              }),
              ...(leadData?.lead?.related_account?.id && {
                account: {
                  id: leadData?.lead?.related_account?.id,
                  name: leadData?.lead?.related_account?.name || '',
                },
              }),
            }}
            onAdd={() => setReRenderNextStep(reRenderNextStep + 1)}
          />
        </AuthGuard>
      )}
      {modal.EDIT_ACTIVITY?.open && modal?.EDIT_ACTIVITY?.id ? (
        <EditActivityModal
          isOpen={modal.EDIT_ACTIVITY.open}
          closeModal={closeModal}
          id={modal.EDIT_ACTIVITY.id}
          onEdit={() => setReRenderNextStep(reRenderNextStep + 1)}
        />
      ) : null}
    </>
  ) : null;
};

const renderSection = (sectionProps: LeadDetailsSectionPropsType) => {
  const {
    id,
    tab,
    leadData,
    isLoading,
    scheduleActivityData,
    setIsStayInTouchOpen,
    setShowMainLoader,
    isShowMainLoader,
    getScheduleActivity,
    isScheduleActivityLoading,
  } = sectionProps;

  switch (tab) {
    case TAB.INFO:
      return (
        <LeadInfo
          isShowMainLoader={isShowMainLoader}
          setShowMainLoader={setShowMainLoader}
          leadData={leadData}
          isLoading={isLoading}
          scheduleActivityData={scheduleActivityData}
          setIsStayInTouchOpen={setIsStayInTouchOpen}
          getScheduleActivity={getScheduleActivity}
          isScheduleActivityLoading={isScheduleActivityLoading}
        />
      );
    case TAB.TIMELINE:
      return (
        <Timeline
          modelName={TimelineModelName.LEAD}
          modelRecordIds={[+id]}
          related_contacts={(leadData?.lead?.related_contacts || [])?.map(
            (item) => item.contact
          )}
        />
      );
    default:
  }
};

export default LeadDetails;
