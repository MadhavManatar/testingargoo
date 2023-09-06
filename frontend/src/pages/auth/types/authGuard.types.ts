import {
  ActivityPermissions,
  BasicPermissionTypes,
  ModuleNames,
  TagPermissions,
} from 'constant/permissions.constant';

export enum permissionOperatorEnum {
  AND = 'AND',
  OR = 'OR',
}

export interface AuthGuardProps {
  permissions?: {
    module?: ModuleNames;
    type?: BasicPermissionTypes | TagPermissions | ActivityPermissions;
  }[];
  operator?: permissionOperatorEnum;
  isAccessible?: boolean;
  children: JSX.Element;
}
