// ** Import Packages **
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

// ** Components **
import SettingLayout from 'pages/Setting/components/SettingLayout';
import ClosingDateSettingsForm from './components/ClosingDateSettingsForm';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Constants **
import { BREAD_CRUMB, GENERAL_SETTING_VALID_KEYS } from 'constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

// ** Types **
import { ClosingDateSettingsFormFieldsType } from './types/closingDateSettings.types';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';

const DealClosingDateSetting = () => {
  // ** hooks **
  const {
    register,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ClosingDateSettingsFormFieldsType>({
    defaultValues: {
      neutral_color: '#7EA838',
      warning_color: '#F78310',
      passed_due_color: '#e70e02',
      time_frame: 7,
    },
  });
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();

  const getDealClosingDateSettings = async () => {
    const { data } = await getGeneralSetting(
      {
        params: {
          'q[key][in]': `${[
            'deal_closing_date_color_settings_time_frame',
            'deal_closing_date_color_settings_neutral_color',
            'deal_closing_date_color_settings_warning_color',
            'deal_closing_date_color_settings_passed_due_color',
          ]}`,
          'q[model_name]': POLYMORPHIC_MODELS.USER,
          'q[model_record_id]': currentUser?.id,
          module: ModuleNames.DEAL,
        },
      },
      true
    );
    if (data?.length) {
      const values = data.reduce(
        (
          acc: { key: string; value: string },
          curr: { key: string; value: string }
        ) => ({ ...acc, [curr.key || '']: curr.value }),
        {}
      );
      reset({
        time_frame:
          values[
            GENERAL_SETTING_VALID_KEYS
              .deal_closing_date_color_settings_time_frame
          ],
        neutral_color:
          values[
            GENERAL_SETTING_VALID_KEYS
              .deal_closing_date_color_settings_neutral_color
          ],
        warning_color:
          values[
            GENERAL_SETTING_VALID_KEYS
              .deal_closing_date_color_settings_warning_color
          ],
        passed_due_color:
          values[
            GENERAL_SETTING_VALID_KEYS
              .deal_closing_date_color_settings_passed_due_color
          ],
      });
    }
    return {};
  };

  useEffect(() => {
    getDealClosingDateSettings();
  }, []);

  return (
    <SettingLayout
      title="Deal Settings"
      breadCrumbPath={
        BREAD_CRUMB.settings.moduleSetting.deal.closingDateSettings
      }
      sideBarLinks={SETTING_SIDEBAR.dealSetting}
    >
      <ClosingDateSettingsForm
        errors={errors}
        register={register}
        watch={watch}
        setValue={setValue}
      />
    </SettingLayout>
  );
};

export default DealClosingDateSetting;
