// ** Import Packages **
import Tippy from '@tippyjs/react';
import React from 'react';

// ** Component **
import Icon from 'components/Icon';

// ** Type **
import { SelectedDayRangeType } from './types/index.types';

// ** Constant **
import { DATE_RANGE_DROPDOWN, TAB_NAME } from 'constant';

interface Props {
  setSelectedDayRangeObj: React.Dispatch<
    React.SetStateAction<SelectedDayRangeType>
  >;
  selectedDayRangeObj: SelectedDayRangeType;
  handleCounts?: (
    name: string,
    selectedDate: string | undefined
  ) => Promise<void>;
  modal: TAB_NAME;
  setDays?: React.Dispatch<React.SetStateAction<string | undefined>>;
  isDisabled?: boolean;
}

const DaysFilterDropdown = (props: Props) => {
  const {
    setSelectedDayRangeObj,
    selectedDayRangeObj,
    handleCounts,
    modal,
    setDays,
    isDisabled,
  } = props;

  return (
    <Tippy
      className="tippy__dropdown"
      trigger="click"
      hideOnClick
      theme="light"
      placement="bottom-start"
      content={
        <div className="">
          <ul className="tippy__dropdown__ul">
            {React.Children.toArray(
              DATE_RANGE_DROPDOWN.map(
                (
                  item: { label: string; value: string; slug: string },
                  index: number
                ) => {
                  return (
                    <div key={index} className="item" onClick={() => {
                      setSelectedDayRangeObj({
                        ...selectedDayRangeObj,
                        [modal]: item.slug,
                      });
                      if (setDays) {
                        const data1 = DATE_RANGE_DROPDOWN.find(
                          (obj) => obj.slug === item.slug
                        )?.value;
                        setDays(data1);
                      }

                      if (handleCounts) {
                        handleCounts(
                          modal,
                          DATE_RANGE_DROPDOWN.find(
                            (obj) => obj.slug === item.slug
                          )?.value
                        );
                      }
                    }}>
                      <div className="item__link">
                        <span
                          className="item__text"
                        >
                          {item.label}
                        </span>
                      </div>
                    </div>
                  );
                }
              )
            )}
          </ul>
        </div>
      }
    >
      <button
        className={`ip__Counter__Preview__Drop ${
          isDisabled ? 'pointer-events-none' : ''
        }`}
      >
        <div className="ip__Counter__Preview__Drop flex">
          <span className="text">
            {
              DATE_RANGE_DROPDOWN.find(
                ({ slug }) => slug === selectedDayRangeObj[modal]
              )?.label
            }
          </span>
          <Icon iconType="signupBackArrowFilled" />
        </div>
      </button>
    </Tippy>
  );
};

export default DaysFilterDropdown;
