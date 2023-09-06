import FormField from 'components/FormField';
// import { POLYMORPHIC_MODELS } from 'constant/permissions.constant';
// import { GENERAL_SETTING_VALID_KEYS } from 'constant';
// import { useDispatch, useSelector } from 'react-redux';
// import { getCurrentUser } from 'redux/slices/authSlice';
// import { ToastMsg } from 'constant/toast.constants';
// import { useEffect, useState } from 'react';
// import { GeneralSetting } from '../../service/types/generalSettings.types';
// import {
//   useAddUpdateGeneralSettingMutation,
//   useLazyGetGeneralSettingQuery,
// } from 'redux/api/generalSettingApi';

const ZoomPhoneRequire = () => {
  // redux slice
  // const currentUser = useSelector(getCurrentUser);
  // const dispatch = useDispatch();
  // ** states **
  // const [isZoomAccountEnable, setIsZoomAccountEnable] =
  //   useState<boolean>(false);

  // const [getGeneralSetting] = useLazyGetGeneralSettingQuery();
  // const [changeGeneralSetting] = useAddUpdateGeneralSettingMutation();

  // useEffect(() => {
  //   fetchCalenderActivitySettingData();
  // }, []);

  // const fetchCalenderActivitySettingData = async () => {
  //   const {
  //     data: activitySettingData,
  //     error: activityCalenderVisibilityError,
  //   } = await getGeneralSetting(
  //     {
  //       params: {
  //         'q[key]': GENERAL_SETTING_VALID_KEYS.is_zoom_phone_required,
  //         'q[model_name]': POLYMORPHIC_MODELS.ORGANIZATION,
  //         'q[model_record_id]': currentUser?.organization?.organization_id,
  //         module: 'organizations',
  //       },
  //     },
  //     true
  //   );
  //   if (!activityCalenderVisibilityError && activitySettingData.length) {
  //     const is_zoom_required = activitySettingData.find(
  //       (d: GeneralSetting) =>
  //         d.key === GENERAL_SETTING_VALID_KEYS.is_zoom_phone_required
  //     );
  //     if (is_zoom_required) {
  //       const is_zoom_phone_account_required =
  //         is_zoom_required?.value === 'true';
  //       setIsZoomAccountEnable(is_zoom_phone_account_required);
  //       dispatch(
  //         setZoomPhoneAccountRequired({ is_zoom_phone_account_required })
  //       );
  //     }
  //   }
  // };

  // const changeZoomPhoneRequiredSetting = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   await changeGeneralSetting({
  //     data: {
  //       dataList: [
  //         {
  //           model_name: POLYMORPHIC_MODELS.ORGANIZATION,
  //           key: GENERAL_SETTING_VALID_KEYS.is_zoom_phone_required,
  //           value: `${event.target.checked}`,
  //           model_record_id: currentUser?.organization?.organization_id,
  //         },
  //       ],
  //       module: 'organizations',
  //       toastMsg: ToastMsg.settings.moduleSettings.account.name.updateMsg,
  //     },
  //   });
  //   const is_zoom_phone_account_required = event.target.checked;
  //   setIsZoomAccountEnable(!is_zoom_phone_account_required);
  //   dispatch(
  //     setZoomPhoneAccountRequired({
  //       is_zoom_phone_account_required: !is_zoom_phone_account_required,
  //     })
  //   );
  // };



  return (
    <>
      <div className="flex flex-wrap w-[800px] max-w-full">
        <div className="pr-[40px]">
          <div className="inner__wrapper">
            <h3 className="title text-[20px] font-biotif__Medium text-black mb-[6px]">
              Zoom Phone
            </h3>
            <p className="text-[18px] font-biotif__Medium text-black/50 mb-[5px]">
              Turn on the toggle to prompt the user to connect to their Zoom
              phone account to begin viewing the call status and data in real
              time. Enable it and give it a go!
            </p>
            <div className="flex flex-wrap items-center">
              <span className="text-[16px] w-full font-biotif__Medium text-ip__black__text__color mr-[12px]">
                Require Zoom Phone Account.
              </span>
              <div className="flex items-center mt-[5px]">
                <FormField
                  wrapperClass="toggleSwitch mb-0"
                  type="checkbox"
                  name="isZoomPhoneAccountRequired"
                  // onChange={($event) => {
                  //   changeZoomPhoneRequiredSetting(
                  //     $event as React.ChangeEvent<HTMLInputElement>
                  //   );
                  // }}
                  // checked={isZoomAccountEnable}
                />
              </div>
              <span className="inline-block ml-[8px]">
                {/* {isZoomAccountEnable ? 'Yes' : 'No'} */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ZoomPhoneRequire;
