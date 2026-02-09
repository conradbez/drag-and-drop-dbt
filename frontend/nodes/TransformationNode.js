import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const nodeStyles = {
  container: {
    padding: '12px',
    borderRadius: '8px',
    background: '#2a2a2a',
    color: '#fff',
    border: '1px solid #444',
    fontSize: '11px',
    minWidth: '180px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
  },
  header: (color) => ({
    marginBottom: '10px',
    paddingBottom: '6px',
    borderBottom: `2px solid ${color}`,
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }),
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  input: {
    background: '#1a1a1a',
    border: '1px solid #555',
    color: '#fff',
    fontSize: '10px',
    padding: '4px 6px',
    borderRadius: '4px',
    outline: 'none',
  },
  select: {
    background: '#1a1a1a',
    border: '1px solid #555',
    color: '#fff',
    fontSize: '10px',
    padding: '3px 4px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  label: {
    color: '#9ca3af',
    fontSize: '9px',
    fontWeight: '600',
  }
};

export const TransformationNode = memo(({ data, id }) => {
  const isJoin = data.type === 'join';
  const color = data.color || '#60a5fa';

  const updateField = (field, value) => {
    data.onChange?.(id, field, value);
  };

  return (
    <div style={nodeStyles.container} className="nowheel">
      {/* Target Handles (Inputs) */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left" 
        style={{ top: isJoin ? '30%' : '50%', background: '#555', width: '8px', height: '8px' }} 
      />
      {isJoin && (
        <Handle 
          type="target" 
          position={Position.Left} 
          id="right" 
          style={{ top: '70%', background: '#555', width: '8px', height: '8px' }} 
        />
      )}

      <div style={nodeStyles.header(color)}>
        <span>{data.label}</span>
        <span style={{ fontSize: '8px', opacity: 0.6 }}>{data.type}</span>
      </div>

      <div style={nodeStyles.inputGroup}>
        {/* JOIN UI */}
        {data.type === 'join' && (
          <>
            <label style={nodeStyles.label}>Join Type</label>
            <select 
              style={nodeStyles.select} 
              value={data.join_type || 'INNER'} 
              onChange={(e) => updateField('join_type', e.target.value)}
            >
              <option value="INNER">INNER</option>
              <option value="LEFT">LEFT</option>
              <option value="RIGHT">RIGHT</option>
              <option value="FULL">FULL</option>
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <div>
                <label style={nodeStyles.label}>Left Key</label>
                <input 
                  style={nodeStyles.input} 
                  placeholder="id" 
                  value={data.left_key || ''} 
                  onChange={(e) => updateField('left_key', e.target.value)}
                />
              </div>
              <div>
                <label style={nodeStyles.label}>Right Key</label>
                <input 
                  style={nodeStyles.input} 
                  placeholder="id" 
                  value={data.right_key || ''} 
                  onChange={(e) => updateField('right_key', e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* FILTER UI */}
        {data.type === 'filter' && (
          <>
            <label style={nodeStyles.label}>SQL Condition</label>
            <input 
              style={nodeStyles.input} 
              placeholder="id > 100 AND status = 'active'" 
              value={data.condition || ''}
              onChange={(e) => updateField('condition', e.target.value)}
            />
          </>
        )}

        {/* AGGREGATE UI */}
        {data.type === 'aggregate' && (
          <>
            <label style={nodeStyles.label}>Group By (CSV)</label>
            <input 
              style={nodeStyles.input} 
              placeholder="region, year" 
              value={data.group_by_columns || ''}
              onChange={(e) => updateField('group_by_columns', e.target.value)}
            />
            <label style={nodeStyles.label}>Aggregations</label>
            <input 
              style={nodeStyles.input} 
              placeholder="SUM(sales) as total" 
              value={data.aggregations || ''}
              onChange={(e) => updateField('aggregations', e.target.value)}
            />
          </>
        )}

        {/* FORMULA UI */}
        {data.type === 'formula' && (
          <>
             <label style={nodeStyles.label}>New Column Name</label>
             <input 
              style={nodeStyles.input} 
              placeholder="margin_pct" 
              value={data.new_column || ''}
              onChange={(e) => updateField('new_column', e.target.value)}
            />
            <label style={nodeStyles.label}>Expression</label>
            <input 
              style={nodeStyles.input} 
              placeholder="(price - cost) / price" 
              value={data.expression || ''}
              onChange={(e) => updateField('expression', e.target.value)}
            />
          </>
        )}
      </div>

      {/* Source Handle (Output) */}
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: '#555', width: '8px', height: '8px' }} 
      />
    </div>
  );
});
