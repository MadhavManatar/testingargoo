import Tippy from '@tippyjs/react';
import Icon from 'components/Icon';

interface IDetailHeaderDealWonLost {
  handleDealWonLost?: () => void;
}

const DetailHeaderDealWonLost = (props: IDetailHeaderDealWonLost) => {
  const { handleDealWonLost } = props;
  return (
    <Tippy zIndex={5} content="Won/Lost">
      <div className="link__wrapper" onClick={() => handleDealWonLost?.()}>
        <Icon
          iconType="wonLostIcon"
          className="socian__ani__icon__wrapper cursor-pointer"
        />
      </div>
    </Tippy>
  );
};

export default DetailHeaderDealWonLost;
