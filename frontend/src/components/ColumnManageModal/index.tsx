// ** Import Packages **
import _ from 'lodash';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';

// ** Components **
import Button from 'components/Button';
import {
  columnViewInterface,
  columnsDataInterface,
} from 'components/ColumnViewListDropDown';
import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';
import SiteLoader from 'components/loader/SiteLoader';
import FilterSection from './components/FilterSection';
import SortSection from './components/SortSection';
import DiscardActivityModal from 'pages/Activity/components/Modal/DiscardActivityModal';

// ** Redux **
import {
  getEntityTableView,
  setEntityTableView,
} from 'redux/slices/commonSlice';

// ** API **
import {
  useAddColumnViewMutation,
  useDeleteColumnViewMutation,
  useLazyGetAllColumnQuery,
  useLazyGetAllColumnViewAPIQuery,
  useUpdateColumnViewMutation,
} from 'redux/api/columnApi';
import ViewList from './components/ViewList';
import { useDispatch, useSelector } from 'react-redux';
import DeleteModal from 'components/DeleteComponents/DeleteModal';

// ** Types **
import {
  FiltersDataInterface,
  selectOptionsInterface,
  sortDataInterface,
} from './types/column.types';

// ** Util **
import { debounce } from 'utils/util';

// ** Constant **
import { IS_CACHING_ACTIVE } from 'constant';
import {
  ModuleNames,
  initialColumnDropdownState,
} from 'constant/permissions.constant';

interface Props {
  modelName: string;
  collectionName: string;
  closeModal: () => void;
  editColumnViewID: number;
  saveAsViewData?: columnViewInterface;
  isSaveAsAction?: boolean;
}

const sortInitData = {
  column: undefined,
  type: 'asc',
};

