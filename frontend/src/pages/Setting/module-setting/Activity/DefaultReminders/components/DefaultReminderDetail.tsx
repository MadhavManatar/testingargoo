// ** Import packages ** //
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

// ** Components ** //
import SettingLayout from 'pages/Setting/components/SettingLayout';
import DefaultReminderForm from './DefaultReminderForm';
import { BREAD_CRUMB } from 'constant';

// ** Types ** //
import { DefaultReminderFieldType } from '../types/default-reminder.types';

// ** Others ** //
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import { convertNumberOrNull } from 'utils/util';
import { defaultReminderSchema } from '../validation-schema/defaultReminder.schema';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';
import { getCurrentUser } from 'redux/slices/authSlice';
import {
  useAddUpdateGeneralSettingMutation,
  useLazyGetGeneralSettingQuery,
} from 'redux/api/generalSettingApi';

const DefaultReminderDetail = () => {
  // ** hooks ** //
  const { id } = useParams();
  const defaultReminderId = convertNumberOrNull(id);
  const navigate = useNavigate();

  // ** custom-hooks **//
  const {
    register,
    formState: { errors },
    control,
    reset,
    handleSubmit,
  } = useForm<DefaultReminderFieldType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(defaultReminderSchema),
  });

  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [getGeneralSetting, { isLoading: getGeneralSettingLoading }] =
    useLazyGetGeneralSettingQuery();
  const [changeGeneralSetting, { isLoading: changeGeneralSettingLoading }] =
    useAddUpdateGeneralSettingMutation();

  const getDefaultReminderDetail = async (valId: number) => {
    const { data, error } = await getGeneralSetting(
      {
        params: {
          'q[key]': 'default_activity_reminders',
          'q[model_name]': POLYMORPHIC_MODELS.USER,
          'q[model_record_id]': currentUser?.id,
          'q[related_model_id]': valId,
          module: ModuleNames.ACTIVITY,
        },
      },
      true
    );

    if (!error && data[0]?.value) {
      const notifications = JSON.parse(data[0]?.value || '');
      reset({
        duration: notifications[0]?.duration,
        durationType: notifications[0]?.durationType,
        notificationType: notifications[0]?.notificationType,
      });
    }
  };

  useEffect(() => {
    if (defaultReminderId) {
      getDefaultReminderDetail(defaultReminderId);
    }
  }, [defaultReminderId]);

  const onSubmit = handleSubmit(async (value) => {
    const { duration, durationType, notificationType } = value;
    if (defaultReminderId) {
      const reqData = {
        dataList: [
          {
            value: JSON.stringify(
              duration && durationType && notificationType
                ? [{ duration, durationType, notificationType }]
                : []
            ),
            key: 'default_activity_reminders',
            model_name: POLYMORPHIC_MODELS.USER,
            model_record_id: currentUser?.id,
            related_model_id: defaultReminderId,
            related_model_name: 'activity_types',
          },
        ],
        module: ModuleNames.ACTIVITY,
        toastMsg:
          ToastMsg.settings.moduleSettings.activity.availability.updateMsg,
      };
      const data = await changeGeneralSetting({ data: reqData });

      if (data) {
        navigate(
          PRIVATE_NAVIGATION.settings.moduleSetting.activity.defaultReminders
            .view
        );
      }
    }
  });
  return (
    <>
      <SettingLayout
        title="Activity Settings"
        breadCrumbPath={
          BREAD_CRUMB.settings.moduleSetting.activity.defaultReminders
        }
        sideBarLinks={SETTING_SIDEBAR.activitySetting}
      >
        {getGeneralSettingLoading ? (
          <div className="w-[550px] max-w-full">
            <div className="skeletonBox w-[250px] max-w-full mb-[20px]" />
            <div className="skeletonBox w-full max-w-full mb-[10px]" />
            <div className="skeletonBox w-[80%] max-w-full" />
            <div className="flex flex-wrap mb-[20px] mt-[20px]">
              <div className="skeletonBox h-[44px] rounded-[8px] w-[calc(40%_-_15px)] mr-[15px]" />
              <div className="skeletonBox h-[44px] rounded-[8px] w-[calc(20%_-_15px)] mr-[15px]" />
              <div className="skeletonBox h-[44px] rounded-[8px] w-[40%]" />
            </div>
            <div className="skeletonBox h-[44px] w-[100px] rounded-[8px]" />
          </div>
        ) : (
          <div className="">
            <form onSubmit={onSubmit}>
              <DefaultReminderForm
                control={control}
                errors={errors}
                register={register}
                submitLoading={changeGeneralSettingLoading}
              />
            </form>
          </div>
        )}
      </SettingLayout>
    </>
  );
};

export default DefaultReminderDetail;
