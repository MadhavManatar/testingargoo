// ** Import Packages **
import Tippy from '@tippyjs/react';
import { useEffect, useState } from 'react';

// ** Components **
import Icon from 'components/Icon';

// ** types **
import {
  EmailHeaderIconsProps,
  ShowIconType,
} from '../types/email-header.types';

import { useCheckEmailAuthAPI } from 'pages/Email/services/email.service';

// ** Constant **
import { MailTokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useNavigate } from 'react-router-dom';
import { useShowEmailOperationButton } from 'pages/Email/hooks/useShowEmailOperationButton';
import { CustomLabel } from 'pages/Email/types/email.type';
import {
  useDeleteMailMutation,
  useMarkAsReadUnreadMutation,
  useUpdateMailStatusMutation,
} from 'redux/api/mailApi';
import ReConnectProvider from 'pages/Setting/email-setting/EmailSetting/ConnectEmail/components/ReConnectProvider';
import { MAIL_PROVIDER_CONNECTION_URLS } from 'constant/email.constant';

const EmailHeaderIcons = (Props: EmailHeaderIconsProps) => {
  // ** props **
  const {
    selectedMails,
    label,
    labels,
    type,
    setRefresh,
    SetSelectedMails,
    emailDetails,
  } = Props;
  const navigate = useNavigate();

  // ** state **
  const [showIcon, setShowIcon] = useState<ShowIconType>({});
  const initialMailIdObj = {
    [MailTokenProvider.GMAIL]: [],
    [MailTokenProvider.OUTLOOK]: [],
    [MailTokenProvider.SMTP]: [],
  };
  const [mailIdsObj, setMailIdsObj] = useState<{
    [MailTokenProvider.GMAIL]: number[];
    [MailTokenProvider.OUTLOOK]: number[];
    [MailTokenProvider.SMTP]: number[];
  }>(initialMailIdObj);
  const [currentSelectAction, setCurrentSelectAction] = useState<CustomLabel>();

  // ** service **
  const [updateMailStatusAPI, { isLoading: updateLoading }] =
    useUpdateMailStatusMutation();
  const [markAsReadUnreadAPI, { isLoading: markAsReadUnreadLoading }] =
    useMarkAsReadUnreadMutation();
  const [trashThreadMailAPI, { isLoading: trashLoading }] =
    useDeleteMailMutation();

  // ** Custom Hooks
  const { setButtons } = useShowEmailOperationButton();

  const { checkEmailAuthAPI } = useCheckEmailAuthAPI();
  const [authStatus, setAuthStatus] = useState(true);
  const [reConnectModal, setReConnectModal] = useState(false);

  useEffect(() => {
    setButtons({ label, setShowIcon, labels });
  }, [label]);

  useEffect(() => {
    checkAuth();
  }, []);

  // Check Auth Status
  const checkAuth = async () => {
    if (emailDetails?.provider && emailDetails?.email) {
      const { data: providerData } = await checkEmailAuthAPI({
        provider_name: emailDetails?.provider,
        email: emailDetails?.email,
      });
      setAuthStatus(providerData?.is_active);
    }
  };

  const tokenProvider = MAIL_PROVIDER_CONNECTION_URLS.find(
    (obj) => obj.token_provider === emailDetails?.provider
  );
  const value = tokenProvider?.providerValue.value;
  const urlValue = tokenProvider?.providerValue.urlValue;

  useEffect(() => {
    if (selectedMails.length) {
      setMailIdsObj({
        [MailTokenProvider.GMAIL]: selectedMails
          .filter((obj) => obj.provider === MailTokenProvider.GMAIL)
          .map((obj) => obj.id),
        [MailTokenProvider.OUTLOOK]: selectedMails
          .filter((obj) => obj.provider === MailTokenProvider.OUTLOOK)
          .map((obj) => obj.id),
        [MailTokenProvider.SMTP]: selectedMails
          .filter((obj) => obj.provider === MailTokenProvider.SMTP)
          .map((obj) => obj.id),
      });
    } else {
      setMailIdsObj(initialMailIdObj);
    }
  }, [selectedMails]);

  useEffect(() => {
    if (selectedMails.length) {
      const checkUnreadStatus = selectedMails.find((obj) => !obj.is_read);
      setShowIcon((prev) => ({
        ...prev,
        ...(showIcon.read && { read: !checkUnreadStatus }),
        ...(showIcon.Unread && { Unread: !!checkUnreadStatus }),
      }));
    }
  }, [selectedMails]);

  const updateStatus = async (action: CustomLabel) => {
    if (authStatus && selectedMails.length > 0) {
      const data = await updateMailStatusAPI({
        data: {
          gmail_ids: mailIdsObj.gmail,
          outlook_ids: mailIdsObj.outlook,
          smtp_ids: mailIdsObj.smtp,
          action,
        },
      });
      if (!('error' in data) && setRefresh && SetSelectedMails) {
        setRefresh(true);
        SetSelectedMails([]);
      } else if (!('error' in data)) {
        navigate(PRIVATE_NAVIGATION.email.view);
      }
    } else {
      setReConnectModal(true);
    }
  };

  const markAsReadUnread = async () => {
    if (authStatus && selectedMails.length > 0) {
      const data = await markAsReadUnreadAPI({
        data: {
          gmail_ids: mailIdsObj.gmail,
          outlook_ids: mailIdsObj.outlook,
          smtp_ids: mailIdsObj.smtp,
          is_provider_read: showIcon.Unread,
        },
      });
      if (!('error' in data) && setRefresh && SetSelectedMails) {
        setRefresh(true);
        SetSelectedMails([]);
      }
    } else {
      setReConnectModal(true);
    }
  };

  const handleTrashMail = async () => {
    if (authStatus && selectedMails.length > 0) {
      const data = await trashThreadMailAPI({
        data: {
          gmail_ids: mailIdsObj.gmail,
          outlook_ids: mailIdsObj.outlook,
          smtp_ids: mailIdsObj.smtp,
          action: CustomLabel.TRASH,
        },
      });
      if (!('error' in data) && setRefresh && SetSelectedMails) {
        setRefresh(true);
        SetSelectedMails([]);
      } else if (!('error' in data)) {
        navigate(PRIVATE_NAVIGATION.email.view);
      }
    } else {
      setReConnectModal(true);
    }
  };

  return (
    <>
      {type === 'tableView' && (
        <>
          {showIcon.read &&
            (markAsReadUnreadLoading ? (
              <div className="w-[31px] h-[31px] flex items-center justify-center pt-[4px]">
                <div className="i__ButtonLoader i__ButtonLoader__ForLight !m-0 !p-[5px]" />
              </div>
            ) : (
              <Tippy zIndex={5} content="Mark as unread">
                <button className="draftmail__btn  ml-[10px] mb-[10px]">
                  <Icon
                    className="w-[32px] h-[32px] bg-[#F2F6F9] rounded-[6px] p-[7px] duration-500"
                    iconType="mailFilled"
                    onClick={markAsReadUnread}
                  />
                </button>
              </Tippy>
            ))}
          {showIcon.Unread &&
            (markAsReadUnreadLoading ? (
              <div className="w-[31px] h-[31px] flex items-center justify-center pt-[4px]">
                <div className="i__ButtonLoader i__ButtonLoader__ForLight !m-0 !p-[5px]" />
              </div>
            ) : (
              <Tippy zIndex={5} content="Mark as read">
                <button className="draftmail__btn  ml-[10px] mb-[10px]">
                  <Icon
                    className="w-[32px] h-[32px] bg-[#F2F6F9] rounded-[6px] p-[5px] duration-500"
                    iconType="markAsUnreadFilledIcon"
                    onClick={markAsReadUnread}
                  />
                </button>
              </Tippy>
            ))}
          {showIcon.archive &&
            (updateLoading && currentSelectAction === CustomLabel.ARCHIVED ? (
              <div className="w-[31px] h-[31px] flex items-center justify-center pt-[4px]">
                <div className="i__ButtonLoader i__ButtonLoader__ForLight !m-0 !p-[5px]" />
              </div>
            ) : (
              <Tippy zIndex={5} content="Archive">
                <button
                  className="draftmail__btn  ml-[10px] mb-[10px]"
                  onClick={() => {
                    updateStatus(CustomLabel.ARCHIVED);
                    setCurrentSelectAction(CustomLabel.ARCHIVED);
                  }}
                >
                  <Icon
                    className="w-[32px] h-[32px] bg-[#F2F6F9] rounded-[6px] p-[5px] duration-500"
                    iconType="draftMailFilledIcon"
                  />
                </button>
              </Tippy>
            ))}
          {showIcon.spam &&
            (updateLoading && currentSelectAction === CustomLabel.SPAM ? (
              <div className="w-[31px] h-[31px] flex items-center justify-center pt-[4px]">
                <div className="i__ButtonLoader i__ButtonLoader__ForLight !m-0 !p-[5px]" />
              </div>
            ) : (
              <Tippy zIndex={5} content="Report spam">
                <button
                  className="spammail__btn ml-[10px] mb-[10px]"
                  onClick={() => {
                    updateStatus(CustomLabel.SPAM);
                    setCurrentSelectAction(CustomLabel.SPAM);
                  }}
                >
                  <Icon
                    className="w-[32px] h-[32px] bg-[#F2F6F9] rounded-[6px] p-[5px] duration-500"
                    iconType="spamMailFilledIcon"
                  />
                </button>
              </Tippy>
            ))}
          {showIcon.delete &&
            label !== CustomLabel.TRASH &&
            (trashLoading ? (
              <div className="w-[31px] h-[31px] flex items-center justify-center pt-[4px]">
                <div className="i__ButtonLoader i__ButtonLoader__ForLight !m-0 !p-[5px]" />
              </div>
            ) : (
              <Tippy zIndex={5} content="Delete">
                <button
                  className="delete__btn ml-[10px] mb-[10px]"
                  onClick={() => {
                    handleTrashMail();
                    setCurrentSelectAction(CustomLabel.TRASH);
                  }}
                >
                  <Icon
                    className="w-[32px] h-[32px] bg-[#F2F6F9] rounded-[6px] p-[8px] duration-500"
                    iconType="deleteFilled"
                  />
                </button>
              </Tippy>
            ))}
        </>
      )}
      {type === 'detailView' && (
        <>
          {showIcon.archive &&
            (updateLoading && currentSelectAction === CustomLabel.ARCHIVED ? (
              <div className="w-[31px] h-[31px] flex items-center justify-center pt-[4px]">
                <div className="i__ButtonLoader i__ButtonLoader__ForLight !m-0 !p-[5px]" />
              </div>
            ) : (
              <Tippy zIndex={5} placement="bottom" content="Archive">
                <span className="inline-block">
                  <Icon
                    className="!w-[32px] !h-[32px] !p-[6px] duration-500 rounded-full hover:bg-white mr-[20px] cursor-pointer lg:hover:bg-ipGray__transparentBG lg:mr-[5px] lg:!w-[32px] lg:!h-[32px]"
                    iconType="inboxViewDraftFilledIcon"
                    onClick={() => {
                      updateStatus(CustomLabel.ARCHIVED);
                      setCurrentSelectAction(CustomLabel.ARCHIVED);
                    }}
                  />
                </span>
              </Tippy>
            ))}
          {showIcon.spam &&
            (updateLoading && currentSelectAction === CustomLabel.SPAM ? (
              <div className="w-[31px] h-[31px] flex items-center justify-center pt-[4px]">
                <div className="i__ButtonLoader i__ButtonLoader__ForLight !m-0 !p-[5px]" />
              </div>
            ) : (
              <Tippy zIndex={5} placement="bottom" content="Report spam">
                <span className="inline-block">
                  <Icon
                    className="!w-[32px] !h-[32px] !p-[6px] duration-500 rounded-full hover:bg-white mr-[20px] cursor-pointer lg:hover:bg-ipGray__transparentBG lg:mr-[5px] lg:hidden lg:!w-[32px] lg:!h-[32px]"
                    iconType="spamMailFilledIcon"
                    onClick={() => {
                      updateStatus(CustomLabel.SPAM);
                      setCurrentSelectAction(CustomLabel.SPAM);
                    }}
                  />
                </span>
              </Tippy>
            ))}
          {showIcon.delete &&
            !labels?.includes(CustomLabel.TRASH) &&
            (trashLoading ? (
              <div className="w-[31px] h-[31px] flex items-center justify-center pt-[4px]">
                <div className="i__ButtonLoader i__ButtonLoader__ForLight !m-0 !p-[5px]" />
              </div>
            ) : (
              <Tippy zIndex={5} placement="bottom" content="Delete">
                <span className="inline-block">
                  <Icon
                    className="!w-[32px] !h-[32px] !p-[6px] duration-500 rounded-full hover:bg-white mr-[20px] cursor-pointer lg:hover:bg-ipGray__transparentBG lg:mr-[5px] lg:!w-[32px] lg:!h-[32px]"
                    iconType="inboxViewDeleteFilledIcon"
                    onClick={() => handleTrashMail()}
                  />
                </span>
              </Tippy>
            ))}
        </>
      )}
      {reConnectModal && urlValue && value && emailDetails?.email && (
        <ReConnectProvider
          provider={{
            email: emailDetails?.email,
            urlValue,
            value,
          }}
          isOpen={reConnectModal}
          closeModal={() => {
            setReConnectModal(false);
          }}
        />
      )}
    </>
  );
};

export default EmailHeaderIcons;
