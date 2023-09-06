// ** Import Packages **
import React, { ChangeEvent, useState } from 'react';

// ** Components **
import Icon from 'components/Icon';
import _ from 'lodash';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from 'react-beautiful-dnd';

// ** types ** //
import { StreamManageModelType } from 'pages/Streams/types/stream.type';
import { debounce } from 'utils/util';

const StreamManageModel = (props: StreamManageModelType) => {
  const { streamData, setStreamData, isNewList, close } = props;
  const [SelectedColumnViewData, setSelectedColumnViewData] = useState<any>({
    columns: streamData,
  });
  const [noData, setNoData] = useState<boolean>(false);

  const onDragDropEnd = (result: DropResult) => {
    if (!result.destination) {
      return null;
    }
    isNewList(true);

    const newColumns = _.cloneDeep(SelectedColumnViewData?.columns);
    const [removed] = newColumns.splice(result.source.index, 1);
    newColumns.splice(result?.destination?.index || 0, 0, removed);

    const ids = newColumns.map((item: any) => item.id);

    const cloneStreamData = _.cloneDeep(streamData).map((item: any) =>
      ids.includes(item.id) ? null : item
    );

    let i = 0;
    const sortedStreamData = cloneStreamData.map((item: any) => {
      if (item === null) {
        const orderedStream = newColumns[i];
        i++;
        return orderedStream;
      }
      return item;
    });

    setStreamData(sortedStreamData);

    setSelectedColumnViewData({
      ...SelectedColumnViewData,
      columns: newColumns.map((column: any) => {
        return {
          ...column,
          order: column.id + 1,
        };
      }),
    });
  };

  // function
  const searchUser = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      if (SelectedColumnViewData?.columns) {
        const searchText = e.target.value;
        const results = streamData?.filter((item: any) => {
          const propertyToSearch = item.name;
          const searchTermLower = searchText?.toLowerCase();
          return propertyToSearch?.toLowerCase().includes(searchTermLower);
        });

        if (results?.length > 0) {
          setNoData(false);
          setSelectedColumnViewData({
            ...SelectedColumnViewData,
            columns: results.map((column: any, index: number) => {
              return {
                ...column,
                order: index + 1,
              };
            }),
          });
        } else {
          setNoData(true);
        }
      }
    } else {
      setNoData(false);
      setSelectedColumnViewData({
        ...SelectedColumnViewData,
        columns: streamData,
      });
    }
  };

  return (
    <>
      <div className="flex items-center">
        <h3 className="text-[14px] font-biotif__Medium text-darkTextColorSD w-full whitespace-pre overflow-hidden text-ellipsis">
          Stream View
        </h3>
        <div
          onClick={() => close()}
          className="relative shrink-0 cursor-pointer w-[26px] h-[26px] duration-300 rounded-full before:content-[''] before:w-[12px] before:h-[1px] before:bg-darkTextColorSD before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:rotate-45 after:content-[''] after:w-[12px] after:h-[1px] after:bg-darkTextColorSD after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:-rotate-45 hover:bg-btnGrayColor"
        />
      </div>
      <div className="ip__form__hasIcon search__box mt-[8px] mb-[11px]">
        <input
          className="ip__input"
          placeholder="Search"
          type="search"
          onChange={debounce(searchUser)}
        />
        <Icon className="grayscale" iconType="searchStrokeIcon" />
      </div>
      {noData ? (
        <>
          <h3 className="text-[14px] font-biotif__Medium text-darkTextColorSD w-full whitespace-pre overflow-hidden text-ellipsis">
            No Data Found
          </h3>
        </>
      ) : (
        <>
          <DragDropContext onDragEnd={onDragDropEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {React.Children.toArray(
                    SelectedColumnViewData?.columns?.map(
                      (item: any, index: number) => {
                        return (
                          <Draggable
                            key={item.toString()}
                            draggableId={index.toString()}
                            index={index}
                          >
                            {(DProvided) => (
                              <div
                                key={index}
                                ref={DProvided.innerRef}
                                {...DProvided.draggableProps}
                                {...DProvided.dragHandleProps}
                                className="columns__selection__box flex items-center rounded-[7px] py-[6px] px-[12px] pr-[5px] border-[1px] border-[#CCCCCC]/70 mb-[10px] last:mb-0"
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
                                  {item?.name}
                                </p>
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
        </>
      )}
    </>
  );
};
export default StreamManageModel;
