import { useEffect } from 'react';
import { BREAD_CRUMB } from 'constant/breadCrumb.constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import { useSelector } from 'react-redux';
import { useGetRestoreData } from 'pages/Setting/module-setting/hooks/useAccountSettingsService';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { getCurrentUser } from 'redux/slices/authSlice';
import { GENERAL_SETTING_VALID_KEYS } from 'constant';
import { ToastMsg } from 'constant/toast.constants';
import { isOrganizationOwner } from 'utils/is';
import FormField from 'components/FormField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { restoreDaysSchema } from './validation-schema/restoreDays.schema';
import { useAddUpdateGeneralSettingMutation } from 'redux/api/generalSettingApi';
import { checkInputIsNumber } from 'utils/util';

const restoreData = () => {
  // ** hooks **
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [changeGeneralSetting] = useAddUpdateGeneralSettingMutation();

  const { getRestoreData } = useGetRestoreData();

  const formMethods = useForm<{ days: number }>({
    resolver: yupResolver(restoreDaysSchema),
  });

  const {
    register,
    control,
    getValues,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = formMethods;
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const data = await getRestoreData({
      generalSettingKey: GENERAL_SETTING_VALID_KEYS.restore_data_time,
      generalSettingModel: POLYMORPHIC_MODELS.ORGANIZATION,
      modelRecordId: currentUser?.organization?.organization_id,
    });
    if (data) {
      setValue('days', data?.data?.[0]?.value);
    }
  };

  const onChangeHandler = handleSubmit(async () => {
    const daysValue = getValues('days');
    if (isOrganizationOwner(currentUser?.id)) {
      await changeGeneralSetting({
        data: {
          dataList: [
            {
              model_name: POLYMORPHIC_MODELS.ORGANIZATION,
              key: GENERAL_SETTING_VALID_KEYS.restore_data_time,
              value: daysValue?.toString(),
              model_record_id: currentUser?.organization?.organization_id,
            },
          ],
          module: ModuleNames.ACCOUNT,
          toastMsg:
            ToastMsg.settings.generalSettings.commonControls.restoreSetting
              .updateMsg,
        },
      });
      setValue('days', daysValue);
    } else {
      setError('days', {
        type: 'custom',
        message: 'you are not authorize for this ',
      });
    }
  });
  return (
    <>
      <SettingLayout
        title="Notification"
        breadCrumbPath={
          BREAD_CRUMB.settings.generalSettings.commonControls.restoreTime
        }
        sideBarLinks={SETTING_SIDEBAR.commonControls}
      >
        <div className="flex flex-wrap w-[800px] max-w-full">
          <div className="w-[50%] pr-[40px] border-r-[1px] border-r-[#CCCCCC]/80">
            <div className="inner__wrapper">
              <h3 className="title text-[20px] font-biotif__Medium text-black mb-[6px]">
                Restore Trash
              </h3>
              <p className="text-[18px] font-biotif__Medium text-black/50">
                Please choose the amount of days "Trash" keeps the data before
                it is deleted permanently from smackDab.
              </p>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="sm:w-full">
                  <FormField
                    required
                    type="text"
                    name="days"
                    label="Days"
                    labelClass="if__label__blue"
                    placeholder="Enter Days"
                    error={errors?.days}
                    control={control}
                    register={register}
                    onKeyDown={checkInputIsNumber}
                    fieldLimit={3}
                  />
                  <p className="text-[15px] font-biotif__Medium text-black/50">
                    Add Days between 7 to 180
                  </p>
                  <button
                    onClick={() => onChangeHandler()}
                    className="ip__Counter__Preview__Drop mt-[8px] stayIntouch__Btn mr-[10px] bg-[#E6E6E6] py-[4px] px-[17px] text-black text-[14px] font-biotif__Medium rounded-[6px] h-[32px]  mb-[10px] duration-500 hover:bg-primaryColor hover:text-white relative before:content-[''] before:w-[8px] before:h-[8px] before:border-[2px] before:border-white before:absolute before:top-[10px] before:right-[12px] before:rotate-45 before:!border-t-0 before:!border-l-0 after:content-[''] after:absolute after:top-[8px] after:right-[28px] after:w-[2px] after:h-[14px] after:bg-white/50 before:hidden after:hidden sm:mb-0 sm:mr-0"
                  >
                    save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </SettingLayout>
    </>
  );
};
export default restoreData;
