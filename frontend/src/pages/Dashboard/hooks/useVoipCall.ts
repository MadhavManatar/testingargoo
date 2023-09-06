import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import JsSIP from 'jssip';
import { AnswerOptions, RTCSession } from 'jssip/lib/RTCSession';
import { CallOptions, UAConfiguration } from 'jssip/lib/UA';

import { REACT_APP_SIP_URI } from 'config';
import { getCurrentUser } from 'redux/slices/authSlice';
import { CallStatus } from '../types/voip.types';
import { useCreateUserSIP } from '../services/voip.service';
import useTranscription from './useTranscription';

const callOptions: AnswerOptions = {
  mediaConstraints: { audio: true, video: false },
  pcConfig: { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] },
  rtcAnswerConstraints: {
    iceRestart: true,
    offerToReceiveAudio: true,
    offerToReceiveVideo: false,
  },
  rtcOfferConstraints: {
    iceRestart: true,
    offerToReceiveAudio: true,
    offerToReceiveVideo: false,
  },
};

const initialCallStatus = {
  idle: false,
  connecting: false,
  inProgress: false,
  accepted: false,
  ended: false,
  inComing: false,
};

const sipURL = REACT_APP_SIP_URI;

const useVoipCall = () => {
  const user = useSelector(getCurrentUser);
  const { createUserSipAPI } = useCreateUserSIP();

  const { isCaptionOn, captions, startTranscription, endTranscription } =
    useTranscription();

  const UARef = useRef<JsSIP.UA | null>(null);

  const [UA, setUA] = useState<JsSIP.UA | null>(null);
  const [callObj, setCallObj] = useState<RTCSession | null>(null);

  const [callStatus, setCallStatus] = useState<CallStatus>(initialCallStatus);
  const [callerName, setCallerName] = useState('');

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);

  const localAudio = document.getElementById('localAudio') as HTMLMediaElement;
  const remoteAudio = document.getElementById(
    'remoteAudio'
  ) as HTMLMediaElement;

  useEffect(() => {
    if (!user) return;

    const { UserSIP } = user;
    if (Array.isArray(UserSIP) && UserSIP.length) {
      const { username, password } = UserSIP[0];
      return connectVoip({ username, password });
    }
    connectNewVoip();
  }, []);

  useEffect(() => {
    if (UA) initializeUAObject();

    return () => {
      if (UA) UA.stop();
    };
  }, [UA]);

  useEffect(() => {
    if (callObj) initializeCallObj();
  }, [callObj]);

  /* End Call On Browser Unload */
  useEffect(() => {
    const unloadCallback = () => {
      if (UARef.current) UARef.current.stop();
      return true;
    };
    window.addEventListener('beforeunload', unloadCallback);
    return () => window.removeEventListener('beforeunload', unloadCallback);
  }, []);

  const updateCallStatus = (status: CallStatus) => {
    setCallStatus({
      idle: false,
      connecting: false,
      inProgress: false,
      accepted: false,
      ...status,
    });
  };

  const connectNewVoip = async () => {
    const { data, error } = await createUserSipAPI();
    if (!error && data) {
      const { username, password } = data;
      return connectVoip({ username, password });
    }
    console.log('***** VOIP NOT CONNECTED ******');
  };

  const connectVoip = (data: { username: string; password: string }) => {
    const { username, password } = data;

    // JsSIP.debug.enable('JsSIP:*');

    const socket = new JsSIP.WebSocketInterface(`wss://${sipURL}`);
    const configuration: UAConfiguration = {
      sockets: [socket],
      uri: `sip:${username}@${sipURL}`,
      password,
      display_name: username,
    };

    const uaObj = new JsSIP.UA(configuration);

    setUA(uaObj);
    UARef.current = uaObj;
  };

  const initializeUAObject = () => {
    if (!UA) return;

    UA.on('registrationFailed', (ev: any) => {
      console.log(`Registering on SIP server failed with error: ${ev.cause}`);
    });

    UA.on('connected', () => {
      console.log('Connected on SIP');
    });

    UA.on('disconnected', () => {
      console.log(`Disconnected on SIP`);
    });

    UA.on('newRTCSession', (ev: any) => {
      const newSession = ev.session;

      if (callObj) {
        // hangup any existing call
        callObj.terminate();
        setCallStatus(initialCallStatus);
      }

      setCallObj(newSession);
      addStreaming(newSession);
    });

    UA.start();
  };

  const initializeCallObj = () => {
    if (!callObj) return;

    callObj.on('failed', () => {
      updateCallStatus({ failed: true });
      completeSession();
    });

    callObj.on('connecting', () => {
      updateCallStatus({ connecting: true });
    });

    callObj.on('progress', () => {
      updateCallStatus({ inProgress: true });
      setCallTimer(callObj);
    });

    callObj.on('accepted', () => {
      updateCallStatus({ accepted: true });
    });

    callObj.on('ended', () => {
      endTranscription();

      updateCallStatus({ ended: true });
      completeSession();
    });

    callObj.on('confirmed', () => {
      if (callObj) {
        const localStream = (callObj.connection as any).getLocalStreams()[0];
        const dtmfSender = (callObj.connection as any).createDTMFSender(
          localStream.getAudioTracks()[0]
        );
        callObj.sendDTMF = (tone: any) => dtmfSender.insertDTMF(tone);
      }
    });

    callObj.on('reinvite', () => {
      /*  */
    });

    callObj.on('sdp', () => {
      /*  */
    });

    callObj.on('peerconnection', () => {
      addStreaming(callObj);
      callObj?.renegotiate();
    });

    if (callObj.direction === 'incoming') {
      setCallStatus((prev) => ({ ...prev, inComing: true }));
    }
  };

  const addStreaming = (call: RTCSession | null) => {
    if (!call) return;

    call.connection?.addEventListener('addstream', (e: any) => {
      remoteAudio.srcObject = e.stream;
      localAudio.srcObject = e.stream;
    });
  };

  const sendDTMF = (value: number | string) => {
    if (callObj) {
      callObj.sendDTMF(value);
    }
  };

  const makeCall = (number: string) => {
    if (!UA) {
      return console.log('Call Not Connect..');
    }

    if (!number) return;

    const eventHandlers = {
      progress: () => {
        /*  */
      },
      failed: () => {
        /*  */
      },
      confirmed: () => {
        /*  */
      },
      ended: () => {
        /*  */
      },
    };

    const outGoingCallOptions: CallOptions = {
      eventHandlers,
      mediaConstraints: { audio: true, video: false },
      pcConfig: {
        rtcpMuxPolicy: 'require',
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
      },
    };

    setCallerName(number);
    UA.call(number, outGoingCallOptions);
  };

  const setCallTimer = (session: RTCSession) => {
    setTimeout(() => {
      if (session?.status === 2) {
        endCall();
        setCallStatus({ failed: true });
      }
    }, 30 * 1000);
  };

  const muteAudio = () => {
    if (callObj) {
      setIsAudioMuted(true);
      callObj.mute({ audio: true });
    }
  };

  const unmuteAudio = () => {
    if (callObj) {
      setIsAudioMuted(false);
      callObj.unmute({ audio: true });
    }
  };

  const holdCall = () => {
    if (callObj) {
      setIsOnHold(true);
      callObj.hold();
    }
  };
  const unHoldCall = () => {
    if (callObj) {
      setIsOnHold(false);
      callObj.unhold();
    }
  };

  const onCaption = () => {
    startTranscription();
  };

  const offCaption = () => {
    endTranscription();
  };

  const endCall = () => {
    endTranscription();

    if (callObj) {
      callObj.terminate();
      setCallerName('');
      updateCallStatus({ idle: true });
    }
  };

  const answerCall = (isAccepted: boolean) => {
    if (!callObj) return;

    if (isAccepted) {
      callObj.answer(callOptions);
    } else {
      /* Call Not Answered */
      // callObj.terminate();
    }
  };

  const completeSession = () => setCallObj(null);

  return {
    captions,
    isAudioMuted,
    isOnHold,
    isCaptionOn,
    callerName,
    callStatus,
    setCallStatus,
    sendDTMF,
    makeCall,
    answerCall,
    muteAudio,
    unmuteAudio,
    holdCall,
    unHoldCall,
    onCaption,
    offCaption,
    endCall,
  };
};

export default useVoipCall;
