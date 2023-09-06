// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import FormField from 'components/FormField';
import AuthCard from 'pages/auth/components/AuthCard';
import SocialLogin from 'pages/auth/Login/components/SocialLogin';

// ** Types **
import type {
  BasicDetailsProps,
  BasicFields,
} from 'pages/auth/Register/types/register.types';

// ** Schema **
import { basicDetailsSchema } from 'pages/auth/Register/validation-schema/register.schema';

// ** Service **
import { useEmailIsExistsAPI } from 'pages/auth/services/auth.service';

// ** Constants **
import { maskInputRegex } from 'constant/regex.constant';
import { PUBLIC_NAVIGATION } from 'constant/navigation.constant';

const BasicDetails = (props: BasicDetailsProps) => {
  const {
    formData,
    setFormData,
    next: goToNext,
    loading,
    loginWithGoogle,
    loginWithApple,
  } = props;
  const { firstName, lastName, businessEmail, mobile } = formData;

  // ** Custom Hooks **
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm<BasicFields>({
    defaultValues: { firstName, lastName, businessEmail, mobile },
    resolver: yupResolver(basicDetailsSchema),
  });
  const { emailIsExistsAPI, isLoading } = useEmailIsExistsAPI();

  const onSubmit = handleSubmit(async (data) => {
    if (data.businessEmail) {
      const { error } = await emailIsExistsAPI({ email: data.businessEmail });
      if (error) {
        if (error === 'Email already exist!')
          setError('businessEmail', { type: 'custom', message: error });
      } else {
        setFormData(data);
        goToNext();
      }
    }
  });

  return (
    <AuthCard
      title="Create Account"
      subTitle="Please provide necessary Details to Complete the Sign Up Process"
    >
      <SocialLogin
        formType="register"
        googleLoading={loading.googleLoginLoader}
        appleLoading={loading.appleLoginLoader}
        loginWithGoogle={loginWithGoogle}
        loginWithApple={loginWithApple}
      />

      <div className='orHR mt-[22px] mb-[20px] text-center text-light__TextColor text-[16px] uppercase font-biotif__Medium relative before:content-[""] before:top-[10px] before:left-[50%] before:translate-x-[-50%] before:absolute before:h-[1px] before:w-[calc(100%_-_20px)] before:bg-whiteScreen__BorderColor'>
        <span className="inline-block z-[2] relative px-[10px] bg-white">
          OR
        </span>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form__Row double mx-[-13px] flex flex-wrap">
          <FormField<BasicFields>
            wrapperClass="w-1/2 px-[13px] sm:w-full"
            type="text"
            name="firstName"
            label="First Name"
            placeholder="Type Here"
            register={register}
            error={errors?.firstName}
            fieldLimit={100}
            required
          />
          <FormField<BasicFields>
            wrapperClass="w-1/2 px-[13px] sm:w-full"
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="Type Here"
            autoComplete="new-password"
            register={register}
            error={errors?.lastName}
            fieldLimit={100}
            required
          />
        </div>
        <FormField<BasicFields>
          fieldLimit={60}
          type="text"
          name="businessEmail"
          label="Business Email Address"
          placeholder="Enter Your Email"
          autoComplete="new-password"
          icon="mailFilled"
          register={register}
          error={errors?.businessEmail}
          required
        />
        <FormField<BasicFields>
          type="mask_input"
          maskInputType="mask_input_phone"
          name="mobile"
          label="Contact Number"
          placeholder="EX. (XXX) XXX-XXXX"
          icon="phoneFilled"
          register={register}
          error={errors?.mobile}
          control={control}
          mask={maskInputRegex}
          inputMode="numeric"
        />
        <Button
          className="w-full mt-[20px]"
          type="submit"
          icon="plusFilled"
          isLoading={isLoading}
        >
          Continue
        </Button>
      </form>

      <p className="text-center text-dark__TextColor text-[16px] font-biotif__Regular mb-0 mt-[30px]">
        Already have an account? &nbsp;
        <Link
          to={PUBLIC_NAVIGATION.login}
          className="text-ip__Orange hover:underline font-biotif__Medium"
        >
          Login
        </Link>
      </p>
    </AuthCard>
  );
};

export default BasicDetails;
