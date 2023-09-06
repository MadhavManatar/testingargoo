import { EmailModalType } from 'pages/Email/types/email.type';
import { MailTokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { useUndoEmailAPI } from 'pages/Email/services/email.service';

interface PropsInterface {
  setModal: React.Dispatch<React.SetStateAction<EmailModalType | undefined>>;
  emailUndoHelperObj: {
    id?: number | undefined;
    delay_time: number;
    provider?: MailTokenProvider;
    isScheduled?: string;
    isEdited?: boolean;
  };
  removeUndoMessageFromListing?: () => void;
}

const EmailUndoMessage = (props: PropsInterface) => {
  const { setModal, emailUndoHelperObj, removeUndoMessageFromListing } = props;

  const { undoEmailByIdAPI } = useUndoEmailAPI();

  const handleUndoEmail = async () => {
    if (
      emailUndoHelperObj?.id &&
      emailUndoHelperObj.provider &&
      emailUndoHelperObj.isScheduled
    ) {
      const { data, error } = await undoEmailByIdAPI(
        emailUndoHelperObj.provider,
        emailUndoHelperObj.isScheduled,
        {
          ...(emailUndoHelperObj.isScheduled === 'send'
            ? { mail_id: emailUndoHelperObj.id }
            : { scheduled_mail_id: emailUndoHelperObj.id }),
        }
      );
      if (data && !error) {
        setModal(undefined);
        if (removeUndoMessageFromListing) {
          removeUndoMessageFromListing();
        }
      }
    }
  };

  const handleCloseUndoModal = () => {
    setModal(undefined);
  };

  return (
    <div className="undo__email__msg bg-[#ECF2F6] rounded-t-[10px] py-[13px] px-[20px] fixed bottom-[20px] right-[20px] inline-flex items-center">
      <span className="text-[16px] text-black font-biotif__Medium inline-block mr-[30px]">
        {emailUndoHelperObj.isEdited ? 'Message Updated' : 'Message Sent'}
      </span>
      {!emailUndoHelperObj.isEdited && (
        <button
          onClick={handleUndoEmail}
          className="text-[16px] text-primaryColor font-biotif__Medium duration-500 hover:text-primaryColor__hoverDark hover:underline inline-block mr-[30px]"
        >
          Undo
        </button>
      )}
      <button className="text-[16px] text-primaryColor font-biotif__Medium duration-500 hover:text-primaryColor__hoverDark hover:underline inline-block mr-[20px]">
        View message
      </button>
      <button
        onClick={handleCloseUndoModal}
        className="relative w-[25px] h-[25px] rounded-full text-[0px] duration-500 hover:bg-white before:content-[''] before:absolute before:top-[50%] before:left-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[10px] before:h-[2px] before:bg-black before:rotate-45 after:content-[''] after:absolute after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:w-[10px] after:h-[2px] after:bg-black after:rotate-[-45deg]"
      >
        .
      </button>
    </div>
  );
};

export default EmailUndoMessage;
