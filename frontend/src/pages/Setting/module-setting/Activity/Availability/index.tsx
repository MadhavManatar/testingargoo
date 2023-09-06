// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

// ** Components **
import FormField from 'components/FormField';
import Icon, { IconTypes } from 'components/Icon';
import Image from 'components/Image';
import AvailabilitySkeleton from './skeletons/AvailabilitySkeleton';
import SettingLayout from 'pages/Setting/components/SettingLayout';

// ** custom hooks **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** types **
import { ActivityAvailabilityFieldType } from './types/activity-availability.types';

// ** constants **
import {
  BasicPermissionTypes,
  ModuleNames,
  POLYMORPHIC_MODELS,
} from 'constant/permissions.constant';

// ** schema **
import { activityAvailabilitySchema } from './validation-schema/activity-availability.schema';

// ** others **
import { ACTIVITY_AVAILABILITY, BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import useAuth from 'hooks/useAuth';
import { ToastMsg } from 'constant/toast.constants';
import {
  useAddUpdateGeneralSettingMutation,
  useLazyGetGeneralSettingQuery,
} from 'redux/api/generalSettingApi';
import { useLazyGetActivityTypesQuery } from 'redux/api/activityTypeApi';

const ActivityAvailability = () => {
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [getGeneralSetting, { isLoading: getGeneralSettingLoading }] =
    useLazyGetGeneralSettingQuery();
  const [changeGeneralSetting, { isLoading: changeGeneralSettingLoading }] =
    useAddUpdateGeneralSettingMutation();
  const [getActivityTypesAPI, { isLoading: getActivityTypesLoading }] =
    useLazyGetActivityTypesQuery();

  const { hasAuthorized } = useAuth();

  const editPermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.UPDATE },
  ]);

  const readPermission = hasAuthorized([
    { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.READ },
  ]);

  //  ** hooks **
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm<ActivityAvailabilityFieldType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(activityAvailabilitySchema),
  });

  const { fields } = useFieldArray({
    name: 'stages',
    control,
  });

  useEffect(() => {
    getActivityTypes();
  }, []);

  const getActivityTypes = async () => {
    if (!readPermission) return null;

    const [
      { data: availabilityData, error: availabilityError },
      { data, error },
    ] = await Promise.all([
      getGeneralSetting(
        {
          params: {
            'q[key]': 'default_activity_availability',
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
            query: {},
          },
        },
        true
      ),
    ]);

    if (data && !error && !availabilityError && availabilityData) {
      const updatedAvailabilityData: {
        related_model_id: number;
        value: string;
      }[] = availabilityData;

      const { rows } = data;

      const activityTypesData = rows.map(
        (item: {
          id: number;
          icon: string;
          icon_type: string;
          name: string;
        }) => {
          return {
            availability:
              updatedAvailabilityData.find(
                (obj) => obj.related_model_id === item.id
              )?.value || 'Busy',
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

    const dataList = value.stages.map(
      ({ id, availability: activity_availability }) => {
        return {
          key: 'default_activity_availability',
          value: activity_availability,
          model_name: POLYMORPHIC_MODELS.USER,
          model_record_id: currentUser?.id,
          related_model_id: id,
          related_model_name: 'activity_types',
        };
      }
    );
    const reqData = {
      dataList,
      module: ModuleNames.ACTIVITY,
      toastMsg:
        ToastMsg.settings.moduleSettings.activity.availability.updateMsg,
    };
    await changeGeneralSetting({ data: reqData });
  });

  return (
    <SettingLayout
      title="Activity Settings"
      breadCrumbPath={
        BREAD_CRUMB.settings.moduleSetting.activity.defaultAvailability
      }
      sideBarLinks={SETTING_SIDEBAR.activitySetting}
    >
      {getActivityTypesLoading ||
      changeGeneralSettingLoading ||
      getGeneralSettingLoading ? (
        <AvailabilitySkeleton />
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
                <p className="text-[20px] text-ip__black__text__color font-biotif__Medium">
                  No default availability set available
                </p>
              </div>
            </div>
          ) : (
            <>
              <h3 className="hidden text-[18px] leading-[24px] font-biotif__Medium text-black whitespace-pre overflow-hidden text-ellipsis sm:block sm:mt-[-5px] sm:mb-[20px]">
                Activity Availability
              </h3>
              <div className="setting__FixedWrapper__ACavailability ip__hideScrollbar overflow-y-auto h-[calc(100dvh_-_370px)] 3xl:h-[calc(100dvh_-_344px)] xl:h-[calc(100dvh_-_275px)] sm:h-[calc(100dvh_-_210px)]">
                <div className="setting__activity__availability__head">
                  <div className="setting__activity__tim__row flex flex-wrap pb-[20px] 3xl:pb-[10px] xl:mt-[5px]">
                    <div className="column activity__type__column w-1/2 pl-[11px] pr-[11px] text-[16px] font-biotif__Medium text-ipBlack__textColor lg:w-[calc(100%_-_145px)] sm:w-[calc(100%_-_110px)] xsm:text-[14px]">
                      Activity Type
                    </div>
                    <div className="column interval__time__column w-1/2 pl-[11px] pr-[11px] text-[16px] font-biotif__Medium text-ip__black__text__color lg:w-[145px] sm:w-[110px] xsm:text-[14px]">
                      Availability
                    </div>
                  </div>
                </div>
                <div className="setting__activity__availability__body ip__hideScrollbar sm:h-[calc(100dvh_-_210px)] sm:overflow-y-auto">
                  <form onSubmit={onSubmit}>
                    <div>
                      {fields.map((field, index: number) => {
                        const { icon_type, icon, activity_type, id } = field;
                        return (
                          <div
                            key={id}
                            className="setting__activity__availability__row flex flex-wrap items-center rounded-[10px] border border-whiteScreen__BorderColor py-[10px] mb-[12px] last:mb-0 sm:p-[15px]"
                          >
                            <div
                              data-title="Activity Type"
                              className="column activity__type__column w-1/2 pl-[11px] pr-[11px] lg:w-[calc(100%_-_145px)] sm:w-full sm:px-[0px]"
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
                              data-title="Availability"
                              className="column interval__time__column w-1/2 pl-[11px] pr-[11px] lg:w-[145px] sm:w-full sm:px-[0px]"
                            >
                              <div className="flex flex-wrap">
                                <FormField
                                  wrapperClass="mb-0 w-[120px] sm:w-full"
                                  id="availability"
                                  placeholder="Availability"
                                  type="select"
                                  name={`stages.${index}.availability`}
                                  control={control}
                                  error={
                                    errors?.stages?.length
                                      ? errors?.stages[index]?.availability
                                      : errors?.stages
                                  }
                                  options={ACTIVITY_AVAILABILITY}
                                  menuPlacement="bottom"
                                  menuPosition="absolute"
                                  register={register}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="settingAction__fixedBtn__ACavailability flex items-center">
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

export default ActivityAvailability;
