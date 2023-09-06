// ** Import Packages **
import { MouseEventHandler, useState } from 'react';

// ** Components **
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import Dropdown from 'components/Dropdown';
import AddScheduleActivityModal from './components/AddStayInTouchModal';

// ** Constant **
import { POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { scheduleActivityResponse } from './types/stay-in-touch.type';
import { useDeleteScheduleActivitiesMutation } from 'redux/api/stayInTouchApi';

interface PropsInterface {
  model_record_id: number;
  model_name: POLYMORPHIC_MODELS;
  isStayInTouchOpen: boolean;
  setIsStayInTouchOpen: (value: boolean) => void;
  scheduleActivityData: scheduleActivityResponse;
  isScheduleActivityLoading: boolean;
  getScheduleActivity: (id: number) => Promise<void>;
}

const StayInTouch = (props: PropsInterface) => {
  const {
    model_record_id,
    model_name,
    isStayInTouchOpen,
    setIsStayInTouchOpen,
    isScheduleActivityLoading,
    scheduleActivityData,
    getScheduleActivity,
  } = props;

  // ** States **
  const [openDeleteModal, setOpenDeleteModal] = useState<{
    delete: boolean;
    id: number | null;
  }>({ delete: false, id: null });

  // ** APIS **
  const [deleteScheduleActivitiesAPI, { isLoading: deleteLoading }] =
    useDeleteScheduleActivitiesMutation();

  const deleteScheduledActivity = async () => {
    const data = await deleteScheduleActivitiesAPI({
      data: { allId: [openDeleteModal?.id], model_record_id },
    });
    if (!('error' in data)) {
      setIsStayInTouchOpen(false);
      getScheduleActivity(model_record_id);
      closeDeleteModal();
    }
  };

  const closeDeleteModal = () => {
    setOpenDeleteModal({ delete: false, id: null });
  };

  const closeModal = (close: MouseEventHandler<HTMLDivElement> | undefined) => {
    return (
      <ul className="tippy__dropdown__ul">
        <li className="item">
          <div onClick={close} className="item__link">
            <div
              className="item__text"
              onClick={() => setIsStayInTouchOpen(true)}
            >
              Edit
            </div>
          </div>
        </li>
        <li className="item">
          <div onClick={close} className="item__link">
            <div
              className="item__text"
              onClick={() =>
                setOpenDeleteModal({
                  delete: true,
                  id: scheduleActivityData?.id || null,
                })
              }
            >
              Remove Reminder
            </div>
          </div>
        </li>
      </ul>
    );
  };
  const removeReminder = () => {
    return scheduleActivityData?.id ? (
      <Dropdown
        className="tippy__stayIn__touch !w-[140px] !max-w-[140px] !translate-x-[6px] !translate-y-[2px]"
        placement="bottom-end"
        content={({ close }) => closeModal(close)}
      >
        <button
          type="button"
          className="ip__Counter__Preview__Drop stayIntouch__Btn mr-[10px] bg-ip__SuccessGreen py-[4px] px-[17px] pr-[37px] text-[#ffffff] text-[14px] font-biotif__Medium rounded-[6px] h-[32px] mb-[10px] duration-500 hover:bg-ip__SuccessGreen__hoverDark relative after:content-[''] after:absolute after:top-[8px] after:right-[28px] after:w-[2px] after:h-[14px] after:bg-white/50 sm:mr-0 sm:mb-0"
        >
          <span className="text pointer-events-auto">Stay in Touch</span>
          <span className='arrow__btn inline-block absolute top-[6px] right-[5px] w-[18px] h-[18px] rounded-[3px] duration-500 hover:bg-white/30 before:content-[""] before:w-[8px] before:h-[8px] before:border-[2px] before:border-[#ffffff] before:absolute before:top-[4px] before:right-[5px] before:rotate-45 before:!border-t-0 before:!border-l-0' />
        </button>
      </Dropdown>
    ) : (
      <button
        onClick={() => setIsStayInTouchOpen(true)}
        className="ip__Counter__Preview__Drop stayIntouch__Btn mr-[10px] bg-parentBgWhite__grayBtnBG py-[4px] px-[17px] text-ipBlack__textColor text-[14px] font-biotif__Medium rounded-[6px] h-[32px]  mb-[10px] duration-500 hover:bg-primaryColor hover:text-[#ffffff] relative before:content-[''] before:w-[8px] before:h-[8px] before:border-[2px] before:border-white before:absolute before:top-[10px] before:right-[12px] before:rotate-45 before:!border-t-0 before:!border-l-0 after:content-[''] after:absolute after:top-[8px] after:right-[28px] after:w-[2px] after:h-[14px] after:bg-white/50 before:hidden after:hidden sm:mb-0 sm:mr-0"
      >
        Stay in Touch
      </button>
    );
  };
  return (
    <>
      {isScheduleActivityLoading ? (
        <div className="w-[32px] h-[32px] flex items-center justify-center">
          <div className="i__ButtonLoader i__ButtonLoader__ForLight !mx-0" />
        </div>
      ) : (
        removeReminder()
      )}

      {isStayInTouchOpen ? (
        <AddScheduleActivityModal
          isOpen={isStayInTouchOpen}
          setIsOpen={(value) => setIsStayInTouchOpen(value)}
          model_record_id={model_record_id}
          scheduleActivityData={scheduleActivityData}
          getScheduleActivity={getScheduleActivity}
          model_name={model_name}
        />
      ) : null}

      <DeleteModal
        closeModal={closeDeleteModal}
        isOpen={openDeleteModal.delete}
        isLoading={deleteLoading}
        deleteOnSubmit={() => deleteScheduledActivity()}
        moduleName="this reminder"
      />
    </>
  );
};

export default StayInTouch;
