export type ActivityTypeFieldType = {
  name: string;
  icon: string | File;
  icon_type: string;
  activity_result: {
    value: string | number;
    isCreatable: boolean;
  };
  parent_type: number | null;
  color: string;
  is_system: boolean;
  email_status: string;
};

export type ActivityTypeResponseType = {
  icon: string;
  icon_type: string;
  id: number;
  name: string;
  color: string;
  parent_type: {
    id: number;
    name: string;
  };
  is_system: boolean;
  is_default: boolean;
  parent_type_id: number;
  activity_result: { id: number; result: string };
  creator: { username: string; first_name: string; last_name: string };
};
