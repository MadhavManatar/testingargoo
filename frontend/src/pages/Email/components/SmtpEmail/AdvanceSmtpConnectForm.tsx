// ** import packages **
import { FieldErrors, UseFormRegister } from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';

// ** types **
import { SmtpConnectAdvanceFormType } from '../../types/email.type';

interface SmtpFormAdvanceProps {
  errors: FieldErrors<SmtpConnectAdvanceFormType>;
  register: UseFormRegister<SmtpConnectAdvanceFormType>;
}

function AdvanceSmtpConnectForm(props: SmtpFormAdvanceProps) {
  const { errors, register } = props;

  return (
    <>
      <h6 className="text-[18px] text-ipBlack__textColor font-biotif__Medium mb-[20px]">
        Advance Option
      </h6>
      <div className="flex flex-wrap mx-[-15px]">
        <div className="w-1/2 px-[15px]">
          <h6 className="text-[16px] font-biotif__Medium text-mediumDark__TextColor uppercase mb-[15px]">
            IMAP
          </h6>
          <FormField<SmtpConnectAdvanceFormType>
            name="imap_host"
            error={errors?.imap_host}
            type="text"
            label="IMAP Host"
            labelClass="if__label__blue"
            placeholder="Ex. imap.mail.com"
            register={register}
            required
          />
          <FormField<SmtpConnectAdvanceFormType>
            name="imap_port"
            error={errors?.imap_port}
            type="text"
            label="IMAP Port"
            placeholder="Enter IMAP port"
            fieldLimit={3}
            labelClass="if__label__blue"
            register={register}
            required
          />
          <FormField<SmtpConnectAdvanceFormType>
            name="password_imap"
            error={errors?.password_imap}
            type="password"
            label="Password"
            labelClass="if__label__blue"
            register={register}
            required
          />
          <FormField<SmtpConnectAdvanceFormType>
            name="imap_secure"
            error={errors?.imap_secure}
            type="checkbox"
            label="Secure"
            register={register}
            required
          />
        </div>
        <div className="w-1/2 px-[15px]">
          <h6 className="text-[16px] font-biotif__Medium text-mediumDark__TextColor uppercase mb-[15px]">
            SMTP
          </h6>
          <FormField<SmtpConnectAdvanceFormType>
            name="smtp_host"
            error={errors?.smtp_host}
            type="text"
            label="SMTP Host"
            placeholder="Ex. smtp.mail.com"
            labelClass="if__label__blue"
            register={register}
            required
          />
          <FormField<SmtpConnectAdvanceFormType>
            name="smtp_port"
            error={errors?.smtp_port}
            type="text"
            label="SMTP Port"
            placeholder="Enter SMTP port"
            fieldLimit={4}
            labelClass="if__label__blue"
            register={register}
            required
          />
          <FormField<SmtpConnectAdvanceFormType>
            name="password_smtp"
            error={errors?.password_smtp}
            type="password"
            label="Password"
            labelClass="if__label__blue"
            register={register}
            required
          />
          <FormField<SmtpConnectAdvanceFormType>
            name="smtp_secure"
            error={errors?.smtp_secure}
            type="checkbox"
            label="Secure"
            register={register}
          />
        </div>
      </div>
    </>
  );
}

export default AdvanceSmtpConnectForm;
