export enum ModuleNames {
  ALL = 'all',
  LEAD = 'leads',
  CONTACT = 'contacts',
  DEAL = 'deals',
  ACCOUNT = 'accounts',
  USER = 'users',
  PROFILE_AND_PERMISSION = 'profile and permissions',
  ORGANIZATION = 'organizations',
  TAG = 'tags',
  USER_SETTINGS = 'user_settings',
  NOTE = 'notes',
  ATTACHMENT = 'attachments',
  DEPARTMENT = 'departments',
  CALENDAR = 'calendar',
  ACTIVITY = 'activities',
  EMAIL= 'emails',
}

export enum POLYMORPHIC_MODELS {
  LEAD = 'leads',
  CONTACT = 'contacts',
  DEAL = 'deals',
  USER_SETTINGS = 'user_settings',
  ACCOUNT = 'accounts',
  ACTIVITY = 'activities',
  USER = 'users',
  ORGANIZATION = 'organizations',
  PROFILE_AND_PERMISSION = 'profile and permissions',
  ATTACHMENT = 'attachments',
}

export enum TagPermissions {
  CREATE = 'create',
  UPDATE = 'update',
  READ = 'read',
  DELETE = 'delete',
  ACCOUNT = 'accounts',
  DEAL = 'deals',
  LEAD = 'leads',
  CONTACT = 'contacts',
  ACTIVITY = 'activities',
}

export enum ActivityPermissions {
  CREATE = 'create',
  UPDATE = 'update',
  READ = 'read',
  DELETE = 'delete',
  ACCOUNT = 'accounts',
  DEAL = 'deals',
  LEAD = 'leads',
  CONTACT = 'contacts',
  ACTIVITY = 'activities',
}

export enum BasicPermissionTypes {
  CREATE = 'create',
  UPDATE = 'update',
  READ = 'read',
  DELETE = 'delete',
}

export const MODULE_PERMISSION = Object.freeze({
  ALL: {
    read: { module: ModuleNames.ALL, type: BasicPermissionTypes.READ },
    update: { module: ModuleNames.ALL, type: BasicPermissionTypes.UPDATE },
    delete: { module: ModuleNames.ALL, type: BasicPermissionTypes.DELETE },
  },
  LEAD: {
    read: { module: ModuleNames.LEAD, type: BasicPermissionTypes.READ },
    create: { module: ModuleNames.LEAD, type: BasicPermissionTypes.CREATE },
    update: { module: ModuleNames.LEAD, type: BasicPermissionTypes.UPDATE },
    delete: { module: ModuleNames.LEAD, type: BasicPermissionTypes.DELETE },
  },
  CONTACT: {
    read: { module: ModuleNames.CONTACT, type: BasicPermissionTypes.READ },
    create: { module: ModuleNames.CONTACT, type: BasicPermissionTypes.CREATE },
    update: { module: ModuleNames.CONTACT, type: BasicPermissionTypes.UPDATE },
    delete: { module: ModuleNames.CONTACT, type: BasicPermissionTypes.DELETE },
  },
  DEAL: {
    read: { module: ModuleNames.DEAL, type: BasicPermissionTypes.READ },
    create: { module: ModuleNames.DEAL, type: BasicPermissionTypes.CREATE },
    update: { module: ModuleNames.DEAL, type: BasicPermissionTypes.UPDATE },
    delete: { module: ModuleNames.DEAL, type: BasicPermissionTypes.DELETE },
  },
  ACCOUNT: {
    read: { module: ModuleNames.ACCOUNT, type: BasicPermissionTypes.READ },
    create: { module: ModuleNames.ACCOUNT, type: BasicPermissionTypes.CREATE },
    update: { module: ModuleNames.ACCOUNT, type: BasicPermissionTypes.UPDATE },
    delete: { module: ModuleNames.ACCOUNT, type: BasicPermissionTypes.DELETE },
  },
  ACTIVITY: {
    read: { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.READ },
    create: { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.CREATE },
    update: { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.UPDATE },
    delete: { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.DELETE },
  },
  NOTE: {
    read: { module: ModuleNames.NOTE, type: BasicPermissionTypes.READ },
    create: { module: ModuleNames.NOTE, type: BasicPermissionTypes.CREATE },
    update: { module: ModuleNames.NOTE, type: BasicPermissionTypes.UPDATE },
    delete: { module: ModuleNames.NOTE, type: BasicPermissionTypes.DELETE },
  },
  ATTACHMENT: {
    read: { module: ModuleNames.ATTACHMENT, type: BasicPermissionTypes.READ },
    create: {
      module: ModuleNames.ATTACHMENT,
      type: BasicPermissionTypes.CREATE,
    },
    delete: {
      module: ModuleNames.ATTACHMENT,
      type: BasicPermissionTypes.DELETE,
    },
  },
  TAG: {
    lead: { module: ModuleNames.TAG, type: TagPermissions.LEAD },
    contact: { module: ModuleNames.TAG, type: TagPermissions.CONTACT },
    deal: { module: ModuleNames.TAG, type: TagPermissions.DEAL },
    account: { module: ModuleNames.TAG, type: TagPermissions.ACCOUNT },
    activity: { module: ModuleNames.TAG, type: TagPermissions.ACTIVITY },
  },
  ORGANIZATION: {
    read: { module: ModuleNames.ORGANIZATION, type: BasicPermissionTypes.READ },
    update: {
      module: ModuleNames.ORGANIZATION,
      type: BasicPermissionTypes.UPDATE,
    },
  },
  USER: {
    read: { module: ModuleNames.USER, type: BasicPermissionTypes.READ },
    create: { module: ModuleNames.USER, type: BasicPermissionTypes.CREATE },
    update: { module: ModuleNames.USER, type: BasicPermissionTypes.UPDATE },
    delete: { module: ModuleNames.USER, type: BasicPermissionTypes.DELETE },
  },
  PROFILE: {
    read: {
      module: ModuleNames.PROFILE_AND_PERMISSION,
      type: BasicPermissionTypes.READ,
    },
    create: {
      module: ModuleNames.PROFILE_AND_PERMISSION,
      type: BasicPermissionTypes.CREATE,
    },
    update: {
      module: ModuleNames.PROFILE_AND_PERMISSION,
      type: BasicPermissionTypes.UPDATE,
    },
    delete: {
      module: ModuleNames.PROFILE_AND_PERMISSION,
      type: BasicPermissionTypes.DELETE,
    },
  },
  DEPARTMENT: {
    read: { module: ModuleNames.DEPARTMENT, type: BasicPermissionTypes.READ },
    create: {
      module: ModuleNames.DEPARTMENT,
      type: BasicPermissionTypes.CREATE,
    },
    update: {
      module: ModuleNames.DEPARTMENT,
      type: BasicPermissionTypes.UPDATE,
    },
    delete: {
      module: ModuleNames.DEPARTMENT,
      type: BasicPermissionTypes.DELETE,
    },
  },
});

export const initialColumnDropdownState = {
  [ModuleNames.LEAD]: false,
  [ModuleNames.DEAL]: false,
  [ModuleNames.ACCOUNT]: false,
  [ModuleNames.CONTACT]: false,
  [ModuleNames.ACTIVITY]: false,
  [ModuleNames.EMAIL]: false,
};
