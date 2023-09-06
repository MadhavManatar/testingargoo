// ** Import Packages **
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import AppleLogin from 'react-apple-login';

// ** Icons **
import AppleLogo from 'assets/images/appleLogo.svg';
import GoogleLogo from 'assets/images/googleLogo.svg';

// ** Type **
import { SocialLoginProps } from 'pages/auth/Login/types/login.types';

// ** Other **
import {
  REACT_APP_APPLE_CLIENT_ID,
  REACT_APP_APPLE_REDIRECT_URI,
} from 'config';
import { logger } from 'utils/util';

const appleClientId = REACT_APP_APPLE_CLIENT_ID || '';
const appleReturnUri = REACT_APP_APPLE_REDIRECT_URI || '';

const SocialLogin = ({
  googleLoading,
  loginWithGoogle,
  appleLoading,
  loginWithApple,
  formType,
}: SocialLoginProps) => {
  const onGoogleLogin = async (credentials: CredentialResponse) => {
    const idToken = credentials.credential;
    if (idToken) loginWithGoogle(idToken);
  };
  const onAppleLogin = async (response: any) => {
    if (!response.error) loginWithApple(response);
  };

  return (
    <div className="appleGLogin w-full flex flex-wrap justify-between">
      <div className="apple__Login w-[calc(50%_-_13px)] sm:w-full sm:mb-[12px]">
        <AppleLogin
          clientId={appleClientId}
          redirectURI={appleReturnUri}
          usePopup
          callback={(response: any) => {
            onAppleLogin(response);
          }}
          scope="name email"
          responseMode="code"
          render={(renderProps: any) => (
            <button
              onClick={renderProps.onClick}
              type="button"
              className="w-full flex items-center justify-center border border-black h-[46px] rounded-[6px] text-center py-[10px] px-[10px] text-[14px] font-[Biotif-Medium] duration-[500ms] hover:bg-formField__BGColor"
            >
              {!appleLoading ? (
                <img
                  className="mr-[5px] relative top-[-2px]"
                  src={AppleLogo}
                  alt=""
                />
              ) : (
                <div className="i__ButtonLoader i__ButtonLoader__ForLight" />
              )}
              Sign {formType === 'login' ? 'in' : 'up'} with Apple
            </button>
          )}
        />
      </div>
      <div className="google__Login w-[calc(50%_-_13px)] sm:w-full">
        <button
          type="button"
          className="w-full relative flex items-center justify-center border border-black h-[46px] rounded-[6px] text-center py-[10px] px-[10px] text-[14px] font-biotif__Medium duration-[500ms] hover:bg-formField__BGColor"
        >
          {!googleLoading ? (
            <img
              className="mr-[5px] relative top-[-2px]"
              src={GoogleLogo}
              alt=""
            />
          ) : (
            <div className="i__ButtonLoader i__ButtonLoader__ForLight" />
          )}
          Sign {formType === 'login' ? 'in' : 'up'} with Google
          <GoogleLogin
            size="medium"
            onSuccess={onGoogleLogin}
            onError={() => logger('Login Failed')}
          />
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
