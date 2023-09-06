export type KeepEmailTimelineModalType = {
  isOpen: boolean;
  data: any;
};

export interface KeepEmailTimelineModalProps {
  data: any;
  isOpen: boolean;
  keepTimeline: () => void;
  closeModal: () => void;
}
