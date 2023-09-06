// ** Import Packages **
import { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Constants **
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';

type useGetIsEnableSubAccountProps = {
  setValue?: UseFormSetValue<{
    isSubAccountEnabled: boolean;
  }>;
  setScheduleSettings?: React.Dispatch<
    React.SetStateAction<{
      summary: {
        time: {
          value: number;
          label: string;
        };
      };
    }>
  >;
  generalSettingKey:
    | 'is_address_auto_typed'
    | 'restore_data_time'
    | 'default_activity_time_interval'
    | 'is_memo_allowed_in_deal_lost'
    | 'is_memo_allowed_in_activity_result'
    | 'is_parent_account_enable'
    | 'is_activity_calender_visibility';
  generalSettingModel: POLYMORPHIC_MODELS;
  modelRecordId?: number;
};

export const useGetIsSubAccountEnabled = (
  props: useGetIsEnableSubAccountProps
) => {
  const { setValue, generalSettingKey, generalSettingModel, modelRecordId } =
    props;
  // ================= State ====================
  const [isSubAccountEnabled, setIsSubAccountEnabled] =
    useState<boolean>(false);

  // ** custom hooks **
  const { readAccountPermission } = usePermission();

  // ** APIS **
  const [getGeneralSetting, { isLoading }] = useLazyGetGeneralSettingQuery();

  const getIsSubAccountEnabled = async () => {
    if (!readAccountPermission) return null;

    const { data } = await getGeneralSetting(
      {
        params: {
          'q[key]': generalSettingKey,
          'q[model_name]': generalSettingModel,
          ...(modelRecordId && { 'q[model_record_id]': modelRecordId }),
          module: ModuleNames.ACCOUNT,
        },
      },
      true
    );
    if (data) {
      const parentAccountEnable = data?.[0]?.value === 'true';
      setIsSubAccountEnabled(parentAccountEnable);
      if (setValue) {
        setValue('isSubAccountEnabled', parentAccountEnable);
      }
    }
  };

  useEffect(() => {
    getIsSubAccountEnabled();
  }, []);

  return {
    isSubAccountEnabled,
    isLoading,
  };
};
export const useGetRestoreData = () => {
  // ** APIS **
  const [getGeneralSetting, { isLoading }] = useLazyGetGeneralSettingQuery();

  const getRestoreData = async (props: useGetIsEnableSubAccountProps) => {
    const { generalSettingKey, generalSettingModel, modelRecordId } = props;

    const { data } = await getGeneralSetting(
      {
        params: {
          'q[key]': generalSettingKey,
          'q[model_name]': generalSettingModel,
          ...(modelRecordId && { 'q[model_record_id]': modelRecordId }),
          module: ModuleNames.ACCOUNT,
        },
      },
      true
    );

    return {
      data,
    };
  };

  return {
    isLoading,
    getRestoreData,
  };
};
