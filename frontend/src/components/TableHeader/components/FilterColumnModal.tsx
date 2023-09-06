import Button from 'components/Button';
import FilterSection from 'components/ColumnManageModal/components/FilterSection';
import {
  FiltersDataInterface,
  selectOptionsInterface,
} from 'components/ColumnManageModal/types/column.types';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';
import React from 'react';

interface PropsInterface {
  closeModal: () => void;
  columOptions: selectOptionsInterface[];
  filtersData: FiltersDataInterface;
  setFiltersData: (value: FiltersDataInterface) => void;
  onHandleSaveData: () => void;
}

const FilterColumnModal = ({
  closeModal,
  columOptions,
  filtersData,
  setFiltersData,
  onHandleSaveData,
}: PropsInterface) => {
  return (
    <div className="ip__Modal__Wrapper ip__Modal__Wrapper__new manage__column__modal filterView__column__modal">
      <div className="ip__Modal__Overlay" />
      <div className="ip__Modal__ContentWrap w-[560px] max-w-[calc(100%_-_30px)]">
        <div className="ip__Modal__Header">
          <h3 className="title">View Filter</h3>
          <div onClick={() => closeModal()}>
            <IconAnimation
              iconType="closeBtnFilled"
              animationIconType={IconTypeJson.Close}
            />
          </div>
        </div>
        <div className="ip__Modal__Body ip__FancyScroll relative">
          <FilterSection
            columOptions={columOptions}
            filtersData={filtersData}
            setFiltersData={setFiltersData}
          />
        </div>
        <div className="ip__Modal__Footer">
          <Button
            onClick={() => closeModal()}
            type="button"
            className="i__Button outline__Btn__SD smaller"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onHandleSaveData()}
            type="button"
            className="i__Button primary__Btn__SD smaller"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterColumnModal;
