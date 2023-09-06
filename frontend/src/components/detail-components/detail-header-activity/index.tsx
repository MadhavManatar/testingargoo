import Tippy from '@tippyjs/react';
import { IconTypeJson } from 'indexDB/indexdb.type';
import { ModalType } from 'components/EntityDetails/constant';
import IconAnimation from 'components/IconAnimation';

type phoneProps = {
  setOpenModal: (modalName: ModalType) => void;
};

const DetailHeaderActivity = (props: phoneProps) => {
  const { setOpenModal } = props;
  return (
    <Tippy zIndex={5} content="Activity">
      <div
        className="link__wrapper"
        onClick={() => setOpenModal(ModalType.ACTIVITY)}
      >
        <IconAnimation
          iconType="activitiesFilledBlackIcon"
          animationIconType={IconTypeJson.Activity}
          className="socian__ani__icon__wrapper"
        />
      </div>
    </Tippy>
  );
};

export default DetailHeaderActivity;
