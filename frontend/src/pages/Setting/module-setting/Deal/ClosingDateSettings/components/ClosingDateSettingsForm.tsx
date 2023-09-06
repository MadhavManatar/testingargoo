// ** Import Packages **
import { useSelector } from 'react-redux';

// ** Components **
import Button from 'components/Button';
import FormField from 'components/FormField';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** custom hooks **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Types **
import { ClosingDateSettingsFormPropsType } from '../types/closingDateSettings.types';

// ** Constants **
import { GENERAL_SETTING_VALID_KEYS } from 'constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Util **
import { checkInputIsNumber } from 'utils/util';
import { useAddUpdateGeneralSettingMutation } from 'redux/api/generalSettingApi';

const ClosingDateSettingsForm = (props: ClosingDateSettingsFormPropsType) => {
  const { register, watch, errors, setValue } = props;
  const CLOSING_DATE_DEFAULT_COLORS = [
    '#e70e02',
    '#7EA838',
    '#1776BA',
    '#F78310',
    '#8D23F6',
  ];

  const currentTimeFrame = watch('time_frame');
  const currentSelectedNeutralColor = watch('neutral_color');
  const currentSelectedWarningColor = watch('warning_color');
  const currentSelectedPastDueColor = watch('passed_due_color');

  // ** Hooks **
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [changeGeneralSetting, { isLoading }] =
    useAddUpdateGeneralSettingMutation();

  // ** Custom Hooks **
  const { updateDealPermission } = usePermission();

  const addClosingDateSettings = async (data: {
    time_frame: number;
    neutral_color: string;
    warning_color: string;
    passed_due_color: string;
  }) => {
    await changeGeneralSetting({
      data: {
        dataList: [
          {
            model_name: POLYMORPHIC_MODELS.USER,
            model_record_id: currentUser?.id,
            key: GENERAL_SETTING_VALID_KEYS.deal_closing_date_color_settings_time_frame,
            value: `${data.time_frame}`,
          },
          {
            model_name: POLYMORPHIC_MODELS.USER,
            model_record_id: currentUser?.id,
            key: GENERAL_SETTING_VALID_KEYS.deal_closing_date_color_settings_neutral_color,
            value: `${data.neutral_color}`,
          },
          {
            model_name: POLYMORPHIC_MODELS.USER,
            model_record_id: currentUser?.id,
            key: GENERAL_SETTING_VALID_KEYS.deal_closing_date_color_settings_warning_color,
            value: `${data.warning_color}`,
          },
          {
            model_name: POLYMORPHIC_MODELS.USER,
            model_record_id: currentUser?.id,
            key: GENERAL_SETTING_VALID_KEYS.deal_closing_date_color_settings_passed_due_color,
            value: `${data.passed_due_color}`,
          },
        ],
        module: ModuleNames.DEAL,
        toastMsg:
          ToastMsg.settings.moduleSettings.deal.closingDateSetting.updateMsg,
      },
    });
  };

  const onSubmit = async () => {
    const settings: {
      time_frame: number;
      neutral_color: string;
      warning_color: string;
      passed_due_color: string;
    } = {
      time_frame: currentTimeFrame,
      neutral_color: currentSelectedNeutralColor,
      warning_color: currentSelectedWarningColor,
      passed_due_color: currentSelectedPastDueColor,
    };
    await addClosingDateSettings(settings);
  };

  return (
    <>
      <div className="setting__FixedWrapper__closingDate ip__hideScrollbar overflow-y-auto h-[calc(100dvh_-_370px)] 3xl:h-[calc(100dvh_-_344px)] xl:h-[calc(100dvh_-_275px)] sm:h-[calc(100dvh_-_175px)]">
        <p className="text-[16px] font-biotif__Regular text-black__TextColor800 mb-[10px] pb-2">
          Customize Closing Date Colors and time frame for Warning Color from
          here.
        </p>
        <div className="w-[150px] relative pr-[50px]">
          <label className="if__label if__label__black flex flex-wrap">
            Time Frame :
          </label>
          <FormField
            type="text"
            label=""
            name="time_frame"
            placeholder="Ex: 000"
            register={register}
            error={errors.time_frame}
            onKeyDown={checkInputIsNumber}
            fieldLimit={3}
            inputMode="numeric"
          />
          <span className="text-[16px] font-biotif__Medium text-light__TextColor inline-block opacity-60 absolute top-[40px] right-0">
            Days
          </span>
        </div>
        <div className="mb-[10px]">
          <label className="if__label if__label__black flex flex-wrap">
            Neutral Color :
          </label>
          <div className="flex flex-wrap">
            {CLOSING_DATE_DEFAULT_COLORS.map((colorHashCode, index) => (
              <div
                onClick={() => setValue('neutral_color', colorHashCode)}
                className={`color__box w-[30px] h-[30px] p-[3px] rounded-full border border-ipBlack__borderColor mr-[20px] mb-[15px] sm:mr-[18px] ${
                  colorHashCode === currentSelectedNeutralColor ? 'active' : ''
                }`}
                key={index}
              >
                <div
                  className="inner__box w-full h-full rounded-full relative bg-ip__Orange"
                  style={{ backgroundColor: colorHashCode }}
                >
                  <div className="arrow w-[6px] h-[10px] absolute top-[5px] left-[8px] border-[2px] border-white rotate-[45deg] border-l-0 border-t-0 duration-500 opacity-0" />
                </div>
              </div>
            ))}
            <div
              className={`color__box w-[30px] h-[30px] p-[3px] rounded-full border border-ipBlack__borderColor mr-[20px] mb-[15px] sm:mr-[18px] ${
                currentSelectedNeutralColor &&
                !CLOSING_DATE_DEFAULT_COLORS.includes(
                  currentSelectedNeutralColor
                )
                  ? 'active'
                  : ''
              }`}
            >
              <div
                className={`inner__box w-full h-full rounded-full relative `}
                style={{
                  backgroundColor:
                    currentSelectedNeutralColor &&
                    !CLOSING_DATE_DEFAULT_COLORS.includes(
                      currentSelectedNeutralColor
                    )
                      ? currentSelectedNeutralColor
                      : '',
                }}
              >
                <FormField
                  register={register}
                  id="neutral_color"
                  type="color"
                  name="neutral_color"
                  label=""
                  error={errors.neutral_color}
                />
                {(!currentSelectedNeutralColor ||
                  CLOSING_DATE_DEFAULT_COLORS.includes(
                    currentSelectedNeutralColor
                  )) && (
                  <img
                    className="w-full h-full absolute top-0 left-0"
                    src="/images/color__input__img__2.png"
                    alt=""
                  />
                )}
                <div className="arrow w-[6px] h-[10px] absolute top-[5px] left-[8px] border-[2px] border-white rotate-[45deg] border-l-0 border-t-0 duration-500 opacity-0" />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-[10px]">
          <label className="if__label if__label__black flex flex-wrap">
            Warning Color :
          </label>
          <div className="flex flex-wrap">
            {CLOSING_DATE_DEFAULT_COLORS.map((colorHashCode, index) => (
              <div
                onClick={() => setValue('warning_color', colorHashCode)}
                className={`color__box w-[30px] h-[30px] p-[3px] rounded-full border border-ipBlack__borderColor mr-[20px] mb-[15px] sm:mr-[18px] ${
                  colorHashCode === currentSelectedWarningColor ? 'active' : ''
                }`}
                key={index}
              >
                <div
                  className="inner__box w-full h-full rounded-full relative bg-ip__Orange"
                  style={{ backgroundColor: colorHashCode }}
                >
                  <div className="arrow w-[6px] h-[10px] absolute top-[5px] left-[8px] border-[2px] border-white rotate-[45deg] border-l-0 border-t-0 duration-500 opacity-0" />
                </div>
              </div>
            ))}

            <div
              className={`color__box w-[30px] h-[30px] p-[3px] rounded-full border border-ipBlack__borderColor mr-[20px] mb-[15px] sm:mr-[18px] ${
                currentSelectedWarningColor &&
                !CLOSING_DATE_DEFAULT_COLORS.includes(
                  currentSelectedWarningColor
                )
                  ? 'active'
                  : ''
              }`}
            >
              <div
                className={`inner__box w-full h-full rounded-full relative `}
                style={{
                  backgroundColor:
                    currentSelectedWarningColor &&
                    !CLOSING_DATE_DEFAULT_COLORS.includes(
                      currentSelectedWarningColor
                    )
                      ? currentSelectedWarningColor
                      : 'bg-white',
                }}
              >
                <FormField
                  register={register}
                  id="warning_color"
                  type="color"
                  name="warning_color"
                  label=""
                  error={errors.warning_color}
                />
                {(!currentSelectedWarningColor ||
                  CLOSING_DATE_DEFAULT_COLORS.includes(
                    currentSelectedWarningColor
                  )) && (
                  <img
                    className="w-full h-full absolute top-0 left-0"
                    src="/images/color__input__img__2.png"
                    alt=""
                  />
                )}
                <div className="arrow w-[6px] h-[10px] absolute top-[5px] left-[8px] border-[2px] border-white rotate-[45deg] border-l-0 border-t-0 duration-500 opacity-0" />
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <label className="if__label if__label__black flex flex-wrap">
            Past Due Color :
          </label>
          <div className="flex flex-wrap">
            {CLOSING_DATE_DEFAULT_COLORS.map((colorHashCode, index) => (
              <div
                onClick={() => setValue('passed_due_color', colorHashCode)}
                className={`color__box w-[30px] h-[30px] p-[3px] rounded-full border border-ipBlack__borderColor mr-[20px] mb-[15px] sm:mr-[18px] ${
                  colorHashCode === currentSelectedPastDueColor ? 'active' : ''
                }`}
                key={index}
              >
                <div
                  className="inner__box w-full h-full rounded-full relative bg-ip__Orange"
                  style={{ backgroundColor: colorHashCode }}
                >
                  <div className="arrow w-[6px] h-[10px] absolute top-[5px] left-[8px] border-[2px] border-white rotate-[45deg] border-l-0 border-t-0 duration-500 opacity-0" />
                </div>
              </div>
            ))}

            <div
              className={`color__box w-[30px] h-[30px] p-[3px] rounded-full border border-ipBlack__borderColor mr-[20px] mb-[15px] sm:mr-[18px] ${
                currentSelectedPastDueColor &&
                !CLOSING_DATE_DEFAULT_COLORS.includes(
                  currentSelectedPastDueColor
                )
                  ? 'active'
                  : ''
              }`}
            >
              <div
                className={`inner__box w-full h-full rounded-full relative `}
                style={{
                  backgroundColor:
                    currentSelectedPastDueColor &&
                    !CLOSING_DATE_DEFAULT_COLORS.includes(
                      currentSelectedPastDueColor
                    )
                      ? currentSelectedPastDueColor
                      : 'bg-white',
                }}
              >
                <FormField
                  register={register}
                  id="passed_due_color"
                  type="color"
                  name="passed_due_color"
                  label=""
                  error={errors.passed_due_color}
                />
                {(!currentSelectedPastDueColor ||
                  CLOSING_DATE_DEFAULT_COLORS.includes(
                    currentSelectedPastDueColor
                  )) && (
                  <img
                    className="w-full h-full absolute top-0 left-0"
                    src="/images/color__input__img__2.png"
                    alt=""
                  />
                )}
                <div className="arrow w-[6px] h-[10px] absolute top-[5px] left-[8px] border-[2px] border-white rotate-[45deg] border-l-0 border-t-0 duration-500 opacity-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="settingAction__fixedBtn__closingDate flex items-center">
        <Button
          className="save__btn primary__Btn min-w-[120px] sm:min-w-full sm:ml-0"
          type="submit"
          isLoading={isLoading}
          onClick={onSubmit}
          isDisabled={!updateDealPermission}
        >
          Save
        </Button>
      </div>

      {/* skeleton loader start */}
      <div className="hidden">
        <div className="w-[300px] max-w-full">
          <div className="skeletonBox w-full mb-[10px]" />
          <div className="skeletonBox w-[60%] mb-[20px]" />
        </div>
        <div className="flex flex-wrap items-center mb-[20px]">
          <div className="skeletonBox w-[90px] max-w-full h-[40px] rounded-[6px] mr-[10px] mb-[10px]" />
          <div className="skeletonBox w-[130px] max-w-full mb-[10px]" />
        </div>
        <div className="mb-[20px]">
          <div className="skeletonBox w-[120px] max-w-full mb-[13px]" />
          <div className="flex flex-wrap w-full">
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
          </div>
        </div>
        <div className="mb-[20px]">
          <div className="skeletonBox w-[120px] max-w-full mb-[13px]" />
          <div className="flex flex-wrap w-full">
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
          </div>
        </div>
        <div className="mb-[20px]">
          <div className="skeletonBox w-[120px] max-w-full mb-[13px]" />
          <div className="flex flex-wrap w-full">
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
            <div className="color__box w-[30px] h-[30px] p-[3px] rounded-full border border-greyScreen__BorderColor mr-[20px] mb-[15px] ">
              <div className="skeletonBox w-full h-full rounded-full relative" />
            </div>
          </div>
        </div>
      </div>
      {/* skeleton loader end */}
    </>
  );
};

export default ClosingDateSettingsForm;
