import Icon from 'components/Icon';
import { useEffect, useRef, useState } from 'react';
import { getPresignedImageUrl } from 'services/wasabi.service';

interface Props {
  path: string;
  type?: string;
  handleView?: () => void;
}

function MeetingReport(props: Props) {
  const { path, handleView, type = 'video' } = props;
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoControls, setVideoControls] = useState(false);
  const [videoLength, setVideoLength] = useState('0:00');
  const videoRef = useRef<HTMLVideoElement>(null);

  const generateVideoUrl = async () => {
    const url = await getPresignedImageUrl(path);
    setVideoUrl(url);
  };
  useEffect(() => {
    generateVideoUrl();
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <>
      <div className="top__header flex items-center mb-[15px]">
        <h3 className="text-darkTextColorSD text-[18px] font-biotif__Medium w-full whitespace-pre overflow-hidden text-ellipsis">
          Meeting Report
        </h3>
        <div className="inline-flex items-center shrink-0 ml-[14px]">
          <span className="inline-block text-sdNormal__textColor text-[14px] font-biotif__Medium">
            {videoLength}
          </span>
          <button className="view__btn ml-[12px]" onClick={handleView}>
            <Icon
              className="w-[32px] h-[32px] rounded-[6px] p-[7px] shadow-[1px_1px_3px_0px_#cfcfcfe5,_-1px_-1px_2px_0px_#ffffffe5,_1px_-1px_2px_0px_#cfcfcf33,_-1px_1px_2px_0px_#cfcfcf33] duration-300 hover:bg-primaryColorSD"
              iconType="viewIcon"
            />
          </button>
        </div>
      </div>
      <div className="video__box w-full mb-[15px]">
        {path ? (
          <div>
            {videoUrl && type === 'audio' && (
              <div className="mt-[25px]">
                <audio
                  style={{ width: '100%' }}
                  controls
                  onLoadedMetadata={(e: any) => {
                    setVideoLength(formatTime(e.target.duration));
                  }}
                >
                  <source src={videoUrl} type="audio/ogg" />
                  <track kind="captions" />
                </audio>
              </div>
            )}
            {type === 'video' && videoUrl && (
              <video
                ref={videoRef}
                controls={videoControls}
                onLoadedMetadata={(e: any) => {
                  setVideoLength(formatTime(e.target.duration));
                }}
              >
                <source src={videoUrl} />
                <track kind="captions" />
              </video>
            )}
            {type === 'video' && !videoControls && (
              <div className="cover__wrapper">
                <button
                  className="play__btn"
                  onClick={() => {
                    if (videoRef.current) videoRef.current.play();
                    setVideoControls(true);
                  }}
                >
                  <Icon className="w-[45px] h-[45px]" iconType="videoPlayBtn" />
                </button>
              </div>
            )}
            {type === 'video' && videoControls && (
              <button
                className="paush__btn !hidden"
                onClick={() => {
                  if (videoRef.current) videoRef.current.pause();
                  setVideoControls(false);
                }}
              >
                pause
              </button>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
}

export default MeetingReport;
