// ** Import Packages **
import { useNavigate } from 'react-router-dom';

// ** Components **
import DateFormat from 'components/DateFormat';
import Icon from 'components/Icon';
import QuickLookCardModal from './QuickLookCardModal';

// ** Constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames } from 'constant/permissions.constant';

// ** Type **
import { LeadDealCardPropsType } from './types/quickLookCard.type';

// ** Util **
import { setUrlParams, usCurrencyFormat } from 'utils/util';
import usePermission from 'hooks/usePermission';
import AuthGuard from 'pages/auth/components/AuthGuard';
import { useState } from 'react';
import { EmailModalType } from 'pages/Dashboard/types/dashboard.types';
import AddDealModal from 'pages/Deal/components/AddDealModal';
import AddLeadModal from 'pages/Lead/components/AddLeadModal';

const LeadDealCard = (props: LeadDealCardPropsType) => {
  const {
    close,
    setIsOpen,
    name,
    source,
    owner,
    value,
    stage,
    pipeline,
    closing_date,
    is_deal,
    id,
    isOpen,
    contactMail,
  } = props;

  const navigate = useNavigate();
  const { updateLeadPermission, updateDealPermission } = usePermission();
  const [modal, setModal] = useState<EmailModalType>();

  const openModal = (modalType: EmailModalType) => setModal(modalType);
  const closeModal = () => setModal(undefined);

  const redirectURL = is_deal
    ? PRIVATE_NAVIGATION.deals.detailPage
    : PRIVATE_NAVIGATION.leads.detailPage;
  const titlePrefix = is_deal ? 'Deal' : 'Lead';

  return (
    <>
      <div className="relative">
        <h3 className="text-[16px] font-biotif__Medium text-[#2E3234] mb-[10px] pr-[28px]">
          {name}
        </h3>

        <div>
          {source ? (
            <div className="flex flex-wrap mb-[10px] last:mb-0">
              <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor">
                {titlePrefix} Source:
              </label>
              <span className="inline-block w-[calc(100%_-_87px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                {source}
              </span>
            </div>
          ) : null}
          {owner && owner.first_name && owner.last_name ? (
            <div className="flex flex-wrap mb-[10px] last:mb-0">
              <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor">
                {titlePrefix} Owner:
              </label>
              <span className="inline-block w-[calc(100%_-_85px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                {owner.first_name} {owner.last_name}
              </span>
            </div>
          ) : null}
          {value ? (
            <div className="flex flex-wrap mb-[10px] last:mb-0">
              <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor">
                {titlePrefix} Value:
              </label>
              <span className="inline-block w-[calc(100%_-_112px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                {usCurrencyFormat(value.toString() || '')}
              </span>
            </div>
          ) : null}
          {is_deal && closing_date ? (
            <div className="flex flex-wrap mb-[10px] last:mb-0">
              <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor">
                Closing Date:
              </label>
              <span className="inline-block w-[calc(100%_-_148px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                <DateFormat date={closing_date} format="M/dd/yyyy" />
              </span>
            </div>
          ) : null}
          {pipeline ? (
            <div className="flex flex-wrap mb-[10px] last:mb-0">
              <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor">
                Pipeline:
              </label>
              <span className="inline-block w-[calc(100%_-_112px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                {pipeline}
              </span>
            </div>
          ) : null}
          {stage ? (
            <div className="flex flex-wrap mb-[10px] last:mb-0">
              <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor">
                Pipeline Stage:
              </label>
              <span className="inline-block w-[calc(100%_-_112px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                {stage}
              </span>
            </div>
          ) : null}
        </div>
        <AuthGuard isAccessible={updateDealPermission || updateLeadPermission}>
          <button
            className="toggle__btn absolute top-[-4px] right-[24px] sm:top-[-7px]"
            onClick={() => {
              openModal(is_deal ? 'deal' : 'lead');
              close();
            }}
          >
            <Icon
              className="w-[28px] h-[28px] rounded-[6px] p-[5px] relative top-[-2px] border-[1px] border-black/10 duration-500 hover:bg-secondary__Btn__BGColor"
              iconType="editFilled"
              fill="var(--primaryColor)"
            />
          </button>
        </AuthGuard>
        <button
          className="toggle__btn absolute top-[-4px] right-[-8px] sm:top-[-7px]"
          onClick={() => navigate(setUrlParams(redirectURL, id))}
        >
          <Icon
            className="w-[28px] h-[28px] rounded-[6px] p-[5px] relative top-[-2px] border-[1px] border-black/10 duration-500 hover:bg-secondary__Btn__BGColor"
            iconType="eyeFilled"
            fill="var(--primaryColor)"
          />
        </button>
      </div>
      <QuickLookCardModal
        modelName={is_deal ? ModuleNames.DEAL : ModuleNames.LEAD}
        modelRecordId={id}
        extraInfo={{ ...contactMail, email: contactMail?.mail }}
        {...{ close, setIsOpen, isOpen }}
      />
      {/* update lead modal */}
      {modal === 'lead' && (
        <AddLeadModal
          isOpen={modal === 'lead'}
          closeModal={closeModal}
          id={id}
        />
      )}
      {/* update deal modal */}
      {modal === 'deal' && (
        <AddDealModal
          id={id}
          isOpen={modal === 'deal'}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default LeadDealCard;
