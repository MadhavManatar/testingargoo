// ** Type **
import { PasswordFields } from 'pages/auth/Login/types/login.types';

export interface ChangePasswordFormProps {
  error?: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  type: 'reset' | 'set' | 'expiredPass';
  passwordRules: any[];
  submitForm: (data: PasswordFields) => void;
  tokenError: boolean;
}
