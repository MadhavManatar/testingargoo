// ** Import Packages **
import Tippy from '@tippyjs/react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ** Components **
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import Icon from 'components/Icon';
import Image from 'components/Image';
import AssignTagsList from 'components/detail-components/AssignTags/AssignTagsList';
import { DetailHeaderEmail } from 'components/detail-components/detail-header-email';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Hooks **
import useAuth from 'hooks/useAuth';

// ** Types ** //
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

// ** Util **
import { copyToClipboard } from 'utils/util';

// ** Helper **
import FormField from 'components/FormField';
import { useForm } from 'react-hook-form';
import { useUpdateActivityMutation } from 'redux/api/activityApi';
import DetailHeaderPhone from 'components/detail-components/detail-header-phone';
import { IconTypeJson } from 'indexDB/indexdb.type';
import IconAnimation from 'components/IconAnimation';
// import Dropdown from 'components/Dropdown';

type ActivityDetailDesktopHeaderProps = {
  activityDetail: ActivityResponseType;
  activityRunningStatus: {
    status: boolean;
    log: activityLogResponse;
  };
  changeSetOpenModal: (val: ModalTypeProps) => void;
  headerInfo: ActivityHeaderInfo;
  setIsLinkDocument: Dispatch<SetStateAction<boolean>>;
} & AssignTagCommonProps;

