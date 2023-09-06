// ** axios hooks **
import { AxiosRequestConfig } from 'axios';
import {
  useAxiosPost as useGetSocialMediaSendMail,
  useAxiosGet,
  useAxiosPost,
  useAxiosDelete,
} from 'hooks/useAxios';

const MAIL_BASE_PATH = {
  gmail: {
    send: 'gmail/send',
    reply: 'gmail/reply',
    scheduled: 'gmail/scheduled',
    bulkSend: 'gmail/bulkSend',
    bulkScheduled: 'gmail/bulkScheduled',
  },
  outlook: {
    send: 'outlook/send',
    reply: 'outlook/reply',
    scheduled: 'outlook/scheduled',
    bulkSend: 'outlook/bulkSend',
    bulkScheduled: 'gmail/bulkScheduled',
  },
  smtp: {
    send: 'smtp/send',
    reply: 'smtp/reply',
    scheduled: 'smtp/scheduled',
    bulkSend: 'smtp/bulkSend',
    bulkScheduled: 'gmail/bulkScheduled',
  },
};

const SMTP_API_BASE_PATH = 'advance-option/smtp-imap';

const EMAIL_API_PATH = 'mail';

// ** for GMAIL ** //
export const useSendMailForGoogle = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetSocialMediaSendMail();
  const sendGmailAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.gmail.send, data, config);
  };
  return { sendGmailAPI, isLoading, isError, isSuccess };
};

export const useScheduleMailForGoogle = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isScheduleGmailLoading,
      isError: isScheduleGmailError,
      isSuccess: isScheduleGmailSuccess,
    },
  ] = useGetSocialMediaSendMail();
  const scheduleGmailAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.gmail.scheduled, data, config);
  };
  return {
    scheduleGmailAPI,
    isScheduleGmailLoading,
    isScheduleGmailError,
    isScheduleGmailSuccess,
  };
};

export const useSendBulkMailForGoogle = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isBulkGmailLoading,
      isError: isBulkGmailError,
      isSuccess: isBulkGmailSuccess,
    },
  ] = useGetSocialMediaSendMail();

  const sendBulkGmailAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.gmail.bulkSend, data, config);
  };
  return {
    sendBulkGmailAPI,
    isBulkGmailLoading,
    isBulkGmailError,
    isBulkGmailSuccess,
  };
};

export const useScheduledBulkMailForGoogle = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isScheduledBulkGmailLoading,
      isError: isScheduledBulkGmailError,
      isSuccess: isScheduledBulkGmailSuccess,
    },
  ] = useGetSocialMediaSendMail();
  const scheduledBulkGmailAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.gmail.bulkScheduled, data, config);
  };
  return {
    scheduledBulkGmailAPI,
    isScheduledBulkGmailLoading,
    isScheduledBulkGmailError,
    isScheduledBulkGmailSuccess,
  };
};

export const useReplyMailForGoogle = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isReplyGmailLoading,
      isError: isReplyGmailError,
      isSuccess: isReplyGmailSuccess,
    },
  ] = useGetSocialMediaSendMail();
  const replyGmailAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.gmail.reply, data, config);
  };
  return {
    replyGmailAPI,
    isReplyGmailLoading,
    isReplyGmailError,
    isReplyGmailSuccess,
  };
};

// ** for OUTLOOK ** //
export const useSendMailForOutlook = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetSocialMediaSendMail();
  const sendOutlookAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.outlook.send, data, config);
  };
  return { sendOutlookAPI, isLoading, isError, isSuccess };
};

export const useScheduleMailForOutlook = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isScheduleOutLookMailLoading,
      isError: isScheduleOutLookMailError,
      isSuccess: isScheduleOutLookMailSuccess,
    },
  ] = useGetSocialMediaSendMail();
  const scheduleOutlookAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.outlook.scheduled, data, config);
  };
  return {
    scheduleOutlookAPI,
    isScheduleOutLookMailLoading,
    isScheduleOutLookMailError,
    isScheduleOutLookMailSuccess,
  };
};

export const useSendBulkMailForOutlook = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isBulkOutLookLoading,
      isError: isBulkOutLookError,
      isSuccess: isBulkOutLookSuccess,
    },
  ] = useGetSocialMediaSendMail();

  const sendBulkOutLookAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.outlook.bulkSend, data, config);
  };
  return {
    sendBulkOutLookAPI,
    isBulkOutLookLoading,
    isBulkOutLookError,
    isBulkOutLookSuccess,
  };
};

export const useScheduledBulkMailForOutlook = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isScheduledBulkOutLookLoading,
      isError: isScheduledBulkOutLookError,
      isSuccess: isScheduledBulkOutLookSuccess,
    },
  ] = useGetSocialMediaSendMail();
  const scheduledBulkOutLookAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.outlook.bulkScheduled, data, config);
  };
  return {
    scheduledBulkOutLookAPI,
    isScheduledBulkOutLookLoading,
    isScheduledBulkOutLookError,
    isScheduledBulkOutLookSuccess,
  };
};

export const useReplyMailForOutlook = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isReplyOutlookLoading,
      isError: isReplyOutlookError,
      isSuccess: isReplyOutlookSuccess,
    },
  ] = useGetSocialMediaSendMail();
  const replyOutlookAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.outlook.reply, data, config);
  };
  return {
    replyOutlookAPI,
    isReplyOutlookLoading,
    isReplyOutlookError,
    isReplyOutlookSuccess,
  };
};

