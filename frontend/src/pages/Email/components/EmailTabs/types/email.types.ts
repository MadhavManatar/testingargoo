import { Option } from 'components/FormField/types/formField.types';
import {
  EmailModalType,
  SelectedMailDataFilterType,
  CustomLabel,
} from 'pages/Email/types/email.type';
import {
  MailTokenProvider,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

export type SelectedMailType = {
  id: number;
  is_read: boolean;
  provider?: MailTokenProvider;
};

export interface EmailTabPropsInterface {
  openModalWithEditMode: (
    emailId: number,
    conversionId: number,
    schedule_time: string
  ) => void;
  openModal: (value: EmailModalType) => void;
  providerOption: Option[];
  setSelectedProvider: React.Dispatch<React.SetStateAction<Option>>;
  selectedProvider: Option;
  providers: {
    id: number;
    token_provider: TokenProvider;
    token_provider_mail: string;
    is_active?: boolean | undefined;
  }[];
}

export interface EmailTabHeaderPropsInterface {
  openModal: (value: EmailModalType) => void;
  count: number;
  page: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  providerOption: Option[];
  setSelectedProvider: React.Dispatch<React.SetStateAction<Option>>;
  selectedMails: SelectedMailType[];
  conservationsCount: number;
  setEmailTabs: React.Dispatch<React.SetStateAction<CustomLabel>>;
  selectedProvider: Option;
  SetSelectedMails: React.Dispatch<React.SetStateAction<SelectedMailType[]>>;
  label: CustomLabel;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchData: React.Dispatch<
    React.SetStateAction<{
      searchText: string;
      searchFields: string;
    }>
  >;
  setSelectedMailData_Filter: React.Dispatch<
    React.SetStateAction<SelectedMailDataFilterType | undefined>
  >;
  selectedMailData_Filter?: SelectedMailDataFilterType;
  providers: {
    id: number;
    token_provider: TokenProvider;
    token_provider_mail: string;
    is_active?: boolean | undefined;
  }[];
}

export type EmailTabHeaderFilterOptionProps = {
  item: SelectedMailDataFilterType;
  index: number;
  close: () => void;
  setSelectedMailData_Filter: React.Dispatch<
    React.SetStateAction<SelectedMailDataFilterType | undefined>
  >;
};

export type EmailTabHeaderActiveProps = {
  menu: boolean;
  provider: boolean;
  filter: boolean;
  mobile: boolean;
};

export enum MAIL_STATUS {
  READ = 'READ',
  UNREAD = 'UNREAD',
}
