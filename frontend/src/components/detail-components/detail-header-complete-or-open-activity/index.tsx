import Tippy from '@tippyjs/react';
import Icon from 'components/Icon';

interface IDetailHeaderCompleteOrOpenActivity {
  completeOrOpenActivity?: {
    label: string;
    action: () => void;
  };
}

const DetailHeaderCompleteOrOpenActivity = (
  props: IDetailHeaderCompleteOrOpenActivity
) => {
  const { completeOrOpenActivity } = props;
  return (
    <Tippy zIndex={5} content={completeOrOpenActivity?.label}>
      <div
        className="link__wrapper"
        onClick={() => completeOrOpenActivity?.action?.()}
      >
        <Icon
          iconType="markAsDoneIcon"
          className="socian__ani__icon__wrapper cursor-pointer"
        />
      </div>
    </Tippy>
  );
};

export default DetailHeaderCompleteOrOpenActivity;
