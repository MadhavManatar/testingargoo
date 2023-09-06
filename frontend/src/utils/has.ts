// ======================================================
import { isAdministrator, isOrganizationOwner, isSelfId } from './is';

export const hasPermissionForChangeUser = (
  userId: number | null,
  profileName?: string
) => {
  if (userId) {
    if (
      (isSelfId(userId) || !isAdministrator(profileName)) &&
      !isAdministrator()
    ) {
      return true;
    }
    if (isOrganizationOwner()) {
      if (isSelfId(userId)) return true;
      return false;
    }
    if (isAdministrator()) {
      if (isOrganizationOwner(userId)) return true;
      return false;
    }
    return true;
  }
  return false;
};

export const hasPermissionForChangeProfileName = (profileName?: string) => {
  if (profileName) {
    if (!isAdministrator(profileName)) {
      return false;
    }
    return true;
  }
  return false;
};
