import { Option } from 'components/FormField/types/formField.types';
import { CustomLabel } from 'pages/Email/types/email.type';

export interface GetMailPayload {
  label?: CustomLabel[];
  provider: Option;
  page?: number;
  limit: number;
  searchData?: {
    searchText: string;
    searchFields: string;
  };
  providerOption?: Option[];
}

export type API_RESPONSE = {
  data?: object;
  error?: {
    status: number;
    data: { message?: string };
    message: string;
  };
};

// export interface GetStreamPayload {

// }
