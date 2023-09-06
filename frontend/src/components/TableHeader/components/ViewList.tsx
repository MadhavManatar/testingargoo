import {
  FiltersDataInterface,
  selectOptionsInterface,
  sortDataInterface,
} from 'components/ColumnManageModal/types/column.types';
import {
  columnsDataInterface,
  columnViewInterface,
} from 'components/ColumnViewListDropDown';
import CustomDropDown from 'components/CustomDropDown';
import { Option } from 'components/FormField/types/formField.types';
import Icon from 'components/Icon';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';
import { useEffect, useRef, useState } from 'react';
import { OnChangeValue } from 'react-select';
import Tippy from '@tippyjs/react';
import { useAddColumnViewMutation } from 'redux/api/columnApi';
import { updateArgType, updateViewArgType } from '../types';
import useViewListService from './useViewListService';
import ViewItem from './ViewItem';
import ManageViewsDropDown from './ManageViewsDropDown';
import AuthGuard from 'pages/auth/components/AuthGuard';
import Button from 'components/Button';

interface Props {
  openModalHandler: (openModalItem: { [key: string]: boolean }) => void;
  setSelectedColumnView: (
    value: columnViewInterface,
    isEditModalOpen?: boolean
  ) => void;
  selectedColumnView: columnViewInterface;
  searchValue: string;
  onHandleSearch: (e: React.FormEvent<HTMLInputElement>) => void;
  openViewModal: () => void;
  deleteMethod?: () => void;
  mailMethod?: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  // onReset: () => void;
  total: number;
  children: JSX.Element | JSX.Element[];
  isPipeLine?: boolean;
  pipelineOptions?: Option[];
  selectedPipeline?: any;
  onChangePipeLine?: (selectedOption: OnChangeValue<Option, boolean>) => void;
  modelName: string;
  isDataUpdated: boolean;
  sortsData: sortDataInterface[];
  collectionName: string;
  createPermission?: boolean;
  deletePermission?: boolean;
  dataLoading?: boolean;
  dealsView?: string;
  selectedIds?: number[];
  filtersData: FiltersDataInterface;
  setFiltersData: React.Dispatch<React.SetStateAction<FiltersDataInterface>>;
  setColumnsOptionsData: React.Dispatch<
    React.SetStateAction<selectOptionsInterface[]>
  >;
  setApiColumnsData: React.Dispatch<
    React.SetStateAction<columnsDataInterface[]>
  >;
  closeModal: () => void;
  onHandleUpdateData: (args: {
    columnData: columnViewInterface;
    should_update: boolean;
    is_pin?: boolean;
    is_locked?: boolean;
  }) => void;
  onHandleUpdateRef: React.MutableRefObject<
    ((type: updateArgType, data?: columnsDataInterface[]) => void) | null
  >;
  onHandleDeleteRef: React.MutableRefObject<(() => Promise<void>) | null>;
  // columnListHeight?:number;
  setSpacing?: (value: { height: number; class: string }) => void;
  setIsLoadingDelete?: React.Dispatch<boolean>;
  isViewUpdate: boolean;
}

