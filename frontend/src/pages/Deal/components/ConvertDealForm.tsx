import {
  AddLeadFormFieldsType,
  LeadSectionType,
} from 'pages/Lead/types/lead.type';
import { DealResponseType } from '../types/deals.types';
import { useFormContext } from 'react-hook-form';
import useLeadFormObject from 'pages/Lead/hooks/useLeadFormObject';
import { Fragment, useEffect } from 'react';
import { setContacts } from 'pages/Lead/helper/leads.helper';

interface LeadFormProps {
  dealData: DealResponseType & {
    lead: {
      lead_temperature?: number;
      lead_source_id?: number;
      related_account_id?: number;
      lead_temp_id?: number;
    };
  };
  displayField?: LeadSectionType;
}
const ConvertDealForm = (formProps: LeadFormProps) => {
  const { dealData, displayField } = formProps;
  const {
    control,
    reset,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<AddLeadFormFieldsType>();

  const { formObject } = useLeadFormObject({
    control,
    errors,
    register,
    setValue,
    watch,
    leadDetail: {
      id: dealData.lead.id,
      name: dealData.lead.name,
      related_account: dealData.lead.related_account,
      related_contacts: dealData.lead.related_contacts,
      lead_owner_id: dealData.lead.lead_owner_id,
      is_deal: dealData.lead.is_deal,
      deal_value: dealData.lead.deal_value,
      description: dealData.lead.description,
      lead_score: dealData.lead.lead_score,
      lead_status_id: dealData.lead.lead_status_id,
      lead_followers: dealData.lead.lead_followers,
      is_following: dealData.lead.is_following,
      total_followers: dealData.lead.total_followers,
      lead_source: dealData.lead.lead_source,
      lead_temp_id: dealData.lead?.lead_temp_id,
      total_deal_age: dealData.lead.total_deal_age,
      lead_status: dealData.lead.lead_status,
      lead_owner: dealData.lead.lead_owner,
    },
  });

  useEffect(() => {
    reset({
      name: dealData.lead.name,
      lead_owner_id: dealData.lead.lead_owner_id,
      lead_status_id: dealData.lead?.lead_status_id,
      lead_temp_id: dealData.lead?.lead_temp_id,
      lead_source: dealData.lead?.lead_source_id,
      deal_value: dealData.lead.deal_value,
      lead_score: dealData.lead.lead_score,
      description: dealData.lead.description,
      related_account: dealData?.lead?.related_account?.id || undefined,
      contacts: dealData.lead.related_contacts?.length
        ? setContacts(dealData.lead.related_contacts)
        : [{ job_role: '', contact_id: '', is_primary: true }],
    });
  }, [dealData]);

  const renderFieldArray = (value: keyof typeof formObject) => {
    const tempDisplay = displayField?.[value] || [];
    const temp = formObject[value];
    return Object.keys(temp).filter(
      (el) =>
        !displayField?.[value] || tempDisplay.includes(el as keyof typeof temp)
    );
  };
  const renderField = (value: keyof typeof formObject) => {
    const temp = formObject[value];
    return (
      <>
        {renderFieldArray(value).map((el, index) => {
          if (el as keyof typeof temp) {
            return (
              <Fragment key={index}>{temp[el as keyof typeof temp]} </Fragment>
            );
          }
          return <></>;
        })}
      </>
    );
  };

  return (
    <div>
      {renderFieldArray('information').length ? (
        <div className="">
          <div className="mx-[-10px] flex flex-wrap">
            {renderField('information')}
          </div>
        </div>
      ) : null}
      {renderFieldArray('descriptionInfo').length ? (
        <div className="mt-[15px] sm:mt-[7px]">
          <h3 className="setting__FieldTitle">Description</h3>
          <div className="mx-[-10px] flex flex-wrap">
            {renderField('descriptionInfo')}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default ConvertDealForm;
