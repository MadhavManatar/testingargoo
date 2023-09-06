import { useEffect } from 'react';
import Icon from 'components/Icon';

interface Props {
  answerCall: (isAccepted: boolean) => void;
}

const IncomingCall = ({ answerCall }: Props) => {
  useEffect(() => {
    const audioEl = document.getElementById('ringtone') as HTMLMediaElement;
    if (audioEl) audioEl.play();
    return () => audioEl.pause();
  }, []);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        id="ringtone"
        src="https://cdn.signalwire.com/default-music/welcome.mp3"
      />
      <div className="incomingCall__screen fixed top-0 left-0 w-screen h-screen bg-[#1776ba]/80 z-[12]">
        <div className="inner__wrapper h-full w-full flex items-center justify-center">
          <div className="incomingCall__box w-[300px] p-[24px] rounded-[12px] bg-white">
            <div className="call__profile">
              <img
                className="w-[80px] h-[80px] block rounded-full object-cover object-center mx-auto"
                src="/images/voipCall_img.png"
                alt=""
              />
              <h2 className="text-[22px] text-black font-biotif__SemiBold text-center mt-[8px]">
                VOIP Test Call
              </h2>
            </div>
            <p className="call__status text-[18px] font-biotif__Medium text-black/60 text-center mt-[10px] mb-[18px]">
              Incoming Call...
            </p>
            <div className="button__wrapper flex items-center justify-center">
              <button
                onClick={() => answerCall(true)}
                className="recive__btn flex items-center justify-center w-[46px] h-[46px] rounded-full mr-[12px] bg-ip__SuccessGreen duration-500 hover:bg-ip__SuccessGreen__hoverDark"
              >
                <Icon
                  className="w-full h-full p-[7px]"
                  iconType="phoneFilled"
                />
              </button>
              <button
                onClick={() => answerCall(false)}
                className="reject__btn flex items-center justify-center w-[46px] h-[46px] rounded-full bg-ip__Red duration-500 hover:bg-ip__Red__hoverDark"
              >
                <Icon
                  className="w-full h-full p-[7px]"
                  iconType="phoneFilled"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IncomingCall;
