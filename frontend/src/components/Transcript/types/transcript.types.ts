export interface MeetingStateType {
  meetingType: 'audio' | 'video';
  isControlsVisible: boolean;
  isLoaded: boolean;
  isPaused: boolean;
  isFullScreen: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackSpeed: number;
}

export interface TranscriptStateType {
  utterances: Array<any>;
  autoScroll: boolean;
  currentPosition: 'CENTER' | 'TOP' | 'BOTTOM';
  searchVal: string;
  searchIds: { uId: number; wId: number };
}

export interface MeetingRef {
  updateMeetingTime: (time: number) => void;
}

export interface RecordingTranscriptProps {
  meetingType: 'audio' | 'video';
  path: string | null;
  transcript_path: string | null;
  summary?: string | null;
}
