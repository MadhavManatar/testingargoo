import { SetButtonProps } from '../components/EmailTabs/types/email-header.types';
import { CustomLabel } from '../types/email.type';

export const useShowEmailOperationButton = () => {
  const setButtons = async (props: SetButtonProps) => {
    const { label, setShowIcon, labels } = props;

    if (label) {
      switch (label) {
        case CustomLabel.INBOX:
        case CustomLabel.SENT:
          setShowIcon((prev) => ({
            ...prev,
            archive: true,
            spam: true,
            delete: true,
            read: true,
          }));
          break;

        case CustomLabel.ARCHIVED:
        case CustomLabel.TRASH:
          setShowIcon((prev) => ({
            ...prev,
            archive: false,
            spam: true,
            delete: true,
            read: true,
          }));
          break;
        case CustomLabel.DRAFT:
          setShowIcon((prev) => ({
            ...prev,
            archive: true,
            spam: false,
            delete: true,
            read: true,
          }));
          break;
        case CustomLabel.SPAM:
          setShowIcon((prev) => ({
            ...prev,
            archive: false,
            spam: false,
            delete: true,
            read: true,
          }));
          break;
        case CustomLabel.SCHEDULED:
          setShowIcon(() => ({
            Unread: false,
            archive: false,
            spam: false,
            delete: true,
            read: false,
          }));
          break;
        default: {
          setShowIcon((prev) => ({
            ...prev,
            archive: false,
            spam: false,
            delete: false,
            read: false,
          }));
          break;
        }
      }
    } else if (
      labels?.some((obj) => [CustomLabel.INBOX, CustomLabel.SENT].includes(obj))
    ) {
      setShowIcon((prev) => ({
        ...prev,
        archive: true,
        spam: true,
        delete: true,
        read: true,
      }));
    } else if (
      labels?.some((obj) =>
        [CustomLabel.ARCHIVED, CustomLabel.TRASH].includes(obj)
      )
    ) {
      setShowIcon((prev) => ({
        ...prev,
        archive: false,
        spam: true,
        delete: true,
        read: true,
      }));
    } else if (labels?.some((obj) => [CustomLabel.DRAFT].includes(obj))) {
      setShowIcon((prev) => ({
        ...prev,
        archive: true,
        spam: false,
        delete: true,
        read: true,
      }));
    } else if (labels?.some((obj) => [CustomLabel.SPAM].includes(obj))) {
      setShowIcon((prev) => ({
        ...prev,
        archive: false,
        spam: false,
        delete: true,
        read: true,
      }));
    } else {
      setShowIcon((prev) => ({
        ...prev,
        archive: false,
        spam: false,
        delete: false,
        read: false,
      }));
    }
  };

  return { setButtons };
};
