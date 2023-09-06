// ** Import Packages **
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ** components **
import DateFormat from 'components/DateFormat';
import InfoWrapper from 'components/EntityDetails/InfoWrapper';
import QuickLookCardModal from 'components/EntityDetails/QuickLookCard/QuickLookCardModal';
import AddDealModal from 'pages/Deal/components/AddDealModal';

// ** Constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames } from 'constant/permissions.constant';

// ** Types **
import { RelatedLead } from 'pages/Contact/types/contacts.types';
import { EmailModalType } from 'pages/Dashboard/types/dashboard.types';

// ** Util **
import { setUrlParams, usCurrencyFormat } from 'utils/util';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

type Props = {
  lead: RelatedLead;
  contactData?: {
    id: number;
    name: string | undefined;
  };
};

const RelatedDealItems = (Props: Props) => {
  const { lead, contactData } = Props;

  // Hooks
  const navigate = useNavigate();
  // QuickBar
  const entityDataForActivity = {
    id: lead?.id || 0,
    name: lead?.name || '',
    type: ModuleNames.LEAD,
  };
  const relatedEntityDataForActivity = {
    account: {
      id: lead?.id,
      name: lead?.related_account?.name,
      type: ModuleNames.ACCOUNT,
    },
    contact: {
      id: contactData?.id || 0,
      name: contactData?.name || '',
    },
  };
  // Redirect To Deal/Lead Page
  const redirectToAccount = () => {
    if (lead.is_deal) {
      navigate(setUrlParams(PRIVATE_NAVIGATION.deals.detailPage, lead.id));
    } else {
      navigate(setUrlParams(PRIVATE_NAVIGATION.leads.detailPage, lead.id));
    }
  };
  const [modal, setModal] = useState<EmailModalType>();

  const openModal = (modalType: EmailModalType) => setModal(modalType);
  const closeModal = () => setModal(undefined);

  // Pipeline Stage
  const stageData = lead.deal_stage_history.filter(
    (stage) => stage.isCurrentActive
  );
  // Primary Phone Number
  const dealPhone = (lead?.related_account?.phones || []).find(
    (phoneVal) => phoneVal.isPrimary
  );

  // Primary Email ID
  const emailId =
    (lead?.related_account?.emails || []).find((email) => email.isPrimary)
      ?.value || '';

  return (
    <div
      key={lead?.id}
      className="w-1/4 px-[10px] mb-[20px] 4xl:w-1/3 3xl:w-1/2 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 md:w-full sm:w-full sm:mb-[10px] sm:last:mb-0"
    >
      <div className="related__card__box related__lead__card__box">
        <div className="inner__wrapper">
          <div
            className="deal__details__wrapper w-full"
            onClick={(e) => {
              e.stopPropagation();
              // e.preventDefault();
            }}
          >
            <div
              className="toggle__btn edit__btn"
              onClick={() => openModal('deal')}
            >
              <IconAnimation
                iconType="editFilled"
                animationIconType={IconTypeJson.Edit}
                className="socian__ani__icon__wrapper"
              />
            </div>
            <div
              className="toggle__btn view__btn"
              onClick={() => redirectToAccount()}
            >
              <IconAnimation
                iconType="eyeFilled"
                animationIconType={IconTypeJson.View}
                className="socian__ani__icon__wrapper"
              />
            </div>
            <div
              className="text-[16px] block pt-[4px] mb-[8px] leading-[20px] font-biotif__Medium text-black__TextColor800 w-full pr-[70px] cursor-pointer hover:text-primaryColorSD hover:underline"
              onClick={() => redirectToAccount()}
            >
              <InfoWrapper field={lead.name} isCustomLabelHide />
            </div>

            <div className="deal__details__row mb-[4px]">
              <span className="label text-[15px] font-biotif__Regular text-black__TextColor600 mr-[7px] inline-block">
                Related Account:
              </span>{' '}
              <span className="value text-[15px] font-biotif__Regular text-ipBlack__textColor inline-block">
                {lead?.related_account?.name || '-'}
              </span>
            </div>
            <div className="deal__details__row mb-[4px]">
              <span className="label text-[15px] font-biotif__Regular text-black__TextColor600 mr-[7px] inline-block">
                Pipeline:
              </span>{' '}
              <span className="value text-[15px] font-biotif__Regular text-ipBlack__textColor inline-block">
                {lead.pipeline.name || '-'}
              </span>
            </div>
            <div className="deal__details__row mb-[4px]">
              <span className="label text-[15px] font-biotif__Regular text-black__TextColor600 mr-[7px] inline-block">
                Stage:
              </span>{' '}
              <span className="value text-[15px] font-biotif__Regular text-ipBlack__textColor inline-block">
                {stageData[0]?.stage?.name || '-'}
              </span>
            </div>
            <div className="deal__details__row mb-[4px]">
              <span className="label text-[15px] font-biotif__Regular text-black__TextColor600 mr-[7px] inline-block">
                Value:
              </span>{' '}
              <span className="value text-[15px] font-biotif__Regular text-ipBlack__textColor inline-block">
                {lead.deal_value ? usCurrencyFormat(lead.deal_value) : '-'}
              </span>
            </div>
            <div className="deal__details__row mb-[4px]">
              <span className="label text-[15px] font-biotif__Regular text-black__TextColor600 mr-[7px] inline-block">
                Closing:{' '}
              </span>
              <span className="value text-[15px] font-biotif__Regular text-ipBlack__textColor inline-block">
                <DateFormat format="MMM d, yyyy" date={lead.closing_date} />
              </span>
            </div>
            <div className="social__wrapper">
              <QuickLookCardModal
                extraInfo={{
                  email: emailId || '',
                  phone: dealPhone?.value.toString() || '',
                  phoneType: dealPhone?.phoneType || '',
                }}
                modelName={ModuleNames.DEAL}
                modelRecordId={lead.id || 0}
                activityEntityData={entityDataForActivity}
                relatedEntityData={relatedEntityDataForActivity}
              />
            </div>
            {/* update deal modal */}
            {modal === 'deal' && (
              <AddDealModal
                id={lead.id}
                isOpen={modal === 'deal'}
                closeModal={closeModal}
              />
            )}
          </div>
          {/* update deal modal */}
          {modal === 'deal' && (
            <AddDealModal
              id={lead.id}
              isOpen={modal === 'deal'}
              closeModal={closeModal}
              onAdd={() => {
                //
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default RelatedDealItems;
