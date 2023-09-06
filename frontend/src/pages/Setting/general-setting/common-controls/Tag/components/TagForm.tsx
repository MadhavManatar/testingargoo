// ** external packages **
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** components **
import FormField from 'components/FormField';

// ** types **
import { TagFormValueType } from '../types/tag.type';

interface TagFormProps {
  errors: FieldErrors<TagFormValueType>;
  register: UseFormRegister<TagFormValueType>;
  onlyChangeColor?: boolean;
  watch: UseFormWatch<TagFormValueType>;
  setValue: UseFormSetValue<TagFormValueType>;
}

const TAG_DEFAULT_COLORS = ['#F78310', '#7EA838', '#1776BA', '#8D23F6'];

function TagForm(props: TagFormProps) {
  const { errors, register, onlyChangeColor = false, watch, setValue } = props;
  const currentSelectedColor = watch('color');

  return (
    <>
      {!onlyChangeColor && (
        <div className="sm:w-full">
          <FormField<TagFormValueType>
            required
            type="text"
            name="name"
            label="Name"
            labelClass="if__label__blue"
            placeholder="Enter Name"
            register={register}
            error={errors.name}
            fieldLimit={50}
          />
        </div>
      )}
      <div className="sm:w-full">
        <div className="flex flex-wrap">
          {TAG_DEFAULT_COLORS.map((colorHashCode, index) => (
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
              !TAG_DEFAULT_COLORS.includes(currentSelectedColor)
                ? 'active'
                : ''
            }`}
          >
            <div
              className={`inner__box w-full h-full rounded-full relative `}
              style={{
                backgroundColor:
                  currentSelectedColor &&
                  !TAG_DEFAULT_COLORS.includes(currentSelectedColor)
                    ? currentSelectedColor
                    : 'bg-white',
              }}
            >
              <FormField<TagFormValueType>
                register={register}
                id="color"
                type="color"
                name="color"
                label=""
                error={errors.color}
              />
              {(!currentSelectedColor ||
                TAG_DEFAULT_COLORS.includes(currentSelectedColor)) && (
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
    </>
  );
}

export default TagForm;
