// ** Type **
import {
  LoginWithAppleSchema,
  PasswordFields,
} from 'pages/auth/Login/types/login.types';

export type BasicFields = {
  firstName?: string;
  lastName?: string;
  businessEmail?: string;
  mobile?: string;
  initial_color?: string;
};

export type organizationCategory =
  | ''
  | 'E-commerce Business'
  | 'Professional Services'
  | 'Health Care'
  | 'Computer Software'
  | 'Financial Services'
  | 'Other';

export type OrganizationFields = {
  organizationName?: string;
  organizationCategory?: organizationCategory;
};

export type RegisterFormFields = BasicFields &
  OrganizationFields &
  PasswordFields;

export type RegistrationSteps = Array<string>;

export type OrganizationCategoryOptions = {
  label: string;
  value: organizationCategory | '';
};

export type CompanyQuestionsFields = {
  industry: { label: string; value: string };
  organizationSize: { label: string; value: string };
};

export interface BasicDetailsProps {
  next: () => void;
  formData: RegisterFormFields;
  setFormData: (_data: BasicFields) => void;
  loading: { googleLoginLoader?: boolean; appleLoginLoader?: boolean };
  loginWithGoogle: (token: string) => void;
  loginWithApple: (data: LoginWithAppleSchema) => void;
}

export interface CompanyDetailsProps {
  prev: () => void;
  next: () => void;
  formData: RegisterFormFields;
  setFormData: (_data: OrganizationFields) => void;
  showPrevBtn: boolean;
  goToLoginPage?: () => void;
  loading?: boolean;
}

export interface PasswordDetailsProps {
  formData: RegisterFormFields;
  setFormData: (_data: PasswordFields) => void;
  createAccount: (_userData: RegisterFormFields) => void;
  showPrevBtn?: boolean;
  prev?: () => void;
  goToLoginPage?: () => void;
  registerLoading: boolean;
}

export type QuestionsListProps = {
  questionSubmitted: () => void;
  goToLoginPage?: () => void;
};

export interface VerifyEmailProps {
  goToLoginPage?: () => void;
}
