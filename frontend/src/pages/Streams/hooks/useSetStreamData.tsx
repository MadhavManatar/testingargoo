// ** Import Packages **
import _ from 'lodash';
// ** Redux
import { useDispatch, useSelector } from 'react-redux';
import { StreamListSetType, tableType } from '../types/stream.type';
import {
  getStreamListViewState,
  getStreamLogFilterState,
  setStreamList,
} from 'redux/slices/stream.Slice';
// ** hooks
import { useGetStreamData } from './stream.service';

const useSetStreamData = () => {
  const dispatch = useDispatch();
  const getStreamView = useSelector(getStreamListViewState);
  const filter = useSelector(getStreamLogFilterState);

  const { getStreamAPI } = useGetStreamData();

  const setStreamListData = async (props: StreamListSetType) => {
    const {
      setStreamData,
      setUserIds,
      setUserData,
      selectedTab,
      streamData,
      isPolling,
      isEdit,
      setFilterState,
    } = props;

    const { data, error } = await getStreamAPI({
      params: {
        'include[streamUser][select]': 'stream_id,user_id,created_by',
        limit: 100000,
        'include[streamUser][required]': false,
        'include[streamUser][include][users][select]':
          'id,first_name,full_name,last_name',
      },
    });

    let tableData: tableType;

    const isEqual = _.isEqual(
      data?.rows,
      getStreamView?.sortStream?.streamData
    );
    if (data?.rows?.length === 0) {
      setStreamData([]);
      setUserIds([]);
      dispatch(
        setStreamList({
          sortStream: { streamData: [], selectedUserIs: [] },
          tab: { label: '', id: 0 },
          userIds: [],
          userData: { count: 0, rows: [] },
          isPolling: true,
          all_item: {
            0: {
              activityTypeIds: [],
              notes: false,
              documents: false,
              info: false,
              emails_received: false,
              emails_sent: false,
              hideRelatedRecord: false,
              selectAllForActivityType: {},
            },
          },
        })
      );
    } else {
      if (
        data &&
        !error &&
        getStreamView?.sortStream?.streamData?.length === 0 &&
        isEdit === undefined
      ) {
        tableData = { rowData: data.rows, rowCount: data.count };
        const users: any = [];
        const userId: string[] = [];
        tableData?.rowData?.[0]?.streamUser?.forEach((element) => {
          userId.push(element?.user_id?.toString());
          users.push(element.users);
        });
        setUserData({ rows: users, count: users?.length });
        selectedTab({
          label: tableData?.rowData?.[0]?.name,
          id: tableData?.rowData?.[0]?.id,
        });
        setUserIds(userId);
        setStreamData([...tableData.rowData]);
        const dataRes = tableData.rowData;
        if (dataRes.length) {
          const streamId = dataRes?.[0]?.id;
          dispatch(
            setStreamList({
              sortStream: {
                streamData: dataRes,
                selectedUserIs: { [streamId]: userId },
              },
              tab: {
                label: tableData?.rowData?.[0]?.name,
                id: tableData?.rowData?.[0]?.id,
              },
              userIds: userId,
              userData: {
                rows: users,
                count: users?.length,
              },
              isPolling,
            })
          );
        }
      } else if (isEqual === false && isEdit === undefined) {
        tableData = { rowData: data.rows, rowCount: data.count };
        if (tableData?.rowData?.length) {
          const users: any = [];
          const userId: string[] = [];
          streamData?.[0]?.streamUser?.forEach((element) => {
            userId.push(element?.user_id?.toString());
            users.push(element.users);
          });
          dispatch(
            setStreamList({
              sortStream: {
                streamData: tableData.rowData,
                selectedUserIs: getStreamView?.sortStream?.selectedUserIs,
              },
              tab: {
                label: streamData?.[0]?.name || '',
                id: streamData?.[0]?.id || 0,
              },
              userIds: userId,
              userData: {
                rows: users,
                count: users?.length,
              },
              isPolling,
            })
          );
        }
      } else if (isEdit === undefined) {
        const dynamic_key = getStreamView?.sortStream?.streamData[0]?.id;
        setStreamData(getStreamView?.sortStream?.streamData);
        selectedTab(getStreamView?.tab);
        if (filter && getStreamView?.tab?.id) {
          setFilterState(filter[getStreamView?.tab?.id]);
        }
        if (
          getStreamView?.sortStream?.selectedUserIs?.[dynamic_key] &&
          getStreamView?.sortStream?.selectedUserIs?.[dynamic_key]?.length >= 0
        ) {
          setUserIds(getStreamView?.sortStream?.selectedUserIs[dynamic_key]);
        } else {
          setUserIds(getStreamView?.userIds);
        }
        setUserData(getStreamView?.userData);
      }
      if (isEdit === true) {
        tableData = { rowData: data.rows, rowCount: data.count };
        const users: any = [];
        const userId: string[] = [];
        tableData?.rowData?.[0]?.streamUser?.forEach((element) => {
          userId.push(element?.user_id?.toString());
          users.push(element.users);
        });
        setUserData({ rows: users, count: users?.length });
        selectedTab({
          label: tableData?.rowData?.[0]?.name,
          id: tableData?.rowData?.[0]?.id,
        });
        setUserIds(userId);
        setStreamData([...tableData.rowData]);
        const dataRes = tableData.rowData;
        if (dataRes.length) {
          dispatch(
            setStreamList({
              sortStream: {
                streamData: dataRes,
                selectedUserIs: getStreamView?.sortStream?.selectedUserIs,
              },
              tab: {
                label: tableData?.rowData?.[0]?.name,
                id: tableData?.rowData?.[0]?.id,
              },
              userIds: userId,
              userData: {
                rows: users,
                count: users?.length,
              },
              isPolling,
            })
          );
        }
      }
      //   setIsEdit(undefined);
    }
  };

  return { setStreamListData };
};

export default useSetStreamData;
