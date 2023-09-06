import { Dispatch, useEffect, useState } from 'react';
import { format } from 'date-fns-tz';
import _ from 'lodash';
import { useLocation } from 'react-router-dom';

import {
  EmailListingRow,
  EmailDetail,
  CustomLabel,
  EmailThreadDetail,
  EmailComposerFieldType,
  UploadResponseInMail,
  EmailRecipient,
} from '../types/email.type';
import {
  useGetEmailAPI,
  useGetNextPrevMailAPI,
} from 'pages/Email/services/email.service';
import { Option } from 'components/FormField/types/formField.types';
import { PaginationParams } from 'components/TableInfiniteScroll';
import axios from 'axios';
import { useGetLoggedIUserTokens } from 'pages/Setting/email-setting/hooks/useUserTokenService';
import { INITIAL_MAIL_PROVIDER_ARRAY } from 'constant';
import { UseFormReset } from 'react-hook-form';
import { EditEmail } from '../components/emailComposer/AddEmailComposerModal';
import { setLoadEmailThreads } from 'redux/slices/commonSlice';
import { useDispatch } from 'react-redux';
import { getMailRecipientsForReply } from '../helper/email.helper';
import {
  useLazyGetMailsQuery,
  useLazyUseGetTreadEmailDetailsQuery,
} from 'redux/api/mailApi';
import { useReloadDataMutation } from 'redux/api/reloadApi';
import { POLLING_INTERVAL } from 'constant/dataLimit.constant';
import { getPresignedImageUrl } from 'services/wasabi.service';

export const useGetEmails = ({
  setConservationsCount,
  providerOption,
}: {
  setConservationsCount?: React.Dispatch<React.SetStateAction<number>>;
  providerOption?: Option[];
}) => {
  const { pathname } = useLocation();

  // ** states **
  const [emails, setEmails] = useState<{
    rows: EmailListingRow[];
    count: number;
  }>({
    rows: [],
    count: 0,
  });

  // ** custom hooks **
  const [getMails, { isLoading: emailsLoading, data: mailData }] =
    useLazyGetMailsQuery({
      pollingInterval: pathname === '/' ? POLLING_INTERVAL : 0,
    });

  // const { getEmailsAPI, isLoading: emailsLoading } = useGetEmailsAPI();
  const { getLoggedIUserTokens, isLoading: isLoadingUserToken } =
    useGetLoggedIUserTokens({
      INITIAL_PROVIDER_ARRAY: INITIAL_MAIL_PROVIDER_ARRAY,
    });
  useEffect(() => {
    if (mailData) {
      setEmails(mailData);
      if (setConservationsCount) {
        setConservationsCount(mailData.count);
      }
    }
  }, [mailData]);

  const getEmails = async (tabData: {
    label?: CustomLabel[];

    provider: Option;

    page?: number;

    limit: number;

    searchData?: {
      searchText: string;

      searchFields: string;
    };

    setRefresh?: (value: React.SetStateAction<boolean>) => void;
  }) => {
    const { label, limit, page, provider, setRefresh, searchData } = tabData;
    const userToken = await getLoggedIUserTokens();
    const user_mail = (provider.value as string).split(',')[0];
    const token_provider = (provider.value as string).split(',')[1];
    const params: PaginationParams = { page, limit };

    if (userToken?.length || providerOption?.length) {
      await getMails({
        ...params,

        ...(userToken?.length && {
          'q[email][in]': [...userToken].map((obj) => obj.token_provider_mail),

          'q[provider][in]': [...userToken].map((obj) => obj.token_provider),
        }),

        ...(providerOption && {
          'q[email][in]':
            user_mail === 'all'
              ? [...providerOption]

                  .splice(1)

                  .map((obj) => obj.value.toString().split(',')?.[0])
              : user_mail,

          'q[provider][in]':
            token_provider === 'all'
              ? [...providerOption]

                  .splice(1)

                  .map((obj) => obj.value.toString().split(',')?.[1])
              : token_provider,
        }),

        label: JSON.stringify(label),

        searchFields: searchData?.searchFields,

        searchText: searchData?.searchText,

        sort: '-updated_at',
      });

      if (setRefresh) {
        setRefresh(false);
      }
    }
  };

  return {
    getEmails,
    emailsLoading: isLoadingUserToken || emailsLoading,
    emails,
  };
};

