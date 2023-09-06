// ** import packages ** //
import React from 'react';
import { useNavigate } from 'react-router-dom';

// ** Components ** //
import Icon from 'components/Icon';
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** hooks-services ** //
import { useGetAllDefaultReminder } from './Hooks/useDefaultReminderServices';

// ** others ** //
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';

// ** Util **
import { setUrlParams } from 'utils/util';

const DefaultReminder = () => {
  // ** hooks ** //
  const navigate = useNavigate();

  // ** custom-hooks ** //
  const { defaultRemindersData, isGetDefaultRemindersLoading } =
    useGetAllDefaultReminder();

  return (
    <SettingLayout
      title="Activity Settings"
      breadCrumbPath={
        BREAD_CRUMB.settings.moduleSetting.activity.defaultReminders
      }
      sideBarLinks={SETTING_SIDEBAR.activitySetting}
    >
      {isGetDefaultRemindersLoading ? (
        <div>
          <div className="setting__activity__availability__body setting__NotificationTime__body ip__hideScrollbar xl:h-[calc(100dvh_-_210px)] lg:h-[calc(100dvh_-_215px)] md:h-[calc(100dvh_-_203px)] sm:h-[calc(100dvh_-_115px)] sm:overflow-y-auto">
            <div className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] cursor-pointer last:mb-0 sm:p-[15px]">
              <div className="column activity__type__column w-[calc(100%_-_145px)] pl-[11px] pr-[11px] sm:w-full sm:px-0">
                <div className="flex flex-wrap items-center inner__wrapper">
                  <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] max-w-full" />
                  <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px]">
                    <div className="skeletonBox w-[150px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="column action__column pl-[11px] pr-[11px] w-[145px] text-right sm:w-full sm:px-0 sm:text-left">
                <div className="skeletonBox w-full" />
              </div>
            </div>
            <div className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] cursor-pointer last:mb-0 sm:p-[15px]">
              <div className="column activity__type__column w-[calc(100%_-_145px)] pl-[11px] pr-[11px] sm:w-full sm:px-0">
                <div className="flex flex-wrap items-center inner__wrapper">
                  <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] max-w-full" />
                  <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px]">
                    <div className="skeletonBox w-[150px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="column action__column pl-[11px] pr-[11px] w-[145px] text-right sm:w-full sm:px-0 sm:text-left">
                <div className="skeletonBox w-full" />
              </div>
            </div>
            <div className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] cursor-pointer last:mb-0 sm:p-[15px]">
              <div className="column activity__type__column w-[calc(100%_-_145px)] pl-[11px] pr-[11px] sm:w-full sm:px-0">
                <div className="flex flex-wrap items-center inner__wrapper">
                  <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] max-w-full" />
                  <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px]">
                    <div className="skeletonBox w-[150px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="column action__column pl-[11px] pr-[11px] w-[145px] text-right sm:w-full sm:px-0 sm:text-left">
                <div className="skeletonBox w-full" />
              </div>
            </div>
            <div className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] cursor-pointer last:mb-0 sm:p-[15px]">
              <div className="column activity__type__column w-[calc(100%_-_145px)] pl-[11px] pr-[11px] sm:w-full sm:px-0">
                <div className="flex flex-wrap items-center inner__wrapper">
                  <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] max-w-full" />
                  <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px]">
                    <div className="skeletonBox w-[150px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="column action__column pl-[11px] pr-[11px] w-[145px] text-right sm:w-full sm:px-0 sm:text-left">
                <div className="skeletonBox w-full" />
              </div>
            </div>
            <div className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] cursor-pointer last:mb-0 sm:p-[15px]">
              <div className="column activity__type__column w-[calc(100%_-_145px)] pl-[11px] pr-[11px] sm:w-full sm:px-0">
                <div className="flex flex-wrap items-center inner__wrapper">
                  <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] max-w-full" />
                  <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px]">
                    <div className="skeletonBox w-[150px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="column action__column pl-[11px] pr-[11px] w-[145px] text-right sm:w-full sm:px-0 sm:text-left">
                <div className="skeletonBox w-full" />
              </div>
            </div>
            <div className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] cursor-pointer last:mb-0 sm:p-[15px]">
              <div className="column activity__type__column w-[calc(100%_-_145px)] pl-[11px] pr-[11px] sm:w-full sm:px-0">
                <div className="flex flex-wrap items-center inner__wrapper">
                  <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] max-w-full" />
                  <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px]">
                    <div className="skeletonBox w-[150px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="column action__column pl-[11px] pr-[11px] w-[145px] text-right sm:w-full sm:px-0 sm:text-left">
                <div className="skeletonBox w-full" />
              </div>
            </div>
            <div className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] cursor-pointer last:mb-0 sm:p-[15px]">
              <div className="column activity__type__column w-[calc(100%_-_145px)] pl-[11px] pr-[11px] sm:w-full sm:px-0">
                <div className="flex flex-wrap items-center inner__wrapper">
                  <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] max-w-full" />
                  <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px]">
                    <div className="skeletonBox w-[150px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="column action__column pl-[11px] pr-[11px] w-[145px] text-right sm:w-full sm:px-0 sm:text-left">
                <div className="skeletonBox w-full" />
              </div>
            </div>
            <div className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] cursor-pointer last:mb-0 sm:p-[15px]">
              <div className="column activity__type__column w-[calc(100%_-_145px)] pl-[11px] pr-[11px] sm:w-full sm:px-0">
                <div className="flex flex-wrap items-center inner__wrapper">
                  <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] max-w-full" />
                  <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px]">
                    <div className="skeletonBox w-[150px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="column action__column pl-[11px] pr-[11px] w-[145px] text-right sm:w-full sm:px-0 sm:text-left">
                <div className="skeletonBox w-full" />
              </div>
            </div>
            <div className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] cursor-pointer last:mb-0 sm:p-[15px]">
              <div className="column activity__type__column w-[calc(100%_-_145px)] pl-[11px] pr-[11px] sm:w-full sm:px-0">
                <div className="flex flex-wrap items-center inner__wrapper">
                  <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] max-w-full" />
                  <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px]">
                    <div className="skeletonBox w-[150px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="column action__column pl-[11px] pr-[11px] w-[145px] text-right sm:w-full sm:px-0 sm:text-left">
                <div className="skeletonBox w-full" />
              </div>
            </div>
            <div className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] cursor-pointer last:mb-0 sm:p-[15px]">
              <div className="column activity__type__column w-[calc(100%_-_145px)] pl-[11px] pr-[11px] sm:w-full sm:px-0">
                <div className="flex flex-wrap items-center inner__wrapper">
                  <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] max-w-full" />
                  <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px]">
                    <div className="skeletonBox w-[150px] max-w-full" />
                  </div>
                </div>
              </div>
              <div className="column action__column pl-[11px] pr-[11px] w-[145px] text-right sm:w-full sm:px-0 sm:text-left">
                <div className="skeletonBox w-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h3 className="hidden text-[18px] leading-[24px] font-biotif__Medium text-black whitespace-pre overflow-hidden text-ellipsis sm:block sm:mt-[-5px] sm:mb-[20px]">
            Notification Time
          </h3>
          <div className="setting__activity__availability__body setting__NotificationTime__body ip__hideScrollbar xl:h-[calc(100dvh_-_210px)] lg:h-[calc(100dvh_-_215px)] md:h-[calc(100dvh_-_203px)] sm:h-[calc(100dvh_-_152px)] sm:overflow-y-auto">
            {React.Children.toArray(
              defaultRemindersData.map((reminder) => {
                return (
                  <div className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] cursor-pointer last:mb-0 sm:p-[15px]">
                    <div className="column activity__type__column w-[calc(100%_-_145px)] pl-[11px] pr-[11px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <Icon
                          className="highlighted mr-[10px] p-[8px]"
                          iconType={reminder.activity_type.icon}
                        />
                        <span className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px]">
                          {reminder.activity_type.name}
                        </span>
                      </div>
                    </div>
                    <div className="column action__column pl-[11px] pr-[11px] w-[145px] text-right sm:w-full sm:px-0 sm:text-left">
                      <button
                        className="text-primaryColor text-[14px] font-biotif__Medium underline duration-500 hover:text-primaryColor__hoverDark sm:text-[12px]"
                        onClick={() => {
                          navigate(
                            setUrlParams(
                              PRIVATE_NAVIGATION.settings.moduleSetting.activity
                                .defaultReminders.update,
                              reminder?.activity_type_id
                            )
                          );
                        }}
                      >
                        Edit Default alert
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </SettingLayout>
  );
};

export default DefaultReminder;
