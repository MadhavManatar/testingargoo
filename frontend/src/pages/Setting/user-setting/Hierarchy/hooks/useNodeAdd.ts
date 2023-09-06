/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeProps, useReactFlow, getOutgoers, Edge, Node } from 'reactflow';
import { uuid } from '../utils';
import { LEVEL_TYPES, LEVEL_TYPES_NAME_MAPPER } from '../types';
import { useAddHierarchyMutation } from 'redux/api/hierarchyApi';
import { useAddHierarchyBlockMutation } from 'redux/api/hierarchyBlockApi';

// this hook implements the logic for clicking a workflow node
// on workflow node click: create a new child node of the clicked node

type Props = {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  parentNodeId: NodeProps['id'];
};

export const useNodeAdd = (props: Props) => {
  const { parentNodeId, setEdges, setNodes } = props;

  const { getNodes, getEdges, getNode } = useReactFlow();
  // HELLO
  // const { setEdges, setNodes, getNodes, getEdges, getNode } = useReactFlow();

  // ** APIS **
  const [addHierarchy, { isLoading }] = useAddHierarchyMutation();
  const [addHierarchyBlock] = useAddHierarchyBlockMutation();

  const addNode = async ({ type }: { type: LEVEL_TYPES }) => {
    // we need the parent node object for positioning the new child node
    const parentNode = getNode(parentNodeId);

    if (!parentNode) {
      return;
    }

    // create a unique id for the child node
    const childNodeId = uuid();

    // create a unique id for the placeholder (the placeholder gets added to the new child node)
    const childPlaceholderId = uuid();

    const blockData = await addHierarchyBlock({
      data: {
        title: LEVEL_TYPES_NAME_MAPPER[type],
        type,
      },
    });

    if ('data' in blockData) {
      // create the child node
      const childNode = {
        id: childNodeId,
        // we try to place the child node close to the calculated position from the layout algorithm
        // 150 pixels below the parent node, this spacing can be adjusted in the useLayout hook
        position: { x: parentNode.position.x, y: parentNode.position.y + 150 },
        type: 'workflow',
        data: { type, id: blockData.data.id, expandable: true, expanded: true },
      };

      // create a placeholder for the new child node
      // we want to display a placeholder for all workflow nodes that do not have a child already
      // as the newly created node will not have a child, it gets this placeholder
      // const childPlaceholderNode = {
      //   id: childPlaceholderId,
      //   // we place the placeholder 150 pixels below the child node, spacing can be adjusted in the useLayout hook
      //   position: { x: childNode.position.x, y: childNode.position.y + 150 },
      //   type: 'placeholder',
      //   data: { label: '+' },
      // };

      // we need to create a connection from parent to child
      const childEdge = {
        id: `${parentNode.id}=>${childNodeId}`,
        source: parentNode.id,
        target: childNodeId,
        type: 'workflow',
      };

      // we need to create a connection from child to our placeholder
      const childPlaceholderEdge = {
        id: `${childNodeId}=>${childPlaceholderId}`,
        source: childNodeId,
        target: childPlaceholderId,
        type: 'placeholder',
      };

      // if the clicked node has had any placeholders as children, we remove them because it will get a child now
      const existingPlaceholders = getOutgoers(
        parentNode,
        getNodes(),
        getEdges()
      )
        .filter((node) => node.type === 'placeholder')
        .map((node) => node.id);

      let nodes = getNodes();
      let edges = getEdges();

      nodes = nodes
        .filter((node) => !existingPlaceholders.includes(node.id))
        .concat([childNode]);

      edges = edges
        .filter((edge) => !existingPlaceholders.includes(edge.target))
        .concat([childEdge, childPlaceholderEdge]);

      // add the new nodes (child and placeholder), filter out the existing placeholder nodes of the clicked node
      setNodes(
        nodes as any
        // .concat([childNode, childPlaceholderNode])
      );

      // add the new edges (node -> child, child -> placeholder), filter out any placeholder edges
      setEdges(edges);
      const data = await addHierarchy({
        data: {
          blocks: nodes,
          edges,
        },
      });
    }
  };

  return { addNode };
};

export default useNodeAdd;
