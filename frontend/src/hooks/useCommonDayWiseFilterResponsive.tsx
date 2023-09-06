// ** Imported packages ** //
import { useCallback, useState } from 'react';

// ** Others ** //
import FormField from 'components/FormField';
import { DATE_RANGE_DROPDOWN } from 'constant';

interface PropsInterface {
  setDays: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const useCommonDayWiseFilterResponsive = (props: PropsInterface) => {
  const { setDays } = props;
  const [filterData, setFilterData] = useState<{
    creation_date: string;
    view: 'list' | 'card';
    slug: string;
  }>({
    creation_date: '',
    view: 'list',
    slug: '',
  });

  const [dropDownState, setDropDownState] = useState<{
    filter: boolean;
    view: boolean;
  }>({
    filter: true,
    view: true,
  });

  const toggleDropDown = (type: 'filter' | 'view') => {
    setDropDownState((prev) => ({
      ...prev,
      [type]: !dropDownState[type],
    }));
  };

  const List = useCallback(
    (content: { close: () => void }) => {
      const { close } = content;
      return (
        <div className="items">
          <div className="filter__wrapper">
            <div className="filter__box border-b border-b-[#000000]/10 pb-[12px] mb-[14px] last:border-b-0 last:pb-0 last:mb-0">
              <div
                className={`${
                  dropDownState.filter
                    ? 'before:rotate-[135deg] before:top-[7px] mb-[10px]'
                    : 'mb-[0px]'
                } cursor-pointer filter__heading text-[16px] !text-black font-biotif__Medium relative before:content-[""] before:absolute before:top-[3px] before:right-0 before:w-[8px] before:h-[8px] before:-rotate-45 before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black`}
                onClick={() => toggleDropDown('filter')}
              >
                Filter
              </div>
              <div className={`${dropDownState.filter ? '' : 'hidden'}`}>
                <FormField
                  key={window.crypto.randomUUID()}
                  type="radio"
                  name="all"
                  checked={filterData.slug === 'all'}
                  value=""
                  label="All Time"
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      creation_date: e.target.value,
                      slug: 'all',
                    })
                  }
                />
                {DATE_RANGE_DROPDOWN.map((item) => {
                  return (
                    <FormField
                      key={window.crypto.randomUUID()}
                      type="radio"
                      name={item.slug}
                      checked={item.slug === filterData.slug}
                      value={item.value}
                      label={item.label}
                      onChange={(e) =>
                        setFilterData({
                          ...filterData,
                          creation_date: e.target.value,
                          slug: item.slug,
                        })
                      }
                    />
                  );
                })}
              </div>
            </div>
            <div className="filter__box border-b border-b-[#000000]/10 pb-[12px] mb-[14px] last:border-b-0 last:pb-0 last:mb-0">
              <div
                className={`${
                  dropDownState.view
                    ? 'before:rotate-[135deg] before:top-[7px] mb-[10px]'
                    : 'mb-[0px]'
                }filter__heading cursor-pointer text-[16px] !text-black font-biotif__Medium relative before:content-[""] before:absolute before:top-[3px] before:right-0 before:w-[8px] before:h-[8px] before:-rotate-45 before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black`}
                onClick={() => toggleDropDown('view')}
              >
                View
              </div>
              <div className={`${dropDownState.view ? '' : 'hidden'}`}>
                <FormField
                  type="radio"
                  name="list"
                  checked={filterData.view === 'list'}
                  value="list"
                  label="List View"
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      view: e.target.value as 'list' | 'card',
                    })
                  }
                />
                <FormField
                  type="radio"
                  name="card"
                  checked={filterData.view === 'card'}
                  value="card"
                  label="Card View"
                  onChange={(e) =>
                    setFilterData({
                      ...filterData,
                      view: e.target.value as 'list' | 'card',
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-[15px]">
            <button
              className="bg-[#D9D9D9] text-[#2E3234] text-[12px] font-biotif__SemiBold py-[4px] px-[12px] rounded-[6px] duration-500 hover:bg-[#bfbfbf] hover:text-[#2E3234]"
              type="button"
              onClick={close}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-primaryColor text-[#ffffff] text-[12px] font-biotif__SemiBold py-[4px] px-[12px] rounded-[6px] duration-500 ml-[10px] hover:bg-primaryColor__hoverDark"
              onClick={() => {
                setDays(filterData.creation_date);
                close();
              }}
            >
              Apply
            </button>
          </div>
        </div>
      );
    },
    [filterData, dropDownState]
  );

  return { List };
};

export default useCommonDayWiseFilterResponsive;
