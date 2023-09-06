import { useRestoreAccountMutation } from 'redux/api/accountApi';
import { useRestoreActivityMutation } from 'redux/api/activityApi';
import { useRestoreContactMutation } from 'redux/api/contactApi';
import { useGetLeadRestoreLeadApiMutation } from 'redux/api/leadApi';

interface RestoreInterface {
  is_deal?: boolean;
  selectedIds: number[];
  afterRestore: () => void;
}

export const useRestore = () => {
  // ** APIS **
  const [restoreActivityApi] = useRestoreActivityMutation();

  const [getLeadRestoreLeadApi] = useGetLeadRestoreLeadApiMutation();
  const [restoreContactApi] = useRestoreContactMutation();
  const [getAccountRestoreAccountApi] = useRestoreAccountMutation();

  const restoreLead = async ({
    afterRestore,
    selectedIds,
    is_deal,
  }: RestoreInterface) => {
    const data = await getLeadRestoreLeadApi({
      data: {
        ids: selectedIds,
        is_deal,
      },
    });
    if ('data' in data && !('error' in data)) {
      afterRestore();
    }
  };
  const restoreContact = async ({
    afterRestore,
    selectedIds,
  }: RestoreInterface) => {
    const data = await restoreContactApi({
      data: {
        contactIds: selectedIds,
      },
    });
    if ('data' in data || !('error' in data)) {
      afterRestore();
    }
  };

  const restoreAccount = async ({
    afterRestore,
    selectedIds,
  }: RestoreInterface) => {
    const data = await getAccountRestoreAccountApi({
      data: {
        accountIds: selectedIds,
      },
    });
    if ('data' in data || !('error' in data)) {
      afterRestore();
    }
  };

  const restoreActivity = async ({
    afterRestore,
    selectedIds,
  }: RestoreInterface) => {
    const data = await restoreActivityApi({
      data: {
        activityIds: selectedIds,
      },
    });
    if ('data' in data || !('error' in data)) {
      afterRestore();
    }
  };

  return {
    restoreLead,
    restoreContact,
    restoreAccount,
    restoreActivity,
  };
};
