// ** Import Packages **
import { useNavigate } from 'react-router-dom';

// ** Components **
import RedirectToGoogleMap from 'components/Address/components/RedirectToGoogleMap';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import Icon from 'components/Icon';
import QuickLookCardModal from './QuickLookCardModal';

// ** Constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames } from 'constant/permissions.constant';

// ** Type **
import { EntityCardPropsType } from './types/quickLookCard.type';

// ** Util **
import { setUrlParams } from 'utils/util';
import { useState } from 'react';
import AddContactModal from 'pages/Contact/components/AddContactModal';
import usePermission from 'hooks/usePermission';
import AuthGuard from 'pages/auth/components/AuthGuard';
import AddAccountModal from 'pages/Account/components/AddAccountModal';
import EditActivityModal from 'pages/Activity/components/Modal/EditActivityModal';
import AddLeadModal from 'pages/Lead/components/AddLeadModal';
import AddDealModal from 'pages/Deal/components/AddDealModal';

export const EntityCard = (props: EntityCardPropsType) => {
  const {
    close,
    setIsOpen,
    name,
    email,
    phone,
    id,
    modelName,
    isOpen,
    address,
    phoneType,
    handleDealWonLost,
    launchActivity,
    activityEntityData,
    relatedEntityData,
    hideActivity = false,
    hideEmail = false,
    hidePhone = false,
    completeOrOpenActivity,
    startOrStopActivity,
  } = props;
  const [modal, setModal] = useState<typeof modelName>();

  const openModal = (value: typeof modelName) => setModal(value);
  const closeModal = () => setModal(undefined);

  const navigate = useNavigate();
  const {
    updateContactPermission,
    updateAccountPermission,
    updateActivityPermission,
    updateDealPermission,
    updateLeadPermission,
  } = usePermission();

  const entityUpdatePermissions = {
    [ModuleNames.LEAD]: updateLeadPermission,
    [ModuleNames.DEAL]: updateDealPermission,
    [ModuleNames.CONTACT]: updateContactPermission,
    [ModuleNames.ACCOUNT]: updateAccountPermission,
    [ModuleNames.ACTIVITY]: updateActivityPermission,
  };

  const redirectUrl = (type: ModuleNames) => {
    switch (type) {
      case ModuleNames.LEAD:
        return PRIVATE_NAVIGATION.leads.detailPage;
      case ModuleNames.DEAL:
        return PRIVATE_NAVIGATION.deals.detailPage;
      case ModuleNames.CONTACT:
        return PRIVATE_NAVIGATION.contacts.detailPage;
      case ModuleNames.ACCOUNT:
        return PRIVATE_NAVIGATION.accounts.detailPage;
      case ModuleNames.ACTIVITY:
        return PRIVATE_NAVIGATION.activities.detailPage;

      default:
        return PRIVATE_NAVIGATION.dashboard.view;
    }
  };

  const onEdit = () => {
    openModal(modelName);
    close();
  };
  return (
    <>
      <div className="relative pb-[15px]">
        <h3 className="text-[16px] font-biotif__Medium text-black__TextColor800 mb-[10px] pr-[64px]">
          {name}
        </h3>
        <div>
          {phone ? (
            <div className="phone flex flex-wrap mb-[5px] last:mb-0">
              <span className="inline-block w-[calc(100%_-_47px)] text-[14px] font-biotif__Regular text-black__TextColor600">
                <ClickableMobile number={phone} />
              </span>
            </div>
          ) : null}
          {email ? (
            <div className="email flex flex-wrap mb-[5px] last:mb-0">
              <span className="inline-block w-[calc(100%_-_41px)] text-[14px] font-biotif__Regular text-black__TextColor600">
                <ClickableEmail
                  mail={email}
                  customOnClick={() => setIsOpen?.(false)}
                />
              </span>
            </div>
          ) : null}
          {address ? (
            <div className="w-full leading-[16px] mb-[5px] last:mb-0">
              <span className="inline-block w-full text-[14px] font-biotif__Regular text-black__TextColor600">
                <RedirectToGoogleMap
                  address={{
                    address1: address.address1,
                    address2: address.address2,
                    state: address?.state,
                    city: address?.city,
                    country: address?.country,
                    zip: address.zip,
                  }}
                />
              </span>
            </div>
          ) : null}
        </div>

        <AuthGuard isAccessible={entityUpdatePermissions?.[modelName]}>
          <button
            className="toggle__btn absolute top-[-4px] right-[27px] sm:top-[-7px]"
            onClick={() => onEdit()}
          >
            <Icon
              className="w-[28px] h-[28px] rounded-[6px] p-[5px] relative top-[-2px] border-[1px] border-whiteScreen__BorderColor duration-500 hover:bg-parentBgWhite__grayBtnBG"
              iconType="editFilled"
              fill="var(--primaryColor)"
            />
          </button>
        </AuthGuard>
        <button
          className="toggle__btn absolute top-[-4px] right-[-8px] sm:top-[-7px]"
          onClick={() => {
            navigate(setUrlParams(redirectUrl(modelName), id));
          }}
        >
          <Icon
            className="w-[28px] h-[28px] rounded-[6px] p-[5px] relative top-[-2px] border-[1px] border-whiteScreen__BorderColor duration-500 hover:bg-parentBgWhite__grayBtnBG"
            iconType="eyeFilled"
            fill="var(--primaryColor)"
          />
        </button>
      </div>
      <QuickLookCardModal
        extraInfo={{ email, phone, phoneType }}
        modelRecordId={id}
        {...{
          modelName,
          close,
          setIsOpen,
          isOpen,
          activityEntityData,
          relatedEntityData,
          handleDealWonLost,
          launchActivity,
          hideActivity,
          hideEmail,
          hidePhone,
          completeOrOpenActivity,
          startOrStopActivity,
        }}
      />

      {modal === ModuleNames.LEAD && (
        <AddLeadModal
          isQuickModal
          isOpen={modal === ModuleNames.LEAD}
          closeModal={closeModal}
          id={id}
        />
      )}

      {modal === ModuleNames.DEAL && (
        <AddDealModal
          id={id}
          isOpen={modal === ModuleNames.DEAL}
          closeModal={closeModal}
        />
      )}

      {/* update contact modal */}
      {modal === ModuleNames.CONTACT && (
        <AddContactModal
          id={id}
          isOpen={modal === ModuleNames.CONTACT}
          closeModal={closeModal}
        />
      )}
      {/* update account modal */}
      {modal === ModuleNames.ACCOUNT && (
        <AddAccountModal
          isQuickModal
          isOpen={modal === ModuleNames.ACCOUNT}
          closeModal={closeModal}
          id={id}
        />
      )}

      {modal === ModuleNames.ACTIVITY && (
        <EditActivityModal
          isOpen={modal === ModuleNames.ACTIVITY}
          closeModal={closeModal}
          id={id}
        />
      )}
    </>
  );
};

export default EntityCard;
