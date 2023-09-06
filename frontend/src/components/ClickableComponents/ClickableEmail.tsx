// ** components **
import Icon from 'components/Icon';
import { useRef, useState } from 'react';
import {
  MailTokenProvider,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import AddEmailComposerModal from 'pages/Email/components/emailComposer/AddEmailComposerModal';
import { EmailModalType } from 'pages/Email/types/email.type';
import { useGetEmailUndoDelayTime } from 'pages/Email/hooks/useEmailHelper';
import { ModuleNames } from 'constant/permissions.constant';
import { useSelector } from 'react-redux';
import { getMailProviderOption } from 'redux/slices/commonSlice';

interface PropsTypes {
  mail: string;
  isIconOnly?: boolean;
  isIconVisible?: boolean;
  rootClassName?: string;
  iconClassName?: string;
  textClassName?: string;
  customOnClick?: () => void;
  modelName?: ModuleNames;
  modelRecordId?: number | null;
}
const ClickableEmail = (props: PropsTypes) => {
  const {
    mail,
    isIconVisible,
    rootClassName,
    iconClassName,
    textClassName,
    isIconOnly,
    customOnClick,
    modelName,
    modelRecordId,
  } = props;

  const mailProviders = useSelector(getMailProviderOption);

  // ** state
  const [modal, setModal] = useState<EmailModalType>();
  const modalRef = useRef<EmailModalType>();
  modalRef.current = modal;

  const mailHandle = () => {
    if (customOnClick) {
      customOnClick();
    }
    if (
      (mailProviders?.length === 1 && mailProviders?.[0].label !== 'All') ||
      mailProviders?.length > 1
    ) {
      setModal('compose');
    } else {
      const mailto = `mailto:${mail}?subject=No Reply`;
      window.location.href = mailto;
    }
  };

  return (
    <>
      <span
        id="clickable-email"
        className={`${
          rootClassName || ''
        } inline-flex flex-wrap items-center text-[14px] text-black__TextColor600 hover:text-primaryColor font-biotif__Regular max-w-full hover:underline hover:cursor-pointer`}
        onClick={() => mailHandle()}
      >
        {isIconVisible ? (
          <Icon iconType="mailFilled" className={iconClassName || ''} />
        ) : null}
        {!isIconOnly ? (
          <span
            className={
              textClassName ||
              'whitespace-pre overflow-hidden text-ellipsis inline-block max-w-full'
            }
          >
            {mail}
          </span>
        ) : null}
      </span>
      <ComposeMailModalForClickableEmail
        {...{ mail, modal, setModal, modalRef, modelName, modelRecordId }}
      />
    </>
  );
};

export default ClickableEmail;

type ComposeMailModalForClickableEmailPropsType = {
  mail: string;
  modal: EmailModalType | undefined;
  setModal: React.Dispatch<React.SetStateAction<EmailModalType | undefined>>;
  modelName?: ModuleNames;
  modelRecordId?: number | null;
  modalRef: React.MutableRefObject<EmailModalType | undefined>;
};

const ComposeMailModalForClickableEmail = (
  props: ComposeMailModalForClickableEmailPropsType
) => {
  const { mail, modal, setModal, modelName, modelRecordId, modalRef } = props;
  const mailProviders = useSelector(getMailProviderOption);

  const [emailUndoHelperObj, setEmailUndoHelperObj] = useState<{
    id?: number;
    delay_time: number;
    provider?: MailTokenProvider;
  }>({ delay_time: 10 });
  useGetEmailUndoDelayTime({
    setEmailUndoHelperObj,
  });

  return (
    <>
      {modal === 'compose' && (
        <AddEmailComposerModal
          modalRef={modalRef}
          isOpen={modal === 'compose'}
          defaultEmail={false}
          defaultRecipient={[{ label: mail, value: mail }]}
          providerOption={mailProviders.filter(
            (item) =>
              ((item.value as string).split(',')[1] as TokenProvider) !==
              TokenProvider.All
          )}
          closeModal={() => setModal(undefined)}
          setModal={setModal}
          emailUndoHelperObj={emailUndoHelperObj}
          setEmailUndoHelperObj={setEmailUndoHelperObj}
          connectEntityModelName={modelName}
          connectEntityModelRecordId={modelRecordId || undefined}
        />
      )}
    </>
  );
};
