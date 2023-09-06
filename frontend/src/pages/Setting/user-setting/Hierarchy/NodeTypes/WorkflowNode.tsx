import { memo } from 'react';
import { Handle, Position, NodeProps, Edge, Node } from 'reactflow';
import cx from 'classnames';
import styles from './NodeTypes.module.css';

import TopAccountBlock from '../Blocks/AccountBlock';
import RegionBlock from '../Blocks/RegionBlock';
import DepartmentBlock from '../Blocks/DepartmentBlock';
import TeamBlock from '../Blocks/TeamBlock';
import { useNodeAdd } from '../hooks/useNodeAdd';
import { LEVEL_TYPES } from '../types';
import BranchBlock from '../Blocks/BranchBlock';
import SubDepartmentBlock from '../Blocks/SubDepartmentBlock';
import SubRegionBlock from '../Blocks/SubRegionBlock';
import PermissionBlock from '../Blocks/PermissionBlock';
import PositionBlock from '../Blocks/PositionBlock';

export type BlockDataType = {
  id: number;
  type: LEVEL_TYPES;
  expanded: boolean;
  expandable: boolean;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
};
export type AddNoteDataType = {
  type: LEVEL_TYPES;
  parentNodeId: string;
};

const WorkflowNode = ({
  id,
  data,
  removeNode,
  setNodes,
  setEdges,
  onNodeClick,
}: NodeProps & {
  removeNode: (nodeId: string) => void;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodeClick: (id: NodeProps['id']) => void;
}) => {
  const { addNode } = useNodeAdd({
    parentNodeId: id,
    setEdges,
    setNodes,
  });

  return (
    <>
      <div className={cx(styles.node)} title="click to add a child node">
        {renderBlocks({ data, addNode, id, removeNode, onNodeClick })}
        <Handle
          className={styles.handle}
          type="target"
          position={Position.Top}
          isConnectable={false}
        />
        <Handle
          className={styles.handle}
          type="source"
          position={Position.Bottom}
          isConnectable={false}
        />
      </div>
    </>
  );
};

type Props = {
  addNode: ({ type, parentNodeId }: AddNoteDataType) => void;
  data: BlockDataType;
  id: string;
  removeNode: (nodeId: string) => void;
  onNodeClick: (id: NodeProps['id']) => void;
};

const renderBlocks = (props: Props) => {
  const { data, addNode, id, removeNode, onNodeClick } = props;

  switch (data.type) {
    case LEVEL_TYPES.REGION:
      return (
        <RegionBlock
          addNode={addNode}
          data={data}
          id={id}
          removeNode={removeNode}
          onNodeClick={onNodeClick}
        />
      );
    case LEVEL_TYPES.SUB_REGION:
      return (
        <SubRegionBlock
          addNode={addNode}
          data={data}
          id={id}
          onNodeClick={onNodeClick}
        />
      );
    case LEVEL_TYPES.DEPARTMENT:
      return (
        <DepartmentBlock
          addNode={addNode}
          data={data}
          id={id}
          onNodeClick={onNodeClick}
        />
      );
    case LEVEL_TYPES.SUB_DEPARTMENT:
      return (
        <SubDepartmentBlock
          addNode={addNode}
          data={data}
          id={id}
          onNodeClick={onNodeClick}
        />
      );
    case LEVEL_TYPES.TEAM:
      return (
        <TeamBlock
          addNode={addNode}
          data={data}
          id={id}
          onNodeClick={onNodeClick}
        />
      );
    case LEVEL_TYPES.BRANCH:
      return (
        <BranchBlock
          addNode={addNode}
          data={data}
          id={id}
          onNodeClick={onNodeClick}
        />
      );
    case LEVEL_TYPES.PERMISSION:
      return <PermissionBlock data={data} id={id} onNodeClick={onNodeClick} />;
    case LEVEL_TYPES.POSITION:
      return <PositionBlock data={data} id={id} />;
    default:
      return (
        <TopAccountBlock
          addNode={addNode}
          data={data}
          id={id}
          onNodeClick={onNodeClick}
        />
      );
  }
};

export default memo(WorkflowNode);
