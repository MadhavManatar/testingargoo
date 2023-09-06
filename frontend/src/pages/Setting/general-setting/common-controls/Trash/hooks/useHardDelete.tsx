import { useDestroyAccountMutation } from 'redux/api/accountApi';
import { useDestroyActivityMutation } from 'redux/api/activityApi';
import { useDestroyContactMutation } from 'redux/api/contactApi';
import { useDestroyLeadsMutation } from 'redux/api/leadApi';

interface DeleteDataInterface {
  is_deal?: boolean;
  selectedIds: number[];
  afterDelete: () => void;
}

export const useHardDelete = () => {
  // ** APIS **
  const [destroyActivityAPI, { isLoading: destroyActivityLoading }] =
    useDestroyActivityMutation();

  const [destroyLeadsAPI, { isLoading: destroyLeadLoading }] =
    useDestroyLeadsMutation();

  const [destroyContactAPI, { isLoading: destroyContactLoading }] =
    useDestroyContactMutation();
  const [destroyAccountAPI] = useDestroyAccountMutation();

  const hardDeleteLead = async ({
    afterDelete,
    selectedIds,
    is_deal,
  }: DeleteDataInterface) => {
    const data = await destroyLeadsAPI({
      data: { ids: selectedIds, is_deal },
    });
    if ('data' in data || !('error' in data)) {
      afterDelete();
    }
  };

  const hardDeletedContact = async ({
    afterDelete,
    selectedIds,
  }: DeleteDataInterface) => {
    const data = await destroyContactAPI({
      data: { contactIds: selectedIds },
    });
    if (('data' in data && data.data) || !('error' in data)) {
      afterDelete();
    }
  };

  const hardDeletedAccount = async ({
    afterDelete,
    selectedIds,
  }: DeleteDataInterface) => {
    const data = await destroyAccountAPI({
      data: { accountIds: selectedIds },
    });
    if ('data' in data || !('error' in data)) {
      afterDelete();
    }
  };

  const hardDeletedActivities = async ({
    afterDelete,
    selectedIds,
  }: DeleteDataInterface) => {
    const data = await destroyActivityAPI({
      data: { activityIds: selectedIds },
    });
    if (('data' in data && data.data) || !('error' in data)) {
      afterDelete();
    }
  };

  return {
    hardDeleteLead,
    hardDeletedContact,
    hardDeletedAccount,
    hardDeletedActivities,
    destroyActivityLoading,
    destroyContactLoading,
    destroyLeadLoading,
  };
};
