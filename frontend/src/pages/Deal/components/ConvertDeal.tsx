import Breadcrumbs from 'components/Breadcrumbs';
import { BREAD_CRUMB } from 'constant';
import EditLeadSkeleton from 'pages/Lead/skeletons/EditLeadSkeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { convertNumberOrNull, setUrlParams } from 'utils/util';
import { useGetDealDetails } from '../hooks/useDealService';
import { useEffect } from 'react';
import Button from 'components/Button';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { leadSchema } from 'pages/Lead/validation-schema/leads.schema';
import { ConvertLeadFormFieldType } from 'pages/Lead/types/convertLead.type';
import ConvertDealForm from './ConvertDealForm';
import { generateLeadFormData } from 'pages/Lead/helper/leads.helper';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useUpdateLeadMutation } from 'redux/api/leadApi';

const ConvertDeal = () => {
  // ** Hooks **
  const navigate = useNavigate();
  const { id } = useParams();
  const dealId = convertNumberOrNull(id);
  const [updateLeadByIdAPI, { isLoading }] = useUpdateLeadMutation();

  // ** Custom Hooks ** //
  const {
    dealData,
    isLoading: getDealLoding,
    getDealDetail,
  } = useGetDealDetails({
    dealId,
  });
  const formMethods = useForm<ConvertLeadFormFieldType>({
    resolver: yupResolver(leadSchema),
  });
  const { handleSubmit } = formMethods;

  // Fetch Deal Details
  useEffect(() => {
    if (dealId) {
      getDealDetail(dealId);
    }
  }, [dealId]);

  const onSubmit = handleSubmit(async (value) => {
    const { deal_value } = value;
    const updatedDealValue = deal_value?.match(/(\d+)(\.\d+)?/g)?.join('');
    const LeadFormData = generateLeadFormData(
      {
        ...value,
        deal_value: updatedDealValue,
      },
      'edit',
      dealData.lead.related_contacts
      // keepTimelineEmails
    );
    LeadFormData.append('is_deal', 'false');
    LeadFormData.append('converted_at', '');
    LeadFormData.append('converted_by', '');
    LeadFormData.append('is_converted', 'true');

    const data = await updateLeadByIdAPI({
      id: dealId || 0,
      data: LeadFormData,
    });

    if ('data' in data && !('error' in data) && dealId) {
      navigate(setUrlParams(PRIVATE_NAVIGATION.leads.detailPage, dealId), {});
    }
  });
  const onCancelForm = () => {
    navigate(-1);
  };

  return (
    <>
      <Breadcrumbs path={BREAD_CRUMB.convertDeal} />
      <div>
        {isLoading ? (
          <EditLeadSkeleton />
        ) : (
          <div className="ipTabsWrapper">
            <div className="ipTabs">
              <div className="ipTabsContantWrapper">
                <div className="fixed__wrapper__dealEdit">
                  <FormProvider {...formMethods}>
                    <form onSubmit={onSubmit}>
                      <ConvertDealForm
                        // setStageLostIds={setStageLostIds}
                        // editFormFlag
                        // isGetLeadLoading={isGetLeadLoading}
                        dealData={dealData}
                      />
                      <div className="action__fixed__btn__dealEdit flex flex-wrap">
                        <Button
                          className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                          onClick={() => onCancelForm()}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="save__btn primary__Btn min-w-[120px] py-[11px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
                          type="submit"
                          isLoading={isLoading || getDealLoding}
                        >
                          Update
                        </Button>
                      </div>
                    </form>
                  </FormProvider>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConvertDeal;
