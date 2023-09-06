export type ActivityAvailabilityFieldType = {
  stages: {
    id?: number;
    activity_type: string;
    availability: 'Busy' | 'Free';
    icon_type: string;
    icon: string;
  }[];
};