// ** for SMTP API ** //
export const useSendMailForSmtp = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetSocialMediaSendMail();
  const sendSmtpAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.smtp.send, data, config);
  };
  return { sendSmtpAPI, isLoading, isError, isSuccess };
};

export const useScheduleMailForSmtp = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isScheduleSmtpLoading,
      isError: isScheduleSmtpError,
      isSuccess: isScheduleSmtpSuccess,
    },
  ] = useGetSocialMediaSendMail();
  const scheduleSmtpAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.smtp.scheduled, data, config);
  };
  return {
    scheduleSmtpAPI,
    isScheduleSmtpLoading,
    isScheduleSmtpError,
    isScheduleSmtpSuccess,
  };
};

export const useSendBulkMailForSmtp = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isBulkSmtpLoading,
      isError: isBulkSmtpError,
      isSuccess: isBulkSmtpSuccess,
    },
  ] = useGetSocialMediaSendMail();

  const sendBulkSmtpAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.smtp.bulkSend, data, config);
  };
  return {
    sendBulkSmtpAPI,
    isBulkSmtpLoading,
    isBulkSmtpError,
    isBulkSmtpSuccess,
  };
};

export const useScheduledBulkMailForSmtp = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isScheduledBulkSmtpLoading,
      isError: isScheduledBulkSmtpError,
      isSuccess: isScheduledBulkSmtpSuccess,
    },
  ] = useGetSocialMediaSendMail();
  const scheduledBulkSmtpAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.smtp.bulkScheduled, data, config);
  };
  return {
    scheduledBulkSmtpAPI,
    isScheduledBulkSmtpLoading,
    isScheduledBulkSmtpError,
    isScheduledBulkSmtpSuccess,
  };
};

export const useReplyMailForSmtp = () => {
  // ** custom Hooks **
  const [
    callApi,
    {
      isLoading: isReplySmtpLoading,
      isError: isReplySmtpError,
      isSuccess: isReplySmtpSuccess,
    },
  ] = useGetSocialMediaSendMail();
  const replySmtpAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(MAIL_BASE_PATH.smtp.reply, data, config);
  };
  return {
    replySmtpAPI,
    isReplySmtpLoading,
    isReplySmtpError,
    isReplySmtpSuccess,
  };
};

// ** Connect MAIL ** //
export const useGetSmtpConnectedDetailsAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useAxiosGet();
  const getSmtpConnectedDetailsAPI = async (
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${SMTP_API_BASE_PATH}/me`, config);
  };

  return { getSmtpConnectedDetailsAPI, isLoading, isError, isSuccess };
};

// ** Undo MAIL ** //
export const useUndoEmailAPI = () => {
  // ** custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] =
    useGetSocialMediaSendMail();

  const undoEmailByIdAPI = async (
    provider: string,
    isScheduled: string,
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${provider}/${isScheduled}/undo`, data, config);
  };
  return { undoEmailByIdAPI, isLoading, isError, isSuccess };
};

// ** GET MAILS ** //
export const useGetEmailsAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useAxiosGet();

  const getEmailsAPI = async (config: AxiosRequestConfig<object> = {}) => {
    return callApi(`${EMAIL_API_PATH}`, config);
  };

  return { getEmailsAPI, isLoading, isError, isSuccess };
};

// ** GET MAIL DETAIL ** //
export const useGetEmailAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useAxiosGet();

  const getEmailByIdAPI = async (
    id: number,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${EMAIL_API_PATH}/${id}`, config);
  };
  return { getEmailByIdAPI, isLoading, isError, isSuccess };
};

// **partial sync mail ** //
export const usePartialSyncEmailsAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useAxiosPost();

  const partialSyncEmailsAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${EMAIL_API_PATH}/sync`, data, config);
  };

  return { partialSyncEmailsAPI, isLoading, isError, isSuccess };
};

// **check mail auth ** //
export const useCheckEmailAuthAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useAxiosPost();

  const checkEmailAuthAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${EMAIL_API_PATH}/check-auth`, data, config);
  };

  return { checkEmailAuthAPI, isLoading, isError, isSuccess };
};

// ** update read/unread status ** //
export const useMarkAsReadUnreadAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useAxiosPost();

  const markAsReadUnreadAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${EMAIL_API_PATH}/mark-as-read-unread`, data, config);
  };

  return { markAsReadUnreadAPI, isLoading, isError, isSuccess };
};

export const useTrashThreadMailAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useAxiosDelete();

  const trashThreadMailAPI = async (
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${EMAIL_API_PATH}`, config);
  };

  return { trashThreadMailAPI, isLoading, isError, isSuccess };
};

export const useUpdateMailStatusAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useAxiosPost();

  const updateMailStatusAPI = async (
    data: object,
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${EMAIL_API_PATH}/status`, data, config);
  };

  return { updateMailStatusAPI, isLoading, isError, isSuccess };
};

export const useGetNextPrevMailAPI = () => {
  // ** Custom Hooks **
  const [callApi, { isLoading, isError, isSuccess }] = useAxiosGet();

  const getNextPrevMailAPI = async (
    config: AxiosRequestConfig<object> = {}
  ) => {
    return callApi(`${EMAIL_API_PATH}/next-prev/`, config);
  };
  return { getNextPrevMailAPI, isLoading, isError, isSuccess };
};
