// ** Import Packages **
import Tippy from '@tippyjs/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ** Components **
import RedirectToGoogleMap from 'components/Address/components/RedirectToGoogleMap';
import { TableActionButton } from 'components/Button/TableActionButton';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import Dropdown from 'components/Dropdown';
import EntityCard from 'components/EntityDetails/QuickLookCard/EntityCard';
import StayInTouch from 'components/EntityDetails/StayInTouch';
import Icon from 'components/Icon';
import Image from 'components/Image';
import { DetailHeaderEmail } from 'components/detail-components/detail-header-email';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Constants **
import { ModalType } from 'components/EntityDetails/constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';

// ** Types **
import { AccountMobileHeaderPropsType } from 'pages/Account/types/account.types';

// ** Helper **
import DetailHeaderPhone from 'components/detail-components/detail-header-phone';

const AccountMobileHeader = (props: AccountMobileHeaderPropsType) => {
  const {
    accountData,
    onEditClick,
    accountId,
    assignedTags,
    deleteAssignedTag,
    setIsLinkDocument,
    setOpenModal,
    editTagsPermission,
    getScheduleActivity,
    isScheduleActivityLoading,
    isStayInTouchOpen,
    scheduleActivityData,
    setIsStayInTouchOpen,
    contact_jobRole,
    contact_name,
    mail,
    phone,
    address,
  } = props;
  const navigate = useNavigate();
  const {
    updateAccountPermission,
    createNotePermission,
    createDocumentPermission,
    createActivityPermission,
    tagForAccountPermission,
  } = usePermission();
  const redirectToAddActivity = () => {
    const entityData = {
      id: accountData?.account?.id,
      name: accountData?.account?.name || '',
      type: ModuleNames.ACCOUNT,
    };
    const relatedEntityData = {
      ...(accountData?.account?.AccountContacts?.[0]?.contact_id && {
        contact: {
          id: accountData?.account?.AccountContacts?.[0]?.contact_id,
          name: accountData?.account?.AccountContacts?.[0]?.contact?.name || '',
        },
      }),
    };
    navigate(PRIVATE_NAVIGATION.activities.AddActivityMobileView, {
      state: {
        entityData,
        relatedEntityData,
      },
    });
  };

  const primaryContact = accountData?.account?.AccountContacts?.find(
    (val) => val.is_primary
  )?.contact;

  const contactCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = accountCardProps;
      const contactPrimaryEmail = (primaryContact?.emails || [])?.filter(
        (val) => val.is_primary
      )?.[0]?.value;
      const accountPrimaryPhone = (primaryContact?.phones || [])?.filter(
        (val) => val.is_primary
      )?.[0];
      const addressObj = {
        address1: primaryContact?.address1 || '',
        address2: primaryContact?.address2 || '',
        state: primaryContact?.state?.state_code || '',
        city: primaryContact?.city || '',
        country: primaryContact?.country?.name || '',
        zip: primaryContact?.zip || '',
      };

      const checkAddressLength = Object.values(addressObj).find(
        (element) => element
      );

      return (
        <>
          {primaryContact?.name && Boolean(primaryContact?.id) && (
            <EntityCard
              modelName={ModuleNames.CONTACT}
              {...(!!checkAddressLength && { address: addressObj })}
              id={primaryContact?.id}
              name={primaryContact?.name}
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

  return (
    <>
      <div className="details__page__topHeader__M contact__details__page__topHeader__M border-b border-b-[#CCCCCC]/50 pb-[12px] mb-[17px] hidden sm:block">
        <div className="flex justify-between items-center mb-[20px]">
          <div className="details__mobile__act__type flex flex-wrap items-center w-[calc(100%_-_70px)] pr-[10px]">
            {accountData?.account?.account_image ? (
              <Image
                imgClassName="rounded-[8px] w-[43px] h-[43px] !p-[7px] object-cover object-center"
                imgPath={accountData?.account?.account_image || ''}
                serverPath
              />
            ) : (
              <Icon
                className="bg-primaryColor rounded-[8px] w-[43px] h-[43px] !p-[7px]"
                iconType="phoneFilled"
              />
            )}
            <p className="text-[16px] font-biotif__Medium text-[#2E3234] w-[calc(100%_-_45px)] pl-[7px] whitespace-pre overflow-hidden text-ellipsis">
              Account
            </p>
          </div>
          <AuthGuard isAccessible={updateAccountPermission}>
            <div className="action__btns__mobile inline-flex items-center">
              <button
                onClick={() => onEditClick(accountId || 0)}
                type="button"
                className="editACT__btn__M"
              >
                <Icon
                  className="!w-[32px] !h-[32px] p-[4px] rounded-[6px] bg-[#E6E6E6] duration-500 hover:bg-primaryColor"
                  iconType="editPencilFilledIcon"
                />
              </button>
              <button className="details__page__toggleBtn__M ml-[5px]">
                <Icon
                  className="!w-[32px] !h-[32px] p-[8px] rounded-[6px] duration-500 hover:bg-[#E6E6E6]"
                  iconType="toggle3dotsIcon"
                />
              </button>
            </div>
          </AuthGuard>
        </div>

        <div className="flex flex-wrap">
          {accountData?.account?.name ? (
            <h3 className="text-[#2E3234] text-[18px] font-biotif__Medium mr-[10px] mb-[3px]">
              {accountData?.account?.name}
            </h3>
          ) : (
            <></>
          )}
          {assignedTags.list.length > 0 ? (
            <div className="badge__wrapper mb-[12px] text-primaryColor">
              {assignedTags.list.map((item) => {
                return (
                  <span
                    key={item.tag.id}
                    style={{ backgroundColor: item.tag.color }}
                    className="badge square__round primary__badge mr-[8px] mb-[5px] py-[3px] px-[8px]"
                  >
                    {item.tag.name}
                    <button
                      disabled={!editTagsPermission}
                      onClick={() => deleteAssignedTag(item.tag.id)}
                      className="close__btn w-[10px] h-[10px] ml-[6px] relative top-0"
                    >
                      .
                    </button>
                  </span>
                );
              })}
            </div>
          ) : (
            <></>
          )}
        </div>
        {contact_name || contact_jobRole ? (
          <h5 className="text-[#2E3234] text-[16px] leading-[18px] font-biotif__Regular mb-[5px]">
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
          </h5>
        ) : (
          <></>
        )}

        <div className="contact__details mt-[0px]">
          {mail || phone?.value ? (
            <>
              {' '}
              {phone?.value && (
                <div className="leading-normal">
                  <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                    <ClickableMobile number={phone.value?.toString() || ''} />
                  </p>
                </div>
              )}
              {mail && (
                <div className="leading-normal">
                  <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                    <ClickableEmail mail={mail} />
                  </p>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
          <div>
            <RedirectToGoogleMap address={{ ...address }} />
          </div>
        </div>
        <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center mt-[14px]">
          <DetailHeaderEmail email={mail} />
          <DetailHeaderPhone
            type={phone?.phoneType || ''}
            number={phone?.value?.toString()}
          />
          <AuthGuard isAccessible={createNotePermission}>
            <Tippy zIndex={5} content="Notes">
              <button
                className="inline-block mr-[20px] mb-[10px] sm:mr-[13px]"
                onClick={() => setOpenModal(ModalType.NOTE)}
              >
                <Icon
                  className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
                  iconType="mobileMenuFilled"
                />
              </button>
            </Tippy>
          </AuthGuard>
          <AuthGuard isAccessible={createDocumentPermission}>
            <TableActionButton
              filedArray={[
                {
                  label: 'Link',
                  onClick: () => {
                    setOpenModal(ModalType.ATTACHMENT);
                    setIsLinkDocument(true);
                  },
                },
                {
                  label: 'File',
                  onClick: () => {
                    setOpenModal(ModalType.ATTACHMENT);
                    setIsLinkDocument(false);
                  },
                },
              ]}
              buttonChild={
                <Icon
                  className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
                  iconType="attachmentFilledIcon"
                />
              }
              buttonClassName="inline-block mr-[20px] mb-[10px] sm:mr-[13px]"
              tippyMessage="Documents"
            />
          </AuthGuard>
          <AuthGuard isAccessible={tagForAccountPermission}>
            <Tippy zIndex={5} content="Tags">
              <button
                className="inline-block mr-[20px] mb-[10px] sm:mr-[13px]"
                onClick={() => setOpenModal(ModalType.TAG)}
              >
                <Icon
                  className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
                  iconType="offerTagsFilledIcon"
                />
              </button>
            </Tippy>
          </AuthGuard>
          <AuthGuard isAccessible={createActivityPermission}>
            <Tippy zIndex={5} content="Activity">
              <button
                className="inline-block mr-[20px] mb-[10px] sm:mr-[13px]"
                onClick={() => redirectToAddActivity()}
              >
                <Icon
                  className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
                  iconType="activitiesFilledBlackIcon"
                />
              </button>
            </Tippy>
          </AuthGuard>
          <button className="inline-block mr-[8px] mb-[8px]">
            <Icon
              className="i__Icon highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
              iconType="offerTagsFilledIcon"
            />
          </button>
        </div>
      </div>
      <AuthGuard isAccessible={updateAccountPermission}>
        <div className="details__page__sticky__btns py-[15px] px-[22px] rounded-t-[20px] shadow-[0px_4px_21px_5px_#00000014] fixed bottom-0 left-0 w-full bg-white z-[4] justify-end items-center hidden sm:flex xsm:px-[15px]">
          <button className='i__Button mr-[10px] bg-[#E6E6E6] py-[4px] px-[17px] pr-[37px] text-black text-[14px] font-biotif__Medium rounded-[6px] h-[32px] relative before:content-[""] before:w-[8px] before:h-[8px] before:border-[2px] before:border-black before:absolute before:top-[10px] before:right-[12px] before:rotate-45 before:!border-t-0 before:!border-l-0 after:content-[""] after:absolute after:top-[9px] after:right-[28px] after:w-[1px] after:h-[14px] after:bg-black hover:text-white hover:before:border-white hover:after:bg-white'>
            Follow
          </button>
          <StayInTouch
            model_record_id={accountId || 0}
            model_name={POLYMORPHIC_MODELS.DEAL}
            isStayInTouchOpen={isStayInTouchOpen}
            setIsStayInTouchOpen={setIsStayInTouchOpen}
            scheduleActivityData={scheduleActivityData}
            isScheduleActivityLoading={isScheduleActivityLoading}
            getScheduleActivity={getScheduleActivity}
          />
        </div>
      </AuthGuard>
    </>
  );
};

export default AccountMobileHeader;
