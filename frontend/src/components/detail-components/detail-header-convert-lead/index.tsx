import Tippy from '@tippyjs/react';
import Icon from 'components/Icon';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useNavigate } from 'react-router-dom';
import { setUrlParams } from 'utils/util';

interface IDetailHeaderConvertLead {
  modelRecordId: number;
}

const DetailHeaderConvertLead = (props: IDetailHeaderConvertLead) => {
  const { modelRecordId } = props;
  const navigate = useNavigate();
  return (
    <Tippy zIndex={5} content="Convert">
      <div
        className="link__wrapper"
        onClick={() =>
          navigate(
            setUrlParams(PRIVATE_NAVIGATION.leads.convert, modelRecordId)
          )
        }
      >
        <Icon
          iconType="convertLeadIcon"
          className="socian__ani__icon__wrapper cursor-pointer"
        />
      </div>
    </Tippy>
  );
};

export default DetailHeaderConvertLead;
