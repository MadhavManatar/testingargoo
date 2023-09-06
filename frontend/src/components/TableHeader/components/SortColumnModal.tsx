import React from 'react';
import SortSection from '../../ColumnManageModal/components/SortSection';
import {
  selectOptionsInterface,
  sortDataInterface,
} from '../../ColumnManageModal/types/column.types';
import Button from 'components/Button';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';
import { columnsDataInterface } from 'components/ColumnViewListDropDown';

interface Props {
  closeModal: () => void;
  columOptions: selectOptionsInterface[];
  sortsData: sortDataInterface[];
  setSortsData: (value: sortDataInterface[]) => void;
  onHandleSaveData: () => void;
  apiColumnsData: columnsDataInterface[];
}

const SortColumnModal = ({
  closeModal,
  columOptions,
  sortsData,
  setSortsData,
  onHandleSaveData,
  apiColumnsData,
}: Props) => {
  return (
    <div className="ip__Modal__Wrapper ip__Modal__Wrapper__new sort__column__modal manage__column__modal">
      <div className="ip__Modal__Overlay" />
      <div className="ip__Modal__ContentWrap w-[560px] max-w-[calc(100%_-_30px)]">
        <div className="ip__Modal__Header">
          <h3 className="title">Sort</h3>
          <div onClick={() => closeModal()}>
            <IconAnimation
              iconType="closeBtnFilled"
              animationIconType={IconTypeJson.Close}
            />
          </div>
        </div>
        <div className="ip__Modal__Body ip__FancyScroll relative">
          <SortSection
            columOptions={columOptions}
            sortsData={sortsData}
            apiColumnsData={apiColumnsData}
            setSortsData={setSortsData}
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

export default SortColumnModal;
