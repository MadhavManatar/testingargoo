// ** import packages **
import { Fragment } from 'react';
// ** utils **
import { usCurrencyFormat } from 'utils/util';

interface PropsInterface {
  companyGoalsGraphData?: {
    current_active_stage: {
      isCurrentActive: boolean;
      stage_id: number;
    };
    deal_value: number;
    name: string;
    pipeline: {
      pipeline_name: string;
      stages: {
        currentActiveStage: boolean;
        id: number;
        name: string;
      }[];
    };
  }[];
  companyGoalsPipelineLoading: boolean;
}

const CompanyGoalsChart = (props: PropsInterface) => {
  const { companyGoalsGraphData, companyGoalsPipelineLoading } = props;
  // ** custom hooks **

  return (
    <>
      {companyGoalsPipelineLoading ? (
        <>Loading</>
      ) : (
        <>
          <h2 className="text-ipBlack__textColor text-[16px] font-biotif__Medium mb-[15px]">
            Company Goals
          </h2>
          {companyGoalsGraphData &&
            companyGoalsGraphData.map((item) => {
              const currentActiveStageIndex =
                item.pipeline.stages.findIndex(
                  (val) => val.currentActiveStage
                ) + 1;

              return (
                <Fragment key={window.self.crypto.randomUUID()}>
                  <div className="mb-[25px] companyGoals__box">
                    <div className="flex justify-between items-center mb-[8px]">
                      <p className="name text-[14px] leading-[18px] text-ipBlack__textColor font-biotif__Medium pr-[10px]">
                        {item.name}
                      </p>
                      <p className="value text-[14px] font-biotif__SemiBold text-ip__Orange">
                        {usCurrencyFormat(Number(item.deal_value).toString())}
                      </p>
                    </div>
                    <div className="progressBar__wrapper w-full h-[7px] rounded-[50px] relative">
                      <span className="bg__wrapper absolute top-0 left-0 w-full h-full rounded-[50px] bg-ip__Orange opacity-20" />
                      <div
                        className="valueBar h-full rounded-[50px] relative z-[3] bg-ip__Orange"
                        style={{
                          width: `${
                            (currentActiveStageIndex * 100) /
                            item.pipeline.stages.length
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </Fragment>
              );
            })}
        </>
      )}
    </>
  );
};

export default CompanyGoalsChart;
