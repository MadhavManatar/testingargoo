import {
  ActivityPermissions,
  BasicPermissionTypes,
  ModuleNames,
  TagPermissions,
} from 'constant/permissions.constant';
import { permissionOperatorEnum } from 'pages/auth/types/authGuard.types';
import { isOrganizationOwner } from 'utils/is';
import store from 'redux/store';

export const hasAuthorized = (
  permissions: {
    module?: ModuleNames;
    type?:
      | BasicPermissionTypes
      | TagPermissions
      | ActivityPermissions
      | ModuleNames;
  }[],
  operator: permissionOperatorEnum = permissionOperatorEnum.AND
) => {
  const isOrgOwner = isOrganizationOwner();
  if (isOrgOwner) {
    return true;
  }
  const currentUserPermissions = store.getState().auth.permissions;

  if (operator === permissionOperatorEnum.AND) {
    return permissions.every((permission) =>
      currentUserPermissions?.some(
        (currModule) =>
          currModule.name === permission.module &&
          currModule.permissions.find((per) => per.name === permission.type)
            ?.status === 'ACTIVE'
      )
    );
  }
  return permissions.some((permission) =>
    currentUserPermissions?.some(
      (currModule) =>
        currModule.name === permission.module &&
        currModule.permissions.find((per) => per.name === permission.type)
          ?.status === 'ACTIVE'
    )
  );
};
