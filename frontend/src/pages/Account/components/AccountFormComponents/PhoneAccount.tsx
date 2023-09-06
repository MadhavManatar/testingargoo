import FormField from 'components/FormField';
import Icon from 'components/Icon';
import { maskInputRegex } from 'constant/regex.constant';
import { AddAccountFormFieldsType } from 'pages/Account/types/account.types';
import { useGetPhoneTypeOption } from 'pages/Setting/general-setting/common-controls/PhoneType/hooks/usePhoneTypeServices';
import {
  FieldArrayWithId,
  UseFieldArrayInsert,
  useFormContext,
} from 'react-hook-form';

interface PropsPhoneAccount {
  phoneFields: FieldArrayWithId<AddAccountFormFieldsType, 'phones', 'id'>[];
  onRemoveStageForPhone: (index: number) => void;
  insertPhone: UseFieldArrayInsert<AddAccountFormFieldsType, 'phones'>;
}

const PhoneAccount = (props: PropsPhoneAccount) => {
  const { insertPhone, onRemoveStageForPhone, phoneFields } = props;

  const methods = useFormContext<AddAccountFormFieldsType>();
  const {
    setValue,
    register,
    watch,
    control,
    formState: { errors },
  } = methods;

  // ** APIS **
  const { getPhoneTypeOption, isGetPhoneTypeLoading } = useGetPhoneTypeOption();

  return (
    <>
      <div className="repeater__phone__box w-full relative">
        <label className="if__label if__label__blue w-full pl-[10px] pr-[80px]">
          Phone
        </label>
        {phoneFields?.map((field, index) => {
          return (
            <div className="w-full" key={field.id}>
              <div
                className={`w-full flex flex-wrap items-start px-[10px] mb-[0px] relative ${
                  errors?.phones &&
                  errors?.phones[index] &&
                  errors?.phones[index]?.phoneType
                    ? ''
                    : 'sm:pb-[0px]'
                }`}
              >
                <div className="ip__Select w-[180px] mr-[10px] sm:w-[100px]">
                  <FormField<AddAccountFormFieldsType>
                    wrapperClass="mb-0"
                    id={`phones.${index}.phoneType`}
                    placeholder="Select Phone Type"
                    type="asyncSelect"
                    name={`phones.${index}.phoneType`}
                    control={control}
                    error={
                      errors?.phones &&
                      errors?.phones[index] &&
                      errors?.phones[index]?.phoneType
                    }
                    autoComplete="new-password"
                    isClearable
                    isLoading={isGetPhoneTypeLoading}
                    getOptions={getPhoneTypeOption}
                    defaultOptions={
                      field.phoneType
                        ? [
                            {
                              label: field.phoneType,
                              value: field.phoneType,
                              selected: true,
                            },
                          ]
                        : []
                    }
                    menuPosition="absolute"
                    menuPlacement="auto"
                  />
                </div>
                <div className="w-[calc(100%_-_261px)] sm:w-[calc(100%_-_180px)]">
                  <FormField
                    type="mask_input"
                    maskInputType="mask_input_phone"
                    name={`phones.${index}.value`}
                    placeholder="EX. (XXX) XXX-XXXX"
                    register={register}
                    error={
                      errors?.phones &&
                      errors?.phones[index] &&
                      errors?.phones[index]?.value
                    }
                    inputMode="numeric"
                    control={control}
                    mask={maskInputRegex}
                  />
                </div>
                <div className="action__box w-[70px] flex flex-wrap items-center justify-end relative top-[8px] h-[30px] sm:absolute sm:top-[7px] sm:right-[10px]">
                  <div className="ip__Checkbox primary__field relative ml-[10px]">
                    <input
                      type="radio"
                      className="ip__Radio"
                      checked={field.isPrimary}
                      onChange={() => {
                        const updatedPhoneField = (watch('phones') || []).map(
                          (item, pIndex) => {
                            return { ...item, isPrimary: pIndex === index };
                          }
                        );
                        setValue('phones', updatedPhoneField);
                      }}
                    />
                    <label className="rc__Label">Primary</label>
                  </div>
                  <button
                    className={`${
                      field.isPrimary ? 'pointer-events-none opacity-0' : null
                    } delete__btn text-[0px] bg-primary__transparentBG rounded-full w-[30px] h-[30px] relative duration-500 flex items-center justify-center ml-[10px] p-[5px]`}
                    type="button"
                    onClick={() => {
                      onRemoveStageForPhone(index);
                    }}
                  >
                    <Icon iconType="deleteFilled" fill="var(--ip__Red)" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div className="w-full px-[10px] mt-[-6px] mb-[17px]">
          <button
            className="add__btn text-[14px] text-[#8A8A8A] font-biotif__Medium duration-500 hover:text-primaryColor"
            type="button"
            onClick={() => {
              insertPhone(phoneFields.length, {
                isPrimary: false,
                phoneType: null,
                value: '',
              });
            }}
            disabled={phoneFields?.length ? phoneFields.length >= 10 : false}
          >
            + Add Phone
          </button>
        </div>
        <label className="inline-block font-biotif__Regular text-light__TextColor text-[14px] absolute top-0 right-[31px]">
          Primary
        </label>
      </div>
    </>
  );
};

export default PhoneAccount;