// ** states **
export const useGetEmailThread = ({
  markAsReadUnread,
  tabName,
}: {
  markAsReadUnread(
    read: boolean,
    emailDetails?: EmailThreadDetail
  ): Promise<void>;
  tabName: CustomLabel;
}) => {
  // ** Store **
  const dispatch = useDispatch();

  // ** States **
  const [emailDetails, setEmailDetails] = useState<EmailThreadDetail>();
  const [loading, setLoading] = useState(false);

  // ** APIS **
  const [getThreadEmailByIdAPI, { isLoading: emailDetailsLoading }] =
    useLazyUseGetTreadEmailDetailsQuery();
  const [reloadData] = useReloadDataMutation();

  const getEmailDetails = async (emailConversionId: number) => {
    const { data, error } = await getThreadEmailByIdAPI(
      {
        id: emailConversionId,
        params: {
          'include[messages][q][labels][contains][]': tabName,
          'include[messages][include][email_recipients]': 'all',
          'include[messages][include][email_attachments]': 'all',
        },
      },
      true
    );

    const tempData = _.cloneDeep(data);

    dispatch(
      setLoadEmailThreads({
        email_details: false,
      })
    );

    if (tempData && !error) {
      const mainMail = tempData.messages[0] as EmailDetail;
      // Hear load the body from wasabi
      markAsReadUnread(true, tempData);
      if (mainMail?.body_path) {
        try {
          setLoading(true);
          const emailBody = await getEmailBody(mainMail?.body_path);
          tempData.messages[0] = {
            ...mainMail,
            html: emailBody || '',
          };
          setLoading(false);
        } catch (__) {
          setLoading(false);
        }
      }
      if (tempData) {
        setEmailDetails(tempData);
      }
      // Here invalid mail list for RTK
      reloadData({
        data: [
          {
            type: 'MAIL',
            id: 'LIST',
          },
        ],
      });
    }
  };

  return {
    getEmailDetails,
    emailDetailsLoading: emailDetailsLoading || loading,
    emailDetails,
    setEmailDetails,
  };
};

export const useGetEmail = () => {
  // ** states **

  const [emailDetails, setEmailDetails] = useState<EmailThreadDetail>();

  // ** custom hooks **

  const { getEmailByIdAPI, isLoading: emailDetailLoading } = useGetEmailAPI();

  const getEmailDetails = async (emailId: number) => {
    const { data, error } = await getEmailByIdAPI(emailId, {
      params: {
        'include[messages][q][id]': emailId,

        'include[messages][include][email_recipients]': 'all',

        'include[messages][include][email_attachments]': 'all',
      },
    });

    if (data && !error) {
      if (data) {
        setEmailDetails(data);
      }
    }
  };

  return {
    getEmailDetails,

    emailDetailLoading,

    emailDetails,
  };
};

type UseGetEmailDataAndSetIntoComposeFormProps = {
  reset: UseFormReset<EmailComposerFieldType>;

  setDefaultRecipientList: Dispatch<React.SetStateAction<Option[] | undefined>>;

  setDefaultBCCRecipient: Dispatch<React.SetStateAction<Option[]>>;

  setDefaultCCRecipient: Dispatch<React.SetStateAction<Option[]>>;

  setUploadFileData: Dispatch<React.SetStateAction<UploadResponseInMail[]>>;
};

