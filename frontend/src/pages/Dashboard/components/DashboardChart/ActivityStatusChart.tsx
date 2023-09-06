// ** import packages **
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

interface PropsInterface {
  statusCount: {
    ongoing: number;
    stop: number;
  };
  activitiesLoading: boolean;
  activeActivitiesLoading:boolean;
}

const ActivityStatusChart = (props: PropsInterface) => {
  const { statusCount, activitiesLoading, activeActivitiesLoading } = props;

  return (
    <>
      {activitiesLoading || activeActivitiesLoading ? (
        <>Loading</>
      ) : (
        <>
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                renderTo: 'subscribers-graph',
                type: 'pie',
                height: '100%',
                backgroundColor: 'transparent',
                spacingTop: 0,
                spacingBottom: 30,
                spacingLeft: 0,
                spacingRight: 0,
              },
              title: {
                verticalAlign: 'middle',
                floating: true,
                text: 'Activity Status',
              },
              plotOptions: {
                pie: {
                  innerSize: '90%',
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
                  name: 'Status',
                  data: [
                    {
                      y: statusCount.ongoing,
                      name: 'Ongoing',
                      color: '#1776BA',
                    },
                    {
                      y: statusCount.stop,
                      name: 'Stop',
                      color: '#E8F1F8',
                    },
                  ],
                  size: '100%',
                  innerSize: '70%',
                  showInLegend: true,
                  dataLabels: {
                    enabled: false,
                  },
                },
              ],
              legend: {
                symbolHeight: 8,
                symbolWidth: 8,
                symbolRadius: 2,
                floating: true,
                itemDistance: 50,
                align: 'center',
                verticalAlign: 'bottom',
                y: 32,
              },
              credits: {
                enabled: false,
              },
              accessibility: {
                enabled: false,
              },
            }}
          />
        </>
      )}
    </>
  );
};

export default ActivityStatusChart;
