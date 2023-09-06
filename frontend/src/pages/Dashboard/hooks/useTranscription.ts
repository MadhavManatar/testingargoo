import { useRef, useState } from 'react';
import { REACT_APP_DEEPGRAM_KEY } from 'config';

const DG_API_KEY = REACT_APP_DEEPGRAM_KEY || '';
const DG_ENDPOINT = 'wss://api.deepgram.com/v1/listen?profanity_filter=true';

export interface CaptionObj {
  id: number;
  user: 'local' | 'remote';
  value: string;
}

const useTranscription = () => {
  const localSocketRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localMediaRecorderRef = useRef<MediaRecorder | null>(null);

  const remoteSocketRef = useRef<WebSocket | null>();
  const remoteMediaRecorderRef = useRef<MediaRecorder | null>(null);

  const [isCaptionOn, setIsCaptionOn] = useState(false);
  const [captions, setCaptions] = useState<CaptionObj[]>([]);

  const appendCaption = (caption: CaptionObj) => {
    setCaptions((prev) => [...prev, caption]);

    setTimeout(
      () => setCaptions((prev) => prev.filter((c) => c.id !== caption.id)),
      6000
    );
  };

  /* Local */
  const startLocalTranscription = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    localStreamRef.current = localStream;

    const localMediaRecorder = new MediaRecorder(localStream, {
      mimeType: 'audio/webm',
    });
    localMediaRecorderRef.current = localMediaRecorder;

    const localSocket = new WebSocket(DG_ENDPOINT, ['token', DG_API_KEY]);

    localSocketRef.current = localSocket;

    localSocket.onopen = () => {
      localMediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0 && localSocket.readyState === 1) {
          localSocket.send(event.data);
        }
      });
      localMediaRecorder.start(250);
    };

    localSocket.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.channel) {
        const { is_final } = data;

        const { transcript } = data.channel.alternatives[0];

        if (transcript && is_final) {
          appendCaption({ id: Date.now(), user: 'local', value: transcript });
        }
      }
    };
    localSocket.onclose = () => console.log('HELLO DISCONNECTED');
  };

  const endLocalTranscription = () => {
    const localSocket = localSocketRef.current;
    const localStream = localStreamRef.current;
    const localMediaRecorder = localMediaRecorderRef.current;

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (localMediaRecorder && localMediaRecorder.state !== 'inactive') {
      localMediaRecorder.stop();
      localMediaRecorderRef.current = null;
    }

    if (localSocket) {
      localSocket.close();
      localSocketRef.current = null;
    }
  };
  /*  */

  /* Remote */
  const startRemoteTranscription = async () => {
    const remoteAudio = document.getElementById(
      'remoteAudio'
    ) as HTMLMediaElement;
    const remoteStream = remoteAudio.srcObject as MediaStream;

    const remoteMediaRecorder = new MediaRecorder(remoteStream, {
      mimeType: 'audio/webm',
    });
    remoteMediaRecorderRef.current = remoteMediaRecorder;

    const remoteSocket = new WebSocket(DG_ENDPOINT, ['token', DG_API_KEY]);
    remoteSocketRef.current = remoteSocket;

    remoteSocket.onopen = () => {
      if (remoteMediaRecorder) {
        remoteMediaRecorder.addEventListener('dataavailable', (event) => {
          if (event.data.size > 0 && remoteSocket.readyState === 1) {
            remoteSocket.send(event.data);
          }
        });
        remoteMediaRecorder.start(250);
      }
    };

    remoteSocket.onmessage = (message) => {
      const data = JSON.parse(message.data);

      if (data.channel) {
        const { is_final } = data;
        const { transcript } = data.channel.alternatives[0];

        if (transcript && is_final) {
          appendCaption({ id: Date.now(), user: 'remote', value: transcript });
        }
      }
    };

    remoteSocket.onclose = () => console.log('HELLO DISCONNECTED2');
  };

  const endRemoteTranscription = () => {
    const remoteSocket = remoteSocketRef.current;
    const remoteMediaRecorder = remoteMediaRecorderRef.current;

    if (remoteMediaRecorder && remoteMediaRecorder.state !== 'inactive') {
      remoteMediaRecorder.stop();
      remoteMediaRecorderRef.current = null;
    }

    if (remoteSocket) {
      remoteSocket.close();
      remoteSocketRef.current = null;
    }
  };
  /*  */

  const startTranscription = () => {
    setIsCaptionOn(true);

    if (!DG_API_KEY) return console.log('KEY Required, Captions Not enabled');

    startLocalTranscription();
    startRemoteTranscription();
  };

  const endTranscription = () => {
    setIsCaptionOn(false);

    if (!DG_API_KEY) return;

    endLocalTranscription();
    endRemoteTranscription();
  };

  return { isCaptionOn, captions, startTranscription, endTranscription };
};

export default useTranscription;
