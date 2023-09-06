import { HighchartsReact } from 'highcharts-react-official';
import Highcharts from 'highcharts';

interface chartType {
  LeadToDealChart: { lead: number; deal: number };
}
interface GraphDataType {
  name: string;
  color: string;
  y: number;
  id?: number;
}

const ConvertionLeadToDeal = (props: chartType) => {
  const { LeadToDealChart } = props;
  const graphData: GraphDataType[] = [];
  if (LeadToDealChart.deal > 0) {
    graphData.push({
      y: LeadToDealChart.deal,
      name: 'Deal',
      color: '#1776BA',
    });
  }
  if (LeadToDealChart.lead > 0) {
    graphData.push({
      y: LeadToDealChart.lead,
      name: 'Lead',
      color: '#F78310',
    });
  }

  return graphData.length > 0 ? (
    <div className="chart-detail-1 flex flex-wrap items-center pb-[22px]">
      <h2 className="text-[16px] font-biotif__Medium text-black__TextColor800 px-[20px] py-[17px] w-full">
        Conversions of lead to deal
      </h2>
      <div className="chart__box w-1/2">
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
              align: 'left',
              text: '',
            },
            // tooltip: {
            //   pointFormat: '<b>{point.percentage:.1f}%</b>',
            // },
            plotOptions: {
              pie: {
                innerSize: '100%',
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
                borderWidth: 0,
                name: 'Status',
                data: graphData,
                size: '100%',
                innerSize: '70%',
                showInLegend: true,
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.y}</b>',
                  distance: -20,
                  shadow: false,
                  color: 'white',
                },
              },
            ],
            legend: {
              symbolHeight: 12,
              symbolWidth: 12,
              symbolRadius: 20,
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
      </div>
      <div className="data__details__wrapper w-1/2 pb-[15px] pl-[25px]">
        <div className="data__details__row mb-[14px] last:mb-[0px]">
          <span className="label text-ipBlack__textColor block w-full text-[18px] font-biotif__Medium leading-[22px]">
            {LeadToDealChart.lead}
          </span>
          <span className="value text-black__TextColor600 block leading-[17px] w-full text-[14px] font-biotif__Regular">
            Total Active Lead
          </span>
        </div>
        <div className="data__details__row mb-[14px] last:mb-[0px]">
          <span className="label text-ipBlack__textColor block w-full text-[18px] font-biotif__Medium leading-[22px]">
            {LeadToDealChart.deal}
          </span>
          <span className="value text-black__TextColor600 block leading-[17px] w-full text-[14px] font-biotif__Regular">
            Lead Converted To Deal
          </span>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ConvertionLeadToDeal;
