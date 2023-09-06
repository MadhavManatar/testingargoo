// ** types **
import { EmailModalType } from 'pages/Email/types/email.type';
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from '../../types/userToken.type';

interface PropsInterface {
  setModal: React.Dispatch<React.SetStateAction<EmailModalType | undefined>>;

  provider: {
    value: string;
    urlValue: string;
  };
  setProvider: React.Dispatch<
    React.SetStateAction<{
      value: TokenProvider | '';
      urlValue: AuthProviderConnectURLS | '';
    }>
  >;
}

const ConnectEmailProvider = (props: PropsInterface) => {
  const { setModal, provider, setProvider } = props;

  return (
    <div className="xl:mt-[10px] sm:mt-0">
      <h3 className="text-[20px] leading-[24px] font-biotif__Medium text-ipBlack__textColor mb-[10px]">
        Select your email provider
      </h3>
      <p className="text-[16px] leading-[24px] font-biotif__Regular text-black__TextColor600">
        Once you connect your email to the CRM, you can
      </p>
      <ul className="roundTick__UL mt-[20px]">
        <li>Send and receive emails in Smackdab</li>
        <li>Track your emails live for opens and clicks</li>
      </ul>
      <div className="email__provider__wrapper flex flex-wrap mx-[-12px] mt-[30px] sm:mx-[-6px] sm:mt-[20px]">
        <div
          className={`email__provider__box w-[180px] px-[12px] mb-[22px] lg:w-[140px] lg:mb-[12px] sm:px-[6px] sm:w-1/3 xsm:w-1/2  cursor-pointer ${
            provider.value === TokenProvider.GOOGLE_MAIL ? 'active' : ''
          }`}
          onClick={() => {
            setProvider({
              value: TokenProvider.GOOGLE_MAIL,
              urlValue: AuthProviderConnectURLS.google,
            });
            setModal('syncEmail');
          }}
        >
          <div className="inner__box relative group">
            <div className="img__box w-full pt-[100%] relative border border-whiteScreen__BorderColor rounded-[12px] group-hover:bg-parentBgWhite__grayBtnBG">
              <img
                className="absolute top-0 left-0 w-full h-full object-contain object-center p-[30%]"
                src="/images/gmail__icon.svg"
                alt=""
              />
            </div>
            <h4 className="title text-[14px] leading-[20px] text-center font-biotif__Medium mt-[10px] text-ipBlack__textColor mb-[8px] sm:mt-[6px]">
              Gmail
            </h4>
          </div>
        </div>
        <div
          className={`email__provider__box w-[180px] px-[12px] mb-[22px] lg:w-[140px] lg:mb-[12px] sm:px-[6px] sm:w-1/3 xsm:w-1/2 cursor-pointer ${
            provider.value === 'microsoft_outlook' ? 'active' : ''
          }`}
          onClick={() => {
            setProvider({
              value: TokenProvider.OUTLOOK,
              urlValue: AuthProviderConnectURLS.microsoft,
            });
            setModal('syncEmail');
          }}
        >
          <div className="inner__box relative group">
            <div className="img__box w-full pt-[100%] relative border border-whiteScreen__BorderColor rounded-[12px] group-hover:bg-parentBgWhite__grayBtnBG">
              <img
                className="absolute top-0 left-0 w-full h-full object-contain object-center p-[30%]"
                src="/images/microsoft__Outlook__icon.svg"
                alt=""
              />
            </div>
            <h4 className="title text-[14px] leading-[20px] text-center font-biotif__Medium mt-[10px] text-ipBlack__textColor mb-[8px] sm:mt-[6px]">
              Microsoft Outlook
            </h4>
          </div>
        </div>
        <div
          className={`hidden email__provider__box w-[180px] px-[12px] mb-[22px] lg:w-[140px] lg:mb-[12px] sm:px-[6px] sm:w-1/3 xsm:w-1/2 cursor-pointer ${
            provider.value === TokenProvider.OTHER ? 'active' : ''
          }`}
          onClick={() => {
            setProvider({
              value: TokenProvider.OTHER,
              urlValue: AuthProviderConnectURLS.other,
            });
            setModal('smtp');
          }}
        >
          <div className="inner__box relative group">
            <div className="img__box w-full pt-[100%] relative border border-whiteScreen__BorderColor rounded-[12px] group-hover:bg-parentBgWhite__grayBtnBG">
              <img
                className="absolute top-0 left-0 w-full h-full object-contain object-center p-[30%]"
                src="/images/other__email__provider__icon.svg"
                alt=""
              />
            </div>
            <h4 className="title text-[14px] leading-[20px] text-center font-biotif__Medium mt-[10px] text-ipBlack__textColor mb-[8px] sm:mt-[6px]">
              Other
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectEmailProvider;
