import { HighchartsReact } from 'highcharts-react-official';
import Highcharts from 'highcharts';

interface chartType {
  wonRationChart: { totalDeal: number; winDeal: number; lostDeal: number };
}
const WonRatio = (props: chartType) => {
  const { wonRationChart } = props;

  const roundNumber = (num: number) => {
    return Math.round(num * 100 + Number.EPSILON) / 100;
  };
  const totalDealInChart = wonRationChart.winDeal + wonRationChart.lostDeal;
  const winPercentage = (wonRationChart.winDeal * 100) / totalDealInChart;
  const lostPercentage = (wonRationChart.lostDeal * 100) / totalDealInChart;

  const chartData = [];
  if (wonRationChart.winDeal > 0) {
    chartData.push({
      name: 'Won',
      y: wonRationChart.winDeal,
      color: '#27AE60',
    });
  }
  if (wonRationChart.lostDeal > 0) {
    chartData.push({
      name: 'Lost',
      y: wonRationChart.lostDeal,
      color: '#FF0000',
    });
  }

  return (
    <div className="chart-detail-1 flex flex-wrap items-center pb-[22px]">
      <h2 className="text-[16px] font-biotif__Medium text-[#2E3234] px-[20px] py-[17px] w-full">
        Won/Lost Ratio
      </h2>
      <div className="chart__box w-[70%]">
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            chart: {
              plotBackgroundColor: null,
              plotBorderWidth: 0,
              plotShadow: false,
              height: '70%',
              spacingTop: 0,
              spacingBottom: 0,
              spacingLeft: 0,
              spacingRight: 0,
            },
            title: {
              text: '',
              align: 'left',
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
            },
            accessibility: {
              point: {
                valueSuffix: '%',
              },
            },
            plotOptions: {
              pie: {
                innerSize: '100%',
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.y}</b>',
                  distance: -30,
                  shadow: false,
                  color: 'white',
                  textOutline: 'none',
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '110%',
                showInLegend: true,
                allowPointSelect: false,
                point: {
                  events: {
                    legendItemClick() {
                      return false;
                    },
                  },
                },
              },
              allowPointSelect: false,
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
                type: 'pie',
                name: 'Browser share',
                innerSize: '50%',
                data: chartData,
              },
            ],
            credits: {
              enabled: false,
            },
          }}
        />
      </div>
      <div className="data__details__wrapper w-[30%] pb-[15px] pl-[25px]">
        {wonRationChart.winDeal > 0 && (
          <div className="data__details__row mb-[10px] last:mb-[0px]">
            <span className="label block w-full text-[18px] font-biotif__Medium leading-[22px]">
              {roundNumber(winPercentage)}%
            </span>
            <span className="value block leading-[17px] w-full text-[14px] font-biotif__Regular text-black/50">
              Won Ratio
            </span>
          </div>
        )}
        {wonRationChart.lostDeal > 0 && (
          <div className="data__details__row mb-[10px] last:mb-[0px]">
            <span className="label block w-full text-[18px] font-biotif__Medium leading-[22px]">
              {roundNumber(lostPercentage)}%
            </span>
            <span className="value block leading-[17px] w-full text-[14px] font-biotif__Regular text-black/50">
              Lost Ratio
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default WonRatio;
