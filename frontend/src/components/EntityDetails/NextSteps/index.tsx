// ** Import Packages **
import { format } from 'date-fns-tz';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Redux **
import {
  setLoadModuleActivityTimelines,
  setLoadTimeLines,
} from 'redux/slices/commonSlice';

// ** Components **
import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';
import EditActivityModal from 'pages/Activity/components/Modal/EditActivityModal';
import AuthGuard from 'pages/auth/components/AuthGuard';
import EntityCard from '../QuickLookCard/EntityCard';
import LeadDealCard from '../QuickLookCard/LeadDealCard';
import { NextStepsAction } from './NextStepsAction';

// ** Hooks & services **
import useWindowDimensions from 'hooks/useWindowDimensions';
import useGetActivity from 'pages/Activity/hooks/useGetActivity';

// ** Constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';
import { ModalType } from '../constant';

// ** Types **
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import { DealDetailsType } from 'pages/Deal/types/deals.types';
import { LeadDetailsType } from 'pages/Lead/types/lead.type';
import {
  EntityModalState,
  NextStepProps,
  SetNavigationProps,
  SetterProps,
} from '../types/index';

// ** Icon **
import Watch from 'assets/custom-svg-icons/Watch';

// ** Util **
import { setUrlParams } from 'utils/util';

// ** Helper **
import { setContactAndMailFunc } from 'pages/Lead/helper/leads.helper';
import Tippy from '@tippyjs/react';

const setNavigation = (props: SetNavigationProps) => {
  const { url, id, navigate } = props;
  if (navigate && id) {
    navigate(setUrlParams(url, id));
  }
};

const setActivityIconAndTitle = (props: SetterProps) => {
  const { step } = props;
  return (
    <>
      {step?.activity_type?.icon_type === 'Default' &&
      step.activity_type?.icon ? (
        <Icon
          iIconStyle={{ backgroundColor: step?.activity_type?.color }}
          style={{ backgroundColor: step?.activity_type?.color }}
          className="w-[32px] h-[32px] p-[5px] rounded-[6px] sm:w-[22px] sm:h-[22px] sm:p-[3px]"
          iconType={step.activity_type.icon}
        />
      ) : (
        <img
          src={step?.activity_type?.icon}
          className="w-[32px] h-[32px] rounded-[6px] sm:w-[22px] sm:h-[22px]"
          alt="icon_type"
        />
      )}
      {step?.activity_type?.name && step?.activity_type?.name?.length > 7 ? (
        <>
          <Tippy zIndex={5} content={step?.activity_type?.name}>
            <h3 className="text-[16px] font-biotif__Medium text-[#2E3234] text-center mt-[10px] w-full whitespace-pre overflow-hidden text-ellipsis sm:text-[12px]">
              {step?.activity_type?.name}
            </h3>
          </Tippy>
        </>
      ) : (
        <>
          <h3 className="text-[16px] font-biotif__Medium text-[#2E3234] text-center mt-[10px] w-full whitespace-pre overflow-hidden text-ellipsis sm:text-[12px]">
            {step?.activity_type?.name}
          </h3>
        </>
      )}
    </>
  );
};

const setTopicAndContactName = (props: SetterProps) => {
  const { step, navigate } = props;
  const accountPrimaryEmail = (step?.activity_contact?.emails || [])?.filter(
    (val) => val.is_primary
  )?.[0]?.value;
  const accountPrimaryPhone = (step?.activity_contact?.phones || [])?.filter(
    (val) => val.is_primary
  )?.[0];

  const address = {
    address1: step?.activity_contact?.address1 || '',
    address2: step?.activity_contact?.address2 || '',
    state: step?.activity_contact?.state?.state_code || '',
    city: step?.activity_contact?.city || '',
    country: step?.activity_contact?.country?.name || '',
    zip: step?.activity_contact?.zip || '',
  };

  const checkAddressLength = Object.values(address).find((element) => element);
  return (
    <>
      <h3 className="name text-[16px] font-biotif__Medium text-[#2E3234] mb-[4px] whitespace-pre overflow-hidden text-ellipsis sm:text-[14px]">
        <span
          onClick={() =>
            setNavigation({
              url: PRIVATE_NAVIGATION.activities.detailPage,
              id: step?.id,
              navigate,
            })
          }
          className="cursor-pointer"
        >
          {step?.topic}
        </span>
      </h3>
      <Dropdown
        className="quickView__accContact__tippy"
        zIndex={10}
        hideOnClick
        content={({ close, setIsOpen, isOpen }) => (
          <>
            {step?.activity_contact?.id && step?.activity_contact?.name && (
              <EntityCard
                modelName={ModuleNames.CONTACT}
                id={step?.activity_contact?.id}
                name={step?.activity_contact?.name}
                email={accountPrimaryEmail}
                phone={accountPrimaryPhone?.value?.toString()}
                phoneType={accountPrimaryPhone?.phoneType || ''}
                {...(!!checkAddressLength && { address })}
                {...{ close, setIsOpen, isOpen }}
              />
            )}
          </>
        )}
      >
        <div>
          <h4 className="sub__name text-[14px] font-biotif__Medium text-[#2E3234] mb-[2px] whitespace-pre overflow-hidden text-ellipsis sm:text-[12px]">
            <span className="cursor-pointer">
              {step?.activity_contact?.name}
            </span>
          </h4>
        </div>
      </Dropdown>
    </>
  );
};

