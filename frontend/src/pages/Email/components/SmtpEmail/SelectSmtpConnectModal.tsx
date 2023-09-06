// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// ** modal **
import Modal from 'components/Modal';

// ** components **
import SmtpConnectForm from './SmtpConnectForm';

// ** validation schema **
import { smtpFormSchema } from 'pages/Email/validation-schema/smtpForm.schema';

// ** services **
import { useSmtpSearch } from 'pages/Email/services/smtp.service';

// ** types **
import {
  EmailModalType,
  SearchSmtpResponse,
  SmtpConnectFormType,
} from '../../types/email.type';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  setModal: React.Dispatch<React.SetStateAction<EmailModalType | undefined>>;
  setSmtpFormData: React.Dispatch<
    React.SetStateAction<SearchSmtpResponse | undefined>
  >;
}
const SelectSmtpConnectModal = (props: Props) => {
  const { closeModal, isOpen, setModal, setSmtpFormData } = props;

  // ** state **

  // ** Custom hooks **
  const { smtpSearchAPI, isLoading } = useSmtpSearch();

  const formMethods = useForm<SmtpConnectFormType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(smtpFormSchema),
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

  const onSubmit = handleSubmit(async (value) => {
    const { data, error } = await smtpSearchAPI({
      ...value,
      api_purpose: 'search',
    });
    if (data && !error) {
      setSmtpFormData(data);
      setModal('advance_smtp');
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
      submitLoading={isLoading}
      submitButtonText="Continue"
    >
      <FormProvider {...formMethods}>
        <form onSubmit={onSubmit}>
          <SmtpConnectForm errors={errors} register={register} />
        </form>
      </FormProvider>
    </Modal>
  ) : (
    <></>
  );
};

export default SelectSmtpConnectModal;
