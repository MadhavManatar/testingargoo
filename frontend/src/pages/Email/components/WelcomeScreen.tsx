import Button from 'components/Button';
import { EmailModalType } from '../types/email.type';

interface PropsInterface {
  openModal: (value: EmailModalType) => void;
}

const WelcomeScreen = (props: PropsInterface) => {
  const { openModal } = props;
  return (
    <div className="welcomeEmail__screen">
      <h2 className="text-[30px] font-biotif__SemiBold text-ipBlack__textColor leading-[40px] mb-[45px] xl:text-[22px] xl:mb-[20px]">
        Welcome to Smackdab Mail
      </h2>
      <div className="flex flex-wrap">
        <div className="w-1/2 pr-[50px] border-r border-r-whiteScreen__BorderColor xl:pr-[20px] lg:pr-0 lg:w-full lg:border-r-0 lg:border-b lg:border-b-whiteScreen__BorderColor lg:pb-[24px] lg:mb-[24px]">
          <img src="images/email__welcome__icon.svg" alt="" />
          <div className="flex flex-wrap items-center mt-[25px] mb-[10px] xl:mt-[12px]">
            <h3 className="text-[22px] leading-[30px] font-biotif__Medium text-ipBlack__bgColor mb-[10px] mr-[13px] xl:text-[18px] xl:leading-[25px]">
              Unlock your sales inbox
            </h3>
            <div className="badge badge__orange rounded-[6px] mb-[10px]">
              Advanced
            </div>
          </div>
          <p className="text-[18px] leading-[24px] font-biotif__Regular text-light__TextColor xl:text-[16px]">
            Tab switching and manually forwarding emails to Smackdab is a thing
            of the past. When unlocked, you can use your Sales Inbox to send
            emails directly from Smackdab while automatically linking them to
            reload deals and contact
          </p>
          <ul className="roundTick__UL mt-[40px] xl:mt-[16px]">
            <li>Sync Pipedrive Emails with any major email provider</li>
            <li>Track email Opens and Close</li>
            <li>Save time by making use of customizable templates</li>
            <li>Customize your signature for a more professional look</li>
          </ul>
          <Button
            onClick={() => openModal('provider')}
            className="primary__Btn smaller mt-[38px] xl:mt-[24px]"
          >
            Connect your Email
          </Button>
        </div>
        <div className="w-1/2 pl-[50px] xl:pl-[20px] lg:pl-0 lg:w-full">
          <img src="images/email__welcome__icon.svg" alt="" />
          <div className="flex flex-wrap items-center mt-[25px] mb-[10px] xl:mt-[12px]">
            <h3 className="text-[22px] leading-[30px] font-biotif__Medium text-ipBlack__bgColor mb-[10px] mr-[13px] xl:text-[18px] xl:leading-[25px]">
              Smart Email BCC
            </h3>
          </div>
          <p className="text-[18px] leading-[24px] font-biotif__Regular text-light__TextColor xl:text-[16px]">
            You can use Smart Bcc with your email addresses that are added to
            this list. If an address is not in this list, the emails won't be
            synced, even if you copy and paste the Smart Bcc address there.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
