import React, { useState, useEffect } from 'react';
import supabase from '../config/supabase';

const SupabaseTest = () => {
  const [testResult, setTestResult] = useState('Testing...');
  const [connectionStatus, setConnectionStatus] = useState('pending');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setTestResult('Testing Supabase connection...');
      
      // Test basic connection
      const { data, error } = await supabase
        .from('_test_connection')
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          setTestResult('✅ Supabase conectado! (Tabela de teste não existe, mas conexão OK)');
          setConnectionStatus('success');
        } else {
          setTestResult(`❌ Erro Supabase: ${error.message}`);
          setConnectionStatus('error');
        }
      } else {
        setTestResult('✅ Supabase conectado com sucesso!');
        setConnectionStatus('success');
      }
    } catch (err) {
      setTestResult(`❌ Erro de conexão: ${err.message}`);
      setConnectionStatus('error');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: connectionStatus === 'success' ? '#d4edda' : '#f8d7da',
      border: `1px solid ${connectionStatus === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
      borderRadius: '8px',
      padding: '15px',
      fontSize: '14px',
      fontFamily: 'monospace',
      maxWidth: '400px',
      zIndex: 9999,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ 
        margin: '0 0 10px 0', 
        color: connectionStatus === 'success' ? '#155724' : '#721c24' 
      }}>
        🔗 Teste de Conexão Supabase
      </h4>
      <div style={{ 
        color: connectionStatus === 'success' ? '#155724' : '#721c24',
        wordBreak: 'break-word'
      }}>
        {testResult}
      </div>
      <button 
        onClick={testConnection}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        🔄 Testar Novamente
      </button>
    </div>
  );
};

export default SupabaseTest;
