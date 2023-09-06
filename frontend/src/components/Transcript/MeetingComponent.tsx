// ** Import Packages **
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle,
} from 'react';
import { SliderComponent } from '@syncfusion/ej2-react-inputs';

// ** Types **
import { MeetingRef, MeetingStateType } from './types/transcript.types';

// ** Custom Hooks **
import { useToggleDropdown } from 'hooks/useToggleDropdown';
import { formattedVideoTime } from './helper/transcript.helper';

interface Props {
  meetingState: MeetingStateType;
  url: string | null;
  updateMeetingState: (data: Partial<MeetingStateType>) => void;
  skipToNextSpeaker: () => void;
}

const PLAYBACK_SPEED = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const MeetingComponent = forwardRef<MeetingRef, Props>((props, ref) => {
  // ** Props **
  const { meetingState, url, updateMeetingState, skipToNextSpeaker } = props;

  // ** Refs **
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  // ** Custom Hooks **
  const { dropdownRef, isDropdownOpen, toggleDropdown } = useToggleDropdown();

  const currentMeetingRef = useMemo(() => {
    return meetingState.meetingType === 'audio' ? audioRef : videoRef;
  }, [meetingState.meetingType]);

  // ** useEffect **
  useEffect(() => {
    const handleFullscreenChange = () => {
      updateMeetingState({ isFullScreen: document.fullscreenElement !== null });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [updateMeetingState]);

  useEffect(() => {
    if (meetingState.isLoaded && currentMeetingRef.current) {
      updateMeetingState({ duration: currentMeetingRef.current.duration });
    }
  }, [meetingState.isLoaded, updateMeetingState]);

  useEffect(() => {
    if (meetingState.currentTime === meetingState.duration) {
      updateMeetingState({ isPaused: true });
    }
  }, [meetingState.currentTime, meetingState.duration]);

  // ** Functions **

  const showControls = () => {
    if (videoTimerRef.current !== null) {
      clearTimeout(videoTimerRef.current);
    }
    if (!meetingState.isControlsVisible) {
      updateMeetingState({ isControlsVisible: true });
    }
    videoTimerRef.current = setTimeout(hideControls, 3000);
  };

  const hideControls = () => {
    if (!meetingState.isPaused && meetingState.isControlsVisible) {
      if (isDropdownOpen) toggleDropdown();
      updateMeetingState({ isControlsVisible: false });
    }
  };

  const handlePlay = () => {
    if (currentMeetingRef.current) {
      currentMeetingRef.current.play();
      updateMeetingState({ isPaused: false });
    }
  };

  const handlePause = () => {
    if (currentMeetingRef.current) {
      currentMeetingRef.current.pause();
      updateMeetingState({ isPaused: true });
    }
  };

  const handleSeekForward = () => {
    if (currentMeetingRef.current) {
      currentMeetingRef.current.currentTime += 10;
    }
  };

  const handleSeekBackward = () => {
    if (currentMeetingRef.current) {
      currentMeetingRef.current.currentTime -= 10;
    }
  };

  const handleTimeDrag = (newTime: number) => {
    if (currentMeetingRef.current && newTime !== meetingState.currentTime) {
      currentMeetingRef.current.currentTime = newTime;
      updateMeetingState({ currentTime: newTime });
    }
  };

  const handlePlaybackSpeedChange = (val: number) => {
    if (currentMeetingRef.current) {
      currentMeetingRef.current.playbackRate = val;
      updateMeetingState({ playbackSpeed: val });
    }
  };

  const handleFullscreenToggle = () => {
    if (videoContainerRef.current) {
      const isFull = meetingState.isFullScreen;
      if (!isFull) {
        videoContainerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      updateMeetingState({ isFullScreen: !isFull });
    }
  };

  useImperativeHandle(ref, () => ({
    updateMeetingTime: (time) => {
      if (currentMeetingRef.current) {
        currentMeetingRef.current.currentTime = time;
      }
    },
  }));

  return (
    <div className="video-sec w-[60%] pr-[30px]">
      <div className="inner__wrapper">
        <div className="video__box bg-white rounded-[10px] p-[15px]">
          {/* {!meetingState.isLoaded && <h1>Loading...</h1>} */}
          {/* <div className="top__header flex pb-[14px]">
            <div className="time__toggle flex items-center">
              <span className="time text-[14px] font-biotif__Regular text-[#2E3234]/60">
                {formattedVideoTime(meetingState.duration)}
              </span>
            </div>
          </div> */}
          <div
            id="video-container"
            onMouseMove={showControls}
            onMouseLeave={hideControls}
            className={`video-tag-wrapper ${
              meetingState.meetingType === 'audio' ? 'audio-tag' : ''
            } relative`}
            ref={videoContainerRef}
          >
            {meetingState.meetingType === 'video' && url && (
              <video
                ref={videoRef}
                onLoadedData={() => updateMeetingState({ isLoaded: true })}
                onErrorCapture={() => updateMeetingState({ isLoaded: true })}
                onTimeUpdate={() => {
                  if (videoRef.current) {
                    updateMeetingState({
                      currentTime: videoRef.current.currentTime,
                    });
                  }
                }}
              >
                <source src={url} />
                <track kind="captions" />
              </video>
            )}

            {meetingState.meetingType === 'audio' && url && (
              <>
                <div className="audio__img__wrapper rounded-t-[10px] pt-[6px] px-[16px] absolute top-[calc(50%_-_48px)] translate-y-[-50%] left-0 w-full">
                  <div className="inner__wrapper">
                    {/* <img src='https://i.ibb.co/G3jS4jN/Admired-Quick-Bream-size-restricted.gif' alt='' /> */}
                  </div>
                </div>

                <audio
                  ref={audioRef}
                  onLoadedData={() => updateMeetingState({ isLoaded: true })}
                  onErrorCapture={() => updateMeetingState({ isLoaded: true })}
                  onTimeUpdate={() => {
                    if (currentMeetingRef.current) {
                      updateMeetingState({
                        currentTime: currentMeetingRef.current.currentTime,
                      });
                    }
                  }}
                >
                  <source src={url} />
                  <track kind="captions" />
                </audio>
              </>
            )}

            <span
              className="video-overlay absolute top-0 left-0 w-full h-full z-[2] opacity-0"
              onClick={() =>
                meetingState.isPaused ? handlePlay() : handlePause()
              }
              onDoubleClick={handleFullscreenToggle}
            />

            {meetingState.isControlsVisible && (
              <div
                onMouseMove={showControls}
                className="video__action__wrapper absolute bottom-0 left-0 w-full rounded-b-[10px] bg-gradient-to-b from-[#0000] to-[#000000e5] py-[15px] px-[18px] z-[4]"
              >
                <div className="top__toolbar flex items-center justify-center pb-[16px]">
                  <button
                    className="action__btn seekBackward__btn mr-[20px]"
                    onClick={handleSeekBackward}
                  >
                    <svg
                      width="20"
                      height="13"
                      viewBox="0 0 20 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.9378 1.44644V11.0989C19.9365 11.3436 19.8697 11.5835 19.7442 11.7935C19.6187 12.0035 19.4392 12.1761 19.2243 12.2932C19.0095 12.4102 18.7672 12.4676 18.5227 12.4591C18.2781 12.4507 18.0403 12.3769 17.834 12.2453L11.0003 7.89347V11.0989C10.999 11.3436 10.9322 11.5835 10.8067 11.7935C10.6812 12.0035 10.5017 12.1761 10.2868 12.2932C10.072 12.4102 9.82968 12.4676 9.58515 12.4591C9.34062 12.4507 9.10283 12.3769 8.89654 12.2453L1.31771 7.41909C1.12462 7.29654 0.965609 7.1272 0.855438 6.92679C0.745266 6.72638 0.6875 6.50139 0.6875 6.27269C0.6875 6.04399 0.745266 5.819 0.855438 5.61858C0.965609 5.41817 1.12462 5.24883 1.31771 5.12628L8.89654 0.300032C9.10277 0.168177 9.34062 0.0941059 9.58525 0.085552C9.82989 0.0769982 10.0723 0.134276 10.2873 0.251404C10.5022 0.368532 10.6818 0.541215 10.8072 0.751424C10.9326 0.961633 10.9993 1.20166 11.0003 1.44644V4.65191L17.834 0.300032C18.0403 0.168177 18.2781 0.0941059 18.5228 0.085552C18.7674 0.0769982 19.0098 0.134276 19.2248 0.251404C19.4397 0.368532 19.6193 0.541215 19.7447 0.751424C19.8701 0.961633 19.9368 1.20166 19.9378 1.44644Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                  {meetingState.isPaused ? (
                    <button
                      className="action__btn play__btn mr-[20px]"
                      onClick={handlePlay}
                    >
                      <svg
                        width="16"
                        height="19"
                        viewBox="0 0 16 19"
                        fill="none"
                      >
                        <path
                          d="M15.625 9.27271C15.6256 9.50614 15.5657 9.73574 15.4513 9.93919C15.3368 10.1426 15.1717 10.313 14.9719 10.4337L2.59 18.0083C2.38125 18.1361 2.14215 18.2059 1.89741 18.2104C1.65267 18.2149 1.41116 18.154 1.19781 18.034C0.986501 17.9159 0.810472 17.7436 0.687828 17.5348C0.565185 17.3261 0.500353 17.0885 0.5 16.8464V1.69903C0.500353 1.45694 0.565185 1.2193 0.687828 1.01056C0.810472 0.801829 0.986501 0.629528 1.19781 0.511379C1.41116 0.391366 1.65267 0.330481 1.89741 0.335014C2.14215 0.339546 2.38125 0.40933 2.59 0.53716L14.9719 8.11169C15.1717 8.23241 15.3368 8.40278 15.4513 8.60623C15.5657 8.80967 15.6256 9.03928 15.625 9.27271Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  ) : (
                    <button
                      className="action__btn paush__btn mr-[20px]"
                      onClick={handlePause}
                    >
                      <svg
                        width="16"
                        height="18"
                        viewBox="0 0 16 18"
                        fill="none"
                      >
                        <path
                          d="M15.5625 2.125V15.875C15.5625 16.2397 15.4176 16.5894 15.1598 16.8473C14.9019 17.1051 14.5522 17.25 14.1875 17.25H10.75C10.3853 17.25 10.0356 17.1051 9.77773 16.8473C9.51987 16.5894 9.375 16.2397 9.375 15.875V2.125C9.375 1.76033 9.51987 1.41059 9.77773 1.15273C10.0356 0.894866 10.3853 0.75 10.75 0.75H14.1875C14.5522 0.75 14.9019 0.894866 15.1598 1.15273C15.4176 1.41059 15.5625 1.76033 15.5625 2.125ZM5.25 0.75H1.8125C1.44783 0.75 1.09809 0.894866 0.840228 1.15273C0.582366 1.41059 0.4375 1.76033 0.4375 2.125V15.875C0.4375 16.2397 0.582366 16.5894 0.840228 16.8473C1.09809 17.1051 1.44783 17.25 1.8125 17.25H5.25C5.61467 17.25 5.96441 17.1051 6.22227 16.8473C6.48013 16.5894 6.625 16.2397 6.625 15.875V2.125C6.625 1.76033 6.48013 1.41059 6.22227 1.15273C5.96441 0.894866 5.61467 0.75 5.25 0.75Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  )}
                  <button
                    className="action__btn seekForward__btn"
                    onClick={handleSeekForward}
                  >
                    <svg
                      width="20"
                      height="13"
                      viewBox="0 0 20 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.062212 1.44644V11.0989C0.0634842 11.3436 0.130344 11.5835 0.255829 11.7935C0.381313 12.0035 0.560829 12.1761 0.775671 12.2932C0.990515 12.4102 1.23282 12.4676 1.47735 12.4591C1.72187 12.4507 1.95967 12.3769 2.16596 12.2453L8.99971 7.89347V11.0989C9.00098 11.3436 9.06785 11.5835 9.19333 11.7935C9.31881 12.0035 9.49833 12.1761 9.71317 12.2932C9.92801 12.4102 10.1703 12.4676 10.4148 12.4591C10.6594 12.4507 10.8972 12.3769 11.1035 12.2453L18.6823 7.41909C18.8754 7.29654 19.0344 7.1272 19.1446 6.92679C19.2547 6.72638 19.3125 6.50139 19.3125 6.27269C19.3125 6.04399 19.2547 5.819 19.1446 5.61858C19.0344 5.41817 18.8754 5.24883 18.6823 5.12628L11.1035 0.300032C10.8972 0.168177 10.6594 0.0941059 10.4147 0.085552C10.1701 0.0769982 9.92767 0.134276 9.71273 0.251404C9.49779 0.368532 9.31824 0.541215 9.19281 0.751424C9.06739 0.961633 9.00071 1.20166 8.99971 1.44644V4.65191L2.16596 0.300032C1.95973 0.168177 1.72188 0.0941059 1.47725 0.085552C1.23261 0.0769982 0.990171 0.134276 0.77523 0.251404C0.560291 0.368532 0.380735 0.541215 0.255316 0.751424C0.129894 0.961633 0.0632057 1.20166 0.062212 1.44644Z"
                        fill="white"
                      />
                    </svg>
                  </button>

                  <button className="hidden" onClick={skipToNextSpeaker}>
                    Next Speaker
                  </button>
                </div>
                <div className="video__slider flex items-center justify-center pb-[14px]">
                  <SliderComponent
                    type="MinRange"
                    min={0}
                    max={meetingState.duration}
                    value={meetingState.currentTime}
                    step={5}
                    changed={(value: any) => handleTimeDrag(value.value)}
                    tooltip={{ isVisible: true, cssClass: 'slider-tooltip' }}
                    tooltipChange={(args) => {
                      args.text = formattedVideoTime(args.value);
                    }}
                  />
                </div>
                <div className="bottom__toolbar flex items-center justify-between">
                  <div className="left flex items-center">
                    <div className="current__timer text-[16px] text-white font-biotif__SemiBold mr-[10px] relative top-[2px]">
                      <span>
                        {formattedVideoTime(meetingState.currentTime)}
                      </span>
                      <span> / </span>
                      <span>{formattedVideoTime(meetingState.duration)}</span>
                    </div>
                    <div className="volumn__wrapper flex items-center pr-[20px]">
                      {meetingState.volume > 0.1 ? (
                        <div
                          className="action__btn volumn__icon mr-[5px]"
                          onClick={() => updateMeetingState({ volume: 0 })}
                        >
                          <svg
                            width="20"
                            height="15"
                            viewBox="0 0 20 15"
                            fill="none"
                          >
                            <path
                              d="M9.04066 0.967955L4.40443 4.52943H0.906174C0.400402 4.52943 0 4.92983 0 5.4356V9.71359C0 10.2194 0.400402 10.6198 0.906174 10.6198H4.4255L9.06174 14.1812C9.6518 14.6449 10.5158 14.2234 10.5158 13.4647V1.68446C10.4948 0.925807 9.63073 0.504331 9.04066 0.967955Z"
                              fill="white"
                            />
                            <path
                              d="M13.2727 5.07738C13.0198 4.71912 12.514 4.63483 12.1557 4.88771C11.7975 5.1406 11.7132 5.64637 11.9661 6.00463C12.2822 6.46825 12.4719 6.9951 12.4719 7.56409C12.4719 8.13308 12.3033 8.65993 11.9661 9.12355C11.7132 9.48181 11.7975 9.98758 12.1557 10.2405C12.3033 10.3458 12.4508 10.388 12.6194 10.388C12.8723 10.388 13.1251 10.2615 13.2727 10.0508C13.7995 9.31321 14.0735 8.47026 14.0735 7.56409C14.0735 6.65791 13.7995 5.79389 13.2727 5.07738Z"
                              fill="white"
                            />
                            <path
                              d="M15.3646 2.90678C15.0906 2.5696 14.5849 2.52745 14.2266 2.80141C13.8894 3.07537 13.8473 3.58114 14.1212 3.93939C14.9642 4.95094 15.4278 6.23644 15.4278 7.56409C15.4278 8.89174 14.9642 10.1772 14.1212 11.1888C13.8473 11.526 13.8894 12.0317 14.2266 12.3268C14.3741 12.4532 14.5638 12.5164 14.7324 12.5164C14.9642 12.5164 15.196 12.4111 15.3435 12.2214C16.4394 10.9148 17.0294 9.27107 17.0294 7.56409C17.0294 5.85711 16.4604 4.21335 15.3646 2.90678Z"
                              fill="white"
                            />
                            <path
                              d="M17.4468 0.77829C17.1518 0.441109 16.646 0.420035 16.3088 0.715068C15.9716 1.0101 15.9506 1.51587 16.2456 1.85305C17.6575 3.43359 18.4162 5.45668 18.4162 7.56406C18.4162 9.67144 17.6575 11.6945 16.2456 13.2751C15.9506 13.6122 15.9927 14.118 16.3088 14.413C16.4563 14.5395 16.646 14.6238 16.8357 14.6238C17.0675 14.6238 17.2782 14.5395 17.4257 14.3498C19.0695 12.4743 19.9967 10.0718 19.9967 7.56406C19.9967 5.05627 19.1116 2.65386 17.4468 0.77829Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div
                          className="action__btn volumn__icon mr-[5px]"
                          onClick={() => updateMeetingState({ volume: 1 })}
                        >
                          <svg
                            width="20"
                            height="19"
                            viewBox="0 0 20 19"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.5463 3.47111C10.5463 2.71322 9.68311 2.29217 9.09364 2.75533L7.76734 3.76584L10.5463 7.11317V3.47111Z"
                              fill="white"
                            />
                            <path
                              d="M12.6322 9.36577C12.6322 9.44998 12.6322 9.51314 12.6322 9.59735L13.748 10.9237C13.9585 10.4394 14.0427 9.89208 14.0427 9.34472C14.0427 8.46052 13.769 7.61842 13.2638 6.90264C13.0322 6.58686 12.5901 6.50265 12.2743 6.73422C11.9585 6.9658 11.8743 7.4079 12.1059 7.72369C12.4427 8.20789 12.6322 8.77631 12.6322 9.36577Z"
                              fill="white"
                            />
                            <path
                              d="M15.6206 9.36578C15.6206 10.3763 15.3469 11.3868 14.8417 12.25L15.789 13.3868C16.589 12.2078 17.0311 10.7973 17.0311 9.36578C17.0311 7.68158 16.4417 6.06055 15.368 4.7553C15.1154 4.46057 14.6733 4.41846 14.3785 4.67109C14.0838 4.92372 14.0417 5.36582 14.2943 5.66056C15.1364 6.69212 15.6206 8.01842 15.6206 9.36578Z"
                              fill="white"
                            />
                            <path
                              d="M17.4533 2.62901C17.2007 2.33427 16.7586 2.31322 16.4638 2.56585C16.1691 2.81848 16.148 3.26058 16.4007 3.55531C17.8112 5.1553 18.5901 7.21843 18.5901 9.36577C18.5901 11.2815 17.9586 13.1342 16.8217 14.6499L17.748 15.7446C19.2006 13.9341 20.0006 11.6815 20.0006 9.36577C20.0006 6.88159 19.0954 4.48162 17.4533 2.62901Z"
                              fill="white"
                            />
                            <path
                              d="M3.0947 0.25009C2.84207 -0.0446432 2.39997 -0.0867479 2.10524 0.165881C1.81051 0.41851 1.7684 0.86061 2.02103 1.15534L5.57888 5.42898L4.44206 6.31318H0.905253C0.399996 6.31318 0 6.71317 0 7.21843V11.5131C0 12.0184 0.399996 12.4184 0.905253 12.4184H4.44206L9.09463 15.9973C9.6841 16.4604 10.5472 16.0394 10.5472 15.2815V11.3868L16.463 18.4815C16.6103 18.6499 16.7998 18.7341 17.0103 18.7341C17.1788 18.7341 17.3261 18.6709 17.4524 18.5657C17.7472 18.313 17.7893 17.8709 17.5366 17.5762L3.0947 0.25009Z"
                              fill="white"
                            />
                          </svg>
                        </div>
                      )}

                      <div
                        className={`volumn__slider__wrapper pb-[1px] w-[70px] flex items-center ${
                          meetingState.isPaused ? 'visible' : ''
                        }`}
                      >
                        <SliderComponent
                          type="MinRange"
                          min={0}
                          max={1}
                          value={meetingState.volume}
                          step={0.1}
                          changed={(value) => {
                            if (videoRef.current) {
                              updateMeetingState({ volume: value.value });
                              videoRef.current.volume = value.value;
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {meetingState.meetingType === 'video' && (
                    <div className="right flex items-center">
                      <div
                        className="speed__select relative"
                        ref={dropdownRef}
                        onClick={toggleDropdown}
                      >
                        <div className="speed__dropdown__btn relative text-[16px] font-biotif__Medium text-white py-[3px] px-[5px] pr-[22px] rounded-[4px] cursor-pointer">
                          {meetingState.playbackSpeed}x
                          <span className="down__arrow absolute top-[calc(50%_-_3px)] translate-y-[-50%] right-[6px] w-[8px] h-[8px] border-l-[1px] border-b-[1px] border-l-[#ffffff] border-b-[#ffffff] -rotate-45" />
                        </div>
                        <div
                          className={`add__dropdown__menu absolute bottom-[calc(100%_-_2px)] right-[0px] pb-[5px] ${
                            !isDropdownOpen ? 'hidden' : ''
                          }`}
                        >
                          <div className="inner__wrapper bg-ipWhite__bgColor min-w-[80px] relative rounded-[10px]">
                            <div>
                              {PLAYBACK_SPEED.map((speed) => (
                                <div
                                  key={speed}
                                  className="item"
                                  onClick={() =>
                                    handlePlaybackSpeedChange(speed)
                                  }
                                >
                                  <div className="flex items-center relative z-[2] cursor-pointer">
                                    <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
                                      {speed}x
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className="action__btn full-screen-btn ml-[10px]"
                        onClick={handleFullscreenToggle}
                      >
                        {meetingState.isFullScreen ? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.25042 10.5V15C8.25053 15.1484 8.20661 15.2935 8.12421 15.417C8.0418 15.5404 7.92463 15.6366 7.78751 15.6934C7.65039 15.7503 7.4995 15.7651 7.35394 15.7361C7.20837 15.7071 7.07468 15.6356 6.96979 15.5306L5.25042 13.8103L2.03104 17.0306C1.89031 17.1713 1.69944 17.2504 1.50042 17.2504C1.30139 17.2504 1.11052 17.1713 0.969792 17.0306C0.829062 16.8899 0.75 16.699 0.75 16.5C0.75 16.301 0.829062 16.1101 0.969792 15.9694L4.1901 12.75L2.46979 11.0306C2.36478 10.9257 2.29326 10.792 2.26427 10.6465C2.23528 10.5009 2.25014 10.35 2.30695 10.2129C2.36376 10.0758 2.45999 9.95859 2.58343 9.87619C2.70688 9.79379 2.852 9.74986 3.00042 9.74998H7.50042C7.69933 9.74998 7.89009 9.829 8.03075 9.96965C8.1714 10.1103 8.25042 10.3011 8.25042 10.5ZM17.031 0.969355C16.9614 0.899622 16.8787 0.844303 16.7876 0.80656C16.6966 0.768817 16.599 0.74939 16.5004 0.74939C16.4019 0.74939 16.3043 0.768817 16.2132 0.80656C16.1222 0.844303 16.0394 0.899622 15.9698 0.969355L12.7504 4.18967L11.031 2.46935C10.9262 2.36435 10.7925 2.29282 10.6469 2.26383C10.5013 2.23485 10.3504 2.2497 10.2133 2.30651C10.0762 2.36333 9.95903 2.45955 9.87663 2.58299C9.79422 2.70644 9.7503 2.85156 9.75042 2.99998V7.49998C9.75042 7.69889 9.82943 7.88966 9.97009 8.03031C10.1107 8.17096 10.3015 8.24998 10.5004 8.24998H15.0004C15.1488 8.2501 15.294 8.20617 15.4174 8.12377C15.5408 8.04137 15.6371 7.92419 15.6939 7.78707C15.7507 7.64996 15.7656 7.49906 15.7366 7.3535C15.7076 7.20794 15.6361 7.07425 15.531 6.96935L13.8107 5.24998L17.031 2.0306C17.1008 1.96095 17.1561 1.87823 17.1938 1.78718C17.2316 1.69614 17.251 1.59854 17.251 1.49998C17.251 1.40142 17.2316 1.30382 17.1938 1.21277C17.1561 1.12173 17.1008 1.03901 17.031 0.969355Z"
                              fill="white"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.2806 13.9921C10.3504 14.0617 10.4057 14.1445 10.4434 14.2355C10.4812 14.3265 10.5006 14.4241 10.5006 14.5227C10.5006 14.6213 10.4812 14.7189 10.4434 14.8099C10.4057 14.901 10.3504 14.9837 10.2806 15.0533L7.81031 17.5227L9.53063 19.2421C9.63563 19.347 9.70716 19.4807 9.73615 19.6262C9.76514 19.7718 9.75028 19.9227 9.69347 20.0598C9.63665 20.1969 9.54043 20.3141 9.41699 20.3965C9.29354 20.4789 9.14842 20.5228 9 20.5227H4.5C4.30109 20.5227 4.11032 20.4437 3.96967 20.303C3.82902 20.1624 3.75 19.9716 3.75 19.7727V15.2727C3.74988 15.1243 3.79381 14.9792 3.87621 14.8557C3.95861 14.7323 4.07579 14.6361 4.21291 14.5792C4.35002 14.5224 4.50092 14.5076 4.64648 14.5366C4.79204 14.5655 4.92573 14.6371 5.03063 14.7421L6.75 16.4624L9.21938 13.9921C9.28903 13.9223 9.37175 13.867 9.4628 13.8293C9.55384 13.7915 9.65144 13.7721 9.75 13.7721C9.84856 13.7721 9.94616 13.7915 10.0372 13.8293C10.1283 13.867 10.211 13.9223 10.2806 13.9921ZM7.81031 7.02271L9.53063 5.30333C9.63563 5.19844 9.70716 5.06475 9.73615 4.91919C9.76514 4.77362 9.75028 4.62273 9.69347 4.48561C9.63665 4.3485 9.54043 4.23132 9.41699 4.14892C9.29354 4.06651 9.14842 4.02259 9 4.02271H4.5C4.30109 4.02271 4.11032 4.10172 3.96967 4.24238C3.82902 4.38303 3.75 4.57379 3.75 4.77271V9.27271C3.74988 9.42113 3.79381 9.56625 3.87621 9.68969C3.95861 9.81314 4.07579 9.90936 4.21291 9.96617C4.35002 10.023 4.50092 10.0378 4.64648 10.0089C4.79204 9.97986 4.92573 9.90834 5.03063 9.80333L6.75 8.08302L9.21938 10.5533C9.36011 10.6941 9.55098 10.7731 9.75 10.7731C9.94902 10.7731 10.1399 10.6941 10.2806 10.5533C10.4214 10.4126 10.5004 10.2217 10.5004 10.0227C10.5004 9.82368 10.4214 9.63281 10.2806 9.49208L7.81031 7.02271ZM19.5 4.02271H15C14.8516 4.02259 14.7065 4.06651 14.583 4.14892C14.4596 4.23132 14.3633 4.3485 14.3065 4.48561C14.2497 4.62273 14.2349 4.77362 14.2639 4.91919C14.2928 5.06475 14.3644 5.19844 14.4694 5.30333L16.1897 7.02271L13.7194 9.49208C13.5786 9.63281 13.4996 9.82368 13.4996 10.0227C13.4996 10.2217 13.5786 10.4126 13.7194 10.5533C13.8601 10.6941 14.051 10.7731 14.25 10.7731C14.449 10.7731 14.6399 10.6941 14.7806 10.5533L17.25 8.08302L18.9694 9.80333C19.0743 9.90834 19.208 9.97986 19.3535 10.0089C19.4991 10.0378 19.65 10.023 19.7871 9.96617C19.9242 9.90936 20.0414 9.81314 20.1238 9.68969C20.2062 9.56625 20.2501 9.42113 20.25 9.27271V4.77271C20.25 4.57379 20.171 4.38303 20.0303 4.24238C19.8897 4.10172 19.6989 4.02271 19.5 4.02271ZM19.7869 14.5799C19.6498 14.523 19.499 14.5081 19.3535 14.537C19.208 14.5658 19.0743 14.6372 18.9694 14.7421L17.25 16.4624L14.7806 13.9921C14.6399 13.8513 14.449 13.7723 14.25 13.7723C14.051 13.7723 13.8601 13.8513 13.7194 13.9921C13.5786 14.1328 13.4996 14.3237 13.4996 14.5227C13.4996 14.7217 13.5786 14.9126 13.7194 15.0533L16.1897 17.5227L14.4694 19.2421C14.3644 19.347 14.2928 19.4807 14.2639 19.6262C14.2349 19.7718 14.2497 19.9227 14.3065 20.0598C14.3633 20.1969 14.4596 20.3141 14.583 20.3965C14.7065 20.4789 14.8516 20.5228 15 20.5227H19.5C19.6989 20.5227 19.8897 20.4437 20.0303 20.303C20.171 20.1624 20.25 19.9716 20.25 19.7727V15.2727C20.25 15.1244 20.206 14.9794 20.1235 14.8561C20.0411 14.7327 19.9239 14.6366 19.7869 14.5799Z"
                              fill="white"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default MeetingComponent;
