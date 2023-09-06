import { ICellRendererParams } from 'ag-grid-community';
import Dropdown from 'components/Dropdown';
import { ModuleNames } from 'constant/permissions.constant';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ContactDetails } from 'pages/Contact/types/contacts.types';
import EntityCard from 'components/EntityDetails/QuickLookCard/EntityCard';
import { AccountDetails } from 'pages/Account/types/account.types';
import { LeadDetailsType } from 'pages/Lead/types/lead.type';
import { DealDetailsType } from 'pages/Deal/types/deals.types';
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import Icon from 'components/Icon';
import Image from 'components/Image';

interface INameCellRenderer {
  onRowClickNavigateLink: string;
  name: string;
  params: ICellRendererParams;
  modelName:
    | ModuleNames.LEAD
    | ModuleNames.DEAL
    | ModuleNames.CONTACT
    | ModuleNames.ACTIVITY
    | ModuleNames.ACCOUNT;
  handleDealWonLost?: () => void;
  launchActivity?: () => void;
  startOrStopActivity?: {
    label: string;
    action: () => void;
  };
  completeOrOpenActivity?: {
    label: string;
    action: () => void;
  };
}

function NameCellRenderer(props: INameCellRenderer) {
  const {
    onRowClickNavigateLink,
    modelName,
    name,
    params,
    handleDealWonLost,
    launchActivity,
    completeOrOpenActivity,
    startOrStopActivity,
  } = props;
  const [displayInfo, setDisplayInfo] = useState(false);
  const navidate = useNavigate();

  const cardMapper = {
    [ModuleNames.CONTACT]: generateContactCard({
      contact: params.data,
    }),
    [ModuleNames.ACCOUNT]: generateAccountCard({
      account: params.data,
    }),
    [ModuleNames.LEAD]: generateLeadCard({
      lead: params.data,
    }),
    [ModuleNames.DEAL]: generateDealCard({
      deal: params.data,
      handleDealWonLost,
    }),
    [ModuleNames.ACTIVITY]: generateActivityCard({
      activity: params.data,
      launchActivity,
      completeOrOpenActivity,
      startOrStopActivity,
    }),
  };
  return (
    <div className="flex items-center group">
      <span className="value inline-block max-w-full">
        <Link
          to={onRowClickNavigateLink}
          onClick={(e) => {
            e.preventDefault();
            setTimeout(() => {
              navidate(onRowClickNavigateLink);
            }, 200);
          }}
        >
          <div
            className="flex profile__img__name items-center"
            onFocus={() => {
              setDisplayInfo(true);
            }}
            onBlur={() => {
              setDisplayInfo(false);
            }}
          >
            {[ModuleNames.ACCOUNT, ModuleNames.CONTACT].includes(modelName) && (
              <div className="img__wrapper shrink-0">
                <Image
                  imgClassName="w-[34px] h-[34px] object-cover object-center rounded-full"
                  first_name={params?.data?.name || ''}
                  imgPath={
                    params?.data?.account_image || params?.data?.contact_image
                  }
                  serverPath
                  color={params?.data?.initial_color}
                />
              </div>
            )}
            <span className="name pl-[8px] whitespace-pre overflow-hidden text-ellipsis inline-block w-auto max-w-full">
              {name || ''}
            </span>
          </div>
        </Link>
      </span>
      <Dropdown
        className="quickView__accContact__tippy"
        hideOnClick
        content={cardMapper?.[modelName] || <></>}
      >
        <button
          className={`shrink-0 ml-[8px] cursor-pointer relative top-[-1px] opacity-0 pointer-events-none ${
            displayInfo
              ? 'opacity-100 pointer-events-auto'
              : 'group-hover:opacity-100 group-hover:pointer-events-auto'
          } `}
        >
          <Icon iconType="eyeFilled" />
        </button>
      </Dropdown>
    </div>
  );
}

export default NameCellRenderer;

// *** Entity Card Generator *** /

// ** 1. Contact ** //
interface IGenerateContactCard {
  contact: ContactDetails;
}
export const generateContactCard = (props: IGenerateContactCard) => {
  const { contact } = props;
  const contactCard = useCallback(
    (contactCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = contactCardProps;

      const contactPrimaryEmail = (contact?.emails || [])?.filter(
        (a) => a.is_primary
      )?.[0]?.value;
      const contactPrimaryPhone = (contact?.phones || [])?.filter(
        (b) => b.is_primary
      )?.[0];
      const address = {
        address1: contact?.address1 || '',
        address2: contact?.address2 || '',
        state: contact?.state?.state_code || '',
        city: contact?.city || '',
        country: contact?.country?.name || '',
        zip: contact?.zip || '',
      };

      const checkAddressLength = Object.values(address).find(
        (element) => element
      );

      const activityEntityData = {
        id: contact?.id,
        name: contact?.name || '',
        type: ModuleNames.CONTACT,
      };
      const relatedEntityData = {
        ...(contact?.related_accounts?.[0]?.account?.id && {
          account: {
            id: contact?.related_accounts?.[0]?.account?.id,
            name: contact?.related_accounts?.[0]?.account?.name,
          },
        }),
      };

      return (
        <>
          {contact?.name && Boolean(contact?.id) && (
            <EntityCard
              modelName={ModuleNames.CONTACT}
              id={contact?.id}
              name={contact?.name}
              email={contactPrimaryEmail}
              {...(!!checkAddressLength && { address })}
              phone={contactPrimaryPhone?.value?.toString()}
              phoneType={contactPrimaryPhone?.phoneType || ''}
              {...{
                close,
                setIsOpen,
                isOpen,
                activityEntityData,
                relatedEntityData,
              }}
            />
          )}
        </>
      );
    },
    [contact]
  );

  return contactCard;
};

