// ** Components **
import FormField from 'components/FormField';

// ** Import Types **
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** types **
import { LeadStatusFieldType } from '../types/lead-temperature-status.types';

interface LeadStatusFormProps {
  errors: FieldErrors<LeadStatusFieldType>;
  register: UseFormRegister<LeadStatusFieldType>;
  onlyChangeColor?: boolean;
  watch: UseFormWatch<LeadStatusFieldType>;
  setValue: UseFormSetValue<LeadStatusFieldType>;
}

const LEAD_STATUS_DEFAULT_COLORS = ['#F78310', '#7EA838', '#1776BA', '#8D23F6'];

function LeadStatusForm(props: LeadStatusFormProps) {
  const { errors, register, onlyChangeColor = false, watch, setValue } = props;
  const currentSelectedColor = watch('color');

  return (
    <>
      <div className="">
        {!onlyChangeColor && (
          <FormField
            required
            placeholder="Enter Temperature status"
            name="name"
            error={errors?.name}
            type="text"
            fieldLimit={30}
            label="Temperature Status Name"
            labelClass="if__label__blue"
            register={register}
          />
        )}
        <div className="">
          <div className="flex flex-wrap">
            {LEAD_STATUS_DEFAULT_COLORS.map((colorHashCode, index) => (
              <div
                onClick={() => setValue('color', colorHashCode)}
                className={`color__box w-[30px] h-[30px] p-[3px] rounded-full border border-ipBlack__borderColor mr-[20px] mb-[15px] ${
                  colorHashCode === currentSelectedColor ? 'active' : ''
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
              className={`color__box w-[30px] h-[30px] p-[3px] rounded-full border border-ipBlack__borderColor mr-[20px] mb-[15px] ${
                currentSelectedColor &&
                !LEAD_STATUS_DEFAULT_COLORS.includes(currentSelectedColor)
                  ? 'active'
                  : ''
              }`}
            >
              <div
                className={`inner__box w-full h-full rounded-full relative `}
                style={{
                  backgroundColor:
                    currentSelectedColor &&
                    !LEAD_STATUS_DEFAULT_COLORS.includes(currentSelectedColor)
                      ? currentSelectedColor
                      : 'bg-white',
                }}
              >
                <FormField
                  register={register}
                  id="color"
                  type="color"
                  name="color"
                  label=""
                  error={errors.color}
                />
                {(!currentSelectedColor ||
                  LEAD_STATUS_DEFAULT_COLORS.includes(
                    currentSelectedColor
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
    </>
  );
}

export default LeadStatusForm;
