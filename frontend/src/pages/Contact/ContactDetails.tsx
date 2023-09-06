// ** Import Packages **
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// ** Redux **
import { getTab } from 'redux/slices/entityDetailSlice';

// ** Components **
import { Tab as EmailTab } from 'constant/emailTemplate.constant';
import RedirectToGoogleMap from 'components/Address/components/RedirectToGoogleMap';
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import NextSteps from 'components/EntityDetails/NextSteps';
import StayInTouch from 'components/EntityDetails/StayInTouch';
import Tabs from 'components/EntityDetails/Tabs';
import Timeline from 'components/EntityDetails/Timeline';
import { ModalType, TAB } from 'components/EntityDetails/constant';
import AddActivityModal from 'pages/Activity/components/Modal/AddActivityModal';
import ContactDetailHeader from 'pages/Contact/components/detail/ContactDetailHeader';
import AuthGuard from 'pages/auth/components/AuthGuard';
import ContactInfo from './components/detail/ContactInfo';
import ContactDetailSkeleton from './skeleton/ContactDetailSkeleton';

// ** Hooks **
import { useGetScheduleActivity } from 'components/EntityDetails/StayInTouch/hook/useGetScheduleActivity';
import usePermission from 'hooks/usePermission';
import { useGetContactDetails } from './hooks/useContactService';

// ** Types **
import { EntityModalState, HeaderInfo } from 'components/EntityDetails/types';
import { ContactDetailsSectionPropsType } from './types/contacts.types';

// ** Constants **
import { BREAD_CRUMB, MODULE } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { TimelineModelName } from 'constant/timeline.constant';
import { CONTACT_TABS } from './constant';

// ** Util **
import { convertNumberOrNull, setUrlParams } from 'utils/util';
import FollowUnFollow from 'pages/Dashboard/components/FollowUnFollow';
import {
  QuickEntry,
  SetQuickPopupAction,
  setQuickPopup,
} from 'redux/slices/quickPopupDefaultSlice';
import {
  SetEmailInsertAction,
  setEmailInsertField,
} from 'redux/slices/emailInsertField';
import DetailHeaderEdit from 'components/detail-components/detail-header-edit';

