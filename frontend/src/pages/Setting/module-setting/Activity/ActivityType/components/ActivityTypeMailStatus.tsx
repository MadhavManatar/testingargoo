
import { ICellRendererParams } from 'ag-grid-community';
import Dropdown from 'components/Dropdown';
import { ACTIVITY_TYPE_MAIL_STATUS_OPTIONS } from 'constant/activity.constant';
import { useCallback } from 'react';
import { useUpdateActivityTypeMailStatusMutation } from 'redux/api/activityTypeApi';

interface Props {
  params: ICellRendererParams;
}

interface RangeEventArgs {
  close: () => void;
}

const ActivityTypeMailStatus = (props: Props) => {
  const { params } = props;

  const initialMailStatus =
    ACTIVITY_TYPE_MAIL_STATUS_OPTIONS.find(
      (val) =>
        val.value === params?.data?.activity_type_email_setting?.email_status
    )?.label || 'Disabled';

  // ** APIS **
  const [updateActivityTypeMailStatusApi] =
    useUpdateActivityTypeMailStatusMutation();

  const useUpdateActivityTypeMailStatus = async (status: string) => {
    if (!params.data?.id) return;

    const payload = new FormData();
    payload.append('email_status', status);

    const result = await updateActivityTypeMailStatusApi({
      id: params.data?.id,
      data: payload,
    });
    if ('data' in result) {
      const rowNode = params.api.getRowNode(`${params.data?.id}`);
      const updatedData = { ...params.data, activity_type_email_setting: { ...params?.data?.activity_type_email_setting, email_status: status } };
      rowNode?.setData(updatedData);
    }
  };

  const activityTypeMailStatusOptions = useCallback(
    (args: RangeEventArgs) => {
      const { close } = args;
      return (
        <ul className="tippy__dropdown__ul">
          {ACTIVITY_TYPE_MAIL_STATUS_OPTIONS.map((val, index: number) => {
            return (
              <div
                className="item"
                key={`activityTypeMailStatusOptions_${index}`}
                onClick={() => {
                  useUpdateActivityTypeMailStatus(val.value);
                  close();
                }}
              >
                <div className="item__link">
                  <span className="item__text">{val.label}</span>
                </div>
              </div>
            );
          })}
        </ul>
      );
    },
    [initialMailStatus]
  );

  return (
    <>
      <Dropdown
        className="tippy__dropdown"
        placement="bottom-end"
        content={activityTypeMailStatusOptions}
      >
        <button className="timeline__action__dropBtn">
          {initialMailStatus}
        </button>
      </Dropdown>
    </>
  );
};

export default ActivityTypeMailStatus;
