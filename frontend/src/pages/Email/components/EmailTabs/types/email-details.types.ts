import { Option } from 'components/FormField/types/formField.types';
import {
  SelectedMailDataFilterType,
  CustomLabel,
  EmailListingRow,
} from 'pages/Email/types/email.type';
import { SelectedMailType } from './email.types';

export interface EmailDetailPageProps {
  openModalWithEditMode?: (
    emailId: number,
    conversionId: number,
    schedule_time: string
  ) => void;
  SetSelectedMails: React.Dispatch<React.SetStateAction<SelectedMailType[]>>;
  emailTabs: CustomLabel;
  refresh?: boolean;
  selectedMailData_Filter: SelectedMailDataFilterType | undefined;
  setSelectedMailData_Filter: React.Dispatch<
    React.SetStateAction<SelectedMailDataFilterType | undefined>
  >;
  emails: {
    rows: EmailListingRow[];
    count: number;
  };
  isLoading: boolean;
}
export interface EmailSectionPageProps {
  openModalWithEditMode?: (
    emailId: number,
    conversionId: number,
    schedule_time: string
  ) => void;
  selectedProvider: Option;
  headerPage?: number;
  setCount?: React.Dispatch<React.SetStateAction<number>>;
  providerOption: Option[];
  SetSelectedMails: React.Dispatch<React.SetStateAction<SelectedMailType[]>>;
  emailTabs: CustomLabel;
  setConservationsCount: React.Dispatch<React.SetStateAction<number>>;
  refresh: boolean;
  setRefresh: (value: React.SetStateAction<boolean>) => void;
  searchData: {
    searchText: string;
    searchFields: string;
  };
  selectedMailData_Filter: SelectedMailDataFilterType | undefined;
  setSelectedMailData_Filter: React.Dispatch<
    React.SetStateAction<SelectedMailDataFilterType | undefined>
  >;
}
