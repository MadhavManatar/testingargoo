// ** Import Packages **
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Style **
import 'reactflow/dist/style.css';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import Icon from 'components/Icon';
import Image from 'components/Image';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Service **
import { useHierarchyUsers } from '../User/hooks/useUserService';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Others **
import { generateFirstLetter, setUrlParams } from 'utils/util';
import ReactFlow, {
  Edge,
  EdgeTypes,
  Node,
  NodeProps,
  NodeTypes,
  ProOptions,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import useLayout from './hooks/useLayout';
// import nodeTypes from './NodeTypes';
import { useLazyGetHierarchyQuery } from 'redux/api/hierarchyApi';
import WorkflowNode from './NodeTypes/WorkflowNode';
import WorkflowEdge from './EdgeTypes/WorkflowEdge';
import useExpandCollapse from './hooks/useExpandCollapse';
import useAnimatedNodes from './hooks/useAnimatedNodes';

function ReactFlowPro() {
  // ** State **

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // ** Hooks **
  const { getNodes, getEdges } = useReactFlow();

  // ** APIS **
  const [setHierarchyQuery] = useLazyGetHierarchyQuery();

  // ** Custom Hooks **

  useLayout();

  useEffect(() => {
    getDefaultValue();
  }, []);

  const getDefaultValue = async () => {
    const { data } = await setHierarchyQuery({});
    if (data) {
      const { edges: aaa, blocks } = data || {};

      if (aaa && blocks) {
        const tempBlocks = blocks.map((obj: any) => ({
          ...obj,
          data: { ...obj.data, expandable: true, expanded: true },
        }));
        setNodes(tempBlocks);
        setEdges(aaa);
      }
    }
  };

  const proOptions: ProOptions = { account: 'paid-pro', hideAttribution: true };

  const fitViewOptions = {
    padding: 0.95,
  };

  const removeNode = (nodeId: string) => {
    const edges11 = getEdges();
    const nodes11 = getNodes();
    const { tempEdges, tempNodes } = removeNodeRecursive(
      edges11,
      nodes11,
      nodeId
    );

    setEdges(tempEdges);
    setNodes(tempNodes);
  };

  const removeNodeRecursive = (
    edges2: Edge<any>[],
    nodes2: Node<any>[],
    removableId: string
  ) => {
    let tempNodes = nodes2.filter((obj) => obj.id !== removableId);

    let tempEdges = [...edges2];
    const currentChildren = edges2.filter(
      (obj) => obj.source === removableId && obj.type === 'workflow'
    );

    tempEdges = tempEdges.filter(
      (obj) => !(obj.source === removableId || obj.target === removableId)
    );

    currentChildren.forEach((chid) => {
      const result = removeNodeRecursive(tempEdges, tempNodes, chid.target);
      tempEdges = result.tempEdges;
      tempNodes = result.tempNodes;
    });

    return { tempNodes, tempEdges };
  };

  const onNodeClick = (id: NodeProps['id']) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            data: { ...n.data, expanded: !n.data.expanded },
          };
        }

        return n;
      })
    );
  };

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      // placeholder: PlaceholderNode,
      workflow: (props) => {
        return (
          <WorkflowNode
            {...props}
            onNodeClick={onNodeClick}
            removeNode={removeNode}
            setNodes={setNodes}
            setEdges={setEdges}
          />
        );
      },
    }),
    []
  );
  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      // placeholder: PlaceholderNode,
      workflow: (props) => {
        return (
          <WorkflowEdge {...props} setNodes={setNodes} setEdges={setEdges} />
        );
      },
    }),
    []
  );

  const { nodes: visibleNodes, edges: visibleEdges } = useExpandCollapse(
    nodes,
    edges
  );

  const { nodes: animatedNodes } = useAnimatedNodes(visibleNodes, {});

  return (
    <>
      <div style={{ height: 800 }}>
        {animatedNodes?.length > 0 && (
          <ReactFlow
            // key={renderHierarchy}
            // defaultNodes={defaultNodes}
            // defaultEdges={defaultEdges}
            nodes={animatedNodes}
            autoFocus={false}
            edges={visibleEdges}
            proOptions={proOptions}
            fitView
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitViewOptions={fitViewOptions}
            minZoom={0.2}
            nodesDraggable={false}
            nodesConnectable={false}
            zoomOnDoubleClick={false}
            // we are setting deleteKeyCode to null to prevent the deletion of nodes in order to keep the example simple.
            // If you want to enable deletion of nodes, you need to make sure that you only have one root node in your graph.
            deleteKeyCode={null}
          />
        )}
      </div>
    </>
  );
}

