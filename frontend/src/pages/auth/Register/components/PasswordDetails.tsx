// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

// ** Components **
import Button from 'components/Button';
import FormField from 'components/FormField';
import AuthCard from 'pages/auth/components/AuthCard';

// ** Types **
import type { PasswordFields } from 'pages/auth/Login/types/login.types';
import type { PasswordDetailsProps } from 'pages/auth/Register/types/register.types';

// ** Schema **
import { passwordDetailsSchema } from 'pages/auth/Register/validation-schema/register.schema';

const PasswordDetails = (props: PasswordDetailsProps) => {
  const {
    formData,
    setFormData,
    createAccount,
    goToLoginPage,
    registerLoading,
  } = props;
  const { showPrevBtn = false, prev: goToPrev } = props;
  const { password, confirmPassword } = formData;

  // ** Custom Hooks **
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFields>({
    resolver: yupResolver(passwordDetailsSchema),
    defaultValues: { password, confirmPassword },
  });

  const onSubmit = handleSubmit((data) => {
    setFormData(data);
    createAccount({ ...formData, ...data });
  });

  return (
    <AuthCard
      title="Create Account"
      subTitle="Set up a new password. The password must contain at least 12 characters"
      showBackBtn={showPrevBtn}
      onBackBtnClicked={goToPrev}
    >
      <form onSubmit={onSubmit}>
        <FormField<PasswordFields>
          type="password"
          name="password"
          label="Password"
          placeholder="Enter Your New Password"
          icon="securityFilled"
          register={register}
          error={errors.password}
          required
        />
        <FormField<PasswordFields>
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm Your New Password"
          icon="securityFilled"
          register={register}
          error={errors.confirmPassword}
          required
        />
        <div className="rememberForgot flex flex-wrap items-center justify-between">
          <FormField<PasswordFields>
            wrapperClass="form__Groupip__Checkbox"
            type="checkbox"
            name="agreeTerms"
            label={
              <>
                I have read and agree to the{' '}
                <a href="#" className="text-ip__Blue underline">
                  term of service
                </a>
              </>
            }
            register={register}
            error={errors.agreeTerms}
          />
        </div>

        <Button
          isLoading={registerLoading}
          className="w-full mt-[20px] mb-[20px]"
          type="submit"
          icon="plusFilled"
        >
          Create Account
        </Button>
      </form>
      <p className="text-center text-ipDashboardMediumDarkText text-[18px] font-biotif__Regular mb-0 mt-[30px]">
        Go Back to&nbsp;
        <span
          onClick={goToLoginPage}
          className="text-ip__Orange hover:underline font-biotif__Medium cursor-pointer"
        >
          Login
        </span>
      </p>
    </AuthCard>
  );
};

export default PasswordDetails;
