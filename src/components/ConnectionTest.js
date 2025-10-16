import React, { useState, useEffect } from 'react';
import supabase from '../config/supabase';

const ConnectionTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    // Test 1: Environment variables
    addResult('1. Variáveis de Ambiente', 'testing', 'Verificando...');
    const url = process.env.REACT_APP_SUPABASE_URL;
    const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
    const serviceKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;
    
    addResult('1. Variáveis de Ambiente', 'info', `URL: ${url ? '✅' : '❌'} | Key: ${key ? '✅' : '❌'} | Service: ${serviceKey ? '✅' : '❌'}`);
    
    // Test 2: Basic connection
    addResult('2. Conexão Básica', 'testing', 'Testando conexão...');
    try {
      const { data, error } = await supabase.from('genero').select('*').limit(1);
      if (error) {
        addResult('2. Conexão Básica', 'error', `Erro: ${error.message} (Código: ${error.code})`);
      } else {
        addResult('2. Conexão Básica', 'success', `Conexão OK! Encontrados ${data?.length || 0} registos`);
      }
    } catch (err) {
      addResult('2. Conexão Básica', 'error', `Erro de rede: ${err.message}`);
    }

    // Test 3: Test different tables
    addResult('3. Teste de Tabelas', 'testing', 'Testando diferentes tabelas...');
    const tables = ['genero', 'autor', 'livro', 'utente'];
    let workingTables = 0;
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          addResult('3. Teste de Tabelas', 'error', `Tabela ${table}: ${error.message}`);
        } else {
          workingTables++;
          addResult('3. Teste de Tabelas', 'success', `Tabela ${table}: OK (${data?.length || 0} registos)`);
        }
      } catch (err) {
        addResult('3. Teste de Tabelas', 'error', `Tabela ${table}: ${err.message}`);
      }
    }
    
    addResult('3. Teste de Tabelas', 'info', `Resultado: ${workingTables}/${tables.length} tabelas funcionando`);

    // Test 4: Direct Supabase API test
    addResult('4. Teste API Direta', 'testing', 'Testando API do Supabase...');
    try {
      const response = await fetch(`${url}/rest/v1/genero?select=*&limit=1`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult('4. Teste API Direta', 'success', `API OK! Encontrados ${data?.length || 0} registos`);
      } else {
        addResult('4. Teste API Direta', 'error', `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      addResult('4. Teste API Direta', 'error', `Erro: ${err.message}`);
    }

    // Test 5: Test with service role
    if (serviceKey) {
      addResult('5. Service Role', 'testing', 'Testando com service role...');
      try {
        const { supabaseAdmin } = await import('../config/supabase');
        const { data, error } = await supabaseAdmin.from('genero').select('ge_genero').limit(1);
        if (error) {
          addResult('5. Service Role', 'error', `Erro: ${error.message}`);
        } else {
          addResult('5. Service Role', 'success', 'Service role funcionando');
        }
      } catch (err) {
        addResult('5. Service Role', 'error', `Erro: ${err.message}`);
      }
    } else {
      addResult('5. Service Role', 'warning', 'Service role não configurado');
    }

    setIsLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      border: '2px solid #007bff',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto',
      zIndex: 10000,
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#007bff' }}>🔧 Teste de Conexão Supabase</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={runTests}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            background: isLoading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '🔄 Testando...' : '🔄 Testar Novamente'}
        </button>
      </div>

      <div style={{ maxHeight: '400px', overflow: 'auto' }}>
        {testResults.map((result, index) => (
          <div key={index} style={{
            marginBottom: '8px',
            padding: '8px',
            borderRadius: '6px',
            background: result.status === 'success' ? '#d4edda' : 
                       result.status === 'error' ? '#f8d7da' : 
                       result.status === 'warning' ? '#fff3cd' : '#e2e3e5',
            border: `1px solid ${result.status === 'success' ? '#c3e6cb' : 
                                result.status === 'error' ? '#f5c6cb' : 
                                result.status === 'warning' ? '#ffeaa7' : '#d6d8db'}`
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {result.status === 'success' ? '✅' : 
               result.status === 'error' ? '❌' : 
               result.status === 'warning' ? '⚠️' : '🔄'} {result.test}
            </div>
            <div style={{ fontSize: '14px', color: '#495057' }}>
              {result.message}
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
              {result.timestamp}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#6c757d' }}>
        💡 Se todos os testes falharem, verifica as variáveis de ambiente no Vercel
      </div>
    </div>
  );
};

export default ConnectionTest;
