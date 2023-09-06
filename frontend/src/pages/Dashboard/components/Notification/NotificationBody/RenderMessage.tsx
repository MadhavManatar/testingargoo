import { UserNotification } from '../types/notification.types';
import _ from 'lodash';
import Image from 'components/Image';
import { convertAtoB, usCurrencyFormat, htmlToString } from 'utils/util';
import Icon from 'components/Icon';

interface Props {
  data: UserNotification;
  showMoreHandler?: () => void;
  showMore?: boolean;
}

const alertNotificationType = [
  'new_location_login',
  'failed_login_attempts',
  'reset_pass_request',
  'delete_deals',
  'invite_user',
  'delete_contacts',
  'delete_accounts',
  'delete_stage_pipeline',
];

const RenderMessage = ({ data, showMoreHandler, showMore }: Props) => {
  const { groupNotifications, notification } = data || {};
  // ** notification data **
  const { timeline = {}, alertType = '' } = notification?.message || {};
  const { fieldName = '' } = timeline?.message || {};
  let { newValue = '' } = timeline?.message || {};
  let actionType = timeline?.action;
  let addTags: any[] = [];
  let addRelatedContact: any[] = [];
  if (alertNotificationType.includes(alertType)) {
    actionType = 'Alert';
  }
  if (groupNotifications && showMore === false) {
    actionType = 'GroupNotification';
  }
  if (
    (!groupNotifications || (groupNotifications && showMore)) &&
    fieldName?.indexOf('Tag') !== -1
  ) {
    actionType = 'TagCreated';
    if (
      timeline?.message?.newValue instanceof Array &&
      timeline?.message?.oldValue instanceof Array
    ) {
      addTags = _.differenceBy(
        timeline?.message?.newValue,
        timeline?.message?.oldValue,
        'value'
      );
      addTags = [
        ...addTags,
        ..._.differenceBy(
          timeline?.message?.oldValue,
          timeline?.message?.newValue,
          'value'
        ),
      ];
    } else {
      addTags = _.differenceBy(
        [timeline?.message?.newValue],
        [timeline?.message?.oldValue],
        'value'
      );
      addTags = [
        ...addTags,
        ..._.differenceBy(
          [timeline?.message?.newValue],
          [timeline?.message?.oldValue],
          'value'
        ),
      ];
    }
  }

  if (
    (!groupNotifications || (groupNotifications && showMore)) &&
    fieldName === 'Related Contacts'
  ) {
    actionType = 'RelatedContact';
    if (
      timeline?.message?.newValue instanceof Array &&
      timeline?.message?.oldValue instanceof Array
    ) {
      addRelatedContact = _.differenceBy(
        timeline?.message?.newValue,
        timeline?.message?.oldValue,
        'value'
      );
      addRelatedContact = [
        ...addRelatedContact,
        ..._.differenceBy(
          timeline?.message?.oldValue,
          timeline?.message?.newValue,
          'value'
        ),
      ];
    } else {
      addRelatedContact = _.differenceBy(
        [timeline?.message?.newValue],
        [timeline?.message?.oldValue],
        'value'
      );
      addRelatedContact = [
        ...addRelatedContact,
        ..._.differenceBy(
          [timeline?.message?.newValue],
          [timeline?.message?.oldValue],
          'value'
        ),
      ];
    }
  }
  if (
    (!groupNotifications || (groupNotifications && showMore)) &&
    timeline?.note
  ) {
    const noteElem = document.createElement('div');
    if (noteElem !== null) {
      noteElem.innerHTML = convertAtoB(timeline?.note?.description);
      newValue = { value: noteElem.innerText };
    }
  }

  if (
    (!groupNotifications || (groupNotifications && showMore)) &&
    timeline?.documents?.length > 0
  ) {
    actionType = 'Documents';
  }
  if (fieldName === 'Collaborators' || fieldName === 'Guests') {
    newValue = {
      value: newValue?.map((item: { value: string }) => item?.value).join(', '),
    };
  }

  switch (actionType || notification?.message?.comment) {
    case 'GroupNotification':
      if (showMore) {
        actionType = timeline?.action;
      }

      return (
        <div
          id={`${data?.notification_id}_groupNotification`}
          className="more__account__wrapper flex items-center mt-[5px]"
        >
          {showMore === false && (
            <>
              <div className="img__wrapper inline-flex items-center w-[20px] h-[20px]">
                <Image
                  imgPath={data?.notification?.creator?.profile_image}
                  first_name={data?.notification?.creator?.first_name}
                  last_name={data?.notification?.creator?.last_name}
                  serverPath
                />
              </div>
              <span
                onClick={() => showMoreHandler && showMoreHandler()}
                className="text-[12px] font-biotif__Medium text-primaryColor cursor-pointer w-[calc(100%_-_21px)] pl-[6px] pt-[1px]"
              >
                +{groupNotifications?.length} update from{' '}
                {data?.notification?.creator?.full_name}
              </span>
            </>
          )}
        </div>
      );
    case 'TagCreated':
      if (
        notification?.message?.comment !== undefined &&
        typeof notification?.message?.comment === 'string'
      ) {
        return (
          <div>
            <div className="extra__contant__wrapper px-[14px] py-[7px] pb-[2px] mt-[10px] bg-black/[0.03] rounded-[8px]">
              {addTags
                .filter((item) => item.value !== 'Blank')
                ?.map((tag, tagIndex) => {
                  return (
                    <>
                      <span
                        key={`${tag}_notification_tag_${tagIndex}`}
                        className="badge square__round text-white mr-[8px] mb-[5px] py-[3px] px-[8px] lg:text-[12px] lg:px-[10px]"
                        style={{ backgroundColor: tag?.tagColor }}
                      >
                        {tag?.value}
                      </span>
                    </>
                  );
                })}
            </div>
            <div className="mt-[8px]">
              {htmlToString(notification?.message.comment || '')}
            </div>
          </div>
        );
      }

      return (
        <div className="extra__contant__wrapper px-[14px] py-[7px] pb-[2px] mt-[10px] bg-black/[0.03] rounded-[8px]">
          {addTags
            .filter((item) => item.value !== 'Blank')
            ?.map((tag, tagIndex) => {
              return (
                <span
                  key={`${tag}_notification_tag_${tagIndex}`}
                  className="badge square__round text-white mr-[8px] mb-[5px] py-[3px] px-[8px] lg:text-[12px] lg:px-[10px]"
                  style={{ backgroundColor: tag?.tagColor }}
                >
                  {tag?.value}
                </span>
              );
            })}
        </div>
      );

    case 'RelatedContact':
      if (
        notification?.message?.comment !== undefined &&
        typeof notification?.message?.comment === 'string'
      ) {
        return (
          <div>
            <div className="extra__contant__wrapper px-[14px] py-[7px] pb-[2px] mt-[10px] bg-black/[0.03] rounded-[8px]">
              {addRelatedContact
                .filter((item) => item.value !== 'Blank')
                ?.map((relatedContact, relatedContactIndex) => {
                  return (
                    <>
                      <span
                        key={`${relatedContact}_notification_tag_${relatedContactIndex}`}
                        className="text-[14px] font-biotif__Regular text-black/50"
                      >
                        {relatedContact?.value}
                      </span>
                    </>
                  );
                })}
            </div>
            <div className="mt-[8px]">
              {htmlToString(notification?.message.comment || '')}
            </div>
          </div>
        );
      }

      return (
        <div className="extra__contant__wrapper px-[14px] py-[7px] pb-[2px] mt-[10px] bg-black/[0.03] rounded-[8px]">
          {addRelatedContact
            .filter((item) => item.value !== 'Blank')
            ?.map((relatedContact, relatedContactIndex) => {
              return (
                <span
                  key={`${relatedContact}_notification_tag_${relatedContactIndex}`}
                  className="text-[14px] font-biotif__Regular text-black/50"
                >
                  {relatedContact?.value}
                </span>
              );
            })}
        </div>
      );

    case 'Documents':
      return (
        <div className="extra__contant__wrapper px-[14px] pl-[10px] py-[7px] mt-[10px] bg-black/[0.03] rounded-[8px] flex items-center">
          {timeline?.documents[0]?.type === 'file' ? (
            <>
              <Icon
                className="shrink-0 mr-[4px]"
                iconType="fileIconFilledPrimaryColor"
              />
              <a
                className="inline-block w-full whitespace-pre overflow-hidden text-ellipsis"
                href={timeline?.documents[0]?.url}
                target="_blank"
                rel="noreferrer"
              >
                {timeline?.documents[0]?.doc_details?.original_name}
              </a>
            </>
          ) : (
            <a
              href={timeline?.documents[0]?.url}
              target="_blank"
              rel="noreferrer"
            >
              {timeline?.documents[0]?.url}
            </a>
          )}
        </div>
      );
    case 'Alert':
      return <></>;

    default:
      if (
        notification?.message?.comment !== undefined &&
        typeof notification?.message?.comment === 'string'
      ) {
        return (
          <>
            <div className="extra__contant__wrapper px-[14px] py-[7px] mt-[10px] bg-black/[0.03] rounded-[8px]">
              <p className="text-[14px] font-biotif__Regular text-black/50">
                {['Deal Value', 'Lead Value'].includes(fieldName) ? (
                  <span className="text-black tracking-[0.5px] text-ip__SuccessGreen">
                    {usCurrencyFormat(newValue?.value)}
                  </span>
                ) : (
                  <>{newValue?.value || newValue?.emailTo}</>
                )}
              </p>
            </div>
            <div className="mt-[8px]">
              {htmlToString(notification?.message.comment || '')}
            </div>
          </>
        );
      }

      return (
        <div className="extra__contant__wrapper px-[14px] py-[7px] mt-[10px] bg-black/[0.03] rounded-[8px]">
          <p className="text-[14px] font-biotif__Regular text-black/50">
            {['Deal Value', 'Lead Value'].includes(fieldName) ? (
              <span className="text-black tracking-[0.5px] text-ip__SuccessGreen">
                {usCurrencyFormat(newValue?.value)}
              </span>
            ) : (
              <>{newValue?.value || newValue?.emailTo}</>
            )}
          </p>
        </div>
      );
  }
};

export default RenderMessage;
