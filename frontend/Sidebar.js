import React from 'react';

const asideStyle = {
  width: '200px',
  background: '#222',
  borderRight: '1px solid #444',
  padding: '15px',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const toolStyle = (color) => ({
  padding: '8px',
  background: '#333',
  border: `1px solid ${color}`,
  borderRadius: '4px',
  cursor: 'grab',
  fontSize: '12px',
  textAlign: 'center'
});

export const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={asideStyle}>
      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Toolbox</div>
      <div 
        style={toolStyle('#4ade80')} 
        onDragStart={(event) => onDragStart(event, 'source')} 
        draggable
      >
        📄 Seed Source
      </div>
      <div 
        style={toolStyle('#60a5fa')} 
        onDragStart={(event) => onDragStart(event, 'join')} 
        draggable
      >
        🔗 Join
      </div>
      <div 
        style={toolStyle('#f87171')} 
        onDragStart={(event) => onDragStart(event, 'filter')} 
        draggable
      >
        🔍 Filter
      </div>
      <div 
        style={toolStyle('#fbbf24')} 
        onDragStart={(event) => onDragStart(event, 'aggregate')} 
        draggable
      >
        📊 Aggregate
      </div>
    </aside>
  );
};
