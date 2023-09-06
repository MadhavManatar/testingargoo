// ** Import Packages **
import { UseFormSetValue } from 'react-hook-form';

// **  Types **
import { Option } from 'components/FormField/types/formField.types';
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import { MailTokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

export enum CustomLabel {
  SPAM = 'SPAM',
  SENT = 'SENT',
  INBOX = 'INBOX',
  TRASH = 'TRASH',
  UNREAD = 'UNREAD',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
  SCHEDULED = 'SCHEDULED',
  BULK_SCHEDULED = 'BULK_SCHEDULED',
}

export type EmailModalType =
  | 'provider'
  | 'syncEmail'
  | 'compose'
  | 'smtp'
  | 'undo_modal'
  | 'advance_smtp'
  | 'reconnect_provider'
  | 'reconnect_provider_all';

export type contentType = 'received' | 'welcome';

export type SyncEmailFormFields = {
  twoWaySync: boolean;
  oneWaySync: boolean;
};

export type UploadResponseInMail = {
  destination: string;
  encoding: string;
  fieldName: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
};

export type EmailComposerFieldType = {
  bcc?: Option[];
  to?: Option[];
  cc?: Option[];
  from?: string;
  html?: string;
  subject?: string;
  attachments?: {
    path: string;
    filename: string;
    contentType: string;
  }[];
  scheduled_after?: number;
  schedule_date?: string;
  schedule_time?: string;
  autoSuggestAddress?: string;
};

export type SmtpConnectFormType = {
  email: string;
  password: string;
};

export type SmtpConnectAdvanceFormType = {
  imap_host: string;
  imap_port: number;
  smtp_host: string;
  smtp_port: number;
  imap_secure: boolean;
  smtp_secure: boolean;
  password_smtp: string;
  password_imap: string;
};

export type SearchSmtpResponse = {
  smtp: boolean;
  imap: boolean;
  config: {
    smtp: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
      type: string;
    };
    imap: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
      type: string;
    };
  };
  message: string;
};

export type EmailFileType = {
  id?: number;
  path: string;
  contentType: string;
  filename: string;
  provider_content_id?: string;
};

export type EmailRecipient = {
  field: string;
  emails: { name?: string; email: string }[];
};

export type EmailDetail = {
  id: number;
  is_read: boolean;
  is_main?: boolean;
  html: string;
  subject?: string;
  from_email_address?: string;
  send_date: string;
  provider_message_id: string;
  short_description: string;
  labels: CustomLabel[];
  email_attachments?: EmailFileType[];
  email_recipients?: EmailRecipient[];
  emailBodyContent?: string;
  body_path?: string;
  email_conversion_id?: number;
  email_conversion: {
    email: string;
    is_read: boolean;
    provider: MailTokenProvider;
  };
  schedule_mail: { delay_date_time: string };
  created_at: string;
  status: string;
  initialBodyLoad?: boolean;
};

export type EmailListingRow = {
  id: number;
  is_read: boolean;
  provider: MailTokenProvider;
  conversation_subject: string;
  messages: EmailDetail[];
  messages_count?: string;
};

export type EmailThreadDetail = {
  id: number;
  is_read: boolean;
  email: string;
  provider: MailTokenProvider;
  provider_conversion_id: string;
  messages: EmailDetail[];
  is_provider_read: boolean;
  created_at: string;
};

export type emailDataResponse = {
  created_at: string;
  id: number;
  email?: string;
  is_read?: boolean;
  provider?: string;
  provider_conversion_id?: string;
  email_body: EmailDetail[];
};
export interface ComposeMailContactData {
  id: number;
  name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_owner?: string;
  job_role?: string;
  contact_account_name?: string;
  Activity?: ActivityResponseType[];
}

export interface ComposeMailLeadData {
  id?: number;
  name?: string;
  lead_name?: string;
  lead_owner?: string;
  lead_value?: number;
  lead_related_account?: string;
  lead_related_contact?: string;
  Activity?: ActivityResponseType[];
}

export interface ComposeMailDealData {
  id?: number;
  name?: string;
  deal_name?: string;
  deal_owner?: string;
  lead_value?: number;
  deal_related_account?: string;
  deal_related_contact?: string;
  deal_value?: number;
  closing_date?: string;
  pipeline?: string;
  pipeline_stage?: string;
  lead_related_account?: string;
  is_deal?: boolean;
  Activity?: ActivityResponseType[];
}

export interface ComposeMailAccountData {
  id?: number;
  name?: string;
  account_name?: string;
  account_email?: string;
  account_address?: string;
  account_owner?: string;
  Activity?: ActivityResponseType[];
  account_contact_name?: string;
}

export type SelectedMailDataFilterType = 'All' | 'None' | 'Read' | 'Unread';

export type PreventRecipientType = {
  to: boolean;
  cc: boolean;
  bcc: boolean;
};

export type ReplyFormType = 'reply' | 'replyAll' | 'forward' | undefined;

export type EmailQuickAddEntityDropdownPropsType = {
  setValue: UseFormSetValue<EmailComposerFieldType>;
  connectEntityWithComposeMail: (value: string) => Promise<void>;
};
