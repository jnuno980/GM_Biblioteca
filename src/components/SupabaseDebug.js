import React, { useState, useEffect } from 'react';
import supabase from '../config/supabase';

const SupabaseDebug = () => {
  const [debugInfo, setDebugInfo] = useState('A carregar...');
  const [livros, setLivros] = useState([]);
  const [editoras, setEditoras] = useState([]);
  const [autores, setAutores] = useState([]);
  const [generos, setGeneros] = useState([]);

  useEffect(() => {
    testSupabaseData();
  }, []);

  const testSupabaseData = async () => {
    try {
      setDebugInfo('🔍 A testar dados do Supabase...');
      
      // Test livros
      const { data: livrosData, error: livrosError } = await supabase
        .from('livro')
        .select('*')
        .limit(5);
      
      if (livrosError) {
        setDebugInfo(`❌ Erro livros: ${livrosError.message}`);
        return;
      }
      
      setLivros(livrosData || []);
      
      // Test editoras
      const { data: editorasData, error: editorasError } = await supabase
        .from('editora')
        .select('*')
        .limit(3);
      
      if (editorasError) {
        setDebugInfo(`❌ Erro editoras: ${editorasError.message}`);
        return;
      }
      
      setEditoras(editorasData || []);
      
      // Test autores
      const { data: autoresData, error: autoresError } = await supabase
        .from('autor')
        .select('*')
        .limit(3);
      
      if (autoresError) {
        setDebugInfo(`❌ Erro autores: ${autoresError.message}`);
        return;
      }
      
      setAutores(autoresData || []);
      
      // Test géneros
      const { data: generosData, error: generosError } = await supabase
        .from('genero')
        .select('*')
        .limit(3);
      
      if (generosError) {
        setDebugInfo(`❌ Erro géneros: ${generosError.message}`);
        return;
      }
      
      setGeneros(generosData || []);
      
      setDebugInfo(`✅ Dados carregados! Livros: ${livrosData?.length || 0}, Editoras: ${editorasData?.length || 0}, Autores: ${autoresData?.length || 0}, Géneros: ${generosData?.length || 0}`);
      
    } catch (err) {
      setDebugInfo(`❌ Erro geral: ${err.message}`);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      zIndex: 10000,
      width: '400px',
      maxHeight: '80vh',
      overflowY: 'auto',
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#333'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>
        🔍 Debug Supabase Dados
      </h4>
      
      <p style={{ margin: '5px 0', color: '#6b7280' }}>
        {debugInfo}
      </p>
      
      {livros.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>📚 Livros ({livros.length}):</strong>
          {livros.map((livro, i) => (
            <div key={i} style={{ marginLeft: '10px', fontSize: '11px' }}>
              • {livro.li_titulo} (ID: {livro.li_cod})
            </div>
          ))}
        </div>
      )}
      
      {editoras.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>🏢 Editoras ({editoras.length}):</strong>
          {editoras.map((editora, i) => (
            <div key={i} style={{ marginLeft: '10px', fontSize: '11px' }}>
              • {editora.ed_nome} (ID: {editora.ed_cod})
            </div>
          ))}
        </div>
      )}
      
      {autores.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>✍️ Autores ({autores.length}):</strong>
          {autores.map((autor, i) => (
            <div key={i} style={{ marginLeft: '10px', fontSize: '11px' }}>
              • {autor.au_nome} (ID: {autor.au_cod})
            </div>
          ))}
        </div>
      )}
      
      {generos.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <strong>📖 Géneros ({generos.length}):</strong>
          {generos.map((genero, i) => (
            <div key={i} style={{ marginLeft: '10px', fontSize: '11px' }}>
              • {genero.ge_genero}
            </div>
          ))}
        </div>
      )}
      
      <button
        onClick={testSupabaseData}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '11px'
        }}
      >
        🔄 Re-testar
      </button>
    </div>
  );
};

export default SupabaseDebug;
