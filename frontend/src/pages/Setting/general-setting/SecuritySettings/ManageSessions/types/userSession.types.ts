export type DeviceData = {
  os: {
    name: string;
    version: string;
    short_name: string;
    platform: string;
    family: string;
  };
  client: {
    type: string;
    name: string;
    short_name: string;
    version: string;
    engine: string;
    engine_version: string;
    family: string;
  };
  device: {
    id: string;
    type: string;
    brand: string;
    model: string;
  };
};

export type UserSession = {
  id: string;
  value: {
    sessionId: string;
    deviceData: DeviceData;
    sessions: {
      ip: string;
      user_id: number;
    }[];
    organizations: {
      id: number;
      uuid: string;
      owner_id: number;
    }[];
    roles: {
      role_id: number;
      is_system: boolean;
      organizationUUID: string;
    }[];
    user_id: number;
    first_name: string;
    email: string;
    last_name: string;
    username: null | string;
    full_name: string;
    timezone: string;
    verified: boolean;
    activeOrganization: string;
  };
};
