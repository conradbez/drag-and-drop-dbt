import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  getIncomers,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/**
 * Mappings between visual nodes and dbt-factory templates
 */
const TEMPLATE_MAP = {
  source: { label: 'Seed Source', color: '#4ade80' },
  join: { label: 'Join', template: 'join', color: '#60a5fa' },
  filter: { label: 'Filter', template: 'filter', color: '#f87171' },
  aggregate: { label: 'Aggregate', template: 'aggregate', color: '#fbbf24' },
};

const initialNodes = [
  { id: 'node_1', type: 'input', position: { x: 0, y: 0 }, data: { label: 'test_table_1', type: 'source' } },
  { id: 'node_2', type: 'input', position: { x: 0, y: 100 }, data: { label: 'test_table_2', type: 'source' } },
  { id: 'node_3', position: { x: 250, y: 50 }, data: { label: 'Join Tables', type: 'join', left_key: 'id', right_key: 'id', join_type: 'INNER' } },
];

const initialEdges = [
  { id: 'e1-3', source: 'node_1', target: 'node_3', targetHandle: 'left' },
  { id: 'e2-3', source: 'node_2', target: 'node_3', targetHandle: 'right' },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  /**
   * COMPILER: Translates Xyflow Graph -> dbt-factory YAML
   */
  const exportToDbtFactory = () => {
    const config = { nodes: {} };

    nodes.forEach((node) => {
      const { type, label } = node.data;
      
      // We only create dbt-factory nodes for transformations (not raw sources)
      if (type !== 'source' && TEMPLATE_MAP[type]) {
        const incomingEdges = edges.filter(e => e.target === node.id);
        const parentNodes = incomingEdges.map(e => nodes.find(n => n.id === e.source));
        
        const nodeName = label.toLowerCase().replace(/\s+/g, '_');
        
        config.nodes[nodeName] = {
          template: TEMPLATE_MAP[type].template,
          dependencies: {
            // Map inputs based on handled or order
            ...node.data, // Include keys/conditions from node data
          }
        };

        // Inject table names from parents
        if (type === 'join') {
            config.nodes[nodeName].dependencies.left_table = parentNodes[0]?.data.label;
            config.nodes[nodeName].dependencies.right_table = parentNodes[1]?.data.label;
        } else {
            config.nodes[nodeName].dependencies.source_table = parentNodes[0]?.data.label;
        }

        // Cleanup metadata
        delete config.nodes[nodeName].dependencies.type;
        delete config.nodes[nodeName].dependencies.label;
      }
    });

    console.log('--- GENERATED factory_config.yml ---');
    console.log(JSON.stringify(config, null, 2));
    alert('YAML generated in Console (Mapping logic initialized!)');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Panel position="top-right">
          <div style={{ display: 'flex', gap: '10px' }}>
             <button 
                onClick={exportToDbtFactory}
                style={{ padding: '10px 20px', cursor: 'pointer', background: '#4ade80', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px' }}
              >
                COMPILE TO DBT
              </button>
          </div>
        </Panel>
        <Background color="#333" variant="lines" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
