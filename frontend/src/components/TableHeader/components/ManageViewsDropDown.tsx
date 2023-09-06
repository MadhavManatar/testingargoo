import { columnViewInterface } from 'components/ColumnViewListDropDown';
import Icon from 'components/Icon';
import _ from 'lodash';
import { ChangeEvent, useLayoutEffect, useRef, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { useUpdateViewOrderMutation } from 'redux/api/columnApi';

interface Props {
  views: columnViewInterface[];
  setSelectedColumnView: (
    value: columnViewInterface,
    isEditModalOpen?: boolean
  ) => void;
  openViewModal: () => void;
  onHandleUpdateData: (args: {
    columnData: columnViewInterface;
    is_pin?: boolean;
    is_locked?: boolean;
    should_update: boolean;
  }) => void;
}

const ManageViewsDropDown = (props: Props) => {
  const { views, setSelectedColumnView, openViewModal, onHandleUpdateData } =
    props;

  // ** states **
  const [mapViews, setMapViews] = useState<columnViewInterface[]>(views);
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const modalElemRef = useRef<HTMLDivElement>(null);

  const [updateViewOrder] = useUpdateViewOrderMutation();

  const searchFilterViews = (event: ChangeEvent<HTMLInputElement>) => {
    const searchResult = views?.filter((view) =>
      view?.name?.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchText(event.target.value);
    setMapViews(searchResult);
  };

  useLayoutEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      modalElemRef.current &&
      !modalElemRef.current.contains(event.target as Node)
    ) {
      closeDropDown();
    }
  };

  const closeDropDown = () => {
    setMapViews([]);
    setIsOpen(false);
  };

  const selectViewHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    view: columnViewInterface
  ) => {
    if ((e.target as { id?: string })?.id !== `${view?.id}_icon`) {
      setSelectedColumnView(view);
      closeDropDown();
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (mapViews) {
      let lengthOfPinnedViews = -1;
      mapViews.forEach((item) => {
        if (item?.view_users && item?.view_users[0]?.is_pin) {
          lengthOfPinnedViews++;
        }
      });
      const { index } = result.destination;
      let orderId = index;
      const oldIndexData = mapViews[result.source.index];

      if (
        index >= lengthOfPinnedViews &&
        oldIndexData?.view_users &&
        oldIndexData?.view_users[0]?.is_pin
      ) {
        orderId = lengthOfPinnedViews;
      } else if (
        index <= lengthOfPinnedViews &&
        oldIndexData?.view_users &&
        !oldIndexData?.view_users[0]?.is_pin
      ) {
        orderId = lengthOfPinnedViews + 1;
      }

      const { id, model_name } = mapViews[result.source.index];
      const bodyData = {
        p_view_id: id,
        p_order_id: orderId,
        p_model_name: model_name,
      };
      setMapViews((prev) => {
        if (prev) {
          prev.splice(result.source.index, 1);
          prev.splice(orderId, 0, oldIndexData);
          return prev;
        }
        return prev;
      });
      updateViewOrder({ data: bodyData });
    }
  };

  return (
    <div className="sticky__btn__wrapper inline-flex items-center mr-[15px] ml-[10px] shrink-0 h-[44px]">
      {views && views?.length > 0 && (
        <div className="stream__list__wrapper relative">
          <div className="inline-block relative">
            <div
              onClick={() => {
                setMapViews(views);
                setIsOpen(true);
              }}
              className="view__down__btn cursor-pointer w-[27px] h-[27px] bg-sdWhite__bg shadow-[1px_1px_3px_0px_#cfcfcfe6,_-1px_-1px_2px_0px_#ffffffe6,_1px_-1px_2px_0px_#cfcfcf33,_-1px_1px_2px_0px_#cfcfcf33] rounded-full relative"
            >
              <Icon iconType="signupBackArrowFilled" />
            </div>
            <div
              className={`add__dropdown__menu absolute top-[100%] right-0 w-[260px] pt-[5px] z-[3] ${
                isOpen ? 'show' : 'hidden'
              }`}
              ref={modalElemRef}
            >
              <div className="inner__wrapper bg-ipWhite__bgColor min-w-[150px] relative rounded-[10px] p-[16px] pt-[10px]">
                <div className="flex items-center">
                  <h3 className="text-[14px] font-biotif__Medium text-darkTextColorSD w-full whitespace-pre overflow-hidden text-ellipsis">
                    Views
                  </h3>
                  <div
                    className="relative shrink-0 cursor-pointer w-[26px] h-[26px] duration-300 rounded-full before:content-[''] before:w-[12px] before:h-[1px] before:bg-darkTextColorSD before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:rotate-45 after:content-[''] after:w-[12px] after:h-[1px] after:bg-darkTextColorSD after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:-rotate-45 hover:bg-btnGrayColor"
                    onClick={closeDropDown}
                  />
                </div>
                <div className="ip__form__hasIcon search__box mt-[8px] mb-[11px]">
                  <input
                    className="ip__input"
                    placeholder="Search"
                    type="search"
                    value={searchText}
                    onChange={searchFilterViews}
                  />
                  <Icon className="grayscale" iconType="searchStrokeIcon" />
                </div>
                <div className="max-h-[300px] overflow-y-auto ip__hideScrollbar">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {mapViews?.map((view, index) => (
                            <Draggable
                              draggableId={`${view?.id}_drag_item`}
                              key={`${view?.id}_drag_key`}
                              index={index}
                            >
                              {(provided2) => (
                                <div
                                  key={`${view?.id}_view_item`}
                                  ref={provided2.innerRef}
                                  {...provided2.draggableProps}
                                  {...provided2.dragHandleProps}
                                  style={{
                                    userSelect: 'none',
                                    ...provided2.draggableProps.style,
                                  }}
                                  className="columns__selection__box cursor-pointer flex items-center rounded-[7px] py-[8px] px-[12px] pr-[5px] border-[1px] border-[#CCCCCC]/70 mb-[10px] bg-white last:mb-0"
                                  onClick={(e) => selectViewHandler(e, view)}
                                >
                                  <div className="drag__icon cursor-grab w-[12px] h-auto flex flex-wrap shrink-0">
                                    <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                                    <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                                    <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                                    <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                                    <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px]" />
                                    <div className="w-[4px] h-[4px] rounded-full bg-black/50" />
                                  </div>
                                  <p className="text-[14px] font-biotif__Medium text-black w-full pl-[10px] pr-[10px]">
                                    {view?.name}
                                  </p>
                                  <PinUnpinManageView
                                    view={view}
                                    setMapViews={setMapViews}
                                    onHandleUpdateData={onHandleUpdateData}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={openViewModal}
        className="view__btn__custom text-[16px] text-[#737373] font-biotif__Regular ml-[10px] duration-300 hover:text-primaryColorSD hover:underline"
      >
        <Icon iconType="plusFilledBlueIcon" /> View
      </button>
    </div>
  );
};

export default ManageViewsDropDown;

interface PinUnpinManageViewType {
  view: columnViewInterface;
  onHandleUpdateData: (args: {
    columnData: columnViewInterface;
    is_pin?: boolean;
    is_locked?: boolean;
    should_update: boolean;
  }) => void;
  setMapViews: React.Dispatch<React.SetStateAction<columnViewInterface[]>>;
}

const PinUnpinManageView = ({
  view,
  setMapViews,
  onHandleUpdateData,
}: PinUnpinManageViewType) => {
  const [isPin, setIsPin] = useState(
    (view?.view_users && view?.view_users[0]?.is_pin) || false
  );
  const pinUnPinHandler = async () => {
    // ** temporary solution for update pin unpin on update ordering **
    if (view?.view_users && view.view_users[0]) {
      await onHandleUpdateData({
        columnData: view,
        is_pin: !view?.view_users[0]?.is_pin,
        should_update: true,
      });
      setIsPin(!isPin);
      setMapViews((prev) => {
        const newValue = prev.map((item) => {
          if (item?.id === view?.id && item.view_users && view?.view_users) {
            item = {
              ...item,
              view_users: [
                { ...item.view_users[0], is_pin: !view?.view_users[0]?.is_pin },
              ],
            };
          }
          return item;
        });
        return _.orderBy(
          newValue,
          (item) => item?.view_users && item?.view_users[0]?.is_pin,
          'desc'
        );
      });
    }
  };
  return (
    <span className="cursor-pointer" onClick={pinUnPinHandler}>
      {isPin ? (
        <Icon id={`${view?.id}_icon`} iconType="unpinFilledIcon" />
      ) : (
        <Icon id={`${view?.id}_icon`} iconType="pinFilledIcon" />
      )}
    </span>
  );
};
