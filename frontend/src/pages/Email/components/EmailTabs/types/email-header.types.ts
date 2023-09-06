import { CustomLabel, EmailThreadDetail } from 'pages/Email/types/email.type';
import { SelectedMailType } from './email.types';

export interface EmailHeaderIconsProps {
  selectedMails: SelectedMailType[];
  label?: CustomLabel;
  labels?: CustomLabel[];
  type: string;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  SetSelectedMails?: React.Dispatch<React.SetStateAction<SelectedMailType[]>>;
  emailDetails?: EmailThreadDetail;
}

export type ShowIconType = {
  archive?: boolean;
  spam?: boolean;
  delete?: boolean;
  read?: boolean;
  Unread?: boolean;
};

export type SetButtonProps = {
  labels?: CustomLabel[];
  label?: CustomLabel;
  setShowIcon: React.Dispatch<React.SetStateAction<ShowIconType>>;
};
