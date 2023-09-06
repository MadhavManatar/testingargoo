// ** Import Packages **
import { useNavigate } from 'react-router-dom';

// ** Constant **
import { TimelineModelName } from 'constant/timeline.constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import { setUrlParams } from 'utils/util';
import Tippy from '@tippyjs/react';

interface PropsInterface {
  record_label: string;
  model_record_id: number;
  model_name: string;
}

const RedirectsLinks = (props: PropsInterface) => {
  const { record_label, model_record_id, model_name } = props;
  const navigate = useNavigate();

  switch (model_name) {
    case TimelineModelName.ACTIVITY:
      return (
        <Tippy
          content={record_label}
          zIndex={3}
          disabled={record_label?.length < 100}
        >
          <span
            onClick={() =>
              navigate(
                setUrlParams(
                  PRIVATE_NAVIGATION.activities.detailPage,
                  model_record_id
                )
              )
            }
            className="text-darkTextColorSD inline hover:text-primaryColorSD hover:underline cursor-pointer ellipsis__2"
          >
            {record_label?.length > 100
              ? `${record_label.substring(0, 100)} ...`
              : record_label}
          </span>
        </Tippy>
      );

    case TimelineModelName.DEAL:
      return (
        <span
          onClick={() =>
            navigate(
              setUrlParams(PRIVATE_NAVIGATION.deals.detailPage, model_record_id)
            )
          }
          className="text-black__TextColor800 hover:text-primaryColorSD hover:underline cursor-pointer"
        >
          {record_label}
        </span>
      );

    case TimelineModelName.LEAD:
      return (
        <span
          onClick={() =>
            navigate(
              setUrlParams(PRIVATE_NAVIGATION.leads.detailPage, model_record_id)
            )
          }
          className="text-black__TextColor800 hover:text-primaryColorSD hover:underline cursor-pointer"
        >
          {record_label}
        </span>
      );
    case TimelineModelName.CONTACT:
      return (
        <span
          onClick={() =>
            navigate(
              setUrlParams(
                PRIVATE_NAVIGATION.contacts.detailPage,
                model_record_id
              )
            )
          }
          className="text-black__TextColor800 hover:text-primaryColorSD hover:underline cursor-pointer"
        >
          {record_label}
        </span>
      );

    case TimelineModelName.ACCOUNT:
      return (
        <span
          onClick={() =>
            navigate(
              setUrlParams(
                PRIVATE_NAVIGATION.accounts.detailPage,
                model_record_id
              )
            )
          }
          className="text-black__TextColor800 hover:text-primaryColorSD hover:underline cursor-pointer"
        >
          {record_label}
        </span>
      );

    default:
      return <></>;
  }
};

export default RedirectsLinks;
