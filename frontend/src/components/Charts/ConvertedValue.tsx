import { HighchartsReact } from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { useEffect, useState } from 'react';
import { EntityAttributesEnum } from 'redux/api/entityAttributesApi';
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { useLazyGetLeadStatusQuery } from 'redux/api/leadStatusApi';

interface chartType {
  convertedValueChart: { [key: string]: number };
}
interface GraphDataType {
  name: string;
  color: string;
  y: number;
  id: number;
}

const ConvertedValue = (props: chartType) => {
  const { convertedValueChart } = props;

  const graphData: GraphDataType[] = [];
  const [leadStatusOpt, setLeadStatusOpt] = useState<GraphDataType[]>([]);

  // ** API **
  const [getEntityAttributes] = useLazyGetLeadStatusQuery();

  const getLeadStatusData = async () => {
    const { data, error } = await getEntityAttributes(
      {
        data: {
          query: {
            ...MODULE_PERMISSION.LEAD.read,
            'q[type]': EntityAttributesEnum.LEAD_STATUS,
          },
        },
      },
      true
    );

    if (data && !error) {
      data?.rows.forEach((statsuDetail: any) => {
        if (convertedValueChart[statsuDetail.id]) {
          graphData.push({
            name: statsuDetail.name,
            y: convertedValueChart[statsuDetail.id]
              ? convertedValueChart[statsuDetail.id]
              : 0,
            color: statsuDetail.color,
            id: statsuDetail.id,
          });
        }
      });
      setLeadStatusOpt(graphData);
    }
  };

  // Fetch all Status
  useEffect(() => {
    getLeadStatusData();
  }, []);

  return (
    leadStatusOpt && (
      <div className="chart-detail-2 flex flex-wrap items-center pb-[22px]">
        <h2 className="text-[16px] font-biotif__Medium text-black__TextColor800 px-[20px] py-[17px] w-full">
          Converted Value
        </h2>
        <div className="chart__box w-1/2">
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: 'pie',
                height: '100%',
                backgroundColor: 'transparent',
                spacingTop: 0,
                spacingBottom: 30,
                spacingLeft: 0,
                spacingRight: 0,
              },
              title: {
                text: '',
                align: 'left',
              },
              // tooltip: {
              //   pointFormat: '<b>{point.percentage:.1f}%</b>',
              // },
              accessibility: {
                point: {
                  valueSuffix: '',
                },
              },
              plotOptions: {
                pie: {
                  allowPointSelect: true,
                  showInLegend: true,
                  cursor: 'pointer',
                  borderRadius: 5,
                  dataLabels: {
                    enabled: true,
                    format: '<b>{point.y}</b>',
                    distance: -50,
                    shadow: false,
                    color: 'white',
                    textOutline: 'none',
                  },
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
                  name: 'Status',
                  colorByPoint: true,
                  data: leadStatusOpt,
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
            }}
          />
        </div>
        <div className="data__details__wrapper w-1/2 pb-[15px] pl-[25px]">
          {leadStatusOpt.map((val) => {
            return (
              <div
                className="data__details__row mb-[14px] last:mb-[0px]"
                key={val.id}
              >
                <span
                  style={{ color: `${val.color}` }}
                  className="label block w-full text-[18px] font-biotif__Medium leading-[22px]"
                >
                  {val.y}
                </span>
                <span className="value block leading-[17px] w-full text-[14px] font-biotif__Regular text-black__TextColor600">
                  {val.name} Leads
                </span>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};
export default ConvertedValue;
