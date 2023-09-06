import Button from 'components/Button';
import { ModuleWiseColumnOptionDropdown } from 'components/ColumnManageModal';
import {
  columnViewInterface,
  columnsDataInterface,
} from 'components/ColumnViewListDropDown';
import Icon from 'components/Icon';
import { ModuleNames } from 'constant/permissions.constant';
import _ from 'lodash';
import React, { useState } from 'react';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';
import { debounce } from 'utils/util';

interface PropsInterface {
  SelectedColumnData: columnViewInterface;
  closeModal: () => void;
  apiColumnsData: columnsDataInterface[];
  onHandleSaveData: (data: columnsDataInterface[]) => void;
}

const initialColumnDropdownState = {
  [ModuleNames.LEAD]: false,
  [ModuleNames.DEAL]: false,
  [ModuleNames.ACCOUNT]: false,
  [ModuleNames.CONTACT]: false,
  [ModuleNames.ACTIVITY]: false,
  [ModuleNames.EMAIL]: false,
};

const ManageColumnModal = ({
  SelectedColumnData,
  closeModal,
  apiColumnsData,
  onHandleSaveData,
}: PropsInterface) => {
  const [groupByColumnsData, setGroupByColumnData] = useState<
    Record<string, columnsDataInterface[]>
  >(_.groupBy(apiColumnsData, 'relational_model'));

  const [columnDropdownState, setColumnDropdownState] = useState<{
    [value in ModuleNames]?: boolean;
  }>(initialColumnDropdownState);

  const [SelectedColumnViewData, setSelectedColumnViewData] =
    useState<columnViewInterface>(SelectedColumnData);

  const isColumnSelected = (name: string) =>
    !!SelectedColumnViewData?.columns.find(
      (value) => value.displayName === name
    );

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

    setGroupByColumnData(_.groupBy(searchOutput, 'relational_model'));
  };

  const updateColumn = (column: columnsDataInterface) => {
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

  const onDragDropEnd = (result: DropResult) => {
    if (!result.destination) return;

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
  return (
    <div className="ip__Modal__Wrapper ip__Modal__Wrapper__new column__option__modal">
      <div className="ip__Modal__Overlay" />
      <div className="ip__Modal__ContentWrap w-[700px] max-w-[calc(100%_-_30px)]">
        <div className="ip__Modal__Header">
          <h3 className="title">Manage Column</h3>
          <Icon iconType="closeBtnFilled" onClick={() => closeModal()} />
        </div>
        <div className="ip__Modal__Body ip__FancyScroll relative">
          <div className="columns__options">
            <div className="flex">
              <div className="checkbox__wrapper w-1/2 pr-[20px] !pt-0">
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
                {Object.keys(groupByColumnsData)?.length ? (
                  Object.keys(groupByColumnsData)
                    ?.sort()
                    ?.map((key, index) => {
                      return (
                        <ModuleWiseColumnOptionDropdown
                          key={`ModuleWiseColumnOptionDropdown_${index}`}
                          columnsData={groupByColumnsData?.[key as string]}
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
                      className="image block w-[250px] max-w-full mx-auto"
                      src="/images/no-data-image.png"
                      alt="NO DATA FOUND"
                    />
                    <h2 className="title">No Result Found</h2>
                    <p className="text text-center">
                      We couldn't find what you searched for, <br />
                      try searching again.
                    </p>
                  </div>
                )}
              </div>
              <div className="columns__selection w-1/2 pl-[20px]">
                <h3 className="text-[15px] font-biotif__Medium text-black mb-[6px]">
                  Columns Selection
                </h3>
                <DragDropContext onDragEnd={onDragDropEnd}>
                  <Droppable droppableId="droppable">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {React.Children.toArray(
                          SelectedColumnViewData?.columns?.map(
                            (item: columnsDataInterface, index: number) => {
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
                                          onClick={() => updateColumn(item)}
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
            onClick={() => onHandleSaveData(SelectedColumnViewData.columns)}
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

export default ManageColumnModal;
