
export interface ZoomPhoneSoketEvent {
  event: ZoomPhonStatusEnum;
  userId: string;
  call_id: string;
  ringing_start_time: string;
  phoneNumber: string;
  userName: string;
}
export enum ZoomPhonStatusEnum {
    caller_ringing = 'phone.caller_ringing',
    caller_connected = 'phone.caller_connected',
    recording_started = 'phone.recording_started',
    caller_ended = 'phone.caller_ended',
    recording_completed = 'phone.recording_completed',
    caller_call_log_completed = 'phone.caller_call_log_completed',
    recording_transcript_completed = 'phone.recording_transcript_completed',
    callee_missed = 'phone.callee_missed',
    callee_ringing = 'phone.callee_ringing',
    callee_answered = 'phone.callee_answered',
    callee_call_log_completed = 'phone.callee_call_log_completed',
    callee_ended = 'phone.callee_ended',
    caller_hold = 'phone.caller_hold',
    caller_unhold = 'phone.caller_unhold',
    callee_hold = 'phone.callee_hold',
    callee_unhold = 'phone.callee_unhold',
    callee_unmute = 'phone.callee_unmute',
    callee_mute = 'phone.callee_mute',
    caller_unmute = 'phone.caller_unmute',
    caller_mute = 'phone.caller_mute',
    callee_rejected = 'phone.callee_rejected',
    caller_rejected = 'phone.caller_rejected'
  }