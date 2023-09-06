// ======================================================
import { PermissionObj } from '../types/profile-permissions.types';

export const modifyPermissionData = (data: PermissionObj[]) => {
  const permissionSectionObj: {
    [key: string]: { [key: string]: PermissionObj[] };
  } = {};
  const typedData = data;
  const parentSections: { [key: string]: PermissionObj[] } = {};

  // first diff parent section wise
  typedData.forEach((obj) => {
    if (obj.parent_section && parentSections[obj.parent_section]) {
      parentSections[obj.parent_section] = [
        ...parentSections[obj.parent_section],
        obj,
      ];
    } else if (obj.parent_section) {
      parentSections[obj.parent_section] = [obj];
    }
  });

  // second diff parent with child section
  Object.keys(parentSections).forEach((key) => {
    parentSections[key].forEach((obj) => {
      if (
        obj.child_section &&
        permissionSectionObj[key] &&
        permissionSectionObj[key][obj.child_section]
      ) {
        permissionSectionObj[key][obj.child_section] = [
          ...permissionSectionObj[key][obj.child_section],
          obj,
        ];
      } else if (permissionSectionObj[key] && obj.child_section) {
        permissionSectionObj[key] = {
          ...permissionSectionObj[key],
          [obj.child_section]: [obj],
        };
      } else if (obj.child_section) {
        permissionSectionObj[key] = {
          [obj.child_section]: [obj],
        };
      }
    });
  });
  return permissionSectionObj;
};
