import Icon from 'components/Icon';
import useVoipCall from 'pages/Dashboard/hooks/useVoipCall';
import { ToggleStateType } from 'pages/Dashboard/types/toggleTypes/index.types';

interface Props {
  initialToggleValue: ToggleStateType;
  setHeaderToggle: React.Dispatch<React.SetStateAction<ToggleStateType>>;
  voipObj: ReturnType<typeof useVoipCall>;
}

const CallScreen = ({
  setHeaderToggle,
  initialToggleValue,
  voipObj,
}: Props) => {
  const {
    callerName,
    isCaptionOn,
    captions,
    onCaption,
    offCaption,
    isAudioMuted,
    unmuteAudio,
    muteAudio,
    isOnHold,
    unHoldCall,
    holdCall,
    endCall,
  } = voipObj;

  const callStarted = !!voipObj.callStatus.accepted;

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
      <div className="profile__details">
        <div className="img__wrapper w-[82px] h-[82px] mx-auto mb-[15px]">
          {/* <img
            className="w-full h-full object-cover object-center rounded-full"
            src="images/voipCall_img.png"
            alt=""
          /> */}
          <Icon
            className="highlighted !w-full !h-full !rounded-full !p-[18px]"
            iconType="userProfileFilledIcon"
          />
        </div>
        <h4 className="text-[18px] font-biotif__Medium text-black text-center">
          {callerName || 'William John'}
        </h4>
        {/* <p className="text-[14px] font-biotif__Medium text-black/50 text-center">
          (078) 905 2255
        </p> */}
        {/* <p className="text-[14px] font-biotif__Medium text-black/50 text-center">
          00:03:09
        </p> */}
      </div>
      <div className="afterCall__Btn__wrapper flex flex-wrap justify-center w-[218px] max-full mx-auto pt-[16px] pb-[27px]">
        <button
          onClick={() => {
            if (isAudioMuted) unmuteAudio();
            else muteAudio();
          }}
          disabled={!callStarted}
          className={`w-[62px] h-[41px] inline-flex items-center justify-center rounded-[6px] border border-[#CCCCCC]/50 mr-[12px] mb-[12px] duration-500 hover:bg-[#CCCCCC]/50 ${
            isAudioMuted ? 'active' : ''
          }`}
        >
          <Icon iconType="voipMuteFilledBtn" />
        </button>

        <button
          disabled={!callStarted}
          onClick={() => {
            const dialerObj = { callScreen: false, dialPed: true };
            setHeaderToggle((prev) => ({
              ...prev,
              dialer: dialerObj,
            }));
          }}
          className="w-[62px] h-[41px] inline-flex items-center justify-center rounded-[6px] border border-[#CCCCCC]/50 mr-[12px] mb-[12px] duration-500 hover:bg-[#CCCCCC]/50"
        >
          <Icon iconType="voipKeypadFilledBtn" />
        </button>
        <button
          disabled
          className="w-[62px] h-[41px] inline-flex items-center justify-center rounded-[6px] border border-[#CCCCCC]/50 mb-[12px] duration-500 hover:bg-[#CCCCCC]/50"
        >
          <Icon iconType="voipVoiceFilledBtn" />
        </button>
        <button
          disabled
          className="w-[62px] h-[41px] inline-flex items-center justify-center rounded-[6px] border border-[#CCCCCC]/50 mr-[12px] mb-[12px] duration-500 hover:bg-[#CCCCCC]/50"
        >
          <Icon iconType="voipRecordFilledBtn" />
        </button>

        <button
          disabled={!callStarted}
          onClick={() => {
            if (isOnHold) unHoldCall();
            else holdCall();
          }}
          className={`w-[62px] h-[41px] inline-flex items-center justify-center rounded-[6px] border border-[#CCCCCC]/50 mr-[12px] mb-[12px] duration-500 hover:bg-[#CCCCCC]/50 ${
            isOnHold ? 'active' : ''
          }`}
        >
          <Icon iconType="voipPaushFilledBtn" />
        </button>

        <button
          disabled={!callStarted}
          onClick={() => {
            if (isCaptionOn) offCaption();
            else onCaption();
          }}
          className={`cc__btn w-[62px] h-[41px] pt-[4px] text-[18px] text-primaryColor font-biotif__Bold inline-flex items-center justify-center rounded-[6px] border border-[#CCCCCC]/50 mb-[12px] duration-500 hover:bg-[#CCCCCC]/50 ${
            isCaptionOn ? 'active' : ''
          }`}
        >
          CC
        </button>
      </div>

      {captions.length ? (
        <div className="px-[20px] pb-[20px]">
          {captions.map(
            (caption) =>
              caption.value && (
                <div
                  className="flex items-start mb-[5px] last:mb-0"
                  key={caption.id}
                >
                  <span className="author__name inline-block w-[56px] whitespace-pre overflow-hidden text-ellipsis text-[14px] text-black font-biotif__Medium">
                    {caption.user === 'local' ? 'You:' : 'Remote:'}
                  </span>
                  <span className="w-[calc(100%_-_70px)] pt-[2px] inline-block pl-[7px] text-[14px] text-black/70 font-biotif__Regular leading-[17px]">
                    {caption.value}
                  </span>
                </div>
              )
          )}
        </div>
      ) : null}

      <button
        className="callBtn w-full h-[60px] flex items-center justify-center duration-500 bg-[#FF0000] hover:bg-[#cc0909]"
        onClick={() => {
          {
            const dialerObj = { callScreen: false, dialPed: false };
            setHeaderToggle((prev) => ({
              ...prev,
              dialer: dialerObj,
            }));
          }
          endCall();
        }}
      >
        <Icon
          className="w-[40px] h-[40px] rotate-[133deg]"
          iconType="phoneFilled"
        />
      </button>
    </div>
  );
};

export default CallScreen;
