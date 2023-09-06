import Icon from 'components/Icon';
import { ToggleStateType } from 'pages/Dashboard/types/toggleTypes/index.types';
import { ZoomPhonStatusEnum, ZoomPhoneSoketEvent } from './types/zoom-phone.types';
import { useEffect, useState } from 'react';

interface Props {
  initialToggleValue: ToggleStateType;
  setHeaderToggle: React.Dispatch<React.SetStateAction<ToggleStateType>>;
  callData: ZoomPhoneSoketEvent;
}

const CallScreen = ({
  setHeaderToggle,
  initialToggleValue,
  callData
}: Props) => {

  const [callStatus, setCallStatus] = useState('');
  
  useEffect(() => {
    if (callData.event === ZoomPhonStatusEnum.callee_ringing || callData.event === ZoomPhonStatusEnum.caller_ringing) {
      setCallStatus('calling...');
    } else if(
      callData.event === ZoomPhonStatusEnum.callee_answered 
      || callData.event === ZoomPhonStatusEnum.caller_connected 
      || callData.event === ZoomPhonStatusEnum.caller_unhold 
      || callData.event === ZoomPhonStatusEnum.callee_unhold 
      || callData.event === ZoomPhonStatusEnum.caller_unmute
      || callData.event === ZoomPhonStatusEnum.callee_unmute
      ) {
      setCallStatus('in-progress');
    } else if (callData.event === ZoomPhonStatusEnum.caller_hold || callData.event === ZoomPhonStatusEnum.callee_hold) {
      setCallStatus('on-hold');
    } else if (callData.event === ZoomPhonStatusEnum.callee_mute || callData.event === ZoomPhonStatusEnum.caller_mute) {
      setCallStatus('Muted');
    } else {
      setCallStatus('--');
    }
  }, [callData])
 
  const { phoneNumber, userName } = callData;


  return (
    <div className="inner__wrapper w-[295px] bg-white shadow-[0px_3px_17px_#0000001a] rounded-[10px] overflow-hidden">
      <div className="actionBtn w-full flex items-center justify-end py-[7px] px-[7px] pb-[15px]">
        <button
          onClick={() =>
            setHeaderToggle({
              ...initialToggleValue,
              dialer: { callScreen: false, dialPed: false },
            })
          }
          className='minimizeBtn text-[0px] w-[26px] h-[26px] rounded-full relative duration-500 group hover:bg-[#e8e8e8] before:content-[""] before:absolute before:top-[50%] before:left-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:h-[2px] before:w-[12px] before:bg-black before:rounded-[50px]'
        >
          .
        </button>
        <button
          onClick={() =>
            setHeaderToggle({
              ...initialToggleValue,
              dialer: { callScreen: false, dialPed: false },
            })
          }
          className='closeBtn text-[0px] w-[26px] h-[26px] rounded-full relative duration-500 group ml-[3px] hover:bg-[#e8e8e8] before:content-[""] before:absolute before:top-[6px] before:left-[12px] before:w-[2px] before:h-[14px] before:rotate-45 before:bg-black before:rounded-[50px] after:content-[""] after:absolute after:top-[6px] after:left-[12px] after:w-[2px] after:h-[14px] after:rotate-[-45deg] after:bg-black after:rounded-[50px]'
        >
          .
        </button>
      </div>
      <div className="profile__details pb-[20px]">
        <div className="img__wrapper w-[82px] h-[82px] mx-auto mb-[15px]">
          <Icon
            className="highlighted !w-full !h-full !rounded-full !p-[18px]"
            iconType="userProfileFilledIcon"
          />
        </div>
        <h4 className="text-[18px] font-biotif__Medium text-black text-center">
          {userName || ''}
        </h4>
        <p className="text-[14px] font-biotif__Medium text-black/50 text-center">
          {phoneNumber}
        </p>
        <p className="text-[14px] font-biotif__Medium text-black/50 text-center">
        {callStatus}
        </p>
      </div>

    </div>
  );
};

export default CallScreen;