// ** 2. Account ** //
interface IGenerateAccountCard {
  account: AccountDetails;
}
export const generateAccountCard = (props: IGenerateAccountCard) => {
  const { account } = props;
  const accountCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = accountCardProps;

      const accountPrimaryEmail = (account?.emails || [])?.filter(
        (val) => val.isPrimary
      )?.[0]?.value;
      const accountPrimaryPhone = (account?.phones || [])?.filter(
        (val) => val.isPrimary
      )?.[0];

      const address = {
        address1: account?.address1 || '',
        address2: account?.address2 || '',
        state: account?.state?.state_code || '',
        city: account?.city || '',
        country: account?.country?.name || '',
        zip: account?.zip || '',
      };

      const checkAddressLength = Object.values(address).find(
        (element) => element
      );

      const activityEntityData = {
        id: account?.id as number,
        name: account?.name || '',
        type: ModuleNames.ACCOUNT,
      };
      const relatedEntityData = {
        ...(account?.AccountContacts?.[0]?.contact?.id && {
          contact: {
            id: account?.AccountContacts?.[0]?.contact?.id,
            name: account?.AccountContacts?.[0]?.contact?.name || '',
          },
        }),
      };

      return (
        <>
          {account?.name && Boolean(account?.id) && (
            <EntityCard
              modelName={ModuleNames.ACCOUNT}
              {...(!!checkAddressLength && { address })}
              id={account?.id as number}
              name={account?.name}
              email={accountPrimaryEmail}
              phone={accountPrimaryPhone?.value?.toString()}
              phoneType={accountPrimaryPhone?.phoneType || ''}
              {...{
                close,
                setIsOpen,
                isOpen,
                activityEntityData,
                relatedEntityData,
              }}
            />
          )}
        </>
      );
    },
    [account]
  );
  return accountCard;
};

// ** 3.Lead ** //
interface IGenerateLeadCard {
  lead: LeadDetailsType;
}
export const generateLeadCard = (props: IGenerateLeadCard) => {
  const { lead } = props;
  const leadCard = useCallback(
    (leadCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = leadCardProps;

      const activityEntityData = {
        id: lead?.id as number,
        name: lead?.name || '',
        type: ModuleNames.LEAD,
      };
      const relatedEntityData = {
        ...(lead?.related_account?.id && {
          account: {
            id: lead?.related_account?.id,
            name: lead?.related_account?.name || '',
          },
        }),
        ...(lead?.related_contacts?.[0]?.contact?.id && {
          contact: {
            id: lead?.related_contacts[0]?.contact?.id,
            name: lead?.related_contacts[0]?.contact?.name || '',
          },
        }),
      };

      return (
        <>
          {lead?.name && Boolean(lead?.id) && (
            <EntityCard
              modelName={ModuleNames.LEAD}
              id={lead?.id as number}
              name={lead?.name}
              {...{
                close,
                setIsOpen,
                isOpen,
                relatedEntityData,
                activityEntityData,
                hideEmail: true,
                hidePhone: true,
              }}
            />
          )}
        </>
      );
    },
    [lead]
  );
  return leadCard;
};

// ** 4.Deal ** //
interface IGenerateDealCard {
  deal: DealDetailsType;
  handleDealWonLost?: () => void;
}
export const generateDealCard = (props: IGenerateDealCard) => {
  const { deal, handleDealWonLost } = props;
  const dealCard = useCallback(
    (dealCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = dealCardProps;

      const activityEntityData = {
        id: deal?.id as number,
        name: deal?.name || '',
        type: ModuleNames.DEAL,
      };
      const relatedEntityData = {
        ...(deal?.related_account?.id && {
          account: {
            id: deal?.related_account?.id,
            name: deal?.related_account?.name || '',
          },
        }),
        ...(deal?.related_contacts?.[0]?.contact?.id && {
          contact: {
            id: deal?.related_contacts[0]?.contact?.id,
            name: deal?.related_contacts[0]?.contact?.name || '',
          },
        }),
      };

      return (
        <>
          {deal?.name && Boolean(deal?.id) && (
            <EntityCard
              modelName={ModuleNames.DEAL}
              id={deal?.id as number}
              name={deal?.name}
              {...{
                close,
                setIsOpen,
                isOpen,
                handleDealWonLost,
                activityEntityData,
                relatedEntityData,
                hideEmail: true,
                hidePhone: true,
              }}
            />
          )}
        </>
      );
    },
    [deal]
  );
  return dealCard;
};

// ** 5.Activity ** //
interface IGenerateActivityCard {
  activity: ActivityResponseType;
  launchActivity?: () => void;
  startOrStopActivity?: {
    label: string;
    action: () => void;
  };
  completeOrOpenActivity?: {
    label: string;
    action: () => void;
  };
}
export const generateActivityCard = (props: IGenerateActivityCard) => {
  const {
    activity,
    launchActivity,
    completeOrOpenActivity,
    startOrStopActivity,
  } = props;
  const activityCard = useCallback(
    (activityCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = activityCardProps;
      return (
        <>
          {activity?.topic && Boolean(activity?.id) && (
            <EntityCard
              modelName={ModuleNames.ACTIVITY}
              id={activity?.id as number}
              name={activity?.topic}
              {...{
                close,
                setIsOpen,
                isOpen,
                launchActivity,
                hideActivity: true,
                hideEmail: true,
                hidePhone: true,
                completeOrOpenActivity,
                startOrStopActivity,
              }}
            />
          )}
        </>
      );
    },
    [activity]
  );
  return activityCard;
};
