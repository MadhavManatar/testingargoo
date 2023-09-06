import { columnViewInterface } from 'components/ColumnViewListDropDown';
import { updateViewArgType } from '../types';
import Icon from 'components/Icon';
import { useSelector } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';

interface propsInterface {
  viewData: columnViewInterface;
  setSelectedColumnView: (
    value: columnViewInterface,
    isEditModalOpen?: boolean
  ) => void;
  onHandleColumnUpdate: (
    type: updateViewArgType,
    name: string,
    updateType: 'name' | 'visibility'
  ) => void;
  onHandlePinViewUpdate: (is_pin: boolean) => void;
  onHandleLockViewUpdate: (is_locked: boolean) => void;
  close: () => void;
  openDeleteModal: () => void;
  visibility: 'public' | 'private';
  type: updateViewArgType;
  onHandleCloneView: (type: updateViewArgType) => void;
  isSystem: boolean;
}

const ColumnViewDropdown = ({
  viewData,
  onHandleColumnUpdate,
  onHandlePinViewUpdate,
  onHandleLockViewUpdate,
  close,
  openDeleteModal,
  visibility,
  type,
  onHandleCloneView,
  setSelectedColumnView,
  isSystem,
}: propsInterface) => {
  const currentUser = useSelector(getCurrentUser);

  return (
    <div className="pin__view__dropdown w-[210px] bg-white rounded-[10px] shadow-[0px_3px_17px_0px_#0000001a] p-[10px] absolute top-[100%] left-0 z-[5]">
      <div className="header__pin__view flex items-center justify-between mb-[5px]">
        <span className="inline-block w-full text-[16px] text-[#2E3234] sfont-biotif__Medium pr-[15px]">
          {viewData?.name}
        </span>

        <button
          onClick={() => {
            setSelectedColumnView(viewData, true);
            close();
          }}
          className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-full p-[8px] shrink-0 duration-300 relative top-[-1px] hover:bg-[#ececec]"
        >
          <svg
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.8364 4.091L15.2355 5.69799L11.3155 1.77791L12.9225 0.177008C13.0365 0.0636352 13.1908 0 13.3516 0C13.5124 0 13.6667 0.0636352 13.7807 0.177008L16.8243 3.22055C16.8831 3.27642 16.9301 3.34348 16.9626 3.41778C16.9951 3.49208 17.0124 3.57212 17.0135 3.65321C17.0147 3.7343 16.9996 3.8148 16.9692 3.88998C16.9388 3.96516 16.8936 4.0335 16.8364 4.091ZM10.4511 2.64227L1.23527 11.8825C1.15837 11.9599 1.1037 12.0566 1.07701 12.1625L0.0178556 16.2408C-0.00472085 16.332 -0.00590448 16.4271 0.0143973 16.5188C0.034699 16.6104 0.0759357 16.6962 0.134882 16.7693C0.193828 16.8424 0.268885 16.9008 0.354182 16.9401C0.439479 16.9794 0.532704 16.9984 0.626563 16.9956C0.675083 17.0015 0.724133 17.0015 0.772653 16.9956L4.84491 15.9608C4.95566 15.9283 5.05488 15.865 5.131 15.7782L14.3712 6.56235L10.4511 2.64227Z"
              fill="#737373"
            />
          </svg>
        </button>
      </div>
      <div className="buttons__wrapper border-b-[1px] border-b-[#E5E5E5] pb-[10px] mb-[13px]">
        <button className="btn__item py-[9px] px-[12px] w-full flex items-center relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[6px] before:bg-transparent before:opacity-20 before:duration-300 hover:before:bg-[#7467B7]">
          <div className="icon__wrapper flex items-center justify-center w-[20px] h-[20px] p-0 shrink-0 mr-[6px] relative z-[2]">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.50371 4.92518C6.43565 4.72911 6.3729 4.35554 6.36419 4.09502C6.35548 3.83449 6.35933 3.6104 6.37271 3.59701C6.38606 3.58367 8.00483 3.57283 9.96994 3.57302L13.5429 3.57332L13.5462 3.95531C13.5528 4.72957 13.3289 5.31561 12.8263 5.83893L12.5188 6.15912L12.5192 8.10625L12.5196 10.0533L12.8794 10.2822C13.3947 10.6099 13.9914 11.2666 14.2115 11.7479C14.4394 12.2464 14.5421 12.7053 14.561 13.3105L14.5775 13.8353L12.5217 13.838L10.466 13.8408L10.4654 16.407L10.4648 18.9731L10.2295 19.4457C10.1 19.7056 9.97527 19.9183 9.95223 19.9183C9.92918 19.9183 9.80442 19.7056 9.67497 19.4457L9.43966 18.9731L9.43905 16.407L9.43844 13.8408L7.38244 13.8378L5.3264 13.8347L5.34496 13.2463C5.36523 12.6045 5.54255 11.9718 5.84418 11.4655C6.06971 11.0869 6.67891 10.4829 7.07309 10.2469L7.38488 10.0603L7.38541 8.09259L7.38594 6.12493L7.22254 6.00655C6.97685 5.82862 6.64282 5.32614 6.50371 4.92518Z"
                fill="#737373"
              />
            </svg>
          </div>
          <span
            onClick={() => {
              onHandlePinViewUpdate(type !== updateViewArgType.PIN);
              close();
            }}
            className="text__Label text-[14px] font-biotif__Medium text-[#737373] inline-block w-full whitespace-pre overflow-hidden text-ellipsis relative z-[2] text-left"
          >
            {type === updateViewArgType.PIN ? 'Unpin' : 'Pin'} this view
          </span>
        </button>
        <button className="btn__item py-[9px] px-[12px] w-full flex items-center relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[6px] before:bg-transparent before:opacity-20 before:duration-300 hover:before:bg-[#7467B7]">
          <div className="icon__wrapper flex items-center justify-center w-[20px] h-[20px] p-0 shrink-0 mr-[6px] relative z-[2]">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.33341 3C7.39003 3 6.58748 3.60291 6.29004 4.44443H12.6667C14.2622 4.44443 15.5555 5.73782 15.5555 7.3333V15.1544C16.3971 14.857 17 14.0544 17 13.111V5.16665C17 3.97004 16.03 3 14.8333 3H8.33341Z"
                fill="#737373"
              />
              <path
                d="M4 7.33315C4 6.13655 4.97004 5.1665 6.16665 5.1665H12.6666C13.8632 5.1665 14.8332 6.13655 14.8332 7.33315V15.2775C14.8332 16.4742 13.8632 17.4442 12.6666 17.4442H6.16665C4.97004 17.4442 4 16.4742 4 15.2775V7.33315Z"
                fill="#737373"
              />
            </svg>
          </div>
          <span
            className="text__Label text-[14px] font-biotif__Medium text-[#737373] inline-block w-full whitespace-pre overflow-hidden text-ellipsis relative z-[2] text-left"
            onClick={() => onHandleCloneView(type)}
          >
            Clone view
          </span>
        </button>
        {!isSystem && (
          <button className="btn__item py-[9px] px-[12px] w-full flex items-center relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[6px] before:bg-transparent before:opacity-20 before:duration-300 hover:before:bg-[#7467B7]">
            <div className="icon__wrapper flex items-center justify-center w-[20px] h-[20px] p-0 shrink-0 mr-[6px] relative z-[2]">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.1819 8.11644C16.1819 8.16744 15.7822 13.223 15.5539 15.3507C15.4109 16.6564 14.5692 17.4484 13.3066 17.4709C12.3365 17.4926 11.3868 17.5001 10.4524 17.5001C9.46039 17.5001 8.49027 17.4926 7.54859 17.4709C6.32828 17.4416 5.48581 16.6339 5.35014 15.3507C5.11527 13.2155 4.72284 8.16744 4.71555 8.11644C4.70825 7.9627 4.75785 7.81645 4.85851 7.69795C4.95771 7.58846 5.10068 7.52246 5.25094 7.52246H15.6538C15.8034 7.52246 15.939 7.58846 16.0463 7.69795C16.1462 7.81645 16.1965 7.9627 16.1819 8.11644Z"
                  fill="#737373"
                />
                <path
                  d="M17.1992 5.48265C17.1992 5.17441 16.9563 4.93291 16.6646 4.93291H14.4778C14.0328 4.93291 13.6462 4.61643 13.547 4.17019L13.4245 3.62346C13.2531 2.96273 12.6615 2.5 11.9978 2.5H8.9014C8.23034 2.5 7.64462 2.96273 7.46664 3.65946L7.35213 4.17094C7.2522 4.61643 6.86561 4.93291 6.42139 4.93291H4.23461C3.94211 4.93291 3.69922 5.17441 3.69922 5.48265V5.76764C3.69922 6.06837 3.94211 6.31737 4.23461 6.31737H16.6646C16.9563 6.31737 17.1992 6.06837 17.1992 5.76764V5.48265Z"
                  fill="#737373"
                />
              </svg>
            </div>
            <span
              onClick={() => {
                openDeleteModal();
                close();
              }}
              className={`text__Label text-[14px] font-biotif__Medium text-[#737373] inline-block w-full whitespace-pre overflow-hidden text-ellipsis relative z-[2] text-left `}
            >
              Delete
            </span>
          </button>
        )}
        {viewData.visibility === 'public' &&
          viewData?.created_by === currentUser?.id && (
            <button className="btn__item py-[9px] px-[12px] w-full flex items-center relative before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[6px] before:bg-transparent before:opacity-20 before:duration-300 hover:before:bg-[#7467B7]">
              <Icon
                iconType={
                  viewData.is_locked ? 'unlockFilledIcon' : 'lockFilledIcon'
                }
              />
              <span
                className="text__Label text-[14px] font-biotif__Medium text-[#737373] inline-block w-full whitespace-pre overflow-hidden text-ellipsis relative z-[2] text-left"
                onClick={() => {
                  onHandleLockViewUpdate(!viewData.is_locked);
                  close();
                }}
              >
                {viewData?.is_locked ? 'Unlock' : 'Lock'} this view
              </span>
            </button>
          )}
      </div>
      <div className="view__set px-[14px]">
        <h4 className="text-[#2E3234] text-[16px] font-biotif__Medium mb-[7px]">
          View set as
        </h4>
        <div className="custom__radio__wrapper">
          <div className="ip__Radio w-full mb-[5px]">
            <input
              type="radio"
              name="view"
              value="private"
              checked={visibility === 'private'}
              onChange={() =>
                onHandleColumnUpdate(type, 'private', 'visibility')
              }
            />
            <label className="rc__Label !text-ipBlack__textColor">
              Private
            </label>
          </div>
          <div className="ip__Radio w-full">
            <input
              type="radio"
              name="view"
              value="public"
              checked={visibility === 'public'}
              onChange={() =>
                onHandleColumnUpdate(type, 'public', 'visibility')
              }
            />
            <label className="rc__Label !text-ipBlack__textColor">Public</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnViewDropdown;