const ContactDetails = () => {
  // ** Hooks **
  const params = useParams();
  const navigate = useNavigate();
  const tab = useSelector(getTab);
  const contactId = convertNumberOrNull(params.id);
  const dispatch = useDispatch();

  // ** states **
  const [reRenderNextStep, setReRenderNextStep] = useState<number>(0);
  const [isStayInTouchOpen, setIsStayInTouchOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<EntityModalState>({
    [ModalType.TAG]: { open: false },
    [ModalType.NOTE]: { open: false },
    [ModalType.ATTACHMENT]: { open: false },
    [ModalType.ACTIVITY]: { open: false },
  });

  // ** Custom Hook **
  const { updateContactPermission } = usePermission();
  const [stopLoadingSkeleton, setStopLoadingSkeleton] =
    useState<boolean>(false);
  const { contactData, isLoading, isShowMainLoader, setShowMainLoader } =
    useGetContactDetails({
      id: contactId,
      setStopLoadingSkeleton,
    });

  const { related_accounts } = contactData.contact;

  const { address1, address2, zip, state, city, country } = contactData.contact;

  const contact_address =
    address1 || address2 || city || state?.state_code || country?.name || zip
      ? {
          address1: address1 || '',
          address2: address2 || '',
          city: city || '',
          country: country?.name || '',
          state: state?.state_code || '',
          zip: zip || '',
        }
      : null;

  const pr_account_address = {
    address1:
      related_accounts?.find((ac) => ac?.is_primary)?.account?.address1 || '',
    address2:
      related_accounts?.find((ac) => ac?.is_primary)?.account?.address2 || '',
    city:
      related_accounts?.find((ac) => ac?.is_primary)?.account?.city?.name || '',
    country:
      related_accounts?.find((ac) => ac?.is_primary)?.account?.country?.name ||
      '',
    state:
      related_accounts?.find((ac) => ac?.is_primary)?.account?.state
        ?.state_code || '',
    zip: related_accounts?.find((ac) => ac?.is_primary)?.account?.zip || '',
  };

  const {
    getScheduleActivity,
    scheduleActivityData,
    isScheduleActivityLoading,
  } = useGetScheduleActivity();

  useEffect(() => {
    if (contactId) {
      getScheduleActivity(contactId);
    }
  }, []);

  useEffect(() => {
    const related_account = contactData?.contact?.related_accounts?.[0] || [];
    if (contactData.contact.id) {
      setStopLoadingSkeleton(false);
      // ** Store Contact in the Redux for quick Popup default Value
      const state_data: SetQuickPopupAction = {
        entity: QuickEntry.CONTACT,
        data: {
          id: contactData?.contact.id,
          name: contactData?.contact.name,
          jobRole: related_account?.job_role || contactData?.contact.job_role,
        },
      };
      dispatch(setQuickPopup(state_data));
      // ** Store Account in the Redux for quick Popup default Value
      const state_data_account: SetQuickPopupAction = {
        entity: QuickEntry.ACCOUNT,
        data: {
          id: related_account?.account?.id,
          name: related_account?.account?.name,
          jobRole: related_account?.job_role,
        },
      };
      dispatch(setQuickPopup(state_data_account));
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
      // ** Store For Email Insert in the Redux for quick Popup default Value
      const primaryEmail = contactData.contact?.emails?.find(
        (val) => val.is_primary
      );
      const primaryPhone = contactData.contact?.phones?.find(
        (val) => val.is_primary
      );
      const primaryAccount = contactData.contact?.related_accounts?.find(
        (val) => val.is_primary
      );
      const emailInsertField: SetEmailInsertAction = {
        entity: EmailTab.CONTACT,
        data: {
          id: contactData.contact.id || 0,
          contact_name: contactData.contact?.name || '',
          contact_owner: contactData.contact?.contact_owner?.full_name || '',
          contact_account_name: primaryAccount?.account?.name || '',
          contact_email: primaryEmail?.value || '',
          contact_phone: primaryPhone?.value || '',
          job_role: contactData.contact?.job_role || '',
        },
      };
      dispatch(setEmailInsertField(emailInsertField));
    }
  }, [contactData.contact.id]);

  // make obj for common header toolbar
  const headerInfo: HeaderInfo = {
    module: MODULE.Contact,
    email:
      (contactData?.contact?.emails || []).find((val) => val?.is_primary)
        ?.value ||
      contactData?.contact?.related_accounts
        ?.find((acc) => acc?.is_primary)
        ?.account?.emails?.find((em: { isPrimary: boolean }) => em?.isPrimary)
        ?.value ||
      '',
    phone: (
      (contactData?.contact?.phones || []).find((val) => val.is_primary)
        ?.value ||
      contactData?.contact?.related_accounts
        ?.find((acc) => acc?.is_primary)
        ?.account?.phones?.find((em: { isPrimary: boolean }) => em?.isPrimary)
        ?.value ||
      ''
    ).toString(),
    phoneType:
      (contactData?.contact?.phones || []).find((val) => val.is_primary)
        ?.phoneType || '',
    title1: contactData?.contact.name || '',
    title2: contactData.contact.job_role || '',
    title3: (
      <RedirectToGoogleMap address={contact_address || pr_account_address} />
    ),
  };

  const closeModal = (EmailModalType: ModalType) => {
    setModal((pre) => ({ ...pre, [EmailModalType]: { open: false } }));
  };

  return contactId ? (
    <>
      {!stopLoadingSkeleton &&
      (isLoading || isScheduleActivityLoading) &&
      isShowMainLoader ? (
        <ContactDetailSkeleton />
      ) : (
        <div className="detailsPageNew contact__details__page">
          <div className="detailsPage__action__breadcrumbs flex flex-wrap content-start justify-between">
            <Breadcrumbs path={BREAD_CRUMB.contactDetails} />
            <div className="action__bar inline-flex items-start md:w-full md:justify-end sm:hidden">
              <AuthGuard isAccessible={updateContactPermission}>
                <>
                  <div className="edit__lead__btn">
                    <DetailHeaderEdit
                      onclick={() =>
                        navigate(
                          setUrlParams(
                            PRIVATE_NAVIGATION.contacts.edit,
                            contactId
                          )
                        )
                      }
                    />
                  </div>
                  <FollowUnFollow
                    entityData={contactData.contact}
                    entityId={contactId}
                    moduleName={ModuleNames.CONTACT}
                  />
                  <StayInTouch
                    model_record_id={contactId}
                    model_name={POLYMORPHIC_MODELS.CONTACT}
                    isStayInTouchOpen={isStayInTouchOpen}
                    setIsStayInTouchOpen={(value) => {
                      setIsStayInTouchOpen(value);
                      setShowMainLoader(false);
                    }}
                    scheduleActivityData={scheduleActivityData}
                    isScheduleActivityLoading={isScheduleActivityLoading}
                    getScheduleActivity={getScheduleActivity}
                  />
                </>
              </AuthGuard>
            </div>
          </div>

          <ContactDetailHeader
            id={contactId}
            modal={modal}
            closeModal={closeModal}
            headerInfo={headerInfo}
            setModal={setModal}
            contactData={contactData}
          />
          <AuthGuard isAccessible={updateContactPermission}>
            <div className="details__page__sticky__btns py-[15px] px-[22px] rounded-t-[20px] shadow-[0px_4px_21px_5px_#00000014] fixed bottom-0 left-0 w-full bg-white z-[4] justify-end items-center hidden sm:flex sm:px-[15px]">
              <Button className='i__Button mr-[10px] bg-[#E6E6E6] py-[4px] px-[17px] pr-[37px] text-black text-[14px] font-biotif__Medium rounded-[6px] h-[32px] relative before:content-[""] before:w-[8px] before:h-[8px] before:border-[2px] before:border-black before:absolute before:top-[10px] before:right-[12px] before:rotate-45 before:!border-t-0 before:!border-l-0 after:content-[""] after:absolute after:top-[9px] after:right-[28px] after:w-[1px] after:h-[14px] after:bg-black hover:text-white hover:before:border-white hover:after:bg-white'>
                Follow
              </Button>
              <StayInTouch
                model_record_id={contactId}
                model_name={POLYMORPHIC_MODELS.CONTACT}
                isStayInTouchOpen={isStayInTouchOpen}
                setIsStayInTouchOpen={(value) => {
                  setIsStayInTouchOpen(value);
                }}
                scheduleActivityData={scheduleActivityData}
                isScheduleActivityLoading={isScheduleActivityLoading}
                getScheduleActivity={getScheduleActivity}
              />
            </div>
          </AuthGuard>

          <NextSteps
            key={`${contactData?.contact?.name},${reRenderNextStep}`}
            id={contactId}
            moduleName={ModuleNames.CONTACT}
          />

          <Tabs tabs={CONTACT_TABS} />
          {renderSection({
            tab,
            id: contactId,
            contactData,
            isLoading,
            setIsStayInTouchOpen,
            scheduleActivityData,
            setShowMainLoader,
            getScheduleActivity,
            isScheduleActivityLoading,
          })}
        </div>
      )}

      {modal.ACTIVITY?.open && (
        <AddActivityModal
          isOpen={modal.ACTIVITY.open}
          closeModal={() => closeModal(ModalType.ACTIVITY)}
          entityData={{
            id: contactData?.contact?.id,
            name: contactData?.contact?.name || '',
            type: ModuleNames.CONTACT,
          }}
          relatedEntityData={{
            ...(contactData?.contact?.related_accounts?.[0]?.account.id && {
              account: {
                id: contactData?.contact?.related_accounts?.[0]?.account.id,
                name: contactData?.contact?.related_accounts?.[0]?.account.name,
              },
            }),
          }}
          onAdd={() => setReRenderNextStep(reRenderNextStep + 1)}
        />
      )}
    </>
  ) : (
    <></>
  );
};

const renderSection = (sectionProps: ContactDetailsSectionPropsType) => {
  const {
    contactData,
    id,
    tab,
    isLoading,
    setIsStayInTouchOpen,
    scheduleActivityData,
    getScheduleActivity,
    setShowMainLoader,
    isScheduleActivityLoading,
  } = sectionProps;

  switch (tab) {
    case TAB.INFO:
      return (
        <ContactInfo
          contactData={contactData}
          isLoading={isLoading}
          setIsStayInTouchOpen={setIsStayInTouchOpen}
          scheduleActivityData={scheduleActivityData}
          setShowMainLoader={setShowMainLoader}
          getScheduleActivity={getScheduleActivity}
          isScheduleActivityLoading={isScheduleActivityLoading}
        />
      );
    case TAB.TIMELINE:
      return (
        <Timeline
          modelName={TimelineModelName.CONTACT}
          modelRecordIds={[+id]}
        />
      );
    default:
  }
};

export default ContactDetails;
