// ** external packages **
import { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

// ** others **
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { convertStringToBoolean } from 'utils/util';

// ** APIS **
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';

type useGetIsAllowMemoEnabledProps = {
  setValue?: UseFormSetValue<{
    isAllowMemoEnabled: boolean;
  }>;
  isTwOFactor?: boolean;
  generalSettingKey:
    | 'is_address_auto_typed'
    | 'is_two_factor_authentication'
    | 'default_activity_time_interval'
    | 'is_memo_allowed_in_deal_lost'
    | 'is_memo_allowed_in_activity_result';
  generalSettingModel: POLYMORPHIC_MODELS;
  modelRecordId?: number;
};

export const useGetIsAllowMemoEnabled = (
  props: useGetIsAllowMemoEnabledProps
) => {
  const {
    setValue,
    generalSettingKey,
    generalSettingModel,
    modelRecordId,
    isTwOFactor,
  } = props;
  // ================= State ====================
  const [isAllowMemoEnabled, setIsAllowMemoEnabled] = useState<boolean>(false);

  // ** APIS **
  const [getGeneralSetting, { isLoading }] = useLazyGetGeneralSettingQuery();

  const getIsAllowMemoEnabled = async () => {
    const { data } = await getGeneralSetting(
      {
        params: {
          'q[key]': generalSettingKey,
          'q[model_name]': generalSettingModel,
          ...(modelRecordId && { 'q[model_record_id]': modelRecordId }),
          module: isTwOFactor ? ModuleNames.USER_SETTINGS : ModuleNames.DEAL,
        },
      },
      true
    );
    if (data?.[0]?.value) {
      setIsAllowMemoEnabled(convertStringToBoolean(data?.[0]?.value));
      if (setValue) {
        setValue(
          'isAllowMemoEnabled',
          convertStringToBoolean(data?.[0]?.value)
        );
      }
    }
  };

  useEffect(() => {
    getIsAllowMemoEnabled();
  }, []);

  return {
    isAllowMemoEnabled,
    isLoading,
  };
};
