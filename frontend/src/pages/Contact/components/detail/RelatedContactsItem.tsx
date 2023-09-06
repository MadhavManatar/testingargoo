import { useNavigate } from 'react-router-dom';

// ** components **
import RedirectToGoogleMap from 'components/Address/components/RedirectToGoogleMap';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import InfoWrapper from 'components/EntityDetails/InfoWrapper';
import QuickLookCardModal from 'components/EntityDetails/QuickLookCard/QuickLookCardModal';
import Image from 'components/Image';
import AddContactModal from '../AddContactModal';

// ** hooks **
import useContactInfo from 'pages/Contact/hooks/useContactInfo';

// ** Constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames } from 'constant/permissions.constant';

// ** Types **
import { ContactDetails } from 'pages/Contact/types/contacts.types';
import { EmailModalType } from 'pages/Dashboard/types/dashboard.types';

// ** Util **
import { setUrlParams } from 'utils/util';
import { useState } from 'react';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

type Props = {
  contact: ContactDetails;
  job_role?: string;
  relatedAccountName?: string | undefined;
};

const RelatedContactsItem = (props: Props) => {
  const { contact, job_role, relatedAccountName } = props;
  const { contactInfo } = useContactInfo({ contact });
  const { address1, address2, city, country, state, zip } = contactInfo;
  const entityDataForActivity = {
    id: contactInfo?.id,
    name: contactInfo?.name || '',
    type: ModuleNames.CONTACT,
  };
  const relatedEntityDataForActivity = {
    account: {
      id: contactInfo?.id,
      name: relatedAccountName || '',
      type: ModuleNames.ACCOUNT,
    },
    contact: {
      id: contactInfo?.id,
      name: contactInfo?.name || '',
    },
  };
  const navigate = useNavigate();
  const redirectToContact = () => {
    navigate(
      setUrlParams(PRIVATE_NAVIGATION.contacts.detailPage, contactInfo?.id)
    );
  };
  const [modal, setModal] = useState<EmailModalType>();

  const openModal = (modalType: EmailModalType) => setModal(modalType);
  const closeModal = () => setModal(undefined);

  return (
    <div
      key={contact?.id}
      className="w-1/4 px-[10px] mb-[20px] 4xl:w-1/3 3xl:w-1/2 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 md:w-full sm:w-full sm:mb-[10px] sm:last:mb-0"
    >
      <div className="related__card__box related__contact__card__box">
        <div className="inner__wrapper">
          <div className="img__wrapper">
            <Image
              imgClassName="w-[34px] h-[34px] object-cover object-center rounded-full"
              first_name={contact.name || ''}
              imgPath={contact.contact_image || ''}
              serverPath
            />
          </div>
          <div className="right__details contact__details__wrapper w-full">
            <div
              className="toggle__btn view__btn"
              onClick={() => redirectToContact()}
            >
              <IconAnimation
                iconType="eyeFilled"
                animationIconType={IconTypeJson.View}
                className="socian__ani__icon__wrapper"
              />
            </div>
            <div
              className="toggle__btn edit__btn"
              onClick={() => openModal('contact')}
            >
              <IconAnimation
                iconType="editFilled"
                animationIconType={IconTypeJson.Edit}
                className="socian__ani__icon__wrapper"
              />
            </div>
            <div
              className="name text-[16px] block pt-[4px] mb-[3px] leading-[20px] font-biotif__Medium text-black__TextColor800 w-full pr-[70px] cursor-pointer hover:text-primaryColorSD hover:underline"
              onClick={() => redirectToContact()}
            >
              <InfoWrapper field={contactInfo.name} isCustomLabelHide />
            </div>
            <div className="designation">
              <InfoWrapper
                field={job_role || contactInfo.jobRole}
                isCustomLabelHide
              />
            </div>
            <div className="w-full leading-normal phone__wrapper">
              {contactInfo.phone ? (
                <ClickableMobile number={contactInfo.phone} />
              ) : null}
            </div>
            <div className="w-full leading-normal email__wrapper">
              {contactInfo.email ? (
                <ClickableEmail mail={contactInfo.email} />
              ) : null}
            </div>
            <div className="w-full leading-normal address__wrapper">
              <RedirectToGoogleMap
                address={{
                  address1,
                  address2,
                  city,
                  country: country?.name,
                  state: state?.name,
                  zip,
                }}
              />
            </div>
            <div className="social__wrapper">
              <QuickLookCardModal
                extraInfo={{
                  email: contactInfo?.email || '',
                  phone: contactInfo?.phone || '',
                  phoneType: contactInfo?.phoneType || '',
                }}
                modelName={ModuleNames.CONTACT}
                modelRecordId={contactInfo?.id}
                activityEntityData={entityDataForActivity}
                relatedEntityData={relatedEntityDataForActivity}
              />
            </div>
            {/* update contact modal */}
            {modal === 'contact' && (
              <AddContactModal
                id={contactInfo?.id}
                isOpen={modal === 'contact'}
                closeModal={closeModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedContactsItem;
