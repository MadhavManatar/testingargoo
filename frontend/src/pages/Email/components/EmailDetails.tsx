// ** Import Packages **
import Tippy from '@tippyjs/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Icon from 'components/Icon';
import EmailDetailSkeleton from 'components/skeletons/EmailDetailSkeleton';
import EmailHeaderIcons from './EmailTabs/Components/EmailHeaderIcons';
import EmailBody from './EmailBody';
import EmailUndoMessage from './EmailTabs/Components/EmailUndoMessage';

// ** Type **
import {
  CustomLabel,
  EmailModalType,
  EmailThreadDetail,
} from '../types/email.type';
import { MailTokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

// ** Service **
import { useMarkAsReadUnreadMutation } from 'redux/api/mailApi';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import {
  useGetEmailThread,
  useGetNextPrevMail,
} from '../hooks/useEmailService';
import { useSelector } from 'react-redux';
import {
  getCurrentMailProvider,
  getIsEmailThreadsLoad,
  getMailProviderOption,
} from 'redux/slices/commonSlice';
import { setUrlParams } from 'utils/util';

const EmailDetails = () => {
  // ** hooks ** //
  const { id: email_conversion_id } = useParams();
  const navigate = useNavigate();
  const currentMailProvider = useSelector(getCurrentMailProvider);
  const mailProviders = useSelector(getMailProviderOption);
  const isEmailDetailLoad = useSelector(getIsEmailThreadsLoad);

  const searchParams = new URLSearchParams(document.location.search);
  const tabName: CustomLabel = searchParams.get('emailTabs') as CustomLabel;
  const isRead = searchParams.get('read');

  // ** states **
  const [modal, setModal] = useState<EmailModalType>();
  const [emailUndoHelperObj, setEmailUndoHelperObj] = useState<{
    id?: number;
    delay_time: number;
    provider?: MailTokenProvider;
  }>({ delay_time: 10 });

  // API Service
  const {
    emailDetails,
    emailDetailsLoading,
    getEmailDetails,
    setEmailDetails,
  } = useGetEmailThread({ markAsReadUnread, tabName });
  const [markAsReadUnreadAPI, { isLoading }] = useMarkAsReadUnreadMutation();

  const {
    getNextPrevMail,
    isLoading: nextPrevConversionIdLoading,
    nextPrevConversionId,
  } = useGetNextPrevMail({
    label: [tabName],
    provider: currentMailProvider || {
      label: '',
      value: '',
    },
    providerOption: mailProviders,
  });

  useEffect(() => {
    if (email_conversion_id) {
      getEmailDetails(+email_conversion_id);
    }
  }, [email_conversion_id, isEmailDetailLoad]);

  useEffect(() => {
    if (mailProviders.length && email_conversion_id) {
      getNextPrevMail({
        email_conversion_id: +email_conversion_id,
      });
    }
  }, [mailProviders.length, email_conversion_id]);

  const mainMail = emailDetails?.messages[0];

  async function markAsReadUnread(
    read: boolean,
    emailDetailsArg: EmailThreadDetail | undefined = emailDetails
  ) {
    if ((emailDetailsArg && !(isRead === 'true')) || read === false) {
      const data = await markAsReadUnreadAPI({
        data: {
          [`${emailDetailsArg?.provider}_ids`]: [email_conversion_id],
          is_provider_read: read,
        },
      });
      if (!('error' in data) && !read) {
        navigate(PRIVATE_NAVIGATION.email.view);
      }
    }
  }

  const removeUndoMessageFromListing = () => {
    setEmailDetails(
      (prev) =>
        prev && {
          ...prev,
          messages: prev.messages.filter(
            (message) => message.id !== emailUndoHelperObj.id
          ),
        }
    );
  };

  return (
    <>
      {emailDetailsLoading || nextPrevConversionIdLoading ? (
        <EmailDetailSkeleton />
      ) : (
        <>
          <div className="inbox__view__page__wrapper">
            <div className="lg:hidden">
              <Breadcrumbs path={BREAD_CRUMB.emailDetails} />
            </div>
            <div className="inbox__view__actionbar bg-[#ECF2F6] py-[10px] px-[13px] rounded-[12px] flex flex-wrap items-center justify-between mb-[30px] lg:bg-transparent lg:py-0 lg:px-0 lg:rounded-none lg:mb-[12px]">
              <div className="left flex flex-wrap items-center lg:w-full lg:justify-between">
                <Icon
                  onClick={() =>
                    navigate(PRIVATE_NAVIGATION.email.view, {
                      state: { status: tabName },
                    })
                  }
                  className="!w-[32px] !h-[32px] !p-[6px] duration-500 rounded-full hover:bg-white mr-[30px] cursor-pointer lg:hover:bg-ipGray__transparentBG lg:!w-[32px] lg:!h-[32px] lg:relative lg:left-[-8px]"
                  iconType="inboxViewBackFilledIcon"
                />
                <div className="inline-flex items-center">
                  {mainMail && (
                    <EmailHeaderIcons
                      selectedMails={[
                        {
                          id: emailDetails.id,
                          is_read: emailDetails.is_read,
                          provider: emailDetails?.provider,
                        },
                      ]}
                      labels={mainMail.labels}
                      type="detailView"
                      emailDetails={emailDetails}
                    />
                  )}
                  <span className="inline-block mr-[20px] lg:mr-[8px]">
                    <Tippy
                      zIndex={5}
                      placement="bottom"
                      content="Mark as unread"
                    >
                      {isLoading ? (
                        <div className="w-[31px] h-[31px] flex items-center justify-center pt-[4px]">
                          <div className="i__ButtonLoader i__ButtonLoader__ForLight !m-0 !p-[5px]" />
                        </div>
                      ) : (
                        <span className="inline-block">
                          <Icon
                            className="!w-[32px] !h-[32px] !p-[6px] duration-500 rounded-full hover:bg-white cursor-pointer lg:hover:bg-ipGray__transparentBG lg:!w-[36px] lg:!h-[36px]"
                            iconType="inboxViewEmailFilledIcon"
                            onClick={() => markAsReadUnread(false)}
                          />
                        </span>
                      )}
                    </Tippy>
                  </span>
                </div>
              </div>
              <div className="right flex flex-wrap items-center lg:hidden">
                <Icon
                  onClick={() =>
                    nextPrevConversionId.prevConversionId &&
                    navigate(
                      `${setUrlParams(
                        PRIVATE_NAVIGATION.email.detailPage,
                        nextPrevConversionId.prevConversionId
                      )}?emailTabs=${tabName}`
                    )
                  }
                  className={`!w-[32px] !h-[32px] !p-[6px] duration-500 rounded-full hover:bg-white mr-[10px] cursor-pointer ${
                    nextPrevConversionId.prevConversionId
                      ? ''
                      : 'opacity-50 pointer-events-none'
                  }`}
                  iconType="inboxViewPrevFilledIcon"
                />
                <Icon
                  onClick={() =>
                    nextPrevConversionId.nextConversionId &&
                    navigate(
                      `${setUrlParams(
                        PRIVATE_NAVIGATION.email.detailPage,
                        nextPrevConversionId.nextConversionId
                      )}?emailTabs=${tabName}`
                    )
                  }
                  className={`!w-[32px] !h-[32px] !p-[6px] duration-500 rounded-full hover:bg-white cursor-pointer ${
                    nextPrevConversionId.nextConversionId
                      ? ''
                      : 'opacity-50 pointer-events-none'
                  }`}
                  iconType="inboxViewNextFilledIcon"
                />
              </div>
            </div>
            <div className="inbox__view__header flex flex-wrap items-start justify-between pl-[84px] mb-[15px] lg:pl-0">
              <h2 className="title text-[28px] leading-[32px] text-ipBlack__textColor font-biotif__Medium w-[calc(100%_-_80px)] pr-[15px] lg:pr-0 lg:w-full lg:text-[18px] lg:font-biotif__Medium lg:leading-[24px]">
                {mainMail?.subject || '(no subject)'}
              </h2>
              <div className="print__share__btns flex flex-wrap items-center lg:hidden">
                <span className="inline-block mr-[10px]">
                  <Tippy content="Print all">
                    <span className="inline-block">
                      <Icon
                        onClick={() => window.print()}
                        className="!w-[34px] !h-[34px] !p-[7px] duration-500 rounded-full hover:bg-ipGray__transparentBG cursor-pointer"
                        iconType="inboxViewPrintFilledIcon"
                      />
                    </span>
                  </Tippy>
                </span>
                <Tippy content="In new Window">
                  <span className="inline-block">
                    <Icon
                      onClick={() =>
                        window.open(
                          window.location.href,
                          `${mainMail?.subject}-${mainMail?.from_email_address}`,
                          'height=500,width=500'
                        )
                      }
                      className="!w-[34px] !h-[34px] !p-[7px] duration-500 rounded-full hover:bg-ipGray__transparentBG cursor-pointer"
                      iconType="inboxViewShareFilledIcon"
                    />
                  </span>
                </Tippy>
              </div>
            </div>
            <div className="email__listing__wrapper">
              {emailDetails?.messages?.map((obj, index) => (
                <EmailBody
                  setEmailDetails={setEmailDetails}
                  emailDetails={emailDetails}
                  emailUndoHelperObj={emailUndoHelperObj}
                  setEmailUndoHelperObj={setEmailUndoHelperObj}
                  setModal={setModal}
                  key={obj.id}
                  emailData={obj}
                  index={index}
                />
              ))}
            </div>

            {modal === 'undo_modal' && (
              <EmailUndoMessage
                setModal={setModal}
                emailUndoHelperObj={emailUndoHelperObj}
                removeUndoMessageFromListing={removeUndoMessageFromListing}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default EmailDetails;
