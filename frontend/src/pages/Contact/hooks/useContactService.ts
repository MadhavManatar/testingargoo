// ** Import Packages **
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//  ** Redux **
import { getIsLoadDetailsLoad, setLoadDetails } from 'redux/slices/commonSlice';

// ** types **
import {
  AsyncSelectGetOptions,
  Option,
} from 'components/FormField/types/formField.types';
import {
  ContactResponseType,
  ContactDetails,
  ContactEmail,
  RelatedContact,
} from '../types/contacts.types';
import { UseFormSetValue } from 'react-hook-form';
import { AddLeadFormFieldsType } from 'pages/Lead/types/lead.type';
import { AddActivityFormFields } from 'pages/Activity/types/activity.types';
import { parseData } from 'utils/util';
import {
  useLazyGetContactByIdQuery,
  useLazyGetContactsQuery,
} from 'redux/api/contactApi';
import { useLazyGetComposeEmailDropdownQuery } from 'redux/api/searchApi';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { OPTION_LISTING_DATA_LIMIT } from 'constant/dataLimit.constant';

interface ContactDetailsProps {
  id: number | null | undefined;
  setStopLoadingSkeleton?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface GetContactOptionsProps {
  name: string;
  id: number;
  job_role: string | null;
  AccountContacts: { contact_id: number; job_role: string }[];
  emails?: ContactEmail[];
}

export const useGetContactDetails = (props: ContactDetailsProps) => {
  const { id, setStopLoadingSkeleton } = props;

  // ** Hooks **
  const navigate = useNavigate();
  const IsContactDetailsLoad = useSelector(getIsLoadDetailsLoad);
  const dispatch = useDispatch();

  // ** States **
  const [contactData, setContactData] = useState<ContactResponseType>({
    contact: {
      contact_owner_id: null,
      name: '',
      emails: [],
      phones: [],
      related_accounts: [],
      department: '',
      reporting_to: '',
      birth_date: '',
      job_role: '',
      id: 0,
      skype: '',
      address1: '',
      address2: '',
      city: '',
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
      zip: '',
      description: '',
      twitter: '',
      timezone: '',
      contact_owner: { id: null, full_name: '' },
      account: { id: 0, name: '' },
      reporting_to_contact: { id: null, name: '' },
      related_contacts: [],
    },
    attachments_count: 0,
    notes_count: 0,
  });
  const [isShowMainLoader, setShowMainLoader] = useState(true);

  // ** APIS **
  const [getContactByIdAPI, { isFetching, currentData, error }] =
    useLazyGetContactByIdQuery();

  useEffect(() => {
    if (currentData) {
      const tempData = { ...currentData };
      if (tempData && !error) {
        const updateRelatedAccountData = (
          tempData as ContactDetails
        ).related_accounts.map((item) => {
          return {
            ...item,
            is_primary:
              (tempData as ContactDetails).primary_account_id ===
              item.account_id,
          };
        });
        const updateRelatedContactData = (
          tempData as ContactDetails
        ).related_contacts.map((item) => {
          return {
            ...item,
          };
        });
        tempData.related_accounts = updateRelatedAccountData;
        tempData.related_contacts = updateRelatedContactData;

        setContactData({
          contact: { ...(tempData as ContactDetails) },
          attachments_count: 0,
          notes_count: 0,
        });
        setShowMainLoader(true);
      }
      if (error && 'data' in error && error.data === 'Contact not found')
        navigate(PRIVATE_NAVIGATION.contacts.view);
    }
  }, [currentData, error]);

  const getContactDetail = async (idArg: number) => {
    await getContactByIdAPI({
      id: idArg,
      data: {
        query: {
          'include[related_accounts][select]':
            'id,account_id,contact_id,job_role',
          'include[related_accounts][include][account][sort]': 'name',
          'include[related_accounts][include][account][select]':
            'id,name,emails,phones,address1,address2,address_details,city,country_id,state_id,zip,primary_contact_id',
          'include[related_accounts][include][account][paranoid]': false,
          'include[related_accounts][include][account][include][state][select]':
            'id,name,state_code',
          'include[related_accounts][include][account][include][country][select]':
            'id,name',
          'include[creator][select]': 'id,first_name,last_name,full_name',
          'include[contact_owner][select]': 'id,first_name,last_name,full_name',
          'include[contact_owner][paranoid]': false,
          'include[reporting_to_contact]': 'all',
          'include[related_contacts][select]': 'contact_id,job_role',
          'include[related_contacts][include][contact]': 'all',
          'include[contact_followers][select]': 'follower_id,contact_id',
          'include[contact_followers][include][follower][select]':
            'id,first_name,last_name,full_name,email,phone,profile_image',
          'include[contact_followers][include][follower][include][user_roles][select]':
            'role_id',
          'include[contact_followers][include][follower][include][user_roles][include][role][select]':
            'name',
          // Related Leads
          'include[related_leads][select]': 'contact_id,model_record_id',
          'include[related_leads][include][lead][select]':
            'name,id,is_deal,created_at,lead_score,deal_value,closing_date,related_account_id,converted_by,converted_at,lead_status_id',
          'include[related_leads][include][lead][include][deal_stage_history][select]':
            'deal_id,stage_id,isCurrentActive,start_time,end_time',
          'include[related_leads][include][lead][include][deal_stage_history][include][stage][select]':
            'name,stage_type',
          'include[related_leads][include][lead][include][pipeline][select]':
            'name',
          'include[related_leads][include][lead][include][related_account][select]':
            'id,name,emails,phones',
          'include[state][select]': 'id,name,state_code',
          'include[country][select]': 'id,name,iso3,iso2',
        },
      },
    });
  };
  useEffect(() => {
    if (id) {
      getContactDetail(id);
    }
  }, [id]);

  useEffect(() => {
    if (IsContactDetailsLoad?.contacts && id) {
      if (setStopLoadingSkeleton) {
        setStopLoadingSkeleton(true);
      }
      getContactDetail(id);
      dispatch(
        setLoadDetails({
          loadModuleDetails: {
            ...IsContactDetailsLoad,
            contacts: false,
          },
        })
      );
    }
  }, [IsContactDetailsLoad]);

  return {
    contactData,
    isLoading: isFetching,
    setShowMainLoader,
    isShowMainLoader,
  };
};

export const useGetAccountContactOptionsForSearch = ({
  watchAccount,
  notSearchContactArray,
  watchAccountList,
}: {
  contactId?: number | undefined;
  watchAccount?: number | string;
  watchAccountList?: (number | string)[] | undefined;
  notSearchContactArray?: (number | string)[] | undefined;
}) => {
  // ** APIS **
  const [getContactsAPI, { isLoading: isAccountContactsLoading }] =
    useLazyGetContactsQuery();

  const getAccountContactOptions = async (option: {
    search: string;
    page: number;
  }) => {
    let contactsArray: GetContactOptionsProps[] = [];
    let count = 0;
    let optionsLength = 0;

    if (option?.search) {
      optionsLength = option?.search.length;
    }

    if (
      (optionsLength <= 0 &&
        watchAccount &&
        !Number.isNaN(Number(watchAccount))) ||
      watchAccountList?.length
    ) {
      // remove already selected contact

      const { data, error } = await getContactsAPI(
        {
          data: {
            query: {
              'include[related_contacts][separate]': true,
              'include[related_contacts][select]': 'contact_id,job_role',
              'include[related_contacts][include][contact][select]':
                'id,name,job_role,emails,phones',
              'include[related_accounts][separate]': true,
              'include[related_accounts][select]': 'account_id,job_role',
              'include[related_accounts][include][account][select]': 'id,name',
              limit: OPTION_LISTING_DATA_LIMIT,
              page: option?.page,
              ...(notSearchContactArray &&
                notSearchContactArray.length > 0 && {
                'q[id][notIn]': `${notSearchContactArray}`,
              }),
              ...(option?.search && {
                searchFields: 'name',
                searchText: (option?.search && `${option?.search}`) || '',
              }),
              select: 'id,name,job_role',
            },
          },
        },
        true
      );

      if (data && !error) {
        contactsArray = [...contactsArray, ...data.rows];
        count = data.count;
      }
    }

    if (option?.search) {
      const { data: onySearchData, error: onySearchError } =
        await getContactsAPI({
          params: {
            limit: 10 - contactsArray.length,
            page: option?.page,
            ...(option?.search && {
              'q[name][iLike]': (option?.search && `%${option?.search}%`) || '',
            }),
            ...(notSearchContactArray &&
              notSearchContactArray.length > 0 && {
              'q[id][notIn]': `${notSearchContactArray}`,
            }),
            select: 'id,name,job_role',
          },
        });

      if (onySearchData && !onySearchError) {
        contactsArray = [...contactsArray, ...onySearchData.rows];
        count += onySearchData.count;
      }
    }

    if (contactsArray.length > 0) {
      const contactsOptions = contactsArray
        .filter(
          (
            value: { name: string; id: number; job_role: string | null },
            index: number,
            self: { name: string; id: number; job_role: string | null }[]
          ) => self.findIndex((t) => t.id === value.id) === index
        )
        .map((val: GetContactOptionsProps) => {
          const contactInfo = val?.AccountContacts?.find(
            (contact: { contact_id: number }) => contact.contact_id === val.id
          );
          return {
            label: `${val.name}`,
            value: val.id,
            job_role: contactInfo?.job_role || val.job_role,
          };
        });

      return {
        option: contactsOptions,
        count,
      };
    }
  };

  return { getAccountContactOptions, isAccountContactsLoading };
};

export const useGetAccountContactOptions = ({
  contactId,
}: {
  contactId?: number;
}) => {
  // ** APIS **
  const [getContactsAPI, { isLoading: isAccountContactsLoading }] =
    useLazyGetContactsQuery();

  const getAccountContactOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getContactsAPI(
      {
        data: {
          query: {
            ...(contactId &&
            {
              // 'q[AccountContacts][some][contact_id][notIn]': `n|${contactId}`,
            }),
            limit: OPTION_LISTING_DATA_LIMIT,
            page: option?.page,
            ...(option?.search
              ? {
                'q[name][iLike]':
                  (option?.search && `%${option?.search}%`) || '',
              }
              : {}),
            select: 'id,name,job_role',
          },
        },
      },
      true
    );

    if (data && !error) {
      const contactsOptions = data.rows.map(
        (val: { name: string; id: number; job_role: string | null }) => {
          return {
            label: `${val.name}`,
            value: val.id,
            job_role: val.job_role,
          };
        }
      );
      const filterContactsOptions = contactsOptions.filter(
        (val: { name: string; value: number; job_role: string | null }) =>
          val.value !== contactId
      );
      return {
        option: filterContactsOptions,
        count: filterContactsOptions.length,
      };
    }
  };

