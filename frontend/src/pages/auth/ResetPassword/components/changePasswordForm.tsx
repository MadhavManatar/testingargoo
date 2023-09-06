// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import FormField from 'components/FormField';
import SiteLoader from 'components/loader/SiteLoader';

// ** Types **
import { PasswordFields } from 'pages/auth/Login/types/login.types';
import { ChangePasswordFormProps } from '../types/changePasswordForm.types';

// ** Schema **
import { resetPasswordSchema } from 'pages/auth/ResetPassword/validation-schema/reset-password.schema';

// ** Icons **
import ErrorIcon from 'assets/images/Error-Icon.svg';
import ResetPasswordIcon from 'assets/images/Tick-Square.svg';

// ** Constant **
import { PUBLIC_NAVIGATION } from 'constant/navigation.constant';

const ChangePasswordForm = ({
  error,
  isLoading,
  isSuccess,
  // isError,
  type,
  passwordRules,
  submitForm,
  tokenError,
}: ChangePasswordFormProps) => {
  // ** Hooks **
  const navigate = useNavigate();

  // ** Custom Hooks **
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PasswordFields>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const passRulesMessage = passwordRules.map((role) => {
    return role?.message;
  });

  const onSubmit = handleSubmit((value) => {
    submitForm({ ...value });
  });

  return (
    <>
      {!isLoading && !isSuccess && !tokenError && (
        <div className="card signup__Card w-[489px] max-w-full mx-auto mt-[20px]">
          <div className="signup__Card__Header">
            {type === 'reset' ? (
              <>
                <h2 className="i__Heading">Reset Password</h2>
                <p className="i__Text">
                  Set Your New password. Your New password <br />
                  cannot be your old password.
                </p>
              </>
            ) : (
              <>
                <h2 className="i__Heading">Set Password</h2>
                <p className="i__Text">Set Your New Password.</p>
              </>
            )}
          </div>
          <div className="signup__Card__Body">
            <form onSubmit={onSubmit}>
              <FormField<PasswordFields>
                key="password"
                type="password"
                name="password"
                label="New Password"
                placeholder="Enter Your New Password"
                icon="securityFilled"
                register={register}
                error={errors?.password}
              />
              <FormField<PasswordFields>
                key="confirmPassword"
                type="password"
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Confirm Your New Password"
                icon="securityFilled"
                register={register}
                error={errors?.confirmPassword}
              />
              <p className="ip__Error">{error || ''}</p>
              <p className="ip__Error">
                {passwordRules.length > 0 ? passRulesMessage.join(',') : ''}
              </p>
              <Button
                className="w-full mt-[20px] mb-[20px]"
                isLoading={isLoading}
                isDisabled={isLoading}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      )}

      {isLoading ? (
        <SiteLoader />
      ) : isSuccess ? (
        <div className="card signup__Card w-[489px] max-w-full mx-auto mt-[20px]">
          <div className="signup__Card__Body">
            <div className="flex justify-center">
              <img src={ResetPasswordIcon} alt="" />
            </div>
            <p className="text-center text-colorBlack08 text-[18px] font-biotif__Regular mt-[30px] mb-[20px]">
              {type === 'reset'
                ? 'Your password has been Changed. please login with new credentials'
                : 'Your password has been Created. please login with new credentials'}
            </p>
            <Button
              className="w-full mt-[20px] mb-[20px]"
              onClick={() => navigate(PUBLIC_NAVIGATION.login)}
            >
              Go To Login
            </Button>
          </div>
        </div>
      ) : tokenError ? (
        <div className="card signup__Card w-[489px] max-w-full mx-auto mt-[20px]">
          <div className="signup__Card__Body">
            <div className="flex justify-center">
              <img src={ErrorIcon} alt="" />
            </div>
            <p className="text-center text-colorBlack08 text-[18px] font-biotif__Regular mt-[30px] mb-[20px]">
              {type === 'reset'
                ? 'Password Verification Failed'
                : 'Password creation Failed'}
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
    </>
  );
};

export default ChangePasswordForm;
