// ** Components **
import Button from 'components/Button';
import Icon from 'components/Icon';

// ** Type **
import { ContactSocialPropsType } from 'pages/Contact/types/contacts.types';

const ContactSocial = (props: ContactSocialPropsType) => {
  const { accordion, openCloseAccordion } = props;
  return (
    <div className="details__socialMedia__wrapper mb-[30px]">
      <div
        className="section__header"
        onClick={() => openCloseAccordion?.('social')}
      >
        <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
          Social
        </span>
        <button
          className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:-rotate-45 before:top-[8px] ${
            accordion?.social ? 'active' : ''
          } `}
        >
          .
        </button>
      </div>
      {accordion?.social && (
        <div className="border border-whiteScreen__BorderColor rounded-[12px] py-[20px] px-[24px] social__inner__wrapper flex flex-wrap xl:py-[15px] xl:px-[15px] sm:pb-0">
          <div className="left w-[37%] pr-[20px] lg:w-full lg:pr-0 lg:mb-[22px] sm:mb-[20px] sm:pb-[12px] sm:border-b sm:border-b-[#CCCCCC]/50">
            <div className="inner__wrapper w-[458px] max-w-full">
              <h3 className="text-[20px] font-biotif__Medium text-ipBlack__textColor mb-[15px] xl:mb-[7px] sm:text-[16px]">
                Social
              </h3>
              <p className="text-[14px] text-black__TextColor600 font-biotif__Regular mb-[20px]">
                Get started adding your personal social profiles. Start
                interacting with your connections on social networks
              </p>
              <div className="social__connection flex flex-wrap mx-[-5px]">
                <div className="social__box w-1/2 px-[5px] mb-[10px] xl:w-full lg:w-1/2 xsm:w-full">
                  <div className="inner__wrapper flex flex-wrap items-center rounded-[10px] bg-gray__BGColor">
                    <Icon className="bg-[#55ACEE]" iconType="twitterFilled" />
                    <span className="inline-block pl-[8px] text-primaryColor text-[14px] font-biotif__Regular w-[calc(100%_-_43px)] pr-[10px] whitespace-pre overflow-hidden text-ellipsis">
                      Connected
                    </span>
                  </div>
                </div>
                <div className="social__box w-1/2 px-[5px] mb-[10px] xl:w-full lg:w-1/2 xsm:w-full">
                  <div className="inner__wrapper flex flex-wrap items-center rounded-[10px] bg-gray__BGColor">
                    <Icon className="bg-[#3B5998]" iconType="facebookFilled" />
                    <span className="inline-block pl-[8px] text-primaryColor text-[14px] font-biotif__Regular w-[calc(100%_-_43px)] pr-[10px] whitespace-pre overflow-hidden text-ellipsis">
                      Connected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="right w-[63%] lg:w-full">
            <div className="associated_Profiles__wrapper bg-gray__BGColor py-[28px] pb-[10px] px-[24px] rounded-[12px] xl:pt-[18px] xl:pr-[15px] sm:!p-0 sm:!pl-[8px] sm:bg-transparent">
              <div className="header flex items-start sm:justify-end">
                <h3 className="mt-[6px] text-[20px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_182px)] mb-[10px] sm:hidden">
                  Associated Profiles
                </h3>
                <Button className="primary__Btn px-[20px] mb-[10px] sm:mb-0">
                  Associate New Profile
                </Button>
              </div>
              <div className="associated_Profiles__row border-b border-b-greyScreen__BorderColor py-[20px] flex flex-wrap items-center relative">
                <div className="img__wrapper w-[46px] h-[46px] relative">
                  <img src="/images/profileImg.png" alt="" />
                  <Icon
                    className="absolute top-[50%] translate-y-[-50%] left-[-11px] absolute__icon bg-[#3B5998] w-[22px] h-[22px] rounded-full p-[5px]"
                    iconType="facebookFilled"
                  />
                </div>
                <div className="details_-wrapper w-[calc(100%_-_46px)] pl-[12px] pr-[48px]">
                  <h4 className="text-[16px] font-biotif__Regular text-black__TextColor800 whitespace-pre overflow-hidden text-ellipsis">
                    Joseph Williams
                  </h4>
                  <p className="text-[14px] font-biotif__Regular text-black__TextColor600 whitespace-pre overflow-hidden text-ellipsis">
                    @Josephwilliams09
                  </p>
                </div>
                <Icon
                  className="absolute cursor-pointer top-[50%] translate-y-[-50%] right-0 delete__btn bg-[#FFE3E5] rounded-[5px] w-[36px] h-[36px] p-[8px] duration-500 hover:bg-[#EA4335]"
                  iconType="deleteFilled"
                />
              </div>
              <div className="associated_Profiles__row border-b border-b-greyScreen__BorderColor py-[20px] flex flex-wrap items-center relative">
                <div className="img__wrapper w-[46px] h-[46px] relative">
                  <img src="/images/profileImg.png" alt="" />
                  <Icon
                    className="absolute top-[50%] translate-y-[-50%] left-[-11px] absolute__icon bg-[#55ACEE] w-[22px] h-[22px] rounded-full p-[5px]"
                    iconType="twitterFilled"
                  />
                </div>
                <div className="details_-wrapper w-[calc(100%_-_46px)] pl-[12px] pr-[48px]">
                  <h4 className="text-[16px] font-biotif__Regular text-black__TextColor800 whitespace-pre overflow-hidden text-ellipsis">
                    Joseph Williams
                  </h4>
                  <p className="text-[14px] font-biotif__Regular text-black__TextColor600 whitespace-pre overflow-hidden text-ellipsis">
                    @Josephwilliams09
                  </p>
                </div>
                <Icon
                  className="absolute cursor-pointer top-[50%] translate-y-[-50%] right-0 delete__btn bg-[#FFE3E5] rounded-[5px] w-[36px] h-[36px] p-[8px] duration-500 hover:bg-[#EA4335]"
                  iconType="deleteFilled"
                />
              </div>
              <div className="associated_Profiles__row border-b border-b-greyScreen__BorderColor py-[20px] flex flex-wrap items-center relative">
                <div className="img__wrapper w-[46px] h-[46px] relative">
                  <img src="/images/profileImg.png" alt="" />
                  <Icon
                    className="absolute top-[50%] translate-y-[-50%] left-[-11px] absolute__icon bg-[#3B5998] w-[22px] h-[22px] rounded-full p-[5px]"
                    iconType="facebookFilled"
                  />
                </div>
                <div className="details_-wrapper w-[calc(100%_-_46px)] pl-[12px] pr-[48px]">
                  <h4 className="text-[16px] font-biotif__Regular text-black__TextColor800 whitespace-pre overflow-hidden text-ellipsis">
                    Joseph Williams
                  </h4>
                  <p className="text-[14px] font-biotif__Regular text-black__TextColor600 whitespace-pre overflow-hidden text-ellipsis">
                    @Josephwilliams09
                  </p>
                </div>
                <Icon
                  className="absolute cursor-pointer top-[50%] translate-y-[-50%] right-0 delete__btn bg-[#FFE3E5] rounded-[5px] w-[36px] h-[36px] p-[8px] duration-500 hover:bg-[#EA4335]"
                  iconType="deleteFilled"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSocial;
