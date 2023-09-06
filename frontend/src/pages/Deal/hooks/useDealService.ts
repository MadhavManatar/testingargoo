// ** import packages **
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** redux **
import { getIsLoadDetailsLoad, setLoadDetails } from 'redux/slices/commonSlice';

// ** types **
import { DealDetailsType, DealResponseType } from '../types/deals.types';
import { useLazyGetLeadByIdQuery } from 'redux/api/leadApi';
import { useLazyGetActiveDealStageQuery } from 'redux/api/dealStageHistoryApi';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

interface DealDetailsProps {
  dealId: number | null | undefined;
  setStopLoadingSkeleton?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useGetDealDetails = (props: DealDetailsProps) => {
  const { dealId, setStopLoadingSkeleton } = props;

  // ** Hooks **
  const IsDealDetailsLoad = useSelector(getIsLoadDetailsLoad);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ** States **
  const [dealData, setDealData] = useState<DealResponseType>({
    lead: {
      id: null,
      lead_owner_id: null,
      deal_stage: { id: null, name: '', stage_type: '' },
      deal_stage_id: null,
      lead_status_id: null,
      lead_status: { id: null, name: '', color: '' },
      pipeline_id: null,
      name: '',
      closing_date: '',
      converted_at: '',
      created_at: '',
      probability: '',
      deal_value: '',
      description: '',
      lead_source: { id: null, name: '' },
      is_deal: '',
      contacts: [],
      related_account: {
        id: null,
        phones: [],
        emails: [],
        name: '',
        address1: '',
        address2: '',
        city: '',
        zip: '',
      },
      lead_owner: { id: null, first_name: '', last_name: '' },
      related_contacts: [],
      pipeline: { id: null, name: '' },
    },
    attachments_count: null,
    notes_count: null,
  });
  const [isShowMainLoader, setShowMainLoader] = useState(true);

  // ** APIS **
  const [getLeadByIdAPI, { isFetching, currentData }] =
    useLazyGetLeadByIdQuery();
  const [
    getActiveDealStageAPI,
    { isLoading: activeStageLoading, currentData: currentActiveData },
  ] = useLazyGetActiveDealStageQuery();

  useEffect(() => {
    if (currentData) {
      const tempData = {
        ...currentData.lead,
      };
      if (tempData) {
        setDealData({
          lead: {
            ...(tempData as DealDetailsType),
            deal_stage: {
              id: currentActiveData?.stage?.id,
              name: currentActiveData?.stage?.name,
              stage_type: currentActiveData?.stage?.stage_type,
            },
            deal_stage_id: currentActiveData?.stage?.id,
          },
          attachments_count: 0,
          notes_count: 0,
        });
        setShowMainLoader(true);
      }
    }
  }, [currentData, currentActiveData]);

  const getDealDetail = async (id: number) => {
    const { data, error } = await getLeadByIdAPI({
      id,
      data: {
        query: {
          'q[is_deal]': true,
          'include[deal_stage_history][select]':
            'stage_id,isCurrentActive,start_time,end_time,deal_id',
          'include[deal_stage_history][include][stage][select]':
            'name,stage_type',
          'include[related_account][select]':
            'id,name,emails,phones,address1,address2,zip,city,state_id,country_id',
          'include[related_account][include][state][select]':
            'id,name,state_code',
          'include[related_account][include][country][select]': 'id,name',
          'include[related_contacts][select],job_role':
            'id,job_role,is_primary,contact_id',
          'include[related_contacts][include][contact]':
            'id,emails,phones,name,job_role,address1,address2,zip,job_role,city,state_id,country_id',
          'include[related_contacts][include][contact][include][state][select]':
            'id,name,state_code',
          'include[related_contacts][include][contact][include][country][select]':
            'id,name',
          'include[lead_temperature]': 'all',
          'include[lead_source]': 'all',
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
    });

    const dealStageRes = await getActiveDealStageAPI(
      {
        id,
        params: { 'include[stage][select]': 'id,name,stage_type' },
      },
    );
    if (data && !error) {
      const dealStage = dealStageRes?.data?.stage;
      const updatedData = {
        ...data,
        lead: {
          ...data.lead,
          deal_stage: {
            id: dealStage?.id,
            name: dealStage?.name,
            stage_type: dealStage?.stage_type,
          },
          deal_stage_id: dealStage?.id,
        },
      };
      setDealData({ ...updatedData });
    }

    if (error?.message === 'Lead not found')
      navigate(PRIVATE_NAVIGATION.deals.view);
  };

  useEffect(() => {
    if (IsDealDetailsLoad?.deals && dealId) {
      if (setStopLoadingSkeleton) {
        setStopLoadingSkeleton(true);
      }
      getDealDetail(dealId);
      dispatch(
        setLoadDetails({
          loadModuleDetails: {
            ...IsDealDetailsLoad,
            deals: false,
          },
        })
      );
    }
  }, [IsDealDetailsLoad]);

  return {
    dealData,
    isLoading: activeStageLoading || isFetching,
    getDealDetail,
    setDealData,
    setShowMainLoader,
    isShowMainLoader,
  };
};
