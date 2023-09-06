// ** external packages **
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

// ** redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** components **
import FormField from 'components/FormField';
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** Hook **
import useSettingSidebarLinks from 'hooks/useSettingSidebarLinks';
import { useGetIsAutoSuggestAddressEnabled } from '../hooks/useGeneralSettingsService';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';
import { useAddUpdateGeneralSettingMutation } from 'redux/api/generalSettingApi';

const AddressSetting = () => {
  // ** hooks **
  const formMethods = useForm<{ isAutoSuggestAddressEnabled: boolean }>();
  const { setValue, register } = formMethods;

  // ** APIS **
  const [changeGeneralSetting] = useAddUpdateGeneralSettingMutation();

  // ** custom hooks **
  const currentUser = useSelector(getCurrentUser);
  const { filterCommonControlsSideBarLink } = useSettingSidebarLinks();

  // set the value
  useGetIsAutoSuggestAddressEnabled({ setValue });

  const changeAddressSetting = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await changeGeneralSetting({
      data: {
        dataList: [
          {
            model_name: POLYMORPHIC_MODELS.USER,
            model_record_id: currentUser?.id,
            key: 'is_address_auto_typed',
            value: `${event.target.checked}`,
          },
        ],
        module: 'user_settings',
        toastMsg:
          ToastMsg.settings.generalSettings.commonControls.addressSetting
            .updateMsg,
      },
    });
  };

  return (
    <SettingLayout
      title="Common Controls"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.commonControls.addressSetting
      }
      sideBarLinks={filterCommonControlsSideBarLink()}
    >
      <form>
        <p className="text-[16px] font-biotif__Medium text-black__TextColor600 mb-[10px]">
          The auto suggest address will make it simple for users to enter a
          location. If the auto suggest address feature is enabled, the user
          will receive suggestions wherever the platform's enter address options
          are available. This will simplify, streamline, and speed up the
          procedure. Enable it and give it a go!
        </p>
        <div className="flex flex-wrap items-center">
          <span className="text-[16px] font-biotif__Medium text-ipBlack__textColor mr-[12px]">
            Auto-suggest Address
          </span>
          <FormField
            wrapperClass="toggleSwitch mb-0"
            type="checkbox"
            name="isAutoSuggestAddressEnabled"
            register={register}
            onChange={($event) => {
              changeAddressSetting(
                $event as React.ChangeEvent<HTMLInputElement>
              );
            }}
          />
        </div>
      </form>
    </SettingLayout>
  );
};

export default AddressSetting;
