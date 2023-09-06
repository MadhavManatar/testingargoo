import {
  DateFilterModel,
  NumberFilterModel,
  TextFilterModel,
} from 'ag-grid-community';
import { startOfDay, endOfDay } from 'date-fns';
// import { format } from 'date-fns-tz';

export const getType = (value: string) => {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return false;
};

export const generateExtraQueryKey = (key: string, item: TextFilterModel) => {
  switch (item.type) {
    case 'notEqual':
      return `[not]${key}`;
    case 'notContains':
      return `[not]${key}`;
    case 'contains':
    case 'equals':
    case 'startsWith':
    case 'endsWith':
    default:
      return key;
  }
};

export const generateTextFilterKey = (key: string, item: TextFilterModel) => {
  switch (item.type) {
    case 'notEqual':
      return { [`${key}[ne]`]: item.filter };
    case 'notContains':
      return { [`${key}[notILike]`]: item.filter };
    case 'contains':
      return { [`${key}[iLike]`]: item.filter };
    case 'equals':
      return { [`${key}[eq]`]: item.filter };
    case 'startsWith':
    case 'endsWith':
    default:
      return { [`${key}[${item.type}]`]: item.filter };
  }
};

export const generateNumberFilterKey = (
  key: string,
  item: NumberFilterModel
) => {
  switch (item.type) {
    case 'notEqual':
      return { [`${key}[ne]`]: item.filter };
    case 'lessThan':
      return { [`${key}[lt]`]: item.filter };
    case 'lessThanOrEqual':
      return { [`${key}[lte]`]: item.filter };
    case 'greaterThan':
      return { [`${key}[gt]`]: item.filter };
    case 'greaterThanOrEqual':
      return { [`${key}[gte]`]: item.filter };
    case 'inRange':
      return {
        [`${key}[gte]`]: item.filter,
        [`${key}[lte]`]: item.filterTo,
      };
    case 'equals':
      return { [`${key}[eq]`]: item.filter };
    default:
      return { [`${key}[${item.type}]`]: item.filter };
  }
};

export const generateDateFilterKey = (key: string, item: DateFilterModel) => {
  const formatDate = (date: string | null) =>
    date && startOfDay(new Date(date)).toISOString();
  const formatDateEnd = (date: string | null) =>
    date && endOfDay(new Date(date)).toISOString();
  switch (item.type) {
    case 'notEqual':
      return {
        [`[or][0]${key}[lte]`]: formatDate(item.dateFrom),
        [`[or][1]${key}[gte]`]: formatDateEnd(item.dateFrom),
      };
    case 'equals':
      return {
        [`${key}[gte]`]: formatDate(item.dateFrom),
        [`${key}[lte]`]: formatDateEnd(item.dateFrom),
      };
    case 'lessThan':
      return {
        [`${key}[lt]`]: formatDate(item.dateFrom),
      };
    case 'greaterThan':
      return {
        [`${key}[gt]`]: formatDate(item.dateFrom),
      };
    case 'inRange':
      return {
        [`${key}[gte]`]: formatDate(item.dateFrom),
        [`${key}[lte]`]: item.dateTo,
      };
    default:
      return {
        [`${key}[${item.type}]`]: formatDate(item.dateFrom),
      };
  }
};

export const generateFilterQuery = (
  colName: string,
  colData: TextFilterModel | NumberFilterModel | DateFilterModel
) => {
  let currentFilterType = {};

  switch (colData.filterType) {
    case 'number': {
      currentFilterType = generateNumberFilterKey(colName, colData);
      break;
    }
    case 'date': {
      currentFilterType = generateDateFilterKey(colName, colData);
      break;
    }
    case 'text':
      currentFilterType = generateTextFilterKey(colName, colData);
      break;
    default:
      break;
  }

  return Object.entries(currentFilterType).reduce((prev, [key, val]) => {
    return { ...prev, [key]: val };
  }, {});
};

export const generateFilterParams = (
  colName: string,
  colData: any,
  parentOperatorIndex: number
): {
  filterQueryParams: { [key: string]: string | boolean };
  operatorIndex: number;
} => {
  const filters = [];
  if (!colData.operator) {
    filters.push({ colName, colData });
  } else {
    const { condition1, condition2 } = colData;
    [condition1, condition2].forEach((item) => {
      filters.push({ colName, colData: item });
    });
  }
  const filterQueryParams: { [key: string]: string | boolean } = {};
  let customQuery = 'q';
  if (colName === 'emails' || colName === 'phones') {
    customQuery = 'qjson';
  }
  filters.forEach((f) => {
    let tempColName;
    const [mainQuery, extraQuery] = f.colName.split(',');
    tempColName = mainQuery;

    // Extra query Logic
    let [extraQueryKey, extraQueryValue] = ['', ''];
    if (extraQuery) {
      [extraQueryKey, extraQueryValue] = extraQuery.split('=');
    }

    if (extraQueryKey) {
      extraQueryKey = generateExtraQueryKey(extraQueryKey, f.colData);
    }

    tempColName = `[${tempColName}]`;
    if (tempColName.includes('.')) {
      filterQueryParams.subQuery = false;
    }

    const filterQuery: { [key: string]: string } = generateFilterQuery(
      tempColName,
      f.colData
    );

    Object.keys(filterQuery).forEach((item) => {
      if (colData.operator) {
        const operator = colData.operator.toLowerCase();

        const query = `${customQuery}[${operator}][${parentOperatorIndex}]${item}`;

        if (extraQueryKey) {
          extraQueryKey = `${customQuery}[${operator}][${parentOperatorIndex}]${extraQueryKey}`;
        }

        filterQueryParams[query] = filterQuery[item];
        parentOperatorIndex++;
      } else {
        if (extraQueryKey) {
          extraQueryKey = `${customQuery}${extraQueryKey}`;
        }

        filterQueryParams[`${customQuery}${item}`] = filterQuery[item];
      }
      // Append Extra Query
      if (extraQueryKey) {
        filterQueryParams[extraQueryKey] = extraQueryValue
          ? getType(extraQueryValue)
          : filterQuery[item];
      }
    });
  });
  return { filterQueryParams, operatorIndex: parentOperatorIndex };
};