  return { getAccountContactOptions, isAccountContactsLoading };
};

export const useGetContactOptions = (args: {
  notSearchContactArray?: (number | string | undefined)[];
  emailWithLabel?: boolean;
}) => {
  const { notSearchContactArray, emailWithLabel = false } = args;

  // ** APIS **
  const [getContactsAPI, { isLoading: isContactsOptionsLoading }] =
    useLazyGetContactsQuery();

  const getContactOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getContactsAPI(
      {
        data: {
          query: {
            ...(notSearchContactArray &&
              notSearchContactArray?.length > 0 && {
              'q[id][notIn]': `${[...notSearchContactArray]}`,
            }),
            limit: OPTION_LISTING_DATA_LIMIT,
            sort: 'name',
            page: option?.page,
            searchFields: 'name,emails',
            searchText: `${option?.search}`,
          },
        },
      },
      true
    );

    if (!error && data.rows) {
      const Options = data.rows.map(
        (val: {
          job_role: string;
          name?: string;
          id: number;
          emails: ContactEmail[];
        }) => {
          const primaryEmail = val.emails.length
            ? val.emails?.find((mailObj) => mailObj.is_primary)?.value
            : '';

          const label = emailWithLabel
            ? `${val.name}${primaryEmail ? `,${primaryEmail}` : ''}`
            : val.name;
          return {
            label,
            value: val.id,
            email: primaryEmail,
            job_role: val.job_role,
            extraLabel: val.job_role,
          };
        }
      );

      return {
        option: Options,
        count: data.count,
      };
    }
  };

  return {
    isContactsOptionsLoading,
    getContactOptions,
  };
};

