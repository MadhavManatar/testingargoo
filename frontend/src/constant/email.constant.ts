import {
  AuthProviderConnectURLS,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

export const MAIL_PROVIDER_CONNECTION_URLS = [
  {
    token_provider: 'gmail',
    providerValue: {
      value: TokenProvider.GOOGLE_MAIL,
      urlValue: AuthProviderConnectURLS.google,
    },
  },
  {
    token_provider: 'outlook',
    providerValue: {
      value: TokenProvider.OUTLOOK,
      urlValue: AuthProviderConnectURLS.microsoft,
    },
  },
  {
    token_provider: 'smtp',
    providerValue: {
      value: TokenProvider.OTHER,
      urlValue: AuthProviderConnectURLS.other,
    },
  },
];
