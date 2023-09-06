import { activitiesResponse } from 'pages/Dashboard/types/dashboard.types';

export interface UpcomingActivitiesSectionProps {
  setPageInfo: React.Dispatch<
    React.SetStateAction<{
      page: number;
      hasMore: boolean;
    }>
  >;
  pageInfo: {
    page: number;
    hasMore: boolean;
  };
  setRecentLogsFlag: React.Dispatch<React.SetStateAction<boolean>>;
  refresh?:boolean
}

export type activityModalType = {
  add: boolean;
  edit: boolean;
  view: boolean;
  complete: boolean;
  id: number;
  activityTopic?: string;
  activityTypeId?: number;
};

export type SingleActivitySectionProps = {
  activity: activitiesResponse;
  row?: number;
  aIndex: number;
  setOpenModal: React.Dispatch<React.SetStateAction<activityModalType>>;
  handleActivityClick: any;
  permissionArray: any;
};
