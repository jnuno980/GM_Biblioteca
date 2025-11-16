import React from 'react';

const DebugInfo = () => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '15px',
      fontSize: '12px',
      fontFamily: 'monospace',
      maxWidth: '300px',
      zIndex: 9999,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>🔧 Debug Info</h4>
      <div style={{ marginBottom: '8px' }}>
        <strong>Supabase URL:</strong><br/>
        <span style={{ 
          color: supabaseUrl ? '#28a745' : '#dc3545',
          wordBreak: 'break-all'
        }}>
          {supabaseUrl ? '✅ Configurado' : '❌ Não configurado'}
        </span>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Supabase Key:</strong><br/>
        <span style={{ 
          color: supabaseKey ? '#28a745' : '#dc3545'
        }}>
          {supabaseKey ? '✅ Configurado' : '❌ Não configurado'}
        </span>
      </div>
      <div style={{ marginBottom: '8px' }}>
        <strong>Environment:</strong><br/>
        <span style={{ color: '#6c757d' }}>
          {process.env.NODE_ENV || 'development'}
        </span>
      </div>
      <div>
        <strong>Console:</strong><br/>
        <span style={{ color: '#6c757d' }}>
          Abra F12 para ver erros
        </span>
      </div>
    </div>
  );
};

export default DebugInfo;