const Hierarchy = () => {
  // ** Hooks **
  const user = useSelector(getCurrentUser);
  const navigate = useNavigate();

  // ** Custom Hooks **
  const { getHierarchyUsers, hierarchyUsers } = useHierarchyUsers();

  useEffect(() => {
    if (user?.id) {
      getHierarchyUsers(user.id);
    }
  }, [user?.id]);

  return (
    <>
      <Breadcrumbs path={BREAD_CRUMB.hierarchy} />

      <ReactFlowProvider>
        <ReactFlowPro />
      </ReactFlowProvider>

      <div className="hierarchy__wrapper md:mt-[15px] sm:mt-0 hidden">
        {hierarchyUsers.map((value, index1) => (
          <div
            className="flex flex-wrap items-start justify-center"
            key={index1}
          >
            {value
              .filter((obj) => obj.active)
              .map((obj, index2) => (
                <div
                  onClick={() => getHierarchyUsers(obj.id, index1)}
                  className={`hierarchy__box ${
                    index1 === 0 ? 'main__Hbox' : 'child__Hbox'
                  }  ${obj.preview ? 'active' : ''}`}
                  key={index2}
                >
                  <div className="inner__wrapper">
                    <div className="inner__flex__wrapper">
                      <div className="image__wrapper">
                        {obj.profile_image ? (
                          <Image
                            first_name={obj.first_name || ''}
                            last_name={obj.last_name || ''}
                            imgPath={obj.profile_image || ''}
                            serverPath
                          />
                        ) : (
                          <div className="noImg__ip__img">
                            {generateFirstLetter(obj.first_name)}
                            {generateFirstLetter(obj.last_name)}
                          </div>
                        )}
                      </div>
                      <div className="right__details">
                        <h3 className="user__name">{`${obj.first_name} ${obj.last_name}`}</h3>
                        <p className="user__designation">{obj.profile_name}</p>
                      </div>
                    </div>
                    <div className="contact__details">
                      <a
                        className="flex items-center mb-[7px]"
                        href={`zoomphonecall:${obj.phone}?callerid=devtest user`}
                      >
                        <Icon
                          iconType="phoneFilled"
                          className="highlighted !w-[30px] !h-[30px] !rounded-[7px] !p-[6px] mr-[7px]"
                        />
                        <span className="value inline-block text-black text-[14px] font-biotif__Regular">
                          {obj.phone ? (
                            <ClickableMobile number={obj.phone} />
                          ) : (
                            '-'
                          )}
                        </span>
                      </a>
                      <a
                        className="flex items-center"
                        href={`mailto:${obj.email || ''}?subject=No Reply`}
                      >
                        <Icon
                          iconType="mailFilled"
                          className="highlighted !w-[30px] !h-[30px] !rounded-[7px] !p-[6px] mr-[7px]"
                        />
                        <span className="value inline-block text-black text-[14px] font-biotif__Regular">
                          {obj.email ? <ClickableEmail mail={obj.email} /> : ''}
                        </span>
                      </a>
                    </div>
                    {obj.no_of_child ? (
                      <span
                        className="counter"
                        onClick={() => getHierarchyUsers(obj.id, index1)}
                      >
                        {obj.no_of_child}
                      </span>
                    ) : null}
                    {obj.edit && (
                      <button
                        className="edit__btn"
                        onClick={() =>
                          navigate(
                            setUrlParams(
                              PRIVATE_NAVIGATION.settings.user.edit,
                              obj.id
                            )
                          )
                        }
                      >
                        <Icon iconType="permissionEditFilled" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Hierarchy;
