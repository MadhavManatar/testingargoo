import { Node } from 'reactflow';

export type NodeData = {
  expanded: boolean;
  expandable: boolean;
};

export type ExpandCollapseNode = Node<NodeData>;

export enum LEVEL_TYPES {
  ACCOUNT = 'ACCOUNT',
  REGION = 'REGION',
  SUB_REGION = 'SUB_REGION',
  DEPARTMENT = 'DEPARTMENT',
  SUB_DEPARTMENT = 'SUB_DEPARTMENT',
  TEAM = 'TEAM',
  POSITION = 'POSITION',
  BRANCH = 'BRANCH',
  PERMISSION = 'PERMISSION',
}

export enum LEVEL_TITLE {
  ADD_REGION = 'Add Region',
  ADD_SUB_REGION = 'Add Sub Region',
  ADD_DEPARTMENT = 'Add Department',
  ADD_SUB_DEPARTMENT = 'Add Sub Department',
  ADD_BRANCH = 'Add Branch',
  ADD_TEAM = 'Add Team',
  ADD_POSITION = 'Add Position',
  ADD_PERMISSION = 'Add Permission',
}

export const LEVEL_TYPES_NAME_MAPPER = {
  ACCOUNT: 'Account',
  REGION: 'Region',
  SUB_REGION: 'Sub Region',
  DEPARTMENT: 'Department',
  SUB_DEPARTMENT: 'Sub Department',
  TEAM: 'Team',
  POSITION: 'Position',
  BRANCH: 'Branch',
  PERMISSION: 'Permission',
};
