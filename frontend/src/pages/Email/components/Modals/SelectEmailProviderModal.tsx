// ** external packages **
import { useSelector } from 'react-redux';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** modal **
import Modal from 'components/Modal';

// ** types **
import { EmailModalType } from 'pages/Email/types/email.type';
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { REACT_APP_API_URL_WITHOUT_VERSION, REACT_APP_FRONT_URL } from 'config';

interface PropsInterface {
  tokenSuccessURL: string;
  isOpen: boolean;
  closeModal: () => void;
  setModal: Dispatch<SetStateAction<EmailModalType | undefined>>;
  userTokenProviders: string[];
}
const SelectEmailProviderModal = (props: PropsInterface) => {
  const { closeModal, isOpen, setModal, userTokenProviders, tokenSuccessURL } =
    props;

  const organizationUUID = localStorage.getItem('organization_uuid');

  const currentUser = useSelector(getCurrentUser);

  const [provider, setProvider] = useState<{
    value: TokenProvider | '';
    urlValue: AuthProviderConnectURLS | '';
  }>({ value: '', urlValue: '' });

  // ** Custom hooks **
  const { handleSubmit, reset } = useForm();

  const onSubmit = handleSubmit(async () => {
    if (provider.value === TokenProvider.OTHER) {
      setModal('smtp');
    }

    if (
      provider?.urlValue &&
      provider?.value &&
      [TokenProvider.GOOGLE_MAIL, TokenProvider.OUTLOOK].includes(
        provider.value
      )
    ) {
      const token = window.btoa(
        JSON.stringify({
          userId: currentUser?.id,
          organizationUUID,
          token_provider: provider.value,
          successURL: tokenSuccessURL,
          failureURL: REACT_APP_FRONT_URL,
        })
      );
      window.open(
        `${REACT_APP_API_URL_WITHOUT_VERSION}/auth/${provider.urlValue}/connect?token=${token}`,
        '_self'
      );
    }
  });

  const close = () => {
    reset();
    closeModal();
  };

  const MAIL_OPTIONS = [
    {
      name: 'Gmail',
      isActive: provider.value === TokenProvider.GOOGLE_MAIL ? 'active' : '',
      isDisabled: userTokenProviders?.includes(TokenProvider.GOOGLE_MAIL)
        ? 'disable'
        : '',
      providerValue: {
        value: TokenProvider.GOOGLE_MAIL,
        urlValue: AuthProviderConnectURLS.google,
      },
      image: { src: '/images/gmail__icon.svg', altImg: 'gmailIcon' },
    },
    {
      name: 'Microsoft Outlook',
      isActive: provider.value === TokenProvider.OUTLOOK ? 'active' : '',
      isDisabled: userTokenProviders?.includes(TokenProvider.OUTLOOK)
        ? 'disable'
        : '',
      providerValue: {
        value: TokenProvider.OUTLOOK,
        urlValue: AuthProviderConnectURLS.microsoft,
      },
      image: {
        src: '/images/microsoft__Outlook__icon.svg',
        altImg: 'microsoftIcon',
      },
    },
    // HELLO
    // {
    //   name: 'Other',
    //   isActive: provider.value === TokenProvider.OTHER ? 'active' : '',
    //   isDisabled: '',
    //   providerValue: {
    //     value: TokenProvider.OTHER,
    //     urlValue: AuthProviderConnectURLS.other,
    //   },
    //   image: {
    //     src: '/images/other__email__provider__icon.svg',
    //     altImg: 'mailIcon',
    //   },
    // },
  ];

  return (
    <Modal
      title="Select your email provider"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      onSubmit={onSubmit}
      submitLoading={false}
      width="540px"
      cancelButtonText="Cancel"
      submitBtnDisabled={!provider.value}
      submitButtonText="Continue"
    >
      <h3 className="text-[18px] leading-[24px] font-biotif__Medium text-ipBlack__textColor mb-[20px]">
        Once you connect your email to the CRM, you can
      </h3>
      <ul className="roundTick__UL mb-[32px]">
        <li className="!mb-[14px]">Send and receive emails in Smackdab</li>
        <li className="!mb-[14px]">
          Track your emails live for opens and clicks
        </li>
      </ul>
      <div className="email__provider__wrapper flex flex-wrap mx-[-12px] sm:mx-[-5px]">
        {MAIL_OPTIONS.map(
          ({ isActive, isDisabled, providerValue, name, image }) => {
            return (
              <div
                key={name}
                onClick={() => setProvider({ ...providerValue })}
                className={`email__provider__box w-1/3 px-[12px] sm:px-[5px] xsm:w-1/2 ${isActive} ${isDisabled}`}
              >
                <div className="inner__box relative group">
                  <div className="img__box w-full pt-[100%] relative border border-whiteScreen__BorderColor rounded-[12px] group-hover:bg-parentBgWhite__grayBtnBG">
                    <img
                      src={image.src}
                      alt={image.altImg}
                      className="absolute top-0 left-0 w-full h-full object-contain object-center p-[30%]"
                    />
                  </div>
                  <h4 className="title text-[14px] leading-[20px] text-center font-biotif__Medium mt-[10px] text-ipBlack__textColor mb-[8px]">
                    {name}
                  </h4>
                </div>
              </div>
            );
          }
        )}
      </div>
    </Modal>
  );
};

export default SelectEmailProviderModal;
