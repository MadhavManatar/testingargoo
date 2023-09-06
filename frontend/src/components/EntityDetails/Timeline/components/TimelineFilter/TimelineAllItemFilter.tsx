import Dropdown from 'components/Dropdown';
import { useGetActivityTypes } from 'pages/Setting/module-setting/Activity/ActivityType/hooks/useActivityType';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import Icon from 'components/Icon';
import { debounce, slugify } from 'utils/util';
import { useToggleDropdown } from 'hooks/useToggleDropdown';
import { AllItemFilter } from '../../types';
// import { useSelector, useDispatch } from 'react-redux';
import {
  TimelineFilterInterface,
  // getTimelineFilterState,
  // getTimelineStateObjFilterState,
  // setTimelineFilter as setFilter,
  // setTimelineStateObjFilter,
} from 'redux/slices/timelineFilterSlice';
import { TimelineModelName } from 'constant/timeline.constant';

const isActiveFilter = (
  filterStateObj: AllItemFilter,
  modelName: TimelineModelName
) => {
  if (
    filterStateObj.activityTypeIds.length ||
    filterStateObj.documents ||
    filterStateObj.info ||
    filterStateObj.notes ||
    filterStateObj.hideRelatedRecord ||
    filterStateObj.emails_received ||
    (filterStateObj.emails_sent && modelName !== TimelineModelName.ACTIVITY)
  ) {
    return true;
  }
  return false;
};

const isAllChecked = (
  filterStateObj: AllItemFilter,
  activityTypeLength: number,
  modelName: TimelineModelName
) => {
  if (
    modelName === TimelineModelName.ACTIVITY &&
    filterStateObj.activityTypeIds.length === activityTypeLength &&
    filterStateObj.documents &&
    filterStateObj.info &&
    filterStateObj.notes 
  ) {
    return true;
  }

  if (
    filterStateObj.activityTypeIds.length === activityTypeLength &&
    filterStateObj.documents &&
    filterStateObj.info &&
    filterStateObj.notes &&
    filterStateObj.emails_received &&
    filterStateObj.emails_sent
  ) {
    return true;
  }
  return false;
};

// const TimelineAllItemFilter = ({
//   modelName,
// }: {
//   modelName: TimelineModelName;
// }) => {

//   const dispatch = useDispatch();
type Props = {
  setFilterState: React.Dispatch<React.SetStateAction<TimelineFilterInterface>>;
  filterState: TimelineFilterInterface;
  modelName: TimelineModelName;
};

