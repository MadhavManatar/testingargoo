// ** Import Packages **
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ** Components **
import RedirectToGoogleMap from 'components/Address/components/RedirectToGoogleMap';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import Dropdown from 'components/Dropdown';
import EntityCard from 'components/EntityDetails/QuickLookCard/EntityCard';
import Icon from 'components/Icon';
import Image from 'components/Image';
import AssignTagsList from 'components/detail-components/AssignTags/AssignTagsList';
import AuthGuard from 'pages/auth/components/AuthGuard';
import AccountMobileHeader from './AccountMobileHeader';

// ** Hook **
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constants **
import { ModalType } from 'components/EntityDetails/constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  BasicPermissionTypes,
  ModuleNames,
  TagPermissions,
} from 'constant/permissions.constant';

// ** Type **
import { AccountDetailsHeaderProps } from 'pages/Account/types/account.types';

// ** Util **
import { setUrlParams } from 'utils/util';
import DetailHeaderPhone from 'components/detail-components/detail-header-phone';
import { DetailHeaderEmail } from 'components/detail-components/detail-header-email';
import DetailHeaderNote from 'components/detail-components/detail-header-note';
import DetailHeaderAttachment from 'components/detail-components/detail-header-attachment';
import DetailHeaderTag from 'components/detail-components/detail-header-tag';
import DetailHeaderActivity from 'components/detail-components/detail-header-activity';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

