import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ** components **
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import InfoWrapper from 'components/EntityDetails/InfoWrapper';
import QuickLookCardModal from 'components/EntityDetails/QuickLookCard/QuickLookCardModal';
import Image from 'components/Image';

// ** hooks **
import useAccountInfo from 'pages/Account/hooks/useAccountInfo';

// ** others **
import { AccountDetails } from 'pages/Account/types/account.types';

// ** Constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames } from 'constant/permissions.constant';

// ** Util **
import { setUrlParams } from 'utils/util';
import RedirectToGoogleMap from 'components/Address/components/RedirectToGoogleMap';
import { EmailModalType } from 'pages/Dashboard/types/dashboard.types';
import AddAccountModal from 'pages/Account/components/AddAccountModal';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

type Props = {
  account: AccountDetails;
  job_role?: string;
  relatedContactData?: {
    id: number;
    name: string | undefined;
  };
};

const RelatedAccountsItem = (props: Props) => {
  const { account, job_role, relatedContactData } = props;
  const { accountInfo } = useAccountInfo({
    accountInfo: account,
  });
  const entityDataForActivity = {
    id: accountInfo?.id || 0,
    name: accountInfo?.name || '',
    type: ModuleNames.ACCOUNT,
  };
  const relatedEntityDataForActivity = {
    account: {
      id: accountInfo?.id || 0,
      name: accountInfo?.name || '',
      type: ModuleNames.ACCOUNT,
    },
    contact: {
      id: relatedContactData?.id || 0,
      name: relatedContactData?.name || '',
    },
  };
  const [modal, setModal] = useState<EmailModalType>();

  const openModal = (modalType: EmailModalType) => setModal(modalType);
  const closeModal = () => setModal(undefined);

  const { address1, address2, city, country, state, zip } = account;

  const navigate = useNavigate();
  const redirectToAccount = () => {
    navigate(
      setUrlParams(PRIVATE_NAVIGATION.accounts.detailPage, accountInfo?.id || 0)
    );
  };

  return (
    <div
      key={account?.id}
      className="w-1/4 px-[10px] mb-[20px] 4xl:w-1/3 3xl:w-1/2 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 md:w-full sm:w-full sm:mb-[10px] sm:last:mb-0"
    >
      <div className="related__card__box related__lead__card__box">
        <div className="inner__wrapper">
          <div className="account__details__wrapper w-full flex flex-wrap">
            <div className="img__wrapper">
              <Image
                imgClassName="w-[34px] h-[34px] object-cover object-center rounded-full"
                first_name={account.name || ''}
                imgPath={account.account_image || ''}
                serverPath
              />
            </div>
            <div className="right__details account__details__wrapper w-full">
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
                className="toggle__btn edit__btn"
                onClick={() => openModal('account')}
              >
                <IconAnimation
                  iconType="editFilled"
                  animationIconType={IconTypeJson.Edit}
                  className="socian__ani__icon__wrapper"
                />
              </div>
              <div
                className="name text-[16px] block pt-[4px] mb-[3px] leading-[20px] font-biotif__Medium text-black__TextColor800 w-full pr-[70px] cursor-pointer hover:text-primaryColorSD hover:underline"
                onClick={() => redirectToAccount()}
              >
                <InfoWrapper field={accountInfo.name} isCustomLabelHide />
              </div>
              <div className="designation">
                <InfoWrapper field={job_role || ''} isCustomLabelHide />
              </div>
              <div className="w-full leading-normal phone__wrapper">
                {accountInfo.phones ? (
                  <ClickableMobile number={accountInfo.phones} />
                ) : null}
              </div>
              <div className="w-full leading-normal email__wrapper">
                {accountInfo.emails ? (
                  <ClickableEmail mail={accountInfo.emails} />
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
                    email: accountInfo?.emails || '',
                    phone: accountInfo?.phones || '',
                    phoneType: accountInfo?.phoneType || '',
                  }}
                  modelName={ModuleNames.ACCOUNT}
                  modelRecordId={accountInfo?.id || 0}
                  activityEntityData={entityDataForActivity}
                  relatedEntityData={relatedEntityDataForActivity}
                />
              </div>
              {/* update account modal */}
              {modal === 'account' && (
                <AddAccountModal
                  isOpen={modal === 'account'}
                  closeModal={closeModal}
                  id={accountInfo?.id || 0}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedAccountsItem;
