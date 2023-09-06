export type LoginFormFields = {
  email: string;
  password: string;
  remember?: boolean;
};

export type PasswordFields = {
  password?: string;
  confirmPassword?: string;
  agreeTerms?: boolean;
};

export type OrganizationOptions = {
  name: string;
  uuid: string;
};

export type SelectOrganizationFields = {
  organization: string;
};

export type LoginWithAppleSchema = {
  authorization: object;
  user?: object;
};

export enum loginMethod {
  LOGIN = 'login',
  GOOGLE_LOGIN = 'googleLogin',
  APPLE_LOGIN = 'appleLogin',
}

export interface LoginFormProps {
  loading: {
    simpleLoginLoader?: boolean;
    googleLoginLoader?: boolean;
    appleLoginLoader?: boolean;
  };
  login: (_data: LoginFormFields) => void;
  loginWithGoogle: (token: string) => void;
  loginWithApple: (data: LoginWithAppleSchema) => void;
}

export interface OrganizationFormProps {
  organizationSuccess: (_id: string) => void;
  organizationOptions?: OrganizationOptions[];
  showPrevBtn: boolean;
  prev: () => void;
}

export interface SocialLoginProps {
  formType: string;
  googleLoading?: boolean;
  loginWithGoogle: (token: string) => void;
  loginWithApple: (data: LoginWithAppleSchema) => void;
  appleLoading?: boolean;
}

export type TwoFactorTypes = {
  verified: false;
  QRCode: string;
  secret?: string;
};
