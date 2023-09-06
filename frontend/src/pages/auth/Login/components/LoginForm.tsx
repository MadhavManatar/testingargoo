// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import FormField from 'components/FormField';
import AuthCard from 'pages/auth/components/AuthCard';
import SocialLogin from './SocialLogin';

// ** Redux **
import { setLogoutData } from 'redux/slices/authSlice';

// ** Types **
import type {
  LoginFormFields,
  LoginFormProps,
} from 'pages/auth/Login/types/login.types';

// ** Schema **
import { loginSchema } from 'pages/auth/Login/validation-schema/login.schema';

// ** Constant **
import { PUBLIC_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import { convertAtoB, parseData } from 'utils/util';

const LoginForm = (props: LoginFormProps) => {
  const { login, loginWithGoogle, loginWithApple, loading } = props;

  // ** Hooks **
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ** Custom Hooks **
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormFields>({
    resolver: yupResolver(loginSchema),
  });

  // ** here set the remember value **
  useEffect(() => {
    const rememberMeString: string | null = localStorage.getItem('remember-me');
    const rememberMeValue: LoginFormFields = parseData(rememberMeString);

    if (rememberMeValue && rememberMeValue.email && rememberMeValue.password) {
      reset({
        ...rememberMeValue,
        password: convertAtoB(rememberMeValue.password),
      });
    }
  }, []);

  const onSubmit = handleSubmit((value) => {
    const loginData = {
      email: value.email,
      password: value.password,
      remember: value.remember,
    };
    login(loginData);
  });

  return (
    <AuthCard
      title="Login"
      subTitle="Please enter your email and password in order to continue."
    >
      <SocialLogin
        formType="login"
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
        <FormField<LoginFormFields>
          type="text"
          name="email"
          label="Email"
          icon="mailFilled"
          placeholder="Enter Your Email"
          register={register}
          error={errors.email}
          fieldLimit={60}
          required
        />
        <FormField<LoginFormFields>
          type="password"
          name="password"
          label="Password"
          placeholder="Enter Your Password"
          icon="securityFilled"
          register={register}
          error={errors.password}
          required
        />
        <div className="rememberForgot flex flex-wrap items-center justify-between">
          <FormField<LoginFormFields>
            wrapperClass="form__Groupip__Checkbox"
            type="checkbox"
            name="remember"
            label="Remember me"
            register={register}
          />
          <Link
            to={PUBLIC_NAVIGATION.forgotPassword}
            className="font-biotif__Medium text-ip__Orange text-[14px] hover:underline"
          >
            Forgot Password
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full mt-[30px]"
          isLoading={loading.simpleLoginLoader}
        >
          Login
        </Button>
      </form>

      <p className="text-center text-dark__TextColor text-[16px] font-biotif__Regular mb-0 mt-[30px]">
        New Here?{' '}
        <span
          onClick={() => {
            dispatch(setLogoutData());
            navigate(PUBLIC_NAVIGATION.register);
          }}
          className="text-ip__Orange hover:underline font-biotif__Medium cursor-pointer"
        >
          Create Account
        </span>
      </p>
    </AuthCard>
  );
};

export default LoginForm;
