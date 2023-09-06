// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import FormField from 'components/FormField';
import AuthCard from 'pages/auth/components/AuthCard';
import AuthLayout from 'pages/auth/components/AuthLayout';

// ** Redux **
import { setLogoutData } from 'redux/slices/authSlice';

// ** Service **
import { useForgotPasswordAPI } from '../services/auth.service';

// ** Type **
import { ForgotPasswordFields } from 'pages/auth/ForgotPassword/types/forgot-password.types';

// ** Schema **
import { forgotPasswordSchema } from 'pages/auth/ForgotPassword/validation-schema/forgot-password.schema';

// ** Icon **
import ForgotLinkIcon from 'assets/images/forgotLinkIcon.svg';

// ** Constant **
import { PUBLIC_NAVIGATION } from 'constant/navigation.constant';

const ForgotPassword = () => {
  // ** Hook **
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ** State **
  const [showBackBtn] = useState(true);

  // ** Custom Hooks **
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFields>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const { forgotPasswordAPI, isLoading, isSuccess } = useForgotPasswordAPI();

  const onSubmit = handleSubmit(async (data) => {
    await forgotPasswordAPI({ email: data.email });
  });

  return (
    <AuthLayout>
      {isSuccess ? (
        <AuthCard showHeader={false}>
          <div className="flex justify-center">
            <img src={ForgotLinkIcon} alt="" />
          </div>
          <p className="text-center text-colorBlack08 text-[18px] font-biotif__Regular mt-[30px] mb-[20px]">
            Please check your email. Click the link in the email to reset your
            password.
          </p>
          <p className="text-center text-ipDashboardMediumDarkText text-[18px] font-biotif__Regular mb-0 mt-[30px]">
            Go Back to &nbsp;
            <span
              onClick={() => {
                dispatch(setLogoutData());
                navigate(PUBLIC_NAVIGATION.login);
              }}
              className="text-ip__Orange hover:underline font-biotif__Medium cursor-pointer"
            >
              Login
            </span>
          </p>
        </AuthCard>
      ) : (
        <AuthCard
          title="Forgot Password"
          subTitle="We will send you a link to reset password on the Mail provided by you"
          showBackBtn={showBackBtn}
          onBackBtnClicked={() => {
            navigate(PUBLIC_NAVIGATION.login);
          }}
        >
          <form onSubmit={onSubmit}>
            <FormField<ForgotPasswordFields>
              type="text"
              name="email"
              label="Email"
              placeholder="Enter Your Email"
              icon="mailFilled"
              register={register}
              error={errors?.email}
              fieldLimit={60}
            />
            <Button
              className="w-full mt-[20px] mb-[20px]"
              type="submit"
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Send
            </Button>
          </form>
          <p className="text-center text-ipDashboardMediumDarkText text-[18px] font-biotif__Regular mb-0 mt-[30px]">
            Go Back to &nbsp;
            <span
              onClick={() => {
                dispatch(setLogoutData());
                navigate(PUBLIC_NAVIGATION.login);
              }}
              className="text-ip__Orange hover:underline font-biotif__Medium cursor-pointer"
            >
              Login
            </span>
          </p>
        </AuthCard>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
