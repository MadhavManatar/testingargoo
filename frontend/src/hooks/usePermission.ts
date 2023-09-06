// ** Hook **
import useAuth from './useAuth';

// ** Constant **
import { MODULE_PERMISSION } from 'constant/permissions.constant';

const usePermission = () => {
  const { hasAuthorized } = useAuth();
//* * All trash module */

const readAllPermission = hasAuthorized([
  {...MODULE_PERMISSION.ALL.read},
]);
const updateAllPermission = hasAuthorized([
  {...MODULE_PERMISSION.ALL.update},
]);
const deleteAllPermission = hasAuthorized([
  {...MODULE_PERMISSION.ALL.delete},
]);

  // ** Lead Module **
  const readLeadPermission = hasAuthorized([
    { ...MODULE_PERMISSION.LEAD.read },
  ]);

  const createLeadPermission = hasAuthorized([
    { ...MODULE_PERMISSION.LEAD.create },
  ]);

  const updateLeadPermission = hasAuthorized([
    { ...MODULE_PERMISSION.LEAD.update },
  ]);

  const deleteLeadPermission = hasAuthorized([
    { ...MODULE_PERMISSION.LEAD.delete },
  ]);

  // ** Contact Module **
  const readContactPermission = hasAuthorized([
    { ...MODULE_PERMISSION.CONTACT.read },
  ]);

  const createContactPermission = hasAuthorized([
    { ...MODULE_PERMISSION.CONTACT.create },
  ]);

  const updateContactPermission = hasAuthorized([
    { ...MODULE_PERMISSION.CONTACT.update },
  ]);

  const deleteContactPermission = hasAuthorized([
    { ...MODULE_PERMISSION.CONTACT.delete },
  ]);

  // ** Deal Module **
  const readDealPermission = hasAuthorized([
    { ...MODULE_PERMISSION.DEAL.read },
  ]);

  const createDealPermission = hasAuthorized([
    { ...MODULE_PERMISSION.DEAL.create },
  ]);

  const updateDealPermission = hasAuthorized([
    { ...MODULE_PERMISSION.DEAL.update },
  ]);

  const deleteDealPermission = hasAuthorized([
    { ...MODULE_PERMISSION.DEAL.delete },
  ]);

  // ** Account Module **
  const readAccountPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ACCOUNT.read },
  ]);

  const createAccountPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ACCOUNT.create },
  ]);

  const updateAccountPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ACCOUNT.update },
  ]);

  const deleteAccountPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ACCOUNT.delete },
  ]);

  // ** Activity Module **
  const readActivityPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ACTIVITY.read },
  ]);

  const createActivityPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ACTIVITY.create },
  ]);

  const updateActivityPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ACTIVITY.update },
  ]);

  const deleteActivityPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ACTIVITY.delete },
  ]);

  // ** Note Functionality **
  const readNotePermission = hasAuthorized([
    { ...MODULE_PERMISSION.NOTE.read },
  ]);

  const createNotePermission = hasAuthorized([
    { ...MODULE_PERMISSION.NOTE.create },
  ]);

  const updateNotePermission = hasAuthorized([
    { ...MODULE_PERMISSION.NOTE.update },
  ]);

  const deleteNotePermission = hasAuthorized([
    { ...MODULE_PERMISSION.NOTE.delete },
  ]);

  // ** Document Functionality **
  const readDocumentPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ATTACHMENT.read },
  ]);

  const createDocumentPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ATTACHMENT.create },
  ]);

  const deleteDocumentPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ATTACHMENT.delete },
  ]);

  // ** Tag Functionality **
  const tagForLeadPermission = hasAuthorized([
    { ...MODULE_PERMISSION.TAG.lead },
  ]);

  const tagForContactPermission = hasAuthorized([
    { ...MODULE_PERMISSION.TAG.contact },
  ]);

  const tagForDealPermission = hasAuthorized([
    { ...MODULE_PERMISSION.TAG.deal },
  ]);

  const tagForAccountPermission = hasAuthorized([
    { ...MODULE_PERMISSION.TAG.account },
  ]);

  const tagForActivityPermission = hasAuthorized([
    { ...MODULE_PERMISSION.TAG.activity },
  ]);

  // ** Organization Module **
  const readOrganizationPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ORGANIZATION.read },
  ]);

  const updateOrganizationPermission = hasAuthorized([
    { ...MODULE_PERMISSION.ORGANIZATION.update },
  ]);

  // ** User Module **
  const readUserPermission = hasAuthorized([
    { ...MODULE_PERMISSION.USER.read },
  ]);

  const createUserPermission = hasAuthorized([
    { ...MODULE_PERMISSION.USER.create },
  ]);
  const updateUserPermission = hasAuthorized([
    { ...MODULE_PERMISSION.USER.update },
  ]);

  const deleteUserPermission = hasAuthorized([
    { ...MODULE_PERMISSION.USER.delete },
  ]);

  // ** User Module **
  const readProfilePermission = hasAuthorized([
    { ...MODULE_PERMISSION.PROFILE.read },
  ]);

  const createProfilePermission = hasAuthorized([
    { ...MODULE_PERMISSION.PROFILE.create },
  ]);

  const updateProfilePermission = hasAuthorized([
    { ...MODULE_PERMISSION.PROFILE.update },
  ]);

  const deleteProfilePermission = hasAuthorized([
    { ...MODULE_PERMISSION.PROFILE.delete },
  ]);

  // ** Department Module **
  const readDepartmentPermission = hasAuthorized([
    { ...MODULE_PERMISSION.DEPARTMENT.read },
  ]);

  const createDepartmentPermission = hasAuthorized([
    { ...MODULE_PERMISSION.DEPARTMENT.create },
  ]);

  const updateDepartmentPermission = hasAuthorized([
    { ...MODULE_PERMISSION.DEPARTMENT.update },
  ]);

  const deleteDepartmentPermission = hasAuthorized([
    { ...MODULE_PERMISSION.DEPARTMENT.delete },
  ]);

  return {
    readLeadPermission,
    createLeadPermission,
    updateLeadPermission,
    deleteLeadPermission,
    readDealPermission,
    createDealPermission,
    updateDealPermission,
    deleteDealPermission,
    readContactPermission,
    createContactPermission,
    updateContactPermission,
    deleteContactPermission,
    readAccountPermission,
    createAccountPermission,
    updateAccountPermission,
    deleteAccountPermission,
    readActivityPermission,
    createActivityPermission,
    updateActivityPermission,
    deleteActivityPermission,
    readNotePermission,
    createNotePermission,
    updateNotePermission,
    deleteNotePermission,
    readDocumentPermission,
    createDocumentPermission,
    deleteDocumentPermission,
    tagForLeadPermission,
    tagForContactPermission,
    tagForDealPermission,
    tagForAccountPermission,
    tagForActivityPermission,
    readOrganizationPermission,
    updateOrganizationPermission,
    readUserPermission,
    createUserPermission,
    updateUserPermission,
    deleteUserPermission,
    readProfilePermission,
    createProfilePermission,
    updateProfilePermission,
    deleteProfilePermission,
    readDepartmentPermission,
    createDepartmentPermission,
    updateDepartmentPermission,
    deleteDepartmentPermission,
    readAllPermission,
    updateAllPermission,
    deleteAllPermission
  };
};

export default usePermission;
