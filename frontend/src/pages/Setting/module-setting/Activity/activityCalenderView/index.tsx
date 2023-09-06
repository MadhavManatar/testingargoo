import { BREAD_CRUMB, GENERAL_SETTING_VALID_KEYS } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import FormField from 'components/FormField';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';
import { useEffect, useState } from 'react';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';
import { setCalenderActivity } from 'redux/slices/commonSlice';
import {
  useAddUpdateGeneralSettingMutation,
  useLazyGetGeneralSettingQuery,
} from 'redux/api/generalSettingApi';

const ActivityVisibilityCalender = () => {
  // redux slice
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch();
  // ** states **
  const [isEnable, setIsEnable] = useState<boolean>(false);

  // ** APIS **
  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();
  const [changeGeneralSetting] = useAddUpdateGeneralSettingMutation();

  useEffect(() => {
    fetchCalenderActivitySettingData();
  }, []);

  const changeSubAccountEnableSetting = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await changeGeneralSetting({
      data: {
        dataList: [
          {
            model_name: POLYMORPHIC_MODELS.ACTIVITY,
            key: GENERAL_SETTING_VALID_KEYS.is_activity_calender_visibility,
            value: `${event.target.checked}`,
            model_record_id: currentUser?.id,
          },
        ],
        module: ModuleNames.ACTIVITY,
        toastMsg: ToastMsg.settings.moduleSettings.account.name.updateMsg,
      },
    });
    const is_visibility = event.target.checked;
    setIsEnable(!is_visibility);
    dispatch(setCalenderActivity({ is_visibility }));
  };

  const fetchCalenderActivitySettingData = async () => {
    const { data: is_visibility, error: activityCalenderVisibilityError } =
      await getGeneralSetting(
        {
          params: {
            'q[key]':
              GENERAL_SETTING_VALID_KEYS.is_activity_calender_visibility,
            'q[model_name]': POLYMORPHIC_MODELS.ACTIVITY,
            'q[model_record_id]': currentUser?.id,
            module: ModuleNames.ACTIVITY,
          },
        },
        true
      );
    if (!activityCalenderVisibilityError && is_visibility?.[0]?.value) {
      const calenderBoolean = is_visibility[0]?.value === 'true';
      setIsEnable(calenderBoolean);
      dispatch(setCalenderActivity(is_visibility?.[0].value));
    }
  };

  return (
    <SettingLayout
      title="Activity Visibility"
      breadCrumbPath={BREAD_CRUMB.settings.moduleSetting.activity.result}
      sideBarLinks={SETTING_SIDEBAR.activitySetting}
    >
      <div className="flex flex-wrap items-center">
        <span className="text-[16px] w-full font-biotif__Medium text-ip__black__text__color mr-[12px]">
          Activity to set the calendar visibility as default.
        </span>
        <div className="flex items-center mt-[5px]">
          <FormField
            wrapperClass="toggleSwitch mb-0"
            type="checkbox"
            name="isSubAccountEnabled"
            onChange={($event) => {
              changeSubAccountEnableSetting(
                $event as React.ChangeEvent<HTMLInputElement>
              );
            }}
            checked={isEnable}
          />
        </div>
        <span className="inline-block ml-[8px]">{isEnable ? 'Yes' : 'No'}</span>
      </div>
    </SettingLayout>
  );
};

export default ActivityVisibilityCalender;
