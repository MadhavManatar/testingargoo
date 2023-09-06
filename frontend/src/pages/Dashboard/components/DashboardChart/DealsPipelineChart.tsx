// ** import packages **
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

interface PropsInterface {
  pipeLineGraphData: {
    y: number;
    name: string;
    color: string;
  }[];
  companyGoalsPipelineLoading: boolean;
}

const DealsPipelineChart = (props: PropsInterface) => {
  const { pipeLineGraphData, companyGoalsPipelineLoading } = props;

  return (
    <>
      {companyGoalsPipelineLoading ? (
        <>Loading</>
      ) : (
        <>
          {pipeLineGraphData.length > 0 && (
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: {
                  renderTo: 'subscribers-graph',
                  type: 'pie',
                  height: '100%',
                  backgroundColor: 'transparent',
                  spacingTop: 0,
                  spacingBottom: 0,
                  spacingLeft: 0,
                  spacingRight: 0,
                },
                title: {
                  verticalAlign: 'middle',
                  floating: true,
                  text: 'Pipeline Status',
                },
                plotOptions: {
                  pie: {
                    innerSize: '100%',
                  },
                  series: {
                    states: {
                      hover: {
                        enabled: false,
                      },
                      inactive: {
                        opacity: 1,
                      },
                    },
                  },
                },
                series: [
                  {
                    borderWidth: 0,
                    name: 'Count',
                    data: pipeLineGraphData,
                    size: '100%',
                    innerSize: '70%',
                    showInLegend: false,
                    dataLabels: {
                      enabled: false,
                    },
                  },
                ],
                credits: {
                  enabled: false,
                },
                accessibility: {
                  enabled: false,
                },
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default DealsPipelineChart;