const setLeadDealName = (props: SetterProps) => {
  const { step } = props;

  const contactMail = setContactAndMailFunc({
    leadData: step?.activity_lead as unknown as
      | LeadDetailsType
      | DealDetailsType,
    isActivityContactMail: true,
  });

  return (
    <>
      {step?.activity_lead?.id && step?.activity_lead?.name && (
        <Dropdown
          className="quickView__accContact__tippy"
          zIndex={10}
          hideOnClick
          content={({ close, setIsOpen, isOpen }) => (
            <LeadDealCard
              id={step?.activity_lead?.id}
              name={step?.activity_lead?.name}
              closing_date={step?.activity_lead?.closing_date}
              is_deal={step?.activity_lead?.is_deal}
              owner={{
                first_name: step?.activity_lead?.lead_owner?.first_name,
                last_name: step?.activity_lead?.lead_owner?.last_name,
              }}
              pipeline={step?.activity_lead?.pipeline?.name}
              stage={step.activity_lead?.deal_stage_history?.[0]?.stage?.name}
              source={step?.activity_lead?.lead_source?.name}
              value={step?.activity_lead?.deal_value}
              contactMail={contactMail}
              {...{ close, setIsOpen, isOpen }}
            />
          )}
        >
          <div className="tags__item inline-block max-w-[calc(50%_-_4px)] whitespace-pre overflow-hidden text-ellipsis text-[14px] text-[#2E3234] font-biotif__Regular relative pr-[5px] mr-[6px] mb-0 before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_5px)] before:w-[1px] before:bg-[#949494]/70 sm:text-[12px]">
            <span className="cursor-pointer">{step?.activity_lead?.name}</span>
          </div>
        </Dropdown>
      )}
    </>
  );
};

const setContactTypeAndAccount = (props: SetterProps) => {
  const { step } = props;
  const contactType = step?.activity_contact?.job_role;
  const accountPrimaryEmail = (step?.activity_account?.emails || [])?.filter(
    (val) => val?.isPrimary
  )?.[0]?.value;
  const accountPrimaryPhone = (step?.activity_account?.phones || [])?.filter(
    (val) => val.isPrimary
  )?.[0];

  const address = {
    address1: step?.activity_account?.address1 || '',
    address2: step?.activity_account?.address2 || '',
    state: step?.activity_account?.state?.state_code || '',
    city: step?.activity_account?.city || '',
    country: step?.activity_account?.country?.name || '',
    zip: step?.activity_account?.zip || '',
  };

  const checkAddressLength = Object.values(address).find((element) => element);

  return (
    <div className="tags__item inline-block max-w-[calc(50%_-_4px)] whitespace-pre overflow-hidden text-ellipsis text-[14px] text-[#2E3234] font-biotif__Regular relative pr-[5px] mr-[6px] mb-0 before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_5px)] before:w-[1px] before:bg-[#949494]/70 sm:text-[12px]">
      {contactType}
      {contactType && step.activity_account?.name ? ', ' : ''}
      <Dropdown
        className="quickView__accContact__tippy"
        zIndex={10}
        hideOnClick
        content={({ close, setIsOpen, isOpen }) => (
          <>
            {step?.activity_account?.name &&
              Boolean(step?.activity_account?.id) && (
                <EntityCard
                  modelName={ModuleNames.ACCOUNT}
                  id={step?.activity_account?.id}
                  name={step?.activity_account?.name}
                  email={accountPrimaryEmail}
                  phone={accountPrimaryPhone?.value?.toString()}
                  phoneType={accountPrimaryPhone?.phoneType || ''}
                  {...(!!checkAddressLength && { address })}
                  {...{ close, setIsOpen, isOpen }}
                />
              )}
          </>
        )}
      >
        <span className="cursor-pointer">{step?.activity_account?.name}</span>
      </Dropdown>
    </div>
  );
};

const setActivityTime = (props: SetterProps) => {
  const { step } = props;
  if (step?.start_date) {
    return (
      <>
        <Icon className="hidden" iconType="watchFilled" />
        <div className="i__Icon">
          <div>
            <Watch fill={step?.activity_type?.color} />
          </div>
        </div>
        <span
          style={{ color: step?.activity_type?.color }}
          className="text inline-block w-[calc(100%_-_16px)] pl-[4px] text-[12px] font-biotif__Medium sm:text-[10px]"
        >
          {format(new Date(step?.start_date), 'hh:mm aa, MMM dd, yyyy')}
        </span>
      </>
    );
  }
};