export const useGetAccountContactOptionsForSearchInLeadDeal = ({
  watchAccount,
  notSearchContactArray,
  emailWithLabel = false,
}: {
  watchAccount?: number | string;
  notSearchContactArray?: (number | string | undefined)[];
  emailWithLabel?: boolean;
}) => {
  // ** APIS **
  const [getContactsAPI, { isLoading: isAccountContactsLoading }] =
    useLazyGetContactsQuery();

  const getAccountContactOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getContactsAPI(
      {
        data: {
          query: {
            sort: 'name',
            limit: OPTION_LISTING_DATA_LIMIT,
            page: option?.page,
            ...(option &&
              (option?.search || '').length <= 0 &&
              typeof watchAccount === 'number' &&
              watchAccount
              ? {
                'include[related_accounts][q][account_id]': `n|${watchAccount}`,
                'include[related_accounts][required]': true,
                // 'include[related_accounts][sort]': 'is_primary',
                select: 'id,name,job_role,emails,phones',
              }
              : {
                searchFields: 'name,emails',
                searchText: (option?.search && `${option?.search}`) || '',
                select: 'id,name,job_role,emails',
              }),
            ...(notSearchContactArray &&
              notSearchContactArray.length > 0 && {
              'q[id][notIn]': `n|${notSearchContactArray}`,
            }),
          },
        },
      },
      true
    );

    if (data && !error) {
      const contactsOptions: Option[] = (data?.rows || []).map(
        (obj: GetContactOptionsProps) => {
          const primaryEmail = obj?.emails?.length
            ? obj.emails?.find((mailObj) => mailObj.is_primary)?.value
            : '';
          const label = emailWithLabel
            ? `${obj.name}${primaryEmail ? `,${primaryEmail}` : ''}`
            : obj.name;
          return {
            label,
            value: obj.id,
            job_role: obj?.job_role || '',
            email: primaryEmail,
            extraLabel: obj.job_role,
          };
        }
      );

      return {
        option: contactsOptions || [],
        count: data.count,
      };
    }
  };

  return { getAccountContactOptions, isAccountContactsLoading };
};

