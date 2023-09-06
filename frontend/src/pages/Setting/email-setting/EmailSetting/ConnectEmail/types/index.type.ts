import { EmailModalType } from 'pages/Email/types/email.type';
import { UserToken } from '../../types/userToken.type';

export interface EmailProviderListProps {
  tokenSuccessURL: string;
  openModal: (value: EmailModalType) => void;
  modal: EmailModalType | undefined;
  setModal: React.Dispatch<React.SetStateAction<EmailModalType | undefined>>;
  closeModal: () => void;
  usersTokens: UserToken[];
  getLoggedIUserTokens: () => Promise<UserToken[] | undefined>;
}

export type showReconnectProps = {
  [key: string]: boolean;
};