const TimelineAllItemFilter = (props: Props) => {
  const { setFilterState, filterState, modelName } = props;
  const FILTER_TYPES =
    modelName === TimelineModelName.ACTIVITY
      ? ['Notes', 'Documents', 'Info']
      : ['Notes', 'Documents', 'Info', 'Emails Sent', 'Emails Received'];
  // HELLO
  // const dispatch = useDispatch();
  // const filter = useSelector(getTimelineFilterState);
  // const filterState.all_items = useSelector(getTimelineStateObjFilterState);

  const { activityTypeData, getActivityTypes, actualActivityTypeIds } =
    useGetActivityTypes({
      sort: 'name',
      fromTimelineFiler: true,
    });
  const { dropdownRef, isDropdownList, toggleDropdownForList } =
    useToggleDropdown();

  const [headingName, setHeadingName] = useState<string[]>([]);
  const [filterSearchTypes, setFilterSearchTypes] =
    useState<string[]>(FILTER_TYPES);

  const selectAllForActivityType = {
    ...filterState.all_items?.selectAllForActivityType,
  };

  const formattedActivityTypeData = _.groupBy(
    activityTypeData,
    'parent_type_id'
  );
  const convertTypesToPlural = (name: string) => {
    if (name === 'SMS') {
      return 'Texts';
    }
    return `${name}s`;
  };

  // **begin:- set format for activity types data **//

  const not_parentIds: number[] = [];

  Object.values(formattedActivityTypeData).forEach((item) => {
    const childParentId = (item || [])?.find(
      (val) => val?.parent_type_id
    )?.parent_type_id;
    const parent = (formattedActivityTypeData?.null || [])?.find(
      (val) => val?.id === childParentId
    );
    if (childParentId) {
      not_parentIds.push(childParentId);
    }
    if (parent) {
      item.unshift(parent);
    }
  });

  (formattedActivityTypeData?.null || []).forEach((item) => {
    if (!not_parentIds.includes(item.id)) {
      formattedActivityTypeData[item.id] = [item];
    }
  });

  // **end:- set format for activity types data **//

  useEffect(() => {
    applyFilter();
  }, [
    filterState.all_items.activityTypeIds.length,
    filterState.all_items.documents,
    filterState.all_items.info,
    filterState.all_items.notes,
    filterState.all_items.hideRelatedRecord,
    filterState.all_items.emails_received,
    filterState.all_items.emails_sent,
  ]);

  useEffect(() => {
    const headings =
      (activityTypeData || [])
        .filter((f_val) =>
          filterState.all_items.activityTypeIds.includes(f_val?.id || 0)
        )
        .map((item) => item?.name || '') || [];

    if (filterState.all_items.documents) {
      headings.push('Documents');
    }

    if (filterState.all_items.info) {
      headings.push('Info');
    }

    if (filterState.all_items.notes) {
      headings.push('Notes');
    }

    if (
      filterState.all_items.emails_received &&
      modelName !== TimelineModelName.ACTIVITY
    ) {
      headings.push('Emails Received');
    }

    if (
      filterState.all_items.emails_sent &&
      modelName !== TimelineModelName.ACTIVITY
    ) {
      headings.push('Emails Sent');
    }

    if (filterState.all_items.hideRelatedRecord) {
      headings.push('Hide Related Record');
    }

    setHeadingName(headings);
  }, [filterState, activityTypeData]);

  const addOrRemoveOnlyChildActivityType = (
    id: number,
    childActivityTypesArray: number[],
    parent_id: number
  ) => {
    if (filterState.all_items?.activityTypeIds.includes(id)) {
      const filterData = (filterState.all_items?.activityTypeIds || []).filter(
        (item) => item !== id
      );

      selectAllForActivityType[parent_id] = {
        isSelect:
          _.difference(childActivityTypesArray, filterData).length === 0,
      };

      // dispatch(
      //   setTimelineStateObjFilter({
      //     all_items: {
      //       ...filterState.all_items,
      //       activityTypeIds: filterData,
      //       selectAllForActivityType,
      //     },
      //   })
      // );
      setFilterState((prev) => ({
        ...prev,
        all_items: {
          ...prev.all_items,
          activityTypeIds: filterData,
          selectAllForActivityType,
        },
      }));
    } else {
      selectAllForActivityType[parent_id] = {
        isSelect:
          _.difference(childActivityTypesArray, [
            ...filterState.all_items.activityTypeIds,
            id,
          ]).length === 0,
      };

      // dispatch(
      //   setTimelineStateObjFilter({
      //     all_items: {
      //       ...filterState.all_items,
      //       activityTypeIds: [...filterState.all_items.activityTypeIds, id],
      //       selectAllForActivityType,
      //     },
      //   })
      // );

      setFilterState((prev) => ({
        ...prev,
        all_items: {
          ...prev.all_items,
          activityTypeIds: [...filterState.all_items.activityTypeIds, id],
          selectAllForActivityType,
        },
      }));
    }
  };

  const addOrRemoveActivityType = (
    checked: boolean,
    childActivityTypesArray: number[],
    parent_id: number
  ) => {
    if (!checked) {
      const filterData = (filterState.all_items?.activityTypeIds || []).filter(
        (item) => !childActivityTypesArray.includes(item)
      );

      selectAllForActivityType[parent_id] = {
        isSelect:
          _.difference(childActivityTypesArray, filterData).length === 0,
      };

      // dispatch(
      //   setTimelineStateObjFilter({
      //     all_items: {
      //       ...filterState.all_items,
      //       activityTypeIds: filterData,
      //       selectAllForActivityType,
      //     },
      //   })
      // );

      setFilterState((prev) => ({
        ...prev,
        all_items: {
          ...prev.all_items,
          activityTypeIds: filterData,
          selectAllForActivityType,
        },
      }));
    } else {
      selectAllForActivityType[parent_id] = {
        isSelect:
          _.difference(
            childActivityTypesArray,
            _.uniq([
              ...filterState.all_items.activityTypeIds,
              ...childActivityTypesArray,
            ])
          ).length === 0,
      };

      // dispatch(
      //   setTimelineStateObjFilter({
      //     all_items: {
      //       ...filterState.all_items,
      //       activityTypeIds: _.uniq([
      //         ...filterState.all_items.activityTypeIds,
      //         ...childActivityTypesArray,
      //       ]),
      //       selectAllForActivityType,
      //     },
      //   })
      // );

      setFilterState((prev) => ({
        ...prev,
        all_items: {
          ...prev.all_items,
          activityTypeIds: _.uniq([
            ...filterState.all_items.activityTypeIds,
            ...childActivityTypesArray,
          ]),
          selectAllForActivityType,
        },
      }));
    }
  };

  const searchActivityType = (e: ChangeEvent<HTMLInputElement>) => {
    const searchFilters = FILTER_TYPES.filter((item) =>
      item
        .toLowerCase()
        .includes((e.target.value || '').toLocaleLowerCase().trim())
    );
    setFilterSearchTypes(searchFilters);
    getActivityTypes({ searchText: (e.target.value || '').trim() });
  };

  const applyFilter = () => {
    setFilterState((prev) => ({
      ...prev,
      timelineFilter: {
        ...prev.timelineFilter,
        allItemFilter: filterState.all_items,
      },
    }));
  };

  const activityTypeFilterItem = useCallback(() => {
    return (
      <div>
        <div className="ip__form__hasIcon search__box mb-0">
          <input
            className="ip__input"
            placeholder="Search"
            type="search"
            onChange={debounce(searchActivityType)}
          />
          <Icon className="grayscale" iconType="searchStrokeIcon" />
        </div>
        <div ref={dropdownRef} className="pt-[6px]">
        <div className="filter-accordian select__all">
            <div className="filter-accordian-header">
              <div className="form__Group">
                <div className="ip__Checkbox ">
                  <div className="relative inline-block">
                    <input
                      className=""
                      onChange={(e) => {
                        // dispatch(
                        //   setTimelineStateObjFilter({
                        //     all_items: {
                        //       ...filterState.all_items,
                        //       hideRelatedRecord: e.target.checked,
                        //     },
                        //   })
                        // );
                        setFilterState((prev) => ({
                          ...prev,
                          all_items: {
                            ...prev.all_items,
                            hideRelatedRecord: e.target.checked,
                          },
                        }));
                      }}
                      type="checkbox"
                      value="select_all"
                      checked={filterState.all_items.hideRelatedRecord}
                    />
                    <label className="rc__Label inline-block !w-auto !max-w-full">
                      Hide Related Record
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="filter-accordian select__all">
            <div className="filter-accordian-header">
              <div className="form__Group">
                <div className="ip__Checkbox ">
                  <div className="relative inline-block">
                    <input
                      className=""
                      onChange={(e) => {
                        const ids = (
                          e.target.checked ? activityTypeData : []
                        ).map((type) => {
                          if (type.parent_type_id) {
                            selectAllForActivityType[type.parent_type_id] = {
                              isSelect: true,
                            };
                          }
                          return type?.id;
                        });

                        setFilterState((prev) => ({
                          ...prev,
                          all_items: {
                            ...prev.all_items,
                            activityTypeIds: ids,
                            documents: e.target.checked,
                            info: e.target.checked,
                            notes: e.target.checked,
                            emails_received:
                              modelName !== TimelineModelName.ACTIVITY &&
                              e.target.checked,
                            emails_sent:
                              modelName !== TimelineModelName.ACTIVITY &&
                              e.target.checked,
                            // hideRelatedRecord: e.target.checked,
                            selectAllForActivityType,
                          },
                        }));
                      }}
                      type="checkbox"
                      value="select_all"
                      checked={isAllChecked(
                        filterState.all_items,
                        activityTypeData.length,
                        modelName
                      )}
                    />
                    <label className="rc__Label inline-block !w-auto !max-w-full">
                      Select All
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <>
            {formattedActivityTypeData?.null?.map((parentType, keyIndex) => {
              const childActivityType = formattedActivityTypeData?.[
                `${parentType.id}`
              ]?.filter((item) => actualActivityTypeIds.includes(item?.id));

              const childActivityTypesArray = (childActivityType || []).map(
                (item) => item.id
              );

              const isChildActivityTypeSelected =
                filterState.all_items.activityTypeIds.some((r) =>
                  childActivityTypesArray.includes(r)
                );

              return (
                <div
                  className={`filter-accordian ${
                    (childActivityType || []).length ? 'inner__child' : ''
                  }`}
                  key={`${keyIndex}_activity_type`}
                >
                  <div className="filter-accordian-header">
                    <div className="form__Group" key={keyIndex}>
                      <div className="ip__Checkbox ">
                        <div className="label__wrapper relative inline-block top-[2px] w-full">
                          <input
                            className=""
                            type="checkbox"
                            value={parentType.id}
                            checked={
                              _.difference(
                                childActivityTypesArray,
                                filterState.all_items.activityTypeIds
                              ).length === 0
                            }
                            onChange={(e) => {
                              addOrRemoveActivityType(
                                e.target.checked,
                                childActivityTypesArray || [],
                                parentType.id
                              );
                            }}
                          />
                          <label className="rc__Label inline-block !w-auto !max-w-full">
                            {convertTypesToPlural(parentType.name)}
                          </label>
                        </div>

                        {(childActivityType || []).length ? (
                          <span
                            className={`count min-w-[25px] flex items-center justify-center font-biotif__Regular text-[#7467B7] text-[14px] pt-[4px] pb-[3px] px-[7px] bg-[#7467B7]/20 rounded-[5px] relative top-[0px] before:content-[''] ${
                              (childActivityType || []).length &&
                              isChildActivityTypeSelected
                                ? 'before:absolute before:top-[-2px] before:right-[-2px] before:w-[8px] before:h-[8px] before:bg-[#7467B7] before:rounded-full'
                                : ''
                            }`}
                          >
                            {childActivityType.length}
                          </span>
                        ) : null}

                        {(childActivityType || []).length ? (
                          <div
                            onClick={() => {
                              if (isDropdownList.id === parentType?.id) {
                                toggleDropdownForList({
                                  id: null,
                                  isOpen: false,
                                });
                              } else {
                                toggleDropdownForList({
                                  id: parentType?.id,
                                  isOpen: true,
                                });
                              }
                            }}
                            className="arrow__btn absolute w-[20px] h-[20px] right-[-25px] top-[calc(50%_-_4px)] translate-y-[-50%] before:content-[''] before:absolute before:top-[2px] before:left-[4px] before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black before:w-[9px] before:h-[9px] rotate-[-135deg] cursor-pointer"
                          />
                        ) : null}

                        {childActivityType?.length &&
                          isDropdownList.isOpen &&
                          isDropdownList.id === parentType?.id && (
                            <div className="filter-accordian-body pl-[15px]">
                              <div className="form__Group ">
                                {childActivityType?.map((child, index) => {
                                  return (
                                    <div className="ip__Checkbox" key={index}>
                                      <div className="inline-block relative top-[2px] w-[calc(100%_-_22px)]">
                                        <input
                                          className=""
                                          type="checkbox"
                                          value={child?.id}
                                          checked={filterState.all_items.activityTypeIds?.includes(
                                            child?.id
                                          )}
                                          onChange={(e) => {
                                            addOrRemoveOnlyChildActivityType(
                                              +e.target.value,
                                              childActivityTypesArray,
                                              parentType.id
                                            );
                                          }}
                                        />
                                        <label className="rc__Label inline-block !w-auto !max-w-full">
                                          {child.name}
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>

          {filterSearchTypes.map((type, index) => (
            <div className="filter-accordian" key={index}>
              <div className="filter-accordian-header">
                <div className="form__Group">
                  <div className="ip__Checkbox ">
                    <div className="relative inline-block">
                      <input
                        className=""
                        type="checkbox"
                        checked={
                          !!filterState.all_items[
                            slugify(type) as keyof typeof filterState.all_items
                          ]
                        }
                        onChange={(e) => {
                          setFilterState((prev) => ({
                            ...prev,
                            all_items: {
                              ...prev.all_items,
                              [slugify(type)]: e.target.checked,
                            },
                          }));
                        }}
                      />
                      <label className="rc__Label inline-block !w-auto !max-w-full">
                        {type}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }, [
    activityTypeData,
    filterState.all_items.activityTypeIds.length,
    formattedActivityTypeData,
  ]);

  const showFilterHeaderName = () => {
    if (headingName.length === 0) {
      return 'Timeline Items';
    }

    if (
      isAllChecked(filterState.all_items, activityTypeData.length, modelName)
    ) {
      return 'All Items';
    }

    if (headingName.length === 1) {
      return headingName[0];
    }
    return `${headingName.length} Items`;
  };

  return (
    <div className="timeline__new__filter__wrapper md:hidden">
      <Dropdown
        className="timeline__new__filter new__latest__filter"
        placement="bottom-end"
        content={activityTypeFilterItem}
      >
        <button
          className={`timeline__action__dropBtn mb-[10px] ${
            isActiveFilter(filterState.all_items, modelName) ? 'active' : ''
          }`}
        >
          {showFilterHeaderName()}
        </button>
      </Dropdown>
    </div>
  );
};

export default TimelineAllItemFilter;
