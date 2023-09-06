// ** Import Packages **
import { useEffect } from 'react';

// ** Components **
import Icon from 'components/Icon';
import CallScreen from 'pages/Dashboard/components/VoipCall/CallScreen';
import DialPad from 'pages/Dashboard/components/VoipCall/DialPad';
import IncomingCall from 'pages/Dashboard/components/VoipCall/IncomingCall';

// ** Hook **
import useVoipCall from 'pages/Dashboard/hooks/useVoipCall';

// ** Type **
import { ToggleStateType } from 'pages/Dashboard/types/toggleTypes/index.types';

interface Props {
  headerToggle: ToggleStateType;
  initialToggleValue: ToggleStateType;
  setHeaderToggle: React.Dispatch<React.SetStateAction<ToggleStateType>>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const VoipCall = (props: Props) => {
  const { headerToggle, initialToggleValue, setHeaderToggle, containerRef } =
    props;
  const voipObj = useVoipCall();
  const inComingCall = voipObj.callStatus.inComing;

  useEffect(() => {
    if (voipObj.callStatus.inProgress || voipObj.callStatus.accepted) {
      setHeaderToggle((prev) => ({
        ...prev,
        dialer: { dialPed: false, callScreen: true },
      }));
    }
    if (voipObj.callStatus.failed || voipObj.callStatus.ended) {
      /*  */
      setHeaderToggle({ ...initialToggleValue });
      voipObj.setCallStatus((prev) => ({
        ...prev,
        failed: false,
        ended: false,
      }));
    }
  }, [voipObj.callStatus]);

  return (
    <div className="callDialer__wrapper inline-flex mr-[5px] relative">
      {/* eslint-disable jsx-a11y/media-has-caption */}
      <audio id="localAudio" autoPlay />
      <audio id="remoteAudio" autoPlay />
      <button
        onClick={() => {
          if (
            headerToggle?.dialer?.callScreen ||
            headerToggle?.dialer?.dialPed
          ) {
            setHeaderToggle({ ...initialToggleValue });
          } else if (
            voipObj.callStatus.inProgress ||
            voipObj.callStatus.accepted
          ) {
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
            voipObj={voipObj}
          />
        )}
        {headerToggle?.dialer?.callScreen && (
          <CallScreen
            setHeaderToggle={setHeaderToggle}
            initialToggleValue={initialToggleValue}
            voipObj={voipObj}
          />
        )}
      </div>

      {inComingCall && (
        <IncomingCall
          answerCall={(data: boolean) => {
            voipObj.answerCall(data);
            voipObj.setCallStatus((prev) => ({ ...prev, inComing: false }));
          }}
        />
      )}
    </div>
  );
};

export default VoipCall;
