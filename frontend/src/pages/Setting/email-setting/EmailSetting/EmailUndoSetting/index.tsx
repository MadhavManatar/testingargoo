// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

// ** Components **
import FormField from 'components/FormField';
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** custom hooks **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** types **
import { EmailUndoTimeFieldType } from './types/email-undo.types';

// ** constants **
import { POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { EMAIL_DELAY_UNDO_TIME, BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** schema **
import { emailUndoTimeSchema } from './validation-schema/email-undo.schema';

// ** others **
import EmailUndoTimeSkeleton from './skeletons/EmailUndoTimeSkeleton';
import {
  useAddUpdateGeneralSettingMutation,
  useLazyGetGeneralSettingQuery,
} from 'redux/api/generalSettingApi';

const EmailUndoSetting = () => {
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [getGeneralSetting, { isLoading: getGeneralSettingLoading }] =
    useLazyGetGeneralSettingQuery();
  const [changeGeneralSetting, { isLoading: changeGeneralSettingLoading }] =
    useAddUpdateGeneralSettingMutation();

  //  ** hooks **
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm<EmailUndoTimeFieldType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(emailUndoTimeSchema),
  });

  useEffect(() => {
    getEmailUndoDelayTime();
  }, []);

  const getEmailUndoDelayTime = async () => {
    const { data, error } = await getGeneralSetting(
      {
        params: {
          'q[key]': 'mail_undo_send',
          'q[model_name]': POLYMORPHIC_MODELS.USER,
          'q[model_record_id]': currentUser?.id,
          module: 'user_settings',
        },
      },
      true
    );

    if (data && !error) {
      reset({
        delay_time: Number(data[0]?.value) || 10,
      });
    }
  };

  const onSubmit = handleSubmit(async (formValue) => {
    const { delay_time } = formValue;
    const reqData = {
      dataList: [
        {
          key: 'mail_undo_send',
          value: `${delay_time}`,
          model_name: POLYMORPHIC_MODELS.USER,
          model_record_id: currentUser?.id,
        },
      ],
      module: 'user_settings',
      toastMsg: ToastMsg.settings.emailSettings.email_undo.updateMsg,
    };
    await changeGeneralSetting({ data: reqData });
  });

  return (
    <SettingLayout
      title="Email Undo Setting"
      breadCrumbPath={BREAD_CRUMB.emailUndoSetting}
      sideBarLinks={SETTING_SIDEBAR.emailSetting}
    >
      {changeGeneralSettingLoading || getGeneralSettingLoading ? (
        <EmailUndoTimeSkeleton />
      ) : (
        <>
          <h3 className="hidden text-[18px] leading-[24px] font-biotif__Medium text-black whitespace-pre overflow-hidden text-ellipsis sm:block sm:mt-[-5px] sm:mb-[20px]">
            Email Undo Setting
          </h3>
          <div className="setting__FixedWrapper__emailUndo ip__hideScrollbar overflow-y-auto h-[calc(100dvh_-_370px)] 3xl:h-[calc(100dvh_-_344px)] xl:h-[calc(100dvh_-_275px)] sm:h-[calc(100dvh_-_210px)]">
            <div className="setting__activity__emailUndo__body ip__hideScrollbar sm:h-[calc(100dvh_-_210px)] sm:overflow-y-auto">
              <form onSubmit={onSubmit}>
                <div>
                  <div className="setting__activity__emailUndo__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[14px] mb-[12px] last:mb-0 sm:p-[15px]">
                    <div className="column activity__type__column w-1/2 pl-[20px] pr-[11px] lg:w-[calc(100%_-_200px)] sm:w-full sm:px-0 sm:mb-[12px]">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <span className="w-full text font-biotif__Medium text-ipBlack__textColor text-[16px] leading-[22px]">
                          Delay Time
                        </span>
                      </div>
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[200px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap">
                        <FormField
                          wrapperClass="w-[110px] mb-0 mr-[10px] sm:w-[80px] sm:mr-[6px] xsm:w-[120px] xsm:mr-0"
                          id="delay_time"
                          placeholder="Delay Time"
                          type="select"
                          name="delay_time"
                          control={control}
                          error={errors?.delay_time}
                          options={EMAIL_DELAY_UNDO_TIME}
                          menuPlacement="bottom"
                          register={register}
                        />
                        <span className="w-[calc(100%_-_120px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[11px] sm:w-[calc(100%_-_86px)] sm:text-[14px] sm:pt-[7px] xsm:w-[calc(100%_-_120px)] xsm:pt-[8px] xsm:pl-[8px]">
                          Second
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="settingAction__fixedBtn__emailUndo flex items-center">
                  <button
                    type="submit"
                    className="i__Button save__btn primary__Btn min-w-[120px] sm:min-w-full sm:ml-0"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </SettingLayout>
  );
};

export default EmailUndoSetting;
