import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Sidebar } from './Sidebar';
import { TransformationNode } from './nodes/TransformationNode';

const nodeTypes = {
  transformation: TransformationNode,
};

const initialNodes = [
  { id: '1', type: 'input', position: { x: 50, y: 50 }, data: { label: 'test_table_1', type: 'source' } },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

export default function App() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type: type === 'source' ? 'input' : 'transformation',
        position,
        data: { 
          label: `${type} node`, 
          type: type,
          // Shared onChange to update node data from UI
          onChange: (nodeId, key, value) => {
            setNodes((nds) => nds.map((node) => {
              if (node.id === nodeId) {
                return { ...node, data: { ...node.data, [key]: value } };
              }
              return node;
            }));
          }
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const exportToDbtFactory = () => {
    const config = { nodes: {} };
    nodes.forEach((node) => {
      if (node.type === 'transformation') {
        const incomingEdges = edges.filter(e => e.target === node.id);
        const parentNodes = incomingEdges.map(e => nodes.find(n => n.id === e.source));
        const nodeName = (node.data.label || 'transform').toLowerCase().replace(/\s+/g, '_');
        
        config.nodes[nodeName] = {
          template: node.data.type,
          dependencies: { ...node.data }
        };
        // Clean up UI-only keys
        delete config.nodes[nodeName].dependencies.onChange;
        delete config.nodes[nodeName].dependencies.type;
        delete config.nodes[nodeName].dependencies.label;
      }
    });
    console.log(JSON.stringify(config, null, 2));
    alert('Config generated in console!');
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#1a1a1a' }}>
      <Sidebar />
      <div style={{ flexGrow: 1 }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Panel position="top-right">
            <button onClick={exportToDbtFactory} style={{ padding: '10px', background: '#4ade80', borderRadius: '5px', cursor: 'pointer' }}>
              EXPORT YAML
            </button>
          </Panel>
          <Background color="#333" />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
