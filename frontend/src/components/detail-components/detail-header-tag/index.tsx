import Tippy from '@tippyjs/react';
import { IconTypeJson } from 'indexDB/indexdb.type';
import { ModalType } from 'components/EntityDetails/constant';
import IconAnimation from 'components/IconAnimation';

type phoneProps = {
  setOpenModal: (modalName: ModalType) => void;
};
const DetailHeaderTag = (props: phoneProps) => {
  const { setOpenModal } = props;
  return (
    <Tippy zIndex={5} content="Tags">
      <div
        onClick={() => setOpenModal(ModalType.TAG)}
        className="link__wrapper"
      >
        <IconAnimation
          iconType="offerTagsFilledIcon"
          animationIconType={IconTypeJson.Tags}
          className="socian__ani__icon__wrapper"
        />
      </div>
    </Tippy>
  );
};

export default DetailHeaderTag;
