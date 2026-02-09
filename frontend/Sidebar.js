import React from 'react';

const asideStyle = {
  width: '240px',
  background: '#1e1e1e',
  borderRight: '1px solid #333',
  padding: '20px',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  fontFamily: 'sans-serif'
};

const toolStyle = (color) => ({
  padding: '12px',
  background: '#2a2a2a',
  borderLeft: `4px solid ${color}`,
  borderRadius: '6px',
  cursor: 'grab',
  fontSize: '13px',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'background 0.2s',
  userSelect: 'none'
});

const sectionTitle = {
  fontSize: '11px',
  textTransform: 'uppercase',
  color: '#666',
  letterSpacing: '1px',
  marginBottom: '5px',
  marginTop: '10px'
};

export const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={asideStyle}>
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#4ade80' }}>
        🦞 DBT Factory
      </div>
      
      <div style={sectionTitle}>Input</div>
      <div 
        style={toolStyle('#4ade80')} 
        onDragStart={(event) => onDragStart(event, 'source')} 
        draggable
      >
        <span>📄</span> Seed Source
      </div>

      <div style={sectionTitle}>Transformations</div>
      <div 
        style={toolStyle('#60a5fa')} 
        onDragStart={(event) => onDragStart(event, 'join')} 
        draggable
      >
        <span>🔗</span> Join
      </div>
      <div 
        style={toolStyle('#f87171')} 
        onDragStart={(event) => onDragStart(event, 'filter')} 
        draggable
      >
        <span>🔍</span> Filter
      </div>
      <div 
        style={toolStyle('#fbbf24')} 
        onDragStart={(event) => onDragStart(event, 'aggregate')} 
        draggable
      >
        <span>📊</span> Aggregate
      </div>
      <div 
        style={toolStyle('#a78bfa')} 
        onDragStart={(event) => onDragStart(event, 'formula')} 
        draggable
      >
        <span>🧮</span> Formula
      </div>
      <div 
        style={toolStyle('#2dd4bf')} 
        onDragStart={(event) => onDragStart(event, 'sort')} 
        draggable
      >
        <span>🔃</span> Sort
      </div>

      <div style={{ marginTop: 'auto', fontSize: '10px', color: '#444', textAlign: 'center' }}>
        Drag items onto the canvas
      </div>
    </aside>
  );
};
