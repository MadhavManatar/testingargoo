// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

// ** Components **
import FormField from 'components/FormField';
import Icon, { IconTypes } from 'components/Icon';
import Image from 'components/Image';
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Hooks **
import useAuth from 'hooks/useAuth';

// ** types **
import { ActivityTimeSetFieldType } from './types/activity-timeSet.types';

// ** constants **
import {
  BasicPermissionTypes,
  ModuleNames,
  POLYMORPHIC_MODELS,
} from 'constant/permissions.constant';

// ** schema **
import { activityTimeSetSchema } from './validation-schema/activity-timeSet.schema';

// ** others **
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import { ToastMsg } from 'constant/toast.constants';
import {
  useAddUpdateGeneralSettingMutation,
  useLazyGetGeneralSettingQuery,
} from 'redux/api/generalSettingApi';
import { useLazyGetActivityTypesQuery } from 'redux/api/activityTypeApi';

const TimeSet = () => {
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [getGeneralSetting, { isLoading: getGeneralSettingLoading }] =
    useLazyGetGeneralSettingQuery();
  const [changeGeneralSetting, { isLoading: changeGeneralSettingLoading }] =
    useAddUpdateGeneralSettingMutation();
  const [getActivityTypesAPI, { isLoading: getActivityTypesLoading }] =
    useLazyGetActivityTypesQuery();

  //  ** hooks **
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm<ActivityTimeSetFieldType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(activityTimeSetSchema),
  });

  const { fields } = useFieldArray({
    name: 'stages',
    control,
  });

  useEffect(() => {
    getActivityTypes();
  }, []);

  // ** custom hooks **
  const { hasAuthorized } = useAuth();

  const editPermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.UPDATE },
  ]);

  const readPermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.READ },
  ]);

  const getActivityTypes = async () => {
    if (!readPermission) return null;
    const [{ data: intervalData, error: intervalError }, { data, error }] =
      await Promise.all([
        getGeneralSetting(
          {
            params: {
              'q[or][0][key]': 'default_activity_time_interval',
              'q[or][1][key]': 'default_activity_default_anytime',
              'q[model_name]': POLYMORPHIC_MODELS.USER,
              'q[model_record_id]': currentUser?.id,
              module: ModuleNames.ACTIVITY,
              limit: 100,
            },
          },
          true
        ),
        getActivityTypesAPI({}, true),
      ]);

    if (data && !error && !intervalError && intervalData) {
      const timeIntervalData: {
        key: string;
        related_model_id: number;
        value: string;
      }[] = intervalData || [];
      const { rows } = data;

      const activityTypesData = rows.map(
        (item: {
          id: number;
          icon: string;
          icon_type: string;
          name: string;
        }) => {
          return {
            activity_interval:
              timeIntervalData.find(
                (obj) =>
                  obj.related_model_id === item.id &&
                  obj.key === 'default_activity_time_interval'
              )?.value || 30,
            default_anytime: timeIntervalData.find(
              (obj) =>
                obj.related_model_id === item.id &&
                obj.key === 'default_activity_default_anytime' &&
                obj.value === '1'
            )
              ? true || false
              : false,
            id: item.id,
            icon: item.icon,
            icon_type: item.icon_type,
            activity_type: item.name,
          };
        }
      );

      reset({
        stages: activityTypesData,
      });
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    if (!editPermission) return null;

    // activity_interval Update field In database
    const data_list_activity_interval = value.stages.map(
      ({ id, activity_interval }) => {
        return {
          key: 'default_activity_time_interval',
          value: `${activity_interval}`,
          model_name: POLYMORPHIC_MODELS.USER,
          model_record_id: currentUser?.id,
          related_model_id: id,
          related_model_name: 'activity_types',
        };
      }
    );

    // default_anytime Update field In database
    const data_list_default_anytime = value.stages.map(
      ({ id, default_anytime }) => {
        const anytime_enable = default_anytime ? '1' : '0';
        return {
          key: 'default_activity_default_anytime',
          value: anytime_enable,
          model_name: POLYMORPHIC_MODELS.USER,
          model_record_id: currentUser?.id,
          related_model_id: id,
          related_model_name: 'activity_types',
        };
      }
    );

    const reqData_activity_interval = {
      dataList: [...data_list_activity_interval, ...data_list_default_anytime],
      module: ModuleNames.ACTIVITY,
      toastMsg: ToastMsg.settings.moduleSettings.activity.timeSet.updateMsg,
    };
    await changeGeneralSetting({
      data: reqData_activity_interval,
    });
  });

  return (
    <SettingLayout
      title="Activity Settings"
      breadCrumbPath={
        BREAD_CRUMB.settings.moduleSetting.activity.defaultTimeSet
      }
      sideBarLinks={SETTING_SIDEBAR.activitySetting}
    >
      {getActivityTypesLoading ||
      changeGeneralSettingLoading ||
      getGeneralSettingLoading ? (
        <div>
          <div className="setting__FixedWrapper__acTimeSet ip__hideScrollbar overflow-y-auto h-[calc(100dvh_-_370px)] 3xl:h-[calc(100dvh_-_344px)] xl:h-[calc(100dvh_-_255px)] sm:h-[calc(100dvh_-_170px)]">
            <div className="setting__activity__tim__head">
              <div className="setting__activity__tim__row flex flex-wrap pb-[20px] 3xl:pb-[10px] xl:mt-[5px]">
                <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] text-[16px] font-biotif__Medium text-ipBlack__textColor lg:w-[calc(100%_-_195px)] sm:w-[calc(100%_-_162px)] xsm:text-[14px] xsm:w-[calc(100%_-_110px)]">
                  <div className="skeletonBox w-[130px] max-w-full" />
                </div>
                <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] text-[16px] font-biotif__Medium text-ipBlack__textColor lg:w-[195px] sm:w-[162px] xsm:text-[14px] xsm:w-[110px]">
                  <div className="skeletonBox w-[130px] max-w-full" />
                </div>
              </div>
            </div>
            <div className="setting__activity__tim__body ip__hideScrollbar sm:h-[calc(100dvh_-_170px)] sm:overflow-y-auto">
              <form>
                <div>
                  <div className="setting__activity__tim__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:py-[15px] sm:px-[15px] sm:mb-[15px]">
                    <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] lg:w-[calc(100%_-_195px)] sm:w-full sm:px-0">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] sm:w-[34px] sm:h-[34px]" />
                        <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px] sm:w-[calc(100%_-_44px)]">
                          <div className="skeletonBox w-[200px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap">
                        <div className="skeletonBox w-[100px] h-[40px] rounded-[6px] mr-[10px] sm:w-[70px] sm:mr-[10px]" />
                        <div className="w-[calc(100%_-_110px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[13px] sm:w-[calc(100%_-_80px)] sm:text-[14px] sm:pt-[14px]">
                          <div className="skeletonBox w-[100px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting__activity__tim__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:py-[15px] sm:px-[15px] sm:mb-[15px]">
                    <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] lg:w-[calc(100%_-_195px)] sm:w-full sm:px-0">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] sm:w-[34px] sm:h-[34px]" />
                        <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px] sm:w-[calc(100%_-_44px)]">
                          <div className="skeletonBox w-[200px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap">
                        <div className="skeletonBox w-[100px] h-[40px] rounded-[6px] mr-[10px] sm:w-[70px] sm:mr-[10px]" />
                        <div className="w-[calc(100%_-_110px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[13px] sm:w-[calc(100%_-_80px)] sm:text-[14px] sm:pt-[14px]">
                          <div className="skeletonBox w-[100px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting__activity__tim__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:py-[15px] sm:px-[15px] sm:mb-[15px]">
                    <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] lg:w-[calc(100%_-_195px)] sm:w-full sm:px-0">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] sm:w-[34px] sm:h-[34px]" />
                        <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px] sm:w-[calc(100%_-_44px)]">
                          <div className="skeletonBox w-[200px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap">
                        <div className="skeletonBox w-[100px] h-[40px] rounded-[6px] mr-[10px] sm:w-[70px] sm:mr-[10px]" />
                        <div className="w-[calc(100%_-_110px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[13px] sm:w-[calc(100%_-_80px)] sm:text-[14px] sm:pt-[14px]">
                          <div className="skeletonBox w-[100px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting__activity__tim__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:py-[15px] sm:px-[15px] sm:mb-[15px]">
                    <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] lg:w-[calc(100%_-_195px)] sm:w-full sm:px-0">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] sm:w-[34px] sm:h-[34px]" />
                        <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px] sm:w-[calc(100%_-_44px)]">
                          <div className="skeletonBox w-[200px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap">
                        <div className="skeletonBox w-[100px] h-[40px] rounded-[6px] mr-[10px] sm:w-[70px] sm:mr-[10px]" />
                        <div className="w-[calc(100%_-_110px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[13px] sm:w-[calc(100%_-_80px)] sm:text-[14px] sm:pt-[14px]">
                          <div className="skeletonBox w-[100px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting__activity__tim__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:py-[15px] sm:px-[15px] sm:mb-[15px]">
                    <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] lg:w-[calc(100%_-_195px)] sm:w-full sm:px-0">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] sm:w-[34px] sm:h-[34px]" />
                        <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px] sm:w-[calc(100%_-_44px)]">
                          <div className="skeletonBox w-[200px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap">
                        <div className="skeletonBox w-[100px] h-[40px] rounded-[6px] mr-[10px] sm:w-[70px] sm:mr-[10px]" />
                        <div className="w-[calc(100%_-_110px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[13px] sm:w-[calc(100%_-_80px)] sm:text-[14px] sm:pt-[14px]">
                          <div className="skeletonBox w-[100px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting__activity__tim__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:py-[15px] sm:px-[15px] sm:mb-[15px]">
                    <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] lg:w-[calc(100%_-_195px)] sm:w-full sm:px-0">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] sm:w-[34px] sm:h-[34px]" />
                        <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px] sm:w-[calc(100%_-_44px)]">
                          <div className="skeletonBox w-[200px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap">
                        <div className="skeletonBox w-[100px] h-[40px] rounded-[6px] mr-[10px] sm:w-[70px] sm:mr-[10px]" />
                        <div className="w-[calc(100%_-_110px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[13px] sm:w-[calc(100%_-_80px)] sm:text-[14px] sm:pt-[14px]">
                          <div className="skeletonBox w-[100px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting__activity__tim__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:py-[15px] sm:px-[15px] sm:mb-[15px]">
                    <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] lg:w-[calc(100%_-_195px)] sm:w-full sm:px-0">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] sm:w-[34px] sm:h-[34px]" />
                        <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px] sm:w-[calc(100%_-_44px)]">
                          <div className="skeletonBox w-[200px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap">
                        <div className="skeletonBox w-[100px] h-[40px] rounded-[6px] mr-[10px] sm:w-[70px] sm:mr-[10px]" />
                        <div className="w-[calc(100%_-_110px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[13px] sm:w-[calc(100%_-_80px)] sm:text-[14px] sm:pt-[14px]">
                          <div className="skeletonBox w-[100px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting__activity__tim__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:py-[15px] sm:px-[15px] sm:mb-[15px]">
                    <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] lg:w-[calc(100%_-_195px)] sm:w-full sm:px-0">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] sm:w-[34px] sm:h-[34px]" />
                        <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px] sm:w-[calc(100%_-_44px)]">
                          <div className="skeletonBox w-[200px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap">
                        <div className="skeletonBox w-[100px] h-[40px] rounded-[6px] mr-[10px] sm:w-[70px] sm:mr-[10px]" />
                        <div className="w-[calc(100%_-_110px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[13px] sm:w-[calc(100%_-_80px)] sm:text-[14px] sm:pt-[14px]">
                          <div className="skeletonBox w-[100px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting__activity__tim__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:py-[15px] sm:px-[15px] sm:mb-[15px]">
                    <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] lg:w-[calc(100%_-_195px)] sm:w-full sm:px-0">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] sm:w-[34px] sm:h-[34px]" />
                        <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px] sm:w-[calc(100%_-_44px)]">
                          <div className="skeletonBox w-[200px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap">
                        <div className="skeletonBox w-[100px] h-[40px] rounded-[6px] mr-[10px] sm:w-[70px] sm:mr-[10px]" />
                        <div className="w-[calc(100%_-_110px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[13px] sm:w-[calc(100%_-_80px)] sm:text-[14px] sm:pt-[14px]">
                          <div className="skeletonBox w-[100px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="setting__activity__tim__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:py-[15px] sm:px-[15px] sm:mb-[15px]">
                    <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] lg:w-[calc(100%_-_195px)] sm:w-full sm:px-0">
                      <div className="flex flex-wrap items-center inner__wrapper">
                        <div className="skeletonBox w-[46px] h-[46px] rounded-[6px] mr-[10px] sm:w-[34px] sm:h-[34px]" />
                        <div className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px] sm:w-[calc(100%_-_44px)]">
                          <div className="skeletonBox w-[200px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0">
                      <div className="flex flex-wrap">
                        <div className="skeletonBox w-[100px] h-[40px] rounded-[6px] mr-[10px] sm:w-[70px] sm:mr-[10px]" />
                        <div className="w-[calc(100%_-_110px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[13px] sm:w-[calc(100%_-_80px)] sm:text-[14px] sm:pt-[14px]">
                          <div className="skeletonBox w-[100px] max-w-full sm:w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="settingAction__fixedBtn__acTimeSet flex items-center">
            <div className="skeletonBox rounded-[6px] h-[36px] w-[140px] max-w-full sm:w-full" />
          </div>
        </div>
      ) : (
        <>
          {!fields.length ? (
            <div className="rounded-[12px] min-h-[200px] flex flex-wrap items-center justify-center py-[20px] px-[20px] bg-ipGray__transparentBG sm:bg-ip__white__text__color">
              <div className="inner__wrapper">
                <div className="flex flex-wrap items-center justify-center w-full mb-[12px]">
                  <img
                    className="inline-block w-[70px]"
                    src="/images/no__activity__default__time__set.png"
                    alt=""
                  />
                </div>
                <p className="text-[20px] text-ipBlack__textColor font-biotif__Medium">
                  No default time set available
                </p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="hidden text-[18px] leading-[24px] font-biotif__Medium text-black whitespace-pre overflow-hidden text-ellipsis sm:block sm:mt-[-5px] sm:mb-[20px]">
                Default Time Set
              </h3>
              <div className="setting__FixedWrapper__acTimeSet ip__hideScrollbar overflow-y-auto h-[calc(100dvh_-_370px)] 3xl:h-[calc(100dvh_-_344px)] xl:h-[calc(100dvh_-_275px)] sm:h-[calc(100dvh_-_210px)]">
                <div className="setting__activity__tim__head">
                  <div className="setting__activity__tim__row flex flex-wrap pb-[20px] 3xl:pb-[10px] xl:mt-[5px]">
                    <div className="column activity__type__column w-1/3 pl-[11px] pr-[11px] text-[16px] font-biotif__Medium text-ipBlack__textColor lg:w-[calc(100%_-_195px)] sm:w-[calc(100%_-_162px)] xsm:text-[14px] xsm:w-[calc(100%_-_110px)]">
                      Activity Type
                    </div>
                    <div className="column interval__time__column w-1/3 pl-[11px] pr-[11px] text-[16px] font-biotif__Medium text-ipBlack__textColor lg:w-[195px] sm:w-[162px] xsm:text-[14px] xsm:w-[110px]">
                      Default Duration
                    </div>
                    <div className="column interval__time__column w-1/3 pl-[11px] pr-[11px] text-[16px] font-biotif__Medium text-ipBlack__textColor lg:w-[195px] sm:w-[162px] xsm:text-[14px] xsm:w-[110px]">
                      Default Start Time
                    </div>
                  </div>
                </div>
                <div className="setting__activity__tim__body ip__hideScrollbar sm:h-[calc(100dvh_-_210px)] sm:overflow-y-auto">
                  <form onSubmit={onSubmit}>
                    <div>
                      {fields.map((field, index: number) => {
                        const { icon_type, icon, activity_type, id } = field;
                        return (
                          <div
                            key={id}
                            className="setting__activity__tim__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:py-[15px] sm:px-[15px] sm:mb-[15px]"
                          >
                            <div
                              data-title="Activity Type"
                              className="column activity__type__column w-1/3 pl-[11px] pr-[11px] lg:w-[calc(100%_-_195px)] sm:w-full sm:px-0"
                            >
                              <div className="flex flex-wrap items-center inner__wrapper">
                                {icon_type === 'Default' ? (
                                  <Icon
                                    className="highlighted mr-[10px] p-[8px]"
                                    iconType={icon as IconTypes}
                                  />
                                ) : (
                                  <Image
                                    imgClassName="w-[46px] h-[46px] rounded-[12px] mr-[10px] sm:w-[32px] sm:h-[32px] sm:rounded-[8px]"
                                    imgPath={icon || ''}
                                    serverPath
                                  />
                                )}
                                <span className="w-[calc(100%_-_56px)] leading-[20px] text font-biotif__Medium text-ipBlack__textColor text-[16px] sm:w-[calc(100%_-_44px)]">
                                  {activity_type}
                                </span>
                              </div>
                            </div>
                            <div
                              data-title="Default Duration"
                              className="column interval__time__column w-1/3 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0"
                            >
                              <div className="flex flex-wrap">
                                <FormField
                                  type="text"
                                  name={`stages.${index}.activity_interval`}
                                  wrapperClass="w-[100px] mb-0 mr-[10px] sm:w-[70px] sm:mr-[6px]"
                                  placeholder="000"
                                  fieldLimit={3}
                                  register={register}
                                  error={
                                    errors?.stages?.length
                                      ? errors?.stages[index]?.activity_interval
                                      : errors?.stages
                                  }
                                  control={control}
                                  inputMode="numeric"
                                />
                                <span className="w-[calc(100%_-_110px)] text font-biotif__Medium text-ipBlack__textColor text-[16px] pt-[11px] sm:w-[calc(100%_-_86px)] sm:text-[14px] sm:pt-[7px]">
                                  Minutes
                                </span>
                              </div>
                            </div>
                            <div
                              data-title="Default Anytime"
                              className="column interval__time__column w-1/3 pl-[11px] pr-[11px] lg:w-[195px] sm:w-full sm:px-0"
                            >
                              <div className="flex flex-wrap">
                                <FormField
                                  wrapperClass="mb-0 pin__note__checkbox"
                                  type="checkbox"
                                  name={`stages.${index}.default_anytime`}
                                  label=""
                                  // disabled={hidden}
                                  // onClick={() => handelClick()}
                                  register={register}
                                  // error={errors.is_default}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="settingAction__fixedBtn__acTimeSet flex items-center">
                      <button
                        type="submit"
                        className="i__Button save__btn primary__Btn min-w-[120px] sm:min-w-full sm:ml-0"
                        disabled={!editPermission}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </SettingLayout>
  );
};

export default TimeSet;
