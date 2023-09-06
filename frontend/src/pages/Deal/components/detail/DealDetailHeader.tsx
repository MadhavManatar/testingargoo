// ** Import Packages **
import { useCallback, useEffect, useState } from 'react';

// ** Redux **
import { useDispatch } from 'react-redux';
import { setLoadTimeLines } from 'redux/slices/commonSlice';

// ** Components **
import RedirectToGoogleMap from 'components/Address/components/RedirectToGoogleMap';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import DateFormat from 'components/DateFormat';
import Dropdown from 'components/Dropdown';
import EntityCard from 'components/EntityDetails/QuickLookCard/EntityCard';
import AddNoteModal from 'components/EntityDetails/Timeline/components/AddNoteModal';
import Icon from 'components/Icon';
import AssignTagModal from 'components/detail-components/AssignTags/AssignTagModal';
import AssignTagsList from 'components/detail-components/AssignTags/AssignTagsList';
import AddAttachmentModal from 'components/detail-components/Attachment/components/AddAttachmentModal';
import { DetailHeaderEmail } from 'components/detail-components/detail-header-email';
import AuthGuard from 'pages/auth/components/AuthGuard';
import DealDetailMobileHeader from './DealDetailMobileHeader';
import DetailHeaderPhone from 'components/detail-components/detail-header-phone';
import DetailHeaderNote from 'components/detail-components/detail-header-note';
import DetailHeaderAttachment from 'components/detail-components/detail-header-attachment';
import DetailHeaderTag from 'components/detail-components/detail-header-tag';
import DetailHeaderActivity from 'components/detail-components/detail-header-activity';

// ** hooks-services **
import useAuth from 'hooks/useAuth';
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constants **
import { ModalType } from 'components/EntityDetails/constant';
import { DEAL_STAGE_VALUE, MODULE } from 'constant';
import {
  ActivityPermissions,
  BasicPermissionTypes,
  ModuleNames,
  TagPermissions,
} from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Types **
import { AssignTagsProps, HeaderInfo } from 'components/EntityDetails/types';
import { tag } from 'components/detail-components/AssignTags/types/assignTags.type';
import { DealDetailsHeaderProps } from 'pages/Deal/types/deals.types';

// ** Util **
import { usCurrencyFormat } from 'utils/util';

// ** Helper **
import {
  useAssignTagMutation,
  useLazyGetAssignedTagByModelRecordIdQuery,
} from 'redux/api/tagApi';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';
import useDateColorCal from 'pages/Deal/hooks/useClosingDateColorCal';

