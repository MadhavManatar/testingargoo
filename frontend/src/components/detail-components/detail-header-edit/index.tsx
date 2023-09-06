import { IconTypeJson } from 'indexDB/indexdb.type';
import IconAnimation from 'components/IconAnimation';

type phoneProps = {
  onclick: () => void;
};
const DetailHeaderEdit = (props: phoneProps) => {
  const { onclick } = props;
  return (
    <div onClick={onclick}>
      <IconAnimation
        iconType="editPencilFilledIcon"
        animationIconType={IconTypeJson.Edit}
        className="socian__ani__icon__wrapper"
      />
    </div>
  );
};

export default DetailHeaderEdit;