export const useGetContactsRelatedAccount = ({
  setValue,
  setAccountRelatedContacts,
  watchContact,
  setValueForActivity,
  watchContactForActivity,
  setContactKey,
}: {
  setValue?: UseFormSetValue<AddLeadFormFieldsType>;
  setValueForActivity?: UseFormSetValue<AddActivityFormFields>;
  setAccountRelatedContacts: React.Dispatch<
    React.SetStateAction<RelatedContact[] | undefined>
  >;
  watchContact?: Partial<RelatedContact>[];
  watchContactForActivity?: string | number;
  setContactKey?: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  // ** APIS **
  const [getContactsAPI, { isLoading: isContactsRelatedAccountLoading }] =
    useLazyGetContactsQuery();

  const getContactsRelatedAccountOptions = async (id: number) => {
    const { data, error } = await getContactsAPI(
      {
        data: {
          query: {
            sort: 'name',
            'include[related_accounts][q][account_id]': `n|${id}`,
            'include[related_accounts][include][contact][select]':
              'id,name,emails,phones',
            'include[related_accounts][required]': true,
            limit: OPTION_LISTING_DATA_LIMIT,
            page: 1,
            select: 'id,name,job_role',
          },
        },
      },
      true
    );

    const contactId =
      watchContact?.find((item) => item.contact_id) || watchContactForActivity;

    if (data && !error && !contactId) {
      if (data.count === 1) {
        setAccountRelatedContacts(data?.rows[0]?.related_accounts);

        setValueForActivity?.(
          'activity_contact',
          data?.rows[0]?.related_accounts[0]?.contact_id
        );

        setContactKey?.(data?.rows[0]?.related_accounts[0]?.contact_id);

        setValue?.(
          'contacts',
          data?.rows[0]?.related_accounts?.map(
            (val: {
              contact_id: number;
              job_role: string;
              is_primary: boolean;
            }) => ({
              contact_id: val.contact_id,
              job_role: val.job_role,
              is_primary: true,
            })
          )
        );
      }
    }
  };

  return { getContactsRelatedAccountOptions, isContactsRelatedAccountLoading };
};

// OLD
export const useGetContactOptionsForEmailOLD = (args: {
  notSearchContactArray?: (number | string | undefined)[];
  emailWithLabel?: boolean;
}) => {
  const { notSearchContactArray, emailWithLabel = false } = args;

  // ** APIS **
  const [getContactsAPI, { isLoading: isContactsOptionsLoading }] =
    useLazyGetContactsQuery();

  const getContactOptionsForEmail: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getContactsAPI(
      {
        data: {
          query: {
            ...(notSearchContactArray &&
              notSearchContactArray?.length > 0 && {
              'q[id][notIn]': `${[...notSearchContactArray]}`,
            }),
            limit: OPTION_LISTING_DATA_LIMIT,
            sort: 'name',
            page: option?.page,
            searchFields: 'name,emails',
            searchText: `${option?.search}`,
          },
        },
      },
      true
    );
    if (!error && data.rows) {
      const Options = data.rows
        .map(
          (val: {
            job_role: string;
            name?: string;
            id: number;
            emails: ContactEmail[];
          }) => {
            const primaryEmail = val.emails.length
              ? val.emails?.find((mailObj) => mailObj.is_primary)?.value
              : '';

            const label = emailWithLabel
              ? `${val.name}${primaryEmail ? `,${primaryEmail}` : ''}`
              : val.name;
            return {
              label,
              value: val.id,
              email: primaryEmail,
              job_role: val.job_role,
            };
          }
        )
        .filter((obj: { email: string }) => obj.email);

      return {
        option: Options,
        count: data.count,
      };
    }
  };

  return {
    isContactsOptionsLoading,
    getContactOptionsForEmail,
  };
};

