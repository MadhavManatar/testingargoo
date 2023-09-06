import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';
import { useGetUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';
import { ChangeEvent, memo, useCallback, useEffect, useState } from 'react';
import { debounce, convertNumberOrNull } from 'utils/util';
import {
  TimelineFilterInterface,
  // getTimelineFilterState,
  // getTimelineSelectedUsersFilterState,
  // setTimelineFilter as setFilter,
  // setTimelineSelectedUsersFilter,
} from 'redux/slices/timelineFilterSlice';
// import { useSelector } from 'react-redux';
import { TimelineModelName } from 'constant/timeline.constant';

import { useParams } from 'react-router-dom';

interface Props {
  modelName: TimelineModelName;
  setFilterState: React.Dispatch<React.SetStateAction<TimelineFilterInterface>>;
  filterState: TimelineFilterInterface;
}

const TimelineUserFilter = (props: Props) => {
  const { setFilterState, modelName, filterState } = props;

  // const dispatch = useDispatch();

  // const filter = useSelector(getTimelineFilterState);
  const { options: userData, getUserOptions } = useGetUserOptions({});
  const pram_id = useParams();
  const entityId = convertNumberOrNull(pram_id.id);
  const selectedUserReduxObj = filterState.users;
  // const selectedUserReduxObj = useSelector(getTimelineSelectedUsersFilterState);
  const selectedUser: number[] =
    selectedUserReduxObj[modelName]?.[entityId || 0]?.ids || [];
  const timelineFilerObj = { ...selectedUserReduxObj };
  const [headingName, setHeadingName] = useState<string[]>([]);

  useEffect(() => {
    getUserOptions();
  }, []);

  useEffect(() => {
    const titles = (userData || [])
      .filter((f_val) => selectedUser.includes(+f_val.value))
      .map((item) => item.label);
    setHeadingName(titles);
    applyFilter();
  }, [selectedUser.length, userData.length]);

  const addOrRemoveUser = (id: number) => {
    if (selectedUser.includes(id) && entityId) {
      timelineFilerObj[modelName] = {
        ...(timelineFilerObj[modelName] && timelineFilerObj[modelName]),
        [entityId]: {
          ids: selectedUser.filter((val) => val !== id),
        },
      };
      // dispatch(
      //   setTimelineSelectedUsersFilter({
      //     users: timelineFilerObj,
      //   })
      // );

      setFilterState((prev) => ({
        ...prev,
        users: timelineFilerObj,
      }));
    } else if (entityId) {
      timelineFilerObj[modelName] = {
        ...(timelineFilerObj[modelName] && timelineFilerObj[modelName]),
        [entityId]: {
          ids: [...selectedUser, id],
        },
      };

      // dispatch(
      //   setTimelineSelectedUsersFilter({
      //     users: timelineFilerObj,
      //   })
      // );
      setFilterState((prev) => ({
        ...prev,
        users: timelineFilerObj,
      }));
    }
  };

  const searchUser = (e: ChangeEvent<HTMLInputElement>) => {
    getUserOptions({ search: e.target.value });
  };

  const applyFilter = () => {
    // dispatch(
    //   setFilter({
    //     filterDetails: {
    //       ...filter,
    //       userIds: selectedUser,
    //     },
    //   })
    // );
    setFilterState((prev) => ({
      ...prev,
      timelineFilter: {
        ...prev.timelineFilter,
        userIds: selectedUser,
      },
    }));
  };

  const timelineUserFilterItems = useCallback(() => {
    return (
      <>
        <div className="ip__form__hasIcon search__box">
          <input
            className="ip__input"
            placeholder="Search"
            type="search"
            onChange={debounce(searchUser)}
          />
          <Icon className="grayscale" iconType="searchStrokeIcon" />
        </div>
        <div className="max-h-[300px] overflow-y-auto ip__hideScrollbar pt-[6px]">
          {userData?.length > 0 ? (
            <>
              <div className="filter-accordian select__all">
                <div className="filter-accordian-header">
                  <div className="form__Group">
                    <div className="ip__Checkbox ">
                      <div className="relative inline-block">
                        <input
                          className=""
                          onChange={(e) => {
                            const ids = (e.target.checked ? userData : []).map(
                              (item) => {
                                return Number(item?.value);
                              }
                            );
                            if (entityId) {
                              timelineFilerObj[modelName] = {
                                ...(timelineFilerObj[modelName] &&
                                  timelineFilerObj[modelName]),
                                [entityId]: {
                                  ids,
                                },
                              };
                              // dispatch(
                              //   setTimelineSelectedUsersFilter({
                              //     users: timelineFilerObj,
                              //   })
                              // );
                              setFilterState((prev) => ({
                                ...prev,
                                users: timelineFilerObj,
                              }));
                            }
                          }}
                          type="checkbox"
                          value="select_all"
                          checked={selectedUser.length === userData.length}
                        />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          Select All
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {userData.map((user, keyIndex) => {
                return (
                  <div
                    className="filter-accordian"
                    key={`${keyIndex}_user_filter`}
                  >
                    <div className="filter-accordian-header">
                      <div className="form__Group" key={keyIndex}>
                        <div className="ip__Checkbox ">
                          <div className="label__wrapper relative inline-block top-[2px] w-full">
                            <input
                              className=""
                              type="checkbox"
                              value={user.value}
                              checked={selectedUser?.includes(+user.value)}
                              onChange={(e) => {
                                addOrRemoveUser(+e.target.value);
                              }}
                            />
                            <label className="rc__Label inline-block !w-auto !max-w-full">
                              {user.label}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <label className="rc__Label text-black text-center block w-full bg-white rounded-[10px] py-[10px]">
              No Option
            </label>
          )}
        </div>
      </>
    );
  }, [userData, selectedUser]);

  const showFilterHeaderName = () => {
    if (selectedUser.length === 0 || userData.length === 0) {
      return 'Users';
    }

    if (selectedUser.length === userData.length) {
      return 'All Users';
    }

    if (headingName.length === 1) {
      return headingName[0];
    }

    return `${headingName.length} Users`;
  };

  return (
    <div className="timeline__action__filter__wrapper ml-[10px] md:hidden">
      <Dropdown
        className="timeline__new__filter new__latest__filter"
        placement="bottom-end"
        content={timelineUserFilterItems}
      >
        <button
          className={`timeline__action__dropBtn mb-[10px] ${
            filterState.timelineFilter.userIds.length ? 'active' : ''
          }`}
        >
          {showFilterHeaderName()}
        </button>
      </Dropdown>
    </div>
  );
};

export default memo(TimelineUserFilter);