const AccountDetailHeader = (props: AccountDetailsHeaderProps) => {
  const {
    setModal,
    parentChildData,
    isParentChildLoading,
    accountData,
    assignedTags,
    setAssignedTags,
    deleteAssignedTag,
    setIsLinkDocument,
    editTagsPermission,
    onEditClick,
    getScheduleActivity,
    isScheduleActivityLoading,
    isStayInTouchOpen,
    scheduleActivityData,
    setIsStayInTouchOpen,
  } = props;

  // ** custom hooks **
  const navigate = useNavigate();
  const { isMobileView } = useWindowDimensions();
  const { id: accountId } = accountData.account;

  let primaryContact = accountData?.account?.AccountContacts?.find(
    (val) => val.is_primary
  );

  if (
    !primaryContact &&
    accountData?.account &&
    accountData?.account?.AccountContacts &&
    accountData?.account?.AccountContacts?.length >= 1
  ) {
    primaryContact = accountData?.account?.AccountContacts?.[0];
  }

  const phone =
    accountData?.account?.AccountContacts?.find(
      (item) => item?.is_primary
    )?.contact?.phones.find((val) => val?.is_primary) ||
    (accountData.account.phones || []).find((val) => val?.isPrimary);

  const mail =
    accountData?.account?.AccountContacts?.find(
      (item) => item?.is_primary
    )?.contact?.emails.find((val) => val?.is_primary)?.value ||
    (accountData.account.emails || []).find((val) => val?.isPrimary)?.value;

  const contact_name = primaryContact?.contact?.name;

  const accountAddress = {
    address1: accountData?.account?.address1 || '',
    address2: accountData?.account?.address2 || '',
    state: accountData?.account?.state?.state_code || '',
    city: accountData?.account?.city || '',
    country: accountData?.account?.country?.name || '',
    zip: accountData?.account?.zip || '',
  };

  const checkAccountAddressLength = Object.values(accountAddress).find(
    (element) => element
  );

  const primaryContactAddress = {
    address1: primaryContact?.contact?.address1 || '',
    address2: primaryContact?.contact?.address2 || '',
    state: primaryContact?.contact?.state?.state_code || '',
    city: primaryContact?.contact?.city || '',
    country: primaryContact?.contact?.country?.name || '',
    zip: primaryContact?.contact?.zip || '',
  };

  const checkPrimaryContactAddressLength = Object.values(
    primaryContactAddress
  ).find((element) => element);

  const address = checkAccountAddressLength
    ? accountAddress
    : primaryContactAddress;

  const contact_jobRole =
    primaryContact?.contact?.job_role || primaryContact?.job_role;

  const setOpenModal = (modalName: ModalType) => {
    setModal((prev) => ({ ...prev, [modalName]: { open: true } }));
  };

  const contactCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = accountCardProps;
      const contactPrimaryEmail = (
        primaryContact?.contact?.emails || []
      )?.filter((val) => val.is_primary)?.[0]?.value;

      const accountPrimaryPhone = (
        primaryContact?.contact?.phones || []
      )?.filter((val) => val.is_primary)?.[0];
      return (
        <>
          {primaryContact?.contact?.name &&
            Boolean(primaryContact?.contact_id) && (
              <EntityCard
              modelName={ModuleNames.CONTACT}
                {...(!!checkPrimaryContactAddressLength && {
                  address: primaryContactAddress,
                })}
                id={primaryContact?.contact_id}
                name={primaryContact.contact?.name}
                email={contactPrimaryEmail}
                phone={accountPrimaryPhone?.value?.toString()}
                phoneType={accountPrimaryPhone?.phoneType || ''}
                {...{ close, setIsOpen, isOpen }}
              />
            )}
        </>
      );
    },
    [primaryContact]
  );

  const accountName = () => {
    return !isParentChildLoading &&
      parentChildData &&
      parentChildData?.parent.length ? (
      <div className="w-[100%]">
        {parentChildData.parent.map((acc, index) => {
          return (
            <span
              key={index}
              className="mr-[10px] pr-[10px] inline-block relative hover:cursor-pointer hover:text-primaryColorSD hover:underline text-black__TextColor800 before:content-[':'] before:absolute before:top-[-1px] before:right-0 before:rounded-full last:before:hidden"
              onClick={() =>
                navigate(
                  setUrlParams(
                    PRIVATE_NAVIGATION.accounts.detailPage,
                    acc.parent_id
                  )
                )
              }
            >
              {acc.parent_name}
            </span>
          );
        })}
      </div>
    ) : (
      ''
    );
  };

  return (
    <>
      {isMobileView ? (
        <AccountMobileHeader
          accountData={accountData}
          onEditClick={onEditClick}
          accountId={accountData.account.id}
          assignedTags={assignedTags}
          deleteAssignedTag={deleteAssignedTag}
          setOpenModal={setOpenModal}
          setIsLinkDocument={setIsLinkDocument}
          editTagsPermission={!!editTagsPermission}
          isStayInTouchOpen={isStayInTouchOpen}
          setIsStayInTouchOpen={setIsStayInTouchOpen}
          scheduleActivityData={scheduleActivityData}
          isScheduleActivityLoading={isScheduleActivityLoading}
          getScheduleActivity={getScheduleActivity}
          contact_jobRole={contact_jobRole}
          contact_name={contact_name}
          mail={mail}
          phone={phone}
          address={address}
        />
      ) : (
        <div className="activityInner__topHeader__box flex flex-wrap border border-whiteScreen__BorderColor rounded-[12px] p-[20px] pb-[10px] mb-[20px] sm:hidden">
          <div className="activityType flex flex-wrap content-center justify-center pr-[20px] w-[92px] relative before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[calc(100%_-_26px)] before:bg-whiteScreen__BorderColor">
            {accountData?.account?.account_image ? (
              <Image
                imgClassName="w-[60px] h-[60px] p-[8px] rounded-[10px] object-cover object-center"
                imgPath={accountData?.account?.account_image || ''}
                serverPath
              />
            ) : (
              <IconAnimation
                iconType="accountFilledBlueIcon"
                animationIconType={IconTypeJson.Account}
                className="!w-[60px] !h-[60px] !p-[8px] rounded-[10px] !bg-primaryColor"
              />
            )}
            <p className="text-[16px] text-black__TextColor800 font-biotif__Medium text-center w-full mt-[10px] break-words">
              Account
            </p>
          </div>
          <div className="right w-[calc(100%_-_93px)] pl-[20px] flex flex-wrap justify-between">
            <div className="main__details">
              <div className="flex flex-wrap">
                {accountName()}
                <h3 className="text-black__TextColor800 text-[20px] leading-[26px] font-biotif__Medium mr-[15px] mb-[3px]">
                  {accountData?.account?.name || ''}
                </h3>
                <div className="badge__wrapper mb-[10px] text-primaryColor">
                  {assignedTags?.list.length > 0 ? (
                    <AssignTagsList
                      setAssignedTags={setAssignedTags}
                      assignedTags={assignedTags}
                      deleteAssignedTag={deleteAssignedTag}
                      editTagsPermission={editTagsPermission}
                      setModal={() => setOpenModal(ModalType.TAG)}
                    />
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap designation__wrapper">
                <span className="text-[16px] text-black__TextColor800 font-biotif__Regular relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
                  <Dropdown
                    className="quickView__accContact__tippy"
                    zIndex={10}
                    hideOnClick
                    content={contactCard}
                  >
                    <button
                      type="button"
                      className="hover:text-primaryColorSD cursor-pointer hover:underline"
                    >
                      {contact_name}
                    </button>
                  </Dropdown>
                  {contact_jobRole ? `, ${contact_jobRole}` : ''}
                </span>
              </div>
              <div className="contact__details mt-[0px]">
                {phone?.value || mail ? (
                  <>
                    <div>
                      {phone?.value ? (
                        <p className="inline-flex text-[14px] text-light__TextColor font-biotif__Regular duration-500 hover:text-primaryColorSD hover:underline">
                          <ClickableMobile number={phone?.value.toString()} />
                        </p>
                      ) : null}
                    </div>
                    <div>
                      {mail ? (
                        <p className="inline-flex text-[14px] text-light__TextColor font-biotif__Regular duration-500 hover:text-primaryColorSD hover:underline">
                          <ClickableEmail
                            mail={mail}
                            modelName={ModuleNames.ACCOUNT}
                            modelRecordId={accountId}
                          />
                        </p>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div>
                  <RedirectToGoogleMap address={{ ...address }} />
                </div>
              </div>
            </div>
          </div>
          <div className="activity__topHeader__footer mt-[24px] pt-[20px] border-t border-whiteScreen__BorderColor w-full flex flex-wrap items-center justify-between">
            <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center">
              <DetailHeaderEmail
                email={mail}
                modelName={ModuleNames.ACCOUNT}
                modelRecordId={accountId}
              />
              <DetailHeaderPhone
                type={phone?.phoneType || ''}
                number={phone?.value}
              />
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.NOTE,
                    type: BasicPermissionTypes.CREATE,
                  },
                ]}
              >
                <DetailHeaderNote setOpenModal={setOpenModal} />
              </AuthGuard>
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.ATTACHMENT,
                    type: BasicPermissionTypes.CREATE,
                  },
                ]}
              >
                <DetailHeaderAttachment
                  setOpenModal={setOpenModal}
                  setIsLinkDocument={setIsLinkDocument}
                />
              </AuthGuard>
              <AuthGuard
                permissions={[
                  { module: ModuleNames.TAG, type: TagPermissions.ACCOUNT },
                ]}
              >
                <DetailHeaderTag setOpenModal={setOpenModal} />
              </AuthGuard>
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.ACTIVITY,
                    type: BasicPermissionTypes.CREATE,
                  },
                ]}
              >
                <DetailHeaderActivity setOpenModal={setOpenModal} />
              </AuthGuard>
              <button className="mr-[20px] mb-[10px] sm:mr-[13px] hidden">
                <Icon
                  className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
                  iconType="toggle3dotsIcon"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountDetailHeader;
