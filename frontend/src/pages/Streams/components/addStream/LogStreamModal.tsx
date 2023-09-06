// ** Import Packages **
import { ChangeEvent, useEffect, useState } from 'react';

// ** Components **
import Icon from 'components/Icon';
import { debounce } from 'utils/util';
import Modal from 'components/Modal';
import FormField from 'components/FormField';

// **Redux
import {
  getStreamLogFilterState,
  setStreamLogObjFilter,
} from 'redux/slices/stream.Slice';
import { useDispatch, useSelector } from 'react-redux';

// ** types ** //
import {
  FilterType,
  SelectedItem,
  SelectedLogType,
} from 'pages/Streams/types/stream.type';
import NoDataFound from 'components/EntityDetails/Timeline/components/NoDataFound';

const StreamAllItemFilter = (props: FilterType) => {
  // ** Props **

  const {
    isFilterVisible,
    setFilterState,
    filterState,
    onSubmit,
    tab,
    isFilleter,
    setIsSelectFilterVisible,
    activityTypeData,
    logData,
    setIsFilleter,
  } = props;

  // ** Hooks **
  const dispatch = useDispatch();
  const filter = useSelector(getStreamLogFilterState);
  // ** States **
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [search, setSearch] = useState<string>();
  const [selectedLog, setSelectedLog] = useState<SelectedLogType[]>([]);
  const [idArray, setPushIdIntoArray] = useState<string[]>([]);
  const [noDataFound, setNoDataFound] = useState<boolean>();
  // ** UseEffect **
  useEffect(() => {
    if (filterState) {
      const findKeysWithTrueValue = (obj: any) => {
        const keysWithTrueValue = Object.keys(obj).filter(
          (key) => obj[key] === true
        );
        return keysWithTrueValue;
      };
      const data = findKeysWithTrueValue(filterState);
      filterState?.activityTypeIds.forEach((element) => {
        data.push(element.toString());
      });
      setPushIdIntoArray([...data]);
    }
  }, []);

  useEffect(() => {
    if (filterState && tab) {
      const data = {
        all_item: {
          ...filter,
          [tab?.id || 0]: filterState,
        },
      };
      dispatch(
        setStreamLogObjFilter({
          ...data,
        })
      );
    }
  }, [filterState]);

  useEffect(() => {
    const filteredArray = logData?.filter((item) => idArray.includes(item.id));
    if (filteredArray?.length) setSelectedLog(filteredArray);
  }, [idArray]);

  // ** Functions & Event Handler **
  const close = () => {
    setIsSelectFilterVisible(false);
    setFilterState(filterState);
    setIsFilleter(false);
    setSelected([]);
  };
  const searchFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (isFilleter) {
      const searchText = e.target.value;
      const results = logData?.filter((item) => {
        const propertyToSearch = item.name;
        const searchTermLower = searchText.toLowerCase();
        return propertyToSearch.toLowerCase().includes(searchTermLower);
      });

      if (results?.length && searchText) {
        setNoDataFound(false);
        setSelected(
          results?.map((item) => ({
            label: item.name,
            value: item.id,
          }))
        );
      } else if (results?.length === 0 && searchText) {
        setNoDataFound(true);
      } else {
        const result = logData?.filter((item) => {
          return item.name;
        });
        if (result)
          setSelected(
            result &&
              result?.map((item) => ({
                label: item.name,
                value: item.id,
              }))
          );
      }
    }
  };
  const removeLog = (id: number) => {
    const filterList = idArray.filter((filterId) => filterId !== id.toString());
    if (filterList.length) {
      setIsChecked(false);
      setPushIdIntoArray(filterList);
    } else {
      setSelectedLog([]);
      setPushIdIntoArray(filterList);
      setIsChecked(false);
    }
  };
  const handelFilleterApply = () => {
    const ids = idArray
      .filter((id) =>
        activityTypeData.some((obj: any) => obj.id.toString() === id)
      )
      .map((id) => parseInt(id, 10));
    if (setFilterState) {
      setFilterState({
        activityTypeIds: ids,
        documents: idArray.includes('documents'),
        info: idArray.includes('info'),
        notes: idArray.includes('notes'),
        emails_sent: idArray.includes('emails_sent'),
        emails_received: idArray.includes('emails_received'),
        hideRelatedRecord: false,
      });
    }
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <Modal
      title="Filter"
      visible={isFilterVisible}
      onClose={() => close()}
      onCancel={() => close()}
      submitButtonText="Apply"
      onSubmit={() => handelFilleterApply()}
      width="567px"
      saveButtonText="Save and Mark Done"
      saveButtonDisabled={false} // saveButtonClick={saveButtonClick}
      modalWrapperClass="userFilter-modal ip__Modal__Wrapper__new"
      // children={undefined}
    >
      {logData ? (
        <div className="filter-accordian-body">
          <div className="flex items-start">
            <div className="w-1/2 pr-[25px]">
              <div className="ip__form__hasIcon search__box mb-[18px]">
                <input
                  className="ip__input"
                  placeholder="Search"
                  type="search"
                  onChange={debounce(searchFilter)}
                />
                <Icon className="grayscale" iconType="searchStrokeIcon" />
              </div>

              {noDataFound && search && search?.length >= 0 ? (
                <NoDataFound />
              ) : (
                <>
                  <div className="ip__Checkbox w-full border-b-[1px] border-b-whiteScreenBorderColor">
                    <input
                      type="checkbox"
                      name="log"
                      id="log"
                      disabled={
                        (noDataFound && search && search?.length >= 0) || false
                      }
                      checked={logData.length === idArray.length || isChecked}
                      onChange={(event) => {
                        if ((event.target as HTMLInputElement).checked) {
                          const filterIds = logData?.map((log) => log.id);
                          setPushIdIntoArray([...filterIds]);
                          setIsChecked(true);
                        } else {
                          setPushIdIntoArray([]);
                          setIsChecked(false);
                          setSelectedLog([]);
                        }
                      }}
                    />
                    <label className="rc__Label ">
                      <span className="custom__checkRadio__tick" />
                      Select All
                    </label>
                  </div>
                  <div className="item__wrapper">
                    <FormField
                      key={JSON.stringify(idArray)}
                      wrapperClass=""
                      type="checkbox"
                      name="filters"
                      label="Filters"
                      options={
                        selected?.length > 0
                          ? selected?.map((searchFilterList: any) => ({
                              label: searchFilterList?.label,
                              value: searchFilterList?.value,
                              selected: idArray?.includes(
                                searchFilterList?.value?.toString()
                              ),
                            }))
                          : logData?.map((filterData) => ({
                              label: filterData.name,
                              value: filterData.id,
                              selected: idArray.includes(
                                filterData.id?.toString()
                              ),
                            }))
                      }
                      onChange={(event) => {
                        if ((event.target as HTMLInputElement).checked) {
                          setPushIdIntoArray((prev) => [
                            ...prev,
                            event.target.value,
                          ]);
                        } else {
                          setPushIdIntoArray((prev) =>
                            prev.filter((val) => val !== event.target.value)
                          );
                        }
                        if (
                          idArray.length === logData.length &&
                          (event.target as HTMLInputElement).checked === true
                        ) {
                          setIsChecked(true);
                        } else {
                          setSelectedLog([]);
                          setIsChecked(false);
                        }
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="w-1/2 pl-[25px]">
              <h4 className="text-[14px] text-[#2E3234] font-biotif__Medium mb-[12px]">
                Selected Filters
              </h4>
              {selectedLog && selectedLog.length && isFilleter ? (
                <>
                  {selectedLog?.map((log: any) => {
                    return (
                      <>
                        <div className="columns__selection w-full mb-[10px] last:mb-0">
                          <div className="columns__selection__box flex items-center rounded-[7px] py-[6px] px-[12px] pr-[5px] bg-white border-[1px] border-[#CCCCCC]/70 mb-[10px] last:mb-0">
                            <p className="text-[14px] font-biotif__Regular text-[#2E3234] whitespace-pre overflow-hidden text-ellipsis w-full pr-[10px]">
                              {log.name}
                            </p>
                            <div
                              className="relative cursor-pointer w-[26px] h-[26px] shrink-0 duration-300 rounded-full before:content-[''] before:w-[11px] before:h-[1px] before:bg-black/50 before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:rotate-45 after:content-[''] after:w-[11px] after:h-[1px] after:bg-black/50 after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:-rotate-45 hover:bg-[#f0f0f0]"
                              onClick={() => removeLog(log?.id)}
                            />
                          </div>
                        </div>
                      </>
                    );
                  })}
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default StreamAllItemFilter;
