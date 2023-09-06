// ** Import Packages **
import Tippy from '@tippyjs/react';
import React, { useEffect, useState } from 'react';

// ** Component **
import Icon from 'components/Icon';

// ** API **
import { useLazyGetAllColumnViewAPIQuery } from 'redux/api/columnApi';

// ** Types **
import {
  FiltersDataInterface,
  sortDataInterface,
} from 'components/ColumnManageModal/types/column.types';

// ** Constant **
import { IS_CACHING_ACTIVE } from 'constant';

interface Props {
  modelName: string;
  setSelectedColumnViewObj: (value: columnViewInterface) => void;
  selectedColumnViewObj: columnViewInterface;
  isDisabled?: boolean;
  isDataUpdated: boolean;
}

export interface columnsDataInterface {
  show: boolean;
  type: string;
  order: number;
  fieldName: string;
  fieldType: string;
  displayName: string;
  default: string;
  width?: number;
  min_width?: number;
  is_pin: boolean;
  foreignKey?: string;
  includeObj?: { [key: string]: string };
  searchKeys?: string[];
  is_wrap: boolean;
  relational_model?: string;
}

export type visibilityType = 'public' | 'private';
export type sortByType = 'asc' | 'desc';
export interface columnViewInterface {
  id: number;
  model_name: string;
  name: string;
  organization_id: number;
  is_system: boolean;
  is_locked: boolean;
  filter: FiltersDataInterface;
  sort: sortDataInterface[];
  columns: columnsDataInterface[];
  spacing?: { height: number; class: string };
  view_users?: ViewUserInterface[];
  visibility: visibilityType;
  created_by?: number;
}

export interface ViewUserInterface {
  organization_id: number;
  view_id: number;
  user_id: number;
  is_pin: boolean;
  order: number;
  is_wrap: boolean;
  created_by: number;
  updated_by: number;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string;
}

const ColumnViewListDropDown = (props: Props) => {
  const {
    modelName,
    isDisabled = false,
    selectedColumnViewObj,
    setSelectedColumnViewObj,
    isDataUpdated,
  } = props;

  // ** State **
  const [columnViewsData, setColumnViewData] = useState<columnViewInterface[]>(
    []
  );

  // ** Apis **
  const [getAllColumnViewAPI] = useLazyGetAllColumnViewAPIQuery();

  // ** useEffect **
  useEffect(() => {
    getAllColumnView();
  }, [isDataUpdated]);

  const getAllColumnView = async () => {
    const { data } = await getAllColumnViewAPI(
      { data: { query: { 'q[model_name]': modelName, sort: '-is_system' } } },
      IS_CACHING_ACTIVE
    );
    if (data && data?.rows?.length) {
      setColumnViewData(data?.rows);
      if (selectedColumnViewObj?.id === -1) {
        setSelectedColumnViewObj(data?.rows[0]);
      }
    }
  };

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
              columnViewsData?.map(
                (item: columnViewInterface, index: number) => {
                  return (
                    <div
                      key={index}
                      className="item"
                      onClick={() => {
                        setSelectedColumnViewObj(item);
                      }}
                    >
                      <div className="item__link">
                        <span className="item__text">{item.name}</span>
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
        className={`ip__Counter__Preview__Drop ${isDisabled ? 'pointer-events-none' : ''
          }`}
      >
        <div className="ip__Counter__Preview__Drop flex">
          <span className="text">
            {
              columnViewsData?.find(
                ({ id }) => id === selectedColumnViewObj?.id
              )?.name
            }
          </span>
          <Icon iconType="signupBackArrowFilled" />
        </div>
      </button>
    </Tippy>
  );
};

export default ColumnViewListDropDown;
