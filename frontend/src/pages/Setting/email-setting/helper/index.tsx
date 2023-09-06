import { REACT_APP_API_URL_WITHOUT_VERSION, REACT_APP_FRONT_URL } from 'config';
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from '../EmailSetting/types/userToken.type';

export const authWithProviderHelper = ({
  userId,
  tokenProvider,
  successURLPath,
  failureURLPath,
  connectAPIPath,
}: {
  userId: number;
  tokenProvider: TokenProvider;
  successURLPath: string;
  failureURLPath: string;
  connectAPIPath: AuthProviderConnectURLS;
}) => {
  const organizationUUID = localStorage.getItem('organization_uuid');
  const zoomToken = window.btoa(
    JSON.stringify({
      userId,
      organizationUUID,
      token_provider: tokenProvider,
      successURL: `${REACT_APP_FRONT_URL}${successURLPath}`,
      failureURL: `${REACT_APP_FRONT_URL}${failureURLPath}`,
    })
  );
  window.open(
    `${REACT_APP_API_URL_WITHOUT_VERSION}/auth/${connectAPIPath}/connect?token=${zoomToken}`,
    '_self'
  );
};
