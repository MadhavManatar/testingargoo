// ** Import Packages **
import { useLocation, useNavigate } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Hook **
import usePermission from 'hooks/usePermission';
import { useToggleDropdown } from 'hooks/useToggleDropdown';

// ** Type **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { getMailProviderOption } from 'redux/slices/commonSlice';
import { useSelector } from 'react-redux';
import { QuickModalType } from '../types/dashboard.types';
import { useEffect, useRef, useState } from 'react';
import AddActivityModal from 'pages/Activity/components/Modal/AddActivityModal';
import AddEmailComposerModal from 'pages/Email/components/emailComposer/AddEmailComposerModal';
import { EmailModalType } from 'pages/Email/types/email.type';
import {
  MailTokenProvider,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import { ModuleNames } from 'constant/permissions.constant';
import { getQuickPopup } from 'redux/slices/quickPopupDefaultSlice';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

const QuickAddDropDown = () => {
  // ** Hooks
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [modal, setModal] = useState<QuickModalType>();
  const [modalEmail, setModalEmail] = useState<EmailModalType>();
  const [emailUndoHelperObj, setEmailUndoHelperObj] = useState<{
    id?: number;
    delay_time: number;
    provider?: MailTokenProvider;
  }>({ delay_time: 10 });
  const [autoFill, setAutoFill] = useState<boolean>(false);
  const [emailEntityInfo, setEmailEntityInfo] = useState<{
    name: ModuleNames;
    id: number | null;
  }>();
  // ** Custom Hooks
  const selectorQuick = useSelector(getQuickPopup);
  const location = useLocation();
  const { dropdownRef, isDropdownOpen, toggleDropdown } = useToggleDropdown();
  const {
    createLeadPermission,
    createContactPermission,
    createDealPermission,
    createAccountPermission,
    createActivityPermission,
  } = usePermission();

  let queryPara = '';
  let queryAcc = '';

  if (pathname.includes('/contacts/') || pathname.includes('/accounts/')) {
    queryPara = '?quickPopup=true';
    queryAcc = '?quickAccount=true';
  }
  const mailProviders = useSelector(getMailProviderOption);
  const openModal = (value: QuickModalType) => {
    setModal(value);
    toggleDropdown();
  };
  const closeModal = () => setModal(undefined);
  const closeModalEmail = () => setModalEmail(undefined);
  const modalRef = useRef<EmailModalType>();

  // Quick Email Click
  const QuickEmailClick = () => {
    if (
      (mailProviders?.length === 1 && mailProviders?.[0].label !== 'All') ||
      mailProviders?.length > 1
    ) {
      if (location.pathname.includes('/accounts/')) {
        setEmailEntityInfo({
          name: ModuleNames.ACCOUNT,
          id: Number(selectorQuick?.account?.id) || null,
        });
      }
      if (location.pathname.includes('/contacts/')) {
        setEmailEntityInfo({
          name: ModuleNames.CONTACT,
          id: Number(selectorQuick?.contact?.id) || null,
        });
      }
      if (location.pathname.includes('/leads/')) {
        setEmailEntityInfo({
          name: ModuleNames.LEAD,
          id: Number(selectorQuick?.lead?.id) || null,
        });
      }
      if (location.pathname.includes('/deals/')) {
        setEmailEntityInfo({
          name: ModuleNames.DEAL,
          id: Number(selectorQuick?.deal?.id) || null,
        });
      }
      setModalEmail('compose');
    } else {
      navigate(
        `/${PRIVATE_NAVIGATION.settings.emailSetting.connect.view}${queryPara}`
      );
    }
  };
  // Set Auto Fill Value From Inner Page Only
  useEffect(() => {
    if (
      location.pathname.includes('/accounts/') ||
      location.pathname.includes('/contacts/') ||
      location.pathname.includes('/leads/') ||
      location.pathname.includes('/deals/')
    ) {
      setAutoFill(true);
    }
  }, [location.pathname]);

  return (
    <>
      <div
        className="inline-flex items-center relative header__quick__wrapper z-[5]"
        ref={dropdownRef}
      >
        <Button
          onClick={toggleDropdown}
          className="!text-[0px] primary__Btn w-[30px] h-[30px] rounded-full !p-0 relative before:content-[''] before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:w-[2px] before:h-[12px] before:bg-white before:rounded-[20px] after:content-[''] after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:h-[2px] after:w-[12px] after:bg-white after:rounded-[20px]"
        >
          .
        </Button>
        {isDropdownOpen && (
          <div className="add__dropdown__menu absolute top-[calc(100%_-_2px)] right-[0px] pt-[5px]">
            <div className="inner__wrapper bg-ipWhite__bgColor min-w-[150px] relative rounded-[10px]">
              <div className="">
                <AuthGuard isAccessible={createLeadPermission}>
                  <div
                    className="item"
                    onClick={() => {
                      navigate(`/${PRIVATE_NAVIGATION.leads.add}${queryPara}`);
                    }}
                  >
                    <div className="flex items-center relative z-[2] cursor-pointer">
                      <IconAnimation
                        iconType="leadsFilledBlueIcon"
                        animationIconType={IconTypeJson.Lead}
                        iconClassName="!p-[1px] !mr-[5px] !w-[24px] !h-[24px] !bg-transparent"
                        textLabel="Lead"
                        textLabelClassName="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor mt-[2px]"
                      />
                    </div>
                  </div>
                </AuthGuard>
                <AuthGuard isAccessible={createDealPermission}>
                  <div
                    className="item"
                    onClick={() => {
                      navigate(`/${PRIVATE_NAVIGATION.deals.add}${queryPara}`);
                    }}
                  >
                    <div className="flex items-center relative z-[2] cursor-pointer">
                      <IconAnimation
                        iconType="dealsFilledBlueIcon"
                        animationIconType={IconTypeJson.Deal}
                        iconClassName="!p-[1px] !mr-[5px] !w-[24px] !h-[24px] !bg-transparent"
                        textLabel="Deal"
                        textLabelClassName="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor mt-[2px]"
                      />
                    </div>
                  </div>
                </AuthGuard>
                <AuthGuard isAccessible={createContactPermission}>
                  <div
                    className="item active"
                    onClick={() => {
                      navigate(
                        `/${PRIVATE_NAVIGATION.contacts.add}${queryPara}`
                      );
                    }}
                  >
                    <div className="flex items-center relative z-[2] cursor-pointer">
                      <IconAnimation
                        iconType="phoneFilledBlueIcon"
                        animationIconType={IconTypeJson.Contact}
                        iconClassName="!p-[1px] !mr-[5px] !w-[24px] !h-[24px] !bg-transparent"
                        textLabel="Contact"
                        textLabelClassName="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor mt-[2px]"
                      />
                    </div>
                  </div>
                </AuthGuard>
                <AuthGuard isAccessible={createAccountPermission}>
                  <div
                    className="item"
                    onClick={() => {
                      navigate(
                        `/${PRIVATE_NAVIGATION.accounts.add}${queryPara}`
                      );
                    }}
                  >
                    <div className="flex items-center relative z-[2] cursor-pointer">
                      <IconAnimation
                        iconType="accountFilledBlueIcon"
                        animationIconType={IconTypeJson.Account}
                        iconClassName="!p-[1px] !mr-[5px] !w-[24px] !h-[24px] !bg-transparent"
                        textLabel="Account"
                        textLabelClassName="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor mt-[2px]"
                      />
                    </div>
                  </div>
                </AuthGuard>
                <AuthGuard isAccessible={createActivityPermission}>
                  <div className="item" onClick={() => openModal('activity')}>
                    <div className="flex items-center relative z-[2] cursor-pointer">
                      <IconAnimation
                        iconType="activitiesFilledBlueIcon"
                        animationIconType={IconTypeJson.Activity}
                        iconClassName="!p-[1px] !mr-[5px] !w-[24px] !h-[24px] !bg-transparent"
                        textLabel="Activity"
                        textLabelClassName="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor mt-[2px]"
                      />
                    </div>
                  </div>
                </AuthGuard>
                <div className="item" onClick={() => QuickEmailClick()}>
                  <div className="flex items-center relative z-[2] cursor-pointer">
                    <IconAnimation
                      iconType="emailFilledBlueIcon"
                      animationIconType={IconTypeJson.Email}
                      iconClassName="!p-[1px] !mr-[5px] !w-[24px] !h-[24px] !bg-transparent"
                      textLabel="Email"
                      textLabelClassName="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor mt-[2px]"
                    />
                  </div>
                </div>
                {!selectorQuick?.parent?.isParentChildLoading &&
                  (selectorQuick?.parent?.parentCount ||
                    selectorQuick?.parent?.parentCount === 0) &&
                  selectorQuick?.parent?.parentCount < 4 && (
                    <div
                      className="item"
                      onClick={() => {
                        navigate(
                          `/${PRIVATE_NAVIGATION.accounts.add}${queryAcc}`
                        );
                      }}
                    >
                      <div className="flex items-center relative z-[2] cursor-pointer">
                        <IconAnimation
                          iconType="accountFilledBlueIcon"
                          animationIconType={IconTypeJson.Account}
                          iconClassName="!p-[1px] !mr-[5px] !w-[24px] !h-[24px] !bg-transparent"
                          textLabel="Sub Account"
                          textLabelClassName="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor mt-[2px]"
                        />
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* add lead modal */}
      {modal === 'activity' && (
        <AddActivityModal
          isQuickModal
          isOpen={modal === 'activity'}
          closeModal={closeModal}
          quickAutoFill={autoFill}
        />
      )}
      {modalEmail === 'compose' && (
        <AddEmailComposerModal
          modalRef={modalRef}
          isOpen={modalEmail === 'compose'}
          // defaultRecipient={[
          //   { label: 'demo@gmail.com', value: 'demo@gmail.com' },
          // ]}
          closeModal={closeModalEmail}
          setModal={setModalEmail}
          providerOption={mailProviders.filter(
            (item) =>
              ((item.value as string).split(',')[1] as TokenProvider) !==
              TokenProvider.All
          )}
          emailUndoHelperObj={emailUndoHelperObj}
          setEmailUndoHelperObj={setEmailUndoHelperObj}
          connectEntityModelName={emailEntityInfo?.name}
          connectEntityModelRecordId={emailEntityInfo?.id || undefined}
        />
      )}
    </>
  );
};

export default QuickAddDropDown;
