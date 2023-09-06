// ======================================================
import store from 'redux/store';

export const isOrganizationOwner = (id?: number | null) => {
  const {
    auth: { user },
  } = store.getState();

  return !!user?.user_organizations?.find(
    (obj) => obj.organization.owner_id === (id || user.id)
  );
};

export const isSelfId = (id?: number | null) => {
  const {
    auth: { user },
  } = store.getState();
  return user?.id === (id || user?.id);
};

export const isAdministrator = (profileName?: string | null | undefined) => {
  const {
    auth: { user },
  } = store.getState();

  return (profileName || user?.user_roles?.[0].role?.name) === 'Administrator';
};