const ActivityDetailDesktopHeader = (
  props: ActivityDetailDesktopHeaderProps
) => {
  const {
    activityDetail,
    activityRunningStatus,
    assignedTags,
    setAssignedTags,
    changeSetOpenModal,
    deleteAssignedTag,
    headerInfo,
    setIsLinkDocument,
  } = props;

  // ** Hooks **
  const { hasAuthorized } = useAuth();
  const formMethods = useForm<{ is_visibility: boolean }>();
  const { setValue, register } = formMethods;

  // ** APIS
  const [updateActivityByIdAPI] = useUpdateActivityMutation();

  useEffect(() => {
    setValue('is_visibility', activityDetail.is_visibility);
  }, [activityDetail]);

  const changeSubAccountEnableSetting = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const ActivityFormData = {
      is_visibility: event.target.checked,
    };
    if (activityDetail.id) {
      updateActivityByIdAPI({ id: activityDetail.id, data: ActivityFormData });
    }
    setValue('is_visibility', event.target.checked);
  };

  // ** Constants **
  const editTagsPermission = hasAuthorized([
    { module: ModuleNames.TAG, type: TagPermissions.ACTIVITY },
  ]);
  const { topic, activity_type } = activityDetail;
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
  const filedArray = [
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
  ];
  return (
    <div className="activityInner__topHeader__box flex flex-wrap border border-[#CCCCCC]/50 rounded-[12px] p-[20px] pb-[10px] mb-[20px] mt-[10px] sm:hidden">
      <div className="activityType flex flex-wrap content-center justify-center pr-[20px] w-[92px] relative before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[calc(100%_-_26px)] before:bg-[#CCCCCC]/50">
        {activity_type?.icon && activity_type?.icon_type === 'Default' ? (
          <Icon
            className="!w-[60px] !h-[60px] !p-[8px] rounded-[10px] !bg-primaryColor"
            iconType={activity_type.icon}
          />
        ) : (
          CustomIconType
        )}{' '}
        {headerInfo.activityType && (
          <p className="text-[16px] leading-[20px] text-[#2E3234] font-biotif__Medium text-center w-full mt-[10px] break-words">
            {headerInfo.activityType}
          </p>
        )}
      </div>
      <div className="right w-[calc(100%_-_93px)] pl-[20px] flex flex-wrap justify-between">
        <div className="main__details w-[36%] pr-[20px] 3xl:w-full 3xl:pr-0">
          <div className="flex flex-wrap">
            <Tippy
              content={topic || ''}
              zIndex={15}
              disabled={topic.length < 100}
            >
              <h3 className="text-black__TextColor800 text-[20px] font-biotif__Medium mr-[15px] mb-[3px] w-auto max-w-full ellipsis__2">
                {(topic || '').length > 100
                  ? `${topic.substring(0, 100)} ...`
                  : topic || ''}
              </h3>
            </Tippy>
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
            <h5 className="text-[#2E3234] text-[18px] font-biotif__Medium">
              {headerInfo.contactName}
            </h5>
          )}
          <div className="flex flex-wrap designation__wrapper">
            {(headerInfo?.contactJobRole ||
              headerInfo.accountName?.props?.children) && (
              <span
                className={`text-[16px] text-black__TextColor800 font-biotif__Regular relative pr-[10px] mr-[10px] mb-[6px] before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor ${
                  !headerInfo.dealOrLeadName?.props?.children
                    ? 'before:hidden'
                    : ''
                } `}
              >
                {headerInfo.contactJobRole}
                {headerInfo.contactNameAndJobRoleComma}
                {headerInfo.accountName}
              </span>
            )}
            {headerInfo.dealOrLeadName && (
              <span className="text-[16px] text-black__TextColor800 font-biotif__Regular relative pr-[10px] mr-[10px] mb-[6px] before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
                {headerInfo.dealOrLeadName}
              </span>
            )}
          </div>
          {(headerInfo?.contactPrimaryPhone ||
            headerInfo?.contactPrimaryEmail) && (
            <div className="contact__details mt-[0px]">
              {headerInfo?.contactPrimaryPhone?.value && (
                <div>
                  <ClickableMobile
                    number={headerInfo?.contactPrimaryPhone?.value}
                    rootClassName="text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColorSD hover:underline"
                  />
                </div>
              )}
              {headerInfo?.contactPrimaryEmail && (
                <div>
                  <ClickableEmail
                    mail={headerInfo?.contactPrimaryEmail}
                    textClassName="text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColorSD hover:underline"
                  />
                </div>
              )}
            </div>
          )}
          <div className="leading-normal">{headerInfo.title3}</div>
        </div>
        <div className="activityRR__details w-[64%] inline-flex flex-wrap content-between 3xl:w-full 3xl:mt-[15px]">
          <div className="bottom__details w-full">
            <div className="meetingCN__box flex flex-wrap items-center justify-end 3xl:justify-start xl:pr-0">
              {(activityDetail?.is_confirmed ||
                activityDetail?.meeting_status === 'yes') && (
                <>
                  <Icon
                    className="mr-[5px] mb-[6px]"
                    iconType="greenRightTickFilledIcon"
                  />
                  <div className="inline-block text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor">
                    Meeting Confirmed
                  </div>
                </>
              )}

              {activityDetail?.meeting_status === 'rejected' && (
                <>
                  <div className="i__Icon mr-[4px] p-[2px] mb-[8px]">
                    <div>
                      <svg
                        width="63"
                        height="62"
                        viewBox="0 0 63 62"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M31.5 58C46.4117 58 58.5 45.9117 58.5 31C58.5 16.0883 46.4117 4 31.5 4C16.5883 4 4.5 16.0883 4.5 31C4.5 45.9117 16.5883 58 31.5 58Z"
                          fill="#FF0000"
                        />
                        <path
                          d="M33.5741 31.5L44.527 20.5109C45.1091 19.9287 45.1091 19.019 44.527 18.4368C43.9448 17.8544 43.035 17.8544 42.4529 18.4368L31.5 29.4259L20.5109 18.473C19.9287 17.8909 19.019 17.8909 18.4368 18.473C17.8544 19.0552 17.8544 19.965 18.4368 20.5471L29.4259 31.5L18.473 42.4891C17.8909 43.0713 17.8909 43.981 18.473 44.5632C19.0552 45.1456 19.965 45.1456 20.5471 44.5632L31.5 33.5741L42.4891 44.5632C43.0713 45.1456 43.981 45.1456 44.5632 44.5632C45.1456 43.981 45.1456 43.0713 44.5632 42.4891L33.5741 31.5Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="inline-block text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor">
                    Meeting Decline
                  </div>
                </>
              )}
              {activityDetail?.meeting_status === 'tentative yes' && (
                <>
                  <div className="i__Icon mr-[4px] p-[2px] mb-[8px]">
                    <div>
                      <svg
                        width="62"
                        height="62"
                        viewBox="0 0 62 62"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M31 58C45.9117 58 58 45.9117 58 31C58 16.0883 45.9117 4 31 4C16.0883 4 4 16.0883 4 31C4 45.9117 16.0883 58 31 58Z"
                          fill="#737373"
                        />
                        <path
                          d="M31 13C29.5798 13 28.4286 14.2424 28.4286 15.775L28.8571 39.3625C28.8571 40.6396 29.8166 41.675 31 41.675C32.1836 41.675 33.1429 40.6396 33.1429 39.3625L33.5714 15.775C33.5714 14.2424 32.4201 13 31 13ZM31 43.525C29.3431 43.525 28 44.9744 28 46.7625C28 48.5506 29.3431 50 31 50C32.6569 50 34 48.5506 34 46.7625C34 44.9744 32.6569 43.525 31 43.525Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="inline-block text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor">
                    Meeting Tentative Yes
                  </div>
                </>
              )}
              <div className="inline-block text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor">
                <span className="text-black__TextColor600 pr-[4px]">Date:</span>
                {headerInfo.formattedStartDate}
              </div>
              <div className="inline-block text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor">
                <span className="text-black__TextColor600 pr-[4px]">Time:</span>
                {headerInfo.formattedTime}
              </div>
              <div className="inline-block text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor">
                <span className="text-black__TextColor600 pr-[4px]">
                  Duration:
                </span>
                {headerInfo.formattedDuration}
              </div>
              <div className="inline-block text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor">
                <div className="flex">
                  <span className="text-black/50 pr-[4px]">
                    Display on calendar:
                  </span>
                  <FormField
                    wrapperClass="toggleSwitch mb-0"
                    type="checkbox"
                    name="is_visibility"
                    register={register}
                    onChange={($event) => {
                      changeSubAccountEnableSetting(
                        $event as React.ChangeEvent<HTMLInputElement>
                      );
                    }}
                  />
                </div>
              </div>
              {headerInfo.reminder.isShow && (
                <div className="inline-block text-[14px] text-ipBlack__textColor font-biotif__Medium relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor">
                  {headerInfo.reminder.title}
                  {headerInfo.reminder.singleReminder}
                  {headerInfo.reminder.allReminder}
                </div>
              )}
            </div>

            {headerInfo?.zoomMeetingLink && (
              <div className="copyMeetingLink flex items-center justify-end xl:justify-start">
                <span className="label text-[#467CA7] text-[14px] font-biotif__Medium">
                  Meeting Link:
                </span>
                <Link
                  className="text-[#6697BF] text-[14px] font-biotif__Medium inline-block ml-[5px] max-w-[calc(100%_-_134px)] whitespace-pre text-ellipsis overflow-hidden hover:underline"
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
        </div>
      </div>
      <div className="activity__topHeader__footer mt-[24px] pt-[20px] border-t border-whiteScreen__BorderColor w-full flex flex-wrap items-center justify-between xl:mt-[14px]">
        <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center">
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
            <Tippy zIndex={10} content="Notes">
              <div
                className="link__wrapper"
                onClick={() => changeSetOpenModal('note')}
              >
                <IconAnimation
                  iconType="mobileMenuFilled"
                  animationIconType={IconTypeJson.Notes}
                  className="socian__ani__icon__wrapper"
                />
              </div>
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
            <div className="link__wrapper">
              <Tippy
                className="tippy__dropdown"
                trigger="click"
                hideOnClick
                theme="light"
                content={
                  <div>
                    <ul className="tippy__dropdown__ul">
                      {filedArray.map((val) => {
                        return (
                          <div
                            key={window.crypto.randomUUID()}
                            className="item"
                            onClick={val.onClick}
                          >
                            <div className="item__link">
                              <span className="item__text">{val.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                }
                placement="bottom-start"
              >
                <Tippy content="Documents" zIndex={999}>
                  <div
                    ref={(ref) => {
                      if (!ref) return;
                      ref.onclick = (e) => {
                        e.stopPropagation();
                      };
                    }}
                  >
                    <IconAnimation
                      iconType="attachmentFilledIcon"
                      animationIconType={IconTypeJson.Documents}
                      className="socian__ani__icon__wrapper"
                    />
                  </div>
                </Tippy>
              </Tippy>
            </div>
          </AuthGuard>
          <AuthGuard
            permissions={[
              {
                module: ModuleNames.TAG,
                type: TagPermissions.ACTIVITY,
              },
            ]}
          >
            <Tippy zIndex={10} content="Tags">
              <div
                className="link__wrapper"
                onClick={() => changeSetOpenModal('tag')}
              >
                <IconAnimation
                  iconType="offerTagsFilledIcon"
                  animationIconType={IconTypeJson.Spacing}
                  className="socian__ani__icon__wrapper"
                />
              </div>
            </Tippy>
          </AuthGuard>
        </div>
        {!activityRunningStatus.status && (
          <div className="inline-flex mb-[10px]">{headerInfo.logOnTime}</div>
        )}
      </div>
    </div>
  );
};

export default ActivityDetailDesktopHeader;
