import FormField from 'components/FormField';
import { POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { GENERAL_SETTING_VALID_KEYS } from 'constant';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';
import { ToastMsg } from 'constant/toast.constants';
import { useEffect, useState } from 'react';
import { GeneralSetting } from '../../service/types/generalSettings.types';
import {
  useAddUpdateGeneralSettingMutation,
  useLazyGetGeneralSettingQuery,
} from 'redux/api/generalSettingApi';

const IconSettingForm = () => {
  // redux slice
  const currentUser = useSelector(getCurrentUser);
  // ** states **
  const [isIconEnable, setIsIconEnable] = useState<boolean>(false);

  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();
  const [changeGeneralSetting] = useAddUpdateGeneralSettingMutation();

  useEffect(() => {
    fetchIconAnimationSetting();
  }, []);

  const fetchIconAnimationSetting = async () => {
    const { data, error } = await getGeneralSetting(
      {
        params: {
          'q[key]': GENERAL_SETTING_VALID_KEYS.is_icon_animation_required,
          'q[model_name]': POLYMORPHIC_MODELS.ORGANIZATION,
          'q[model_record_id]': currentUser?.organization?.organization_id,
          module: 'organizations',
        },
      },
      true
    );
    if (data && !error) {
      const is_icon_required = data.find(
        (d: GeneralSetting) =>
          d.key === GENERAL_SETTING_VALID_KEYS.is_icon_animation_required
      );
      if (is_icon_required) {
        const is_icon_animation_required = is_icon_required?.value === 'true';
        setIsIconEnable(is_icon_animation_required);
      }
    }
  };

  const changeIconRequiredSetting = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await changeGeneralSetting({
      data: {
        dataList: [
          {
            model_name: POLYMORPHIC_MODELS.ORGANIZATION,
            key: GENERAL_SETTING_VALID_KEYS.is_icon_animation_required,
            value: `${event.target.checked}`,
            model_record_id: currentUser?.organization?.organization_id,
          },
        ],
        module: 'organizations',
        toastMsg: ToastMsg.settings.moduleSettings.icon.name.updateMsg,
      },
    });
    const is_icon_animation_required = event.target.checked;
    setIsIconEnable(!is_icon_animation_required);
  };
  return (
    <>
      <div className="flex flex-wrap w-[800px] max-w-full">
        <div className="pr-[40px]">
          <div className="inner__wrapper">
            <h3 className="title text-[20px] font-biotif__Medium text-black mb-[6px]">
              Animated Icon Settings
            </h3>
            <p className="text-[18px] font-biotif__Medium text-black/50 mb-[5px]">
              Turn on the toggle to have the animated icon replace your default
              icons. Implies if modified by the admin via the admin panel.
            </p>
            <div className="flex flex-wrap items-center">
              <div className="flex items-center mt-[5px]">
                <FormField
                  wrapperClass="toggleSwitch mb-0"
                  type="checkbox"
                  name="is_icon_animation_required"
                  onChange={($event) => {
                    changeIconRequiredSetting(
                      $event as React.ChangeEvent<HTMLInputElement>
                    );
                  }}
                  checked={isIconEnable}
                />
              </div>
              <span className="inline-block ml-[8px]">
                {isIconEnable ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IconSettingForm;
