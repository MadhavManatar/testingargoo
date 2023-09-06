// ** import packages **
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

// ** Components **
import FormField from 'components/FormField';
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** constants **
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';

// ** services **
import { useGetIsAllowMemoEnabled } from '../../hooks/useGeneralSettingsService';

// ** others **
import { BREAD_CRUMB, GENERAL_SETTING_VALID_KEYS } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import { ToastMsg } from 'constant/toast.constants';
import { useAddUpdateGeneralSettingMutation } from 'redux/api/generalSettingApi';

const DealGeneralSetting = () => {
  // ** hooks **
  const formMethods = useForm<{ isAllowMemoEnabled: boolean }>();
  const { setValue, register } = formMethods;
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [changeGeneralSetting] = useAddUpdateGeneralSettingMutation();

  // ** custom hooks **
  const { updateDealPermission } = usePermission();

  useGetIsAllowMemoEnabled({
    setValue,
    generalSettingKey: 'is_memo_allowed_in_deal_lost',
    generalSettingModel: POLYMORPHIC_MODELS.USER,
    modelRecordId: currentUser?.id,
  });

  const changeMemoSetting = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (updateDealPermission)
      await changeGeneralSetting({
        data: {
          dataList: [
            {
              model_name: POLYMORPHIC_MODELS.USER,
              key: GENERAL_SETTING_VALID_KEYS.is_memo_allowed_in_deal_lost,
              value: `${event.target.checked}`,
              model_record_id: currentUser?.id,
            },
          ],
          module: ModuleNames.DEAL,
          toastMsg:
            ToastMsg.settings.moduleSettings.deal.generalSetting.updateMsg,
        },
      });
  };

  return (
    <SettingLayout
      title="Deal Settings"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.deal.generalSettings}
      sideBarLinks={SETTING_SIDEBAR.dealSetting}
    >
      <form>
        <p className="text-[16px] font-biotif__Medium text-black__TextColor600 mb-[10px]">
          The Require Memo will allow users to enter a comment when the user
          changes deal stage to any of lost stages. Enable it and give it a go!
        </p>
        <div className="flex flex-wrap items-center">
          <span className="text-[16px] font-biotif__Medium text-ipBlack__textColor mr-[12px]">
            Require Memo
          </span>
          <FormField
            wrapperClass="toggleSwitch mb-0"
            type="checkbox"
            name="isAllowMemoEnabled"
            register={register}
            disabled={!updateDealPermission}
            onChange={($event) => {
              changeMemoSetting($event as React.ChangeEvent<HTMLInputElement>);
            }}
          />
        </div>
      </form>
    </SettingLayout>
  );
};

export default DealGeneralSetting;
