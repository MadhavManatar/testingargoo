import FormField from 'components/FormField';
import Icon from 'components/Icon';
import { AddAccountFormFieldsType } from 'pages/Account/types/account.types';
import {
  FieldArrayWithId,
  UseFieldArrayInsert,
  useFormContext,
} from 'react-hook-form';

interface PropsEmailAccount {
  emailFields: FieldArrayWithId<AddAccountFormFieldsType, 'emails', 'id'>[];
  onRemoveStageForEmail: (index: number) => void;
  insertEmail: UseFieldArrayInsert<AddAccountFormFieldsType, 'emails'>;
  checkMailOnBlur?: (mail: string, type: string) => Promise<void>;
}

const EmailsAccount = (props: PropsEmailAccount) => {
  const { emailFields, onRemoveStageForEmail, insertEmail, checkMailOnBlur } =
    props;

  const methods = useFormContext<AddAccountFormFieldsType>();
  const {
    setValue,
    register,
    watch,
    formState: { errors },
  } = methods;

  return (
    <>
      <div className="repeater__email__box w-full relative">
        <label className="if__label if__label__blue pl-[10px] pr-[80px]">
          Email
        </label>
        {emailFields?.map((field, index) => {
          return (
            <div
              // style={{ ...(!index && { order: emailFields.length }) }}
              className={`w-full flex flex-wrap items-end px-[10px] mb-[20px] sm:relative sm:mb-[5px] sm:pb-[8px]
`}
              key={field.id}
            >
              <div className="w-[calc(100%_-_70px)] sm:w-[calc(100%_-_70px)]">
                <FormField<AddAccountFormFieldsType>
                  wrapperClass="mb-0"
                  type="text"
                  name={`emails.${index}.value`}
                  error={
                    errors?.emails &&
                    errors?.emails[index] &&
                    errors?.emails[index]?.value
                  }
                  autoComplete="new-password"
                  onBlur={(e) => {
                    if (e.target.value && checkMailOnBlur) {
                      checkMailOnBlur(e.target.value, 'email');
                    }
                  }}
                  placeholder="Enter Your Email Address"
                  register={register}
                  fieldLimit={60}
                />
              </div>
              <div className="action__box w-[70px] flex flex-wrap items-center justify-end relative bottom-[6px] h-[30px] sm:absolute sm:top-[9px] sm:right-[10px]">
                <div className="ip__Checkbox primary__field relative ml-[10px]">
                  <input
                    type="radio"
                    className="ip__Radio"
                    checked={field.isPrimary}
                    onChange={() => {
                      setValue(
                        'emails',
                        watch('emails').map((email, pIndex) => ({
                          value: email.value,
                          isPrimary: index === pIndex,
                        }))
                      );
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
                    onRemoveStageForEmail(index);
                  }}
                >
                  <Icon iconType="deleteFilled" fill="var(--ip__Red)" />
                </button>
              </div>
            </div>
          );
        })}
        <div className="w-full px-[10px] mt-[-6px] mb-[17px]">
          <button
            className="add__btn text-[14px] text-[#8A8A8A] font-biotif__Medium duration-500 hover:text-primaryColor"
            type="button"
            onClick={() => {
              insertEmail(emailFields.length, {
                isPrimary: false,
                value: '',
              });
            }}
            disabled={emailFields?.length ? emailFields.length >= 10 : false}
          >
            + Add Email
          </button>
        </div>
        <label className="inline-block font-biotif__Regular text-light__TextColor text-[14px] absolute top-0 right-[31px]">
          Primary
        </label>
      </div>
    </>
  );
};

export default EmailsAccount;
