// ** Import Packages **
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import AuthLayout from 'pages/auth/components/AuthLayout';
import ChangePasswordForm from 'pages/auth/ResetPassword/components/changePasswordForm';

// ** Redux **
import { setLogoutData } from 'redux/slices/authSlice';
import { RootState } from 'redux/store';

// ** Service **
import { useResetPasswordAPI } from '../services/auth.service';

// ** Type **
import { PasswordFields } from 'pages/auth/Login/types/login.types';

// ** Icon **
import ErrorIcon from 'assets/images/Error-Icon.svg';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useState } from 'react';

const ResetPassword = () => {
  // ** Hooks **
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authData = useSelector((state: RootState) => state.auth);
  const { isAuthenticated } = authData;
  const [searchParams] = useSearchParams();
  const [oldPasswordMatchError, setOldPasswordMatchError] = useState(false);
  const [passwordRules, setPasswordRules] = useState<string[]>([]);
  const [tokenError, setTokenError] = useState<boolean>(false);

  // ** Custom Hooks **
  const { resetPasswordAPI, isLoading, isError, isSuccess } =
    useResetPasswordAPI();

  const onSubmit = async (data: PasswordFields) => {
    const { password } = data;
    const token = searchParams.get('token');
    if (token && password) {
      const result = await resetPasswordAPI({ token, password });
      if (result?.data?.errors) {
        setPasswordRules(result?.data?.errors);
      }
      if (result.error === 'Password cannot reset with your old password')
        setOldPasswordMatchError(true);
      if (result.error === 'Token expired, try again') setTokenError(true);
    }
  };

  return (
    <AuthLayout>
      {isAuthenticated ? (
        <div className="card signup__Card w-[489px] max-w-full mx-auto mt-[20px]">
          <div className="signup__Card__Body">
            <div className="flex justify-center">
              <img src={ErrorIcon} alt="" />
            </div>
            <p className="text-center text-colorBlack08 text-[18px] font-biotif__Regular mt-[30px] mb-[20px]">
              Your session are already stored please logout
            </p>
            <Button
              className="w-full mt-[20px] mb-[20px]"
              onClick={() => navigate(PRIVATE_NAVIGATION.dashboard.view)}
            >
              Go To Dashboard
            </Button>
            <Button
              className="w-full mt-[20px] mb-[20px]"
              onClick={() => dispatch(setLogoutData())}
            >
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <ChangePasswordForm
          isLoading={isLoading}
          isError={isError && !oldPasswordMatchError}
          isSuccess={isSuccess}
          submitForm={onSubmit}
          type="reset"
          passwordRules={passwordRules || []}
          tokenError={tokenError}
        />
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
