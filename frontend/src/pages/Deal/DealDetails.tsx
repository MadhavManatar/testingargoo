// ** Import Packages ** //
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// ** Redux ** //
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Components ** //
import NextSteps from 'components/EntityDetails/NextSteps';
import Tabs from 'components/EntityDetails/Tabs';
import Timeline from 'components/EntityDetails/Timeline';
import AddActivityModal from 'pages/Activity/components/Modal/AddActivityModal';
import AuthGuard from 'pages/auth/components/AuthGuard';
import DealDetailHeader from './components/detail/DealDetailHeader';
import DealDetailStages from './components/detail/DealDetailStages';
import DealDetailTopActionHeader from './components/detail/DealDetailTopActionHeader';
import DealInfo from './components/detail/DealInfo';

// ** Hook-Services ** //
import { useGetScheduleActivity } from 'components/EntityDetails/StayInTouch/hook/useGetScheduleActivity';
import { useGetDealDetails } from './hooks/useDealService';

// ** Constants ** //
import { ModalType, TAB } from 'components/EntityDetails/constant';
import { Tab as EmailTab } from 'constant/emailTemplate.constant';
import { MODULE } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  ActivityPermissions,
  BasicPermissionTypes,
  ModuleNames,
  POLYMORPHIC_MODELS,
  TagPermissions,
} from 'constant/permissions.constant';
import { TimelineModelName } from 'constant/timeline.constant';
import { DEAL_TABS } from 'pages/Contact/constant';

// ** Types **
import { scheduleActivityResponse } from 'components/EntityDetails/StayInTouch/types/stay-in-touch.type';
import { EntityModalState, HeaderInfo } from 'components/EntityDetails/types';
import { DealResponseType } from './types/deals.types';

// ** Others **
import { convertNumberOrNull } from 'utils/util';
import DealDetailSkeleton from './skeletons/DealDetailSkeleton';
import { getTab } from 'redux/slices/entityDetailSlice';
import {
  QuickEntry,
  SetQuickPopupAction,
  setQuickPopup,
} from 'redux/slices/quickPopupDefaultSlice';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';
import {
  SetEmailInsertAction,
  setEmailInsertField,
} from 'redux/slices/emailInsertField';
import useDateColorCal from './hooks/useClosingDateColorCal';

