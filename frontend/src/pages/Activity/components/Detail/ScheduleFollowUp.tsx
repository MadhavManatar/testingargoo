// ** Import packages ** //
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import {
  ChangedEventArgs,
  DatePickerComponent,
} from '@syncfusion/ej2-react-calendars';

// ** Components ** //
import ScheduleFollowUpModal from '../Modal/ScheduleFollowUpModal';
import Button from 'components/Button';

// ** Types ** //
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import {
  AuthProviderConnectURLS,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import ReConnectCalendarModal from '../Modal/ReConnectCalendarModal';

type ScheduleFollowUpProps = {
  activityId: number;
  isDisabled?: boolean;
  closeModalForDashboard?: () => void;
  closeViewModal?: (activityDetail?: ActivityResponseType) => void;
  onEdit: ((data: any) => void) | undefined;
  openModald: {
    scheduleFollowUp: boolean;
    followUpDate?: Date | undefined;
  };
  setOpenModald: Dispatch<
    SetStateAction<{
      scheduleFollowUp: boolean;
      followUpDate?: Date | undefined;
    }>
  >;
};

export const ScheduleFollowUp = (props: ScheduleFollowUpProps) => {
  const {
    closeModalForDashboard,
    activityId,
    isDisabled = false,
    closeViewModal,
    onEdit,
    openModald,
    setOpenModald,
  } = props;
  const tomorrowDate: Date = new Date(
    new Date().setDate(new Date().getDate() + 1)
  );
  const nextWeekDate: Date = new Date(
    new Date().setDate(new Date().getDate() + 7)
  );

  // ** Hooks ** //
  const datePickerRef = useRef<DatePickerComponent>(null);

  // ** States ** //
  const [toggleDropDown, setToggleDropDown] = useState<boolean>(false);

  const [openReconnectModal, setOpenReconnectModal] = useState<{
    isOpen: boolean;
    provider: {
      value: TokenProvider | '';
      urlValue: AuthProviderConnectURLS | '';
    };
  }>({
    isOpen: false,
    provider: {
      urlValue: '',
      value: '',
    },
  });

  // ** Functions ** //
  const closeDropDown = () => {
    setToggleDropDown(false);
  };

  const closeModal = () => {
    setOpenModald({
      scheduleFollowUp: false,
      followUpDate: undefined,
    });
  };
  const openScheduleFollowUpModal = (date: Date) => {
    closeModalForDashboard?.();
    setOpenModald({
      followUpDate: date,
      scheduleFollowUp: true,
    });
  };

  return (
    <>
      <div className="schedule__followUP__wrapper mr-[10px] mb-[10px]">
        <Button
          className={`i__Button lpd__btn bg-parentBgWhite__grayBtnBG py-[4px] px-[17px] text-black text-[14px] font-biotif__Medium rounded-[6px] h-[32px] hover:bg-primaryColor hover:text-white ${
            toggleDropDown ? 'active' : null
          }`}
          type="button"
          onClick={() => {
            setToggleDropDown((prev) => !prev);
          }}
          isDisabled={isDisabled}
        >
          Schedule Follow-up
        </Button>
        <div
          className={`lpd__dropdown__list ${toggleDropDown ? '' : 'hidden'}`}
        >
          <div className="inner__wrapper">
            <div
              className="lpd__dropdown__item"
              onClick={() => {
                openScheduleFollowUpModal(tomorrowDate);
                closeDropDown();
              }}
            >
              <span className="lpd__dropdown__text">Tomorrow</span>
            </div>
            <div
              className="lpd__dropdown__item"
              onClick={() => {
                openScheduleFollowUpModal(nextWeekDate);
                closeDropDown();
              }}
            >
              <span className="lpd__dropdown__text">Next Week</span>
            </div>
            <div
              className="lpd__dropdown__item"
              onClick={() => {
                if (datePickerRef.current) {
                  datePickerRef.current.show();
                }
              }}
            >
              <span className="lpd__dropdown__text">Custom Date</span>
            </div>
          </div>
        </div>
        <div className="w-[0px] h-[0px] absolute top-[-12px] left-0 opacity-0 pointer-events-none">
          <DatePickerComponent
            key={toggleDropDown ? 'true' : 'false'}
            ref={datePickerRef}
            showClearButton={false}
            openOnFocus
            change={(args: ChangedEventArgs) => {
              if (args.value) {
                openScheduleFollowUpModal(args.value);
              }
              closeDropDown();
            }}
          />
        </div>
      </div>
      {openModald.scheduleFollowUp && activityId ? (
        <ScheduleFollowUpModal
          closeModal={closeModal}
          id={activityId}
          isOpen={openModald.scheduleFollowUp}
          followUpStartDate={openModald.followUpDate}
          closeViewModal={closeViewModal}
          onEdit={onEdit}
          setOpenReconnectModal={setOpenReconnectModal}
        />
      ) : (
        <></>
      )}

      {openReconnectModal.isOpen ? (
        <ReConnectCalendarModal
          closeModal={() => {
            setOpenReconnectModal({
              isOpen: false,
              provider: {
                urlValue: '',
                value: '',
              },
            });
          }}
          isOpen={openReconnectModal.isOpen}
          provider={openReconnectModal.provider}
        />
      ) : null}
    </>
  );
};
