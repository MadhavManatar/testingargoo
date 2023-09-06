import Button from 'components/Button';
import Icon from 'components/Icon';

interface PropsTypes {
  isLoading: boolean;
  openDeleteModal: () => void;
  moduleName?: string;
  customClassName?: string;
  customClassNameForIcon?: string;
}

const DeleteButton = (props: PropsTypes) => {
  const {
    isLoading,
    openDeleteModal,
    moduleName,
    customClassName,
    customClassNameForIcon,
  } = props;
  return (
    <Button
      className={`delete__Btn h-[44px] text-[14px] font-biotif__Medium py-[5px] px-[18px] rounded-[6px] mb-[10px] lg:mr-[10px] sm:h-[38px] sm:text-[12px] sm:px-[10px] sm:mr-[5px] sm:w-full ${
        customClassName || ''
      }`}
      onClick={openDeleteModal}
      isLoading={isLoading}
    >
      <Icon
        className={`${customClassNameForIcon} hidden`}
        iconType="deleteFilled"
      />
      Delete {moduleName}
    </Button>
  );
};

export default DeleteButton;
