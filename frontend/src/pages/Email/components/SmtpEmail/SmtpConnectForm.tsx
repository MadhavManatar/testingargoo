// ** Components **
import FormField from 'components/FormField';

// ** Import Types **
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { SmtpConnectFormType } from 'pages/Email/types/email.type';

// ** types **

// ** use services **

interface SmtpFormProps {
  errors: FieldErrors<SmtpConnectFormType>;
  register: UseFormRegister<SmtpConnectFormType>;
}

function SmtpConnectForm(props: SmtpFormProps) {
  const { errors, register } = props;

  return (
    <>
      <p className="text-[16px] font-biotif__Medium text-light__TextColor mb-[15px]">
        Connect any email that support IMAP protocol
      </p>
      <div className="w-full">
        <FormField<SmtpConnectFormType>
          placeholder="johndoe782@gmail.com"
          name="email"
          error={errors?.email}
          type="text"
          label="Email"
          labelClass="if__label__blue"
          required
          register={register}
        />
        <FormField<SmtpConnectFormType>
          placeholder="John****"
          name="password"
          error={errors?.password}
          type="password"
          label="Password"
          labelClass="if__label__blue"
          required
          register={register}
        />
      </div>
    </>
  );
}

export default SmtpConnectForm;
