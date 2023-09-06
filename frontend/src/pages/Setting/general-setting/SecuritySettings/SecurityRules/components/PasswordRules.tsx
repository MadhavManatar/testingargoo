import FormField from 'components/FormField';
import { ChangeEvent } from 'react';
import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { checkInputIsNumber } from 'utils/util';
import { RuleTypes } from '../types';

const passExpireOptions = [
  { value: 0, label: 'Never' },
  { value: 30, label: 'Every 30 Days' },
  { value: 60, label: 'Every 60 Days' },
  { value: 90, label: 'Every 90 Days' },
  { value: 180, label: 'Every 180 Days' },
  { value: 365, label: 'Every 365 Days' },
];
const passReuseOptions = [
  { value: 1, label: 'Forbid last one previous password' },
  { value: 2, label: 'Forbid last two previous password' },
  { value: 3, label: 'Forbid last three previous password' },
  { value: 4, label: 'Forbid last four previous password' },
  { value: 5, label: 'Forbid last five previous password' },
];

interface Props {
  register: UseFormRegister<RuleTypes>;
  errors: FieldErrors<RuleTypes>;
  watch: UseFormWatch<RuleTypes>;
  onChangeHandler: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isLoading: boolean;
  updateSetting: (
    value: number | boolean | string | null,
    name: keyof RuleTypes
  ) => Promise<void>;
}

const PasswordRules = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { register, errors, watch, onChangeHandler, isLoading, updateSetting } =
    props;

  // const [updateOrganizationSetting, ] =
  //   useUpdateOrganizationSettingMutation();

  // const onChangeHandler = async (
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  //   alertText?: string
  // ) => {
  //   const { name, checked, type, value } = event.target as HTMLInputElement;
  //   if (type === 'checkbox') {
  //     if (!checked)
  //       return setIsOpen({
  //         show: true,
  //         name: alertText || null,
  //         fieldName: name as keyof RuleTypes,
  //       });
  //     setValue(name as keyof RuleTypes, checked);
  //   } else if (name === 'pass_length') {
  //     if (Number(value) && Number(value) > 8 && Number(value) < 16) {
  //       setValue(name, value);
  //       return submit();
  //     }
  //     return;
  //   } else {
  //     setValue(name as keyof RuleTypes, value);
  //   }
  //   return submit();
  // };

  // 'Password both lowercase and uppercase letters';
  // 'Password at least one number';
  // 'Password at least one special character';

  const onChangeSelect = (
    val: number | string | boolean | null,
    fieldName: keyof RuleTypes
  ) => {
    if (fieldName === 'pass_expire' && Number(val) === 0) val = null;
    updateSetting(val, fieldName);
  };
  return (
    <>
      <div className="mb-[20px] pb-2 border-b border-whiteScreen__BorderColor">
        <div className="mb-[20px]">
          <h3 className="text-[16px] font-biotif__Medium text-black mb-[5px]">
            Password Strength
          </h3>
        </div>
        <div>
          <div className="flex">
            <div className="w-2/12 text-right mr-3">
              <span className="text-[16px] text-black mb-[5px]">Contains</span>
            </div>
            <div>
              <FormField
                type="checkbox"
                name="p_upper_lower"
                register={register}
                checked={watch('p_upper_lower')}
                onChange={onChangeHandler}
                label="Both lowercase and uppercase letters"
                disabled={isLoading}
              />
              <FormField
                type="checkbox"
                name="p_num_required"
                register={register}
                onChange={onChangeHandler}
                checked={watch('p_num_required')}
                label="At least one number"
                disabled={isLoading}
              />
              <FormField
                type="checkbox"
                name="p_special_required"
                register={register}
                checked={watch('p_special_required')}
                onChange={onChangeHandler}
                label="At least one special character"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="flex">
            <div className="w-2/12 text-right mr-3">
              <span className="text-[16px] text-black mb-[5px]">
                Minimum number of character
              </span>
            </div>
            <div>
              <FormField
                type="text"
                fieldLimit={2}
                register={register}
                onKeyDown={checkInputIsNumber}
                min={8}
                max={16}
                onBlur={onChangeHandler}
                name="pass_length"
                error={errors.pass_length}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-[20px] pb-2 border-b border-whiteScreen__BorderColor">
        <div className="mb-[20px]">
          <h3 className="text-[16px] font-biotif__Medium text-black mb-[5px]">
            Password Strength
          </h3>
        </div>
        <div>
          <div className="flex">
            <div className="w-2/12 text-right mr-3">
              <span className="text-[16px] text-black mb-[5px]">
                Password expires
              </span>
            </div>
            <div>
              <FormField
                type="select"
                register={register}
                onChange={(val) => onChangeSelect(Number(val), 'pass_expire')}
                options={passExpireOptions}
                name="pass_expire"
              />
            </div>
          </div>
          <div className="flex">
            <div className="w-2/12 text-right mr-3">
              <span className="text-[16px] text-black mb-[5px]">
                Password reuse
              </span>
            </div>
            <div>
              <FormField
                type="select"
                register={register}
                onChange={(val) => onChangeSelect(Number(val), 'pass_reuse')}
                options={passReuseOptions}
                name="pass_reuse"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordRules;
