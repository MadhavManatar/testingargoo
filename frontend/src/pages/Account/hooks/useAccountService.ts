// ** Import Packages **
import { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

// ** Components **
import {
  AsyncSelectGetOptions,
  Option,
} from 'components/FormField/types/formField.types';

// ** Redux  **
import { getIsLoadDetailsLoad, setLoadDetails } from 'redux/slices/commonSlice';

// ** Type **
import { AccountResponseType } from '../types/account.types';

// ** Constant **
import { GENERAL_SETTING_VALID_KEYS, IS_CACHING_ACTIVE } from 'constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { getCurrentUser } from 'redux/slices/authSlice';
import { AddLeadFormFieldsType } from 'pages/Lead/types/lead.type';
import { AddActivityFormFields } from 'pages/Activity/types/activity.types';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';
import {
  useLazyGetAccountByIdQuery,
  useLazyGetAccountsQuery,
  useLazyGetAccountsWithoutChildQuery,
  useLazyGetParentAccountsQuery,
} from 'redux/api/accountApi';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

interface AccountDetailsProps {
  accountId: number | null | undefined;
  setStopLoadingSkeleton?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useGetAccountDetails = (props: AccountDetailsProps) => {
  const { accountId, setStopLoadingSkeleton } = props;
  let abortFlag = false;
  const IsAccountDetailsLoad = useSelector(getIsLoadDetailsLoad);
  const dispatch = useDispatch();
  const [isShowLoader, setShowLoader] = useState(true);

  // ** States **
  const [accountData, setAccountData] = useState<AccountResponseType>({
    account: {
      id: null,
      account_owner_id: 0,
      rating: '',
      name: '',
      emails: [{ isPrimary: false, value: '' }],
      phones: [{ isPrimary: false, phoneType: null, value: '' }],
      fax: '',
      parent_account_id: '',
      sub_account_id: '',
      website: '',
      account_type: '',
      ownership: '',
      industry: '',
      employees: '',
      annual_revenue: '',
      description: '',
      zip: '',
      city: '',
      state_id: 0,
      country_id: 0,
      country: {
        id: 0,
        name: '',
        iso3: '',
        iso2: '',
      },
      state: {
        id: 0,
        name: '',
        state_code: '',
      },
      address1: '',
      address2: '',
      timezone: '',
      account_owner: { id: null, first_name: '', last_name: '' },
      parent_account: {
        id: null,
        name: '',
        phones: [{ isPrimary: false, phoneType: '', value: '' }],
        emails: [{ isPrimary: false, value: '' }],
      },
      sub_account: {
        id: null,
        name: '',
        phones: [{ isPrimary: false, phoneType: '', value: '' }],
        emails: [{ isPrimary: false, value: '' }],
      },
      Account: [],
      AccountContacts: [],
    },
    attachments_count: 0,
    notes_count: 0,
  });
  const navigate = useNavigate();

  // ** Custom Hooks **

  useEffect(() => {
    if (accountId) {
      getAccountDetail(accountId);
    }
    return () => {
      abortFlag = true;
    };
  }, [accountId]);

  useEffect(() => {
    if (IsAccountDetailsLoad?.accounts && accountId) {
      if (setStopLoadingSkeleton) {
        setStopLoadingSkeleton(true);
      }
      getAccountDetail(accountId);
      dispatch(
        setLoadDetails({
          loadModuleDetails: { ...IsAccountDetailsLoad, accounts: false },
        })
      );
    }
  }, [IsAccountDetailsLoad]);

  const [
    getAccountByIdAPI,
    { isFetching: isAccountLoading, currentData, error, isError },
  ] = useLazyGetAccountByIdQuery();

  if (isError) {
    navigate(PRIVATE_NAVIGATION.accounts.view);
  }

  useEffect(() => {
    if (currentData && !error && !abortFlag) {
      const data = _.cloneDeep(currentData);

      const updateRelatedAccountData = data?.account?.AccountContacts?.map(
        (item: { is_primary: boolean; contact_id: number }) => {
          return {
            ...item,
            is_primary: data.account.primary_contact_id === item.contact_id,
          };
        }
      );

      data.account.AccountContacts = updateRelatedAccountData;

      setAccountData({ ...data });
      setShowLoader(true);
    } else if (isError || error?.message === 'Account not found') {
      navigate('/accounts');
    }
  }, [currentData]);

  const getAccountDetail = async (id: number) => {
    await getAccountByIdAPI({
      id,
      params: {
        'include[account_owner][select]': 'id,first_name,last_name,full_name',
        'include[account_owner][paranoid]': false,
        'include[AccountContacts][select]': 'job_role,id,contact_id',
        'include[AccountContacts][include][contact][select]':
          'id,name,phones,emails,job_role,description,address1,address2,zip,country_id,state_id,city,primary_account_id',
        'include[AccountContacts][include][contact][include][state][select]':
          'id,name',
        'include[AccountContacts][include][contact][include][country][select]':
          'id,name',
        'include[parent_account][select]': 'id,name,emails,phones',
        'include[account_followers][select]': 'follower_id,account_id',
        'include[account_followers][include][follower][select]':
          'id,first_name,last_name,full_name,email,phone,profile_image',
        'include[account_followers][include][follower][include][user_roles][select]':
          'role_id',
        'include[account_followers][include][follower][include][user_roles][include][role][select]':
          'name',
        'include[allLeads][select]':
          'name,id,is_deal,created_at,lead_score,deal_value,closing_date,related_account_id,converted_by,converted_at,lead_status_id',
        'include[allLeads][include][deal_stage_history][select]':
          'deal_id,stage_id,isCurrentActive,start_time,end_time',
        'include[allLeads][include][deal_stage_history][include][stage][select]':
          'name,stage_type',
        'include[allLeads][include][pipeline][select]': 'name',
        'include[allLeads][include][related_account][select]':
          'id,name,emails,phones',
        'include[state][select]': 'name,id,state_code',
        'include[country][select]': 'id,name,iso3,iso2',
      },
    });
  };

  return {
    accountData,
    isAccountLoading: isShowLoader === false ? false : isAccountLoading,
    setShowLoader,
  };
};

export const useGetAccountsOptions = (args: {
  notSearchAccountArray?: (number | string | undefined)[];
}) => {
  const { notSearchAccountArray } = args;

  const [getAccountsAPI, { isLoading: isAccountsLoading }] =
    useLazyGetAccountsQuery();

  const getAccountsOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getAccountsAPI(
      {
        params: {
          limit: OPTION_LISTING_DATA_LIMIT,
          sort: 'name',
          page: option?.page,
          ...(notSearchAccountArray &&
            notSearchAccountArray.length && {
            'q[id][notIn]': notSearchAccountArray.join(','),
          }),
          ...(option?.search && {
            searchFields: 'name',
            searchText: (option?.search && `${option?.search}`) || '',
          }),
          select: 'id,name',
        },
      },
      IS_CACHING_ACTIVE
    );

    if (!error && data.rows) {
      const tempOption = data.rows.map(
        (val: { name?: string; id: number; job_role: string }) => ({
          label: `${val.name}`,
          value: val.id,
          job_role: val.job_role,
        })
      );
      return { option: tempOption, count: data.count };
    }
  };

  return { getAccountsOptions, isAccountsLoading };
};

export const useGetAccountsWithoutChildOptions = ({
  accountId,
}: {
  accountId?: number | null;
}) => {
  // ** api ** //
  const [
    getAccountsWithoutChildAPI,
    { isLoading: isAccountsWithoutChildLoading },
  ] = useLazyGetAccountsWithoutChildQuery();

  const getAccountsWithoutChildOptions: AsyncSelectGetOptions = async (
    option
  ) => {
    const { data, error } = await getAccountsWithoutChildAPI(
      {
        params: {
          account_id: accountId,
          limit: 10,
          page: option?.page,
          searchFields: 'name',
          searchText: (option?.search && `${option?.search}`) || '',
        },
      },
      IS_CACHING_ACTIVE
    );

    if (!error && data) {
      const tempOption = (data?.rows || []).map(
        (val: { name?: string; id: number }) => ({
          label: `${val.name}`,
          value: val.id,
        })
      );

      return { option: tempOption, count: data.count };
    }
  };

  return { getAccountsWithoutChildOptions, isAccountsWithoutChildLoading };
};

export const useGetSubAccountsOptions = (
  accountId?: number | null,
  selectedParentAccountId?: string | null
) => {
  // ** apis **
  const [getAccountsAPI, { isLoading: isSubAccountLoading }] =
    useLazyGetAccountsQuery();

  const getSubAccountsOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getAccountsAPI(
      {
        params: {
          limit: 10,
          page: option?.page,
          ...(accountId && { 'q[id][notIn]': `n|${accountId}` }),
          ...(selectedParentAccountId && {
            'q[id][notIn]': `n|${selectedParentAccountId}`,
          }),
          ...(option?.search && {
            'q[name][contains]': (option?.search && `${option?.search}`) || '',
          }),
        },
      },
      IS_CACHING_ACTIVE
    );

    if (!error && data.rows) {
      const tempOption = data.rows.map(
        (val: { name?: string; id: number }) => ({
          label: `${val.name}`,
          value: val.id,
        })
      );
      return { option: tempOption, count: data.count };
    }
  };

  return { getSubAccountsOptions, isSubAccountLoading };
};

