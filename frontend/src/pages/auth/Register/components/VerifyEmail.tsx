// ** Import Packages **
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import AuthCard from 'pages/auth/components/AuthCard';

// ** Redux **
import { setAuthenticated, setLogoutData } from 'redux/slices/authSlice';

// ** Icons **
import ForgotLinkIcon from 'assets/images/forgotLinkIcon.svg';

// ** Services **
import { useResendVerificationAPI } from 'pages/auth/services/auth.service';

// ** Type **
import { VerifyEmailProps } from '../types/register.types';

// ** Constant **
import {
  PRIVATE_NAVIGATION,
  PUBLIC_NAVIGATION,
} from 'constant/navigation.constant';

const VerifyEmail = (props: VerifyEmailProps) => {
  const { goToLoginPage } = props;
  // ** Hooks **
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ** Custom Hooks **
  const { resendVerificationAPI, isLoading } = useResendVerificationAPI();

  const handleResendVerification = async () => {
    const { data } = await resendVerificationAPI();
    if (data) {
      const { verified } = data;
      dispatch(setAuthenticated({ isAuthenticated: true }));

      if (verified) navigate(PRIVATE_NAVIGATION.dashboard.view);
    }
  };

  return (
    <AuthCard showHeader={false}>
      <div className="flex justify-center">
        <img src={ForgotLinkIcon} alt="" />
      </div>
      <p className="text-center text-colorBlack08 text-[18px] font-biotif__Regular mt-[30px] mb-[20px]">
        Please check your email for the confirmation mail. Click the link in the
        email to verify your account.
      </p>
      <p className="text-[#2e323480] text-[18px] font-biotif__Regular text-center mb-[10px]">
        Didn&apos;t receive link?
      </p>
      <Button
        className="w-full mb-[20px]"
        type="submit"
        isDisabled={isLoading}
        onClick={() => handleResendVerification()}
      >
        Resend Verification Link
      </Button>
      <p className="text-center text-ipDashboardMediumDarkText text-[18px] font-biotif__Regular mb-0 mt-[30px]">
        Go Back to &nbsp;
        <span
          onClick={() =>
            goToLoginPage
              ? goToLoginPage()
              : (dispatch(setLogoutData()), navigate(PUBLIC_NAVIGATION.login))
          }
          className="text-ip__Orange hover:underline font-biotif__Medium cursor-pointer"
        >
          Login
        </span>
      </p>
    </AuthCard>
  );
};

export default VerifyEmail;
