import { BlockDataType } from '../NodeTypes/WorkflowNode';
import { LEVEL_TYPES } from '../types';

export const isExpandable = ({
  expanded,
  expandable,
}: BlockDataType): string => {
  if (!expandable) {
    return 'NOTHING_TO_EXPAND';
  }
  return expanded ? 'CLICK_TO_COLLAPSE' : 'CLICK_TO_EXPAND';
};

export const associativeArray = {
  ORGANIZATION: 'ORGANIZATION',
  REGION: 'REGION',
  BRANCH: 'BRANCH',
  DEPARTMENT: 'DEPARTMENT',
  TEAM: 'TEAM',
  POSITION: 'POSITION',
};

export function getKeysAndValuesBetweenKeys<T>(
  obj: { [key: string]: T },
  startKey: string,
  endKey: string
): { [key: string]: T } | null {
  const keys = Object.keys(obj);
  const startIndex = keys.indexOf(startKey) + 1;
  const endIndex = keys.indexOf(endKey) - 1;
  if (startIndex === -1 || endIndex === -1) {
    return null; // One or both keys were not found in the object
  }
  const result: { [key: string]: T } = {};
  for (let i = startIndex; i <= endIndex; i++) {
    const key = keys[i];
    result[key] = obj[key];
  }
  return result;
}

export const getLevelType = (type: string) => {
  switch (type) {
    case 'ACCOUNT':
      return LEVEL_TYPES.ACCOUNT;
    case 'REGION':
      return LEVEL_TYPES.REGION;
    case 'SUB_REGION':
      return LEVEL_TYPES.SUB_REGION;
    case 'DEPARTMENT':
      return LEVEL_TYPES.DEPARTMENT;
    case 'SUB_DEPARTMENT':
      return LEVEL_TYPES.SUB_DEPARTMENT;
    case 'TEAM':
      return LEVEL_TYPES.TEAM;
    case 'POSITION':
      return LEVEL_TYPES.POSITION;
    case 'BRANCH':
      return LEVEL_TYPES.BRANCH;
    case 'PERMISSION':
      return LEVEL_TYPES.PERMISSION;
    default:
      return LEVEL_TYPES.PERMISSION;
  }
};
