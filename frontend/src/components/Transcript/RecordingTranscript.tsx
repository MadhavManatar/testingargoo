// ** Import Packages **
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';

// ** Components **
import MeetingComponent from 'components/Transcript/MeetingComponent';

// ** Types **
import {
  MeetingRef,
  MeetingStateType,
  RecordingTranscriptProps,
  TranscriptStateType,
} from 'components/Transcript/types/transcript.types';
import { getPresignedImageUrl } from 'services/wasabi.service';
import MeetingInformation from 'components/Transcript/MeetingInformation';

interface Props {
  playerModelData: RecordingTranscriptProps;
}

const RecordingTranscript = (props: Props) => {
  // ** Props **
  const { playerModelData } = props;

  // ** Refs **
  const meetingRef = useRef<MeetingRef>(null);

  // ** States **
  const [meetingState, setMeetingState] = useState<MeetingStateType>({
    meetingType: playerModelData.meetingType,
    isControlsVisible: true,
    isLoaded: false,
    isPaused: true,
    isFullScreen: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackSpeed: 1,
  });

  const [transcriptState, setTranscriptState] = useState<TranscriptStateType>({
    utterances: [],
    autoScroll: true,
    currentPosition: 'CENTER',
    searchVal: '',
    searchIds: { uId: -1, wId: -1 },
  });

  const [recodingUrlTranscriptData, setRecodingUrlTranscriptData] = useState<{
    url: string | null;
    transcript: Record<string, any> | null;
    summary: string | null;
  }>({
    url: null,
    transcript: null,
    summary: null,
  });

  // ** useEffect **
  const updateMeetingState = useCallback((data: Partial<MeetingStateType>) => {
    setMeetingState((prev) => ({ ...prev, ...data }));
  }, []);

  useEffect(() => {
    generateUrlTranscript();
  }, [playerModelData]);

  // ** Functions **
  const updateVideoTime = (time: number) => {
    if (meetingRef.current) {
      meetingRef.current.updateMeetingTime(time);
    }
  };

  const generateUrlTranscript = async () => {
    let videoUrl = null;
    let transcript = null;

    if (playerModelData.path) {
      videoUrl = await getPresignedImageUrl(playerModelData.path);
    }

    if (playerModelData.transcript_path) {
      const wasabiURl = await getPresignedImageUrl(
        playerModelData.transcript_path
      );

      const response = await axios.get(wasabiURl);
      transcript = response.data.transcript;
    }

    setRecodingUrlTranscriptData({
      url: videoUrl,
      transcript,
      summary: playerModelData?.summary || null,
    });
  };

  const skipToNextSpeaker = () => {
    const utterances = transcriptState.utterances || [];

    const nextSpeaker = utterances.find((u) => {
      return u.start > meetingState.currentTime;
    });

    updateVideoTime(nextSpeaker.start);
  };

  const updateTranscriptState = useCallback(
    (data: Partial<TranscriptStateType>) => {
      setTranscriptState((prev) => {
        return { ...prev, ...data };
      });
    },
    []
  );

  return (
    <div className="video-main-wrapper flex flex-wrap">
      {recodingUrlTranscriptData.url == null ||
      recodingUrlTranscriptData.transcript == null ? (
        <div className="loader__wrapper min-h-[calc(100vh_-_190px)] w-full flex items-center justify-center">
          <div className="page__round__loader" />
        </div>
      ) : (
        <>
          <MeetingComponent
            ref={meetingRef}
            url={recodingUrlTranscriptData.url}
            meetingState={meetingState}
            updateMeetingState={updateMeetingState}
            skipToNextSpeaker={skipToNextSpeaker}
          />

          <MeetingInformation
            currentTime={meetingState.currentTime}
            transcript={recodingUrlTranscriptData.transcript}
            summary={recodingUrlTranscriptData.summary}
            updateCurrentTime={updateVideoTime}
            transcriptState={transcriptState}
            updateTranscriptState={updateTranscriptState}
          />
        </>
      )}
    </div>
  );
};

export default RecordingTranscript;
