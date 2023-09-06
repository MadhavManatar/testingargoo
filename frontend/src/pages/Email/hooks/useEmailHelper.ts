import { POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';

import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';

type PropsEmailUndo = {
  setEmailUndoHelperObj: React.Dispatch<
    React.SetStateAction<{
      id?: number;
      delay_time: number;
    }>
  >;
};

export const useGetEmailUndoDelayTime = (props: PropsEmailUndo) => {
  const { setEmailUndoHelperObj } = props;
  // ** states **
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [getGeneralSetting, { isLoading: getGeneralSettingLoading }] =
    useLazyGetGeneralSettingQuery();

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
      setEmailUndoHelperObj({
        delay_time: Number(data[0]?.value) || 10,
      });
    }
  };

  return {
    getEmailUndoDelayTime,
    getGeneralSettingLoading,
  };
};
