import Tippy from '@tippyjs/react';
import Icon from 'components/Icon';

interface IDetailHeaderLaunchActivity {
  launchActivity?: () => void;
}

const DetailHeaderLaunchActivity = (props: IDetailHeaderLaunchActivity) => {
  const { launchActivity } = props;
  return (
    <Tippy zIndex={5} content="Launch">
      <div className="link__wrapper" onClick={() => launchActivity?.()}>
        <Icon
          iconType="activityLaunchIcon"
          className="socian__ani__icon__wrapper cursor-pointer"
        />
      </div>
    </Tippy>
  );
};

export default DetailHeaderLaunchActivity;