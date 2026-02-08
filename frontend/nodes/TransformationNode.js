import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const nodeStyles = {
  container: {
    padding: '10px',
    borderRadius: '8px',
    background: '#2a2a2a',
    color: '#fff',
    border: '1px solid #444',
    fontSize: '11px',
    minWidth: '150px',
  },
  header: (color) => ({
    marginBottom: '8px',
    paddingBottom: '4px',
    borderBottom: `2px solid ${color}`,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '4px',
  },
  input: {
    background: '#1a1a1a',
    border: '1px solid #555',
    color: '#fff',
    fontSize: '10px',
    padding: '2px 4px',
    borderRadius: '2px',
  },
  label: {
    color: '#aaa',
    fontSize: '9px',
  }
};

export const TransformationNode = memo(({ data, id }) => {
  const isJoin = data.type === 'join';
  const color = data.color || '#60a5fa';

  return (
    <div style={nodeStyles.container}>
      {/* Inputs (Left side for Join) */}
      <Handle type="target" position={Position.Left} id="left" style={{ top: isJoin ? '30%' : '50%' }} />
      {isJoin && <Handle type="target" position={Position.Left} id="right" style={{ top: '70%' }} />}

      <div style={nodeStyles.header(color)}>
        <span>{data.label}</span>
        <span style={{ fontSize: '8px', opacity: 0.5 }}>{data.type.toUpperCase()}</span>
      </div>

      <div style={nodeStyles.inputGroup}>
        {data.type === 'join' && (
          <>
            <label style={nodeStyles.label}>Left Key</label>
            <input 
              style={nodeStyles.input} 
              defaultValue={data.left_key} 
              onChange={(evt) => data.onChange?.(id, 'left_key', evt.target.value)}
            />
            <label style={nodeStyles.label}>Right Key</label>
            <input 
              style={nodeStyles.input} 
              defaultValue={data.right_key} 
              onChange={(evt) => data.onChange?.(id, 'right_key', evt.target.value)}
            />
          </>
        )}

        {data.type === 'filter' && (
          <>
            <label style={nodeStyles.label}>Where Clause</label>
            <input 
              style={nodeStyles.input} 
              placeholder="id = 1" 
              defaultValue={data.condition}
              onChange={(evt) => data.onChange?.(id, 'condition', evt.target.value)}
            />
          </>
        )}

        {data.type === 'aggregate' && (
          <>
            <label style={nodeStyles.label}>Group By</label>
            <input style={nodeStyles.input} placeholder="category" />
            <label style={nodeStyles.label}>Aggregations</label>
            <input style={nodeStyles.input} placeholder="SUM(val) as total" />
          </>
        )}
      </div>

      <Handle type="source" position={Position.Right} />
    </div>
  );
});
