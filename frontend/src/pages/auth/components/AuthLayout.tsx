// ** Icons **
import SignUpBG from 'assets/images/signupBg.png';
import Smackdab from 'assets/images/Smackdab.png';

// ** Type **
import { AuthLayoutProps } from '../types/authLayout.types';

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="singupScreen relative min-h-screen px-[15px] py-[60px] sm:py-[35px]">
      <img
        className="singupBG fixed top-0 left-0 w-full h-screen z-[-1]"
        src={SignUpBG}
        alt=""
      />
      <div className="logoWrapper">
        {/* <div className="logo__Box w-[116px] h-[116px] sm:w-[110px] sm:h-[110px] mx-auto rounded-full bg-white shadow-[2.73585px_5.4717px_10.9434px_#dee2e64d] flex flex-wrap content-center justify-center">
          <img className="w-[54px] h-auto" src={SiteLogo} alt="" />
          <p className="opacity-50 text-black uppercase font-biotif__Bold text-center w-full mt-[10px] sm:mt-[5px] text-[10.94px]">
            Smackdab
          </p>
        </div> */}
        <div className='w-[265px] max-w-full mx-auto mb-[30px]'>
          <img src={Smackdab} alt='Smackdab' />
        </div>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;