export const useGetParentAccountsOptions = () => {
  // ** api ** //
  const [getParentAccountsAPI, { isLoading: isParentAccountLoading }] =
    useLazyGetParentAccountsQuery();

  const getParentAccountsOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getParentAccountsAPI(
      {
        params: {
          limit: 10,
          page: option?.page,
          ...(option?.search && {
            // 'q[name][contains]': (option?.search && `${option?.search}`) || '',
            searchFields: 'name',
            searchText: (option?.search && `${option?.search}`) || '',
          }),
          select: 'id,name',
        },
      },
      IS_CACHING_ACTIVE
    );

    if (!error && data) {
      const tempOption = data.rows.map(
        (val: { name?: string; id: number }) => ({
          label: `${val.name}`,
          value: val.id,
        })
      );

      return { option: tempOption, count: data.count };
    }
  };

  return { getParentAccountsOptions, isParentAccountLoading };
};

export const useFetchSubAccountEnableSettingData = () => {
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();

  const [isSubAccountEnable, setIsSubAccountEnable] = useState<boolean>();

  const fetchSubAccountEnableSettingData = async () => {
    const { data: isSubAccountData, error: subAccountDataError } =
      await getGeneralSetting(
        {
          params: {
            'q[key]': GENERAL_SETTING_VALID_KEYS.is_parent_account_enable,
            'q[model_name]': POLYMORPHIC_MODELS.USER,
            'q[model_record_id]': currentUser?.id,
            module: ModuleNames.ACCOUNT,
          },
        },
        IS_CACHING_ACTIVE
      );
    if (isSubAccountData && !subAccountDataError) {
      const relatedEnable = isSubAccountData[0]?.value === 'true';
      setIsSubAccountEnable(relatedEnable);
    }
  };

  useEffect(() => {
    fetchSubAccountEnableSettingData();
  }, []);

  return {
    isSubAccountEnable,
  };
};

