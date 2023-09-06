// =================== import packages ==================
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Option } from 'components/FormField/types/formField.types';

// ======================================================
import {
  Permission,
  PermissionObj,
} from 'pages/Setting/user-setting/ProfilePermissions/types/profile-permissions.types';

import { RootState } from 'redux/store';
import { clearBrowserCookiesAndStorage } from 'utils/util';

type status = 'ACTIVE' | 'INACTIVE';
type jsonObject = { [key: string]: any };

export interface UserInterface {
  id?: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  profile_image?: string | null;
  added_by?: number;
  birth_date?: Date;
  website?: string;
  fax?: string;
  gender?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  timezone?: string;
  country?: string;
  zip?: string;
  active?: status;
  verified: boolean;
  is_owner?: boolean;
  last_login_time?: Date;
  report_to?: number;
  apple_id?: number;
  google_id?: number;
  settings?: jsonObject;
  created_at?: Date;
  updated_at?: Date;
  is_deleted?: boolean;
  deleted_at?: Date;
  two_factor_enabled?: boolean;
  user_organizations?: {
    user_id: number;
    organization_id: number;
    organization: {
      name: string;
      uuid: string;
      owner_id: number;
    };
  }[];
  organization?: {
    user_id: number;
    organization_id: number;
    organization: {
      name: string;
      uuid: string;
      owner_id: number;
    };
  };
  user_roles?: { role_id: number; role: { name: string } }[];
  UserSIP?: {
    id: number;
    sip_id: string;
    username: string;
    password: string;
  }[];
  date_format?: string;
  initial_color?: string;
}

export interface ActivePermissionsInterface {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface AuthInterface {
  user?: UserInterface | null;
  reportTo?: { option: Option[]; count: number };
  hierarchyUsers?: UserInterface[];
  permissions?: ActivePermissionsInterface[];
  organizationUUID?: string | null;
  organizationId?: number | null;
  isAuthenticated?: boolean;
  isAuthInitialized?: boolean;
  version?: string | null;
  passExpired?: boolean;
}

// CODE ADD -----------------------
const initialState: AuthInterface = {
  user: null,
  permissions: [],
  organizationUUID: null,
  organizationId: null,
  isAuthenticated: false,
  isAuthInitialized: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state: AuthInterface, action: PayloadAction<AuthInterface>) {
      const { user } = action.payload;
      if (user) {
        state.isAuthenticated = true;
      }
    },
    setOrganizationUUID(state: AuthInterface, action: PayloadAction<string>) {
      const organizationUUID = action.payload;

      if (organizationUUID)
        localStorage.setItem('organization_uuid', organizationUUID);
      else localStorage.removeItem('organization_uuid');

      state.organizationUUID = organizationUUID;
    },
    setPermissions(
      state: AuthInterface,
      action: PayloadAction<PermissionObj[]>
    ) {
      const updatedPermissions = action.payload.reduce(
        (prevModules: ActivePermissionsInterface[], currModule) => {
          const isActive = currModule.permissions.some(
            (permission) => permission.status === 'ACTIVE'
          );
          if (isActive) {
            prevModules.push({
              id: currModule.id,
              name: currModule.name,
              permissions: currModule.permissions,
            });
          }
          return prevModules;
        },
        []
      );
      state.permissions = updatedPermissions;
    },
    setAuthInitialized(state: AuthInterface) {
      state.isAuthInitialized = true;
    },
    setAuthenticated(
      state: AuthInterface,
      action: PayloadAction<AuthInterface>
    ) {
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setUserData(state: AuthInterface, action: PayloadAction<AuthInterface>) {
      state.user = action.payload.user;
    },
    setReportTo(state: AuthInterface, action: PayloadAction<AuthInterface>) {
      state.reportTo = action.payload.reportTo;
    },
    setHierarchyUsers(
      state: AuthInterface,
      action: PayloadAction<AuthInterface>
    ) {
      state.hierarchyUsers = action.payload.hierarchyUsers;
    },
    setUserProfile(state: AuthInterface, action: PayloadAction<string>) {
      if (state.user) state.user.profile_image = action.payload;
    },
    setUserDateFormat(state: AuthInterface, action: PayloadAction<string>) {
      if (state.user) state.user.date_format = action.payload;
    },
    setCredentials(state: AuthInterface, action: PayloadAction<AuthInterface>) {
      const { user } = action.payload;
      if (user) {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    },
    setUserVerified(state: AuthInterface) {
      if (state.user) state.user.verified = true;
      else state.user = { verified: true };
    },
    setLogoutData(state: AuthInterface) {
      state.permissions = [];
      state.organizationUUID = null;
      state.user = null;
      state.isAuthenticated = false;
      clearBrowserCookiesAndStorage();
    },
    setVersionNumber(
      state: AuthInterface,
      action: PayloadAction<AuthInterface>
    ) {
      const { version } = action.payload;
      if (version) {
        state.version = action.payload.version;
        state.isAuthenticated = true;
      }
    },

    setPassWordExpired(
      state: AuthInterface,
      action: PayloadAction<AuthInterface>
    ) {
      state.passExpired = action.payload.passExpired;
    },
  },
});

export const { reducer } = slice;

export const {
  setCredentials,
  setLogoutData,
  setAccessToken,
  setPermissions,
  setAuthenticated,
  setOrganizationUUID,
  setAuthInitialized,
  setUserData,
  setReportTo,
  setHierarchyUsers,
  setUserVerified,
  setUserProfile,
  setUserDateFormat,
  setVersionNumber,
  setPassWordExpired,
} = slice.actions;

export const getAuth = (state: RootState) => state.auth;
export const getIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const getOrganizationUUID = (state: RootState) =>
  state.auth.organizationUUID;

export const getCurrentUser = (state: RootState) => state.auth.user;
export const getCurrentOrganizationId = (state: RootState) =>
  state.auth.organizationId;
export const getCurrentUserDateFormat = (state: RootState) =>
  state.auth.user?.date_format;
export const getCurrentUserProfileImage = (state: RootState) =>
  state.auth.user?.profile_image;
export const getCurrentUserProfile = createSelector(getCurrentUser, (state) => {
  if (state && state.user_roles) {
    return { id: state.user_roles?.[0].role_id };
  }
  return { id: null };
});

export const getReportToUser = (state: RootState) => state.auth.reportTo;

export const getHierarchyUsers = (state: RootState) =>
  state.auth.hierarchyUsers;

export const getCurrentUserPermissions = (state: RootState) =>
  state.auth.permissions || [];

export const getCurrentUserPermissionsIds = createSelector(
  getCurrentUserPermissions,
  (state) => state.map((p) => p.id)
);
export const getDetailSection = (state: RootState) => state.common.module;
export const getCurrentVersion = (state: RootState) => state.auth.version;

export const getPassExpired = (state: RootState) => state.auth.passExpired;

export default slice;
