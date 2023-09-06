import React, { useState } from 'react';
import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  Node,
  getBezierPath,
  useReactFlow,
} from 'reactflow';

import useEdgeClick from '../hooks/useEdgeClick';
import InsertBlockButton from '../Blocks/InsertBlockButton';
import Button from 'components/Button';
import {
  associativeArray,
  getKeysAndValuesBetweenKeys,
  getLevelType,
} from '../helper';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  setNodes,
  setEdges,
}: EdgeProps & {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
}) {
  // State For Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { getNodes } = useReactFlow();
  const nodes = getNodes();
  const seperator = id.includes('=>') ? '=>' : '->';
  const data = id.split(seperator);
  const parentNodeType = nodes.find((nodeSingle) => nodeSingle.id === data[0])
    ?.data.type;
  const childNodeType = nodes.find((nodeSingle) => nodeSingle.id === data[1])
    ?.data.type;

  // Get Between Modules
  const result = getKeysAndValuesBetweenKeys(
    associativeArray,
    parentNodeType,
    childNodeType
  );

  // Remove Organization From Top
  if (result && parentNodeType === 'PERMISSION') {
    delete result.ORGANIZATION;
  }

  // If there is no permission block add it
  if (
    result &&
    parentNodeType !== 'PERMISSION' &&
    childNodeType !== 'PERMISSION'
  ) {
    result.PERMISSION = 'PERMISSION';
  }

  const { handleEdgeClick } = useEdgeClick({
    parentNodeId: id,
    setEdges,
    setNodes,
  });

  const [edgePath, edgeCenterX, edgeCenterY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        {result && Object.keys(result).length > 0 && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${edgeCenterX}px,${edgeCenterY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <Button
              className="!text-[0px] group !bg-sdWhite__bg w-[26px] h-[26px] rounded-full !p-0 relative before:content-[''] before:absolute before:z-[3] before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:w-[2px] before:h-[12px] before:bg-primaryColorSD before:rounded-[20px] after:content-[''] after:absolute after:z-[3] after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:h-[2px] after:w-[12px] after:bg-primaryColorSD after:rounded-[20px] hover:before:bg-[#ffffff] hover:after:bg-[#ffffff]"
              onClick={() => {
                setIsDropdownOpen((prev) => !prev);
              }}
            >
              <span className="bg__wrapper absolute top-0 left-0 w-full h-full bg-primaryColorSD rounded-full opacity-20 group-hover:opacity-100" />
            </Button>
            {isDropdownOpen && (
              <div className="add__dropdown__menu absolute top-[calc(100%_-_2px)] left-[0px] pt-[5px]">
                <div className="inner__wrapper bg-ipWhite__bgColor min-w-[150px] relative rounded-[10px]">
                  <div className="">
                    {result &&
                      Object.keys(result).map((val, index) => {
                        return (
                          <InsertBlockButton
                            key={`${val}_${index}`}
                            title={val}
                            onClick={() => {
                              handleEdgeClick({
                                type: getLevelType(val),
                              });
                              setIsDropdownOpen(false);
                            }}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
