// ** Import Packages **
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MultiValue, SingleValue } from 'react-select';

// ** Components **
import CustomDropDown from 'components/CustomDropDown';
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** Redux **
import {
  getNotificationsSetting,
  setNotificationSetting,
} from 'redux/slices/notificationSlice';

// ** API **
import {
  useLazyGetNotificationSettingQuery,
  useSetNotificationSettingMutation,
} from 'redux/api/notificationSettingApi';

// ** Types **
import { Option } from 'components/FormField/types/formField.types';
import { NotificationType } from './types/notification-settings';

// ** Constants **
import { BREAD_CRUMB } from 'constant/breadCrumb.constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

const SIDEBAR_LINKS = SETTING_SIDEBAR.notification;

const hourOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
  { value: 11, label: '11' },
  { value: 12, label: '12' },
];

enum SettingType {
  DAILY = 'Daily',
  SUMMARY = 'Summary',
}

const ScheduleEmailTiming = () => {
  // ** Hooks **
  const settingTime = useSelector(getNotificationsSetting);
  const dispatch = useDispatch();

  // ** States **
  const [scheduleSettings, setScheduleSettings] = useState({
    daily: {
      time: { value: 0, label: 'Select' },
      am_pm: 'AM',
    },
    summary: { time: { value: 0, label: 'Select' } },
  });

  // ** APIS **
  const [getNotificationSettingApi] = useLazyGetNotificationSettingQuery();
  const [setNotificationTimeSettingAPI] = useSetNotificationSettingMutation();

  useEffect(() => {
    if (
      settingTime.daily_notification_time === null ||
      settingTime.summary_notification_time === null
    ) {
      getNotificationSetting();
    }
  }, []);

  useEffect(() => {
    if (settingTime) {
      const am_pm =
        settingTime?.daily_notification_time &&
        (settingTime?.daily_notification_time as number) > 11
          ? 'PM'
          : 'AM';
      const dailyTimeSchedule =
        settingTime?.daily_notification_time &&
        (settingTime?.daily_notification_time as number) > 11
          ? +settingTime.daily_notification_time - 12
          : settingTime.daily_notification_time;
      const summaryTimeSchedule = settingTime.summary_notification_time;
      setScheduleSettings({
        daily: {
          time:
            hourOptions.find(
              (item) => dailyTimeSchedule && item.value === +dailyTimeSchedule
            ) || scheduleSettings.daily.time,
          am_pm,
        },
        summary: {
          time:
            hourOptions.find((item) => item.value === summaryTimeSchedule) ||
            scheduleSettings.summary.time,
        },
      });
    }
  }, [settingTime]);

  const getNotificationSetting = async () => {
    const data = await getNotificationSettingApi({});
    if ('data' in data) {
      const scheduleData = data?.data?.[0].types;
      scheduleData.forEach((type: NotificationType) => {
        if (type.name === 'Summary') {
          dispatch(
            setNotificationSetting({
              summary_notification_time: type.receive_notification_time || null,
            })
          );
        }
        if (type.name === 'Daily') {
          dispatch(
            setNotificationSetting({
              daily_notification_time: type.receive_notification_time || null,
            })
          );
        }
      });
    }
  };

  const onChangeHandler = async (
    name: SettingType,
    value?: SingleValue<Option> | MultiValue<Option>,
    isUpdateAM_PM?: boolean
  ) => {
    const optionValue = value as { value: number; label: string } | undefined;
    let dailySchedulePayload;
    if (isUpdateAM_PM) {
      if (scheduleSettings.daily.am_pm === 'AM') {
        dailySchedulePayload = scheduleSettings.daily.time.value + 12;
      }
      if (scheduleSettings.daily.am_pm === 'PM') {
        dailySchedulePayload = scheduleSettings.daily.time.value;
      }
    }
    if (
      name === SettingType.DAILY &&
      scheduleSettings.daily.am_pm === 'PM' &&
      optionValue
    ) {
      dailySchedulePayload = optionValue.value + 12;
    }

    const data = await setNotificationTimeSettingAPI({
      data: {
        name,
        receive_notification_time: dailySchedulePayload || optionValue?.value,
      },
    });

    if ('data' in data) {
      setScheduleSettings({
        ...scheduleSettings,
        [name === SettingType.DAILY ? 'daily' : 'summary']: {
          ...scheduleSettings[name === SettingType.DAILY ? 'daily' : 'summary'],
          ...(optionValue?.value ? { time: optionValue } : {}),
          ...(isUpdateAM_PM && dailySchedulePayload
            ? { am_pm: dailySchedulePayload > 11 ? 'PM' : 'AM' }
            : {}),
        },
      });
    }
  };
  return (
    <>
      <SettingLayout
        title="Notification"
        breadCrumbPath={BREAD_CRUMB.settings.generalSettings.notification}
        sideBarLinks={SIDEBAR_LINKS}
      >
        <div className="flex flex-wrap w-[800px] max-w-full">
          <div className="w-[50%] pr-[40px] border-r-[1px] border-r-[#CCCCCC]/80">
            <div className="inner__wrapper">
              <h3 className="title text-[20px] font-biotif__Medium text-black mb-[6px]">
                Summary Email Timing
              </h3>
              <p className="text-[18px] font-biotif__Medium text-black/50">
                How often should a summary of notifications be sent?
              </p>
              <div className="field__wrapper mt-[14px]">
                <label className="if__label if__label__blue mb-[5px]">
                  Hour
                </label>
              </div>
              <CustomDropDown
                options={hourOptions}
                className="deal__header__ip__Select relative z-[4] w-[105px] mb-[10px] lg:w-full sm:w-full"
                selectedValue={scheduleSettings.summary.time}
                onChange={(selectedOption) =>
                  onChangeHandler(SettingType.SUMMARY, selectedOption)
                }
              />
            </div>
          </div>
          <div className="w-[50%] pl-[40px]">
            <div className="inner__wrapper">
              <h3 className="title text-[20px] font-biotif__Medium text-black mb-[6px]">
                Daily Email Timing
              </h3>
              <p className="text-[18px] font-biotif__Medium text-black/50">
                What time of day would you like the daily recap to be sent?
              </p>
              <div className="field__wrapper mt-[14px]">
                <label className="if__label if__label__blue mb-[5px]">
                  Hour
                </label>
              </div>
              <div className="flex">
                <CustomDropDown
                  options={hourOptions}
                  className="deal__header__ip__Select relative z-[4] w-[105px] mb-[10px] lg:w-full sm:w-full"
                  selectedValue={scheduleSettings.daily.time}
                  onChange={(selectedOption) =>
                    onChangeHandler(SettingType.DAILY, selectedOption)
                  }
                />
                <button
                  className="i__Button primary__Btn text-[16px] h-[44px] w-[52px] text-center ml-[12px] py-[4px] px-[7px]"
                  onClick={() =>
                    onChangeHandler(SettingType.DAILY, undefined, true)
                  }
                >
                  {scheduleSettings.daily.am_pm}
                </button>
              </div>
            </div>
          </div>
        </div>
      </SettingLayout>
    </>
  );
};
export default ScheduleEmailTiming;
