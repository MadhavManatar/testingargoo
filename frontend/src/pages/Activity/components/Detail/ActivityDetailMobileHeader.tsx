// ** Import Packages **
import Tippy from '@tippyjs/react';
import { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import { TableActionButton } from 'components/Button/TableActionButton';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import Icon, { IconTypes } from 'components/Icon';
import Image from 'components/Image';
import AssignTagsList from 'components/detail-components/AssignTags/AssignTagsList';
import { DetailHeaderEmail } from 'components/detail-components/detail-header-email';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Hook **
import useAuth from 'hooks/useAuth';

// ** Types **
import { AssignTagCommonProps } from 'components/detail-components/AssignTags/types/assignTags.type';
import {
  ActivityHeaderInfo,
  ActivityResponseType,
  ModalTypeProps,
  activityLogResponse,
} from 'pages/Activity/types/activity.types';

// ** Constant **
import {
  BasicPermissionTypes,
  ModuleNames,
  TagPermissions,
} from 'constant/permissions.constant';

// ** Util  **
import { copyToClipboard } from 'utils/util';

// ** Helper **
import DetailHeaderPhone from 'components/detail-components/detail-header-phone';

type ActivityDetailMobileHeaderProps = {
  isUpdateActivityStatusLoading: boolean;
  activityDetail: ActivityResponseType;
  isChangeActivityStatusLoading: boolean;
  activityRunningStatus: {
    status: boolean;
    log: activityLogResponse;
  };
  changeSetOpenModal: (val: ModalTypeProps) => void;
  startOrStopActivity: (is_active: boolean) => Promise<void>;
  changeActivityCompleteStatus: () => void;
  headerInfo: ActivityHeaderInfo;
  setIsLinkDocument: Dispatch<SetStateAction<boolean>>;
} & AssignTagCommonProps;

const ActivityDetailMobileHeader = (props: ActivityDetailMobileHeaderProps) => {
  const {
    activityRunningStatus,
    assignedTags,
    setAssignedTags,
    changeActivityCompleteStatus,
    changeSetOpenModal,
    deleteAssignedTag,
    isChangeActivityStatusLoading,
    isUpdateActivityStatusLoading,
    startOrStopActivity,
    activityDetail,
    headerInfo,
    setIsLinkDocument,
  } = props;

  // ** Hooks ** //
  const { hasAuthorized } = useAuth();

  // ** Constants ** //
  const { topic, activity_type } = activityDetail;
  const editTagsPermission = hasAuthorized([
    { module: ModuleNames.TAG, type: TagPermissions.ACTIVITY },
  ]);
  const CustomIconType =
    activity_type?.icon_type === 'Custom' ? (
      <Image
        imgPath={activity_type.icon}
        disableLoader
        serverPath
        imgClassName="!w-[42px] !h-[42px] rounded-[8px] !p-[7px] bg-primaryColor"
      />
    ) : (
      <></>
    );
  return (
    <>
      <div className="details__page__topHeader__M contact__details__page__topHeader__M border-b border-b-[#CCCCCC]/50 pb-[8px] mb-[17px] hidden sm:block">
        <div className="flex justify-between items-center mb-[20px]">
          <div
            className={`details__mobile__act__type flex flex-wrap items-center w-[calc(100%_-_180px)] pr-[10px] ${
              isChangeActivityStatusLoading ? 'w-[calc(100%_-_208px)]' : null
            }`}
          >
            {activity_type?.icon_type === 'Default' ? (
              <Icon
                className="bg-primaryColor rounded-[8px] w-[43px] h-[43px] !p-[7px] xsm:w-[32px] xsm:h-[32px] xsm:rounded-[6px] xsm:!p-[5px]"
                iconType={activity_type.icon as IconTypes}
              />
            ) : (
              CustomIconType
            )}
            {headerInfo.activityType && (
              <p className="text-[16px] font-biotif__Medium text-[#2E3234] w-[calc(100%_-_45px)] pl-[7px] whitespace-pre overflow-hidden text-ellipsis xsm:w-[calc(100%_-_34px)]">
                {headerInfo.activityType}
              </p>
            )}
          </div>
          <div className="action__btns__mobile inline-flex items-center">
            <button
              className="editACT__btn__M"
              onClick={() => changeSetOpenModal('edit')}
            >
              <Icon
                className="!w-[32px] !h-[32px] p-[4px] rounded-[6px] bg-[#E6E6E6] duration-500 hover:bg-primaryColor"
                iconType="editPencilFilledIcon"
              />
            </button>
            <Button
              onClick={() => startOrStopActivity(!activityRunningStatus.status)}
              isLoading={isChangeActivityStatusLoading}
              className={`text-white text-[12px] font-biotif__SemiBold rounded-[6px] py-[4px] px-[12px] h-[32px] ml-[10px] ${
                activityRunningStatus.status
                  ? 'bg-ip__Red hover:bg-ip__Red__hoverDark'
                  : ' bg-ip__SuccessGreen hover:bg-ip__SuccessGreen__hoverDark'
              }`}
            >
              {headerInfo.activityRunningStatus}
            </Button>
            <button className="details__page__toggleBtn__M ml-[5px]">
              <Icon
                className="!w-[32px] !h-[32px] p-[8px] rounded-[6px] duration-500 hover:bg-[#E6E6E6]"
                iconType="toggle3dotsIcon"
              />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap">
          <h3 className="text-[#2E3234] text-[18px] font-biotif__Medium mr-[10px] mb-[3px]">
            {topic || ''}
          </h3>
          <div className="badge__wrapper mb-[10px] text-primaryColor">
            {assignedTags?.list.length ? (
              <AssignTagsList
                assignedTags={assignedTags}
                setAssignedTags={setAssignedTags}
                deleteAssignedTag={deleteAssignedTag}
                editTagsPermission={editTagsPermission}
                setModal={() => changeSetOpenModal('tag')}
              />
            ) : null}
          </div>
        </div>
        {headerInfo.contactName && (
          <h5 className="text-[#2E3234] text-[18px] font-biotif__Medium mb-[5px] sm:text-[16px]">
            {headerInfo.contactName}
          </h5>
        )}
        <h5 className="text-[#2E3234] text-[16px] leading-[18px] font-biotif__Regular mb-[5px] sm:text-[14px] sm:font-biotif__Regular">
          {(headerInfo.contactJobRole ||
            headerInfo.accountName?.props?.children) && (
            <span
              className={`text-[14px] text-[#2E3234] font-biotif__Regular relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor ${
                !headerInfo.dealOrLeadName?.props?.children
                  ? 'before:hidden'
                  : ''
              }`}
            >
              {headerInfo.contactJobRole}
              {headerInfo.contactNameAndJobRoleComma}
              {headerInfo.accountName}
            </span>
          )}
          {headerInfo.dealOrLeadName && (
            <span className="text-[14px] text-[#2E3234] font-biotif__Regular relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
              {headerInfo.dealOrLeadName}
            </span>
          )}
        </h5>
        {(headerInfo?.contactPrimaryPhone ||
          headerInfo?.contactPrimaryEmail) && (
          <div className="contact__details mt-[0px]">
            {headerInfo?.contactPrimaryPhone?.value && (
              <div className="leading-normal">
                <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                  <ClickableMobile
                    number={headerInfo?.contactPrimaryPhone?.value}
                    rootClassName="text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColorSD hover:underline"
                  />
                </p>
              </div>
            )}
            {headerInfo?.contactPrimaryEmail && (
              <div className="leading-normal">
                <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                  <ClickableEmail
                    mail={headerInfo?.contactPrimaryEmail}
                    textClassName="text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColorSD hover:underline"
                  />
                </p>
              </div>
            )}
          </div>
        )}
        <div className="meeting__wrapper flex flex-wrap pt-[15px] mt-[15px] mb-[4px] border-t border-t-[#CCCCCC]/50">
          <div className='meetingCN__box w-full relative before:content[""] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_20px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden'>
            {/* {headerInfo.isMeetingConfirmed && ( */}
            <div className="flex flex-wrap items-start mb-[8px]">
              <Icon
                className="p-0 !w-[16px] !h-[16px] relative top-[2px]"
                iconType="greenRightTickFilledIcon"
              />
              <span className="w-[calc(100%_-_17px)] pl-[4px] inline-block text-[14px] text-ipBlack__textColor font-biotif__SemiBold relative">
                Meeting Confirmed
              </span>
            </div>
            {/* )} */}
            <span className="flex flex-wrap text-[14px] text-ipBlack__textColor font-biotif__SemiBold relative mb-[8px] mr-[18px] sm:inline-flex">
              <span className="text-black/50 inline-block">Date:</span>
              <span className="inline-block w-[calc(100%_-_36px)] pl-[4px] sm:w-auto">
                {headerInfo.formattedStartDate}
              </span>
            </span>
            <span className="flex flex-wrap text-[14px] text-ipBlack__textColor font-biotif__SemiBold relative mb-[8px] sm:inline-flex">
              <span className="text-black/50 inline-block">Time:</span>
              <span className="inline-block w-[calc(100%_-_38px)] pl-[4px] sm:w-auto">
                {headerInfo.formattedTime}
              </span>
            </span>
            <span className="flex flex-wrap text-[14px] text-ipBlack__textColor font-biotif__SemiBold relative mb-[8px]">
              <span className="text-black/50 inline-block">Duration:</span>
              <span className="inline-block w-[calc(100%_-_62px)] pl-[4px]">
                {headerInfo.formattedDuration}
              </span>
            </span>
            {headerInfo.reminder.isShow && (
              <span className="flex flex-wrap text-[14px] text-ipBlack__textColor font-biotif__SemiBold relative">
                {headerInfo.reminder.title}
                {headerInfo.reminder.singleReminder}
                {headerInfo.reminder.allReminder}
              </span>
            )}
          </div>
          {headerInfo?.zoomMeetingLink && (
            <div className="copyMeetingLink flex items-center w-full mb-[-7px]">
              <span className="label relative top-[1px] text-[14px] text-[#467CA7] font-biotif__SemiBold">
                Link:
              </span>
              <Link
                className="text-[#6697BF] text-[14px] font-biotif__Medium inline-block ml-[5px] max-w-[calc(100%_-_77px)] whitespace-pre text-ellipsis overflow-hidden hover:underline"
                target="_blank"
                to={headerInfo?.zoomMeetingLink}
              >
                {headerInfo?.zoomMeetingLink}
              </Link>
              <Icon
                className="!w-[34px] !h-[34px] ml-[5px] cursor-pointer !p-[5px] duration-500 rounded-full hover:bg-ipGray__transparentBG"
                iconType="copyStrokeIcon"
                onClick={() => copyToClipboard(headerInfo?.zoomMeetingLink)}
              />
            </div>
          )}
        </div>
        {!activityRunningStatus.status && (
          <div className="inline-flex mt-[7px] w-full">
            {headerInfo.logOnTime}{' '}
          </div>
        )}

        <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center mt-[14px] mb-[5px]">
          <DetailHeaderEmail email={headerInfo?.contactPrimaryEmail} />
          <DetailHeaderPhone
            type={headerInfo.contactPrimaryPhone?.phoneType}
            number={headerInfo.contactPrimaryPhone?.value || ''}
          />
          <AuthGuard
            permissions={[
              {
                module: ModuleNames.NOTE,
                type: BasicPermissionTypes.CREATE,
              },
            ]}
          >
            <Tippy zIndex={5} content="Notes">
              <button
                className="inline-block mr-[8px] mb-[8px]"
                onClick={() => changeSetOpenModal('note')}
              >
                <Icon
                  className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
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
                    changeSetOpenModal('attachment');
                    setIsLinkDocument(true);
                  },
                },
                {
                  label: 'File',
                  onClick: () => {
                    changeSetOpenModal('attachment');
                    setIsLinkDocument(false);
                  },
                },
              ]}
              buttonChild={
                <Icon
                  className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
                  iconType="attachmentFilledIcon"
                />
              }
              buttonClassName="inline-block mr-[8px] mb-[8px]"
              tippyMessage="Documents"
            />
          </AuthGuard>
          <AuthGuard
            permissions={[
              {
                module: ModuleNames.TAG,
                type: TagPermissions.ACTIVITY,
              },
            ]}
          >
            <Tippy zIndex={5} content="Tags">
              <button
                className="inline-block mr-[8px] mb-[8px]"
                onClick={() => changeSetOpenModal('tag')}
              >
                <Icon
                  className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
                  iconType="offerTagsFilledIcon"
                />
              </button>
            </Tippy>
          </AuthGuard>
        </div>
      </div>
      <div className="details__page__sticky__btns py-[15px] px-[22px] rounded-t-[20px] shadow-[0px_4px_21px_5px_#00000014] fixed bottom-0 left-0 w-full bg-white z-[4] justify-end items-center hidden sm:flex xsm:px-[15px]">
        <button
          className="h-[32px] rounded-[6px] py-[4px] px-[12px] mr-[10px] text-[14px] font-biotif__Medium text-primaryColor text-center bg-[#ECF2F6] duration-500 hover:bg-primaryColor hover:text-white"
          onClick={() => changeActivityCompleteStatus()}
          disabled={isUpdateActivityStatusLoading}
        >
          {headerInfo.activityStatus}{' '}
        </button>
        <Button className='i__Button mr-[10px] bg-[#E6E6E6] py-[4px] px-[17px] pr-[37px] text-black text-[14px] font-biotif__Medium rounded-[6px] h-[32px] relative before:content-[""] before:w-[8px] before:h-[8px] before:border-[2px] before:border-black before:absolute before:top-[10px] before:right-[12px] before:rotate-45 before:!border-t-0 before:!border-l-0 after:content-[""] after:absolute after:top-[9px] after:right-[28px] after:w-[1px] after:h-[14px] after:bg-black hover:text-white hover:before:border-white hover:after:bg-white'>
          Follow
        </Button>
      </div>
    </>
  );
};

export default ActivityDetailMobileHeader;
