import Dropdown from 'components/Dropdown';
import { DealFilter } from 'pages/Contact/types/contacts.types';
import { useCallback } from 'react';

type Props = {
  dealFilter?: DealFilter;
  setDealFilter?: React.Dispatch<React.SetStateAction<DealFilter>>;
};

const RelatedDealsFilter = (props: Props) => {
  const { dealFilter, setDealFilter } = props;
  const timelineUserFilterItems = useCallback(() => {
    return (
      <>
        <div className="max-h-[300px] overflow-y-auto ip__hideScrollbar pt-[6px]">
          {dealFilter ? (
            <>
              {Object.keys(dealFilter).map(
                (filterType: string, keyIndex: number) => {
                  const checkBoxValue =
                    dealFilter[filterType as keyof DealFilter];
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
                                value={filterType}
                                checked={checkBoxValue}
                                onChange={(e) => {
                                  const checkEvent = e.target.checked;
                                  if (setDealFilter) {
                                    setDealFilter({
                                      ...dealFilter,
                                      [filterType]: checkEvent,
                                    });
                                  }
                                }}
                              />
                              <label className="rc__Label inline-block !w-auto !max-w-full capitalize">
                                {filterType} Deal
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </>
          ) : (
            <label className="rc__Label text-black text-center block w-full bg-white rounded-[10px] py-[10px]">
              No Option
            </label>
          )}
        </div>
      </>
    );
  }, [dealFilter]);

  return (
    <div className="timeline__action__filter__wrapper mx-[10px] md:hidden">
      <Dropdown
        className="timeline__new__filter new__latest__filter"
        placement="bottom-end"
        content={timelineUserFilterItems}
      >
        <button className="i__Button smaller primary__Btn px-[20px] mb-[10px] sm:mb-0">
          Filter By Deal Type
        </button>
      </Dropdown>
    </div>
  );
};
export default RelatedDealsFilter;
