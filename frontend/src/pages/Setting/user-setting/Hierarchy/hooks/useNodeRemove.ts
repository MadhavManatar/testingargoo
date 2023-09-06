/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useReactFlow,
  getOutgoers,
  getIncomers,
  getConnectedEdges,
} from 'reactflow';

// this hook implements the logic for clicking a workflow node
// on workflow node click: create a new child node of the clicked node

export const useNodeRemove = () => {
  const {
    setNodes,
    getNodes,
    getEdges,
    getNode,
    getEdge,
    setEdges,
    deleteElements,
  } = useReactFlow();

  const removeNode = ({ id }: { id: string }) => {
    // we need the parent node object for positioning the new child node
    // const parentNode = getNode(id);
    // //    const  getEdge(id)

    // if (!parentNode) {
    //   return;
    // }

    // // create a unique id for the child node

    // // create a unique id for the placeholder (the placeholder gets added to the new child node)

    // // create a placeholder for the new child node
    // // we want to display a placeholder for all workflow nodes that do not have a child already
    // // as the newly created node will not have a child, it gets this placeholder
    // // const childPlaceholderNode = {
    // //   id: childPlaceholderId,
    // //   // we place the placeholder 150 pixels below the child node, spacing can be adjusted in the useLayout hook
    // //   position: { x: childNode.position.x, y: childNode.position.y + 150 },
    // //   type: 'placeholder',
    // //   data: { label: '+' },
    // // };
    // // if the clicked node has had any placeholders as children, we remove them because it will get a child now
    // // const existingPlaceholders = getOutgoers(parentNode, getNodes(), getEdges())
    // //   .filter((node) => node.type === 'placeholder')
    // //   .map((node) => node.id);
    // deleteElements({ edges: [{ id }], nodes: [{ id }] });

    const node = getNode(id);

    if (!node) {
      return;
    }

    const nodes = getNodes();
    const edges = getEdges();
    const [prevNode] = getIncomers(node, nodes, edges);
    const [nextNode] = getOutgoers(node, nodes, edges);

    const connectedEdges = getConnectedEdges([node], edges);

    const insertEdge = {
      id: `${prevNode?.id}=>${nextNode?.id}`,
      target: nextNode?.id,
      source: prevNode?.id,
    };

    deleteElements({ nodes: [node], edges: connectedEdges });
    // setEdges((prev) => prev.concat(insertEdge));
  };

  return { removeNode };
};

export default useNodeRemove;
