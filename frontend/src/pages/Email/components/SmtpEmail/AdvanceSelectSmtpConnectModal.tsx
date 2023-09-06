// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// ** modal **
import Modal from 'components/Modal';

// ** components **
import AdvanceSmtpConnectForm from './AdvanceSmtpConnectForm';

// ** types **
import {
  SearchSmtpResponse,
  SmtpConnectAdvanceFormType,
} from '../../types/email.type';

// ** others **
import { useSmtpConnect } from '../../services/smtp.service';

// ** others **
import { smtpAdvanceFormSchema } from '../../validation-schema/smtpAdvanceForm';
import { UserToken } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  smtpFormData: SearchSmtpResponse | undefined;
  isConnected: () => Promise<UserToken[] | undefined | any>;
}

const AdvanceSelectSmtpConnectModal = (props: Props) => {
  const { closeModal, isOpen, smtpFormData, isConnected } = props;

  // ** Custom hooks **

  const { smtpConnectAPI, isLoading: connectSmtpLoading } = useSmtpConnect();

  const formMethods = useForm<SmtpConnectAdvanceFormType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(smtpAdvanceFormSchema),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = formMethods;

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  useEffect(() => {
    if (smtpFormData?.imap && smtpFormData?.smtp) {
      const { imap, smtp } = smtpFormData.config;
      const {
        host: smtp_host,
        port: smtp_port,
        secure: smtp_secure,
        auth: { pass: password_smtp },
      } = smtp;
      const {
        host: imap_host,
        port: imap_port,
        secure: imap_secure,
        auth: { pass: password_imap },
      } = imap;
      reset({
        imap_host,
        imap_port,
        imap_secure,
        smtp_host,
        smtp_port,
        smtp_secure,
        password_imap,
        password_smtp,
      });
    }
  }, [smtpFormData]);

  const onSubmit = handleSubmit(async (value) => {
    const {
      smtp_host,
      smtp_port,
      imap_host,
      imap_port,
      imap_secure,
      smtp_secure,
    } = value;

    const bodyObj = {
      email: smtpFormData?.config.smtp.auth.user,
      password: smtpFormData?.config.smtp.auth.pass,
      smtp: {
        host: smtp_host,
        port: smtp_port,
        secure: smtp_secure,
        auth: smtpFormData?.config.smtp.auth,
      },
      imap: {
        host: imap_host,
        port: imap_port,
        secure: imap_secure,
        auth: smtpFormData?.config.imap.auth,
      },
      api_purpose: 'manual',
    };

    const { data, error } = await smtpConnectAPI(bodyObj);

    if (data && !error) {
      close();
      isConnected();
    }
  });

  const close = () => {
    reset();
    closeModal();
  };

  return isOpen ? (
    <Modal
      title="Connect Email"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      onSubmit={onSubmit}
      submitLoading={connectSmtpLoading}
      width="844px"
      submitButtonText="Save"
    >
      <FormProvider {...formMethods}>
        <form>
          {smtpFormData && !smtpFormData?.imap && !smtpFormData?.smtp ? (
            <p className="ip__Error mb-[15px]">{smtpFormData?.message}</p>
          ) : (
            <></>
          )}
          <AdvanceSmtpConnectForm errors={errors} register={register} />
        </form>
      </FormProvider>
    </Modal>
  ) : (
    <></>
  );
};

export default AdvanceSelectSmtpConnectModal;
