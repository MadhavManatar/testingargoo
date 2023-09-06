// ** Import packages **
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import AuthLayout from 'pages/auth/components/AuthLayout';
import ChangePasswordForm from 'pages/auth/ResetPassword/components/changePasswordForm';

// ** Redux **
import { setLogoutData } from 'redux/slices/authSlice';
import { RootState } from 'redux/store';

// ** Service **
import { useSetPasswordAPI } from '../services/auth.service';

// * Type **
import { PasswordFields } from 'pages/auth/Login/types/login.types';

// ** Icon **
import ErrorIcon from 'assets/images/Error-Icon.svg';
import {
  PRIVATE_NAVIGATION,
  PUBLIC_NAVIGATION,
} from 'constant/navigation.constant';
import { useState } from 'react';

const SetPassword = () => {
  // ** Hooks **
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const authData = useSelector((states: RootState) => states.auth);
  const { isAuthenticated } = authData;
  const [error, setError] = useState<string>();

  // ** Custom Hooks **
  const { setPasswordAPI, isLoading, isSuccess, isError } = useSetPasswordAPI();

  const onSubmit = async (values: PasswordFields) => {
    const { password } = values;
    const token = searchParams.get('token');
    if (token && password) {
      const { data, error: apiError } = await setPasswordAPI({
        token,
        password,
      });
      if (apiError && data?.errors[0]) {
        const err = data?.errors.map(
          (item: { message: string }) => item?.message
        );
        return setError(err.join(', '));
      }
      if (
        !apiError &&
        (state as { expiredChangesPass: boolean })?.expiredChangesPass
      ) {
        return navigate(PUBLIC_NAVIGATION.login);
      }
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
          error={error}
          isLoading={isLoading}
          isError={isError}
          isSuccess={isSuccess}
          submitForm={onSubmit}
          type="expiredPass"
          passwordRules={[]}
          tokenError={false}
        />
      )}
    </AuthLayout>
  );
};

export default SetPassword;
