import Tippy from '@tippyjs/react';
import Icon from 'components/Icon';

interface IDetailHeaderStartOrStopActivity {
  startOrStopActivity?: {
    label: string;
    action: () => void;
  };
}

const DetailHeaderStartOrStopActivity = (
  props: IDetailHeaderStartOrStopActivity
) => {
  const { startOrStopActivity } = props;
  return (
    <Tippy zIndex={5} content={startOrStopActivity?.label}>
      <div
        className="link__wrapper"
        onClick={() => startOrStopActivity?.action?.()}
      >
        <Icon
          iconType="startStopIcon"
          className="socian__ani__icon__wrapper cursor-pointer"
        />
      </div>
    </Tippy>
  );
};

export default DetailHeaderStartOrStopActivity;
