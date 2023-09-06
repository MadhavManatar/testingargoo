// ** import packages **
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

// ** Components **
import FormField from 'components/FormField';
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Services **
import { useGetIsSubAccountEnabled } from '../../hooks/useAccountSettingsService';

// ** Constants **
import { BREAD_CRUMB, GENERAL_SETTING_VALID_KEYS } from 'constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import { ToastMsg } from 'constant/toast.constants';
import {
  useAddUpdateGeneralSettingMutation,
  useLazyGetGeneralSettingQuery,
} from 'redux/api/generalSettingApi';

const ParentAccountSetting = () => {
  // ** hooks **
  const [, setIsSubAccountEnable] = useState<boolean>(false);
  const formMethods = useForm<{ isSubAccountEnabled: boolean }>();
  const { setValue, register } = formMethods;
  const currentUser = useSelector(getCurrentUser);

  // ** custom hooks **
  const { updateAccountPermission } = usePermission();

  // ** APIS **
  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();
  const [changeGeneralSetting] = useAddUpdateGeneralSettingMutation();

  useGetIsSubAccountEnabled({
    setValue,
    generalSettingKey: 'is_parent_account_enable',
    generalSettingModel: POLYMORPHIC_MODELS.USER,
    modelRecordId: currentUser?.id,
  });

  useEffect(() => {
    fetchSubAccountEnableSettingData();
  }, []);

  const changeSubAccountEnableSetting = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (updateAccountPermission)
      await changeGeneralSetting({
        data: {
          dataList: [
            {
              model_name: POLYMORPHIC_MODELS.USER,
              key: GENERAL_SETTING_VALID_KEYS.is_parent_account_enable,
              value: `${event.target.checked}`,
              model_record_id: currentUser?.id,
            },
          ],
          module: ModuleNames.ACCOUNT,
          toastMsg: ToastMsg.settings.moduleSettings.account.name.updateMsg,
        },
      });
  };

  const fetchSubAccountEnableSettingData = async () => {
    const { data: isSubAccountData, error: subAccountDataError } =
      await getGeneralSetting(
        {
          params: {
            'q[key]': GENERAL_SETTING_VALID_KEYS.is_parent_account_enable,
            'q[model_name]': POLYMORPHIC_MODELS.USER,
            'q[model_record_id]': currentUser?.id,
            module: ModuleNames.ACCOUNT,
          },
        },
        true
      );
    if (isSubAccountData && !subAccountDataError) {
      const subAccountBoolean = isSubAccountData[0]?.value === 'true';
      setValue('isSubAccountEnabled', subAccountBoolean);
      setIsSubAccountEnable(subAccountBoolean);
    }
  };

  return (
    <SettingLayout
      title="Account Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.account.type}
      sideBarLinks={SETTING_SIDEBAR.accountSetting}
    >
      <form>
        <div className="flex flex-wrap items-center">
          <span className="text-[16px] font-biotif__Medium text-ipBlack__textColor mr-[12px]">
            Enable Parent Account
          </span>
          <FormField
            wrapperClass="toggleSwitch mb-0"
            type="checkbox"
            name="isSubAccountEnabled"
            disabled={!updateAccountPermission}
            register={register}
            onChange={(event) => {
              changeSubAccountEnableSetting(
                event as React.ChangeEvent<HTMLInputElement>
              );
            }}
          />
        </div>
      </form>
    </SettingLayout>
  );
};

export default ParentAccountSetting;
