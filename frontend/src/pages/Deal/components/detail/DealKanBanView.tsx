// ** Import Packages **
import { L10n, extend } from '@syncfusion/ej2-base';
import {
  ColumnDirective,
  ColumnsDirective,
  DragEventArgs,
  KanbanComponent,
} from '@syncfusion/ej2-react-kanban';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//  ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import DateFormat from 'components/DateFormat';
import Icon from 'components/Icon';
import AddDealLostModal from './AddDealLostModal';
import KanBanViewCard from './KanBanViewCard';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Services **

// ** Types **
import { DealDetailsType } from 'pages/Deal/types/deals.types';
import { DealKanBanType } from 'pages/Deal/types/kanbanDeal.type';
import { dealPipelineStagesResponseType } from 'pages/Setting/module-setting/Deal/Pipeline/types/deal-pipeline.types';

// ** Constant **
import { STAGE_TYPES } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Util **
import { setUrlParams, usCurrencyFormat } from 'utils/util';
import {
  useLazyGetDealsStageQuery,
  useUpdateDealStageMutation,
} from 'redux/api/dealStageHistoryApi';

L10n.load({ 'en-US': { kanban: { noCard: 'No Data Found' } } });

interface PropsTypes {
  pipeline: {
    label: string | undefined;
    value: number | undefined;
    stages: dealPipelineStagesResponseType[];
  };
  isDealsUpdate?: boolean;
  setIsDealsUpdate?: (value: boolean) => void;
}
interface ActiveStageType {
  [x: string]: boolean;
}

