import React from 'react';

const asideStyle = {
  width: '260px',
  background: '#18181b',
  borderRight: '1px solid #27272a',
  padding: '24px',
  color: '#f4f4f5',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  fontFamily: 'Inter, system-ui, sans-serif'
};

const toolStyle = (color) => ({
  padding: '12px 16px',
  background: '#27272a',
  borderLeft: `4px solid ${color}`,
  borderRadius: '8px',
  cursor: 'grab',
  fontSize: '13px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  userSelect: 'none',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  ':hover': {
    background: '#3f3f46',
  }
});

const sectionTitle = {
  fontSize: '11px',
  textTransform: 'uppercase',
  color: '#71717a',
  letterSpacing: '0.1em',
  fontWeight: '700',
  marginBottom: '4px'
};

const iconStyle = {
  fontSize: '16px',
};

const ToolItem = ({ type, label, color, icon }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      style={toolStyle(color)} 
      onDragStart={onDragStart} 
      draggable
    >
      <span>{label}</span>
      <span style={iconStyle}>{icon}</span>
    </div>
  );
};

export const Sidebar = () => {
  return (
    <aside style={asideStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{ background: '#4ade80', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🦞</div>
        <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>
          DBT Factory
        </div>
      </div>
      
      <div>
        <div style={sectionTitle}>Input Data</div>
        <ToolItem type="source" label="Seed Source" color="#4ade80" icon="📄" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={sectionTitle}>Transformations</div>
        <ToolItem type="join" label="Join" color="#60a5fa" icon="🔗" />
        <ToolItem type="filter" label="Filter" color="#f87171" icon="🔍" />
        <ToolItem type="aggregate" label="Aggregate" color="#fbbf24" icon="📊" />
        <ToolItem type="formula" label="Formula" color="#a78bfa" icon="🧮" />
        <ToolItem type="sort" label="Sort" color="#2dd4bf" icon="🔃" />
      </div>

      <div style={{ marginTop: 'auto', padding: '16px', background: '#27272a', borderRadius: '12px', border: '1px dashed #3f3f46' }}>
        <p style={{ fontSize: '11px', color: '#a1a1aa', margin: 0, lineHeight: '1.5', textAlign: 'center' }}>
          Drag components onto the canvas to build your pipeline.
        </p>
      </div>
    </aside>
  );
};
