import {
  TimelineType,
  selectAllForActivityType,
} from 'components/EntityDetails/Timeline/types';

export type streamFormFieldsType = {
  id: number;
  name: string;
  user: string;
  created_by: string;
  creator: { first_name: string; last_name: string };
};

export type StreamDetails = streamFormFieldsType;

export type StreamFormValueType = {
  name: string;
  color: string;
};

export type StreamListSetType = {
  setStreamData: React.Dispatch<
    React.SetStateAction<StreamDataType | undefined>
  >;
  setUserIds: React.Dispatch<React.SetStateAction<string[]>>;
  setUserData: React.Dispatch<React.SetStateAction<UserData | undefined>>;
  selectedTab: React.Dispatch<
    React.SetStateAction<
      | {
          label: string | undefined;
          id: number | 0;
        }
      | undefined
    >
  >;
  streamData?: StreamDataType;
  isPolling: boolean | undefined;
  isEdit: boolean | undefined;
  setFilterState: React.Dispatch<
    React.SetStateAction<AllItemFilterState | undefined>
  >;
};

export type StreamResponse = {
  create?: boolean;
  id: number;
  tag: {
    id: number;
    name: string;
    color: string;
  };
};
export type StreamDataType = {
  id: number;
  name: string;
  streamUser: [
    {
      users: {
        full_name: string;
        id: string;
      };
      user_id: number;
    }
  ];
}[];
export type StreamDataTypeSingle = {
  id: number;
  name: string;
  streamUser: [
    {
      users: {
        full_name: string;
        id: string;
      };
      user_id: number;
    }
  ];
}[];
export type streamUser = [
  {
    users: {
      full_name: string;
      id: string;
    };
    user_id: number;
  }
];

export type streamUserDetail = {
  users: {
    full_name: string;
    id: string;
  };
  user_id: number;
}[];

export type streamUserData = {
  full_name: string;
  id: string;
}[];
export type streamLogFilter = [
  {
    name: string;
    id: string;
  }
];
export type EditStreamType = {
  id: number;
  name: string;
  streamUser: streamUser;
};
export type UserData = {
  count: number;
  rows: {
    full_name: string;
    id: string;
  }[];
};

export type tableType = {
  rowData: [
    {
      id: number;
      name: string;
      streamUser: [
        {
          users: {
            full_name: string;

            id: string;
          };
          user_id: number;
        }
      ];
    }
  ];
  rowCount: number;
};

export type tableTypeData = {
  rowData: [
    {
      id: number;
      name: string;
      streamUser: [
        {
          users: {
            full_name: string;

            id: string;
          };
          user_id: number;
        }
      ];
    }
  ];
};

export interface AddStreamModelPropsType {
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  streamData?: {
    id: number;
    name: string;
    streamUser: [
      {
        users: {
          full_name: string;
          id: string;
        };
        user_id: number;
      }
    ];
  };
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setEditStream?: React.Dispatch<
    React.SetStateAction<
      | {
          id: number;
          name: string;
          streamUser: [
            {
              users: {
                full_name: string;
                id: string;
              };
              user_id: number;
            }
          ];
        }
      | undefined
    >
  >;
  getStreamsData?: () => void;
  setAddStreamModal?: React.Dispatch<React.SetStateAction<boolean>>;
  addStreamModal: boolean;
}

export interface UserDataType {
  count: number;
  rows: {
    full_name: string;
    id: string;
  }[];
}

export interface UserDetailType {
  full_name: string;
  id: string;
}
export interface SelectedUser {
  full_name: string;
  id: string;
}
export type UserIds = [
  {
    new: string[];
    old?: string[];
    deleted?: string[];
  }
];
export interface AddUserType {
  isSelectUserVisible: boolean;
  setIsSelectUserVisible: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserData;
  pushIdIntoUserArray: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit?: () => void;
  userIdArray: string[];
  isFilleter?: boolean;
  setIsVisible?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFilleter?: React.Dispatch<React.SetStateAction<boolean>>;

  // searchUser?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface FilterType {
  tab?:
    | {
        label: string | undefined;
        id: number | 0;
      }
    | undefined;
  isFilterVisible: boolean;
  setIsSelectFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: () => void;
  setFilterState: React.Dispatch<
    React.SetStateAction<AllItemFilterState | undefined>
  >;
  filterState: AllItemFilterState | undefined;
  isFilleter?: boolean;
  activityTypeData?: any;
  logData?: streamLogFilter;
  setIsFilleter: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface SelectedLogType {
  name: string;
  id: string;
}
export interface SelectedItem {
  label: string;
  value: string;
}

export interface StreamManageModelType {
  streamData: any;
  setStreamData: React.Dispatch<any>;
  isNewList: React.Dispatch<React.SetStateAction<boolean>>;
  close: () => void;
}

export type StreamFilleterTypeReduxSlice = {
  sortStream: {
    streamData: StreamDataType;
    selectedUserIs: {
      [x: string]: any;
      [number: number]: string[];
    } | null;
  };
  tab?: { label: string; id: number };
  userIds: string[];
  userData: UserData;
  isPolling?: boolean;
  all_item?: {
    [number: number]: AllItemFilterState;
  };
};

export type AllItemFilter = {
  [number: number]: {
    activityTypeIds: number[];
    notes: boolean;
    documents: boolean;
    info: boolean;
    emails_sent: boolean;
    emails_received: boolean;
    selectAllForActivityType?: selectAllForActivityType;
    hideRelatedRecord: boolean;
  };
};

export type AllItemFilterState = {
  activityTypeIds: number[];
  notes: boolean;
  documents: boolean;
  info: boolean;
  emails_sent: boolean;
  emails_received: boolean;
  selectAllForActivityType?: selectAllForActivityType;
  hideRelatedRecord: boolean;
};

interface OriginalArgsParams {
  [key: string]: any;
}

export type TimelineEntry = {
  data: TimelineType[];
  endpointName: string;
  fulfilledTimeStamp: number;
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  isUninitialized: boolean;
  originalArgs: {
    params: OriginalArgsParams;
  };
  requestId: string;
  startedTimeStamp: number;
};