const DealKanBanView = (props: PropsTypes) => {
  const { pipeline, isDealsUpdate, setIsDealsUpdate } = props;
  const lostIds = (pipeline?.stages || [])
    .filter((item: { stage_type: string }) => item.stage_type === 'Lost')
    .map((val: { id: number }) => val.id);

  // ** states **
  const [dataSource, setDataSource] = useState<DealKanBanType[]>([]);
  const [activeStage, setActiveStage] = useState<ActiveStageType>({});
  const [isDealUpdate, setIsDealUpdate] = useState(false);
  const [openDealLostModal, setOpenDealLostModal] = useState<boolean>(false);
  const [currentStageId, setCurrentStageId] = useState<{
    stageId: null | number;
    dealId: null | number;
  }>({
    stageId: null,
    dealId: null,
  });

  // ** custom hooks **
  const navigate = useNavigate();
  const { updateDealPermission } = usePermission();

  const [getDealStageAPI] = useLazyGetDealsStageQuery();
  const [updateDealStageAPI] = useUpdateDealStageMutation();

  useEffect(() => {
    getCurrentActiveStage();
  }, [pipeline?.value, isDealsUpdate, isDealUpdate]);

  const getCurrentActiveStage = async () => {
    const { data, error } = await getDealStageAPI(
      {
        params: {
          limit: 100,
          'q[isCurrentActive]': true,
          'include[deal][q][pipeline_id]': pipeline?.value,
          'include[deal][required]': true,
          'include[stage]': 'id,name,stage_type',
        },
      },
      true
    );
    if (data && data?.rows && !error) {
      // here set deal & stage both data as per requirement
      const tempDataSource: DealKanBanType[] = data.rows?.map(
        ({
          deal,
          stage,
        }: {
          deal: DealDetailsType;
          stage: dealPipelineStagesResponseType;
        }) => ({
          ...deal,
          stage: stage.name,
          dealId: deal.id,
          stageId: stage.id,
          dealName: deal.name,
          stageType: stage.stage_type,
          ...stage,
        })
      );
      setDataSource(tempDataSource);
      if (setIsDealsUpdate) {
        setIsDealsUpdate(false);
      }
    }
  };

  const updateDealStage = async (args: DragEventArgs) => {
    const stageId = pipeline?.stages?.find(
      (obj) => obj.name === args.data[0].stage
    )?.id;

    if (
      !lostIds.includes(stageId || 0) &&
      args.data[0].stage &&
      args.data[0].dealId &&
      stageId &&
      args.data[0].stage !== args.data[0].name
    ) {
      const DealFormData = new FormData();
      DealFormData.append('stage_id', stageId.toString());
      DealFormData.append('is_deal', 'true');
      DealFormData.append('deal_id', args.data[0].dealId);
      const data = await updateDealStageAPI({ data: DealFormData });
      if (data) {
        await getCurrentActiveStage();
      }
    }

    if (
      lostIds.includes(stageId || 0) &&
      args.data[0].stage &&
      args.data[0].dealId &&
      stageId &&
      args.data[0].stage !== args.data[0].name
    ) {
      args.cancel = true;
      setCurrentStageId({ dealId: args.data[0].dealId, stageId });
      setOpenDealLostModal(true);
    }
  };

  const totalStageEvents = (name: string) => {
    const count = dataSource.filter((data) => data.stage === name).length;
    let totalValue = 0;
    dataSource.forEach((data) => {
      if (data.stage === name) {
        totalValue += +(data.deal_value || 0);
      }
    });
    return { count, totalValue };
  };

  const assignPermission = (dealId: number) => {
    const permissionArray: {
      label: string;
      onClick: () => void;
      Icon?: JSX.Element;
    }[] = [];

    permissionArray.push({
      label: 'View',
      Icon: <Icon className="i__Icon" iconType="permissionEditFilled" />,
      onClick: () =>
        navigate(setUrlParams(PRIVATE_NAVIGATION.deals.detailPage, dealId)),
    });

    if (updateDealPermission) {
      permissionArray.push({
        label: 'Edit',
        Icon: <Icon className="i__Icon" iconType="permissionEditFilled" />,
        onClick: () =>
          navigate(setUrlParams(PRIVATE_NAVIGATION.deals.edit, dealId)),
      });
    }
    return { permissionArray };
  };

  const kanBanViewCardTemplate = (deal: DealKanBanType) => {
    return KanBanViewCard(deal, setIsDealUpdate);
  };

  const setCardBgColorFunc = (stageType: string) => {
    if (stageType) {
      const index = STAGE_TYPES.findIndex((stage) => stage.value === stageType);
      return index > -1 ? `${STAGE_TYPES[index].color}box` : '';
    }
  };

  const closeDealLostModal = () => {
    setOpenDealLostModal(false);
  };

  const stageHeader = (name: string) => {
    const { count, totalValue } = totalStageEvents(name);
    return `   
    <div>
      <h4 class="text-[16px] text-ipBlack__textColor font-biotif__SemiBold">${name} (${count})</h4>
      <div class="forecasted__revenue text-[16px] font-biotif__Regular text-black__TextColor500"><span class="inline-block">Forecasted revenue</span> <span class="inline-block text-ipBlack__textColor">${
        usCurrencyFormat(totalValue.toString()) || 0
      }</span></div>
    </div>
  `;
  };

  return (
    <>
      <div className="kanban__control__section md:hidden">
        <KanbanComponent
          locale="en-US"
          dialogOpen={(args) => (args.cancel = true)}
          id="kanban"
          keyField="stage"
          showEmptyColumn
          dataSource={extend([], dataSource, undefined, true) as any}
          cardSettings={{
            contentField: 'stage',
            headerField: 'dealId',
            template: kanBanViewCardTemplate as unknown as string,
          }}
          dragStop={updateDealStage}
        >
          <ColumnsDirective>
            {pipeline?.stages?.map(
              (stage: dealPipelineStagesResponseType, index) => {
                return (
                  <ColumnDirective
                    showItemCount={false}
                    key={index}
                    headerText={stageHeader(stage?.name)}
                    keyField={stage?.name}
                  />
                );
              }
            )}
          </ColumnsDirective>
        </KanbanComponent>
      </div>
      <div className="kanban__mobile hidden md:block md:mt-[8px]">
        {pipeline?.stages?.map(
          ({ name }: dealPipelineStagesResponseType, index) => {
            const { count, totalValue } = totalStageEvents(name);
            return (
              <div
                className={`kanban__mobile__box ${
                  activeStage[name] ? 'active' : ''
                }`}
                key={index + name}
              >
                <div
                  className="kanban__mobile__header"
                  onClick={() => setActiveStage({ [name]: !activeStage[name] })}
                >
                  <h3 className="title">
                    {name} {`(${count})`}
                  </h3>
                  <p className="text">
                    Forecasted revenue{' '}
                    <span className="inline-block text-ipBlack__textColor">
                      {usCurrencyFormat(totalValue)}
                    </span>
                  </p>
                </div>
                <div className="kanban__mobile__body">
                  {dataSource
                    ? dataSource?.map(
                        (data: DealKanBanType, dataIndex: number) => {
                          const {
                            description,
                            dealName,
                            deal_value,
                            closing_date,
                            stage,
                            dealId,
                            stageType,
                          } = data;
                          const { permissionArray } = assignPermission(dealId);
                          if (name === stage) {
                            return (
                              <div
                                className={`kanban__mobile__details__box ${setCardBgColorFunc(
                                  stageType
                                )}`}
                                key={index + dataIndex + stage}
                              >
                                <div className="inner__box">
                                  <TableActionButton
                                    filedArray={[...permissionArray]}
                                  />
                                  <h3 className="title">{dealName}</h3>
                                  <p className="text">{description || ''}</p>
                                  <div className="valueTime">
                                    <div className="price__value">
                                      <span className="currencySign">$</span>
                                      <span className="value">
                                        {usCurrencyFormat(deal_value || '') ||
                                          0}
                                      </span>
                                    </div>
                                    {closing_date && (
                                      <div className="time">
                                        <DateFormat date={closing_date} />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return <Fragment key={index + dataIndex + stage} />;
                        }
                      )
                    : null}
                </div>
              </div>
            );
          }
        )}
      </div>
      {openDealLostModal && (
        <AddDealLostModal
          isOpen={openDealLostModal}
          closeModal={closeDealLostModal}
          id={Number(currentStageId.dealId)}
          stageId={currentStageId.stageId}
          onAdd={async () => {
            await getCurrentActiveStage();
          }}
        />
      )}
    </>
  );
};

export default DealKanBanView;
