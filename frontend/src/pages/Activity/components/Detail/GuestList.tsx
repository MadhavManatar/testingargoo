import RedirectToGoogleMap from 'components/Address/components/RedirectToGoogleMap';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import QuickLookCardModal from 'components/EntityDetails/QuickLookCard/QuickLookCardModal';
import Icon from 'components/Icon';
import Image from 'components/Image';
import { ModuleNames } from 'constant/permissions.constant';
import { ActivityGuest, ActivityResponseType } from 'pages/Activity/types/activity.types';
import InfoWrapper from 'components/EntityDetails/InfoWrapper';
import { useNavigate } from 'react-router-dom';
import { setUrlParams } from 'utils/util';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useEffect, useState } from 'react';
import { EmailModalType } from 'pages/Dashboard/types/dashboard.types';
import AddContactModal from 'pages/Contact/components/AddContactModal';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';
import { useSendInvitationMailMutation } from 'redux/api/activityApi';
import Button from 'components/Button';
import { useGetActivityDetail, useLoadOtherActivityRelatedDataHooks } from 'pages/Activity/hooks/useActivityService';
import { ACTIVITY_TYPE_MAIL_STATUS } from 'constant/activity.constant';

interface Props {
  guest: ActivityGuest;
  activityDetail: ActivityResponseType;
}
const GuestList = (props: Props) => {
  const { guest, activityDetail } = props;
  const { address1, address2, city, state, country, zip } = guest;
  const navigate = useNavigate();
  const redirectToAccount = () => {
    if (!guest.is_new_guest) {
      navigate(
        setUrlParams(PRIVATE_NAVIGATION.contacts.detailPage, guest?.id || 0)
      );
    }
  };

  const [modal, setModal] = useState<EmailModalType>();
  const [meetingStatus, setMeetingStatus] = useState<string>();

  const openModal = (modalType: EmailModalType) => setModal(modalType);
  const closeModal = () => setModal(undefined);

  // ** APIS **
  const [senInvitationMailByIdAPI, { isLoading: isChangeMailStatusLoading }] =
    useSendInvitationMailMutation();

  // Custom Hooks
  const { activityTypeEmailStatus } = useLoadOtherActivityRelatedDataHooks();

  // ** custom hooks **
  const {
    getActivity
  } = useGetActivityDetail();

  const meetingStatusManage = () => {
    let value;

    if (guest.is_confirm) {
      value = 'Confirmed';
    } else
      if (!guest.is_confirm) {
        if (guest?.email_status) {
          if (guest?.email_status === ACTIVITY_TYPE_MAIL_STATUS.AUTOMATIC) {
            value = 'Invitation Sent';
          } else if (guest?.email_status === ACTIVITY_TYPE_MAIL_STATUS.MANUAL) {
            if (guest?.is_mail_sent_success) {
              value = 'Invitation Sent';
            } else {
              value = 'Invitation Not Sent Yet';
            }
          } else {
            value = 'Invitation Not Sent Yet';
          }
          if (guest.meeting_status && guest.meeting_status === 'rejected') {
            value = 'Decline';
          } else if (guest.meeting_status === 'tentative yes') {
            value = 'Tentative Yes';
          }
        } else {
          if (
            !guest.meeting_status ||
            (guest.meeting_status && guest.meeting_status === 'no')
          ) {
            value = 'Invitation Sent';
          } else if (guest.meeting_status === 'NotSend') {
            value = 'Invitation Not Sent Yet';
          }
          if (guest.meeting_status && guest.meeting_status === 'rejected') {
            value = 'Decline';
          } else if (guest.meeting_status === 'tentative yes') {
            value = 'Tentative Yes';
          }
        }

      }
    setMeetingStatus(value);
    return value;
  };

  useEffect(() => {
    meetingStatusManage();
  }, [guest, meetingStatus]);




  // // sent activity invitation mail 
  const sendActivityInvitationMail = async (guestData: ActivityGuest) => {
    await sendMailToGuestApi(guestData)
  }

  const sendMailToGuestApi = async (guestData: ActivityGuest) => {
    const GuestInvitationMailData: ActivityGuest[] = [];
    const ParticipantData: ActivityGuest[] = [];
    if (guestData?.name) {
      const obj = {
        email: guestData?.email,
        participantId: guestData?.id
      }
      ParticipantData.push(obj)
    } else {
      const obj = {
        email: guestData?.email
      }
      GuestInvitationMailData.push(obj)
    }
    const ActivityTypeFormData = new FormData();
    if (GuestInvitationMailData.length > 0) {
      ActivityTypeFormData.append('guest', JSON.stringify(GuestInvitationMailData));
    } else {
      ActivityTypeFormData.append('participant', JSON.stringify(ParticipantData));
    }
    ActivityTypeFormData.append('activityId', JSON.stringify(activityDetail?.id));

    const activityTypeMailStatusData = activityTypeEmailStatus?.get(activityDetail?.activity_type_id);
    ActivityTypeFormData.append('email_status', JSON.stringify(activityTypeMailStatusData));
    ActivityTypeFormData.append('should_send_mail', 'true');

    const response = await senInvitationMailByIdAPI({
      data: ActivityTypeFormData,
    });

    if (response) {
      getActivity(activityDetail?.id)
    }
  };

  return (
    <div
      key={guest?.id}
      className="w-1/4 px-[10px] mb-[20px] 4xl:w-1/3 3xl:w-1/2 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 md:w-full sm:w-full sm:mb-[10px] sm:last:mb-0"
    >
      <div className="related__card__box related__guest__card__box">
        <div className="inner__wrapper">
          <div className="img__wrapper">
            <Image
              imgClassName="w-[34px] h-[34px] object-cover object-center rounded-full"
              first_name={guest?.name || guest.email}
              serverPath
            />
          </div>
          <div
            className="right__details"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <div className="details__wrapper">
              {guest.name && (
                <span
                  className="contact__name w-full"
                  onClick={() => redirectToAccount()}
                >
                  <InfoWrapper field={guest.name} isCustomLabelHide />
                </span>
              )}
              {!guest.is_new_guest && (
                <>
                  <button
                    className="toggle__btn edit__btn"
                    onClick={() => openModal('contact')}
                  >
                    <IconAnimation
                      iconType="eyeFilled"
                      animationIconType={IconTypeJson.View}
                      className="socian__ani__icon__wrapper"
                    />
                  </button>
                  <button
                    className="toggle__btn view__btn"
                    onClick={() => redirectToAccount()}
                  >
                    <IconAnimation
                      iconType="editFilled"
                      animationIconType={IconTypeJson.Edit}
                      className="socian__ani__icon__wrapper"
                    />
                  </button>
                </>
              )}
              <div className='flex justify-end mt-[10px]'>
                {(guest?.email_status !== undefined && guest?.email_status === ACTIVITY_TYPE_MAIL_STATUS.MANUAL) && (guest?.is_mail_sent_success === false) || ((guest?.email_status === ACTIVITY_TYPE_MAIL_STATUS.MANUAL) && (guest?.is_mail_sent_success === undefined) && (guest?.activity_email_setting === null || guest?.email_status === ACTIVITY_TYPE_MAIL_STATUS.MANUAL))
                  ? <>
                    <Button
                      isLoading={isChangeMailStatusLoading}
                      className="i__Button primary__Btn smaller__with__icon h-[30px] px-[20px]"
                      onClick={() => sendActivityInvitationMail(guest)}
                    >
                      Send mail
                    </Button>
                  </> : <></>}
              </div>
              <h5 className="designation">
                <InfoWrapper field={guest.job_role || ''} isCustomLabelHide />
              </h5>
              <div className="w-full leading-normal phone__wrapper">
                {guest.phone ? <ClickableMobile number={guest.phone} /> : null}
              </div>
              <div className="w-full leading-normal email__wrapper">
                {guest.email ? <ClickableEmail mail={guest.email} /> : null}
              </div>
              <div className="w-full leading-normal address__wrapper">
                <RedirectToGoogleMap
                  address={{
                    address1,
                    address2,
                    city,
                    state,
                    country,
                    zip,
                  }}
                />
              </div>
            </div>
            <div className="confirmed__text flex items-center mt-[5px] guest__card">
              {meetingStatus !== 'Decline' &&
                meetingStatus !== 'Tentative Yes' && (
                  <Icon
                    className={`mr-[4px] ${guest.is_confirm ? '' : 'not__confirmed'
                      } `}
                    iconType="greenRightTickFilledIcon"
                  />
                )}

              {meetingStatus === 'Decline' && (
                < div className="i__Icon mr-[4px] p-[2px]">
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
              )}
              {meetingStatus === 'Tentative Yes' && (
                < div className="i__Icon mr-[4px] p-[2px]">
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
              )}
              <span className="text-[14px] font-biotif__Medium text-black">
                {meetingStatus}
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-[50%] translate-x-[-50%] w-[calc(100%_-_36px)]">
            <QuickLookCardModal
              extraInfo={{
                email: guest?.email || '',
                phone: guest?.phone || '',
                phoneType: guest?.phoneType || '',
              }}
              modelName={ModuleNames.CONTACT}
              modelRecordId={guest.id || 0}
              activityEntityData={{
                id: guest.id || 0,
                name: guest?.name || '',
                type: ModuleNames.CONTACT,
              }}
            />
            {/* update contact modal */}
            {modal === 'contact' && (
              <AddContactModal
                id={guest?.id}
                isOpen={modal === 'contact'}
                closeModal={closeModal}
              />
            )}
          </div>
        </div>
      </div>
    </div >
  );
};

export default GuestList;
