import { columnViewInterface } from 'components/ColumnViewListDropDown';
import Dropdown from 'components/Dropdown';
import { updateViewArgType } from '../types';
import ColumnViewDropdown from './ColumnViewDropdown';
import { setEntityTableView } from 'redux/slices/commonSlice';
import { useDispatch } from 'react-redux';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

interface ViewOrderManageProps {
  total: number;
  viewData: columnViewInterface;
  setSelectedColumnView: (
    value: columnViewInterface,
    isEditModalOpen?: boolean
  ) => void;
  selectedColumnView: columnViewInterface;
  onHandleColumnUpdate: (
    type: updateViewArgType,
    value: string,
    updateType: 'name' | 'visibility'
  ) => void;
  onHandlePinViewUpdate: (is_pin: boolean) => void;
  onHandleLockViewUpdate: (is_locked: boolean) => void;
  openModalHandler: (openModalItem: { [key: string]: boolean }) => void;
  onHandleCloneView: (type: updateViewArgType) => Promise<void>;
  modelName: string;
}

const ViewItem = ({
  total,
  viewData,
  selectedColumnView,
  setSelectedColumnView,
  onHandleColumnUpdate,
  onHandlePinViewUpdate,
  openModalHandler,
  onHandleCloneView,
  onHandleLockViewUpdate,
  modelName,
}: ViewOrderManageProps) => {
  const dispatch = useDispatch();
  return (
    <span
      onClick={() => {
        if (selectedColumnView.id !== viewData.id) {
          setSelectedColumnView(viewData);
          dispatch(
            setEntityTableView({
              viewState: {
                [modelName]: viewData,
              },
            })
          );
        }
      }}
      className={`pin__item py-[16px] px-[14px] inline-flex items-center ${
        selectedColumnView.id === viewData.id ? `active` : ``
      } ${
        selectedColumnView.id === viewData.id
          ? `relative before:content-[''] before:absolute before:bottom-[-1px] before:left-0 before:w-full before:h-[2px] before:bg-[#7467B7]`
          : ``
      }`}
    >
      {viewData?.visibility === 'private' ? (
        <IconAnimation
          iconType="privateIcon"
          animationIconType={IconTypeJson.Private}
          textLabel={viewData?.name}
          iconClassName="icon__wrapper w-[24px] h-[24px] p-[1px] shrink-0 mr-[5px] relative top-[-3px]"
          textLabelClassName="textLabel text-[16px] text-[#737373] font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis"
          tippyDisplay={viewData?.name?.length > 12}
        />
      ) : (
        <>
          <IconAnimation
            iconType="publicIcon"
            animationIconType={IconTypeJson.Public}
            textLabel={viewData?.name}
            iconClassName="icon__wrapper w-[24px] h-[24px] p-[1px] shrink-0 mr-[5px] relative top-[-3px]"
            textLabelClassName="textLabel text-[16px] text-[#737373] font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis"
            tippyDisplay={viewData?.name?.length > 12}
          />
        </>
      )}

      {selectedColumnView.id === viewData.id && (
        <span className="count flex items-center justify-center text-[12px] leading-[13px] text-[#7467B7] min-w-[27px] h-[27px] ml-[7px] pt-[7px] pb-[5px] pl-[4px] pr-[5px] font-biotif__Medium relative before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[#7467B7] before:rounded-full before:opacity-20">
          <span className="relative z-[2]">{total}</span>
        </span>
      )}
      {selectedColumnView.id === viewData.id && (
        <Dropdown
          className="tippy__dropdown"
          placement="bottom-start"
          content={({ close }) => (
            <ColumnViewDropdown
              viewData={viewData}
              setSelectedColumnView={setSelectedColumnView}
              onHandleColumnUpdate={onHandleColumnUpdate}
              onHandleLockViewUpdate={onHandleLockViewUpdate}
              onHandlePinViewUpdate={onHandlePinViewUpdate}
              close={close}
              openDeleteModal={() => openModalHandler({ delete: true })}
              visibility={viewData.visibility}
              type={
                viewData?.view_users && viewData?.view_users[0]?.is_pin
                  ? updateViewArgType.PIN
                  : updateViewArgType.UNPIN
              }
              isSystem={selectedColumnView.is_system}
              onHandleCloneView={onHandleCloneView}
            />
          )}
        >
          <span className="toggle__btn ml-[7px] py-[9px] px-[6px] duration-300 rounded-[4px] hover:bg-[#ececec]">
            <svg
              width="18"
              height="5"
              viewBox="0 0 18 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="16"
                cy="2.5"
                r="2"
                transform="rotate(90 16 2.5)"
                fill="#7467B7"
              />
              <circle
                cx="9"
                cy="2.5"
                r="2"
                transform="rotate(90 9 2.5)"
                fill="#7467B7"
              />
              <circle
                cx="2"
                cy="2.5"
                r="2"
                transform="rotate(90 2 2.5)"
                fill="#7467B7"
              />
            </svg>
          </span>
        </Dropdown>
      )}
    </span>
  );
};

export default ViewItem;
