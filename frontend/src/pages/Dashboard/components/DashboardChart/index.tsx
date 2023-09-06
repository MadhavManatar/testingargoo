// ** Import Packages **
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ** Components **
import DashboardChartsSkeleton from 'components/skeletons/DashboardChartsSkeleton';
import AddEmailComposerModal from 'pages/Email/components/emailComposer/AddEmailComposerModal';
import ActivityStatusChart from './ActivityStatusChart';
import CompanyGoalsChart from './CompanyGoalsChart';
import DealRevenueByMonthGoalsChart from './DealsPipelineChart';
import RecentMail from './RecentMail';

// ** Custom Hooks **
import usePermission from 'hooks/usePermission';
import {
  useActivityStatusChartDataGet,
  useCompanyGoalsPipelineGraphData,
} from 'pages/Dashboard/hooks/useDashboardGraphHook';
import { useGetEmailUndoDelayTime } from 'pages/Email/hooks/useEmailHelper';
import { useGetEmails } from 'pages/Email/hooks/useEmailService';

// ** Type **
import { CustomLabel, EmailModalType } from 'pages/Email/types/email.type';
import {
  MailTokenProvider,
  TokenProvider,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { useSelector } from 'react-redux';
import { getMailProviderOption } from 'redux/slices/commonSlice';

const DashboardCharts = () => {
  const mailProviders = useSelector(getMailProviderOption);

  // ** States **
  const [modal, setModal] = useState<EmailModalType>();
  const modalRef = useRef<EmailModalType>();
  modalRef.current = modal;
  const [emailUndoHelperObj, setEmailUndoHelperObj] = useState<{
    id?: number;
    delay_time: number;
    provider?: MailTokenProvider;
  }>({ delay_time: 10 });

  // ** Custom Hooks **
  const { readDealPermission, readActivityPermission } = usePermission();
  const {
    companyGoalsGraphData,
    companyGoalsPipelineLoading,
    getDealsData,
    pipeLineGraphData,
  } = useCompanyGoalsPipelineGraphData();
  const {
    activitiesLoading,
    activeActivitiesLoading,
    getActivityStatusCount,
    statusCount,
  } = useActivityStatusChartDataGet();
  const { getEmailUndoDelayTime, getGeneralSettingLoading } =
    useGetEmailUndoDelayTime({
      setEmailUndoHelperObj,
    });
  const { getEmails, emails, emailsLoading } = useGetEmails({});

  useEffect(() => {
    if (readDealPermission) {
      getDealsData();
    }
    if (readActivityPermission) {
      getActivityStatusCount();
    }
    getEmailUndoDelayTime();
    if (mailProviders?.[0]) {
      getEmails({
        label: [CustomLabel.INBOX],
        provider: mailProviders[0],
        limit: 4,
        page: 1,
      });
    }
  }, []);

  const closeModal = () => setModal(undefined);

  return (
    <>
      {emailsLoading || getGeneralSettingLoading ? (
        <DashboardChartsSkeleton />
      ) : (
        <div className="mx-[-20px] flex flex-wrap stream__logs__next">
          <div
            className={`deal__revenue__forecast w-[calc(50%_-_136px)] max-w-full px-[20px] 4xl:w-[calc(100%_-_290px)] xl:w-full ${
              !readDealPermission ? 'ip__disabled' : ''
            } `}
          >
            <div className="inner__wrapper h-full bg-gray__BGColor rounded-[12px] p-[20px] pb-[35px]">
              <div className="header flex flex-wrap items-start mb-[30px] sm:mb-[15px]">
                <h3 className="text-[20px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_50px)] pr-[10px] sm:text-[18px]">
                  Deal Revenue Forecast
                </h3>
                <Link
                  className="text-[14px] font-biotif__Regular underline text-ipBlack__textColor duration-500 hover:text-primaryColor relative top-[3px]"
                  to={PRIVATE_NAVIGATION.deals.view}
                >
                  View all
                </Link>
              </div>
              {pipeLineGraphData?.length ? (
                <div className="mx-[-10px] flex flex-wrap items-center">
                  <div className="px-[10px] w-[215px] xl:w-[180px] sm:w-[250px] sm:mx-auto sm:mb-[15px]">
                    <DealRevenueByMonthGoalsChart
                      pipeLineGraphData={pipeLineGraphData}
                      companyGoalsPipelineLoading={companyGoalsPipelineLoading}
                    />
                  </div>
                  <div className="px-[10px] w-[calc(100%_-_215px)] companyGoals__wrapper xl:w-[calc(100%_-_180px)] sm:w-full">
                    {readDealPermission && (
                      <CompanyGoalsChart
                        companyGoalsGraphData={companyGoalsGraphData}
                        companyGoalsPipelineLoading={
                          companyGoalsPipelineLoading
                        }
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="no__recent__email rounded-[10px] py-[30px] px-[20px] flex flex-wrap justify-center h-[calc(100%_-_70px)] items-center">
                  <div className="inline-block text-center w-[300px] max-w-full">
                    <img
                      className="w-[70px] max-w-full"
                      src="/images/no__recent__emailIcon2.png"
                      alt=""
                    />
                    <p className="text-[20px] text-center text-ipBlack__textColor font-biotif__SemiBold mt-[15px]">
                      No Any Deal Revenue Available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className={`activities__revenue w-[270px] xl:w-full xl:px-[20px] xl:mt-[20px] ${
              !readActivityPermission ? 'ip__disabled' : ''
            } `}
          >
            <div className="inner__wrapper h-full bg-gray__BGColor rounded-[12px] p-[20px] pb-[20px]">
              <div className="header flex flex-wrap mb-[10px]">
                <h3 className="text-[20px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_50px)] pr-[10px] sm:text-[18px]">
                  Activities
                </h3>
                <Link
                  className="text-[14px] font-biotif__Regular underline text-ipBlack__textColor duration-500 hover:text-primaryColor relative top-[5px]"
                  to={PRIVATE_NAVIGATION.activities.view}
                >
                  View all
                </Link>
              </div>
              {statusCount.ongoing || statusCount.stop ? (
                <ActivityStatusChart
                  statusCount={statusCount}
                  activitiesLoading={activitiesLoading}
                  activeActivitiesLoading={activeActivitiesLoading}
                />
              ) : (
                <div className="no__recent__email rounded-[10px] py-[30px] px-[20px] flex flex-wrap justify-center h-[calc(100%_-_70px)] items-center">
                  <div className="inline-block text-center w-[300px] max-w-full">
                    <img
                      className="w-[70px] max-w-full"
                      src="/images/no__recent__emailIcon2.png"
                      alt=""
                    />
                    <p className="text-[20px] leading-[24px] text-center text-ipBlack__textColor font-biotif__SemiBold mt-[15px]">
                      No Activities Available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <RecentMail setModal={setModal} emails={emails} />
        </div>
      )}
      {modal === 'compose' && (
        <AddEmailComposerModal
          modalRef={modalRef}
          providerOption={mailProviders.filter(
            (item) =>
              ((item.value as string).split(',')[1] as TokenProvider) !==
              TokenProvider.All
          )}
          isOpen={modal === 'compose'}
          closeModal={closeModal}
          setModal={setModal}
          emailUndoHelperObj={emailUndoHelperObj}
          setEmailUndoHelperObj={setEmailUndoHelperObj}
        />
      )}
    </>
  );
};

export default DashboardCharts;
