// ** Import Packages **
import Tippy from '@tippyjs/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import { TableActionButton } from 'components/Button/TableActionButton';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import Dropdown from 'components/Dropdown';
import EntityCard from 'components/EntityDetails/QuickLookCard/EntityCard';
import StayInTouch from 'components/EntityDetails/StayInTouch';
import Icon from 'components/Icon';
import AssignTagsList from 'components/detail-components/AssignTags/AssignTagsList';
import { DetailHeaderEmail } from 'components/detail-components/detail-header-email';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Hook **
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Types **
import RedirectToGoogleMap from 'components/Address/components/RedirectToGoogleMap';
import { HeaderInfo } from 'components/EntityDetails/types';
import {
  LeadDetailsHeaderProps,
  LeadMobileHeaderProps,
} from '../../types/lead.type';

// ** Constants **
import { ModalType } from 'components/EntityDetails/constant';
import { MODULE } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  ActivityPermissions,
  BasicPermissionTypes,
  ModuleNames,
  POLYMORPHIC_MODELS,
} from 'constant/permissions.constant';

// ** Util **
import { setUrlParams, usCurrencyFormat } from 'utils/util';

// ** Helper **
import { setContactAndMailFunc } from 'pages/Lead/helper/leads.helper';
import DetailHeaderPhone from 'components/detail-components/detail-header-phone';
import DetailHeaderNote from 'components/detail-components/detail-header-note';
import DetailHeaderAttachment from 'components/detail-components/detail-header-attachment';
import DetailHeaderTag from 'components/detail-components/detail-header-tag';
import DetailHeaderActivity from 'components/detail-components/detail-header-activity';
import { IconTypeJson } from 'indexDB/indexdb.type';
import IconAnimation from 'components/IconAnimation';

