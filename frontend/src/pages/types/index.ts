export type apiResponseType = {
  data: any;
  message: string;
  toast: boolean;
  responseType: string;
};

export type FollowEntityType = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  profile_image: string;
  user_roles: {
    role: {
      name: string;
    };
    role_id: number;
  }[];
};

export type FollowingEntitiesType = {
  id: number;
  follower_id: number;
  lead_id: number;
  organization_id: number;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: null;
  lead?: {
    id: number;
    is_deal: boolean;
    name: string;
  };
  deal?: {
    id: number;
    is_deal: boolean;
    name: string;
  };
  account?: {
    id: number;
    name: string;
  };
  contact?: {
    id: number;
    name: string;
  };
  activity?: {
    id: number;
    topic: string;
  };
};
