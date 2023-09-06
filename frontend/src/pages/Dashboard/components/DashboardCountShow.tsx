// ** Import Packages **
import { formatISO, sub } from 'date-fns';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ** Components **
import DaysFilterDropdown from 'components/DaysFilterDropdown';
import Icon from 'components/Icon';
import AddActivityModal from 'pages/Activity/components/Modal/AddActivityModal';

import {
  AccountSkeleton,
  ActivitySkeleton,
  ContactsSkeleton,
  DealsSkeleton,
  LeadsSkeleton,
} from '../skeleton/DashBoardCountSkeleton';

// ** Hook **
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Type **
import { SelectedDayRangeType } from 'components/DaysFilterDropdown/types/index.types';
import {
  DashboardCountShowPropsType,
  EmailModalType,
} from '../types/dashboard.types';

// ** Constant **
import {
  DATE_RANGE_DROPDOWN,
  DATE_SLUG,
  IS_CACHING_ACTIVE,
  TAB,
} from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useLazyGetActivitiesCountQuery } from 'redux/api/activityApi';
import { useLazyGetContactsCountQuery } from 'redux/api/contactApi';
import { useLazyGetLeadCountQuery } from 'redux/api/leadApi';
import { useLazyGetAccountsCountsQuery } from 'redux/api/accountApi';
import { POLLING_INTERVAL } from 'constant/dataLimit.constant';

