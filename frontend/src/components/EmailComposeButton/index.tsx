import React, { MutableRefObject, useRef, useState } from 'react';
import { EmailModalType } from 'pages/Email/types/email.type';
import {
  MailTokenProvider,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import AddEmailComposerModal from 'pages/Email/components/emailComposer/AddEmailComposerModal';
import { useGetEmailUndoDelayTime } from 'pages/Email/hooks/useEmailHelper';
import { ModuleNames } from 'constant/permissions.constant';
import { useSelector } from 'react-redux';
import { getMailProviderOption } from 'redux/slices/commonSlice';
import { IconTypeJson } from 'indexDB/indexdb.type';
import IconAnimation from 'components/IconAnimation';

export const EmailComposeButton = (props: {
  email: string | undefined;
  modelName?: ModuleNames;
  modelRecordId?: number | null;
  anchorClassName?: string;
  customClose?: () => void;
  customOpen?: () => void;
}) => {
  const {
    email,
    modelName,
    modelRecordId,
    anchorClassName,
    customClose,
    customOpen,
  } = props;
  const mailProviders = useSelector(getMailProviderOption);

  // ** state
  const [modal, setModal] = useState<EmailModalType>();
  const modalRef = useRef<EmailModalType>();
  modalRef.current = modal;

  const mailHandle = () => {
    if (mailProviders?.length) {
      setModal('compose');
    } else {
      const mailto = `mailto:${email}?subject=No Reply`;
      window.location.href = mailto;
    }
    customClose?.();
  };

  return (
    <>
      <button
        ref={(ref) => {
          if (!ref) return;
          ref.onclick = (e) => {
            e.stopPropagation();
          };
        }}
        onMouseDown={() => mailHandle()}
        className={`${
          !email
            ? 'opacity-60 pointer-events-none link__wrapper'
            : 'link__wrapper'
        } ${anchorClassName || ''}`}
      >
        <IconAnimation
          iconType="mailFilled"
          animationIconType={IconTypeJson.Email}
          className="socian__ani__icon__wrapper"
        />
      </button>
      <ComposeMailModalForClickableEmail
        {...{
          email,
          modal,
          modalRef,
          setModal,
          modelName,
          modelRecordId,
          customOpen,
        }}
      />
    </>
  );
};

type ComposeMailModalForClickableEmailPropsType = {
  email: string | undefined;
  modal: EmailModalType | undefined;
  setModal: React.Dispatch<React.SetStateAction<EmailModalType | undefined>>;
  modelName?: ModuleNames;
  modelRecordId?: number | null;
  modalRef: MutableRefObject<EmailModalType | undefined>;
  customOpen?: () => void;
};

const ComposeMailModalForClickableEmail = (
  props: ComposeMailModalForClickableEmailPropsType
) => {
  const {
    email,
    modal,
    setModal,
    modelName,
    modelRecordId,
    modalRef,
    customOpen,
  } = props;

  const [emailUndoHelperObj, setEmailUndoHelperObj] = useState<{
    id?: number;
    delay_time: number;
    provider?: MailTokenProvider;
  }>({ delay_time: 10 });
  useGetEmailUndoDelayTime({
    setEmailUndoHelperObj,
  });

  const mailProviders = useSelector(getMailProviderOption);

  return (
    <>
      {modal === 'compose' && email && (
        <AddEmailComposerModal
          modalRef={modalRef}
          isOpen={modal === 'compose'}
          defaultRecipient={[{ label: email, value: email }]}
          defaultEmail={false}
          providerOption={mailProviders.filter(
            (item) =>
              ((item.value as string).split(',')[1] as TokenProvider) !==
              TokenProvider.All
          )}
          closeModal={() => {
            setModal(undefined);
            customOpen?.();
          }}
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
