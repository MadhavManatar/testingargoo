import { IconTypes } from 'components/Icon';

export type StayInTouchType = {
  activity_type: number;
  frequency: string;
  scheduled_time: string;
  week_occurrence: number;
  week_day: number;
  interval: number;
};

export type scheduleActivityResponse = {
  Activity?: any[];
  id?: number;
  activity_type_id?: number;
  frequency: string;
  start_date: string;
  activity_type?: {
    id: number;
    name: string;
    icon: IconTypes;
    icon_type?: string;
  };
  week_occurrence?: number;
  interval: number;
  month_date_type?: string;
};

export type StayInTouchReminderProps = {
  activityName?: string;
  info: scheduleActivityResponse;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  model_record_id: number | null;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
  accordion: {
    [key: string]: boolean;
  };
  openCloseAccordion: (accType: string) => void;
};
