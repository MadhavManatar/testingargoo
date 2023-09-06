export enum TokenProvider {
  ZOOM = 'zoom',
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  GOOGLE_CALENDAR = 'google_calendar',
  MICROSOFT = 'microsoft',
  GOOGLE_MAIL = 'gmail',
  OFFICE_365_CALENDAR = 'outlook_calendar',
  OTHER = 'other',
  SMTP = 'smtp',
  All = 'all',
  OUTLOOK = 'outlook',
}

export enum MailTokenProvider {
  GMAIL = 'gmail',
  OUTLOOK = 'outlook',
  SMTP = 'smtp',
  All = 'all',
}

export enum AuthProviderConnectURLS {
  facebook = 'facebook',
  linkedin = 'linkedin',
  twitter = 'twitter',
  google = 'google',
  microsoft = 'microsoft',
  zoom = 'zoom',
  other = 'other',
}

export type UserToken = {
  id: number;
  token_provider: TokenProvider;
  token_provider_mail: string;
  user_id?: number;
  token_provider_user_id?: string;
  updated_at?: string;
  is_active?: boolean | undefined;
};
