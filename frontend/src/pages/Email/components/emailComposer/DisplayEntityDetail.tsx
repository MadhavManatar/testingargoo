import DateFormat from 'components/DateFormat';
import { ModuleNames } from 'constant/permissions.constant';

import {
  ComposeMailAccountData,
  ComposeMailContactData,
  ComposeMailDealData,
  ComposeMailLeadData,
} from 'pages/Email/types/email.type';

import { formatPhoneNumber, usCurrencyFormat } from 'utils/util';

type Props = {
  connectedEntity: ComposeMailContactData &
    ComposeMailLeadData &
    ComposeMailDealData &
    ComposeMailAccountData;
  connectedEntityNameModel: ModuleNames;
};

const DisplayEntityDetail = (props: Props) => {
  const { connectedEntity, connectedEntityNameModel } = props;
  switch (connectedEntityNameModel) {
    case ModuleNames.ACCOUNT:
      return (
        <>
          <h4 className="text-[#808080] text-[12px] font-biotif__Medium pr-[35px]">
            Linked Account
          </h4>
          <h3 className="text-[16px] font-biotif__Medium text-ipBlack__textColor mt-[10px] mb-[12px]">
            {connectedEntity.account_name || ''}
          </h3>
          <div className="connected__lead__deal__details mb-[15px] pb-[15px] border-b border-b-whiteScreen__BorderColor last:mb-0 last:pb-0 last:border-b-0">
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Account Owner:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.account_owner || ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Email:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.account_email || ''}
              </div>
            </div>
          </div>
        </>
      );

    case ModuleNames.CONTACT:
      return (
        <>
          <h4 className="text-[#808080] text-[12px] font-biotif__Medium pr-[35px]">
            Linked Contact
          </h4>
          <h3 className="text-[16px] font-biotif__Medium text-ipBlack__textColor mt-[10px] mb-[12px]">
            {connectedEntity.contact_name || ''}
          </h3>
          <div className="connected__lead__deal__details mb-[15px] pb-[15px] border-b border-b-whiteScreen__BorderColor last:mb-0 last:pb-0 last:border-b-0">
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Contact Owner:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.contact_owner || ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Email:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.contact_email || ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Phone:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {formatPhoneNumber(connectedEntity.contact_phone) || ''}
              </div>
            </div>
          </div>
        </>
      );

    case ModuleNames.LEAD:
      return (
        <>
          <h4 className="text-[#808080] text-[12px] font-biotif__Medium pr-[35px]">
            Linked Lead
          </h4>
          <h3 className="text-[16px] font-biotif__Medium text-ipBlack__textColor mt-[10px] mb-[12px]">
            {connectedEntity.lead_name || ''}
          </h3>
          <div className="connected__lead__deal__details mb-[15px] pb-[15px] border-b border-b-whiteScreen__BorderColor last:mb-0 last:pb-0 last:border-b-0">
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Lead Owner:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.lead_owner || ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Lead Value:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {usCurrencyFormat(
                  connectedEntity.lead_value?.toString() || ''
                ) || ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Related Contact:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.lead_related_contact || ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Related account:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.lead_related_account || ''}
              </div>
            </div>
          </div>
        </>
      );

    case ModuleNames.DEAL:
      return (
        <>
          <h4 className="text-[#808080] text-[12px] font-biotif__Medium pr-[35px]">
            Linked Deal
          </h4>
          <h3 className="text-[16px] font-biotif__Medium text-ipBlack__textColor mt-[10px] mb-[12px]">
            {connectedEntity.deal_name || ''}
          </h3>
          <div className="connected__lead__deal__details mb-[15px] pb-[15px] border-b border-b-whiteScreen__BorderColor last:mb-0 last:pb-0 last:border-b-0">
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Deal Owner:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.deal_owner || ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Related Contact:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.deal_related_contact || ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Related Account:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.deal_related_account || ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Deal Value:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {usCurrencyFormat(
                  connectedEntity.deal_value?.toString() || ''
                ) || ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Closing Date:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {(connectedEntity.closing_date && (
                  <DateFormat date={connectedEntity.closing_date} />
                )) ||
                  ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Pipeline:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.pipeline || ''}
              </div>
            </div>
            <div className="flex flex-wrap items-center mb-[4px]">
              <div className="inline-block text-[#808080] text-[14px] font-biotif__Regular mr-[5px] mb-[2px]">
                Pipeline Stage:
              </div>
              <div className="inline-block text-ipBlack__textColor text-[14px] font-biotif__SemiBold mb-[2px]">
                {connectedEntity.pipeline_stage || ''}
              </div>
            </div>
          </div>
        </>
      );

    default:
      return <></>;
  }
};

export default DisplayEntityDetail;
