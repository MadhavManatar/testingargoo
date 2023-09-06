// ** external packages **
import parse from 'html-react-parser';

// ** types **
import {
  HistoryDataChildType,
  HISTORY_ACTION,
  HistoryDataType,
  HistoryType,
} from './types';

// ** others **
import {
  isHistoryObjValueExist,
  printTimeLineData,
  timeLineModelNameConverter,
  timeLineNameConverter,
} from './helper';

type Props = {
  historyData: HistoryDataType;
  excludeKeys: string[];
  history: HistoryType;
};

const ActivityTimeline = (props: Props) => {
  const { historyData, excludeKeys, history } = props;

  const { model_name: modelName, action, title } = history;
  switch (action) {
    case HISTORY_ACTION.DELETE:
      return (
        <p className="flex flex-wrap text-[18px] font-biotif__Regular text-light__TextColor leading-[24px] mb-[8px] xl:text-[16px]">
          <span className="font-biotif__Medium text-ip__black__text__color mr-[7px]">
            {(title && parse(title)) ||
              parse(
                `${timeLineModelNameConverter(
                  modelName
                )} ${timeLineNameConverter(action)}`
              )}
          </span>
        </p>
      );
    case HISTORY_ACTION.CREATE:
      return (
        <div className="text-[16px] font-biotif__Regular text-black">
          <pre className="text-primaryColor font-biotif__Regular inline-block overflow-x-auto whitespace-pre-wrap break-words">{`${timeLineModelNameConverter(
            modelName
          )}`}</pre>
          <span className="overflow-x-auto whitespace-pre-wrap break-words inline-block">
            &nbsp; Created
          </span>
        </div>
      );
    case HISTORY_ACTION.COMPLETED:
    case HISTORY_ACTION.REOPENED:
    case HISTORY_ACTION.UPDATE:
      return (
        <UpdateAction historyData={historyData} excludeKeys={excludeKeys} />
      );
    default: {
      return <></>;
    }
  }
};

type UpdateActionProps = {
  historyData: HistoryDataType;
  excludeKeys: string[];
  includedKey?: string[];
};

const UpdateAction = (props: UpdateActionProps) => {
  const { historyData, excludeKeys, includedKey = [] } = props;

  return (
    <>
      {Object.keys(historyData)
        .filter((key) => {
          if (includedKey.length) {
            return includedKey.includes(key);
          }
          return !excludeKeys.includes(key);
        })
        .map((key, index) => {
          let oldHistoryObj: HistoryDataChildType = {};
          let oldHistoryObjArray: HistoryDataChildType[] = [];
          let newHistoryObj: HistoryDataChildType = {};
          let newHistoryObjArray: HistoryDataChildType[] = [];

          if (historyData[key]?.old_value instanceof Array) {
            oldHistoryObjArray = historyData[key]
              .old_value as HistoryDataChildType[];
          } else if (historyData[key]?.old_value) {
            oldHistoryObj = historyData[key].old_value as HistoryDataChildType;
          }
          if (historyData[key]?.new_value instanceof Array) {
            newHistoryObjArray = historyData[key]
              .new_value as HistoryDataChildType[];
          } else if (historyData[key]?.new_value) {
            newHistoryObj = historyData[key].new_value as HistoryDataChildType;
          }

          return (
            <div
              className="text-[16px] font-biotif__Regular text-black"
              key={index}
            >
              {historyData[key]?.displayLabel ? (
                parse(historyData[key].displayLabel?.toString() || '')
              ) : (
                <>
                  {oldHistoryObj?.value || newHistoryObj?.value ? (
                    <>
                      <pre className="text-primaryColor font-biotif__Regular inline-block overflow-x-auto whitespace-pre-wrap break-words">
                        {timeLineNameConverter(key)}&nbsp;
                      </pre>
                      <span className="overflow-x-auto whitespace-pre-wrap break-words inline-block">
                        was updated from&nbsp;
                      </span>
                      <pre className="text-primaryColor font-biotif__Regular inline-block overflow-x-auto whitespace-pre-wrap break-words">
                        {isHistoryObjValueExist(oldHistoryObj)
                          ? printTimeLineData(oldHistoryObj)
                          : 'blank value'}
                        &nbsp;
                      </pre>
                      <span className="overflow-x-auto whitespace-pre-wrap break-words inline-block">
                        to&nbsp;
                      </span>
                      <pre className="text-primaryColor font-biotif__Regular inline-block overflow-x-auto whitespace-pre-wrap break-words">
                        {isHistoryObjValueExist(newHistoryObj)
                          ? printTimeLineData(newHistoryObj)
                          : 'blank value'}
                        &nbsp;
                      </pre>
                    </>
                  ) : (
                    <>
                      <pre className="text-primaryColor font-biotif__Regular inline-block overflow-x-auto whitespace-pre-wrap break-words">
                        {timeLineNameConverter(key)}&nbsp;
                      </pre>
                      <span className="overflow-x-auto whitespace-pre-wrap break-words inline-block">
                        was updated from&nbsp;
                      </span>
                      {oldHistoryObjArray.length ? (
                        oldHistoryObjArray.map((obj, index2) => (
                          <pre
                            className="text-primaryColor font-biotif__Regular inline-block overflow-x-auto whitespace-pre-wrap break-words"
                            key={index2}
                          >
                            {isHistoryObjValueExist(obj)
                              ? printTimeLineData(obj)
                              : 'blank value'}
                            {index2 + 1 !== oldHistoryObjArray.length
                              ? ','
                              : ''}
                            &nbsp;
                          </pre>
                        ))
                      ) : (
                        <pre className="text-primaryColor font-biotif__Regular inline-block overflow-x-auto whitespace-pre-wrap break-words">
                          blank value&nbsp;
                        </pre>
                      )}
                      <pre className="inline-block">to&nbsp;</pre>
                      {newHistoryObjArray.length ? (
                        newHistoryObjArray.map((obj, index3) => (
                          <pre
                            className="text-primaryColor font-biotif__Regular inline-block overflow-x-auto whitespace-pre-wrap break-words"
                            key={index3}
                          >
                            {obj.value ? printTimeLineData(obj) : 'blank value'}
                            {index3 + 1 !== newHistoryObjArray.length
                              ? ','
                              : ''}
                            &nbsp;
                          </pre>
                        ))
                      ) : (
                        <pre className="text-primaryColor font-biotif__Regular inline-block overflow-x-auto whitespace-pre-wrap break-words">
                          blank value&nbsp;
                        </pre>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          );
        })}
    </>
  );
};

export default ActivityTimeline;
