import React, { useCallback, useMemo } from 'react';
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

// Initial node types representing dbt-factory templates
const initialNodes = [
  { 
    id: 'source-1', 
    type: 'input', 
    position: { x: 50, y: 50 }, 
    data: { label: 'Seed: test_table_1' } 
  },
  { 
    id: 'transform-1', 
    position: { x: 250, y: 150 }, 
    data: { label: 'Template: join' } 
  },
];

const initialEdges = [{ id: 'e1-2', source: 'source-1', target: 'transform-1' }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const generateYaml = () => {
    // Logic to translate nodes/edges to dbt-factory YAML
    console.log('Generating dbt-factory config...');
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Panel position="top-right">
          <button 
            onClick={generateYaml}
            style={{ padding: '10px', cursor: 'pointer', background: '#f55', color: '#fff', border: 'none', borderRadius: '4px' }}
          >
            Export factory_config.yml
          </button>
        </Panel>
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