export const useGetAccountsRelatedToContactOptions = ({
  watchContact,
}: {
  watchContact: string | number | undefined;
}) => {
  // ** apis ** //

  const [getAccountsAPI, { isLoading: isAccountsRelatedToContactLoading }] =
    useLazyGetAccountsQuery();

  const getGetAccountsRelatedToContactOptions: AsyncSelectGetOptions = async (
    option
  ) => {
    const { data, error } = await getAccountsAPI(
      {
        params: {
          limit: OPTION_LISTING_DATA_LIMIT,
          sort: 'name',
          ...(watchContact && (option?.search || '')?.length <= 0
            ? {
              'include[AccountContacts][q][contact_id]': `n|${watchContact}`,
              'include[AccountContacts][include][contact][select]':
                'id,name,emails,phones,primary_account_id',
              'include[AccountContacts][required]': true,
            }
            : {
              searchText: option?.search,
              searchFields: 'name',
            }),

          page: option?.page,
        },
      },
      IS_CACHING_ACTIVE
    );

    if (!error && data.rows) {
      const tempOption = data.rows.map(
        (val: { name?: string; id: number; job_role: string }) => ({
          label: `${val.name}`,
          value: val.id,
          job_role: val.job_role,
        })
      );
      return { option: tempOption, count: data.count };
    }
  };

  return {
    getGetAccountsRelatedToContactOptions,
    isAccountsRelatedToContactLoading,
  };
};

export const useGetAccountsRelatedContact = ({
  setContactRelatedAccounts,
  setValue,
  setAccountKey,
  watchAccount,
  setValueForActivity,
}: {
  setValue?: UseFormSetValue<AddLeadFormFieldsType>;
  setContactRelatedAccounts: React.Dispatch<React.SetStateAction<Option[]>>;
  setAccountKey?: React.Dispatch<React.SetStateAction<number | undefined>>;
  watchAccount: string | number | undefined;
  setValueForActivity?: UseFormSetValue<AddActivityFormFields>;
}) => {
  // ** api ** //

  const [getAccountsAPI, { isLoading: isAccountsRelatedToContactLoading }] =
    useLazyGetAccountsQuery();

  const getGetAccountsRelatedContact = async (contactId: number) => {
    const { data, error } = await getAccountsAPI(
      {
        params: {
          limit: 10,
          'include[AccountContacts][q][contact_id]': `n|${contactId}`,
          'include[AccountContacts][required]': true,
          'include[AccountContacts][include][account][select]': 'id,name',
          page: 1,
        },
      },
      IS_CACHING_ACTIVE
    );

    if (data && !error && !watchAccount) {
      if (data.count === 1) {
        const accounts: Option[] = (data?.rows[0]?.AccountContacts || []).map(
          (item: {
            account: {
              name: string;
              id: number;
            };
          }) => {
            return {
              label: `${item?.account?.name || ''}`,
              value: item?.account?.id,
            };
          }
        );

        setContactRelatedAccounts(accounts);

        setValueForActivity?.(
          'activity_account',
          data?.rows[0]?.AccountContacts[0]?.account_id
        );

        setValue?.(
          'related_account',
          data?.rows[0]?.AccountContacts[0]?.account_id
        );
        setAccountKey?.(data?.rows[0]?.AccountContacts[0]?.account_id);
      }
    }
  };
  return {
    getGetAccountsRelatedContact,
    isAccountsRelatedToContactLoading,
  };
};
