// ** Import Packages **
import { useContext, useEffect, useState } from 'react';

// ** Components **
import Icon from 'components/Icon';

// ** Type **
import { ToggleStateType } from 'pages/Dashboard/types/toggleTypes/index.types';
import DialPad from './DialPad';
import CallScreen from './CallScreen';
import { context } from 'App';
import {
  ZoomPhonStatusEnum,
  ZoomPhoneSoketEvent,
} from './types/zoom-phone.types';
import { getZoomAccountDetails } from 'redux/slices/commonSlice';
import { useSelector } from 'react-redux';
import { useLazyGetZoomPhoneCallStatusAPIQuery } from 'redux/api/zoomApi';

interface Props {
  headerToggle: ToggleStateType;
  initialToggleValue: ToggleStateType;
  setHeaderToggle: React.Dispatch<React.SetStateAction<ToggleStateType>>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const ZoomPhoneCall = (props: Props) => {
  const { headerToggle, initialToggleValue, setHeaderToggle, containerRef } =
    props;

  const [callData, setCallData] = useState<ZoomPhoneSoketEvent | null>(null);

  const socket = useContext(context);

  // ** Redux Store **
  const zoomAccount = useSelector(getZoomAccountDetails);

  // ** Custom Hooks **
  const [getZoomPhoneCallStatusAPI] = useLazyGetZoomPhoneCallStatusAPIQuery();

  useEffect(() => {
    if (zoomAccount) {
      if (socket && socket?.connected) {
        const data = { params: {} };
        socket?.on(
          `zoom_phone_status_${zoomAccount.token_provider_user_id}`,
          (eventData) => {
            if (
              (eventData &&
                eventData.event === ZoomPhonStatusEnum.callee_ended) ||
              eventData.event === ZoomPhonStatusEnum.caller_ended ||
              eventData.event === ZoomPhonStatusEnum.callee_rejected ||
              eventData.event === ZoomPhonStatusEnum.caller_rejected ||
              eventData.event ===
                ZoomPhonStatusEnum.callee_call_log_completed ||
              eventData.event === ZoomPhonStatusEnum.caller_call_log_completed
            ) {
              setCallData(null);
            } else {
              setCallData(eventData);
            }
          }
        );
        checkPhoneCallStatus(zoomAccount.user_id ?? 0, data);
      }
    }
  }, [socket?.connected, zoomAccount]);

  useEffect(() => {
    const data = { params: {} };
    if (zoomAccount) {
      if (callData && callData.call_id) {
        data.params = {
          call_id: callData.call_id,
        };
        checkPhoneCallStatus(zoomAccount.id, data);
      }
    }
  }, [callData]);

  const checkPhoneCallStatus = async (
    user_id: number,
    data: { params: object }
  ) => {
    await getZoomPhoneCallStatusAPI({ ...data, user_id });
  };

  useEffect(() => {
    if (callData && callData.event) {
      setHeaderToggle((prev) => ({
        ...prev,
        dialer: { dialPed: false, callScreen: true },
      }));
    }
  }, [callData]);

  return (
    <div className="callDialer__wrapper inline-flex mr-[5px] relative">
      {/* eslint-disable jsx-a11y/media-has-caption */}
      <button
        onClick={() => {
          if (
            headerToggle?.dialer?.callScreen ||
            headerToggle?.dialer?.dialPed
          ) {
            setHeaderToggle({ ...initialToggleValue });
          } else if (callData && callData.event) {
            setHeaderToggle({
              ...initialToggleValue,
              dialer: { callScreen: true, dialPed: false },
            });
          } else {
            setHeaderToggle({
              ...initialToggleValue,
              dialer: { callScreen: false, dialPed: true },
            });
          }
        }}
        className="callDialer__btn inline-flex items-center justify-center w-[40px] h-[40px] rounded-[8px] duration-500 hover:bg-ipSuccessGreen__transparentBG"
      >
        <Icon className="w-full h-full p-[7px]" iconType="phoneFilled" />
      </button>
      <div
        className="dialer__modal absolute top-[calc(100%_+_10px)] right-0 z-[7] sm:right-[-140px]"
        ref={containerRef}
      >
        {headerToggle?.dialer?.dialPed && (
          <DialPad
            setHeaderToggle={setHeaderToggle}
            initialToggleValue={initialToggleValue}
          />
        )}
        {headerToggle?.dialer?.callScreen && callData && (
          <CallScreen
            setHeaderToggle={setHeaderToggle}
            initialToggleValue={initialToggleValue}
            callData={callData}
          />
        )}
      </div>
    </div>
  );
};

export default ZoomPhoneCall;