const DashboardCountShow = (props: DashboardCountShowPropsType) => {
  const { setRecentLogsFlag, recentLogsFlag, setPageInfo, refresh } = props;
  const initialDays = formatISO(
    sub(new Date(new Date().toDateString()), { days: 30 })
  );
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // ** States **
  const [count, setCount] = useState<{
    activities: number;
    contacts: number;
    leads: number;
    deals: number;
    accounts: number;
  }>({ activities: 0, contacts: 0, leads: 0, deals: 0, accounts: 0 });
  const [modal, setModal] = useState<EmailModalType>();
  const [isCustomLoading, setIsCustomLoading] = useState<boolean>(false);
  const [selectedDayRangeObj, setSelectedDayRangeObj] =
    useState<SelectedDayRangeType>({
      activities: DATE_SLUG.THIRTY_DAYS,
      contacts: DATE_SLUG.THIRTY_DAYS,
      leads: DATE_SLUG.THIRTY_DAYS,
      deals: DATE_SLUG.THIRTY_DAYS,
      accounts: DATE_SLUG.THIRTY_DAYS,
    });

  // ** APIS **
  const [
    getActivitiesCountAPI,
    { isLoading: activitiesLoading, currentData: activitiesCount },
  ] = useLazyGetActivitiesCountQuery({
    pollingInterval: pathname === '/' ? POLLING_INTERVAL : 0,
  });
  const [
    getContactsCountAPI,
    { isLoading: contactLoading, currentData: contactCount },
  ] = useLazyGetContactsCountQuery({
    pollingInterval: pathname === '/' ? POLLING_INTERVAL : 0,
  });
  const [getLeadsCountAPI, { isLoading: dealLoading, currentData: dealCount }] =
    useLazyGetLeadCountQuery({
      pollingInterval: pathname === '/' ? POLLING_INTERVAL : 0,
    });
  const [getDealsCountAPI, { isLoading: leadLoading, currentData: leadCount }] =
    useLazyGetLeadCountQuery({
      pollingInterval: pathname === '/' ? POLLING_INTERVAL : 0,
    });
  const [
    getAccountsCountAPI,
    { isLoading: accountLoading, currentData: accountsCount },
  ] = useLazyGetAccountsCountsQuery({
    pollingInterval: pathname === '/' ? POLLING_INTERVAL : 0,
  });
  // ** custom hooks **
  const {
    createLeadPermission,
    createDealPermission,
    createContactPermission,
    createActivityPermission,
    createAccountPermission,
  } = usePermission();
  const { isMobileView } = useWindowDimensions();

  useEffect(() => {
    setIsCustomLoading(true);
    getDashboardCountData();
  }, []);
  useEffect(() => {
    getActivityCount();
  }, [refresh]);
  const getDashboardCountData = async () => {
    const { data: Contact } = await getContactsCountAPI(
      {
        params: { 'q[created_at][gte]': initialDays },
      },
      true
    );

    const { data: Deals } = await getLeadsCountAPI(
      {
        params: {
          'q[created_at][gte]': initialDays,
          'q[is_deal]': true,
        },
      },
      true
    );
    const { data: Leads } = await getDealsCountAPI(
      {
        params: {
          'q[created_at][gte]': initialDays,
          'q[is_deal]': false,
        },
      },
      IS_CACHING_ACTIVE
    );
    const { data: Accounts } = await getAccountsCountAPI(
      {
        params: { 'q[created_at][gte]': initialDays },
      },
      true
    );
    const { data: Activities } = await getActivitiesCountAPI(
      {
        params: { 'q[created_at][gte]': initialDays },
      },
      true
    );
    setCount({
      leads: Leads?.count,
      deals: Deals?.count,
      accounts: Accounts?.count,
      activities: Activities?.count,
      contacts: Contact?.count,
    });
    setIsCustomLoading(false);
  };

  const getActivityCount = async () => {
    const { data: Activities } = await getActivitiesCountAPI(
      {
        params: { 'q[created_at][gte]': initialDays },
      },
      true
    );
    setCount({ ...count, activities: Activities?.count });
  };

  const openModal = (value: EmailModalType) => setModal(value);
  const closeModal = () => {
    setModal(undefined);
  };

  const handleCounts = async (
    name: string,
    selectedDate: string | undefined
  ) => {
    if (name === TAB.ACCOUNTS) {
      const { data: accountCount, error: accountCountError } =
        await getAccountsCountAPI({
          params: { 'q[created_at][gte]': selectedDate },
        });
      if (accountsCount && !accountCountError) {
        setCount({ ...count, accounts: accountCount.count });
      }
    } else if (name === TAB.CONTACTS) {
      const { data: contactsCount, error: contactsCountError } =
        await getContactsCountAPI({
          params: { 'q[created_at][gte]': selectedDate },
        });
      if (contactCount && !contactsCountError) {
        setCount({ ...count, contacts: contactsCount.count });
      }
    } else if (name === TAB.LEAD) {
      const { data: leadsCount, error: leadError } = await getLeadsCountAPI(
        {
          params: { 'q[created_at][gte]': selectedDate, 'q[is_deal]': false },
        },
        true
      );
      if (leadCount && !leadError) {
        setCount({ ...count, leads: leadsCount.count });
      }
    } else if (name === TAB.DEALS) {
      const { data: dealsCount, error: dealsCountError } =
        await getLeadsCountAPI(
          {
            params: { 'q[created_at][gte]': selectedDate, 'q[is_deal]': true },
          },
          true
        );

      if (dealCount && !dealsCountError) {
        setCount({ ...count, deals: dealsCount.count });
      }
    } else if (name === TAB.ACTIVITIES) {
      const { data: activityCount, error: activityCountError } =
        await getActivitiesCountAPI({
          params: { 'q[created_at][gte]': selectedDate },
        });

      if (activitiesCount && !activityCountError) {
        setCount({ ...count, activities: activityCount.count });
      }
    }
  };

  return (
    <>
      <div className="w-auto ml-[-10px] mr-[-10px] flex flex-wrap">
        {isCustomLoading || contactLoading ? (
          <ContactsSkeleton />
        ) : (
          <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
            <div className="ip__Counter__Box ip__Counter__Box__Blue">
              <div className="ip__Counter__Header">
                <h6 className="ip__Counter__Title !text-primaryColor">
                  Contacts
                </h6>
                <button
                  onClick={() => {
                    navigate(`/${PRIVATE_NAVIGATION.contacts.add}`);
                  }}
                  disabled={!createContactPermission}
                  className="ip__Counter__PlusBtn tooltip__Target duration-300 !bg-primaryColor"
                >
                  <Icon iconType="plusFilled" />
                </button>
              </div>
              <h3 className="ip__Counter__Number !text-primaryColor">
                {count.contacts}
              </h3>
              <DaysFilterDropdown
                isDisabled={!createContactPermission}
                selectedDayRangeObj={selectedDayRangeObj}
                handleCounts={handleCounts}
                modal={TAB.CONTACTS}
                setSelectedDayRangeObj={setSelectedDayRangeObj}
              />
            </div>
          </div>
        )}
        {isCustomLoading || dealLoading ? (
          <DealsSkeleton />
        ) : (
          <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
            <div className="ip__Counter__Box ip__Counter__Box__Orange">
              <div className="ip__Counter__Header">
                <h6 className="ip__Counter__Title !text-ip__Orange">Deals</h6>
                <button
                  onClick={() => {
                    navigate(`/${PRIVATE_NAVIGATION.deals.add}`);
                  }}
                  disabled={!createDealPermission}
                  className="ip__Counter__PlusBtn duration-300 !bg-ip__Orange"
                >
                  <Icon iconType="plusFilled" />
                </button>
              </div>
              <h3 className="ip__Counter__Number !text-ip__Orange">
                {count.deals}
              </h3>
              <DaysFilterDropdown
                isDisabled={!createDealPermission}
                selectedDayRangeObj={selectedDayRangeObj}
                handleCounts={handleCounts}
                modal={TAB.DEALS}
                setSelectedDayRangeObj={setSelectedDayRangeObj}
              />
            </div>
          </div>
        )}
        {isCustomLoading || leadLoading ? (
          <LeadsSkeleton />
        ) : (
          <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
            <div className="ip__Counter__Box ip__Counter__Box__Green">
              <div className="ip__Counter__Header">
                <h6 className="ip__Counter__Title !text-ip__Green">Leads</h6>
                <button
                  onClick={() => {
                    navigate(`/${PRIVATE_NAVIGATION.leads.add}`);
                  }}
                  disabled={!createLeadPermission}
                  className="ip__Counter__PlusBtn duration-300 !bg-ip__Green"
                >
                  <Icon iconType="plusFilled" />
                </button>
              </div>
              <h3 className="ip__Counter__Number !text-ip__Green">
                {count.leads}
              </h3>
              <DaysFilterDropdown
                isDisabled={!createLeadPermission}
                selectedDayRangeObj={selectedDayRangeObj}
                handleCounts={handleCounts}
                modal={TAB.LEAD}
                setSelectedDayRangeObj={setSelectedDayRangeObj}
              />
            </div>
          </div>
        )}
        {isCustomLoading || accountLoading ? (
          <AccountSkeleton />
        ) : (
          <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
            <div className="ip__Counter__Box ip__Counter__Box__Blue">
              <div className="ip__Counter__Header">
                <h6 className="ip__Counter__Title !text-primaryColor">
                  Accounts
                </h6>
                <button
                  onClick={() => {
                    navigate(`/${PRIVATE_NAVIGATION.accounts.add}`);
                  }}
                  disabled={!createAccountPermission}
                  className="ip__Counter__PlusBtn duration-300 !bg-ip__Blue hover:!bg-ip__Blue__hoverDark"
                >
                  <Icon iconType="plusFilled" />
                </button>
              </div>
              <h3 className="ip__Counter__Number !text-primaryColor">
                {count.accounts}
              </h3>
              <DaysFilterDropdown
                isDisabled={!createAccountPermission}
                selectedDayRangeObj={selectedDayRangeObj}
                handleCounts={handleCounts}
                modal={TAB.ACCOUNTS}
                setSelectedDayRangeObj={setSelectedDayRangeObj}
              />
            </div>
          </div>
        )}
        {isCustomLoading || activitiesLoading ? (
          <ActivitySkeleton />
        ) : (
          <div className="w-1/5 px-[10px] mb-[20px] 3xl:w-1/3 xl:w-1/3 lg:w-1/2 sm:w-full">
            <div className="ip__Counter__Box ip__Counter__Box__Orange">
              <div className="ip__Counter__Header">
                <h6 className="ip__Counter__Title !text-ip__Orange">
                  Activities
                </h6>
                <button
                  onClick={() => {
                    if (isMobileView) {
                      navigate(
                        PRIVATE_NAVIGATION.activities.AddActivityMobileView
                      );
                    } else {
                      openModal('activity');
                    }
                  }}
                  disabled={!createActivityPermission}
                  className="ip__Counter__PlusBtn duration-300 !bg-ip__Orange"
                >
                  <Icon iconType="plusFilled" />
                </button>
              </div>
              <h3 className="ip__Counter__Number !text-ip__Orange">
                {count?.activities}
              </h3>
              <DaysFilterDropdown
                isDisabled={!createActivityPermission}
                selectedDayRangeObj={selectedDayRangeObj}
                handleCounts={handleCounts}
                modal={TAB.ACTIVITIES}
                setSelectedDayRangeObj={setSelectedDayRangeObj}
              />
            </div>
          </div>
        )}
      </div>

      {/* add activity modal */}
      {modal === 'activity' && (
        <AddActivityModal
          isQuickModal
          isOpen={modal === 'activity'}
          closeModal={closeModal}
          onAdd={async () => {
            await handleCounts(
              TAB.ACTIVITIES,
              DATE_RANGE_DROPDOWN.find(
                (obj) => obj.slug === DATE_SLUG.THIRTY_DAYS
              )?.value
            );
            setPageInfo({
              hasMore: true,
              page: 1,
            });
            setRecentLogsFlag(!recentLogsFlag);
          }}
        />
      )}
    </>
  );
};

export default DashboardCountShow;