// New Function For the Email To Search
export const useGetContactOptionsForEmail = (args: {
  notSearchContactArray?: (number | string | undefined)[];
  emailWithLabel?: boolean;
}) => {
  const { emailWithLabel = false } = args;

  // ** APIS **
  const [getComposeEmailDropdownAPI, { isLoading: isContactsOptionsLoading }] =
    useLazyGetComposeEmailDropdownQuery();

  const getContactOptionsForEmail: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getComposeEmailDropdownAPI({
      params: {
        limit: 10,
        searchText: option?.search,
        page: option?.page,
      },
    });
    const userContactData: {
      emails: ContactEmail[] | string;
      first_name: string;
      last_name: string;
      id: number;
    }[] = data.rows;

    if (!error && data.rows) {
      const Options = userContactData
        .map((obj) => {
          let email: string;
          if (
            typeof obj.emails === 'string' &&
            obj.emails !== '' &&
            obj.emails !== '[]'
          ) {
            const emails: ContactEmail[] = parseData(obj.emails);
            email =
              (emails &&
                emails.length &&
                emails.filter((e) => e.is_primary)?.[0]?.value) ||
              obj.emails;
          } else {
            email = (obj.emails as unknown as string) || '';
          }
          const label = emailWithLabel
            ? `${obj.first_name} ${obj.last_name}${email ? `,${email}` : ''}`
            : obj.first_name;
          return {
            label,
            value: obj.id,
            email,
            job_role: '',
          };
        })
        .filter((obj) => !!obj.email);

      return {
        option: Options,
        count: data.total,
      };
    }
  };
  return {
    isContactsOptionsLoading,
    getContactOptionsForEmail,
  };
};

export const useGetContacts = () => {
  const [contactData, setContactData] = useState<ContactDetails[]>([]);

  const [getContactsAPI, { isLoading: isContactsOptionsLoading }] =
    useLazyGetContactsQuery();

  const getContactOptions = async (args?: { searchText?: string }) => {
    const { data, error } = await getContactsAPI(
      {
        data: {
          query: {
            limit: OPTION_LISTING_DATA_LIMIT,
            sort: 'name',
            ...(args?.searchText && {
              searchText: args?.searchText,
              searchFields: 'name,emails',
            }),
          },
        },
      },
      true
    );

    if (!error && data.rows) {
      setContactData(data.rows);
    }
  };

  return {
    isContactsOptionsLoading,
    getContactOptions,
    contactData,
  };
};
