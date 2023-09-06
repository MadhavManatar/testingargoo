// ** import packages **
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// ** services **
import { useLazyGetPipelinesQuery } from 'redux/api/pipelineApi';
import { useLazyGetActivitiesCountQuery } from 'redux/api/activityApi';
import { useLazyGetLeadsQuery } from 'redux/api/leadApi';
import { POLLING_INTERVAL } from 'constant/dataLimit.constant';
import { IS_CACHING_ACTIVE } from 'constant';

export const useCompanyGoalsPipelineGraphData = () => {
  const { pathname } = useLocation();
  const pipeLineColorsArray = ['#F78310', '#1776BA', '#7EA838'];

  // ** states **
  const [companyGoalsGraphData, setCompanyGoalsGraphData] = useState<
    {
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
    }[]
  >();
  const [pipeLineGraphData, setPipeLineGraphData] = useState<
    {
      y: number;
      name: string;
      color: string;
    }[]
  >([]);
  const [renderPipeline, setRenderPipeline] = useState(1);
  // ** APIS **
  const [
    getPipeline,
    { isLoading: getPipelineLoading, currentData: pipeLineData },
  ] = useLazyGetPipelinesQuery();

  // ** Custom hooks **

  const [getLeads, { isLoading: getDealsLoading, currentData: leadData }] =
    useLazyGetLeadsQuery({
      pollingInterval: pathname === '/' ? POLLING_INTERVAL : 0,
    });
  useEffect(() => {
    if (leadData && leadData.rows.length) {
      const pipeline_ids: number[] = [];
      leadData?.rows?.forEach((item: { pipeline_id: number }) =>
        pipeline_ids.push(item.pipeline_id)
      );
      getPipelineDatas(pipeline_ids);
    }
  }, [leadData]);

  useEffect(() => {
    const updatedData = leadData?.rows?.map(
      (val: {
        name: string;
        deal_value: number;
        deal_stage_history: {
          isCurrentActive: boolean;
          stage_id: number;
        }[];
        pipeline_id: number;
      }) => {
        return {
          name: val.name,
          deal_value: val.deal_value,
          current_active_stage: {
            stage_id: (val?.deal_stage_history || [])?.find(
              (item) => item.isCurrentActive
            )?.stage_id,
            isCurrentActive: val.deal_stage_history.find(
              (item) => item.isCurrentActive
            )?.isCurrentActive,
          },
          pipeline: {
            pipeline_name: pipeLineData?.rows.find(
              (p_data: { id: number; pipeline_id: number }) =>
                p_data.id === val.pipeline_id
            )?.name,
            stages: pipeLineData?.rows
              .find(
                (p_data: { id: number; pipeline_id: number }) =>
                  p_data.id === val.pipeline_id
              )
              ?.stages.map((stageVal: { id: number; name: string }) => {
                return {
                  id: stageVal.id,
                  name: stageVal.name,
                  currentActiveStage: !!val.deal_stage_history.find(
                    (item) =>
                      item.stage_id === stageVal.id && item.isCurrentActive
                  ),
                };
              }),
          },
        };
      }
    );

    const pipeLineGraphDataWithDeals = pipeLineData?.rows.map(
      (
        val: {
          id: number;
          name: string;
        },
        index: number
      ) => {
        return {
          y: leadData?.rows.filter(
            (item: { pipeline_id: number }) => item.pipeline_id === val.id
          ).length,
          name: val.name,
          color: pipeLineColorsArray[index],
        };
      }
    );

    setPipeLineGraphData(pipeLineGraphDataWithDeals);
    setCompanyGoalsGraphData(updatedData);
  }, [renderPipeline]);

  const getPipelineDatas = async (pipeline_ids: number[]) => {
    await getPipeline(
      {
        params: {
          'q[id][in]': `n|${[pipeline_ids]}`,
          'include[stages]': 'id,name',
        },
      },
      true
    );
    setRenderPipeline(Math.random());
  };
  const getDealsData = async () => {
    await getLeads(
      {
        data: {
          query: {
            limit: 3,
            'q[is_deal]': true,
            'include[deal_stage_history]': 'all',
          },
        },
      },
      IS_CACHING_ACTIVE
    );
  };

  return {
    getDealsData,
    companyGoalsGraphData,
    pipeLineGraphData,
    companyGoalsPipelineLoading: getDealsLoading || getPipelineLoading,
  };
};

export const useActivityStatusChartDataGet = () => {
  const { pathname } = useLocation();

  // ** states **
  const [statusCount, setStatusCount] = useState<{
    ongoing: number;
    stop: number;
  }>({
    ongoing: 0,
    stop: 0,
  });

  // ** APIS **
  const [
    getActiveActivitiesCountAPI,
    { isLoading: activeActivitiesLoading, currentData: activeActivityData },
  ] = useLazyGetActivitiesCountQuery({
    pollingInterval: pathname === '/' ? POLLING_INTERVAL : 0,
  });
  const [
    getActivitiesCountAPI,
    { isLoading: activitiesLoading, currentData: activityData },
  ] = useLazyGetActivitiesCountQuery({
    pollingInterval: pathname === '/' ? POLLING_INTERVAL : 0,
  });
  useEffect(() => {
    setStatusCount({
      ongoing: activeActivityData?.count,
      stop: activityData?.count,
    });
  }, [activityData, activeActivityData]);

  const getActivityStatusCount = async () => {
    await Promise.all([
      await getActivitiesCountAPI(
        {
          params: { 'q[is_active]': false },
        },
        true
      ),
      await getActiveActivitiesCountAPI(
        {
          params: { 'q[is_active]': true },
        },
        true
      ),
    ]);
  };

  return {
    getActivityStatusCount,
    statusCount,
    activitiesLoading,
    activeActivitiesLoading,
  };
};

export const usePipelineWithDealsDataGet = () => {
  const pipeLineColorsArray = ['#57B2A5', '#ADD8E6', '#4679F8'];

  const [pipeLineGraphData, setPipeLineGraphData] = useState([]);

  // ** APIS **
  const [getPipeline, { isLoading: getPipelineLoading }] =
    useLazyGetPipelinesQuery();

  // const { getLeadsAPI, isLoading: getDealsLoading } = useGetLeadsAPI();
  const [getLeads, { isLoading: getDealsLoading }] = useLazyGetLeadsQuery();

  const getPipelineData = async () => {
    const { data } = await getLeads(
      {
        data: {
          query: {
            limit: 3,
            'q[is_deal]': true,
          },
        },
      },
      IS_CACHING_ACTIVE
    );

    const pipeline_ids: number[] = [];

    data?.rows?.forEach((item: { pipeline_id: number }) =>
      pipeline_ids.push(item.pipeline_id)
    );

    const { data: pipeLineData } = await getPipeline(
      {
        params: {
          'q[id][in]': `n|${[pipeline_ids]}`,
          'include[stages][q][is_deleted]': false,
          'include[stages][select]': 'id,name',
        },
      },
      true
    );

    const pipeLineGraphDataWithDeals = pipeLineData.rows.map(
      (
        val: {
          id: number;
          name: string;
        },
        index: number
      ) => {
        return {
          y: data.rows.filter(
            (item: { pipeline_id: number }) => item.pipeline_id === val.id
          ).length,
          name: val.name,
          color: pipeLineColorsArray[index],
        };
      }
    );

    setPipeLineGraphData(pipeLineGraphDataWithDeals);
  };

  return {
    getPipelineData,
    isPipelineWithDealsLoading: getDealsLoading || getPipelineLoading,
    pipeLineGraphData,
  };
};
