// ** external packages **
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// ** components **
import Icon from 'components/Icon';
import NoDataFound from 'components/EntityDetails/Timeline/components/NoDataFound';

// ** types **
import {
  CustomLabel,
  EmailListingRow,
  EmailDetail,
} from 'pages/Email/types/email.type';
import { EmailTableContentProps } from '../types/email-table-content.types';
import { SelectedMailType } from '../types/email.types';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { TokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

// ** others **
import { checkAndReturnActualDateOrTime, setUrlParams } from 'utils/util';
import EmailRowsSkeleton from 'components/skeletons/EmailRowsSkeleton';

const EmailTableContent = (props: EmailTableContentProps) => {
  const {
    emails,
    tabClassName,
    SetSelectedMails,
    emailTabs,
    showMailIcon,
    selectedMailData_Filter,
    openModalWithEditMode,
    isLoading,
  } = props;

  // ** hooks **
  const navigate = useNavigate();

  // ** states **
  const [selectedMailData, setSelectedMailData] = useState<SelectedMailType[]>(
    []
  );

  useEffect(() => {
    if (SetSelectedMails) {
      SetSelectedMails(selectedMailData);
    }
  }, [selectedMailData]);

  useEffect(() => {
    switch (selectedMailData_Filter) {
      case 'All':
        setSelectedMailData(
          emails.rows.map((item) => ({
            id: item.id,
            is_read: item.is_read,
            provider: item.provider,
          }))
        );
        break;
      case 'None':
        setSelectedMailData([]);
        break;
      case 'Read':
        setSelectedMailData(
          emails.rows
            .filter((item) => item.is_read)
            .map((item) => ({
              id: item.id,
              is_read: item.is_read,
              provider: item.provider,
            }))
        );
        break;
      case 'Unread':
        setSelectedMailData(
          emails.rows
            .filter((item) => !item.is_read)
            .map((item) => ({
              id: item.id,
              is_read: item.is_read,
              provider: item.provider,
            }))
        );
        break;
      default:
    }
  }, [selectedMailData_Filter]);

  if (isLoading) {
    return <EmailRowsSkeleton />;
  }
  if (!emails.count) {
    return <NoDataFound />;
  }

  const onChange = async (e: any, item: EmailListingRow) => {
    if (e.target.checked) {
      const tempNew = [...selectedMailData];
      if (!tempNew.find((obj) => obj.id === item?.id)) {
        tempNew.push({
          id: item.id,
          is_read: item.is_read,
          provider: item.provider,
        });
      }
      setSelectedMailData([...tempNew]);
    } else {
      const tempNew = selectedMailData.filter(
        (tempObj) => tempObj.id !== item?.id
      );
      setSelectedMailData([...tempNew]);
    }
  };
  const providerImg: { [key in TokenProvider]?: string } = {
    [TokenProvider.GOOGLE_MAIL]: '/images/gmail__icon.svg',
    [TokenProvider.MICROSOFT]: '/images/microsoft__Outlook__icon.svg',
    [TokenProvider.OUTLOOK]: '/images/microsoft__Outlook__icon.svg',
    [TokenProvider.SMTP]: '/images/smtp.jpeg',
    [TokenProvider.All]: '/images/email__icon.svg',
  };

  const getEmailsRecipientsName = (messages: EmailDetail[]) => {
    if (emailTabs === CustomLabel.SENT) {
      const allRecipients = messages
        ?.slice()
        .sort((a, b) => {
          return (
            new Date(a?.send_date).getTime() - new Date(b?.send_date).getTime()
          );
        })
        .flatMap((res) => res.email_recipients);
      const allEmails = allRecipients
        ?.filter((obj) => obj?.field === 'to' || obj?.field === 'cc')
        ?.flatMap((obj) => obj?.emails)
        .map((obj) => obj?.email);
      return (
        allEmails
          ?.filter((item, index) => allEmails.indexOf(item) === index)
          .join(', ') || ''
      );
    }
    return messages[0].from_email_address;
  };

  return (
    <>
      <div className={`inboxMail__wrapper ${tabClassName}`}>
        {React.Children.toArray(
          emails?.rows?.map((item) => {
            return (
              <div
                className={`inboxMail__row ${!item.is_read ? '' : 'unread'}`}
                onClick={() => {
                  if (openModalWithEditMode) {
                    openModalWithEditMode(
                      item.messages[0].id,
                      item.id,
                      item.messages[0].schedule_mail.delay_date_time
                    );
                  } else if (item.messages[0].email_conversion_id) {
                    navigate(
                      `${setUrlParams(
                        PRIVATE_NAVIGATION.email.detailPage,
                        item.messages[0].email_conversion_id
                      )}?emailTabs=${emailTabs}&read=${item.is_read}`
                    );
                  }
                }}
              >
                <div className="inboxMail__cell checkbox__wrapper">
                  <div className="inner__wrapper relative">
                    <input
                      ref={(ref: HTMLInputElement | null) => {
                        if (!ref) return;
                        ref.onclick = (e) => {
                          onChange(e, item);
                          e.stopPropagation();
                        };
                      }}
                      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-[2]"
                      type="checkbox"
                      checked={
                        !!selectedMailData.find((obj) => obj.id === item.id)
                      }
                      onChange={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    />
                    <div className="checkboxSquare w-[18px] h-[18px] rounded-[3px] border border-greyScreen__BorderColor mx-auto relative duration-500 after:content-[''] after:w-[9px] after:h-[5px] after:absolute after:top-[5px] after:left-[4px] after:border-b-[2px] after:border-l-[2px] after:border-white after:rotate-[-45deg] after:opacity-0 after:duration-[500ms]" />
                  </div>
                </div>
                {showMailIcon && (
                  <div className="inboxMail__cell provider__logo">
                    <img
                      className="w-[15px]"
                      src={`${providerImg[item.provider]}`}
                      alt=""
                    />
                  </div>
                )}
                {tabClassName === 'draft' && (
                  <div className="inboxMail__cell edit__btn">
                    <button>
                      <Icon
                        className="!w-[28px] !h-[28px] duration-500 !p-[5px] rounded-[6px] hover:bg-ip__Grey__hoverDark"
                        iconType="editFilled"
                      />
                    </button>
                  </div>
                )}
                <div className="inboxMail__cell subject flex items-center">
                  <span className="inline-block max-w-full text-ellipsis overflow-hidden">
                    {getEmailsRecipientsName(item.messages)}
                  </span>
                  {item?.messages_count && +item.messages_count > 1 && (
                    <span className="inline-block shrink-0 ml-[7px] text-[14px] font-biotif__Regular">
                      {item?.messages_count}
                    </span>
                  )}
                </div>
                <div className="inboxMail__cell excerpt">
                  <span className="highlight__text">
                    {item.conversation_subject || '(no subject)'} -
                  </span>{' '}
                  {item.messages[0].short_description}
                </div>
                {emailTabs === CustomLabel.SCHEDULED &&
                item.messages[0]?.schedule_mail ? (
                  <div className="inboxMail__cell time">
                    <Icon
                      className="mr-[5px] flex-shrink-0"
                      iconType="watchFilled"
                    />
                    <span className="inline-block whitespace-pre">
                      {/* {checkAndReturnActualDateOrTime(
                        item.messages[0].schedule_mail.delay_date_time
                      )} */}
                      {format(
                        new Date(
                          item.messages[0].schedule_mail.delay_date_time
                        ),
                        'E, MMM dd, yyyy KK:mm a'
                      )}
                    </span>
                  </div>
                ) : (
                  <div className="inboxMail__cell time">
                    <span className="inline-block">
                      {checkAndReturnActualDateOrTime(
                        item.messages[0].send_date
                      )}
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default EmailTableContent;
