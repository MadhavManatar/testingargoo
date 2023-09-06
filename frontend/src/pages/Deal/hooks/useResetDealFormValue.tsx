import { useEffect } from 'react';
import { UseFormReset } from 'react-hook-form';
import { usCurrencyFormat } from 'utils/util';
import {
  AddDealFormFieldsType,
  DealDetailsType,
  DealFormFieldsType,
} from '../types/deals.types';
import { setContacts } from 'pages/Lead/helper/leads.helper';
import { useSelector } from 'react-redux';
import { getQuickPopup } from 'redux/slices/quickPopupDefaultSlice';
import store from 'redux/store';
import { useSearchParams } from 'react-router-dom';

type useResetDealFormValueProps = {
  reset: UseFormReset<AddDealFormFieldsType>;
  dealData: DealDetailsType;
  isDealLoading?: boolean;
  isEditing?:
  | keyof DealFormFieldsType
  | 'related_account'
  | 'lead_source'
  | undefined;
};
function useResetDealFormValue(props: useResetDealFormValueProps) {
  const { dealData, reset, isDealLoading, isEditing } = props;
  const selectorQuick = useSelector(getQuickPopup);
  const { auth } = store.getState();
  const { user } = auth;
  const [searchParams] = useSearchParams();
  const queryPopup = searchParams?.get('quickPopup');

  // ** Default Value ** //
  let accountId: number | string = '';
  let contactId: number | string = '';
  let jobRole: string | undefined = '';

  if (selectorQuick && queryPopup) {
    accountId = Number(selectorQuick.account?.id) || '';
    contactId = Number(selectorQuick.contact?.id) || '';
    jobRole = selectorQuick?.contact?.jobRole || '';
  }

  useEffect(() => {
    if (dealData && !isDealLoading) {
      const {
        lead_source,
        name,
        related_account,
        deal_value,
        description,
        lead_owner,
        related_contacts,
        closing_date,
        probability,
        pipeline_id,
        deal_stage_id,
        lead_score,
        lead_status_id,
      } = dealData;

      reset({
        lead_source: lead_source?.id || '',
        closing_date: closing_date || '',
        description: description || '',
        lead_status_id,
        name: name || '',
        probability: probability ? `${probability}` : '',
        deal_value: deal_value ? usCurrencyFormat(deal_value) : undefined,
        pipeline_id,
        deal_stage_id,
        related_account: related_account?.id
          ? related_account.id
          : accountId || undefined,
        lead_owner_id: lead_owner?.id || user?.id || undefined,
        contacts:
          (related_contacts || []).length > 0
            ? setContacts(related_contacts || [])
            : [
              {
                job_role: jobRole || '',
                contact_id: contactId || '',
                is_primary: true,
              },
            ],
        lead_score: lead_score || undefined,
      });
    }
  }, [dealData, isDealLoading, isEditing]);
}

export default useResetDealFormValue;
