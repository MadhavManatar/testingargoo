// ** external packages ** //
import { useEffect, useState } from 'react';

// ** types ** //
import { DefaultTimeReminderResponse } from '../types/default-reminder.types';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';
import { IconTypes } from 'components/Icon';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';
import { useLazyGetActivityTypesQuery } from 'redux/api/activityTypeApi';

export const useGetAllDefaultReminder = () => {
  const [defaultRemindersData, setDefaultRemindersData] = useState<
    DefaultTimeReminderResponse[]
  >([]);

  // ** custom hooks **
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [getGeneralSetting, { isLoading: getGeneralSettingLoading }] =
    useLazyGetGeneralSettingQuery();
  const [getActivityTypesAPI, { isLoading: getActivityTypesLoading }] =
    useLazyGetActivityTypesQuery();

  useEffect(() => {
    getDefaultReminders();
  }, []);

  // ** custom hooks **

  const getDefaultReminders = async () => {
    const [{ data: reminderData, error: reminderError }, { data, error }] =
      await Promise.all([
        getGeneralSetting(
          {
            params: {
              'q[key]': 'default_activity_reminders',
              'q[model_name]': POLYMORPHIC_MODELS.USER,
              'q[model_record_id]': currentUser?.id,
              module: ModuleNames.ACTIVITY,
            },
          },
          true
        ),
        getActivityTypesAPI(
          {
            data: {
              query: {
                'q[is_system]': true,
                select: 'id,name,icon,icon_type,is_default',
              },
            },
          },
          true
        ),
      ]);

    if (data && !error && reminderData && !reminderError) {
      const formatReminderData = (data?.rows || []).map(
        (item: {
          id: number;
          name: string;
          icon: IconTypes;
          icon_type: string;
        }) => {
          return {
            id: item.id,
            notifications:
              reminderData.find((val: { related_model_id: number }) => {
                return val.related_model_id === item.id;
              })?.value || '[]',
            activity_type_id: item.id,
            user_id: currentUser?.id,
            activity_type: {
              id: item.id,
              name: item.name,
              icon: item.icon,
              icon_type: item.icon_type,
            },
          };
        }
      );

      setDefaultRemindersData(formatReminderData);
    }
  };

  return {
    getDefaultReminders,
    defaultRemindersData,
    isGetDefaultRemindersLoading:
      getGeneralSettingLoading || getActivityTypesLoading,
  };
};
