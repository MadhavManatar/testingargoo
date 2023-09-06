import Tippy from '@tippyjs/react';
import { ModalType } from 'components/EntityDetails/constant';
import { IconTypeJson } from 'indexDB/indexdb.type';
import IconAnimation from 'components/IconAnimation';

type noteProps = {
  setOpenModal: (modalName: ModalType) => void;
};

const DetailHeaderNote = (props: noteProps) => {
  const { setOpenModal } = props;
  return (
    <Tippy zIndex={5} content="Notes">
      <div
        onClick={(e) => {
          e.stopPropagation()
          setOpenModal(ModalType.NOTE)
        }}
        className="link__wrapper"
      >
        <IconAnimation
          iconType="mobileMenuFilled"
          animationIconType={IconTypeJson.Notes}
          className="socian__ani__icon__wrapper"
        />
      </div>
    </Tippy>
  );
};
export default DetailHeaderNote;
