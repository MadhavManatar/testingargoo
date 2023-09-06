// ** Import Packages **
import { useNavigate, useParams } from 'react-router-dom';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import DateFormat from 'components/DateFormat';
import Icon from 'components/Icon';
import Image from 'components/Image';
import DisplayRichTextContent from 'components/RichTextEditor/DisplayRichTextContent';
import PersonalSettingsViewSkeleton from 'pages/Setting/general-setting/PersonalSettings/skeletons/PersonalSettingsViewSkeleton';

// ** Services **
import { useGetUserDetails } from '../hooks/useUserService';

// ** Constants **
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Utils **
import { isAdministrator, isOrganizationOwner, isSelfId } from 'utils/is';
import { convertNumberOrNull, setUrlParams } from 'utils/util';
import Button from 'components/Button';
import { useRemoveUserSessionAPI } from 'pages/Setting/general-setting/SecuritySettings/ManageSessions/services/session.service';
import { useState } from 'react';
import AlertModal from 'components/Modal/AlertModal';

const UserView = () => {
  // ** Hooks **
  const navigate = useNavigate();

  const { id } = useParams();
  const userId = convertNumberOrNull(id);

  const isAdmin = isAdministrator();

  // ** states **
  const [isOpen, setIsOpen] = useState({
    sessionId: '',
    isOpen: false,
  });

  // ** Custom Hooks **
  const { currentUser, isUserLoading } = useGetUserDetails(userId);

  const {
    first_name,
    last_name,
    email,
    phone,
    mobile,
    zip,
    city,
    state,
    country,
    address1,
    address2,
    birth_date,
    facebook,
    twitter,
    linkedin,
    profile_image,
    roles,
    report_to_user,
    added_by_user,
    user_signature,
    initial_color
  } = currentUser;

  const handleEdit = () =>
    currentUser.id &&
    navigate(
      setUrlParams(PRIVATE_NAVIGATION.settings.user.edit, currentUser.id)
    );

  const isOrgOwner = isOrganizationOwner(currentUser.id);
  const isSelfUser = isSelfId(currentUser?.id);

  const { removeUserSessionAPI } = useRemoveUserSessionAPI();

  const removeSession = async () => {
    if (isOpen.isOpen && isOpen.sessionId) {
      const { data, error } = await removeUserSessionAPI(isOpen.sessionId);
      if (data || !error) {
        setIsOpen({ isOpen: false, sessionId: '' });
        const indexId = currentUser?.userSessions?.documents?.findIndex(
          (item) => item?.value?.sessionId === isOpen.sessionId
        );
        if (indexId) {
          currentUser?.userSessions?.documents?.splice(indexId, indexId);
        }
      }
    }
  };

  return (
    <>
      <Breadcrumbs path={BREAD_CRUMB.viewUser} />
      <div>
        {!isUserLoading ? (
          <>
            <div className="user__setting__edit__page border border-whiteScreen__BorderColor rounded-[20px]">
              <div className="flex flex-wrap items-center p-[30px] border-b border-b-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[20px] 3xl:pb-[13px] sm:block">
                <div className="inline-block profile__img relative">
                  <Image
                    first_name={first_name || ''}
                    last_name={last_name || ''}
                    imgPath={profile_image || ''}
                    serverPath
                    color={initial_color || ''}
                  />
                  <span className="onlineState inline-block absolute bottom-[10px] right-[-2px] w-[14px] h-[14px] rounded-full bg-ip__SuccessGreen border-[2px] border-ipWhite__borderColor" />
                </div>
                <div className="w-[calc(100%_-_72px)] pl-[12px] sm:w-full sm:pl-0 sm:mt-[15px]">
                  <h6 className="text-[16px] text-black__TextColor800 font-biotif__Medium mb-[5px] flex items-center">
                    {[first_name, last_name].join(' ')}
                    <span className="rounded-[50px] text-[10px] uppercase text-white font-semibold bg-ip__Orange py-[3px] px-[8px] inline-block ml-[8px]">
                      {isOrgOwner ? 'Super admin' : roles?.[0]?.name}
                    </span>
                  </h6>
                  {email ? (
                    <ClickableEmail
                      isIconVisible
                      rootClassName="mr-[20px] mb-[10px] max-w-full"
                      iconClassName="highlighted !w-[30px] !h-[30px] !rounded-[7px] !p-[6px] mr-[7px]"
                      textClassName="inline-block text-[14px] font-biotif__Regular text-primaryColor max-w-[calc(100%_-_37px)] pt-[5px]"
                      mail={email}
                    />
                  ) : (
                    <></>
                  )}
                  {phone ? (
                    <ClickableMobile
                      number={phone}
                      isIconVisible
                      rootClassName="mr-[20px] mb-[10px] max-w-full"
                      iconClassName="highlighted !w-[30px] !h-[30px] !rounded-[7px] !p-[6px] mr-[7px]"
                      textClassName="inline-block text-[14px] font-biotif__Regular text-primaryColor max-w-[calc(100%_-_37px)] pt-[5px]"
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className="p-[30px] border-b border-b-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[22px]">
                <h3 className="setting__FieldTitle">
                  <span>User Information</span>
                  <button>
                    <Icon
                      onClick={() => handleEdit()}
                      iconType="editFilled"
                      className={`highlighted !w-[30px] !h-[30px] !p-[6px] !rounded-[7px] 
                      ${isOrgOwner ? (isSelfUser ? '' : 'hidden') : ''}
                      `}
                    />
                  </button>
                </h3>
                <div className="flex flex-wrap mx-[-10px]">
                  <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">First Name</p>
                    <p className="ipInfo__View__Value">{first_name || ''}</p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Last Name</p>
                    <p className="ipInfo__View__Value">{last_name || ''}</p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Profile</p>
                    <p className="ipInfo__View__Value">
                      {isOrgOwner ? 'Super admin' : roles?.[0]?.name}
                    </p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Added By</p>
                    <p className="ipInfo__View__Value">
                      {added_by_user?.full_name || ''}
                    </p>
                  </div>

                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Phone</p>
                    <p className="ipInfo__View__Value">
                      {phone ? <ClickableMobile number={phone} /> : ''}
                    </p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Mobile</p>
                    <p className="ipInfo__View__Value">
                      {mobile ? <ClickableMobile number={mobile} /> : ''}
                    </p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Email</p>
                    <p className="ipInfo__View__Value link">
                      {email ? <ClickableEmail mail={email} /> : ''}
                    </p>
                  </div>
                  {!isOrgOwner && (
                    <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                      <p className="ipInfo__View__Label">Report To</p>
                      <p className="ipInfo__View__Value">{`${report_to_user?.user_reporter.full_name
                        ? report_to_user?.user_reporter.full_name
                        : ''
                        }`}</p>
                    </div>
                  )}

                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Birth Date</p>
                    <p className="ipInfo__View__Value">
                      {birth_date ? <DateFormat date={birth_date} /> : ''}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-[30px] border-b border-b-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[22px]">
                <h3 className="setting__FieldTitle">Address</h3>
                <div className="flex flex-wrap mx-[-10px]">
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Address Line 1</p>
                    <p className="ipInfo__View__Value">{address1 || ''}</p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Address Line 2</p>
                    <p className="ipInfo__View__Value">{address2 || ''}</p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">City</p>
                    <p className="ipInfo__View__Value">{city || ''}</p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">State</p>
                    <p className="ipInfo__View__Value">{state?.name || ''}</p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Zip</p>
                    <p className="ipInfo__View__Value">{zip || ''}</p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Country</p>
                    <p className="ipInfo__View__Value">{country?.name || ''}</p>
                  </div>
                </div>
              </div>
              <div className="p-[30px] border-b border-b-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[22px]">
                <h3 className="setting__FieldTitle">Social Media Profiles</h3>
                <div className="flex flex-wrap mx-[-10px]">
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Facebook</p>
                    <p className="ipInfo__View__Value">
                      {facebook ? (
                        <a href={facebook} target="_blank" rel="noreferrer">
                          {facebook}
                        </a>
                      ) : (
                        ''
                      )}
                    </p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Twitter</p>
                    <p className="ipInfo__View__Value">
                      {twitter ? (
                        <a href={twitter} target="_blank" rel="noreferrer">
                          {twitter}
                        </a>
                      ) : (
                        ''
                      )}
                    </p>
                  </div>
                  <div className="ipInfo__ViewBox w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">LinkedIn</p>
                    <p className="ipInfo__View__Value">
                      {linkedin ? (
                        <a href={linkedin} target="_blank" rel="noreferrer">
                          {linkedin}
                        </a>
                      ) : (
                        ''
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-[30px] 3xl:px-[15px] 3xl:py-[22px]">
                <h3 className="setting__FieldTitle">User Signature</h3>
                <div className="flex flex-wrap mx-[-10px]">
                  {user_signature ? (
                    <>
                      <div
                        className="ipInfo__ViewBox w-full font-biotif__Medium text-[15px] text-light__TextColor"
                        id="userSignature"
                      >
                        <DisplayRichTextContent information={user_signature} />
                      </div>
                    </>
                  ) : (
                    <span className="ml-[10px]">-</span>
                  )}
                </div>
              </div>
              {isAdmin &&
                currentUser?.userSessions?.documents &&
                currentUser?.userSessions?.documents?.length > 0 && (
                  <div className="p-[30px] 3xl:px-[15px] 3xl:py-[22px]">
                    <h3 className="setting__FieldTitle">User Session</h3>
                    <div className="flex flex-wrap mx-[-10px]">
                      {currentUser?.userSessions?.documents?.map(
                        (session, index) => {
                          const deviceData = session?.value?.deviceData;
                          const deviceIcon =
                            (deviceData?.device?.type === 'smartphone' &&
                              'mobileStrokeIcon') ||
                            (deviceData?.device?.type === 'tablet' &&
                              'tabletStrokeIcon') ||
                            'laptopStrokeIcon';

                          return (
                            <div
                              key={`${index}_userView_session`}
                              className="px-[10px] w-1/3 mb-[20px]"
                            >
                              <div className="border border-[#CCCCCC]/50 rounded-[12px] flex flex-wrap items-center py-[15px] px-[15px] mb-[14px] h-full">
                                <div className="border-b border-b-[#CCCCCC]/50 pb-[14px] mb-[14px] w-full flex justify-between items-center">
                                  <div className="inline-flex items-center">
                                    <Icon
                                      className="!w-[46px] !h-[46px] shrink-0 !p-0"
                                      iconType={deviceIcon}
                                    />
                                    <div className="flex flex-wrap items-center ml-[14px]">
                                      <p className="text-[16px] w-full font-biotif__SemiBold text-ipBlack__textColor leading-[20px]">
                                        Device
                                      </p>
                                      <p className="text-[16px] w-full font-biotif__Regular text-ipBlack__textColor leading-[20px] capitalize">
                                        {deviceData?.device?.type}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    className="shrink-0 bg-[#1776BA]/10 py-[10px] px-[10px] text-[14px] font-biotif__Medium text-primaryColor hover:!bg-primaryColor hover:!text-white"
                                    onClick={() =>
                                      setIsOpen({
                                        isOpen: true,
                                        sessionId: session?.value?.sessionId,
                                      })
                                    }
                                  >
                                    Disconnect
                                  </Button>
                                </div>
                                {Object.entries(deviceData)
                                  .reverse()
                                  .map((item, itemIndex) => {
                                    return (
                                      <div
                                        key={`${item}_userView_session${itemIndex}`}
                                        className="w-full mb-[10px] flex flex-wrap last:mb-0"
                                      >
                                        <span className="device__name w-full mb-[6px] text-[16px] font-biotif__SemiBold text-black whitespace-pre overflow-hidden text-ellipsis capitalize">
                                          {item[0]}
                                        </span>
                                        <div className="mx-[-8px] w-full flex flex-wrap">
                                          {Object.entries(item[1]).map(
                                            (val) => {
                                              if (val[1] !== '')
                                                return (
                                                  <div
                                                    key={`${val}_detail`}
                                                    className="px-[8px] w-1/2 mb-[5px]"
                                                  >
                                                    <div className="value__row font-biotif__Medium text-[14px] text-ipBlack__textColor">
                                                      <span className="capitalize label">
                                                        {val[0].replaceAll(
                                                          '_',
                                                          ' '
                                                        )}
                                                        :-
                                                      </span>{' '}
                                                      <span className="capitalize inline-block text-light__TextColor">
                                                        {val[1]}
                                                      </span>
                                                    </div>
                                                  </div>
                                                );
                                              return undefined;
                                            }
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
            </div>
          </>
        ) : (
          <PersonalSettingsViewSkeleton />
        )}
      </div>
      <AlertModal
        visible={isOpen.isOpen}
        onClose={() => setIsOpen({ ...isOpen, isOpen: false })}
        onCancel={() => setIsOpen({ ...isOpen, isOpen: false })}
        onSubmit={() => removeSession()}
        width="800px"
        submitButtonText="Yes"
        cancelButtonText="No"
        submitButtonClass="bg-ip__SuccessGreen"
        customIcon={<Icon className="w-full h-full" iconType="alertIcon" />}
      >
        <h5 className="confirmation__title">
          Are you sure you want to disconnect this device
        </h5>
      </AlertModal>
    </>
  );
};

export default UserView;
