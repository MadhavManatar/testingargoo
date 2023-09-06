import { TokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import {
  EmailFileType,
  EmailRecipient,
  ReplyFormType,
} from '../types/email.type';
import { MAIL_PROVIDER_CONNECTION_URLS } from 'constant/email.constant';
import { getPresignedImageUrl } from 'services/wasabi.service';

type GetMailRecipientsForReplyProps = {
  emailRecipient?: EmailRecipient[];
  from_email_address?: string;
  currentAccountEmail?: string;
  filterData?: boolean;
  allRecipient?: EmailRecipient[];
  showReplyForm?: ReplyFormType;
};

export interface RecipientOption {
  label: string;
  value: string;
}

export const getMailRecipientsForReply = (
  props: GetMailRecipientsForReplyProps
) => {
  const {
    emailRecipient = [],
    from_email_address,
    currentAccountEmail,
    filterData = true,
    showReplyForm = 'reply',
    allRecipient = [],
  } = props;

  let defaultToRecipient: RecipientOption[] = [];
  let defaultCCRecipient: RecipientOption[] = [];
  const defaultBCCRecipient: RecipientOption[] = [];
  if (showReplyForm !== 'forward') {
    defaultToRecipient =
      emailRecipient
        ?.find((obj) => obj.field === 'to')
        ?.emails.map((obj) => ({ label: obj.email, value: obj.email })) || [];

    // No BCC set while reply a mail
    // defaultBCCRecipient =
    //   emailRecipient
    //     ?.find((obj) => obj.field === 'bcc')
    //     ?.emails.map((obj) => ({ label: obj.email, value: obj.email })) || [];

    // set to as previous email
    if (filterData && from_email_address !== currentAccountEmail) {
      defaultToRecipient = [
        {
          label: from_email_address || '',
          value: from_email_address || '',
        },
      ];
    }

    if (showReplyForm === 'replyAll') {
      defaultCCRecipient =
        emailRecipient
          ?.find((obj) => obj.field === 'cc')
          ?.emails.map((obj) => ({ label: obj.email, value: obj.email })) || [];
      if (currentAccountEmail && from_email_address) {
        defaultCCRecipient = filterCcForReply(
          allRecipient,
          defaultCCRecipient,
          currentAccountEmail,
          from_email_address
        );
      }
    }
  }
  return { defaultToRecipient, defaultCCRecipient, defaultBCCRecipient };
};

const filterCcForReply = (
  allRecipient: EmailRecipient[],
  defaultCCRecipient: RecipientOption[],
  currentAccountEmail: string,
  from_email_address: string
): RecipientOption[] => {
  let newCCRecipient: RecipientOption[] = [];
  if (from_email_address !== currentAccountEmail) {
    newCCRecipient =
      allRecipient
        ?.find((obj) => obj.field === 'to')
        ?.emails.map((obj) => ({ label: obj.email, value: obj.email })) || [];
  }

  const recipients = [...defaultCCRecipient, ...newCCRecipient].filter(
    (obj) =>
      obj.value !== from_email_address && obj.value !== currentAccountEmail
  );
  return recipients;
};

export const contentIdReplaceWithSrc = async ({
  emailAttachments = [],
  html = '',
}: {
  emailAttachments?: EmailFileType[];
  html: string;
}) => {
  const filteredAttachments = emailAttachments.filter(
    (att) => att.provider_content_id && !html.includes(att?.provider_content_id)
  );

  const attachmentsWithURL = await Promise.all(
    emailAttachments.map(async (a) => ({
      ...a,
      path: await getPresignedImageUrl(a.path),
    }))
  );

  attachmentsWithURL.forEach((obj) => {
    if (obj.provider_content_id) {
      html = html.replaceAll(`cid:${obj.provider_content_id}`, obj.path);
    }
  });

  return { html, attachments: filteredAttachments };
};

export const getProviderConnectionValue = (
  tokenProviderName: TokenProvider
) => {
  const tokenProvider = MAIL_PROVIDER_CONNECTION_URLS.find(
    (obj) => obj.token_provider === tokenProviderName
  );
  const value = tokenProvider?.providerValue.value;
  const urlValue = tokenProvider?.providerValue.urlValue;

  return { value, urlValue };
};

export const hideReplyAllBtn = (
  emailRecipients: string[] | undefined
): boolean => {
  return (emailRecipients || [])?.every(
    (val) => emailRecipients && val === emailRecipients[0]
  );
};

export const getReplyNewSubject = (
  showReplyForm: ReplyFormType,
  subject: string | undefined
) => {
  switch (showReplyForm) {
    case 'reply':
    case 'replyAll':
      return `Re: ${subject}`;
    case 'forward':
      return `Fwd: ${subject}`;
    default:
      return `${subject}`;
  }
};
