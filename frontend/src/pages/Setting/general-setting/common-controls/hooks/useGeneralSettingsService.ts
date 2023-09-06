// ** external packages **
import { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';

// ** others **
import { POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { getCurrentUser } from 'redux/slices/authSlice';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';
import { GENERAL_SETTING_KEY } from 'redux/api/types/generalSettingApit.types';

export const useGetIsAutoSuggestAddressEnabled = ({
  setValue,
}: {
  setValue?: UseFormSetValue<{
    isAutoSuggestAddressEnabled: boolean;
  }>;
}) => {
  // ** State **
  const [isAutoSuggestAddressEnabled, setIsAutoSuggestAddressEnabled] =
    useState<boolean>(false);

  // ** Store **
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [getGeneralSetting, { isLoading }] = useLazyGetGeneralSettingQuery();

  const getIsAutoSuggestAddressEnabled = async () => {
    const { data, error } = await getGeneralSetting(
      {
        params: {
          'q[key]': GENERAL_SETTING_KEY.is_address_auto_typed,
          'q[model_name]': POLYMORPHIC_MODELS.USER,
          'q[model_record_id]': currentUser?.id,
          module: 'user_settings',
        },
      },
      true
    );

    if (data && !error) {
      setIsAutoSuggestAddressEnabled(data[0]?.value === 'true');
      if (setValue) {
        setValue('isAutoSuggestAddressEnabled', data[0]?.value === 'true');
      }
    }
  };

  useEffect(() => {
    getIsAutoSuggestAddressEnabled();
  }, []);

  return {
    isAutoSuggestAddressEnabled,
    isLoading,
  };
};
