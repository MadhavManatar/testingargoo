import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import FormField from 'components/FormField';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';
import { useEffect, useState } from 'react';
import AlertModal from 'components/Modal/AlertModal';
import Icon from 'components/Icon';
import { useUpdateUserMutation } from 'redux/api/userApi';

const TwoFactorAuthentication = () => {
  // redux slice
  const currentUser = useSelector(getCurrentUser);

  // ** states **
  const [isOpen, setIsOpen] = useState(false);
  const [settingValue, setSettingValue] = useState(false);
  const [qrCode, setQRCode] = useState<string>();

  // ** APIS **
  const [updateUserByIdAPI] = useUpdateUserMutation();

  useEffect(() => {
    if (currentUser && currentUser.two_factor_enabled) {
      setSettingValue(currentUser.two_factor_enabled);
    }
  }, []);

  // ** handel enable disable setting of 2 factor authentication
  const switchHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) return setIsOpen(true);
    return onSubmit(event.target.checked);
  };

  const onSubmit = async (value: boolean) => {
    if (currentUser?.id) {
      const data = await updateUserByIdAPI({
        id: currentUser?.id,
        data: {
          email: currentUser.email,
          two_factor_enabled: value,
        },
      });
      if ('data' in data) {
        if (!value) setIsOpen(false);
        setSettingValue(value);
        return setQRCode(data?.data?.QRCode || '');
      }
    }
  };

  return (
    <SettingLayout
      title="Two Factor Authentication Settings"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.securitySettings.twoFactorAuth
      }
      sideBarLinks={SETTING_SIDEBAR.securitySettings}
    >
      <form>
        <p className="text-[16px] font-biotif__Medium text-mediumDark__TextColor mb-[10px]">
          The Allow Two Factor Authentication will allow users to two factor
          authentication for application . Enable it and give it a go!
        </p>
        <div className="flex flex-wrap items-center">
          <span className="text-[16px] font-biotif__Medium text-ip__black__text__color mr-[12px]">
            Allow Two Factor Authentication
          </span>
          <FormField
            wrapperClass="toggleSwitch mb-0"
            type="checkbox"
            name="auth2FA"
            checked={settingValue}
            onChange={($event) => {
              switchHandler($event as React.ChangeEvent<HTMLInputElement>);
            }}
          />
        </div>
        {qrCode && (
          <div className="w-[290px] mt-5">
            <p className="text-[14px] font-biotif__Medium text-black/50 mb-[20px]">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo con
            </p>
            <div className="border border-[#CCCCCC]/80 rounded-[20px] p-[15px] flex justify-center items-center">
              <img className="inline-block w-[250px]" src={qrCode} alt="" />
            </div>
          </div>
        )}
      </form>
      <AlertModal
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        onCancel={() => setIsOpen(false)}
        onSubmit={() => onSubmit(false)}
        width="800px"
        submitButtonText="Yes"
        cancelButtonText="No"
        submitButtonClass="bg-ip__SuccessGreen"
        customIcon={<Icon className="w-full h-full" iconType="alertIcon" />}
      >
        <h5 className="confirmation__title">
          Are you sure you want to disable 2 Factor Authentication
        </h5>
      </AlertModal>
    </SettingLayout>
  );
};

export default TwoFactorAuthentication;