const LeadDetailHeader = (props: LeadDetailsHeaderProps) => {
  const {
    leadStatusOpt,
    leadData,
    assignedTags,
    setAssignedTags,
    deleteAssignedTag,
    updateLeadTemp,
    setModal,
    setIsLinkDocument,
    editTagsPermission,
    setIsStayInTouchOpen,
    isStayInTouchOpen,
    scheduleActivityData,
    isScheduleActivityLoading,
    getScheduleActivity,
  } = props;

  const { related_contacts, related_account, name, deal_value } = leadData.lead;

  // ** custom hooks **
  const {
    updateLeadPermission,
    readContactPermission,
    readAccountPermission,
    tagForLeadPermission,
  } = usePermission();
  const { isMobileView } = useWindowDimensions();

  const leadTempInfo = leadStatusOpt.find(({ value, color }) =>
    value === leadData?.lead?.lead_temperature?.id ? color : ''
  );

  const setOpenModal = (modalName: ModalType) => {
    setModal((prev) => ({ ...prev, [modalName]: { open: true } }));
  };

  const primaryContact = related_contacts?.find(
    (contactObj) => contactObj?.is_primary
  )?.contact;

  const contactAndMail = setContactAndMailFunc({ leadData: leadData.lead });

  const addressObj =
    primaryContact?.address1 ||
    primaryContact?.address2 ||
    primaryContact?.state?.state_code ||
    primaryContact?.city ||
    primaryContact?.country?.name ||
    primaryContact?.zip
      ? primaryContact
      : related_account;

  const accountCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = accountCardProps;
      const accountPrimaryEmail = (related_account?.emails || [])?.filter(
        (val) => val.isPrimary
      )?.[0]?.value;
      const accountPrimaryPhone = (related_account?.phones || [])?.filter(
        (val) => val.isPrimary
      )?.[0];

      const address = {
        address1: related_account?.address1 || '',
        address2: related_account?.address2 || '',
        state: related_account?.state?.state_code || '',
        city: related_account?.city || '',
        country: related_account?.country?.name || '',
        zip: related_account?.zip || '',
      };

      const checkAddressLength = Object.values(address).find(
        (element) => element
      );

      return (
        <>
          {related_account?.name && Boolean(related_account?.id) && (
            <EntityCard
              modelName={ModuleNames.ACCOUNT}
              {...(!!checkAddressLength && { address })}
              id={related_account?.id as number}
              name={related_account?.name}
              email={accountPrimaryEmail}
              phone={accountPrimaryPhone?.value?.toString()}
              phoneType={accountPrimaryPhone?.phoneType || ''}
              {...{ close, setIsOpen, isOpen }}
            />
          )}
        </>
      );
    },
    [related_account]
  );
  const contactCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = accountCardProps;
      const contactPrimaryEmail = (primaryContact?.emails || [])?.filter(
        (val) => val.is_primary
      )?.[0]?.value;
      const contactPrimaryPhone = (primaryContact?.phones || [])?.filter(
        (val) => val.is_primary
      )?.[0];
      const address = {
        address1: primaryContact?.address1 || '',
        address2: primaryContact?.address2 || '',
        state: primaryContact?.state?.state_code || '',
        city: primaryContact?.city || '',
        country: primaryContact?.country?.name || '',
        zip: primaryContact?.zip || '',
      };

      const checkAddressLength = Object.values(address).find(
        (element) => element
      );

      return (
        <>
          {primaryContact?.name && Boolean(primaryContact?.id) && (
            <EntityCard
              modelName={ModuleNames.CONTACT}
              id={primaryContact?.id}
              name={primaryContact?.name}
              email={contactPrimaryEmail}
              {...(!!checkAddressLength && { address })}
              phone={contactPrimaryPhone?.value?.toString()}
              phoneType={contactPrimaryPhone?.phoneType || ''}
              {...{ close, setIsOpen, isOpen }}
            />
          )}
        </>
      );
    },
    [primaryContact]
  );

  // make obj for common header toolbar
  const headerInfo: HeaderInfo = {
    module: MODULE.Lead,
    activityPermission: ActivityPermissions.LEAD,
    title1: readContactPermission ? (
      primaryContact?.id ? (
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
            {primaryContact?.name}
          </button>
        </Dropdown>
      ) : (
        ''
      )
    ) : (
      ''
    ),

    title2: readAccountPermission ? (
      primaryContact?.job_role ||
      related_account?.name ||
      related_account?.id ? (
        <>
          {primaryContact?.job_role && <span>{primaryContact?.job_role}</span>}
          {related_account?.name && primaryContact?.job_role ? ', ' : ''}
          {related_account?.id && (
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
                {related_account?.name}
              </button>
            </Dropdown>
          )}
        </>
      ) : (
        ''
      )
    ) : (
      ''
    ),
    title3: (
      <RedirectToGoogleMap
        address={{
          address1: addressObj?.address1,
          address2: addressObj?.address2,
          city: addressObj?.city,
          country: addressObj?.country?.name,
          state: addressObj?.state?.name,
          zip: addressObj?.zip,
        }}
      />
    ),
  };

  return isMobileView ? (
    <LeadDetailMobileHeader
      setAssignedTags={setAssignedTags}
      assignedTags={assignedTags}
      contactAndMail={contactAndMail}
      deleteAssignedTag={deleteAssignedTag}
      updateLeadPermission={updateLeadPermission}
      editTagsPermission
      getScheduleActivity={getScheduleActivity}
      headerInfo={headerInfo}
      isScheduleActivityLoading={isScheduleActivityLoading}
      isStayInTouchOpen={isStayInTouchOpen}
      leadData={leadData}
      leadStatusOpt={leadStatusOpt}
      leadTempInfo={leadTempInfo}
      scheduleActivityData={scheduleActivityData}
      setIsLinkDocument={setIsLinkDocument}
      setIsStayInTouchOpen={setIsStayInTouchOpen}
      setModal={setModal}
      setOpenModal={setOpenModal}
      updateLeadTemp={updateLeadTemp}
    />
  ) : (
    <div className="activityInner__topHeader__box flex flex-wrap border border-whiteScreen__BorderColor rounded-[12px] p-[20px] pb-[10px] mb-[20px] sm:hidden">
      <div className="activityType flex flex-wrap content-center justify-center pr-[20px] w-[92px] relative before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[calc(100%_-_26px)] before:bg-whiteScreen__BorderColor">
        <IconAnimation
          iconType="leadsFilledBlueIcon"
          animationIconType={IconTypeJson.Lead}
          className="!w-[60px] !h-[60px] !p-[8px] rounded-[10px] !bg-primaryColor"
        />
        <p className="text-[16px] text-black__TextColor800 font-biotif__Medium text-center w-full mt-[10px] break-words">
          {headerInfo.module}
        </p>
      </div>
      <div className="right w-[calc(100%_-_93px)] pl-[20px] flex flex-wrap justify-between">
        <div className="main__details w-[calc(100%_-_266px)] pr-[20px] xl:w-full xl:pr-0">
          <div className="flex flex-wrap">
            <h3 className="text-black__TextColor800 text-[20px] leading-[26px] font-biotif__Medium mr-[15px] mb-[3px]">
              {name}
            </h3>
            {assignedTags?.list.length ? (
              <div className="badge__wrapper mb-[10px] text-primaryColor">
                <AssignTagsList
                  editTagsPermission={editTagsPermission}
                  assignedTags={assignedTags}
                  setAssignedTags={setAssignedTags}
                  deleteAssignedTag={deleteAssignedTag}
                  setModal={() => setOpenModal(ModalType.TAG)}
                />
              </div>
            ) : null}
          </div>
          {headerInfo?.title1 && (
            <h5 className="text-black__TextColor800 text-[18px] font-biotif__Medium">
              {headerInfo?.title1}
            </h5>
          )}
          {headerInfo.title2 && (
            <div className="flex flex-wrap designation__wrapper">
              <span className="text-[16px] text-black__TextColor800 font-biotif__Regular relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px]">
                {headerInfo.title2}
              </span>
            </div>
          )}
          <div className="contact__details mt-[0px]">
            {(contactAndMail?.phone || contactAndMail.mail) && (
              <>
                <div>
                  {contactAndMail?.phone ? (
                    <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                      <ClickableMobile
                        number={contactAndMail.phone.toString()}
                      />
                    </p>
                  ) : null}
                </div>
                <div>
                  {contactAndMail.mail && (
                    <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                      <ClickableEmail
                        mail={contactAndMail.mail}
                        modelName={ModuleNames.LEAD}
                        modelRecordId={leadData?.lead?.id}
                      />
                    </p>
                  )}
                </div>
              </>
            )}
            <div>{headerInfo?.title3}</div>
          </div>
        </div>
        <div className="activityRR__details w-[266px] inline-flex flex-wrap content-start justify-end xl:w-full xl:justify-start xl:mt-[18px]">
          <div className="flex justify-end w-full mb-[15px] xl:justify-start xl:mb-0">
            <Tippy
              className="tippy__dropdown lead__details__temperature__tippy"
              trigger="click"
              hideOnClick
              disabled={!updateLeadPermission}
              theme="light"
              placement="bottom-start"
              content={
                <div className="">
                  <ul className="tippy__dropdown__ul max-h-[260px] overflow-y-auto">
                    {leadStatusOpt.map((obj, index) => (
                      <div
                        className="item"
                        key={index}
                        onClick={() => updateLeadTemp(+obj.value)}
                      >
                        <div className="item__link">
                          <span className="item__text">{obj.label}</span>
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>
              }
            >
              <div
                className={`lead__temperature__badge inline-block relative group neutral ${
                  !updateLeadPermission ? 'ip__disabled' : ''
                } `}
              >
                <div
                  style={{
                    ...(leadTempInfo?.color
                      ? { backgroundColor: leadTempInfo.color }
                      : ''),
                  }}
                  className='value__div cursor-pointer bg-ipGray__transparentBG pt-[4px] pb-[5px] px-[14px] pr-[26px] rounded-[5px] text-[14px] text-white font-biotif__Medium relative before:content-[""] before:w-[6px] before:h-[6px] before:border before:border-white before:absolute before:top-[10px] before:right-[12px] before:rotate-45 before:!border-t-0 before:!border-l-0'
                >
                  {
                    leadStatusOpt.find(
                      (obj) =>
                        obj.value === leadData?.lead?.lead_temperature?.id
                    )?.label
                  }
                </div>
              </div>
            </Tippy>
          </div>
        </div>
      </div>
      <div className="activity__topHeader__footer mt-[24px] pt-[20px] border-t border-whiteScreen__BorderColor w-full flex flex-wrap items-center justify-between">
        <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center lead__top__header__social">
          <DetailHeaderEmail
            email={contactAndMail.mail}
            modelName={ModuleNames.LEAD}
            modelRecordId={leadData?.lead?.id}
          />
          <DetailHeaderPhone
            type={contactAndMail?.phoneType}
            number={contactAndMail?.phone}
          />
          <AuthGuard
            permissions={[
              { module: ModuleNames.NOTE, type: BasicPermissionTypes.CREATE },
            ]}
          >
            <DetailHeaderNote setOpenModal={setOpenModal} />
          </AuthGuard>
          <AuthGuard
            permissions={[
              {
                module: ModuleNames.ATTACHMENT,
                type: BasicPermissionTypes.CREATE,
              },
            ]}
          >
            <DetailHeaderAttachment
              setOpenModal={setOpenModal}
              setIsLinkDocument={setIsLinkDocument}
            />
          </AuthGuard>
          <AuthGuard isAccessible={tagForLeadPermission}>
            <DetailHeaderTag setOpenModal={setOpenModal} />
          </AuthGuard>

          <AuthGuard
            permissions={[
              {
                module: ModuleNames.ACTIVITY,
                type: BasicPermissionTypes.CREATE,
              },
            ]}
          >
            <DetailHeaderActivity setOpenModal={setOpenModal} />
          </AuthGuard>
          <button className="mr-[20px] mb-[10px] sm:mr-[13px] hidden">
            <Icon
              className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
              iconType="toggle3dotsIcon"
            />
          </button>
        </div>
        <div className="inline-flex flex-wrap">
          <div className="inline-flex items-center mr-[12px] pr-[12px] relative before:content-[''] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[28px] before:bg-whiteScreen__BorderColor">
            <span className="text-[14px] font-biotif__SemiBold text-black__TextColor600 whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
              Value :
            </span>
            <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]">
              {usCurrencyFormat(deal_value || '')}
            </span>
          </div>
          <div className="inline-flex items-center mr-[12px] pr-[12px] relative before:content-[''] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[28px] before:bg-whiteScreen__BorderColor">
            <span className="text-[14px] font-biotif__SemiBold text-black__TextColor600 whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
              Age :
            </span>
            <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]">
              {leadData?.lead?.total_deal_age}
            </span>
          </div>
          <div className="inline-flex items-center">
            <span className="text-[14px] font-biotif__SemiBold text-light__TextColor whitespace-pre relative top-[2px] mr-[8px] mb-[10px]">
              Score:
            </span>
            <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]">
              {leadData?.lead?.lead_score || ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeadDetailMobileHeader = (props: LeadMobileHeaderProps) => {
  const {
    headerInfo,
    setIsStayInTouchOpen,
    isStayInTouchOpen,
    scheduleActivityData,
    setModal,
    leadData,
    updateLeadPermission,
    leadStatusOpt,
    contactAndMail,
    assignedTags,
    setAssignedTags,
    editTagsPermission,
    updateLeadTemp,
    getScheduleActivity,
    isScheduleActivityLoading,
    setOpenModal,
    setIsLinkDocument,
    leadTempInfo,
    deleteAssignedTag,
  } = props;

  // ** Hooks
  const navigate = useNavigate();
  const { name, deal_value } = leadData.lead;
  const redirectToAddActivity = () => {
    const entityData = {
      id: leadData?.lead?.id,
      name: leadData?.lead?.name || '',
      type: ModuleNames.LEAD,
    };
    const relatedEntityData = {
      ...(leadData?.lead?.related_contacts?.[0]?.contact?.id && {
        contact: {
          id: leadData?.lead?.related_contacts[0]?.contact?.id,
          name: leadData?.lead?.related_contacts[0]?.contact?.name,
        },
      }),
      ...(leadData?.lead?.related_account?.id && {
        account: {
          id: leadData?.lead?.related_account?.id,
          name: leadData?.lead?.related_account?.name,
        },
      }),
    };
    navigate(PRIVATE_NAVIGATION.activities.AddActivityMobileView, {
      state: {
        entityData,
        relatedEntityData,
      },
    });
  };

  return (
    <>
      <div className="details__page__topHeader__M contact__details__page__topHeader__M border-b border-b-[#CCCCCC]/50 pb-[8px] mb-[17px] hidden sm:block">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="details__mobile__act__type flex flex-wrap items-center w-[calc(100%_-_180px)] pr-[10px]">
            <Icon
              className="bg-primaryColor rounded-[8px] w-[43px] h-[43px] !p-[7px] xsm:w-[32px] xsm:h-[32px] xsm:rounded-[6px] xsm:!p-[5px]"
              iconType="leadsFilledBlueIcon"
            />
            <p className="text-[16px] font-biotif__Medium text-[#2E3234] w-[calc(100%_-_45px)] pl-[7px] whitespace-pre overflow-hidden text-ellipsis xsm:w-[calc(100%_-_34px)]">
              {headerInfo.module}
            </p>
          </div>
          <div className="action__btns__mobile inline-flex items-center">
            <AuthGuard isAccessible={updateLeadPermission}>
              <>
                <button type="button" className="editACT__btn__M">
                  <Icon
                    onClick={() =>
                      leadData.lead.id &&
                      navigate(
                        setUrlParams(
                          PRIVATE_NAVIGATION.leads.edit,
                          leadData.lead.id
                        )
                      )
                    }
                    className="!w-[32px] !h-[32px] p-[4px] rounded-[6px] bg-secondary__Btn__BGColor duration-500 hover:bg-primaryColor"
                    iconType="editPencilFilledIcon"
                  />
                </button>
                <Button
                  className="bg-primaryColor text-white text-[12px] font-biotif__SemiBold rounded-[6px] py-[4px] px-[12px] h-[32px] ml-[10px]"
                  onClick={() =>
                    setModal((prev) => ({
                      ...prev,
                      [ModalType.CONVERT_LEAD]: { open: true },
                    }))
                  }
                >
                  Convert Lead
                </Button>
                <button className="details__page__toggleBtn__M ml-[5px]">
                  <Icon
                    className="!w-[32px] !h-[32px] p-[8px] rounded-[6px] duration-500 hover:bg-[#E6E6E6]"
                    iconType="toggle3dotsIcon"
                  />
                </button>
              </>
            </AuthGuard>
          </div>
        </div>
        <div className="flex flex-wrap">
          <h3 className="text-black__TextColor800 text-[18px] font-biotif__Medium mr-[10px] mb-[5px]">
            {name}
          </h3>

          {assignedTags?.list.length > 0 && (
            <div className="badge__wrapper mb-[10px] text-primaryColor">
              <AssignTagsList
                setAssignedTags={setAssignedTags}
                editTagsPermission={editTagsPermission}
                assignedTags={assignedTags}
                deleteAssignedTag={deleteAssignedTag}
                setModal={() => setOpenModal(ModalType.TAG)}
              />
            </div>
          )}
        </div>
        {headerInfo?.title1 && (
          <h5 className="text-[#2E3234] text-[18px] leading-[20px] font-biotif__Medium sm:text-[16px]">
            {headerInfo?.title1}
          </h5>
        )}
        {headerInfo.title2 && (
          <h5 className="text-[#2E3234] text-[16px] leading-[18px] font-biotif__Regular mb-[6px] sm:text-[14px] sm:font-biotif__Regular">
            {headerInfo.title2}
          </h5>
        )}
        <div className="contact__details mt-[0px]">
          {(contactAndMail?.phone || contactAndMail.mail) && (
            <>
              <div className="leading-normal">
                {contactAndMail?.phone ? (
                  <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                    <ClickableMobile number={contactAndMail.phone.toString()} />
                  </p>
                ) : null}
              </div>
              <div className="leading-normal">
                {contactAndMail.mail ? (
                  <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                    <ClickableEmail
                      mail={contactAndMail.mail}
                      modelName={ModuleNames.LEAD}
                      modelRecordId={leadData?.lead?.id}
                    />
                  </p>
                ) : null}
              </div>
            </>
          )}
          <div>{headerInfo?.title3}</div>
        </div>
        <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center mt-[14px] mb-[5px]">
          <DetailHeaderEmail
            email={contactAndMail.mail}
            modelName={ModuleNames.LEAD}
            modelRecordId={leadData?.lead?.id}
          />
          <DetailHeaderPhone
            type={contactAndMail?.phoneType || ''}
            number={contactAndMail?.phone?.toString()}
          />
          <AuthGuard
            permissions={[
              { module: ModuleNames.NOTE, type: BasicPermissionTypes.CREATE },
            ]}
          >
            <Tippy zIndex={5} content="Notes">
              <button
                className="inline-block mr-[8px] mb-[8px]"
                onClick={() => setOpenModal(ModalType.NOTE)}
              >
                <Icon
                  className="i__Icon highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
                  iconType="mobileMenuFilled"
                />
              </button>
            </Tippy>
          </AuthGuard>
          <AuthGuard
            permissions={[
              {
                module: ModuleNames.ATTACHMENT,
                type: BasicPermissionTypes.CREATE,
              },
            ]}
          >
            <TableActionButton
              filedArray={[
                {
                  label: 'Link',
                  onClick: () => {
                    setOpenModal(ModalType.ATTACHMENT);
                    setIsLinkDocument(true);
                  },
                },
                {
                  label: 'File',
                  onClick: () => {
                    setOpenModal(ModalType.ATTACHMENT);
                    setIsLinkDocument(false);
                  },
                },
              ]}
              buttonChild={
                <Icon
                  className="i__Icon highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
                  iconType="attachmentFilledIcon"
                />
              }
              buttonClassName="inline-block mr-[8px] mb-[8px]"
              tippyMessage="Documents"
            />
          </AuthGuard>
          <AuthGuard
            permissions={[
              { module: ModuleNames.TAG, type: headerInfo.tagPermission },
            ]}
          >
            <Tippy zIndex={5} content="Tags">
              <button
                className="inline-block mr-[8px] mb-[8px]"
                onClick={() => setOpenModal(ModalType.TAG)}
              >
                <Icon
                  className="i__Icon highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
                  iconType="offerTagsFilledIcon"
                />
              </button>
            </Tippy>
          </AuthGuard>
          <AuthGuard
            permissions={[
              {
                module: ModuleNames.ACTIVITY,
                type: headerInfo.activityPermission,
              },
            ]}
          >
            <Tippy zIndex={5} content="Activity">
              <button
                className="inline-block mr-[8px] mb-[8px]"
                onClick={() => redirectToAddActivity()}
              >
                <Icon
                  className="i__Icon highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
                  iconType="activitiesFilledBlackIcon"
                />
              </button>
            </Tippy>
          </AuthGuard>
        </div>

        <div className='inline-flex w-full items-center mr-[0px] mb-[4px] pr-[0px] relative before:content-[""] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[28px] before:bg-whiteScreen__BorderColor before:hidden'>
          <span className="text-[14px] font-biotif__SemiBold text-light__TextColor whitespace-pre relative top-[2px] mr-[4px] mb-[5px]">
            Value:
          </span>
          <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[5px]">
            {usCurrencyFormat(deal_value || '') || '-'}
          </span>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-wrap w-full sm:w-auto sm:max-w-full sm:pr-[10px]">
            <div className='inline-flex items-center mr-[12px] pr-[12px] relative before:content-[""] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[22px] before:bg-whiteScreen__BorderColor'>
              <span className="text-[14px] font-biotif__SemiBold text-black__TextColor600 whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
                Age:
              </span>
              <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]">
                {leadData?.lead?.total_deal_age}
              </span>
            </div>
            <div className='inline-flex items-center mr-[0px] pr-[0px] relative before:content-[""] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[28px] before:bg-whiteScreen__BorderColor before:hidden'>
              <span className="text-[14px] font-biotif__SemiBold text-black__TextColor600 whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
                Score:
              </span>
              <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]">
                {leadData?.lead?.lead_score || ''}
              </span>
            </div>
          </div>
          <div className="lead__temperature__badge inline-block relative group neutral mb-[8px] sm:max-w-full">
            <div className="flex justify-end w-full mb-[15px] xl:justify-start xl:mb-0 sm:w-auto sm:max-w-full">
              <Tippy
                className="tippy__dropdown lead__details__temperature__tippy"
                trigger="click"
                hideOnClick
                disabled={!updateLeadPermission}
                theme="light"
                placement="bottom-start"
                content={
                  <div className="">
                    <ul className="tippy__dropdown__ul max-h-[260px] overflow-y-auto">
                      {leadStatusOpt.map((obj, index) => (
                        <div
                          className="item"
                          key={index}
                          onClick={() => updateLeadTemp(+obj.value)}
                        >
                          <div className="item__link">
                            <span className="item__text">{obj.label}</span>
                          </div>
                        </div>
                      ))}
                    </ul>
                  </div>
                }
              >
                <div className="lead__temperature__badge inline-block relative group neutral sm:max-w-full">
                  <div
                    style={{
                      ...(leadTempInfo?.color
                        ? { backgroundColor: leadTempInfo.color }
                        : ''),
                    }}
                    className='value__div cursor-pointer bg-ipGray__transparentBG pt-[4px] pb-[5px] px-[14px] pr-[26px] rounded-[5px] text-[14px] text-white font-biotif__Medium relative before:content-[""] before:w-[6px] before:h-[6px] before:border before:border-white before:absolute before:top-[10px] before:right-[12px] before:rotate-45 before:!border-t-0 before:!border-l-0 sm:max-w-full sm:whitespace-pre sm:overflow-hidden sm:text-ellipsis'
                  >
                    {
                      leadStatusOpt.find(
                        (obj) => obj.value === leadData?.lead?.lead_temp_id
                      )?.label
                    }
                  </div>
                </div>
              </Tippy>
            </div>
          </div>
        </div>
      </div>
      <div className="details__page__sticky__btns py-[15px] px-[22px] rounded-t-[20px] shadow-[0px_4px_21px_5px_#00000014] fixed bottom-0 left-0 w-full bg-white z-[4] justify-end items-center hidden sm:flex xsm:px-[15px]">
        <Button className='i__Button mr-[10px] bg-[#E6E6E6] py-[4px] px-[17px] pr-[37px] text-black text-[14px] font-biotif__Medium rounded-[6px] h-[32px] relative before:content-[""] before:w-[8px] before:h-[8px] before:border-[2px] before:border-black before:absolute before:top-[10px] before:right-[12px] before:rotate-45 before:!border-t-0 before:!border-l-0 after:content-[""] after:absolute after:top-[9px] after:right-[28px] after:w-[1px] after:h-[14px] after:bg-black hover:text-white hover:before:border-white hover:after:bg-white'>
          Follow
        </Button>
        {leadData.lead.id && (
          <StayInTouch
            model_record_id={leadData.lead.id}
            model_name={POLYMORPHIC_MODELS.LEAD}
            isStayInTouchOpen={isStayInTouchOpen}
            setIsStayInTouchOpen={(value) => {
              setIsStayInTouchOpen(value);
            }}
            scheduleActivityData={scheduleActivityData}
            isScheduleActivityLoading={isScheduleActivityLoading}
            getScheduleActivity={getScheduleActivity}
          />
        )}
      </div>
    </>
  );
};

export default LeadDetailHeader;
