// ** Import Packages **
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ** components **
import Button from 'components/Button';
import SiteLoader from 'components/loader/SiteLoader';
import AuthLayout from 'pages/auth/components/AuthLayout';

// ** Redux **
import { setUserVerified } from 'redux/slices/authSlice';

// ** Hooks **
import useAuthGuard from 'hooks/useAuthGuard';

// ** Icons **
import ChangePasswordIcon from 'assets/images/changePasswordIcon.svg';
import ErrorIcon from 'assets/images/Error-Icon.svg';

// ** Services **
import { useVerifyEmailAPI } from '../services/auth.service';

// ** Constants **
import {
  PRIVATE_NAVIGATION,
  PUBLIC_NAVIGATION,
} from 'constant/navigation.constant';

const AccountVerified = () => {
  // ** Hooks **
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // ** Custom hooks **
  const { isAuthenticated } = useAuthGuard();
  const { verifyEmailAPI, isError, isLoading, isSuccess } = useVerifyEmailAPI();

  const verifyEmail = async () => {
    const token = searchParams.get('token');
    if (token) {
      const { error } = await verifyEmailAPI({ token });
      if (!error) {
        dispatch(setUserVerified());
      }
    }
  };

  useEffect(() => {
    if (!isLoading) verifyEmail();
  }, []);
  return (
    <AuthLayout>
      {isLoading ? (
        <SiteLoader />
      ) : isSuccess ? (
        <div className="card signup__Card w-[489px] max-w-full mx-auto mt-[20px]">
          <div className="signup__Card__Body px-[46px] pt-[42px] py-[30px]">
            <div className="flex justify-center">
              <img src={ChangePasswordIcon} alt="" />
            </div>
            <p className="text-center text-colorBlack08 text-[18px] font-biotif__Regular mt-[30px] mb-[20px]">
              Your email is successfully verified
            </p>
            <Button
              className="w-full mt-[20px] mb-[20px]"
              onClick={() =>
                navigate(
                  isAuthenticated
                    ? PRIVATE_NAVIGATION.dashboard.view
                    : PUBLIC_NAVIGATION.login
                )
              }
            >
              {isAuthenticated ? 'Go To Dashboard' : 'Go To Login'}
            </Button>
          </div>
        </div>
      ) : isError ? (
        <div className="card signup__Card w-[489px] max-w-full mx-auto mt-[20px]">
          <div className="signup__Card__Body px-[46px] pt-[42px] py-[30px]">
            <div className="flex justify-center">
              <img src={ErrorIcon} alt="" />
            </div>
            <p className="text-center text-colorBlack08 text-[18px] font-biotif__Regular mt-[30px] mb-[20px]">
              Email Verification Failed.
            </p>
            <Button
              className="w-full mt-[20px] mb-[20px]"
              onClick={() => navigate(PUBLIC_NAVIGATION.login)}
            >
              Go To Login
            </Button>
          </div>
        </div>
      ) : null}
    </AuthLayout>
  );
};

export default AccountVerified;