export const useGetEmailDataAndSetIntoComposeForm = (
  props: UseGetEmailDataAndSetIntoComposeFormProps
) => {
  const {
    reset,

    setDefaultRecipientList,
    setDefaultBCCRecipient,
    setDefaultCCRecipient,
    setUploadFileData,
  } = props;

  // ** states **

  const [emailDetails, setEmailDetails] = useState<EmailThreadDetail>();

  const [loading, setLoading] = useState(false);

  // ** custom hooks **

  const { getEmailByIdAPI, isLoading: emailDetailLoading } = useGetEmailAPI();

  const getEmailDataAndSetIntoComposeForm = async (editEmail: EditEmail) => {
    setLoading(true);

    const { data, error } = await getEmailByIdAPI(editEmail.emailId, {
      params: {
        'include[messages][q][id]': editEmail.emailId,
        'include[messages][include][email_recipients]': 'all',
        'include[messages][include][email_attachments]': 'all',
        'include[messages][include][schedule_mail][select]': 'delay_date_time',
      },
    });

    if (data && !error) {
      const emailRecipients = data.messages[0].email_recipients;
      
      // eslint-disable-next-line prefer-destructuring
      let subject = data.messages[0].subject;
      let to = [];
      let cc = [];
      let bcc = [];
      
      if (
        editEmail.showReplyForm === 'reply' ||
        editEmail.showReplyForm === 'replyAll'
        ) {
          const { defaultToRecipient, defaultCCRecipient, defaultBCCRecipient } =
          getMailRecipientsForReply({
            emailRecipient: emailRecipients?.filter((obj: EmailRecipient) =>
            editEmail.showReplyForm === 'reply' ? obj.field === 'to' : true
            ),
            currentAccountEmail: data.email,
            filterData: true,
            showReplyForm: editEmail.showReplyForm,
            from_email_address: data.messages[0].from_email_address,
            allRecipient: emailRecipients,
          });
        to = defaultToRecipient;
        cc = defaultCCRecipient;
        bcc = defaultBCCRecipient;
        subject = `Re: ${subject}`;
      } else if (editEmail.showReplyForm === 'forward') {
        to = [];
        cc = [];
        bcc = [];
        subject = `Fwd: ${subject}`;
      } else {
        to = emailRecipients
          .find((obj: { field: string }) => obj.field === 'to')
          ?.emails.map((obj: { email: string }) => ({
            label: obj.email,
            value: obj.email,
          }));

        cc = emailRecipients
          .find((obj: { field: string }) => obj.field === 'cc')
          ?.emails.map((obj: { email: string }) => ({
            label: obj.email,
            value: obj.email,
          }));

        bcc = emailRecipients
          .find((obj: { field: string }) => obj.field === 'bcc')
          ?.emails.map((obj: { email: string }) => ({
            label: obj.email,
            value: obj.email,
          }));
      }
      const emailBody =
        editEmail.showReplyForm && editEmail.htmlBody
          ? editEmail.htmlBody
          : await getEmailBody(data.messages[0]?.body_path);

      const existingfiles =
        editEmail.showReplyForm && editEmail.showReplyForm !== 'forward'
          ? []
          : data.messages?.[0]?.email_attachments?.map(
              (obj: {
                filename: string;
                path: string;
                contentType: string;
              }) => ({
                originalname: obj.filename,

                path: obj.path,

                mimetype: obj.contentType,
              })
            ) || [];
      const replyFiles =
        editEmail.replyAttachments && editEmail.replyAttachments.length
          ? editEmail.replyAttachments
          : [];
      setUploadFileData([...existingfiles, ...replyFiles]);
      let scheduleTime = new Date();

      if (data.messages?.[0]?.schedule_mail?.delay_date_time) {
        scheduleTime = new Date(
          data.messages?.[0].schedule_mail.delay_date_time
        );
      }

      const hours = scheduleTime.getHours();

      const mins = scheduleTime.getMinutes();

      setDefaultRecipientList(to || []);

      setDefaultBCCRecipient(bcc || []);

      setDefaultCCRecipient(cc || []);

      reset({
        to,

        bcc,

        cc,

        subject,

        html: emailBody || '',

        schedule_date: format(scheduleTime, 'dd, MMM yyyy'),

        schedule_time: `${hours}:${mins}`,
      });

      setEmailDetails(data);
    }

    setLoading(false);
  };

  return {
    getEmailDataAndSetIntoComposeForm,

    emailDetailLoading: loading || emailDetailLoading,

    emailDetails,
  };
};

export const getEmailBody = async (url: string) => {
  try {
    const presignedURL = await getPresignedImageUrl(url);
    const emailBody = await axios(presignedURL);
    return emailBody?.data?.textHtml || '';
  } catch (_error) {
    //
  }
};

type useGetNextPrevMailProp = {
  providerOption?: Option[];

  provider: Option;

  label: string[];
};

export const useGetNextPrevMail = (props: useGetNextPrevMailProp) => {
  const { providerOption, provider, label } = props;

  const user_mail = (provider.value as string).split(',')[0];

  const token_provider = (provider.value as string).split(',')[1];

  // ** State
  const [nextPrevConversionId, setNextPrevConversionId] = useState({
    prevConversionId: undefined,
    nextConversionId: undefined,
  });

  // ** API Service **
  const { getNextPrevMailAPI, isLoading } = useGetNextPrevMailAPI();

  const getNextPrevMail = async ({
    email_conversion_id,
  }: {
    email_conversion_id: number;
  }) => {
    const commonQuery = {
      email_conversion_id,
      ...(providerOption && {
        email:
          user_mail === 'all'
            ? [...providerOption]
                .map((obj) => `'${obj.value.toString().split(',')?.[0]}'`)
                .join(',')
            : `'${user_mail}'`,
        provider:
          token_provider === 'all'
            ? [...providerOption]
                .map((obj) => `'${obj.value.toString().split(',')?.[1]}'`)
                .join(',')
            : `'${token_provider}'`,
      }),
      label: JSON.stringify(label),
      limit: 1,
    };

    const { data: nextData } = await getNextPrevMailAPI({
      params: {
        ...commonQuery,
      },
    });

    const nextConversionId = nextData?.next_mail;
    const prevConversionId = nextData?.prev_mail;

    setNextPrevConversionId({ nextConversionId, prevConversionId });
  };

  return { getNextPrevMail, nextPrevConversionId, isLoading };
};
