export interface CallStatus {
  idle?: boolean;
  connecting?: boolean;
  inProgress?: boolean;
  accepted?: boolean;
  ended?: boolean;
  failed?: boolean;
  inComing?: boolean;
}