const DealDetailHeader = (props: DealDetailsHeaderProps) => {
  const {
    dealData,
    setModal,
    dealClosingDateData,
    closeModal,
    modal,
    dealId,
    getScheduleActivity,
    isScheduleActivityLoading,
    isStayInTouchOpen,
    scheduleActivityData,
    setIsStayInTouchOpen,
    setReRenderOnStage,
    reRenderOnStage,
  } = props;
  // ** hooks **
  const dispatch = useDispatch();
  // ** const **
  const {
    closing_date,
    deal_value,
    converted_at,
    created_at,
    related_contacts,
    related_account,
    name,
  } = dealData;
  // ** states **
  const [isLinkDocument, setIsLinkDocument] = useState(false);
  const [closingDateColor, setClosingDateColor] = useState<string>();

  const [assignedTags, setAssignedTags] = useState<AssignTagsProps>({
    list: [],
    total: 0,
  });

  // ** APIS** //
  const [assignTag] = useAssignTagMutation();
  const [getAssignedTagByModelRecordId] =
    useLazyGetAssignedTagByModelRecordIdQuery();

  // ** Custom hooks **
  const { hasAuthorized } = useAuth();
  const { readContactPermission, readAccountPermission } = usePermission();
  const editTagsPermission = hasAuthorized([
    { module: ModuleNames.TAG, type: TagPermissions.DEAL },
  ]);
  const { isMobileView } = useWindowDimensions();
  const { dateColorCal } = useDateColorCal();
  useEffect(() => {
    if (closing_date) {
      const calDateColor = dateColorCal({
        dealClosingDateData,
        closing_date,
        converted_at,
        created_at,
      });
      if (
        dealData?.deal_stage?.name === DEAL_STAGE_VALUE.CLOSED_WON ||
        dealData?.deal_stage?.name === DEAL_STAGE_VALUE.CLOSED_LOST
      ) {
        setClosingDateColor('');
      } else {
        setClosingDateColor(calDateColor);
      }
    }
  }, [dealClosingDateData, closing_date, dealData]);

  useEffect(() => {
    getAssignedTags();
  }, []);

  const primaryContact = related_contacts?.find(
    (contactObj) => contactObj?.is_primary
  )?.contact;

  const job_role =
    primaryContact?.job_role ||
    related_contacts?.find((item) => item.is_primary)?.job_role;

  const openModal = (EmailModalType: ModalType) => {
    setModal((pre) => ({ ...pre, [EmailModalType]: { open: true } }));
  };

  const getAssignedTags = async () => {
    const { data, error } = await getAssignedTagByModelRecordId(
      {
        modelName: TagPermissions.DEAL,
        id: dealId,
        params: {
          select: 'tag',
          'q[model_name]': ModuleNames.DEAL,
        },
      },
      true
    );
    if (data && !error) {
      setAssignedTags({ list: data?.rows, total: data?.count });
    }
  };

  const deleteAssignedTag = async (deleteId: number, tagDetail?: tag) => {
    const filteredArray = assignedTags.list.filter((obj) => {
      return obj.tag.id !== tagDetail?.id && obj.tag.name !== tagDetail?.name;
    });
    setAssignedTags({ list: filteredArray, total: filteredArray.length });
    const data = await assignTag({
      id: dealId,
      data: {
        modelName: ModuleNames.DEAL,
        tags: { deletedTagIds: [deleteId] },
        message: ToastMsg.common.deleteTag,
      },
    });
    if (!('error' in data)) {
      dispatch(setLoadTimeLines({ timeline: true }));
    } else {
      getAssignedTags();
    }
  };

  const addressObj =
    primaryContact?.address1 ||
    primaryContact?.address2 ||
    primaryContact?.state ||
    primaryContact?.city ||
    primaryContact?.country ||
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
              id={related_account?.id as number}
              name={related_account?.name}
              email={accountPrimaryEmail}
              phone={accountPrimaryPhone?.value?.toString()}
              phoneType={accountPrimaryPhone?.phoneType || ''}
              {...(!!checkAddressLength && { address })}
              {...{ close, setIsOpen, isOpen }}
            />
          )}
        </>
      );
    },
    [related_account]
  );
  const contactCard = useCallback(
    (contactCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = contactCardProps;
      const contactPrimaryEmail = (primaryContact?.emails || [])?.filter(
        (val) => val.is_primary
      )?.[0]?.value;
      const accountPrimaryPhone = (primaryContact?.phones || [])?.filter(
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
              phone={accountPrimaryPhone?.value?.toString()}
              phoneType={accountPrimaryPhone?.phoneType || ''}
              {...(!!checkAddressLength && { address })}
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
    tagPermission: TagPermissions.LEAD,
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
      job_role || related_account?.name || related_account?.id ? (
        <>
          {job_role ? <span>{job_role}</span> : <></>}
          {related_account?.name && job_role ? ', ' : ''}
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
    email:
      (related_contacts || [])
        .filter((val) => val?.is_primary)[0]
        ?.contact?.emails?.filter((val) => val.is_primary)[0]?.value ||
      related_account?.emails?.find(
        (item: { isPrimary: boolean }) => item.isPrimary
      )?.value ||
      '',
    phone:
      (related_contacts || [])
        .filter((val) => val.is_primary)?.[0]
        ?.contact?.phones?.filter((val) => val.is_primary)?.[0]
        ?.value?.toString() ||
      related_account?.phones?.find((item) => item.isPrimary)?.value ||
      '',
    phoneType:
      (related_contacts || [])
        .filter((val) => val.is_primary)?.[0]
        ?.contact?.phones?.filter((val) => val.is_primary)?.[0]?.phoneType ||
      related_account?.phones?.find((item) => item.isPrimary)?.phoneType ||
      '',
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
  return (
    <>
      {isMobileView ? (
        <DealDetailMobileHeader
          dealId={dealId}
          dealDetails={dealData}
          setReRenderOnStage={setReRenderOnStage}
          reRenderOnStage={reRenderOnStage}
          assignedTags={assignedTags}
          deleteAssignedTag={deleteAssignedTag}
          editTagsPermission={editTagsPermission}
          headerInfo={headerInfo}
          primaryContact={primaryContact}
          job_role={job_role}
          openModal={openModal}
          setIsLinkDocument={setIsLinkDocument}
          closingDateColor={closingDateColor}
          isStayInTouchOpen={isStayInTouchOpen}
          setIsStayInTouchOpen={(value) => {
            setIsStayInTouchOpen(value);
          }}
          scheduleActivityData={scheduleActivityData}
          isScheduleActivityLoading={isScheduleActivityLoading}
          getScheduleActivity={getScheduleActivity}
        />
      ) : (
        <div className="activityInner__topHeader__box flex flex-wrap border border-whiteScreen__BorderColor rounded-[12px] p-[20px] pb-[10px] mb-[20px] sm:hidden">
          <div className="activityType flex flex-wrap content-center justify-center pr-[20px] w-[92px] relative before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[calc(100%_-_26px)] before:bg-whiteScreen__BorderColor">
            <IconAnimation
              iconType="dealsFilledBlueIcon"
              animationIconType={IconTypeJson.Deal}
              className="!w-[60px] !h-[60px] !p-[8px] rounded-[10px] !bg-primaryColor"
            />
            <p className="text-[16px] text-black__TextColor800 font-biotif__Medium text-center w-full mt-[10px] break-words">
              Deal
            </p>
          </div>
          <div className="right w-[calc(100%_-_93px)] pl-[20px] flex flex-wrap justify-between">
            <div className="main__details w-full pr-[20px]">
              <div className="flex flex-wrap">
                <h3 className="text-black__TextColor800 text-[20px] font-biotif__Medium mr-[15px] mb-[3px]">
                  {name}
                </h3>
                {assignedTags?.list.length > 0 ? (
                  <div className="badge__wrapper mb-[10px] text-primaryColor">
                    <AssignTagsList
                      assignedTags={assignedTags}
                      setAssignedTags={setAssignedTags}
                      deleteAssignedTag={deleteAssignedTag}
                      editTagsPermission={editTagsPermission}
                      setModal={() => openModal(ModalType.TAG)}
                    />
                  </div>
                ) : null}
              </div>
              {headerInfo?.title1 ? (
                <h5 className="text-black__TextColor800 text-[18px] font-biotif__Medium">
                  {headerInfo?.title1}
                </h5>
              ) : (
                <></>
              )}
              {headerInfo.title2 ? (
                <div className="flex flex-wrap designation__wrapper">
                  <span className="text-[16px] text-black__TextColor800 font-biotif__Regular relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px]">
                    {headerInfo.title2}
                  </span>
                </div>
              ) : (
                <></>
              )}

              <div className="contact__details mt-[0px]">
                {headerInfo?.phone || headerInfo.email ? (
                  <>
                    <div>
                      {headerInfo?.phone ? (
                        <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                          <ClickableMobile number={headerInfo.phone} />
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div>
                      {headerInfo?.email ? (
                        <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                          <ClickableEmail
                            mail={headerInfo.email}
                            modelName={ModuleNames.DEAL}
                            modelRecordId={dealId}
                          />
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div>{headerInfo?.title3}</div>
              </div>
            </div>
          </div>
          <div className="activity__topHeader__footer mt-[24px] pt-[20px] border-t border-whiteScreen__BorderColor w-full flex flex-wrap items-center justify-between">
            <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center">
              <DetailHeaderEmail
                email={headerInfo.email}
                modelName={ModuleNames.DEAL}
                modelRecordId={dealId}
              />
              <DetailHeaderPhone
                type={headerInfo?.phoneType}
                number={headerInfo?.phone}
              />
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.NOTE,
                    type: BasicPermissionTypes.CREATE,
                  },
                ]}
              >
                <DetailHeaderNote setOpenModal={openModal} />
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
                  setOpenModal={openModal}
                  setIsLinkDocument={setIsLinkDocument}
                />
              </AuthGuard>
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.TAG,
                    type: TagPermissions.DEAL,
                  },
                ]}
              >
                <DetailHeaderTag setOpenModal={openModal} />
              </AuthGuard>
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.ACTIVITY,
                    type: BasicPermissionTypes.CREATE,
                  },
                ]}
              >
                <DetailHeaderActivity setOpenModal={openModal} />
              </AuthGuard>

              <button className="mr-[20px] mb-[10px] sm:mr-[13px] hidden">
                <Icon
                  className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
                  iconType="toggle3dotsIcon"
                />
              </button>
            </div>
            <div className="leadScore__wrapper inline-flex flex-wrap">
              <div className="inline-flex items-center mr-[12px] pr-[12px] relative before:content-[''] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[28px] before:bg-whiteScreen__BorderColor">
                <span className="text-[14px] font-biotif__SemiBold text-black__TextColor600 whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
                  Closing Date:
                </span>
                <span
                  className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]"
                  style={{ color: `${closingDateColor}` }}
                >
                  {closing_date && (
                    <DateFormat format="MMM d, yyyy" date={closing_date} />
                  )}
                </span>
              </div>
              <div className="inline-flex items-center mr-[12px] pr-[12px] relative before:content-[''] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[28px] before:bg-whiteScreen__BorderColor">
                <span className="text-[14px] font-biotif__SemiBold text-black__TextColor600 whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
                  Value:
                </span>
                <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]">
                  {usCurrencyFormat(deal_value || '') || ''}
                </span>
              </div>
              <div className="inline-flex items-center mr-[12px] pr-[12px] relative before:content-[''] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[28px] before:bg-whiteScreen__BorderColor">
                <span className="text-[14px] font-biotif__SemiBold text-black__TextColor600 whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
                  Age:
                </span>
                <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]">
                  {dealData?.total_deal_age}
                </span>
              </div>
              <div className="inline-flex items-center mr-[0px] pr-[0px] relative before:content-[''] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[28px] before:bg-whiteScreen__BorderColor before:hidden">
                <span className="text-[14px] font-biotif__SemiBold text-black__TextColor600 whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
                  Score:
                </span>
                <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]">
                  {dealData?.lead_score || ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal.NOTE?.open && (
        <AuthGuard
          permissions={[
            { module: ModuleNames.NOTE, type: BasicPermissionTypes.CREATE },
          ]}
        >
          <AddNoteModal
            isOpen={modal.NOTE.open}
            closeModal={() => closeModal(ModalType.NOTE)}
            modelName={ModuleNames.DEAL}
            modelRecordId={dealId}
          />
        </AuthGuard>
      )}
      {modal.ATTACHMENT?.open && (
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
            closeModal={() => closeModal(ModalType.ATTACHMENT)}
            modelName={ModuleNames.DEAL}
            modelRecordId={dealId}
            isLink={isLinkDocument}
          />
        </AuthGuard>
      )}
      {modal.TAG?.open && (
        <AuthGuard
          permissions={[{ module: ModuleNames.TAG, type: TagPermissions.DEAL }]}
        >
          <AssignTagModal
            modelRecordId={dealId}
            setAssignedTags={setAssignedTags}
            isOpen={modal.TAG.open}
            assignedTags={assignedTags}
            modelName={ModuleNames.DEAL}
            getAssignedTags={getAssignedTags}
            deleteAssignedTag={deleteAssignedTag}
            editTagsPermission={editTagsPermission}
            closeModal={() => closeModal(ModalType.TAG)}
          />
        </AuthGuard>
      )}
    </>
  );
};

export default DealDetailHeader;