const NextSteps = (props: NextStepProps) => {
  const { id, moduleName } = props;

  // ** Hooks ** //
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ** states **
  const [activities, setActivities] = useState<ActivityResponseType[]>([]);
  const [modal, setModal] = useState<EntityModalState>({
    [ModalType.ACTIVITY]: { open: false },
  });

  // ** API Services ** //
  const { fetchActivityData, isActivityLoading } = useGetActivity();
  const { isMobileView } = useWindowDimensions();

  useEffect(() => {
    getUpcomingActivityData();
  }, []);

  const getUpcomingActivityData = async () => {
    const data = await fetchActivityData({
      limit: 5,
      sort: 'start_date',
      'q[start_date][gte]': new Date().toISOString(),
      ...(id &&
        moduleName === ModuleNames.CONTACT && {
          'q[activity_contact_id]': `n|${id}`,
        }),
      ...(id &&
        (moduleName === ModuleNames.LEAD ||
          moduleName === ModuleNames.DEAL) && {
          'q[activity_lead_id]': `n|${id}`,
        }),
      ...(id &&
        moduleName === ModuleNames.ACCOUNT && {
          'q[activity_account_id]': `n|${id}`,
        }),
    });
    if (_.isArray(data)) {
      setActivities(data);
    }
  };

  const closeModal = (EmailModalType: ModalType) => {
    setModal((pre) => ({ ...pre, [EmailModalType]: { open: false } }));
  };

  const editActivityFlow = (step: ActivityResponseType) => {
    if (isMobileView) {
      navigate(
        setUrlParams(
          PRIVATE_NAVIGATION.activities.EditActivityMobileView,
          step?.id
        )
      );
    } else {
      setModal({
        [ModalType.ACTIVITY]: {
          open: true,
          id: step.id,
        },
      });
    }
  };

  return (
    <>
      {activities.length ? (
        <div className="ip__nextStep flex flex-wrap mb-[20px] w-[calc(100%_+_30px)] 3xl:w-[calc(100%_+_26px)]">
          {(!!activities.length || isActivityLoading) && (
            <div className="left pr-[15px] mr-[15px] flex items-center relative before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[50%] before:w-[1px] before:bg-[#CCCCCC]/50 3xl:w-full 3xl:pr-0 3xl:mr-0 3xl:before:hidden">
              <h3 className="font-biotif__SemiBold text-[20px] text-ip__black__text__color sm:text-[16px]">
                Next Steps
              </h3>
            </div>
          )}
          {isActivityLoading ? (
            <h1>Loading</h1>
          ) : (
            <div className="right w-[calc(100%_-_134px)] pt-[10px] overflow-x-auto ip__hideScrollbar 3xl:w-full">
              <div className="inline-flex whitespace-pre">
                {React.Children.toArray(
                  activities.map((step) => {
                    return (
                      <div
                        key={step?.activity_type_id}
                        className="ip__nextStep__box inline-block w-[380px] mb-[10px] mr-[10px] last:mr-[27px] sm:w-[284px] xsm:w-[270px]"
                      >
                        <div className="inner__wrapper flex flex-wrap relative">
                          <span
                            className="bg__color__wrapper"
                            style={{
                              backgroundColor: step?.activity_type?.color,
                            }}
                          />

                          <NextStepsAction
                            iIconColor={step?.activity_type?.color}
                            filedArray={[
                              {
                                label: 'Edit',
                                onClick: () => {
                                  editActivityFlow(step);
                                },
                              },
                            ]}
                          />

                          <div className="ip__nextStep__actype flex flex-wrap content-center justify-center w-[70px] pr-[10px] relative z-[2] before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-full before:bg-[#CCCCCC]/50 sm:w-[50px]">
                            {setActivityIconAndTitle({ step, navigate })}
                          </div>
                          <div className="right__details w-[calc(100%_-_70px)] pl-[10px] pr-[24px] relative z-[2] sm:w-[calc(100%_-_50px)]">
                            {setTopicAndContactName({ step, navigate })}
                            <div className="tags flex flex-wrap items-center mb-[4px]">
                              {setContactTypeAndAccount({ step, navigate })}
                              {setLeadDealName({ step, navigate })}
                            </div>
                            <div className="time flex flex-wrap items-start mt-[4px]">
                              {setActivityTime({ step })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {modal.ACTIVITY?.id && (
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.ACTIVITY,
              type: BasicPermissionTypes.CREATE,
            },
          ]}
        >
          <EditActivityModal
            onEdit={() => {
              getUpcomingActivityData();

              dispatch(
                setLoadTimeLines({
                  timeline: true,
                })
              );
              dispatch(
                setLoadModuleActivityTimelines({
                  moduleActivityTimeline: true,
                })
              );
            }}
            isOpen={modal.ACTIVITY.open}
            closeModal={() => closeModal(ModalType.ACTIVITY)}
            id={modal.ACTIVITY.id}
          />
        </AuthGuard>
      )}
    </>
  );
};

export default NextSteps;