const DealDetails = () => {
  // ** Hooks ** //
  const { id } = useParams();
  const navigate = useNavigate();
  const dealId = convertNumberOrNull(id);
  const currentUser = useSelector(getCurrentUser);
  const tab = useSelector(getTab);
  const dispatch = useDispatch();

  // ** States ** //
  const [isStayInTouchOpen, setIsStayInTouchOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<EntityModalState>({
    [ModalType.TAG]: { open: false },
    [ModalType.NOTE]: { open: false },
    [ModalType.ATTACHMENT]: { open: false },
    [ModalType.ACTIVITY]: { open: false },
  });
  const [reRenderOnStage, setReRenderOnStage] = useState<boolean>(false);
  const [reRenderNextStep, setReRenderNextStep] = useState<number>(0);
  const [dealClosingDateData, setDealClosingDateData] = useState<{
    time_frame: number;
    neutral_color: string;
    warning_color: string;
    passed_due_color: string;
  }>({
    time_frame: 7,
    neutral_color: '#7EA838',
    warning_color: '#F78310',
    passed_due_color: '#e70e02',
  });
  const [stopLoadingSkeleton, setStopLoadingSkeleton] =
    useState<boolean>(false);

  // ** APIS **
  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();

  // ** Custom Hooks ** //
  const {
    dealData,
    getDealDetail,
    setDealData,
    isLoading,
    isShowMainLoader,
    setShowMainLoader,
  } = useGetDealDetails({
    dealId,
    setStopLoadingSkeleton,
  });
  const {
    getScheduleActivity,
    scheduleActivityData,
    isScheduleActivityLoading,
  } = useGetScheduleActivity();
  const { dealClosingDateDataCal } = useDateColorCal();
  useEffect(() => {
    if (dealId) {
      getScheduleActivity(dealId);
    }
  }, [dealId]);

  useEffect(() => {
    setStopLoadingSkeleton(false);
    // ** Store Deal in the Redux for quick Popup default Value
    const state_data: SetQuickPopupAction = {
      entity: QuickEntry.DEAL,
      data: {
        id: dealData.lead?.id,
        name: dealData.lead?.name,
      },
    };
    dispatch(setQuickPopup(state_data));
    // ** Store Account in the Redux for quick Popup default Value
    const state_data_account: SetQuickPopupAction = {
      entity: QuickEntry.ACCOUNT,
      data: {
        id: dealData.lead?.related_account?.id,
        name: dealData.lead?.related_account?.name,
      },
    };
    dispatch(setQuickPopup(state_data_account));
    // ** Store Contact in the Redux for quick Popup default Value
    const primaryContact = dealData.lead?.related_contacts?.find(
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
    const currentStage = dealData.lead?.deal_stage_history?.find(
      (val) => val.isCurrentActive
    );
    const relatedContact = dealData.lead?.related_contacts?.find(
      (val) => val.is_primary
    );
    const emailInsertField: SetEmailInsertAction = {
      entity: EmailTab.DEAL,
      data: {
        id: dealData.lead?.id || 0,
        deal_name: dealData?.lead?.name || '',
        deal_owner:
          `${dealData?.lead?.lead_owner?.first_name} ${dealData?.lead?.lead_owner?.last_name}` ||
          '',
        deal_related_account: dealData.lead?.related_account?.name || '',
        deal_related_contact: relatedContact?.contact?.name || '',
        deal_value: dealData.lead?.deal_value || '',
        closing_date: dealData.lead?.closing_date || '',
        pipeline: dealData.lead?.pipeline?.name || '',
        pipeline_stage: currentStage?.stage.name || '',
      },
    };
    dispatch(setEmailInsertField(emailInsertField));
  }, [dealData.lead]);

  useEffect(() => {
    if (dealId) {
      getDealDetail(dealId);
      setDealData({ ...dealData });
    } else {
      navigate(PRIVATE_NAVIGATION.deals.view);
    }
    getDealClosingDateSettings();
  }, [dealId]);

  useEffect(() => {
    if (reRenderOnStage && dealId) {
      getDealDetail(dealId);
      setDealData({ ...dealData });
      setReRenderOnStage(false);
    }
  }, [reRenderOnStage]);

  // ** functions ** //
  const closeModal = (EmailModalType: ModalType) => {
    setModal((pre) => ({ ...pre, [EmailModalType]: { open: false } }));
  };

  const getDealClosingDateSettings = async () => {
    const { data } = await getGeneralSetting(
      {
        params: {
          'q[key][in]': `${[
            'deal_closing_date_color_settings_time_frame',
            'deal_closing_date_color_settings_neutral_color',
            'deal_closing_date_color_settings_warning_color',
            'deal_closing_date_color_settings_passed_due_color',
          ]}`,
          'q[model_name]': POLYMORPHIC_MODELS.USER,
          'q[model_record_id]': currentUser?.id,
          module: ModuleNames.DEAL,
        },
      },
      true
    );

    if (data?.length) {
      const closingData = dealClosingDateDataCal(data);
      setDealClosingDateData(closingData);
      return closingData;
    }
  };

  const headerInfo: HeaderInfo = {
    module: MODULE.Deal,
    email:
      (dealData?.lead?.related_contacts || [])
        .filter((val) => val.is_primary)[0]
        ?.contact?.emails?.filter((val) => val.is_primary)[0]?.value || '',
    phone: dealData?.lead?.related_contacts
      ?.find((obj) => obj.is_primary)
      ?.contact?.phones.find((obj) => obj.is_primary)
      ?.value?.toString(),
    tagPermission: TagPermissions.DEAL,
    activityPermission: ActivityPermissions.DEAL,
    title1: dealData?.lead?.name || '',
    title2:
      (dealData?.lead?.related_contacts || []).filter(
        (val) => val.is_primary
      )[0]?.contact?.name || '',
    title3:
      (dealData?.lead?.related_contacts || []).filter(
        (val) => val.is_primary
      )[0]?.contact?.job_role || '',
    title4: dealData?.lead?.related_account?.name || '',
  };

  return dealId ? (
    <>
      {!stopLoadingSkeleton &&
      isLoading &&
      isScheduleActivityLoading &&
      isShowMainLoader ? (
        <DealDetailSkeleton />
      ) : (
        <div className="detailsPageNew deal__details__page">
          <DealDetailTopActionHeader
            dealId={dealId}
            dealDetails={dealData.lead}
            setReRenderOnStage={setReRenderOnStage}
            isStayInTouchOpen={isStayInTouchOpen}
            setIsStayInTouchOpen={(value) => {
              setIsStayInTouchOpen(value);
            }}
            scheduleActivityData={scheduleActivityData}
            isScheduleActivityLoading={isScheduleActivityLoading}
            getScheduleActivity={getScheduleActivity}
          />

          <DealDetailStages
            {...{
              dealData,
              isShowMainLoader,
              reRenderOnStage,
              setReRenderOnStage,
              setShowMainLoader,
            }}
          />

          <DealDetailHeader
            closeModal={closeModal}
            dealId={dealId}
            modal={modal}
            dealData={dealData.lead}
            setModal={setModal}
            dealClosingDateData={dealClosingDateData}
            headerInfo={headerInfo}
            getScheduleActivity={getScheduleActivity}
            isScheduleActivityLoading={isScheduleActivityLoading}
            isStayInTouchOpen={isStayInTouchOpen}
            setIsStayInTouchOpen={setIsStayInTouchOpen}
            scheduleActivityData={scheduleActivityData}
            setReRenderOnStage={setReRenderOnStage}
            reRenderOnStage={reRenderOnStage}
          />

          {dealData?.lead?.name && (
            <NextSteps
              key={`${dealData?.lead?.name},${reRenderNextStep}`}
              id={dealId}
              moduleName={ModuleNames.DEAL}
            />
          )}

          <Tabs tabs={DEAL_TABS} />
          {renderSection({
            isShowMainLoader,
            setShowMainLoader,
            dealId,
            tab,
            dealData,
            isLoading,
            scheduleActivityData,
            setIsStayInTouchOpen,
            getScheduleActivity,
            isScheduleActivityLoading,
          })}
        </div>
      )}

      {modal.ACTIVITY?.open && dealData?.lead?.id ? (
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
            closeModal={() => closeModal(ModalType.ACTIVITY)}
            entityData={{
              id: dealData?.lead?.id,
              name: dealData?.lead?.name || '',
              type: ModuleNames.DEAL,
            }}
            relatedEntityData={{
              ...(dealData?.lead?.related_contacts?.[0]?.contact?.id && {
                contact: {
                  id: dealData?.lead?.related_contacts[0]?.contact?.id,
                  name:
                    dealData?.lead?.related_contacts[0]?.contact?.name || '',
                },
              }),
              ...(dealData?.lead?.related_account?.id && {
                account: {
                  id: dealData?.lead?.related_account?.id,
                  name: dealData?.lead?.related_account?.name || '',
                },
              }),
            }}
            onAdd={() => setReRenderNextStep(reRenderNextStep + 1)}
          />
        </AuthGuard>
      ) : null}
    </>
  ) : null;
};

type SectionProps = {
  tab: TAB;
  dealId: number;
  dealData: DealResponseType;
  isLoading: boolean;
  scheduleActivityData: scheduleActivityResponse;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMainLoader: React.Dispatch<React.SetStateAction<boolean>>;
  isShowMainLoader: boolean;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
};

const renderSection = (sectionProps: SectionProps) => {
  const {
    dealId,
    tab,
    dealData,
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
        <DealInfo
          isShowMainLoader={isShowMainLoader}
          setShowMainLoader={setShowMainLoader}
          dealData={dealData}
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
          modelName={TimelineModelName.DEAL}
          modelRecordIds={[+dealId]}
          related_contacts={(dealData?.lead?.related_contacts || [])?.map(
            (item) => item.contact
          )}
        />
      );
    default:
  }
};

export default DealDetails;
