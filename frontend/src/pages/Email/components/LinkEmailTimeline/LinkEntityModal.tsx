import Modal from 'components/Modal';
import LinkEntityForm from './LinkEntityForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { emailLinkEntitySchema } from 'pages/Email/validation-schema/emailLinkEntity.schema';
import {
  EmailLinkEntityFieldType,
  EmailLinkEntityRequest,
} from 'pages/Email/types/emailLinkEntity.type';
import { useEmailLinkEntityMutation } from 'redux/api/mailApi';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  email_id: number;
}

const LinkEntityModal = (props: Props) => {
  const { isOpen, closeModal, email_id } = props;

  const onClose = () => {
    closeModal();
  };
  // ** Custom Hooks
  const [linkEmailEntityAPI, { isLoading }] = useEmailLinkEntityMutation();
  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailLinkEntityFieldType>({
    resolver: yupResolver(emailLinkEntitySchema),
  });
  const onSubmit = handleSubmit(async (values: EmailLinkEntityFieldType) => {
    const model_name = values.entity?.split('-')[0] ?? '';
    const model_record_id = +(values.entity?.split('-')[1] ?? '0');
    const payload: EmailLinkEntityRequest = {
      model_name,
      model_record_id,
    };
    const data = await linkEmailEntityAPI({ id: email_id, data: payload });

    if (!('error' in data)) {
      closeModal();
    }
  });
  return (
    <form onSubmit={onSubmit}>
      <Modal
        modalWrapperClass="link__new__entity__modal"
        title="Link New Entity"
        visible={isOpen}
        submitBtnDisabled={isLoading}
        onCancel={onClose}
        onClose={onClose}
        onSubmit={onSubmit}
        width="560px"
      >
        <LinkEntityForm control={control} errors={errors} />
      </Modal>
    </form>
  );
};

export default LinkEntityModal;
