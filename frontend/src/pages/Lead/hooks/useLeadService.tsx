// ** Import Packages **
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ** Redux **
import { getIsLoadDetailsLoad, setLoadDetails } from 'redux/slices/commonSlice';

// ** Types **
import { LeadDetailPageType, LeadDetailsType } from '../types/lead.type';

// ** Services **
import { useLazyGetLeadByIdQuery } from 'redux/api/leadApi';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

interface LeadDetailsProps {
  leadId: number | null | undefined;
  setStopLoadingSkeleton?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useGetLeadDetails = (props: LeadDetailsProps) => {
  const { leadId, setStopLoadingSkeleton } = props;

  // ** Hooks **
  const navigate = useNavigate();
  const IsLeadDetailsLoad = useSelector(getIsLoadDetailsLoad);
  const dispatch = useDispatch();

  // ** State **
  const [leadData, setLeadData] = useState<LeadDetailPageType>({
    lead: {
      id: null,
      lead_owner_id: null,
      lead_temp_id: null,
      lead_status_id: null,
      name: '',
      deal_value: '',
      description: '',
      lead_source: {
        id: null,
        name: '',
      },
      lead_status: {
        id: null,
        name: '',
        color: '',
      },
      is_deal: '',
      contacts: [],
      related_account: {
        id: null,
        phones: [],
        emails: [],
        name: '',
      },
      lead_owner: { id: null, first_name: '', last_name: '' },
      lead_temperature: {
        id: null,
        name: '',
        color: '',
      },
      related_contacts: [],
      related_accounts: [],
      is_following: 0,
      lead_followers: [],
      total_followers: 0,
    },
    notes_count: 0,
    attachments_count: 0,
  });
  const [isShowMainLoader, setShowMainLoader] = useState(true);

  // ** APIS **
  const [getLeadByIdAPI, { isFetching, isError, currentData, error }] =
    useLazyGetLeadByIdQuery();

  useEffect(() => {
    if (currentData) {
      setLeadData({
        lead: { ...(currentData.lead as LeadDetailsType) },
        attachments_count: 0,
        notes_count: 0,
      });
      setShowMainLoader(true);
    } else if (error?.message === 'Lead not found') {
      navigate(PRIVATE_NAVIGATION.leads.view);
    }
  }, [currentData, error]);

  const getLeadDetail = async (id: number) => {
    await getLeadByIdAPI(
      {
        id,
        data: {
          query: {
            'q[is_deal]': false,
            'include[related_account]':
              'id,name,emails,phones,address1,address2,zip,city,state_id,country_id',
            'include[related_account][include][state][select]':
              'id,name,state_code',
            'include[related_account][include][country][select]': 'id,name',
            'include[related_contacts][select]':
              'id,job_role,is_primary,contact_id,job_role',
            'include[related_contacts][include][contact]':
              'id,emails,phones,name,job_role,address1,address2,zip,job_role,city,state_id,country_id',
            'include[related_contacts][include][contact][include][state][select]':
              'id,name,state_code',
            'include[related_contacts][include][contact][include][country][select]':
              'id,name',
            'include[lead_temperature]': 'id,is_system,name',
            'include[lead_source]': 'id,is_system,name',
            'include[lead_status]': 'id,is_system,name',
            'include[lead_owner][select]': 'id,first_name,last_name,full_name',
            'include[lead_owner][paranoid]': false,
            'include[pipeline]': 'all',
            'include[lead_followers][select]': 'follower_id,lead_id',
            'include[lead_followers][include][follower][select]':
              'id,first_name,last_name,full_name,email,phone,profile_image',
            'include[lead_followers][include][follower][include][user_roles][select]':
              'role_id',
            'include[lead_followers][include][follower][include][user_roles][include][role][select]':
              'name',
          },
        },
      },
    );
  };

  useEffect(() => {
    if (leadId) {
      getLeadDetail(leadId);
    }
  }, [leadId]);

  useEffect(() => {
    if (IsLeadDetailsLoad?.leads && leadId) {
      if (setStopLoadingSkeleton) {
        setStopLoadingSkeleton(true);
      }
      getLeadDetail(leadId);
      dispatch(
        setLoadDetails({
          loadModuleDetails: {
            ...IsLeadDetailsLoad,
            leads: false,
          },
        })
      );
    }
  }, [IsLeadDetailsLoad]);

  return {
    getLeadDetail,
    leadData,
    isLoading: isFetching,
    isError,
    setLeadData,
    setShowMainLoader,
    isShowMainLoader,
  };
};
