import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const nodeStyles = {
  container: {
    padding: '12px',
    borderRadius: '10px',
    background: '#252525',
    color: '#e5e7eb',
    border: '1px solid #3f3f46',
    fontSize: '11px',
    minWidth: '200px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  header: (color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: `2px solid ${color}`,
  }),
  title: {
    fontWeight: '700',
    fontSize: '12px',
    color: '#fff',
  },
  badge: {
    fontSize: '9px',
    padding: '2px 6px',
    borderRadius: '4px',
    background: '#3f3f46',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  label: {
    fontSize: '10px',
    color: '#9ca3af',
    fontWeight: '500',
  },
  input: {
    background: '#18181b',
    border: '1px solid #3f3f46',
    color: '#fff',
    fontSize: '11px',
    padding: '5px 8px',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    background: '#18181b',
    border: '1px solid #3f3f46',
    color: '#fff',
    fontSize: '11px',
    padding: '5px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    outline: 'none',
  }
};

export const TransformationNode = memo(({ data, id }) => {
  const isJoin = data.type === 'join';
  const color = data.color || '#60a5fa';

  const onFieldChange = (field, val) => {
    data.onChange?.(id, field, val);
  };

  return (
    <div style={nodeStyles.container} className="nodrag">
      {/* Input Handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left" 
        style={{ top: isJoin ? '30%' : '50%', background: '#71717a', width: '8px', height: '8px' }} 
      />
      {isJoin && (
        <Handle 
          type="target" 
          position={Position.Left} 
          id="right" 
          style={{ top: '70%', background: '#71717a', width: '8px', height: '8px' }} 
        />
      )}

      <div style={nodeStyles.header(color)}>
        <span style={nodeStyles.title}>{data.label}</span>
        <span style={nodeStyles.badge}>{data.type}</span>
      </div>

      <div style={nodeStyles.inputGroup}>
        {/* Node Name/Label Edit */}
        <div style={nodeStyles.field}>
          <label style={nodeStyles.label}>Node Name</label>
          <input 
            style={nodeStyles.input} 
            value={data.label} 
            onChange={(e) => onFieldChange('label', e.target.value)} 
          />
        </div>

        {/* JOIN UI */}
        {data.type === 'join' && (
          <>
            <div style={nodeStyles.field}>
              <label style={nodeStyles.label}>Join Type</label>
              <select 
                style={nodeStyles.select} 
                value={data.join_type || 'INNER'} 
                onChange={(e) => onFieldChange('join_type', e.target.value)}
              >
                <option value="INNER">Inner Join</option>
                <option value="LEFT">Left Join</option>
                <option value="RIGHT">Right Join</option>
                <option value="FULL">Full Outer Join</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={nodeStyles.field}>
                <label style={nodeStyles.label}>Left Key</label>
                <input 
                  style={nodeStyles.input} 
                  placeholder="id" 
                  value={data.left_key || ''} 
                  onChange={(e) => onFieldChange('left_key', e.target.value)}
                />
              </div>
              <div style={nodeStyles.field}>
                <label style={nodeStyles.label}>Right Key</label>
                <input 
                  style={nodeStyles.input} 
                  placeholder="id" 
                  value={data.right_key || ''} 
                  onChange={(e) => onFieldChange('right_key', e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {/* FILTER UI */}
        {data.type === 'filter' && (
          <div style={nodeStyles.field}>
            <label style={nodeStyles.label}>SQL Condition</label>
            <input 
              style={nodeStyles.input} 
              placeholder="id > 100" 
              value={data.condition || ''}
              onChange={(e) => onFieldChange('condition', e.target.value)}
            />
          </div>
        )}

        {/* AGGREGATE UI */}
        {data.type === 'aggregate' && (
          <>
            <div style={nodeStyles.field}>
              <label style={nodeStyles.label}>Group By</label>
              <input 
                style={nodeStyles.input} 
                placeholder="category, region" 
                value={data.group_by_columns || ''}
                onChange={(e) => onFieldChange('group_by_columns', e.target.value)}
              />
            </div>
            <div style={nodeStyles.field}>
              <label style={nodeStyles.label}>Aggregations</label>
              <input 
                style={nodeStyles.input} 
                placeholder="sum(sales) as total" 
                value={data.aggregations || ''}
                onChange={(e) => onFieldChange('aggregations', e.target.value)}
              />
            </div>
          </>
        )}

        {/* FORMULA UI */}
        {data.type === 'formula' && (
          <>
            <div style={nodeStyles.field}>
              <label style={nodeStyles.label}>Output Field</label>
              <input 
                style={nodeStyles.input} 
                placeholder="new_column" 
                value={data.new_column || ''}
                onChange={(e) => onFieldChange('new_column', e.target.value)}
              />
            </div>
            <div style={nodeStyles.field}>
              <label style={nodeStyles.label}>Expression</label>
              <input 
                style={nodeStyles.input} 
                placeholder="col_a + col_b" 
                value={data.expression || ''}
                onChange={(e) => onFieldChange('expression', e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {/* Output Handle */}
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: '#71717a', width: '8px', height: '8px' }} 
      />
    </div>
  );
});
