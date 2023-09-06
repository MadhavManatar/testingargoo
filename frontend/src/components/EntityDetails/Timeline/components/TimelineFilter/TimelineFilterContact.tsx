import Dropdown from 'components/Dropdown';
import { memo, useCallback, useEffect, useState } from 'react';
import { BasicContactFields } from 'pages/Contact/types/contacts.types';
import {
  TimelineFilterInterface,
  // getTimelineFilterState,
  // getTimelineSelectedContactsFilterState,
  // setTimelineFilter as setFilter,
  // setTimelineSelectedContactsFilter,
} from 'redux/slices/timelineFilterSlice';
// import { useSelector, useDispatch } from 'react-redux';
import { TimelineModelName } from 'constant/timeline.constant';
import { convertNumberOrNull } from 'utils/util';
import { useParams } from 'react-router-dom';

type TimelineFilterContactPropsType = {
  related_contacts: (BasicContactFields | undefined)[] | undefined;
  modelName: TimelineModelName;
  setFilterState: React.Dispatch<React.SetStateAction<TimelineFilterInterface>>;
  filterState: TimelineFilterInterface;
};

const TimelineFilterContact = (props: TimelineFilterContactPropsType) => {
  const { related_contacts, modelName, setFilterState, filterState } = props;
  const pram_id = useParams();
  const entityId = convertNumberOrNull(pram_id.id);
  const selectedContactReduxObj = filterState.contacts;
  const selectedContact: number[] =
    selectedContactReduxObj[modelName]?.[entityId || 0]?.ids || [];
  const [headingName, setHeadingName] = useState<string[]>([]);

  const timelineFilerObj = { ...selectedContactReduxObj };

  useEffect(() => {
    const titles = (related_contacts || [])
      .filter((f_val) => selectedContact.includes(f_val?.id || 0))
      .map((item) => item?.name || '');
    setHeadingName(titles);
    applyFilter();
  }, [selectedContact.length, related_contacts?.length]);

  const addOrRemoveContact = (id: number) => {
    if (selectedContact.includes(id) && entityId) {
      timelineFilerObj[modelName] = {
        ...(timelineFilerObj[modelName] && timelineFilerObj[modelName]),
        [entityId]: {
          ids: selectedContact.filter((val) => val !== id),
        },
      };
      setFilterState((prev) => ({
        ...prev,
        contacts: timelineFilerObj,
      }));
    } else if (entityId) {
      timelineFilerObj[modelName] = {
        ...(timelineFilerObj[modelName] && timelineFilerObj[modelName]),
        [entityId]: {
          ids: [...selectedContact, id],
        },
      };
      setFilterState((prev) => ({
        ...prev,
        contacts: timelineFilerObj,
      }));
    }
  };

  const applyFilter = () => {
    setFilterState((prev) => ({
      ...prev,
      timelineFilter: {
        ...prev.timelineFilter,
        relatedContactIds: selectedContact,
      },
    }));
  };

  const timelineContactFilterItems = useCallback(() => {
    return (
      <>
        <div className="max-h-[300px] overflow-y-auto ip__hideScrollbar pt-[6px]">
          {(related_contacts || [])?.length > 0 ? (
            <>
              <div className="filter-accordian select__all">
                <div className="filter-accordian-header">
                  <div className="form__Group">
                    <div className="ip__Checkbox ">
                      <div className="relative inline-block">
                        <input
                          className=""
                          onChange={(e) => {
                            const ids = (
                              e.target.checked ? related_contacts || [] : []
                            ).map((item) => {
                              return Number(item?.id);
                            });

                            if (entityId) {
                              timelineFilerObj[modelName] = {
                                ...(timelineFilerObj[modelName] &&
                                  timelineFilerObj[modelName]),
                                [entityId]: {
                                  ids,
                                },
                              };
                              // HELLO
                              // dispatch(
                              //   setTimelineSelectedContactsFilter({
                              //     contacts: timelineFilerObj,
                              //   })
                              // );
                              setFilterState((prev) => ({
                                ...prev,
                                contacts: timelineFilerObj,
                              }));
                            }
                          }}
                          type="checkbox"
                          value="select_all"
                          checked={
                            selectedContact.length ===
                            (related_contacts || []).length
                          }
                        />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          Select All
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {(related_contacts || [])?.map((contact, keyIndex) => {
                return (
                  <div
                    className="filter-accordian"
                    key={`${keyIndex}_contact_filter`}
                  >
                    <div className="filter-accordian-header">
                      <div className="form__Group">
                        <div className="ip__Checkbox ">
                          <div className="label__wrapper relative inline-block top-[2px] w-full">
                            <input
                              className=""
                              type="checkbox"
                              value={contact?.id}
                              checked={selectedContact?.includes(
                                contact?.id || 0
                              )}
                              onChange={(e) => {
                                addOrRemoveContact(+e.target.value);
                              }}
                            />
                            <label className="rc__Label inline-block !w-auto !max-w-full">
                              {contact?.name}
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
            <div className="!text-[18px] w-[200px] text-center font-biotif__SemiBold !text-black">
              No Option
            </div>
          )}
        </div>
      </>
    );
  }, [related_contacts, selectedContact]);

  const showFilterHeaderName = () => {
    if (selectedContact.length === 0) {
      return 'Contacts';
    }

    if (selectedContact.length === (related_contacts || []).length) {
      return 'All Contacts';
    }

    if (headingName.length === 1) {
      return headingName[0];
    }
    return `${headingName.length} Contacts`;
  };

  return (
    <div className="timeline__action__filter__wrapper ml-[10px] md:hidden">
      <Dropdown
        className="timeline__new__filter new__latest__filter"
        placement="bottom-end"
        content={timelineContactFilterItems}
      >
        <button
          className={`timeline__action__dropBtn mb-[10px] ${
            filterState.timelineFilter?.relatedContactIds.length ? 'active' : ''
          }`}
        >
          {showFilterHeaderName()}
        </button>
      </Dropdown>
    </div>
  );
};

export default memo(TimelineFilterContact);