const ColumnManageModal = (props: Props) => {
  const {
    modelName,
    collectionName,
    closeModal,
    editColumnViewID,
    saveAsViewData,
    isSaveAsAction,
  } = props;

  // ** Hooks ** //
  const dispatch = useDispatch();
  const entitiesTableView = useSelector(getEntityTableView);

  const columInitData: columnViewInterface =
    isSaveAsAction && saveAsViewData
      ? { ...saveAsViewData, id: -1, name: '' }
      : {
          id: -1,
          model_name: modelName,
          name: '',
          organization_id: -1,
          is_system: false,
          is_locked: false,
          filter: {},
          columns: [],
          sort: [sortInitData],
          visibility: 'public',
        };
  // ** State **
  const [columnViewsData, setColumnViewData] = useState<columnViewInterface[]>(
    []
  );
  const [columnDropdownState, setColumnDropdownState] = useState<{
    [value in ModuleNames]?: boolean;
  }>(initialColumnDropdownState);
  const [groupByColumnsData, setGroupByColumnData] = useState<
    Record<string, columnsDataInterface[]>
  >({});
  const [columnsOptionData, setColumnsOptionsData] = useState<
    selectOptionsInterface[]
  >([]);
  const [apiColumnsData, setApiColumnsData] = useState<columnsDataInterface[]>(
    []
  );
  const [SelectedColumnViewData, setSelectedColumnViewData] =
    useState<columnViewInterface>(columInitData);

  const [isPinRef, setIsPinRef] = useState(false);

  const [filtersData, setFiltersData] = useState<FiltersDataInterface>({});
  const [sortsData, setSortsData] = useState<sortDataInterface[]>([
    sortInitData,
  ]);

  const [openModal, setOpenModal] = useState({
    delete: false,
  });
  const [errors, setError] = useState<string>();
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const inputElement = useRef<HTMLInputElement>(null);

  // ** Apis **
  const [getAllColumnViewAPI, { isLoading: isColumViewLoading }] =
    useLazyGetAllColumnViewAPIQuery();
  const [getAllColumnAPI, { isLoading: isAllColumLoading }] =
    useLazyGetAllColumnQuery();
  const [addColumnViewAPI, { isLoading: isAddColumnLoading }] =
    useAddColumnViewMutation();
  const [updateColumnViewAPI, { isLoading: isUpdateColumnLoading }] =
    useUpdateColumnViewMutation();
  const [deleteColumnViewAPI, { isLoading: isDeleteColumnLoading }] =
    useDeleteColumnViewMutation();

  const isLoading = isColumViewLoading || isAllColumLoading;

  // ** useEffect **
  useEffect(() => {
    getAllColumnView();
    getAllColumn();
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  const getAllColumnView = async () => {
    const { data, error } = await getAllColumnViewAPI({
      data: {
        query: {
          'q[model_name]': modelName,
          sort: 'name',
          'p[page]': 1,
          'u[page]': 1,
          page: 1,
          'p[limit]': 1000,
          'u[limit]': 1000,
          limit: 1000,
        },
      },
    });
    if (data && !error) {
      setColumnViewData(data?.views);
      if (editColumnViewID > -1) {
        const viewData = data?.views?.find(
          (view: columnViewInterface) => view?.id === editColumnViewID
        );
        setSelectedColumnViewData(viewData || columInitData);
        if (viewData?.view_users) {
          setIsPinRef(viewData?.view_users[0]?.is_pin);
        }
        if (inputElement.current) {
          inputElement.current.focus();
        }
      }
    }
  };

  const getAllColumn = async () => {
    const { data, error } = await getAllColumnAPI(
      { collectionName, type: modelName === 'Deal' },
      IS_CACHING_ACTIVE
    );
    if (data && !error) {
      setGroupByColumnData(_.groupBy(data, 'relational_model'));
      setColumnsOptionsData(
        data.map((column: columnsDataInterface) => {
          return {
            label: column.displayName,
            value: column.fieldName,
            type: column.type,
            model: column.relational_model,
          };
        })
      );
      const columnData = data.filter(
        (column: columnsDataInterface) => column.default
      );
      if (!isSaveAsAction)
        setSelectedColumnViewData({
          ...SelectedColumnViewData,
          columns: columnData?.map(
            (column: columnsDataInterface, index: number) => {
              return {
                ...column,
                order: index + 1,
              };
            }
          ),
        });
      setApiColumnsData(data);
    }
  };

  const isColumnSelected = (name: string) =>
    !!SelectedColumnViewData?.columns.find(
      (value) => value.displayName === name
    );

  const updateColumn = (column: columnsDataInterface) => {
    setIsDirty(true);
    if (column?.default) return;
    if (
      SelectedColumnViewData?.columns.find(
        (value) => value.displayName === column?.displayName
      )
    ) {
      const columns = SelectedColumnViewData?.columns?.filter(
        (item) => item?.displayName !== column?.displayName
      );
      columns.sort((col1, col2) => {
        return col1.order - col2.order;
      });
      setSelectedColumnViewData({
        ...SelectedColumnViewData,
        columns,
      });
    } else {
      setSelectedColumnViewData({
        ...SelectedColumnViewData,
        columns: [
          ...SelectedColumnViewData.columns,
          {
            ...column,
            order: Number(SelectedColumnViewData?.columns?.length) + 1,
          },
        ],
      });
    }
  };

  const onHandleChangeColumnView = (item: columnViewInterface) => {
    if (item?.view_users) {
      setIsPinRef(item?.view_users[0]?.is_pin);
    }
    setSelectedColumnViewData(item);

    setFiltersData(item?.filter || {});

    setSortsData(item?.sort?.length ? item?.sort : [sortInitData]);
  };

  const onHandleViewNameChange = (name: string) => {
    setIsDirty(true);
    if (errors?.length) setError('');
    setSelectedColumnViewData({
      ...SelectedColumnViewData,
      name,
    });
  };

  const onHandleSaveData = async (isCloseModal: boolean) => {
    if (!SelectedColumnViewData?.name) {
      if (inputElement.current) {
        inputElement.current.focus();
      }
      setError('Name is required');
      return;
    }
    setIsDirty(false);
    const bodyData = {
      name: SelectedColumnViewData?.name,
      model_name: SelectedColumnViewData?.model_name,
      columns: SelectedColumnViewData?.columns,
      filter: filtersData || {},
      sort: sortsData?.filter((item) => item?.column !== null) || [],
      is_pin: SelectedColumnViewData?.is_system === true ? true : isPinRef,
      visibility: SelectedColumnViewData.visibility,
      is_locked: SelectedColumnViewData.is_locked,
      toast: true,
    };
    if (SelectedColumnViewData?.id > -1) {
      const data = await updateColumnViewAPI({
        id: SelectedColumnViewData?.id,
        data: bodyData,
      });
      if ('data' in data && !('error' in data)) {
        setColumnViewData(
          columnViewsData?.map((item: columnViewInterface) => {
            if (item?.id === SelectedColumnViewData?.id) {
              setSelectedColumnViewData(data.data);
              return data.data;
            }
            return item;
          })
        );
        if (isCloseModal) {
          closeModal();
        }
      }
    } else {
      const data = await addColumnViewAPI({ data: bodyData });
      if ('data' in data && !('error' in data)) {
        setSelectedColumnViewData(data?.data);
        dispatch(
          setEntityTableView({
            viewState: {
              [modelName]: data?.data,
            },
          })
        );
        if (isCloseModal) {
          closeModal();
        } else {
          setFiltersData(data?.data?.filter || {});
          setColumnViewData([...columnViewsData, data?.data]);
        }
      }
    }
  };

  const onHandleCancelData = async () => {
    if (isDirty) setOpenDiscardModal(true);
    else {
      const selectedData = columnViewsData?.find(
        (item: columnViewInterface) => item?.id === SelectedColumnViewData?.id
      );
      setSelectedColumnViewData(selectedData || SelectedColumnViewData);
      setFiltersData(selectedData?.filter || {});
      closeModal();
    }
  };

  const onHandleDeleteData = async () => {
    const data = await deleteColumnViewAPI({
      id: SelectedColumnViewData?.id,
    });
    if (!('error' in data)) {
      const columnData = apiColumnsData.filter(
        (column: columnsDataInterface) => column.default
      );

      // delete stored view from redux
      if (entitiesTableView?.[modelName]?.id === SelectedColumnViewData?.id) {
        const updatedState = _.cloneDeep(entitiesTableView);
        delete updatedState?.[modelName];

        dispatch(
          setEntityTableView({
            viewState: updatedState,
            isReplace: true,
          })
        );
      }

      setSelectedColumnViewData({
        ...columInitData,
        columns: columnData?.map(
          (column: columnsDataInterface, index: number) => {
            return {
              ...column,
              order: index + 1,
            };
          }
        ),
      });
      setColumnViewData(
        columnViewsData?.filter(
          (item: columnViewInterface) => item?.id !== SelectedColumnViewData?.id
        )
      );
      setOpenModal({ delete: false });
    }
  };

  const onDragDropEnd = (result: DropResult) => {
    if (!result.destination) return;
    setIsDirty(true);
    const newColumns = Array.from(SelectedColumnViewData?.columns);
    const [reorderedItem] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result.destination.index, 0, reorderedItem);

    setSelectedColumnViewData({
      ...SelectedColumnViewData,
      columns: newColumns.map((column, index) => {
        return {
          ...column,
          order: index + 1,
        };
      }),
    });
  };

  const onHandleClearSelectedData = () => {
    setFiltersData({});
    const columnData = apiColumnsData.filter(
      (column: columnsDataInterface) => column.default
    );
    setSelectedColumnViewData({
      ...columInitData,
      columns: columnData?.map(
        (column: columnsDataInterface, index: number) => {
          return {
            ...column,
            order: index + 1,
          };
        }
      ),
    });
    if (inputElement.current) {
      inputElement.current.focus();
    }
    setIsPinRef(false);
  };

  const onHandleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedSearchText = e?.target?.value?.trim()?.toLocaleLowerCase();
    let searchOutput: columnsDataInterface[] = [];
    if (e?.target?.value === '') {
      searchOutput = apiColumnsData;
      setColumnDropdownState({ ...initialColumnDropdownState });
    } else {
      searchOutput = apiColumnsData?.slice()?.filter((col) => {
        const columnDisplayName = col?.displayName?.toLowerCase();
        const formattedColumnDisplayName = columnDisplayName?.replaceAll(
          ' ',
          ''
        );
        return (
          columnDisplayName?.includes(formattedSearchText) ||
          formattedColumnDisplayName?.includes(formattedSearchText) ||
          formattedSearchText?.includes(columnDisplayName)
        );
      });

      setColumnDropdownState({
        ...initialColumnDropdownState,
        ...searchOutput.reduce((accumulator: any, element: any) => {
          const item = element?.relational_model;
          accumulator[item] = true;
          return accumulator;
        }, {}),
      });
    }

    setGroupByColumnData(
      _.groupBy(searchOutput, 'relational_model') as unknown as Record<
        string,
        columnsDataInterface[]
      >
    );
  };

  const onHandleChangeView = (value: 'public' | 'private') => {
    setSelectedColumnViewData({
      ...SelectedColumnViewData,
      visibility: value,
    });
    setIsDirty(true);
  };

  const onHandleChangePin = (value: boolean) => setIsPinRef(value);

  return (
    <>
      {isLoading ? (
        <SiteLoader />
      ) : (
        <div className="ip__Modal__Wrapper ip__Modal__Wrapper__new manage__column__modal manage__column__modal__new">
          <div className="ip__Modal__Overlay" />
          <div className="ip__Modal__ContentWrap w-[1373px] max-w-[calc(100%_-_30px)]">
            <div className="ip__Modal__Header">
              <h3 className="title">Manage Columns</h3>
              <div onClick={() => onHandleCancelData()}>
                <Icon
                  iconType="closeBtnFilled"
                  onClick={() => onHandleCancelData()}
                />
              </div>
            </div>
            <div className="ip__Modal__Body ip__FancyScroll relative !p-[25px] flex flex-wrap">
              <ViewList
                columnViewsData={columnViewsData}
                setColumnViewData={setColumnViewData}
                SelectedColumnViewData={SelectedColumnViewData}
                onHandleChangeColumnView={onHandleChangeColumnView}
                onHandleClearSelectedData={onHandleClearSelectedData}
              />
              <div className="right__wrapper w-[calc(100%_-_251px)] flex flex-wrap">
                <div className="second__column w-[576px] border-r-[1px] border-r-[#F1F1F1] pt-[20px]">
                  <div className="second__column__header px-[20px]">
                    <div className="border-b-[1px] border-b-[#F1F1F1] flex flex-wrap justify-between mb-[14px] pb-[14px]">
                      <div className="name__wrapper w-[calc(50%_-_8px)]">
                        <label className="w-full block text-[16px] font-biotif__Medium text-[#2E3234] mb-[3px]">
                          Name
                        </label>
                        <div className="form__Group mb-0">
                          <div>
                            <input
                              ref={inputElement}
                              className="ip__input rounded-[8px] py-[6px]"
                              placeholder="Enter name"
                              value={SelectedColumnViewData?.name || ''}
                              autoComplete='off'
                              type="text"
                              onChange={(e) =>
                                onHandleViewNameChange(e?.target?.value)
                              }
                            />
                          </div>
                        </div>
                        {errors && <p className="ip__Error">{errors}</p>}
                      </div>
                      {SelectedColumnViewData?.is_system === false && (
                        <div className="name__wrapper w-[calc(50%_-_8px)]">
                          <label className="w-full block text-[16px] font-biotif__Medium text-[#2E3234] mb-[3px]">
                            View set as
                          </label>
                          <div className="radio__btns__wrapper flex items-center pt-[8px]">
                            <div className="custom__radio__wrapper w-[calc(100%_-_8px)]">
                              <div className="ip__Radio">
                                <input
                                  type="radio"
                                  name="view"
                                  value="private"
                                  checked={
                                    SelectedColumnViewData?.visibility ===
                                    'private'
                                  }
                                  onChange={() => onHandleChangeView('private')}
                                />
                                <label className="rc__Label !text-ipBlack__textColor">
                                  Private
                                </label>
                              </div>
                            </div>
                            <div className="custom__radio__wrapper w-[calc(100%_-_8px)]">
                              <div className="ip__Radio">
                                <input
                                  type="radio"
                                  name="view"
                                  value="public"
                                  checked={
                                    SelectedColumnViewData?.visibility ===
                                    'public'
                                  }
                                  onChange={() => onHandleChangeView('public')}
                                  autoComplete="off"
                                />
                                <label className="rc__Label !text-ipBlack__textColor">
                                  Public
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap px-[20px] h-[calc(100dvh_-_370px)] overflow-y-auto ip__FancyScroll pb-[10px]">
                    <div className="columns__options w-1/2 pr-[30px]">
                      <h3 className="text-[15px] font-biotif__Medium text-black mb-[6px]">
                        Columns Options
                      </h3>
                      <div className="form__Group mb-[10px]">
                        <div className="ip__form__hasIcon">
                          <input
                            className="ip__input py-[4px] rounded-[8px]"
                            type="text"
                            name="search"
                            onChange={debounce(onHandleSearchChange, 500)}
                            autoComplete='off'
                          />
                          <Icon
                            className="grayscale !top-[5px]"
                            iconType="searchStrokeIcon"
                          />
                        </div>
                      </div>
                      <div className="checkbox__wrapper">
                        {Object.keys(groupByColumnsData)?.length ? (
                          Object.keys(groupByColumnsData)
                            ?.sort()
                            ?.map((key, index) => {
                              return (
                                <ModuleWiseColumnOptionDropdown
                                  key={`ModuleWiseColumnOptionDropdown_${index}`}
                                  columnsData={
                                    groupByColumnsData?.[key as string]
                                  }
                                  modelName={key as ModuleNames}
                                  {...{
                                    isColumnSelected,
                                    updateColumn,
                                    columnDropdownState,
                                    setColumnDropdownState,
                                  }}
                                />
                              );
                            })
                        ) : (
                          <div className="no__data__wrapper">
                            <img
                              className="image"
                              src="/images/no-data-image.png"
                              alt="NO DATA FOUND"
                            />
                            <h2 className="title">No Result Found</h2>
                            <p className="text">
                              We couldn't find what you searched for, <br />
                              try searching again.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="columns__selection w-1/2 pl-[30px]">
                      <h3 className="text-[15px] font-biotif__Medium text-black mb-[6px]">
                        Columns Selection
                      </h3>
                      <DragDropContext onDragEnd={onDragDropEnd}>
                        <Droppable droppableId="droppable">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {React.Children.toArray(
                                SelectedColumnViewData?.columns?.map(
                                  (
                                    item: columnsDataInterface,
                                    index: number
                                  ) => {
                                    return (
                                      <Draggable
                                        key={index.toString()}
                                        draggableId={index.toString()}
                                        index={index}
                                      >
                                        {(DProvided) => (
                                          <div
                                            key={index}
                                            ref={DProvided.innerRef}
                                            {...DProvided.draggableProps}
                                            {...DProvided.dragHandleProps}
                                            className="columns__selection__box flex items-center rounded-[7px] py-[6px] px-[12px] pr-[5px] bg-white border-[1px] border-[#CCCCCC]/70 mb-[10px] last:mb-0"
                                          >
                                            <div className="drag__icon w-[12px] h-auto flex flex-wrap shrink-0">
                                              <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                                              <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                                              <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                                              <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                                              <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px]" />
                                              <div className="w-[4px] h-[4px] rounded-full bg-black/50" />
                                            </div>
                                            <p className="text-[14px] font-biotif__Medium text-black w-full pl-[10px] pr-[10px]">
                                              {item?.displayName}
                                            </p>
                                            {!item?.default && (
                                              <div
                                                onClick={() =>
                                                  updateColumn(item)
                                                }
                                                className="relative cursor-pointer w-[26px] h-[26px] shrink-0 duration-300 rounded-full before:content-[''] before:w-[11px] before:h-[1px] before:bg-black/50 before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:rotate-45 after:content-[''] after:w-[11px] after:h-[1px] after:bg-black/50 after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:-rotate-45 hover:bg-[#f0f0f0]"
                                              />
                                            )}
                                          </div>
                                        )}
                                      </Draggable>
                                    );
                                  }
                                )
                              )}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>
                  </div>
                </div>
                <div className="filters__column h-[calc(100dvh_-_232px)] overflow-y-auto ip__FancyScroll px-[20px] w-[545px] py-[20px]">
                  <FilterSection
                    columOptions={columnsOptionData}
                    filtersData={filtersData}
                    setFiltersData={setFiltersData}
                    setIsDirty={setIsDirty}
                  />
                  <div className="w-full h-[1px] bg-whiteScreenBorderColor my-[15px]" />
                  <SortSection
                    columOptions={columnsOptionData}
                    sortsData={sortsData}
                    apiColumnsData={apiColumnsData}
                    setSortsData={setSortsData}
                    setIsDirty={setIsDirty}
                  />
                </div>
                <div className="ip__Modal__Footer w-full">
                  <div className="ip__Checkbox">
                    {SelectedColumnViewData?.is_system === false && (
                      <>
                        <input
                          type="checkbox"
                          name="is_pin"
                          checked={isPinRef}
                          onChange={() => {
                            onHandleChangePin(!isPinRef);
                            setIsDirty(true);
                          }}
                        />
                        <label className="rc__Label">Pin the view</label>
                      </>
                    )}
                  </div>
                  <div className="inline-flex">
                    {SelectedColumnViewData?.is_system === false &&
                      SelectedColumnViewData.id !== -1 && (
                        <Button
                          className="bg-transparent w-[80px] rounded-[6px] text-[14px] font-biotif__SemiBold text-[#7467B7] py-[9px] px-[16px] !mr-[12px] hover:bg-[#f2f2f2]"
                          onClick={() => setOpenModal({ delete: true })}
                        >
                          Delete
                        </Button>
                      )}
                    <Button
                      className="bg-transparent w-[80px] rounded-[6px] text-[14px] font-biotif__SemiBold text-[#7467B7] py-[9px] px-[16px] border-[1px] border-[#7467B7] !mr-[12px] hover:bg-[#7467B7] hover:text-white"
                      onClick={onHandleCancelData}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-[#7467B7] w-[80px] rounded-[6px] text-[14px] font-biotif__SemiBold text-white py-[9px] px-[16px] hover:bg-[#6054A0]"
                      onClick={() => onHandleSaveData(false)}
                      isLoading={isAddColumnLoading || isUpdateColumnLoading}
                      isDisabled={isAddColumnLoading || isUpdateColumnLoading}
                    >
                      {SelectedColumnViewData?.id > -1 ? 'Update' : 'Save'}
                    </Button>
                    <Dropdown
                      className="tippy__dropdown"
                      placement="top-end"
                      zIndex={10}
                      content={() => (
                        <div>
                          <div
                            className="min-w-[148px] cursor-pointer text-[14px] font-biotif__SemiBold !text-primaryColor bg-ipWhite__bgColor rounded-[6px] shadow-[0px_0px_2px_#00000040] py-[12px] px-[15px] mb-[6px] hover:bg-primaryColor hover:!text-[#ffffff]"
                            onClick={() => {
                              onHandleSaveData(true);
                            }}
                          >
                            {SelectedColumnViewData?.id > -1
                              ? 'Update'
                              : 'Save'}{' '}
                            and Close
                          </div>
                        </div>
                      )}
                    >
                      <button
                        type="button"
                        className="primary__Btn !bg-[#7467B7] !rounded-[7px] relative w-[36px] h-[34px] p-0 sm:w-[36px] sm:h-[36px]"
                      >
                        <span className="absolute top-[calc(50%_-_2px)] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[9px] h-[9px] border-l-[2px] border-l-[#ffffff] border-b-[2px] border-b-[#ffffff] rotate-[-45deg]" />
                      </button>
                    </Dropdown>
                  </div>
                </div>
              </div>
              <FilterSection
                columOptions={columnsOptionData}
                filtersData={filtersData}
                setFiltersData={setFiltersData}
                setIsDirty={setIsDirty}
              />
            </div>
            <div className="ip__Modal__Footer border-none !hidden">
              <div className="ip__Checkbox">
                <input
                  type="checkbox"
                  name="is_pin"
                  checked={isPinRef}
                  onChange={() => {
                    onHandleChangePin(!isPinRef);
                    setIsDirty(true);
                  }}
                />
                <label className="rc__Label">Pin the view</label>
              </div>
              <Button
                onClick={onHandleCancelData}
                className="bg-[#D9D9D9] w-[80px] rounded-[6px] text-[14px] font-biotif__SemiBold text-[#2E3234] py-[9px] px-[16px] !mr-[12px] hover:bg-black hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={() => onHandleSaveData(false)}
                className="bg-[#7467B7] w-[80px] rounded-[6px] text-[14px] font-biotif__SemiBold text-white py-[9px] px-[16px] !mr-[12px] hover:bg-[#6054A0]"
                isLoading={isAddColumnLoading || isUpdateColumnLoading}
                isDisabled={isAddColumnLoading || isUpdateColumnLoading}
              >
                {SelectedColumnViewData?.id > -1 ? 'Update' : 'Save'}
              </Button>
              <Dropdown
                className="tippy__dropdown"
                placement="bottom-start"
                zIndex={10}
                content={() => (
                  <div>
                    <div
                      className="min-w-[148px] cursor-pointer text-[14px] font-biotif__SemiBold !text-primaryColor bg-ipWhite__bgColor rounded-[6px] shadow-[0px_0px_2px_#00000040] py-[12px] px-[15px] mb-[6px] hover:bg-primaryColor hover:!text-[#ffffff]"
                      onClick={() => {
                        onHandleSaveData(true);
                      }}
                    >
                      {SelectedColumnViewData?.id > -1 ? 'Update' : 'Save'} and
                      Close
                    </div>
                  </div>
                )}
              >
                <button
                  type="button"
                  className="i__Button primary__Btn relative w-[42px] h-[42px] p-0 sm:w-[36px] sm:h-[36px]"
                >
                  <span className="absolute top-[calc(50%_-_2px)] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[9px] h-[9px] border-l-[2px] border-l-[#ffffff] border-b-[2px] border-b-[#ffffff] rotate-[-45deg]" />
                </button>
              </Dropdown>
              {SelectedColumnViewData?.is_system === false && (
                <Icon
                  onClick={() => setOpenModal({ delete: true })}
                  className="delete__btn w-[32px] h-[32px] p-[7px] cursor-pointer bg-ipRed__transparentBG rounded-[6px] duration-300 hover:bg-ip__Red"
                  iconType="deleteFilled"
                />
              )}
            </div>
          </div>
          {openModal.delete && (
            <DeleteModal
              closeModal={() => setOpenModal({ delete: false })}
              isOpen={openModal.delete}
              isLoading={isDeleteColumnLoading}
              deleteOnSubmit={() => onHandleDeleteData()}
              moduleName="this View"
            />
          )}
          {openDiscardModal ? (
            <DiscardActivityModal
              discardActivity={closeModal}
              isOpen={openDiscardModal}
              closeModal={() => setOpenDiscardModal(false)}
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};

export default ColumnManageModal;

export const ModuleWiseColumnOptionDropdown = (props: {
  columnsData: columnsDataInterface[];
  modelName: ModuleNames;
  isColumnSelected: (name: string) => boolean;
  updateColumn: (column: columnsDataInterface) => void;
  columnDropdownState: { [value in ModuleNames]?: boolean };
  setColumnDropdownState: Dispatch<
    SetStateAction<{
      [value in ModuleNames]?: boolean;
    }>
  >;
}) => {
  const {
    columnsData,
    modelName,
    isColumnSelected,
    updateColumn,
    columnDropdownState,
    setColumnDropdownState,
  } = props;

  const alias = (val: string) => {
    switch (val) {
      case ModuleNames.LEAD:
        return 'Lead';
      case ModuleNames.DEAL:
        return 'Deal';
      case ModuleNames.ACCOUNT:
        return 'Account';
      case ModuleNames.CONTACT:
        return 'Contacts';
      case ModuleNames.ACTIVITY:
        return 'Activity';
      case ModuleNames.EMAIL:
        return 'Email';
      default:
        return 'Other';
    }
  };
  const sortedData = () => {
    return columnsData?.slice()?.sort((a, b) => {
      return a.displayName.localeCompare(b.displayName);
    });
  };
  return (
    <div key={`${modelName}_div`}>
      <div
        className={`w-full cursor-pointer duration-300 rounded-[7px] text-[16px] font-biotif__Medium text-primaryColorSD py-[9px] px-[13px] whitespace-pre overflow-hidden text-ellipsis relative before:absolute before:top-[calc(50%_-_1px)] before:translate-y-[-50%] before:right-[13px] before:rotate-[-45deg] inline-block before:w-[8px] before:h-[8px] before:border-l-[2px]  before:border-l-primaryColorSD before:border-b-[2px] before:border-b-primaryColorSD hover:bg-btnGrayColor ${
          columnDropdownState?.[modelName]
            ? 'bg-primaryColorSD before:!rotate-[-225deg] before:!top-[50%_+_1px] before:!border-l-[#ffffff] before:!border-b-[#ffffff] !text-[#ffffff] hover:bg-primaryColorSD hover:before:!border-l-[#ffffff] hover:before:!border-b-[#ffffff] hover:!text-[#ffffff]'
            : ''
        }`}
        onClick={() => {
          setColumnDropdownState((prev) => ({
            ...initialColumnDropdownState,
            [modelName]: !prev?.[modelName],
          }));
        }}
      >
        {alias(modelName)}
      </div>
      {columnDropdownState?.[modelName] ? (
        <div className="checkbox__wrapper">
          {sortedData()?.map((item, index) => {
            return (
              <div className="ip__Checkbox" key={item?.displayName}>
                <input
                  className="ip__input rounded-[8px] py-[8]"
                  name={`${item?.displayName}-${index}`}
                  checked={isColumnSelected(item?.displayName)}
                  type="checkbox"
                  onChange={() => updateColumn(item)}
                />
                <label className="rc__Label inline-block !w-auto !max-w-full">
                  {item?.displayName}
                </label>
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
