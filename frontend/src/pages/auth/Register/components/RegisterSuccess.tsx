// ** Component **
import AuthCard from 'pages/auth/components/AuthCard';

// ** Icon **
import ForgotLinkIcon from 'assets/images/forgotLinkIcon.svg';

const RegisterSuccess = () => {
  return (
    <AuthCard showHeader={false}>
      <div className="flex justify-center">
        <img src={ForgotLinkIcon} alt="" />
      </div>
      <p className="text-center text-colorBlack08 text-[18px] font-biotif__Regular mt-[30px] mb-[20px]">
        Please check your email for the confirmation mail. Click the link in the
        email to verify your account.
      </p>
    </AuthCard>
  );
};

export default RegisterSuccess;
