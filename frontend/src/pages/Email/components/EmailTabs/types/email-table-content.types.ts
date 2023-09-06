import {
  EmailListingRow,
  SelectedMailDataFilterType,
  CustomLabel,
} from 'pages/Email/types/email.type';
import { SelectedMailType } from './email.types';

export interface EmailTableContentProps {
  openModalWithEditMode?: (
    emailId: number,
    conversionId: number,
    schedule_time: string
  ) => void;
  emails: {
    count: number;
    rows: EmailListingRow[];
    total?: number;
  };
  tabClassName: string;
  SetSelectedMails?: React.Dispatch<React.SetStateAction<SelectedMailType[]>>;
  emailTabs: CustomLabel;
  showMailIcon?: boolean;
  selectedMailData_Filter?: SelectedMailDataFilterType;
  setSelectedMailData_Filter: React.Dispatch<
    React.SetStateAction<SelectedMailDataFilterType | undefined>
  >;
  isLoading: boolean;
}
