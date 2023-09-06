import { Edge, EdgeProps, Node, useReactFlow } from 'reactflow';
import { uuid } from '../utils';
import { LEVEL_TYPES, LEVEL_TYPES_NAME_MAPPER } from '../types';
import { useAddHierarchyMutation } from 'redux/api/hierarchyApi';
import { useAddHierarchyBlockMutation } from 'redux/api/hierarchyBlockApi';

// this hook implements the logic for clicking the button on a workflow edge
// on edge click: create a node in between the two nodes that are connected by the edge

type Props = {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  parentNodeId: EdgeProps['id'];
};

const useEdgeClick = (props: Props) => {
  const { parentNodeId, setNodes, setEdges } = props;

  const { getNode, getEdge, getNodes, getEdges } = useReactFlow();

  // ** APIS **
  const [addHierarchy] = useAddHierarchyMutation();
  const [addHierarchyBlock] = useAddHierarchyBlockMutation();

  const handleEdgeClick = async ({ type }: { type: LEVEL_TYPES }) => {
    // first we retrieve the edge object to get the source and target id
    const edge = getEdge(parentNodeId);

    if (!edge) {
      return;
    }

    // we retrieve the target node to get its position
    const targetNode = getNode(edge.target);

    if (!targetNode) {
      return;
    }

    // create a unique id for newly added elements
    const insertNodeId = uuid();

    const blockData = await addHierarchyBlock({
      data: {
        title: LEVEL_TYPES_NAME_MAPPER[type],
        type,
      },
    });

    if ('data' in blockData) {
      // this is the node object that will be added in between source and target node
      const insertNode = {
        id: insertNodeId,
        // we place the node at the current position of the target (prevents jumping)
        position: { x: targetNode.position.x, y: targetNode.position.y },
        data: { type, id: blockData.data.id, expandable: true, expanded: true },
        type: 'workflow',
      };

      // new connection from source to new node
      const sourceEdge = {
        id: `${edge.source}->${insertNodeId}`,
        source: edge.source,
        target: insertNodeId,
        type: 'workflow',
      };

      // new connection from new node to target
      const targetEdge = {
        id: `${insertNodeId}->${edge.target}`,
        source: insertNodeId,
        target: edge.target,
        type: 'workflow',
      };

      let nodes = getNodes();
      let edges = getEdges();

      const targetNodeIndex = nodes.findIndex(
        (node) => node.id === edge.target
      );

      nodes = [
        ...nodes.slice(0, targetNodeIndex),
        insertNode,
        ...nodes.slice(targetNodeIndex, nodes.length),
      ];

      edges = edges
        .filter((e) => e.id !== parentNodeId)
        .concat([sourceEdge, targetEdge]);

      setNodes(
        nodes
        // .concat([childNode, childPlaceholderNode])
      );

      // add the new edges (node -> child, child -> placeholder), filter out any placeholder edges
      setEdges(edges);

      // remove the edge that was clicked as we have a new connection with a node inbetween
      // setEdges((edges) =>
      //   edges
      //     .filter((e) => e.id !== parentNodeId)
      //     .concat([sourceEdge, targetEdge])
      // );

      // insert the node between the source and target node in the react flow state
      // setNodes((nodes) => {

      //   return [
      //     ...nodes.slice(0, targetNodeIndex),
      //     insertNode,
      //     ...nodes.slice(targetNodeIndex, nodes.length),
      //   ];
      // });

      await addHierarchy({
        data: {
          blocks: nodes,
          edges,
        },
      });
    }
  };

  return { handleEdgeClick };
};

export default useEdgeClick;
