import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Sidebar } from './Sidebar';
import { TransformationNode } from './nodes/TransformationNode';

const nodeTypes = {
  transformation: TransformationNode,
};

const initialNodes = [
  { 
    id: 'node_0', 
    type: 'input', 
    position: { x: 50, y: 50 }, 
    data: { label: 'test_table_1', type: 'source' },
    style: { background: '#4ade80', color: '#000', fontWeight: 'bold', borderRadius: '8px' }
  },
];

const initialEdges = [];

let id = 1;
const getId = () => `node_${id++}`;

function Flow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

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
          label: `${type.charAt(0).toUpperCase() + type.slice(1)}`, 
          type: type,
          onChange: (nodeId, key, value) => {
            setNodes((nds) => nds.map((node) => {
              if (node.id === nodeId) {
                return { ...node, data: { ...node.data, [key]: value } };
              }
              return node;
            }));
          }
        },
        // Apply default styles for input nodes
        ...(type === 'source' ? { style: { background: '#4ade80', color: '#000', fontWeight: 'bold', borderRadius: '8px' } } : {})
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
        
        // Use node label or type as key
        const nodeKey = (node.data.label || node.id).toLowerCase().replace(/\s+/g, '_');
        
        const dependencies = { ...node.data };
        
        // Resolve parent references
        if (node.data.type === 'join') {
          const leftEdge = incomingEdges.find(e => e.targetHandle === 'left');
          const rightEdge = incomingEdges.find(e => e.targetHandle === 'right');
          dependencies.left_table = nodes.find(n => n.id === leftEdge?.source)?.data.label || 'missing';
          dependencies.right_table = nodes.find(n => n.id === rightEdge?.source)?.data.label || 'missing';
        } else if (parentNodes.length > 0) {
          dependencies.source_table = parentNodes[0].data.label;
        }

        // Cleanup internal state
        delete dependencies.onChange;
        delete dependencies.type;
        delete dependencies.label;

        config.nodes[nodeKey] = {
          template: node.data.type,
          dependencies
        };
      }
    });

    const yamlOutput = JSON.stringify(config, null, 2); // Simulating YAML as JSON for now
    console.log('--- factory_config.yml ---');
    console.log(yamlOutput);
    alert('YAML generated in console! Check browser developer tools.');
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#121212' }}>
      <Sidebar />
      <div style={{ flexGrow: 1, height: '100%' }} ref={reactFlowWrapper}>
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
            <button 
              onClick={exportToDbtFactory} 
              style={{ 
                padding: '12px 24px', 
                background: '#4ade80', 
                color: '#000',
                fontWeight: '800',
                border: 'none',
                borderRadius: '6px', 
                cursor: 'pointer',
                boxShadow: '0 4px 14px 0 rgba(74, 222, 128, 0.39)'
              }}
            >
              GENERATE CONFIG
            </button>
          </Panel>
          <Background color="#333" gap={20} />
          <Controls />
          <MiniMap style={{ background: '#222' }} nodeColor={(n) => n.style?.background || '#555'} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