const ViewList = (props: Props) => {
  const {
    total,
    children,
    isPipeLine,
    searchValue,
    pipelineOptions,
    openModalHandler,
    selectedPipeline,
    selectedColumnView,
    setSelectedColumnView,
    onHandleSearch,
    openViewModal,
    deleteMethod,
    mailMethod,
    onChangePipeLine,
    modelName,
    isDataUpdated,
    sortsData,
    collectionName,
    filtersData,
    createPermission,
    deletePermission,
    dataLoading,
    selectedIds,
    dealsView,
    setFiltersData,
    setColumnsOptionsData,
    setApiColumnsData,
    closeModal,
    onHandleUpdateData,
    onHandleUpdateRef,
    onHandleDeleteRef,
    setSpacing,
    setIsLoadingDelete,
    onSave,
    onSaveAs,
    // onReset,
    isViewUpdate,
  } = props;

  const {
    onHandleDeleteData,
    onHandleUpdate,
    onHandleColumnUpdate,
    onHandlePinViewUpdate,
    onHandleLockViewUpdate,
    columnViewsData,
    isLoading,
    setInitialColumnViewData,
  } = useViewListService({
    modelName,
    isDataUpdated,
    sortsData,
    collectionName,
    selectedColumnView,
    setSelectedColumnView,
    filtersData,
    setFiltersData,
    setColumnsOptionsData,
    setApiColumnsData,
    closeModal,
    onHandleUpdateData,
  });

  // ** states **
  const [headerColumnViews, setHeaderColumnViews] = useState<
    columnViewInterface[]
  >([]);
  const [addColumnViewAPI] = useAddColumnViewMutation();
  const headWrapWidthRef = useRef<HTMLDivElement>(null);

  // const changeSize = useCallback((value: 'large' | 'normal' | 'compact') => {
  //   const sizes = ['large', 'normal', 'compact'];
  //   const el = document.querySelector('.ag-theme-alpine');
  //   if (el) sizes.forEach((size) => el.classList.toggle(size, size === value));
  // }, []);

  useEffect(() => {
    setHeaderColumnViews([]);
    const maxWidth = (Number(headWrapWidthRef.current?.offsetWidth) * 80) / 100;
    let colTotal = 0;
    columnViewsData?.forEach((item) => {
      if (colTotal <= maxWidth) {
        colTotal +=
          (item.name?.length && Number(item.name?.length) * 12 + 53) || 0;
        setHeaderColumnViews((prev) => {
          if (prev) {
            prev?.push(item);
            return prev;
          }
          return [item];
        });
      }
    });
  }, [columnViewsData]);

  useEffect(() => {
    if (setIsLoadingDelete) {
      setIsLoadingDelete(isLoading);
    }
  }, [isLoading]);

  const isSelectedViewIsUnPin = () => {
    return !headerColumnViews?.find(
      (view) => view?.id === selectedColumnView?.id
    );
  };
  const onHandleCloneView = async (type: updateViewArgType) => {
    const bodyData = {
      name: `${selectedColumnView?.name}-copy`,
      model_name: selectedColumnView?.model_name,
      columns: selectedColumnView?.columns,
      filter: filtersData || {},
      sort: sortsData?.filter((item) => item?.column !== undefined) || [],
      is_pin: type === updateViewArgType.PIN,
      visibility: selectedColumnView.visibility,
      toast: true,
    };
    const data = await addColumnViewAPI({
      data: bodyData,
    });
    if ('data' in data && !('error' in data)) {
      setSelectedColumnView(data?.data, true);
    }
    closeModal();
  };

  onHandleUpdateRef.current = onHandleUpdate;
  onHandleDeleteRef.current = onHandleDeleteData;

  const updateColumnHeight = (value: { height: number; class: string }) => {
    if (setSpacing) setSpacing(value);
  };

  const onReset = () => {
    const initialViewData = headerColumnViews.find(
      (val) => val.id === selectedColumnView.id
    );
    setInitialColumnViewData();
    if (initialViewData) {
      setSelectedColumnView(initialViewData, false);
    }
  };

  return (
    <div className="inner__wrapper w-full">
      <div
        ref={headWrapWidthRef}
        className="top__pinBar relative pt-[0px] border-b-[1px] border-b-[#E5E5E5] flex w-full justify-between"
      >
        <div className="inline-flex items-center max-w-[calc(100%_-_270px)]">
          <div className="scroll__wrapper ip__hideScrollbar w-auto max-w-full overflow-hidden whitespace-pre pr-[10px]">
            {[
              ...headerColumnViews,
              ...(isSelectedViewIsUnPin() ? [selectedColumnView] : []),
            ]?.map((viewData, key) => (
              // ** on header view list view item component **
              <ViewItem
                key={`${key}_view_item`}
                total={total}
                viewData={viewData}
                onHandleCloneView={onHandleCloneView}
                onHandleColumnUpdate={onHandleColumnUpdate}
                onHandlePinViewUpdate={onHandlePinViewUpdate}
                onHandleLockViewUpdate={onHandleLockViewUpdate}
                openModalHandler={openModalHandler}
                selectedColumnView={selectedColumnView}
                setSelectedColumnView={setSelectedColumnView}
                modelName={modelName}
              />
            ))}
          </div>
          {/* header views dropdown manage component */}
          <ManageViewsDropDown
            views={columnViewsData}
            openViewModal={openViewModal}
            onHandleUpdateData={onHandleUpdateData}
            setSelectedColumnView={setSelectedColumnView}
          />
        </div>
        <div className="inline-flex">
          {isViewUpdate && (
            <div className="inline-flex items-center relative top-[-2px]">
              <Button
                className="primary__Btn__SD smaller"
                onClick={() => onSave()}
                isDisabled={selectedColumnView.is_locked}
              >
                Save
              </Button>
              <Button
                className="primary__Btn__SD smaller ml-[10px]"
                onClick={() => onSaveAs()}
                isDisabled={selectedColumnView.is_locked}
              >
                Save As
              </Button>
              <Button
                className="primary__Btn__SD smaller ml-[10px]"
                onClick={() => onReset()}
                isDisabled={selectedColumnView.is_locked}
              >
                Reset
              </Button>
            </div>
          )}
          <div className="inline-flex items-center pr-[15px] shrink-0">
            {createPermission && (
              <AuthGuard isAccessible={createPermission}>
                {selectedIds && selectedIds.length ? (
                  <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
                    <button
                      onClick={() => {
                        if (mailMethod) mailMethod();
                      }}
                      className="text-[16px] font-biotif__Medium text-primaryColorSD duration-300 hover:underline ml-[8px]"
                    >
                      Bulk Mail
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </AuthGuard>
            )}
            <AuthGuard isAccessible={deletePermission}>
              {(selectedIds && selectedIds.length) ||
              (dealsView &&
                dealsView === 'list' &&
                selectedIds &&
                selectedIds.length) ? (
                <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative ml-[14px] before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
                  <button
                    onClick={() => {
                      if (deleteMethod) deleteMethod();
                    }}
                    className="text-[16px] font-biotif__Medium text-ip__Red duration-300 hover:underline"
                    disabled={dataLoading}
                  >
                    Delete{' '}
                    {selectedIds.length > 1 ? `${modelName}s` : modelName}
                  </button>
                </div>
              ) : (
                <></>
              )}
            </AuthGuard>
          </div>
        </div>
      </div>
      <div className="bottom__actionBar flex flex-wrap justify-between p-[14px]">
        {isPipeLine ? (
          <div className="inline-flex lg:w-full sm:w-full">
            <CustomDropDown
              options={pipelineOptions || []}
              className="deal__header__ip__Select relative z-[4] w-[255px] mb-[10px] lg:w-full sm:w-full"
              selectedValue={selectedPipeline || ''}
              onChange={(selectedOption) =>
                onChangePipeLine && onChangePipeLine(selectedOption)
              }
            />
            <Icon
              className="filter__btn cursor-pointer p-[12px] bg-formField__BGColor w-[44px] h-[44px] rounded-[6px] duration-500 hover:bg-ip__Grey__hoverDark hidden sm:block sm:ml-[10px]"
              iconType="filterFilled"
            />
          </div>
        ) : (
          <div className="search__bar w-[335px]">
            <div className="ip__form__hasIcon">
              <input
                type="text"
                value={searchValue}
                onChange={onHandleSearch}
                className="ip__input inner__shadow__field small__field"
                placeholder="Search"
                maxLength={50}
                autoComplete="off"
              />
              <div className="i__Icon !opacity-100 !top-[7px]">
                <svg
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.8085 15.385L13.8525 12.4287C14.9078 11.1662 15.5442 9.54212 15.5442 7.77207C15.5442 3.76213 12.2821 0.5 8.27212 0.5C4.26215 0.5 1 3.76213 1 7.77207C1 11.782 4.26215 15.0441 8.27212 15.0441C10.0425 15.0441 11.6666 14.4075 12.9287 13.3524L15.8851 16.3087C16.0126 16.4361 16.1799 16.4999 16.347 16.4999C16.5141 16.4999 16.6814 16.436 16.8087 16.3087C17.0639 16.0536 17.0637 15.6402 16.8085 15.385ZM2.30565 7.77207C2.30565 4.48225 4.9821 1.80584 8.27191 1.80584C11.5618 1.80584 14.2382 4.48228 14.2382 7.77207C14.2382 11.0619 11.5617 13.7383 8.27191 13.7383C4.98207 13.7383 2.30565 11.0619 2.30565 7.77207Z"
                    fill="#737373"
                    stroke="#737373"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}
        <div className="action__btn__wrapper flex items-center">
          <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
            <button
              onClick={() => openModalHandler({ filterBy: true })}
              className="action__btn flex items-center"
            >
              <IconAnimation
                iconType="filterIcon"
                animationIconType={IconTypeJson.Filter}
                textLabel="Filter"
                iconClassName="icon__wrapper w-[24px] h-[24px] relative"
                textLabelClassName="textLabel text-[16px] font-biotif__Medium text-[#737373]"
              />
            </button>
          </div>
          <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
            <button className="action__btn flex items-center">
              <IconAnimation
                iconType="groupIcon"
                animationIconType={IconTypeJson.Group}
                textLabel="Group by"
                iconClassName="icon__wrapper w-[24px] h-[24px] relative"
                textLabelClassName="textLabel text-[16px] font-biotif__Medium text-[#737373]"
              />
            </button>
          </div>
          <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
            <button
              onClick={() => openModalHandler({ sortBy: true })}
              className="action__btn flex items-center"
            >
              <IconAnimation
                iconType="sortIcon"
                animationIconType={IconTypeJson.Sort}
                textLabel="Sort by"
                iconClassName="icon__wrapper w-[24px] h-[24px] relative"
                textLabelClassName="textLabel text-[16px] font-biotif__Medium text-[#737373]"
              />
            </button>
          </div>
          <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
            <button
              onClick={() => openModalHandler({ manageColumn: true })}
              className="action__btn flex items-center"
            >
              <IconAnimation
                iconType="columnIcon"
                animationIconType={IconTypeJson.Column}
                textLabel="Columns"
                iconClassName="icon__wrapper w-[24px] h-[24px] relative"
                textLabelClassName="textLabel text-[16px] font-biotif__Medium text-[#737373]"
              />
            </button>
          </div>
          <div className="action__btn__item inline-flex pr-[14px] mr-[14px] relative before:content-[''] before:absolute before:right-0 before:w-[1px] before:h-[20px] before:bg-[#CCCCCC] last:before:hidden last:pr-0 last:mr-0">
            <Tippy
              className="tippy__dropdown agGrid__spacing__dropdown"
              trigger="click"
              hideOnClick
              theme="light"
              zIndex={4}
              content={
                <>
                  <div
                    onClick={() =>
                      selectedColumnView.spacing?.class !== 'compact' &&
                      updateColumnHeight({ height: 40, class: 'compact' })
                    }
                    className={`${
                      selectedColumnView.spacing?.class === 'compact'
                        ? 'active'
                        : ''
                    } item__row w-full py-[7px] flex items-center border-b-[1px] border-b-whiteScreenBorderColor last:border-b-0 px-[10px]`}
                  >
                    <button className="rowHeight__btn__item w-[22px] h-[22px] rounded-[4px] duration-300 mr-[2px] last:mr-0">
                      <IconAnimation
                        iconType="lineHeight40Icon"
                        animationIconType={IconTypeJson.LineHeight40}
                      />
                    </button>
                  </div>
                  <div
                    onClick={() =>
                      selectedColumnView.spacing?.class !== 'normal' &&
                      updateColumnHeight({ height: 60, class: 'normal' })
                    }
                    className={`${
                      selectedColumnView.spacing?.class === 'normal'
                        ? 'active'
                        : ''
                    } item__row w-full py-[7px] flex items-center border-b-[1px] border-b-whiteScreenBorderColor last:border-b-0 px-[10px]`}
                  >
                    <button className="rowHeight__btn__item w-[22px] h-[22px] rounded-[4px] duration-300 mr-[2px] last:mr-0">
                      <IconAnimation
                        iconType="lineHeight60Icon"
                        animationIconType={IconTypeJson.Spacing}
                      />
                    </button>
                  </div>
                  <div
                    onClick={() =>
                      selectedColumnView.spacing?.class !== 'large' &&
                      updateColumnHeight({ height: 70, class: 'large' })
                    }
                    className={`${
                      selectedColumnView.spacing?.class === 'large'
                        ? 'active'
                        : ''
                    } item__row w-full py-[7px] flex items-center border-b-[1px] border-b-whiteScreenBorderColor last:border-b-0 px-[10px]`}
                  >
                    <button className="rowHeight__btn__item w-[22px] h-[22px] rounded-[4px] duration-300 mr-[2px] last:mr-0">
                      <IconAnimation
                        iconType="lineHeight70Icon"
                        animationIconType={IconTypeJson.LineHeight70}
                      />
                    </button>
                  </div>
                </>
              }
              placement="bottom-start"
            >
              <button
                ref={(ref) => {
                  if (!ref) return;
                  ref.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  };
                }}
                className={`${'action__btn flex items-center '}`}
              >
                <IconAnimation
                  iconType="lineHeight60Icon"
                  animationIconType={IconTypeJson.Spacing}
                  textLabel="Spacing"
                  iconClassName="icon__wrapper w-[24px] h-[24px] relative"
                  textLabelClassName="textLabel text-[16px] font-biotif__Medium text-[#737373]"
                />
              </button>
            </Tippy>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ViewList;
